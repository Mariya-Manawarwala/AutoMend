import { STATUS_LIST } from "../utils/constants";

export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase() || "pending";

  const styles = {
    pending: "bg-warning/10 text-warning border-warning/20",
    queued: "bg-info/10 text-info border-info/20",
    "in-progress": "bg-brand/10 text-brand border-brand/20",
    "waiting-parts": "bg-warning/10 text-warning border-warning/20",
    completed: "bg-success/10 text-success border-success/20",
    declined: "bg-error/10 text-error border-error/20",
  };

  const currentStyle = styles[normalized] || "bg-border-soft text-text-muted";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle} capitalize inline-block text-center`}>
      {status?.replace("-", " ")}
    </span>
  );
}
