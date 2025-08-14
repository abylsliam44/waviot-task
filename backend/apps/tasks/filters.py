"""Filters for task management."""

import django_filters
from django.db import models
from .models import Task


class TaskFilter(django_filters.FilterSet):
    """Filter set for Task model with advanced filtering options."""
    
    status = django_filters.ChoiceFilter(
        choices=Task.STATUS_CHOICES,
        help_text="Filter by task status"
    )
    
    created_date = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='date',
        help_text="Filter by creation date (YYYY-MM-DD)"
    )
    
    created_date_gte = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='date__gte',
        help_text="Filter tasks created on or after this date"
    )
    
    created_date_lte = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='date__lte',
        help_text="Filter tasks created on or before this date"
    )
    
    due_date = django_filters.DateFilter(
        field_name='due_date',
        lookup_expr='date',
        help_text="Filter by due date (YYYY-MM-DD)"
    )
    
    due_date_gte = django_filters.DateFilter(
        field_name='due_date',
        lookup_expr='date__gte',
        help_text="Filter tasks due on or after this date"
    )
    
    due_date_lte = django_filters.DateFilter(
        field_name='due_date',
        lookup_expr='date__lte',
        help_text="Filter tasks due on or before this date"
    )
    
    overdue = django_filters.BooleanFilter(
        method='filter_overdue',
        help_text="Filter overdue tasks (true/false)"
    )
    
    search = django_filters.CharFilter(
        method='filter_search',
        help_text="Search in title and description"
    )

    class Meta:
        model = Task
        fields = {
            'status': ['exact'],
            'created_at': ['date', 'date__gte', 'date__lte'],
            'due_date': ['date', 'date__gte', 'date__lte'],
        }

    def filter_overdue(self, queryset, name, value):
        """Filter overdue tasks."""
        if value is None:
            return queryset
            
        from django.utils import timezone
        now = timezone.now()
        
        if value:
            # Return overdue tasks (due_date < now and status != 'done')
            return queryset.filter(
                due_date__lt=now,
                status__in=['pending', 'archived']
            )
        else:
            # Return non-overdue tasks
            return queryset.exclude(
                due_date__lt=now,
                status__in=['pending', 'archived']
            )

    def filter_search(self, queryset, name, value):
        """Search in title and description."""
        if not value:
            return queryset
            
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(description__icontains=value)
        )

    def filter_queryset(self, queryset):
        """Override to ensure user filtering."""
        # Always filter by current user
        if hasattr(self.request, 'user') and self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        
        return super().filter_queryset(queryset) 