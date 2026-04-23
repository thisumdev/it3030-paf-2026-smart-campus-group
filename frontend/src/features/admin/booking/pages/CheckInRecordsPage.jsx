import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import {
  getCheckedInBookings,
  getNoShowBookings,
  restoreBooking,
  cancelBooking,
} from "../../../../api/bookingApi";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getLateness = (startTime, checkedInAt) => {
  if (!checkedInAt) return null;
  const diff = Math.round(
    (new Date(checkedInAt) - new Date(startTime)) / 60000
  );
  if (diff <= 0) return { label: "On time", color: "text-emerald-600" };
  if (diff <= 15) return { label: `${diff} min late`, color: "text-amber-600" };
  return { label: `${diff} min late`, color: "text-red-600" };
};

// ── Component ─────────────────────────────────────────────────────────────────

const CheckInRecordsPage = () => {
  const [checkedIn, setCheckedIn]         = useState([]);
  const [noShows, setNoShows]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab]         = useState("checkins");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [checkinRes, noshowRes] = await Promise.all([
        getCheckedInBookings(),
        getNoShowBookings(),
      ]);
      setCheckedIn(checkinRes.data.data || checkinRes.data || []);
      setNoShows(noshowRes.data.data || noshowRes.data || []);
    } catch {
      setError("Failed to load check-in records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRestore = async (booking) => {
    setActionLoading(true);
    try {
      await restoreBooking(booking.id);
      fetchData();
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
      fetchData();
    } catch {
      setError("Failed to cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const displayList = activeTab === "checkins" ? checkedIn : noShows;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Check-in Records</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Track attendance and manage no-show bookings.
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="h-5 w-5" />
          <span className="text-sm font-medium text-slate-500">
            {checkedIn.length} checked in · {noShows.length} pending review
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("checkins")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "checkins"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Checked In
          <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
            {checkedIn.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("noshows")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "noshows"
              ? "bg-purple-700 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <XCircle className="h-4 w-4" />
          Pending Review
          <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
            {noShows.length}
          </span>
        </button>
      </div>

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

      {/* Empty state */}
      {!loading && !error && displayList.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">
            {activeTab === "checkins" ? "📋" : "🎉"}
          </p>
          <p className="text-slate-600 font-semibold">
            {activeTab === "checkins"
              ? "No check-ins recorded yet"
              : "No pending reviews — all bookings are on track 🎉"}
          </p>
        </div>
      )}

      {/* ── Checked In list ───────────────────────────────────────────────── */}
      {!loading && !error && activeTab === "checkins" && checkedIn.length > 0 && (
        <div className="space-y-3">
          {checkedIn.map((booking) => {
            const lateness = getLateness(booking.startTime, booking.checkedInAt);
            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
              >
                {/* Icon */}
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  ✅
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
                    {formatDateTime(booking.startTime)} →{" "}
                    {formatDateTime(booking.endTime)}
                  </p>
                  {booking.purpose && (
                    <p className="text-xs text-slate-500 italic mt-0.5 truncate">
                      {booking.purpose}
                    </p>
                  )}
                </div>

                {/* Right: lateness + check-in time */}
                <div className="text-right shrink-0">
                  {lateness && (
                    <span className={`text-xs font-semibold ${lateness.color}`}>
                      {lateness.label}
                    </span>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    Checked in at {formatDateTime(booking.checkedInAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pending Review (no-shows) list ───────────────────────────────── */}
      {!loading && !error && activeTab === "noshows" && noShows.length > 0 && (
        <div className="space-y-3">
          {noShows.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
            >
              {/* Icon */}
              <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                ⚠️
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
                  {formatDateTime(booking.startTime)} →{" "}
                  {formatDateTime(booking.endTime)}
                </p>
                {booking.purpose && (
                  <p className="text-xs text-slate-500 italic mt-0.5 truncate">
                    {booking.purpose}
                  </p>
                )}
              </div>

              {/* Right: badge + action buttons */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                  Not checked in
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRestore(booking)}
                    disabled={actionLoading}
                    title="Restore"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <RotateCcw className="h-3.5 w-3.5" />}
                    Restore
                  </button>
                  <button
                    onClick={() => handleCancel(booking)}
                    disabled={actionLoading}
                    title="Cancel"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <XCircle className="h-3.5 w-3.5" />}
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CheckInRecordsPage;
