"""Serializers for task management."""

from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model with full functionality."""
    
    user = serializers.StringRelatedField(read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'user',
            'due_date', 'is_overdue', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def validate_title(self, value):
        """Validate task title."""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def create(self, validated_data):
        """Create a new task for the current user."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TaskListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for task listing."""
    
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'status', 'due_date', 
            'is_overdue', 'created_at', 'updated_at'
        ]


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new tasks."""

    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'due_date']

    def validate_title(self, value):
        """Validate task title."""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def create(self, validated_data):
        """Create a new task for the current user."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating existing tasks."""

    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'due_date']

    def validate_title(self, value):
        """Validate task title."""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating only task status."""

    class Meta:
        model = Task
        fields = ['status'] 