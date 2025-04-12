
from .models import Artists, Genre
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import ArtistSerializer, ArtistDetailsSerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination


# Create your views here.

def get_initials(name):
    return ''.join([word[0] for word in name.split() if word]).lower()


class SearchArtists(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('query')
        query_lower = query.lower()
        if not query:
            return Response({'error':'Search key is required'},status=400)
        artist_qs = Artists.objects.annotate(
            similarity=TrigramSimilarity('name', query)
        ).filter(
            Q(name__icontains=query) | Q(similarity__gt=0.2)
        ).order_by('-similarity', '-popularity')[:100]

        initials_matches = []
        for artist in Artists.objects.all():
            if get_initials(artist.name) == query_lower:
                initials_matches.append(artist)

        all_matches = list({a.id: a for a in list(artist_qs) + initials_matches}.values())

        all_matches_sorted = sorted(all_matches, key=lambda a: a.popularity, reverse=True)

        # 5. Limit to top 10
        top_10 = all_matches_sorted[:10]

        serializer = ArtistSerializer(top_10, many=True)
        return Response(serializer.data, status=200)
    
class ArtistPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class PopularArtists(ListAPIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    serializer_class = ArtistSerializer
    queryset = Artists.objects.all().order_by('-popularity', 'id')
    pagination_class = ArtistPagination
    
class Artist(RetrieveAPIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    serializer_class = ArtistDetailsSerializer
    queryset = Artists.objects.all()
    lookup_field = 'spotify_id'