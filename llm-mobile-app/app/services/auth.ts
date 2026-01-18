import Constants from 'expo-constants';

const API_BASE_URL = Constants.manifest?.extra?.API_BASE_URL || 'http://localhost:5000';

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const data = await response.json();
  return data;
};
