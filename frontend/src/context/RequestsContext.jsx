import { createContext, useCallback, useContext, useEffect, useState } from "react";
import apiFetch from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const RequestsContext = createContext(null);

function endpointForRole(role) {
  switch (role) {
    case "requestor":
      return "/requests/mine";
    case "dept_head":
      return "/requests/pending";
    case "admin":
    case "super_user":
      return "/requests";
    default:
      return null;
  }
}

export function RequestsProvider({ children }) {
  const { session } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    const path = endpointForRole(session?.role);
    if (!session?.token || !path) {
      setRequests([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(path, { token: session.token });
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.token, session?.role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addRequest = async (payload) => {
    const data = await apiFetch("/requests", { method: "POST", body: payload, token: session.token });
    await refresh();
    return data.request;
  };

  const updateRequest = async (id, patch) => {
    const data = await apiFetch(`/requests/${id}`, { method: "PATCH", body: patch, token: session.token });
    await refresh();
    return data.request;
  };

  const deleteRequest = async (id) => {
    await apiFetch(`/requests/${id}`, { method: "DELETE", token: session.token });
    await refresh();
  };

  const addLog = async (id, note) => {
    const data = await apiFetch(`/requests/${id}/logs`, {
      method: "POST",
      body: { note },
      token: session.token,
    });
    await refresh();
    return data.request;
  };

  const advanceStage = async (id, action) => {
    const data = await apiFetch(`/requests/${id}/advance`, {
      method: "POST",
      body: { action },
      token: session.token,
    });
    await refresh();
    return data.request;
  };

  return (
    <RequestsContext.Provider
      value={{ requests, loading, error, refresh, addRequest, updateRequest, deleteRequest, addLog, advanceStage }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used inside RequestsProvider");
  return ctx;
}
