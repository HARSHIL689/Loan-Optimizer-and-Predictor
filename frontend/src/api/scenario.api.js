const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

function handleUnauthorized(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    window.location.href = "/signin";
    throw new Error("Session expired");
  }
}

async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  handleUnauthorized(res);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export function saveScenario(payload) {
  return request("POST", "/scenarios", payload);
}

export function listScenarios() {
  return request("GET", "/scenarios");
}

export function loadScenario(id) {
  return request("GET", `/scenarios/${id}`);
}

export function deleteScenario(id) {
  return request("DELETE", `/scenarios/${id}`);
}
