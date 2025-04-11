import os
import django
import spotipy
import itertools
import time
import multiprocessing
import requests

from django.core.management.base import BaseCommand
from spotipy.oauth2 import SpotifyClientCredentials
from django.conf import settings

MAX_SAVED = 25000
BATCH_SIZE = 50

# Setup Django for subprocesses
def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soundora.settings')
    django.setup()

def get_location_by_name(artist_name):
    url = f"https://musicbrainz.org/ws/2/artist/?query=artist:{artist_name}&fmt=json"
    headers = {"User-Agent": "SoundoraBot/1.0 elbinshiby14@gmail.com"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return None

    data = response.json()
    for artist in data.get("artists", []):
        area = artist.get("area")
        if area:
            return area.get("name")
    return None

def fetch_artists_chunk(queries_chunk):
    setup_django()
    from artists.models import Artists, Genre

    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
        client_id=settings.SPOTIFY_CLIENT_ID,
        client_secret=settings.SPOTIFY_CLIENT_SECRET
    ))

    existing_names = set(Artists.objects.values_list('name', flat=True))
    saved = 0
    seen_ids = set()

    for query in queries_chunk:
        for offset in range(0, 1000, BATCH_SIZE):
            if saved >= MAX_SAVED:
                print(f"✅ Reached {MAX_SAVED} artists for this process. Stopping.")
                return

            try:
                results = sp.search(q=query, type='artist', limit=BATCH_SIZE, offset=offset)
                new_artists = []
                new_genres = {}

                for artist in results['artists']['items']:
                    if artist['id'] in seen_ids:
                        continue
                    if artist.get('popularity', 0) < 30:
                        continue
                    if not artist.get('images'):
                        continue
                    name = artist['name'].strip()
                    if name in existing_names:
                        continue

                    seen_ids.add(artist['id'])
                    existing_names.add(name)

                    new_artists.append({
                        'name': name,
                        'profile_pic': artist['images'][0]['url'],
                        'popularity': artist.get('popularity', 0),
                        'followers': artist.get('followers', {}).get('total', 0),
                        'spotify_id': artist['id'],
                        'spotify_url': artist['external_urls']['spotify'],
                        'genres': artist['genres']
                    })

                # Save artists in bulk
                artist_objs = [
                    Artists(
                        name=art['name'],
                        profile_pic=art['profile_pic'],
                        popularity = art['popularity'],
                        followers=art['followers'],
                        spotify_id=art['spotify_id'],
                        spotify_url=art['spotify_url']
                    )
                    for art in new_artists
                ]
                Artists.objects.bulk_create(artist_objs)
                print(f"✅ Bulk created {len(artist_objs)} artists")

                # Fetch created artists for genre M2M relationship
                created_artists = Artists.objects.filter(spotify_id__in=[a['spotify_id'] for a in new_artists])
                id_map = {a.spotify_id: a for a in created_artists}

                genre_cache = {g.name: g for g in Genre.objects.all()}
                for art in new_artists:
                    artist_obj = id_map.get(art['spotify_id'])
                    if not artist_obj:
                        continue
                    for genre_name in art['genres']:
                        if genre_name not in genre_cache:
                            genre_obj, _ = Genre.objects.get_or_create(name=genre_name)
                            genre_cache[genre_name] = genre_obj
                        else:
                            genre_obj = genre_cache[genre_name]
                        artist_obj.genres.add(genre_obj)

                saved += len(artist_objs)
                time.sleep(0.2)

            except Exception as e:
                print(f"⚠️ Error on '{query}' offset {offset}: {e}")
                time.sleep(1)
                continue

class Command(BaseCommand):
    help = "Fetch and store up to 100,000 artists from Spotify using multiprocessing"

    def handle(self, *args, **kwargs):
        queries = [''.join(t) for t in itertools.product("abcdefghijklmnopqrstuvwxyz", repeat=2)]
        queries += [str(n) for n in range(10)] + ['indie', 'metal', 'hip hop', 'country', 'house']

        num_processes = 4
        chunk_size = len(queries) // num_processes
        chunks = [queries[i:i + chunk_size] for i in range(0, len(queries), chunk_size)]

        self.stdout.write(self.style.SUCCESS(f"🚀 Starting {num_processes} processes..."))
        with multiprocessing.Pool(processes=num_processes) as pool:
            pool.map(fetch_artists_chunk, chunks)

        self.stdout.write(self.style.SUCCESS("🎉 All processes completed!"))
        self.stdout.write(self.style.SUCCESS("📍 To enrich artist locations, run: `python manage.py enrich_locations`"))

