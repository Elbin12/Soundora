from django.db import models
from django.contrib.postgres.indexes import GinIndex

# Create your models here.

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Artists(models.Model):
    name = models.CharField(max_length=200)
    profile_pic = models.URLField(blank=True, null=True)
    genres = models.ManyToManyField(Genre, blank=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    spotify_url = models.URLField(null=True, blank=True)
    popularity = models.IntegerField(null=True, blank=True)
    followers = models.IntegerField(null=True, blank=True)
    spotify_id = models.CharField(max_length=100, unique=True)

    class Meta:
        indexes = [
            GinIndex(fields=["name"], name="artist_name_gin_idx", opclasses=["gin_trgm_ops"]),
        ]