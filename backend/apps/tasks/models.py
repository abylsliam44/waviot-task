"""Task models for the todo application."""

from django.db import models
from django.conf import settings


class TimeStampedModel(models.Model):
    """Abstract model with timestamp fields."""
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Task(TimeStampedModel):
    """
    Task model representing a todo item.
    
    Each task belongs to a user and has a status that can be updated.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('done', 'Done'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    due_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

    @property
    def is_overdue(self):
        """Check if task is overdue."""
        if self.due_date and self.status != 'done':
            from django.utils import timezone
            return timezone.now() > self.due_date
        return False 