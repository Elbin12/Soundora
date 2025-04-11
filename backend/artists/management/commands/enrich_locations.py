import time
import requests
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "soundora.settings")
django.setup()

from artists.models import Artists
from multiprocessing import Pool, cpu_count
from artists.management.commands.get_artists import get_location_by_name
from django.db import connection
from django.core.management.base import BaseCommand

def process_artist(artist_id_name):
    from artists.models import Artists 
    artist_id, name = artist_id_name
    location = get_location_by_name(name)
    if location:
        # Re-establish DB connection in subprocess
        connection.connect()
        artist = Artists.objects.get(id=artist_id)
        artist.location = location
        artist.save()
        print(f"✅ {name} => {location}")
        return 1
    time.sleep(1.2)
    return 0

class Command(BaseCommand):
    help = "Enrich artist locations from MusicBrainz using multiprocessing"

    def handle(self, *args, **kwargs):
        top_artists = Artists.objects.filter(location__isnull=True).values_list("id", "name")[:10000]

        print(f"🌀 Processing {len(top_artists)} artists using 4 processors...")

        with Pool(processes=4) as pool:
            results = pool.map(process_artist, top_artists)

        updated = sum(results)
        print(f"🎯 Enriched location for {updated} artists.")
