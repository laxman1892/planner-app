"use client";

export default function ProgressForm({
  challengeId,
  values,
  isSubmitting,
  isCompleting,
  onSubmit,
  onChange,
  onComplete,
}) {
  return (
    <form className="progress-form" onSubmit={(event) => onSubmit(challengeId, event)}>
      <input
        name="date"
        type="date"
        value={values.date ?? ""}
        onChange={(event) => onChange(challengeId, event)}
        required
      />
      <input
        name="progress_note"
        value={values.progress_note ?? ""}
        onChange={(event) => onChange(challengeId, event)}
        placeholder="Progress note"
        required
      />
      <button type="submit" className="ghost" disabled={isSubmitting}>
        {isSubmitting ? "Logging..." : "Log progress"}
      </button>
      <button type="button" onClick={() => onComplete(challengeId)} disabled={isCompleting}>
        {isCompleting ? "Completing..." : "Complete"}
      </button>
    </form>
  );
}
