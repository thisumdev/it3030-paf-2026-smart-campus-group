import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import { createBooking } from "../../../api/bookingApi";
import axiosClient from "../../../api/axiosClient";

// ── Helper ────────────────────────────────────────────────────────────────────

const toLocalISO = (dateStr) => {
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const formatDateTime = (isoStr) => {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Component ─────────────────────────────────────────────────────────────────

const ResourceBookingPage = () => {
  const { resourceId } = useParams();
  const navigate       = useNavigate();

  const [resource, setResource]           = useState(null);
  const [blockedSlots, setBlockedSlots]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [selectedSlot, setSelectedSlot]   = useState(null);
  const [purpose, setPurpose]             = useState("");
  const [attendees, setAttendees]         = useState("");
  const [submitting, setSubmitting]       = useState(false);
  const [submitError, setSubmitError]     = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [successMessage, setSuccessMessage]   = useState(null);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchBlockedSlots = async () => {
    const res = await axiosClient.get(
      `/api/bookings/public/calendar?resourceId=${resourceId}`
    );
    setBlockedSlots(res.data.data || res.data || []);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resourceRes] = await Promise.all([
          axiosClient.get(`/api/resources/${resourceId}`),
        ]);
        setResource(resourceRes.data.data || resourceRes.data);
        await fetchBlockedSlots();
      } catch {
        setError("Failed to load resource details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [resourceId]);

  // ── Calendar events ───────────────────────────────────────────────────────

  const blockedEvents = blockedSlots.map((slot) => ({
    id: "blocked-" + slot.id,
    title: "🔒 Booked",
    start: slot.startTime,
    end: slot.endTime,
    backgroundColor: "#94a3b8",
    borderColor: "transparent",
    textColor: "#fff",
    display: "block",
  }));

  // ── Submit handler ────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const now   = new Date();
    const start = new Date(selectedSlot.start);

    if (start <= now) {
      setValidationError("Please select a future time slot.");
      return;
    }
    if (!purpose.trim()) {
      setValidationError("Purpose is required.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      await createBooking({
        resourceId: Number(resourceId),
        startTime:  toLocalISO(selectedSlot.start),
        endTime:    toLocalISO(selectedSlot.end),
        purpose:    purpose.trim(),
        attendees:  attendees ? Number(attendees) : null,
      });
      setShowModal(false);
      setPurpose("");
      setAttendees("");
      setSelectedSlot(null);
      setSuccessMessage("Booking submitted! Awaiting admin approval.");
      await fetchBlockedSlots();
    } catch (err) {
      const conflict = err.response?.data;
      if (err.response?.status === 409) {
        setSubmitError(
          `This resource is already booked from ${conflict.conflictingSlot?.start} to ${conflict.conflictingSlot?.end}`
        );
      } else {
        setSubmitError("Failed to create booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setValidationError(null);
    setSubmitError(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="animate-slide-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Facilities
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {!loading && resource && (
        <>
          {/* Resource info card */}
          <div className="premium-glass rounded-2xl p-6 mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              {resource.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              {resource.location && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {resource.location}
                </span>
              )}
              {resource.capacity && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {resource.capacity} people
                </span>
              )}
              {resource.availableFrom && resource.availableTo && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {resource.availableFrom} – {resource.availableTo}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Click and drag on the calendar to select a time slot.
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-500 hover:text-emerald-700 transition-colors ml-4"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Calendar card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              selectable={true}
              selectMirror={true}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              scrollTime="08:00:00"
              weekends={true}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              events={blockedEvents}
              select={(info) => {
                setSelectedSlot({ start: info.startStr, end: info.endStr });
                setShowModal(true);
                setValidationError(null);
                setSubmitError(null);
              }}
              eventClick={() => {}}
              height="auto"
              eventDisplay="block"
              nowIndicator={true}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
              Already booked
            </span>
            <span className="text-slate-400">
              · Select any white slot to create a booking
            </span>
          </div>
        </>
      )}

      {/* ── Booking modal ────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Card */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">New Booking</h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Selected time (read only) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">
                <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">
                  Selected time
                </p>
                <p className="font-semibold">{formatDateTime(selectedSlot?.start)}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  → {formatDateTime(selectedSlot?.end)}
                </p>
              </div>

              {/* Resource (read only) */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Resource:</span>
                <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {resource?.name}
                </span>
              </div>

              {/* Validation / submit error */}
              {(validationError || submitError) && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{validationError || submitError}</span>
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Describe the purpose of this booking…"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all duration-200 hover:border-slate-300 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {purpose.length}/500
                </p>
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Attendees{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  min={1}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all duration-200 hover:border-slate-300"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-900 text-white text-sm font-bold hover:bg-primary-800 transition-all duration-200 hover:shadow-lg hover:shadow-primary-900/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Booking…
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceBookingPage;
