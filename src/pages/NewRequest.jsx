import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useRequests } from "../context/RequestsContext.jsx";
import { VENUES, IT_EQUIPMENT, FMO_EQUIPMENT, EXTRA_REQUIREMENTS } from "../data/mockData.js";
import RoutePreview from "../components/RoutePreview.jsx";
import LedTvAvailability from "../components/LedTvAvailability.jsx";

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-navy">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-coral">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

export default function NewRequest() {
  const { session } = useAuth();
  const { addRequest } = useRequests();
  const navigate = useNavigate();

  const [requestorType, setRequestorType] = useState("student");
  const [department, setDepartment] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [urgency, setUrgency] = useState("regular");
  const [ledTv, setLedTv] = useState(false);
  const [itChecked, setItChecked] = useState([]);
  const [fmoChecked, setFmoChecked] = useState([]);
  const [extrasChecked, setExtrasChecked] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const leadDays = urgency === "urgent" ? 3 : 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await addRequest({
        requestorType,
        department,
        contact,
        email,
        eventName,
        venue,
        date,
        time,
        urgency,
        ledTv,
        itEquipment: itChecked,
        fmoEquipment: fmoChecked,
        extras: extrasChecked,
      });
      navigate("/requestor");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite py-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 px-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between bg-navy px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">
                Facilities reservation program
              </p>
              <h1 className="text-lg font-medium text-white">New request</h1>
            </div>
            <div className="rounded-lg border border-gold/40 bg-white/5 px-3 py-1.5 text-right">
              <p className="text-[10px] uppercase tracking-wide text-gold">
                FRP control #
              </p>
              <p className="font-mono text-sm text-white/70">Assigned on submit</p>
            </div>
          </div>
          <div className="h-1 w-full bg-gold" />
        </div>

        <Section title="Requestor information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input className={inputClass} value={session?.name || ""} readOnly />
            </Field>
            <Field label="Requestor type" required>
              <div className="flex gap-2 pt-1">
                {["student", "employee"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setRequestorType(t)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                      requestorType === t
                        ? "border-navy bg-navy text-white"
                        : "border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Department / org / section" required>
              <input
                className={inputClass}
                placeholder="e.g. BSCoE 32E1, ICES"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </Field>
            <Field label="Contact number" required>
              <input
                className={inputClass}
                placeholder="09XX XXX XXXX"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                className={inputClass}
                placeholder="name@ncst.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
          </div>
        </Section>

        <Section title="Schedule & venue">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Event / activity name" required>
              <input
                className={inputClass}
                placeholder="e.g. General assembly"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </Field>
            <Field label="Venue" required>
              <select
                className={inputClass}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a venue
                </option>
                {VENUES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date needed" required>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field label="Time" required>
              <input
                type="time"
                className={inputClass}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="mt-4">
            <span className="mb-1 block text-sm text-slate-600">Request priority</span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setUrgency("regular")}
                className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  urgency === "regular" ? "border-teal bg-teal/10" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <span className="font-medium text-slate-800">Regular</span>
                <span className="block text-xs text-slate-500">
                  Submit at least 5 days before the event
                </span>
              </button>
              <button
                type="button"
                onClick={() => setUrgency("urgent")}
                className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm transition ${
                  urgency === "urgent" ? "border-coral bg-coral/10" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <span className="font-medium text-slate-800">Urgent</span>
                <span className="block text-xs text-slate-500">
                  Submit at least 3 days before the event
                </span>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              This request needs to be scheduled at least {leadDays} day{leadDays > 1 ? "s" : ""} prior to the event date.
            </p>
          </div>
        </Section>

        <Section title="Equipment requested">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">I.T. office equipment</p>
              <div className="space-y-2">
                {IT_EQUIPMENT.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy/30"
                      checked={itChecked.includes(item)}
                      onChange={() => toggle(itChecked, setItChecked, item)}
                    />
                    {item}
                  </label>
                ))}
                <label className="flex items-center gap-2 pt-1 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold/30"
                    checked={ledTv}
                    onChange={(e) => setLedTv(e.target.checked)}
                  />
                  <span className="text-slate-600">
                    This request includes the <span className="font-medium text-navy">LED TV</span>
                  </span>
                </label>

                {ledTv && (
                  <div className="space-y-2">
                    <LedTvAvailability date={date} token={session?.token} />
                    <p className="rounded-lg bg-gold/15 px-3 py-2 text-xs text-[#7A5A0B]">
                      LED TV requests route through FMO and require approval from
                      the Office of the President before reaching OSA.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">FMO office equipment</p>
              <div className="space-y-2">
                {FMO_EQUIPMENT.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy/30"
                      checked={fmoChecked.includes(item)}
                      onChange={() => toggle(fmoChecked, setFmoChecked, item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Additional requirements — student / employee">
          <p className="mb-3 text-xs text-slate-500">
            Applies to activities involving students or employees. Check what applies to this request.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {EXTRA_REQUIREMENTS.map((req) => (
              <label key={req.id} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy/30"
                  checked={extrasChecked.includes(req.id)}
                  onChange={() => toggle(extrasChecked, setExtrasChecked, req.id)}
                />
                {req.label}
              </label>
            ))}
          </div>
        </Section>

        <Section title="This request will route through">
          <RoutePreview ledTv={ledTv} stage="submitted" />
        </Section>

        {submitError && (
          <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pb-8">
          <p className="text-xs text-slate-500">
            Fields marked <span className="text-coral">*</span> are required.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-navy/30 disabled:opacity-60"
          >
            {submitting ? "Submitting\u2026" : "Submit request"}
          </button>
        </div>
      </form>
    </div>
  );
}
