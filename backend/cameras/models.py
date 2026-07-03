from django.db import models
from django.utils import timezone

class Camera(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=[('active', 'Active'), ('inactive', 'Inactive'), ('offline', 'Offline')], default='active')
    stream_url = models.URLField(blank=True, null=True, help_text="Mock stream URL for the frontend to display")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CVEvent(models.Model):
    EVENT_TYPES = [
        ('person_detected', 'Person Detected'),
        ('motion', 'Motion Detected'),
        ('vehicle', 'Vehicle Detected'),
        ('license_plate', 'License Plate Read'),
        ('alert', 'Security Alert')
    ]
    camera = models.ForeignKey(Camera, related_name='events', on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    timestamp = models.DateTimeField(default=timezone.now)
    confidence = models.FloatField(help_text="Confidence score from the CV model (0.0 to 1.0)", default=0.95)
    details = models.TextField(blank=True, help_text="Additional event details (JSON or text)")
    
    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.event_type} at {self.timestamp} from {self.camera.name}"
