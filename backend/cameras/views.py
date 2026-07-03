from rest_framework import viewsets
from .models import Camera, CVEvent
from .serializers import CameraSerializer, CVEventSerializer

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

class CVEventViewSet(viewsets.ModelViewSet):
    queryset = CVEvent.objects.all()
    serializer_class = CVEventSerializer
