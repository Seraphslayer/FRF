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

// Ordered approval stages. LED TV requests insert fmo_review and
// president_approval right after the department head signs off.
export function buildStageFlow(ledTv) {
  const flow = ["submitted", "dept_head"];
  if (ledTv) flow.push("fmo_review", "president_approval");
  flow.push("osa", "security", "it_office", "approved");
  return flow;
}

export function nextStage(currentStage, ledTv) {
  const flow = buildStageFlow(ledTv);
  const idx = flow.indexOf(currentStage);
  if (idx === -1) return currentStage;
  return flow[Math.min(idx + 1, flow.length - 1)];
}
