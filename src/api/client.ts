const BASE_URL = "https://nuclear.dacoder.io";
const API_KEY = "643dbd98e1b2adde";

// Simple fetch wrapper
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}?apiKey=${API_KEY}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  // Check if response has content before parsing JSON
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
