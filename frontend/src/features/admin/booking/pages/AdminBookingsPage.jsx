import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import { getAllBookings, approveBooking, rejectBooking, cancelBooking, restoreBooking } from "../../../../api/bookingApi";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED", "PENDING_REVIEW"];

const STATUS_BADGE = {
  PENDING:        "bg-amber-100 text-amber-700",
  APPROVED:       "bg-emerald-100 text-emerald-700",
  REJECTED:       "bg-red-100 text-red-700",
  CANCELLED:      "bg-slate-100 text-slate-500",
  PENDING_REVIEW: "bg-purple-100 text-purple-700",
};

// ── Component ─────────────────────────────────────────────────────────────────

const AdminBookingsPage = () => {
  const [bookings, setBookings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [statusFilter, setStatusFilter]   = useState("ALL");
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [rejectReason, setRejectReason]   = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllBookings();
      const data = res.data.data || res.data || [];
      const arr = Array.isArray(data) ? data : [];
      setBookings(arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleApprove = async (booking) => {
    setActionLoading(true);
    try {
      await approveBooking(booking.id);
      fetchBookings();
    } catch {
      setError("Failed to approve booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await rejectBooking(rejectTarget.id, rejectReason);
      setRejectTarget(null);
      setRejectReason("");
      fetchBookings();
    } catch {
      setError("Failed to reject booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (booking) => {
    setActionLoading(true);
    try {
      await restoreBooking(booking.id);
      fetchBookings();
    } catch {
      setError("Failed to restore booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (booking) => {
    setActionLoading(true);
    try {
      await cancelBooking(booking.id);
      fetchBookings();
    } catch {
      setError("Failed to cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = statusFilter === "ALL"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const countFor = (status) =>
    status === "ALL"
      ? bookings.length
      : bookings.filter((b) => b.status === status).length;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Review and manage all facility booking requests.
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <CalendarCheck className="h-5 w-5" />
          <span className="text-sm font-medium text-slate-500">
            {bookings.length} total bookings
          </span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === s
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s === "ALL"
              ? "All"
              : s === "PENDING_REVIEW"
              ? "Review"
              : s.charAt(0) + s.slice(1).toLowerCase()}
            <span
              className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold ${
                statusFilter === s ? "bg-white/20 text-white" : "bg-white text-slate-500"
              }`}
            >
              {countFor(s)}
            </span>
          </button>
        ))}
      </div>

      {/* Summary */}
      {!loading && !error && (
        <p className="text-xs text-slate-500 mb-4 font-medium">
          Showing {filtered.length} of {bookings.length} bookings
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-slate-600 font-semibold">No bookings found</p>
          <p className="text-slate-400 text-sm mt-1">No bookings match the selected filter.</p>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
            >
              {/* Icon */}
              <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                📅
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">
                  {booking.resourceName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Booked by {booking.userName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
                </p>
                {booking.purpose && (
                  <p className="text-xs text-slate-500 italic mt-0.5 truncate">
                    {booking.purpose}
                  </p>
                )}
              </div>

              {/* Attendees */}
              {booking.attendees && (
                <span className="text-xs text-slate-500 hidden md:block shrink-0">
                  {booking.attendees} people
                </span>
              )}

              {/* Status badge */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_BADGE[booking.status] ?? "bg-slate-100 text-slate-500"}`}
              >
                {booking.status === "PENDING_REVIEW"
                  ? "Pending review"
                  : booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
              </span>

              {/* Action buttons — PENDING */}
              {booking.status === "PENDING" && (
                <div className="flex items-center gap-1 ml-1 shrink-0">
                  <button
                    onClick={() => handleApprove(booking)}
                    disabled={actionLoading}
                    title="Approve"
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { setRejectTarget(booking); setRejectReason(""); }}
                    disabled={actionLoading}
                    title="Reject"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <XCircle className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {/* Action buttons — PENDING_REVIEW */}
              {booking.status === "PENDING_REVIEW" && (
                <div className="flex items-center gap-1 ml-1 shrink-0">
                  <button
                    onClick={() => handleRestore(booking)}
                    disabled={actionLoading}
                    title="Restore"
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleCancel(booking)}
                    disabled={actionLoading}
                    title="Cancel"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <XCircle className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl animate-slide-up">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Reject Booking</h2>
            <p className="text-sm text-slate-600 mb-4">
              Provide a reason for rejecting this booking by{" "}
              <span className="font-semibold text-slate-800">{rejectTarget.userName}</span> for{" "}
              <span className="font-semibold text-slate-800">{rejectTarget.resourceName}</span>.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Enter rejection reason..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all duration-200 hover:border-slate-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rejecting…
                  </>
                ) : (
                  "Confirm Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBookingsPage;
