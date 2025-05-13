"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from backend.ai_search.views import SearchView, AuthStatusView, ConversationListView, ConversationDetailView
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/search/', SearchView.as_view(), name='search_api'),
    path('accounts/', include('allauth.urls')),
    path('logout', LogoutView.as_view()),
    path('api/auth/status/', AuthStatusView.as_view(), name='auth_status'),
    path('api/conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('api/conversations/<int:conversation_id>/', ConversationDetailView.as_view(), name='conversation-detail'),
]