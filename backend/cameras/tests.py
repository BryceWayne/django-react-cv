from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Camera, CVEvent

class CameraModelTest(TestCase):
    def setUp(self):
        self.camera = Camera.objects.create(
            name="Front Door",
            location="Main Entrance",
            status="active"
        )

    def test_camera_creation(self):
        self.assertEqual(self.camera.name, "Front Door")
        self.assertEqual(self.camera.location, "Main Entrance")
        self.assertEqual(self.camera.status, "active")
        self.assertEqual(str(self.camera), "Front Door")

class CVEventModelTest(TestCase):
    def setUp(self):
        self.camera = Camera.objects.create(name="Backyard", status="active")
        self.event = CVEvent.objects.create(
            camera=self.camera,
            event_type="person_detected",
            confidence=0.98,
            details="Person detected in backyard"
        )

    def test_event_creation(self):
        self.assertEqual(self.event.camera, self.camera)
        self.assertEqual(self.event.event_type, "person_detected")
        self.assertEqual(self.event.confidence, 0.98)
        self.assertTrue(str(self.event).startswith("person_detected at"))

class CameraAPITest(APITestCase):
    def setUp(self):
        self.camera1 = Camera.objects.create(name="Cam 1", location="Lobby", status="active")
        self.camera2 = Camera.objects.create(name="Cam 2", location="Hallway", status="inactive")
        # Ensure we are using the correct viewset router URL names. 
        # By default in viewsets, list is 'camera-list', detail is 'camera-detail'
        self.list_url = reverse('camera-list')

    def test_list_cameras(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_camera(self):
        data = {
            "name": "Cam 3",
            "location": "Parking",
            "status": "active"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Camera.objects.count(), 3)
        self.assertEqual(Camera.objects.get(id=response.data['id']).name, "Cam 3")

    def test_retrieve_camera(self):
        url = reverse('camera-detail', kwargs={'pk': self.camera1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Cam 1")

class CVEventAPITest(APITestCase):
    def setUp(self):
        self.camera = Camera.objects.create(name="Cam 1", location="Lobby", status="active")
        self.event1 = CVEvent.objects.create(camera=self.camera, event_type="person_detected")
        self.event2 = CVEvent.objects.create(camera=self.camera, event_type="motion")
        self.list_url = reverse('cvevent-list')

    def test_list_events(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_event(self):
        data = {
            "camera": self.camera.pk,
            "event_type": "vehicle",
            "confidence": 0.85
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CVEvent.objects.count(), 3)
        self.assertEqual(CVEvent.objects.get(id=response.data['id']).event_type, "vehicle")
