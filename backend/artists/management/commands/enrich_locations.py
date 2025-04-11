from django.core.management.base import BaseCommand
import time
from artists.models import Artists  # Update to correct import
from artists.management.commands.get_artists import get_location_by_name

class Command(BaseCommand):
    help = "Enrich artist locations from MusicBrainz"

    def handle(self, *args, **kwargs):
        top_artists = Artists.objects.filter(location__isnull=True)[:10000]
        updated = 0

        for artist in top_artists:
            location = get_location_by_name(artist.name)
            if location:
                artist.location = location
                artist.save()
                updated += 1
                print(f"✅ {artist.name} => {location}")
            time.sleep(1.2)

        print(f"🎯 Enriched location for {updated} artists.")
