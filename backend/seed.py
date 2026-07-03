import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cv_platform.settings')
django.setup()

from cameras.models import Camera, CVEvent

# Clear existing data
Camera.objects.all().delete()
CVEvent.objects.all().delete()

# Create Mock Cameras pointing to the local video
c1 = Camera.objects.create(name="Front Door Entrance", location="Building A, Floor 1", status="active", stream_url="/mock_feed.mp4")
c2 = Camera.objects.create(name="Parking Lot West", location="Outdoor", status="active", stream_url="/mock_feed.mp4")
c3 = Camera.objects.create(name="Server Room", location="Building B, Floor 3", status="active", stream_url="/mock_feed.mp4")
c4 = Camera.objects.create(name="Loading Dock", location="Building A, Rear", status="offline", stream_url="")

print("Successfully seeded the database. Cameras created, and events cleared so they can populate over time.")
