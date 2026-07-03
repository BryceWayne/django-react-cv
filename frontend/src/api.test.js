import { fetchCameras, fetchEvents, API_BASE_URL } from './api';

// Mock the global fetch
global.fetch = vi.fn();

describe('API functions', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock localStorage
    const store = { token: 'test-token' };
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key],
      setItem: (key, value) => { store[key] = value; },
      removeItem: (key) => { delete store[key]; },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('fetchCameras makes a GET request to correct URL', async () => {
    const mockCameras = [{ id: 1, name: 'Camera 1' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCameras,
    });

    const cameras = await fetchCameras();
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/cameras/`, {
      headers: {
        'Authorization': 'Token test-token'
      }
    });
    expect(cameras).toEqual(mockCameras);
  });

  test('fetchEvents makes a GET request to correct URL', async () => {
    const mockEvents = [{ id: 1, event_type: 'person_detected' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const events = await fetchEvents();
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/events/`, {
      headers: {
        'Authorization': 'Token test-token'
      }
    });
    expect(events).toEqual(mockEvents);
  });
});
