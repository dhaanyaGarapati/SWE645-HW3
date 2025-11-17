const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

const API_BASE = isLocalhost ? "http://localhost:8000" : "/api";

async function call(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // Try to parse a useful error message
  if (!res.ok) {
    let msg;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      msg = data.detail || JSON.stringify(data);
    } else {
      msg = await res.text();
    }
    throw new Error(`${res.status} ${msg}`);
  }

  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const SurveyAPI = {
  // collection endpoints (note the trailing slash)
  list:   () => call("/surveys/"),
  create: (data) =>
    call("/surveys/", { method: "POST", body: JSON.stringify(data) }),

  // item endpoints
  get:    (id) =>
    call(`/surveys/${id}`),
  update: (id, data) =>
    call(`/surveys/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) =>
    call(`/surveys/${id}`, { method: "DELETE" }),
};
