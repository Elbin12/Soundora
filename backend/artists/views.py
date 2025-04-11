
from .models import Artists, Genre
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import ArtistSerializer
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination


# Create your views here.

class SearchArtists(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('query')
        if not query:
            return Response({'error':'Search key is required'},status=400)
        artists = Artists.objects.annotate(
            similarity=TrigramSimilarity('name', query)
        ).filter(
            Q(name__icontains=query) | Q(similarity__gt=0.3)
        ).order_by('-similarity', '-popularity')[:10]
        serilaizer = ArtistSerializer(artists, many=True)
        return Response(serilaizer.data, status=200)
    
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
    