import { STAGE_LABELS } from "../data/mockData.js";

const STYLES = {
  submitted: "bg-slate-100 text-slate-600 border-slate-300",
  dept_head: "bg-slate-100 text-slate-600 border-slate-300",
  fmo_review: "bg-teal/10 text-teal border-teal/30",
  president_approval: "bg-gold/20 text-[#7A5A0B] border-gold/50",
  osa: "bg-slate-100 text-slate-600 border-slate-300",
  security: "bg-slate-100 text-slate-600 border-slate-300",
  it_office: "bg-slate-100 text-slate-600 border-slate-300",
  approved: "bg-teal/10 text-teal border-teal/40",
  rejected: "bg-coral/10 text-coral border-coral/40",
};

export default function StatusBadge({ stage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        STYLES[stage] || STYLES.submitted
      }`}
    >
      {STAGE_LABELS[stage] || stage}
    </span>
  );
}
