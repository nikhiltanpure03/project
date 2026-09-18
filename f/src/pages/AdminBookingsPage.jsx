import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  deleteBooking,
  getAccountBookings,
  getBookings,
} from "../api/listingApi";
import { getCurrentAccount } from "../services/auth";

function formatDate(value) {
  return value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not selected";
}

function formatMoney(payment) {
  return `${payment?.currency || ""}${Number(payment?.totalPaid || 0).toLocaleString()}`;
}

function maskProof(value) {
  if (!value) return "Not provided";
  return value.length > 4 ? `•••• ${value.slice(-4)}` : "••••";
}

function getBookingLocation(booking) {
  const locationParts = (booking.listingLocation || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const city = locationParts[0] || "Not provided";
  const state = booking.listingState || locationParts[1] || "Not provided";
  const country =
    booking.listingCountry ||
    (locationParts.length > 2 ? locationParts.at(-1) : "India");

  return { city, state, country };
}

function AdminBookingsPage() {
  const account = getCurrentAccount();
  const isAdmin = account?.role === "ADMIN";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadBookings = () => {
    setLoading(true);
    setError("");
    const request = isAdmin
      ? getBookings()
      : account
        ? getAccountBookings(account.id)
        : Promise.reject(new Error("Sign in required"));
    request
      .then((response) => {
        setBookings(response.data);
        setSelectedBooking(null);
      })
      .catch(() =>
        setError(
          account
            ? "Bookings could not be loaded. Check that the backend is running."
            : "Please sign in to view your bookings.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const removeBooking = (id) => {
    if (!window.confirm("Remove this booking?")) return;
    deleteBooking(id)
      .then(loadBookings)
      .catch(() => setError("Booking could not be removed."));
  };

  const printBill = (booking) => {
    setSelectedBooking(booking);
    window.setTimeout(() => window.print(), 0);
  };
  const selectedLocation = selectedBooking
    ? getBookingLocation(selectedBooking)
    : null;

  return (
    <div className="page-shell">
      <Header />
      <main className="admin-page">
        <div className="admin-heading">
          <div>
            <p className="eyebrow dark">Operations</p>
            <h1>{isAdmin ? "All bookings" : "My bookings"}</h1>
            <p>
              {isAdmin
                ? "Review every confirmed stay and payment total."
                : "Review your confirmed stays and payment totals."}{" "}
              Total bookings: {bookings.length}.
            </p>
          </div>
          <div className="admin-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={loadBookings}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="detail-empty">
            <h2>Loading bookings...</h2>
          </div>
        )}
        {error && (
          <div className="detail-empty">
            <h2>Could not load bookings</h2>
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && bookings.length === 0 && (
          <div className="detail-empty">
            <h2>No bookings yet</h2>
            <p>Confirmed bookings will appear here.</p>
          </div>
        )}
        {!loading && !error && bookings.length > 0 && (
          <div className="booking-table-wrap">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Stay</th>
                  <th>Booked by</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Guest type</th>
                  <th>Status</th>
                  <th>Total paid</th>
                  <th>Card</th>
                  <th>Booked</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.listingTitle}</strong>
                      <span>Booking #{booking.id}</span>
                    </td>
                    <td>
                      {booking.billing?.guestName ||
                        booking.accountName ||
                        "Not provided"}
                      <span>
                        {booking.billing?.mobileNumber || "Mobile not provided"}
                      </span>
                      <span>{booking.accountEmail || ""}</span>
                    </td>
                    <td>
                      {formatDate(booking.checkIn)}
                      <span>to {formatDate(booking.checkOut)}</span>
                    </td>
                    <td>{booking.billing?.guests}</td>
                    <td>
                      {booking.billing?.guestType === "indian"
                        ? "Indian"
                        : "International"}
                    </td>
                    <td>
                      {booking.status || "CONFIRMED"} /{" "}
                      {booking.payment?.status || "PAID"}
                    </td>
                    <td>
                      {booking.payment?.currency}
                      {Number(booking.payment?.totalPaid || 0).toLocaleString()}
                    </td>
                    <td>•••• {booking.payment?.cardLastFour}</td>
                    <td>
                      {booking.createdAt
                        ? new Date(booking.createdAt).toLocaleDateString(
                            "en-GB",
                          )
                        : "—"}
                    </td>
                    <td>
                      <div className="booking-actions">
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() =>
                            setSelectedBooking(
                              selectedBooking?.id === booking.id
                                ? null
                                : booking,
                            )
                          }
                        >
                          {selectedBooking?.id === booking.id ? "Hide" : "View"}
                        </button>
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => printBill(booking)}
                        >
                          Print bill
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            className="remove-booking-btn"
                            onClick={() => removeBooking(booking.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {selectedBooking && (
          <section
            className="booking-detail-panel"
            aria-label="Booking details"
          >
            <div className="booking-detail-heading">
              <div>
                <p className="eyebrow dark">Complete record</p>
                <h2>Booking #{selectedBooking.id}</h2>
              </div>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => printBill(selectedBooking)}
              >
                Print bill
              </button>
            </div>
            <div className="booking-detail-columns">
              <div>
                <h3>Booking</h3>
                <p>
                  <strong>Stay</strong>
                  {selectedBooking.listingTitle}
                </p>
                <p>
                  <strong>Listing ID</strong>
                  {selectedBooking.listingId}
                </p>
                <p>
                  <strong>City</strong>
                  {selectedLocation.city}
                </p>
                <p>
                  <strong>State</strong>
                  {selectedLocation.state}
                </p>
                <p>
                  <strong>Country</strong>
                  {selectedLocation.country}
                </p>
                <p>
                  <strong>Check-in</strong>
                  {formatDate(selectedBooking.checkIn)}
                </p>
                <p>
                  <strong>Check-out</strong>
                  {formatDate(selectedBooking.checkOut)}
                </p>
                <p>
                  <strong>Booking status</strong>
                  {selectedBooking.status || "CONFIRMED"}
                </p>
                <p>
                  <strong>Created</strong>
                  {selectedBooking.createdAt
                    ? new Date(selectedBooking.createdAt).toLocaleString(
                        "en-GB",
                      )
                    : "—"}
                </p>
              </div>
              <div>
                <h3>Billing</h3>
                <p>
                  <strong>Name</strong>
                  {selectedBooking.billing?.guestName || "Not provided"}
                </p>
                <p>
                  <strong>Mobile</strong>
                  {selectedBooking.billing?.mobileNumber || "Not provided"}
                </p>
                <p>
                  <strong>ID proof</strong>
                  {selectedBooking.billing?.idProofType || "—"}{" "}
                  {maskProof(selectedBooking.billing?.idProofNumber)}
                </p>
                <p>
                  <strong>Guest type</strong>
                  {selectedBooking.billing?.guestType || "—"}
                </p>
                <p>
                  <strong>Guests</strong>
                  {selectedBooking.billing?.guests || "—"}
                </p>
              </div>
              <div>
                <h3>Payment</h3>
                <p>
                  <strong>Payment status</strong>
                  {selectedBooking.payment?.status || "PAID"}
                </p>
                <p>
                  <strong>Nightly price</strong>
                  {selectedBooking.payment?.currency}
                  {Number(
                    selectedBooking.payment?.nightlyPrice || 0,
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Subtotal</strong>
                  {selectedBooking.payment?.currency}
                  {Number(
                    selectedBooking.payment?.subtotal || 0,
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Service fee</strong>
                  {selectedBooking.payment?.currency}
                  {Number(
                    selectedBooking.payment?.serviceFee || 0,
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Taxes</strong>
                  {selectedBooking.payment?.currency}
                  {Number(selectedBooking.payment?.taxes || 0).toLocaleString()}
                </p>
                <p>
                  <strong>Total paid</strong>
                  {formatMoney(selectedBooking.payment)}
                </p>
                <p>
                  <strong>Card</strong>••••{" "}
                  {selectedBooking.payment?.cardLastFour || "—"}
                </p>
              </div>
            </div>
          </section>
        )}
        {selectedBooking && (
          <section className="print-bill" aria-hidden="true">
            <p className="eyebrow">airbnb</p>
            <h1>Booking bill</h1>
            <p>Booking #{selectedBooking.id}</p>
            <hr />
            <h2>{selectedBooking.listingTitle}</h2>
            <p>
              {selectedBooking.billing?.guestName || "Guest"} ·{" "}
              {selectedBooking.billing?.guestType || "Guest"}
            </p>
            <p>
              {formatDate(selectedBooking.checkIn)} to{" "}
              {formatDate(selectedBooking.checkOut)}
            </p>
            <hr />
            <p>
              Nightly price: {selectedBooking.payment?.currency}
              {Number(
                selectedBooking.payment?.nightlyPrice || 0,
              ).toLocaleString()}
            </p>
            <p>
              Subtotal: {selectedBooking.payment?.currency}
              {Number(selectedBooking.payment?.subtotal || 0).toLocaleString()}
            </p>
            <p>
              Service fee: {selectedBooking.payment?.currency}
              {Number(
                selectedBooking.payment?.serviceFee || 0,
              ).toLocaleString()}
            </p>
            <p>
              Taxes: {selectedBooking.payment?.currency}
              {Number(selectedBooking.payment?.taxes || 0).toLocaleString()}
            </p>
            <h2>Total paid: {formatMoney(selectedBooking.payment)}</h2>
            <p>
              Payment card: •••• {selectedBooking.payment?.cardLastFour || "—"}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminBookingsPage;
