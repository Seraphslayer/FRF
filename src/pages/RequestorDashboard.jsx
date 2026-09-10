import { Link } from "react-router-dom";
import { useRequests } from "../context/RequestsContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import RoutePreview from "../components/RoutePreview.jsx";

export default function RequestorDashboard() {
  const { requests, loading, error } = useRequests();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-navy">My requests</h1>
          <p className="text-sm text-slate-500">
            Track where each request is in the approval pipeline.
          </p>
        </div>
        <Link
          to="/requestor/new"
          className="rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy/90"
        >
          New request
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          Couldn&apos;t load requests: {error}
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
                  {r.venue} &middot; {r.date} at {r.time}
                  {r.ledTv && " · LED TV"}
                </p>
              </div>
              <StatusBadge stage={r.stage} />
            </div>
            <div className="mt-4">
              <RoutePreview ledTv={r.ledTv} stage={r.stage} />
            </div>
          </div>
        ))}
        {!loading && requests.length === 0 && (
          <p className="text-sm text-slate-500">No requests yet.</p>
        )}
      </div>
    </div>
  );
}
