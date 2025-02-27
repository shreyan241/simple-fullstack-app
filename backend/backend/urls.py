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
from core.api import api
from django.http import HttpResponse, JsonResponse
import logging
import traceback
import sys

# Configure logging
logger = logging.getLogger(__name__)

# Simple test view
def test_view(request):
    return HttpResponse("API test route is working!")

# JSON test view
def json_test_view(request):
    return JsonResponse({"message": "JSON API is working!"})

# Debug API view
def debug_api_view(request):
    try:
        # Try to access the api object
        api_type = str(type(api))
        api_dir = str(dir(api))
        api_urls = str(type(api.urls))
        
        # Return debug info
        return JsonResponse({
            "message": "API debug info",
            "api_type": api_type,
            "api_urls_type": api_urls,
            "api_dir": api_dir
        })
    except Exception as e:
        traceback_str = traceback.format_exc()
        logger.error(f"API debug error: {str(e)}\n{traceback_str}")
        return JsonResponse({
            "error": str(e),
            "traceback": traceback_str
        }, status=500)

# Safe wrapper for api.urls
def safe_api_urls(request):
    try:
        return api.urls(request)
    except Exception as e:
        traceback_str = traceback.format_exc()
        logger.error(f"API error: {str(e)}\n{traceback_str}")
        return JsonResponse({
            "error": str(e),
            "traceback": traceback_str
        }, status=500)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', api.urls),
    path('api-alt/', lambda request: api.urls(request)),
    path('api-safe/', safe_api_urls),
    path('api-debug/', debug_api_view),
    path('apitest/', test_view),  # Test route
    path('json-api/', json_test_view),  # JSON test route
]
