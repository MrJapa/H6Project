from django.urls import path
from .views import PostingsListView

urlpatterns = [
    path('postings/', PostingsListView.as_view(), name='postings-list'),  # URL for the postings list view
]
