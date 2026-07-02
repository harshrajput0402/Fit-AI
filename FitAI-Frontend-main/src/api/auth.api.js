const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ─── Store access token in memory ─────────
let accessToken = null;

export const setAccessToken  = (token) => { accessToken = token; };
export const getAccessToken  = () => accessToken;
export const clearAccessToken = () => { accessToken = null; };

// ─── Base fetch with auto token refresh ───
// If a request fails with 401, it silently refreshes
// the token and retries the request once automatically
export const apiFetch = async (endpoint, options = {}) => {
  const makeRequest = async (token) => {
    return await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  };

  // First attempt with current token
  let res = await makeRequest(accessToken);

  // If 401 — token expired, try to refresh silently
  if (res.status === 401) {
    try {
      const newToken = await refreshToken(); // get new access token
      res = await makeRequest(newToken);     // retry original request
    } catch {
      // Refresh also failed — user must log in again
      clearAccessToken();
      window.dispatchEvent(new Event("auth:logout")); // signal App.jsx to logout
      throw new Error("Session expired. Please log in again.");
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ─── Register ──────────────────────────────
export const register = async ({ name, email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

// ─── Login ─────────────────────────────────
export const login = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

// ─── Logout ────────────────────────────────
export const logout = async () => {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch { /* ignore errors on logout */ }
  clearAccessToken();
};

export const refreshToken = async () => {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // sends the httpOnly refresh token cookie
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Refresh failed");
  setAccessToken(data.data.accessToken);
  return data.data.accessToken;
};

// ─── Try to restore session on page load ───
// Called once when app starts — checks if refresh
// token cookie still exists and gets a new access token
export const restoreSession = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    // 401 just means no session exists — not a real error
    if (res.status === 401) return null;

    const data = await res.json();
    if (!data?.data?.accessToken) return null;

    setAccessToken(data.data.accessToken);
    return data.data.accessToken;
  } catch {
    return null; // network error — treat as no session
  }
};