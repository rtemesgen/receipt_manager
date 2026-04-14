const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function buildHeaders(token, isJson = true) {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function extractError(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const payload = await response.json();
    if (payload.message) {
      return payload.message;
    }
    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      return payload.errors.join(', ');
    }
    if (payload.error) {
      return payload.error;
    }
  }

  const text = await response.text();
  return text || 'Request failed';
}

export async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(token, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
