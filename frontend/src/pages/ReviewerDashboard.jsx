import { useState } from "react";
import { useRequests } from "../context/RequestsContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import RoutePreview from "../components/RoutePreview.jsx";

export default function ReviewerDashboard() {
  const { requests, loading, error, advanceStage } = useRequests();
  const [actionError, setActionError] = useState("");

  const act = async (id, action) => {
    setActionError("");
    try {
      await advanceStage(id, action);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-navy">Requests awaiting your approval</h1>
        <p className="text-sm text-slate-500">
          Approving moves the request into the office routing pipeline; rejecting
          sends it back to the requestor to re-request.
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
        {requests.map((r) => (
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

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => act(r._id, "approve")}
                className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal/90"
              >
                Approve
              </button>
              <button
                onClick={() => act(r._id, "reject")}
                className="rounded-lg border border-coral/40 px-4 py-2 text-sm font-medium text-coral transition hover:bg-coral/10"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
        {!loading && requests.length === 0 && (
          <p className="text-sm text-slate-500">Nothing waiting on your review.</p>
        )}
      </div>
    </div>
  );
}
