import { useEffect, useState } from "react";
import apiFetch from "../services/api.js";

export default function LedTvAvailability({ date, token }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) {
      setStatus(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    apiFetch(`/requests/led-tv-availability?date=${date}`, { token })
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, token]);

  if (!date) {
    return (
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Pick a date to check LED TV availability.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Checking availability&hellip;
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">
        Couldn&apos;t check availability: {error}
      </p>
    );
  }

  if (status && status.available === false) {
    return (
      <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">
        The LED TV is already booked on this date for{" "}
        <span className="font-medium">{status.conflict?.eventName}</span>. Choose another
        date or remove the LED TV from this request.
      </p>
    );
  }

  if (status && status.available) {
    return (
      <p className="rounded-lg border border-teal/30 bg-teal/10 px-3 py-2 text-xs text-teal">
        The LED TV is available on this date.
      </p>
    );
  }

  return null;
}
