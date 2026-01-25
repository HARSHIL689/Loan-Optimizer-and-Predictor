// const API_BASE = "http://localhost:3000/api";

// export async function optimizeRepayment(payload) {
//   const res = await fetch(`${API_BASE}/optimize/repayment`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.error || "Request failed");
//   }

//   return res.json();
// }

// export async function analyzeOpportunity(payload) {
//   const res = await fetch(`${API_BASE}/optimize/opportunity`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.error || "Request failed");
//   }

//   return res.json();
// }

// export async function optimizePrepaymentTiming(payload) {
//   const res = await fetch(`${API_BASE}/optimize/prepayment-timing`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.error || "Request failed");
//   }

//   return res.json();
// }
const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function handleUnauthorized(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    window.location.href = "/signin";
    throw new Error("Session expired");
  }
}

async function request(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
     },
    body: JSON.stringify(payload)
    
  });
  console.log(payload)
  handleUnauthorized(res);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }

  return res.json();
}

export function optimizeRepayment(payload) {
  return request("/optimize/repayment", payload);
}

export function analyzeOpportunity(payload) {
  return request("/optimize/opportunity", payload);
}

export function optimizePrepaymentTiming(payload) {
  return request("/optimize/prepayment-timing", payload);
}
