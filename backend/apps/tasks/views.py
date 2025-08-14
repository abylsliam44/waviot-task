"""Views for task management."""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Task
from .serializers import (
    TaskSerializer,
    TaskListSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer,
    TaskStatusUpdateSerializer
)
from .filters import TaskFilter


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tasks.
    
    Provides full CRUD functionality for tasks with filtering,
    search, and pagination capabilities.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return tasks for the current user only."""
        return Task.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return TaskListSerializer
        elif self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        elif self.action == 'update_status':
            return TaskStatusUpdateSerializer
        return TaskSerializer

    def create(self, request, *args, **kwargs):
        """Create a new task."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        
        # Return full task data
        response_serializer = TaskSerializer(task)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """Update an existing task."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        
        # Return full task data
        response_serializer = TaskSerializer(task)
        return Response(response_serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update only the status of a task."""
        task = self.get_object()
        serializer = TaskStatusUpdateSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_task = serializer.save()
        
        response_serializer = TaskSerializer(updated_task)
        return Response(response_serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics for the current user."""
        queryset = self.get_queryset()
        
        total_tasks = queryset.count()
        pending_tasks = queryset.filter(status='pending').count()
        done_tasks = queryset.filter(status='done').count()
        archived_tasks = queryset.filter(status='archived').count()
        
        # Count overdue tasks
        from django.utils import timezone
        now = timezone.now()
        overdue_tasks = queryset.filter(
            due_date__lt=now,
            status__in=['pending', 'archived']
        ).count()

        return Response({
            'total': total_tasks,
            'pending': pending_tasks,
            'done': done_tasks,
            'archived': archived_tasks,
            'overdue': overdue_tasks,
        })

    @action(detail=False, methods=['post'])
    def bulk_update_status(self, request):
        """Bulk update status for multiple tasks."""
        task_ids = request.data.get('task_ids', [])
        new_status = request.data.get('status')
        
        if not task_ids or not new_status:
            return Response(
                {'error': 'task_ids and status are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in dict(Task.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update tasks for current user only
        updated_count = self.get_queryset().filter(
            id__in=task_ids
        ).update(status=new_status)
        
        return Response({
            'message': f'Updated {updated_count} tasks',
            'updated_count': updated_count
        })

    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        """Bulk delete multiple tasks."""
        task_ids = request.data.get('task_ids', [])
        
        if not task_ids:
            return Response(
                {'error': 'task_ids is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete tasks for current user only
        deleted_count, _ = self.get_queryset().filter(
            id__in=task_ids
        ).delete()
        
        return Response({
            'message': f'Deleted {deleted_count} tasks',
            'deleted_count': deleted_count
        }) 