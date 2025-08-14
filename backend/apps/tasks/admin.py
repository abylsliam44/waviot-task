"""Admin configuration for tasks app."""

from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin interface for Task model."""
    
    list_display = ['title', 'user', 'status', 'due_date', 'is_overdue', 'created_at']
    list_filter = ['status', 'created_at', 'due_date', 'user']
    search_fields = ['title', 'description', 'user__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'is_overdue']
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'status', 'user', 'due_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'is_overdue'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset with user selection."""
        return super().get_queryset(request).select_related('user') 