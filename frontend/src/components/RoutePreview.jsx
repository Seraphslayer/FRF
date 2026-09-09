import { buildStageFlow, STAGE_LABELS } from "../data/mockData.js";

export default function RoutePreview({ ledTv, stage }) {
  const flow = buildStageFlow(ledTv);
  const currentIdx = flow.indexOf(stage);
  const rejected = stage === "rejected";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {flow.map((key, i) => {
        const done = !rejected && i < currentIdx;
        const active = !rejected && i === currentIdx;
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                active
                  ? "border-navy bg-navy text-white"
                  : done
                  ? "border-teal/40 bg-teal/10 text-teal"
                  : key === "fmo_review" || key === "president_approval"
                  ? "border-gold/50 bg-gold/10 text-[#7A5A0B]"
                  : "border-slate-300 text-slate-500"
              }`}
            >
              {STAGE_LABELS[key]}
            </span>
            {i < flow.length - 1 && <span className="text-slate-300">&rarr;</span>}
          </div>
        );
      })}
      {rejected && (
        <span className="ml-2 rounded-full border border-coral/40 bg-coral/10 px-3 py-1 text-xs font-medium text-coral">
          Rejected &mdash; requestor must re-request
        </span>
      )}
    </div>
  );
}
