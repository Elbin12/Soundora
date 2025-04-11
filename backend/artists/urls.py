
from django.urls import path
from . import views

urlpatterns = [
    path('artists/search/',  views.SearchArtists.as_view()),
    path('artists/popular/',  views.PopularArtists.as_view()),
]
