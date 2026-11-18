from rest_framework import serializers
from .models import User


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "full_name", "country", "email_verified_at")
        read_only_fields = ("id", "email", "email_verified_at")
