export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.token;
};

export const fetchCameras = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/cameras/`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  return response.json();
};

export const fetchEvents = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/events/`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  return response.json();
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  return response.json();
};

export const logout = () => {
  localStorage.removeItem('token');
};
