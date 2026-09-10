export const VENUES = [
  "Gym",
  "NCST Field",
  "HRM Bar",
  "Multipurpose Hall",
  "SH Main Building",
  "NASTECH Gym",
  "Imus Grandstand",
];

export const IT_EQUIPMENT = [
  "Projector",
  "Sound system",
  "Microphone",
  "Laptop / PC",
  "Extension cords",
];

export const FMO_EQUIPMENT = [
  "Tables",
  "Chairs",
  "Tent / canopy",
  "Stage",
  "Generator set",
];

export const EXTRA_REQUIREMENTS = [
  { id: "pcsa", label: "PCSA" },
  { id: "consent", label: "Parent / guardian consent" },
  { id: "notary", label: "Notarization (activities held off campus)" },
  { id: "related", label: "Related in-campus activity (HEROES, PE, NSTP)" },
];

// Ordered approval stages. LED TV requests insert fmo_review and
// president_approval right after the department head signs off. Mirrors
// backend/utils/stageFlow.js — keep both in sync if this ever changes.
export function buildStageFlow(ledTv) {
  const flow = ["submitted", "dept_head"];
  if (ledTv) flow.push("fmo_review", "president_approval");
  flow.push("osa", "security", "it_office", "approved");
  return flow;
}

export const STAGE_LABELS = {
  submitted: "Submitted",
  dept_head: "Dept. head review",
  fmo_review: "FMO review",
  president_approval: "Pres. office approval",
  osa: "OSA",
  security: "Security office",
  it_office: "IT office",
  approved: "Approved / scheduled",
  rejected: "Rejected",
};
