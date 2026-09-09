import { useState } from "react";
import { useRequests } from "../context/RequestsContext.jsx";
import { STAGE_LABELS, buildStageFlow } from "../data/mockData.js";
import StatusBadge from "../components/StatusBadge.jsx";
import RoutePreview from "../components/RoutePreview.jsx";

export default function SuperUserDashboard() {
  const { requests, loading, error, updateRequest, deleteRequest, addLog, advanceStage } = useRequests();
  const [openLogId, setOpenLogId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [actionError, setActionError] = useState("");

  const act = async (fn) => {
    setActionError("");
    try {
      await fn();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const submitLog = (id) => {
    if (!noteDraft.trim()) return;
    act(() => addLog(id, noteDraft.trim())).then(() => setNoteDraft(""));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-navy">All requests &mdash; full control</h1>
        <p className="text-sm text-slate-500">
          Advance stages, edit, delete, and keep an incident log per request.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          Couldn&apos;t load requests: {error}
        </p>
      )}
      {actionError && (
        <p className="mb-4 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          {actionError}
        </p>
      )}
      {loading && <p className="text-sm text-slate-500">Loading&hellip;</p>}

      <div className="space-y-4">
        {requests.map((r) => {
          const flow = buildStageFlow(r.ledTv);
          const canAdvance = r.stage !== "rejected" && r.stage !== "approved";
          const logOpen = openLogId === r._id;

          return (
            <div key={r._id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-slate-400">{r.controlNumber}</p>
                  <h2 className="text-sm font-medium text-slate-800">{r.eventName}</h2>
                  <p className="text-xs text-slate-500">
                    {r.requestorName} &middot; {r.department}
                  </p>
                  <p className="text-xs text-slate-500">
                    {r.venue} &middot; {r.date} at {r.time}
                    {r.ledTv && " · LED TV"}
                  </p>
                </div>
                <StatusBadge stage={r.stage} />
              </div>

              <div className="mt-4">
                <RoutePreview ledTv={r.ledTv} stage={r.stage} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {canAdvance && (
                  <button
                    onClick={() => act(() => advanceStage(r._id, "approve"))}
                    className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
                  >
                    Advance to {STAGE_LABELS[flow[flow.indexOf(r.stage) + 1]] || "Approved"}
                  </button>
                )}
                {r.stage !== "rejected" && (
                  <button
                    onClick={() => act(() => advanceStage(r._id, "reject"))}
                    className="rounded-lg border border-coral/40 px-4 py-2 text-sm font-medium text-coral transition hover:bg-coral/10"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => setOpenLogId(logOpen ? null : r._id)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  {logOpen ? "Hide logs" : `Incident logs (${r.logs?.length || 0})`}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete request ${r.controlNumber}? This cannot be undone.`)) {
                      act(() => deleteRequest(r._id));
                    }
                  }}
                  className="ml-auto rounded-lg border border-coral/40 px-4 py-2 text-sm font-medium text-coral transition hover:bg-coral/10"
                >
                  Delete
                </button>
              </div>

              {logOpen && (
                <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4">
                  {(r.logs || []).length === 0 && (
                    <p className="text-xs text-slate-500">No log entries yet.</p>
                  )}
                  {(r.logs || []).map((log, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <p className="text-xs text-slate-500">
                        {log.author} &middot; {new Date(log.ts).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-700">{log.note}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Add an incident log entry..."
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                    />
                    <button
                      onClick={() => submitLog(r._id)}
                      className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!loading && requests.length === 0 && (
          <p className="text-sm text-slate-500">No requests yet.</p>
        )}
      </div>
    </div>
  );
}
