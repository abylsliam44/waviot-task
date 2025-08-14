"""todo_project URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    """Health check endpoint for monitoring."""
    return JsonResponse({'status': 'ok', 'message': 'Todo API is running'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health_check'),
    path('api/auth/', include('apps.users.urls')),
    path('api/tasks/', include('apps.tasks.urls')),
] 