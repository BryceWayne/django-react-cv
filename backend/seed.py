import os
import django
from django.utils import timezone
import random
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cv_platform.settings')
django.setup()

from cameras.models import Camera, CVEvent

# Clear existing data
Camera.objects.all().delete()
CVEvent.objects.all().delete()

# Create Mock Cameras
c1 = Camera.objects.create(name="Front Door Entrance", location="Building A, Floor 1", status="active", stream_url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8")
c2 = Camera.objects.create(name="Parking Lot West", location="Outdoor", status="active", stream_url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8")
c3 = Camera.objects.create(name="Server Room", location="Building B, Floor 3", status="active", stream_url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8")
c4 = Camera.objects.create(name="Loading Dock", location="Building A, Rear", status="offline", stream_url="")

cameras = [c1, c2, c3]
event_types = ['person_detected', 'motion', 'vehicle', 'license_plate', 'alert']

# Generate mock events for the last hour
now = timezone.now()
for i in range(20):
    camera = random.choice(cameras)
    event_type = random.choice(event_types)
    timestamp = now - timedelta(minutes=random.randint(1, 60))
    confidence = random.uniform(0.75, 0.99)
    details = f"Detected {event_type} with confidence {confidence:.2f}"
    
    CVEvent.objects.create(
        camera=camera,
        event_type=event_type,
        timestamp=timestamp,
        confidence=confidence,
        details=details
    )

print("Successfully seeded the database.")
