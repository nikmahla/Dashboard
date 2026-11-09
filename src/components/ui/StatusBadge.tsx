type Tone = "success" | "warning" | "danger" | "neutral";

const TONES: Record<string, Tone> = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "danger",
  "In Stock": "success",
  "Out of Stock": "danger",
  Low: "warning",
};

export default function StatusBadge({ status, tone }: { status: string; tone?: Tone }) {
  return <span className={`badge badge-${tone ?? TONES[status] ?? "neutral"}`}>{status}</span>;
}
