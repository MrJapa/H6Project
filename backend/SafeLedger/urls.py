from django.urls import path
from .views import PostingsListView, login_view

urlpatterns = [
    path('postings/', PostingsListView.as_view(), name='postings-list'),  # URL for the postings list view
    path('login/', login_view, name='login'),  # URL for the login view
]
