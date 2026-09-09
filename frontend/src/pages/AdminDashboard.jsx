import { useState } from "react";
import { useRequests } from "../context/RequestsContext.jsx";
import { VENUES, STAGE_LABELS, buildStageFlow } from "../data/mockData.js";
import StatusBadge from "../components/StatusBadge.jsx";
import RoutePreview from "../components/RoutePreview.jsx";

export default function AdminDashboard() {
  const { requests, loading, error, updateRequest, advanceStage } = useRequests();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [actionError, setActionError] = useState("");

  const startEdit = (r) => {
    setEditingId(r._id);
    setDraft({ venue: r.venue, date: r.date, time: r.time, eventName: r.eventName });
  };

  const saveEdit = async (id) => {
    setActionError("");
    try {
      await updateRequest(id, draft);
      setEditingId(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const advance = async (id) => {
    setActionError("");
    try {
      await advanceStage(id, "approve");
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-navy">All requests</h1>
        <p className="text-sm text-slate-500">
          Edit details and move requests through the office routing pipeline. Deletion
          and incident logs are restricted to Super User.
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
          const isEditing = editingId === r._id;
          const flow = buildStageFlow(r.ledTv);
          const canAdvance =
            r.stage !== "rejected" && r.stage !== "approved" && r.stage !== "dept_head" && r.stage !== "submitted";

          return (
            <div key={r._id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1 min-w-[240px]">
                  <p className="font-mono text-xs text-slate-400">{r.controlNumber}</p>
                  {isEditing ? (
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
                      value={draft.eventName}
                      onChange={(e) => setDraft({ ...draft, eventName: e.target.value })}
                    />
                  ) : (
                    <h2 className="text-sm font-medium text-slate-800">{r.eventName}</h2>
                  )}
                  <p className="text-xs text-slate-500">
                    {r.requestorName} &middot; {r.department}
                  </p>
                </div>
                <StatusBadge stage={r.stage} />
              </div>

              {isEditing ? (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <select
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={draft.venue}
                    onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
                  >
                    {VENUES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={draft.date}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                  />
                  <input
                    type="time"
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                    value={draft.time}
                    onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                  />
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  {r.venue} &middot; {r.date} at {r.time}
                  {r.ledTv && " · LED TV"}
                </p>
              )}

              <div className="mt-4">
                <RoutePreview ledTv={r.ledTv} stage={r.stage} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(r._id)}
                      className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(r)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    Edit details
                  </button>
                )}
                {canAdvance && (
                  <button
                    onClick={() => advance(r._id)}
                    className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
                  >
                    Advance to {STAGE_LABELS[flow[flow.indexOf(r.stage) + 1]]}
                  </button>
                )}
              </div>
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
