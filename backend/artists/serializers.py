from .models import Artists, Genre
from rest_framework.serializers import BaseSerializer, ModelSerializer


class GenreSerializer(ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class ArtistSerializer(ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    class Meta:
        model = Artists
        fields = ['id', 'name', 'profile_pic', 'popularity', 'genres', 'followers']