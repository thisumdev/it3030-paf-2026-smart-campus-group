import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import {
  getMyBookings,
  cancelBooking,
  getPublicCalendarEvents,
} from "../../../api/bookingApi";
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const statusColor = (status) => {
  if (status === "APPROVED")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "PENDING")
    return "bg-yellow-50 text-yellow-700 border border-yellow-200";
  return "bg-red-50 text-red-700 border border-red-200";
};

const eventBg = (status) => {
  if (status === "APPROVED") return "#22c55e";
  if (status === "PENDING") return "#eab308";
  return "#ef4444";
};

// ── Main Component ────────────────────────────────────────────────────────────

const BookingCalendar = () => {
  const [bookings, setBookings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [blockedSlots, setBlockedSlots]   = useState([]);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchData = async () => {
    try {
      setError(null);
      const [bookingsRes, blockedRes] = await Promise.all([
        getMyBookings(),
        getPublicCalendarEvents(),
      ]);
      setBookings(bookingsRes.data.data || bookingsRes.data || []);
      setBlockedSlots(blockedRes.data.data || blockedRes.data || []);
    } catch {
      setError("Failed to load calendar data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Calendar events ───────────────────────────────────────────────────────

  const myBookingIds = new Set(bookings.map((b) => b.id));

  const myEvents = bookings.map((b) => ({
    id: b.id,
    title: b.purpose,
    start: b.startTime,
    end: b.endTime,
    backgroundColor: eventBg(b.status),
    borderColor: "transparent",
    extendedProps: { ...b },
  }));

  const blockedEvents = blockedSlots
    .filter((b) => !myBookingIds.has(b.id))
    .map((b) => ({
      id: "blocked-" + b.id,
      title: "🔒 " + b.resourceName,
      start: b.startTime,
      end: b.endTime,
      backgroundColor: "#94a3b8",
      borderColor: "transparent",
      textColor: "#475569",
      display: "block",
      extendedProps: { isBlocked: true },
    }));

  const calendarEvents = [...myEvents, ...blockedEvents];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEventClick = (info) => {
    if (info.event.extendedProps.isBlocked) return;
    setSelectedBooking(info.event.extendedProps);
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setSelectedBooking(null);
      await fetchData();
    } catch {
      setError("Failed to cancel booking. Please try again.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Your scheduled facility bookings.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-6">
        {/* ── Left: Calendar ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Legend */}
          <div className="premium-glass rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                Approved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" />
                Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />
                Cancelled / Rejected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
                Others' bookings
              </span>
            </div>
          </div>

          {/* Calendar */}
          <div className="premium-glass rounded-2xl p-4">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              height="auto"
              eventDisplay="block"
              nowIndicator={true}
              scrollTime="08:00:00"
              weekends={true}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
            />
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            To book a facility, go to{" "}
            <a href="/user/facilities" className="text-slate-900 font-semibold underline">
              Facilities
            </a>{" "}
            and click "Book This Resource"
          </p>
        </div>

        {/* ── Right: Booking detail sidebar ──────────────────────────────── */}
        {selectedBooking && (
          <div className="w-80 shrink-0 animate-slide-left">
            <div className="premium-glass rounded-2xl p-5 sticky top-24">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Booking Details
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status badge */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-4 ${statusColor(selectedBooking.status)}`}
              >
                {selectedBooking.status}
              </span>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {selectedBooking.resourceName}
                    </p>
                    {selectedBooking.resourceLocation && (
                      <p className="text-slate-500 text-xs">
                        {selectedBooking.resourceLocation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <Clock className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                  <div>
                    <p className="font-medium">
                      {formatDateTime(selectedBooking.startTime)}
                    </p>
                    <p className="text-slate-500 text-xs">
                      → {formatDateTime(selectedBooking.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <Calendar className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                  <p className="text-slate-700">{selectedBooking.purpose}</p>
                </div>

                {selectedBooking.attendees && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Users className="h-4 w-4 shrink-0 text-slate-400" />
                    <p>
                      {selectedBooking.attendees}{" "}
                      {selectedBooking.attendees === 1 ? "attendee" : "attendees"}
                    </p>
                  </div>
                )}

                {selectedBooking.rejectionReason && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
                    <p className="font-semibold mb-0.5">Rejection reason:</p>
                    <p>{selectedBooking.rejectionReason}</p>
                  </div>
                )}

                {selectedBooking.checkedIn && (
                  <div className="flex items-center gap-2 text-emerald-700 text-xs bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Checked in at {formatDateTime(selectedBooking.checkedInAt)}
                  </div>
                )}
              </div>

              {/* Cancel button */}
              {(selectedBooking.status === "PENDING" ||
                selectedBooking.status === "APPROVED") && (
                <button
                  onClick={() => handleCancel(selectedBooking.id)}
                  className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
