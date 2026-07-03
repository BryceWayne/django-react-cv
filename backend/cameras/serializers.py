from rest_framework import serializers
from .models import Camera, CVEvent

class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camera
        fields = '__all__'

class CVEventSerializer(serializers.ModelSerializer):
    camera_name = serializers.CharField(source='camera.name', read_only=True)
    
    class Meta:
        model = CVEvent
        fields = '__all__'
