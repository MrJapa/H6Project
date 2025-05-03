#backend/SafeLedger/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('postings/', views.PostingsListView.as_view(), name='postings-list'),  # URL for the postings list view
    path('postings/<int:pk>/', views.PostingsDetailView.as_view(), name='postings-detail'),  # URL for the postings detail view
    path('login/', views.login_view, name='login'),  # URL for the login view
    path('logout/', views.logout_view, name='logout'),  # URL for the logout view
    path('session/', views.session_view, name='session'),  # URL for the session view
    path('whoami/', views.whoami_view, name='whoami'),  # URL for the whoami view
    path('csrf/', views.set_csrf_cookie, name='set_csrf_cookie'),
    path('user-details/', views.get_user_details, name='user-details'),  # URL for the user details view
    path('companies/', views.CompanyListCreateView.as_view(), name='companies-list'),  # URL for the companies list view
    path('companies/<int:pk>/', views.CompanyDetailView.as_view(), name='companies-detail'),  # URL for the companies detail view
    path('customers/', views.CustomerListCreateView.as_view(), name='customers-list'),  # URL for the customers list view
    path('customers/<int:pk>/', views.CustomerDetailView.as_view(), name='customers-detail'),  # URL for the customers detail view
    path('accountants/', views.AccountantListCreateView.as_view(), name='accountants-list'),  # URL for the accountants list view
    path('accountants/<int:pk>/', views.AccountantDetailView.as_view(), name='accountants-detail'),  # URL for the accountants detail view
    path('retrain-ml/', views.RetrainModelView.as_view(), name='retrain-ml'),  # URL for the retrain ML model view
]
