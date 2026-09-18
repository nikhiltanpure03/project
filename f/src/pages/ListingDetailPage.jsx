import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { stays } from "../data/listings";
import { createBooking, getListingById } from "../api/listingApi";
import BookingFields from "../components/booking/BookingFields";
import BillingFields from "../components/booking/BillingFields";
import PaymentFields from "../components/booking/PaymentFields";
import { getCurrentAccount } from "../services/auth";

function ListingDetailPage() {
  const { id } = useParams();
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    guestName: "",
    mobileNumber: "",
    idProofType: "",
    idProofNumber: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    card: "",
    guestType: "indian",
  });
  const [paid, setPaid] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    return Math.max(
      0,
      Math.ceil(
        (new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000,
      ),
    );
  }, [booking.checkIn, booking.checkOut]);

  const updateBooking = (event) =>
    setBooking((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submitBooking = async () => {
    setSavingBooking(true);
    setBookingError("");

    try {
      const account = getCurrentAccount();
      if (!account) {
        setBookingError("Please sign in before booking this stay.");
        return;
      }
      await createBooking({
        listingId: stay.id,
        listing: stay,
        accountId: account.id,
        accountName: account.name,
        accountEmail: account.email,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        billing: {
          guestName: booking.guestName.trim(),
          guestType: booking.guestType,
          mobileNumber: booking.mobileNumber.trim(),
          idProofType: booking.idProofType,
          idProofNumber: booking.idProofNumber.trim(),
          guests: Number(booking.guests),
        },
        payment: {
          currency,
          nightlyPrice,
          subtotal,
          serviceFee,
          taxes,
          totalPaid: advance,
          cardLastFour: booking.card.replace(/\D/g, "").slice(-4),
        },
      });
      setPaid(true);
    } catch (error) {
      const responseMessage = error.response?.data;
      const detail =
        typeof responseMessage === "string"
          ? responseMessage
          : responseMessage?.message;
      setBookingError(
        detail ||
          (error.request && !error.response
            ? "The booking server could not be reached at http://localhost:8080. Start the backend on port 8080 and try again."
            : "We could not save your booking. Please check the booking details and try again."),
      );
    } finally {
      setSavingBooking(false);
    }
  };

  useEffect(() => {
    getListingById(id)
      .then((response) => setStay(response.data))
      .catch(() =>
        setStay(stays.find((item) => String(item.id) === id) || null),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell detail-shell">
        <Link to="/" className="back-link">
          ← Back to homes
        </Link>
        <div className="detail-empty">
          <h2>Loading listing...</h2>
        </div>
      </div>
    );
  }

  if (!stay) {
    return (
      <div className="page-shell detail-shell">
        <Link to="/" className="back-link">
          ← Back to homes
        </Link>
        <div className="detail-empty">
          <h2>Listing not found</h2>
          <p>The place you are looking for no longer exists or was removed.</p>
        </div>
      </div>
    );
  }

  const isIndianGuest = booking.guestType === "indian";
  const currency = isIndianGuest ? "₹" : "$";
  const nightlyPrice = isIndianGuest ? stay.price * 83 : stay.price;
  const subtotal = nights * nightlyPrice;
  const serviceFee = Math.round(subtotal * 0.12);
  const taxes = Math.round(subtotal * 0.08);
  const advance = subtotal + serviceFee + taxes;
  const formattedCheckIn = booking.checkIn
    ? new Date(`${booking.checkIn}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not selected";
  const formattedCheckOut = booking.checkOut
    ? new Date(`${booking.checkOut}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not selected";
  const maskedCard = booking.card
    ? `•••• ${booking.card.replace(/\D/g, "").slice(-4)}`
    : "Not provided";

  if (paid) {
    return (
      <div className="page-shell detail-shell">
        <Link to="/discover" className="back-link">
          Back to stays
        </Link>
        <div className="booking-success">
          <span className="success-mark">✓</span>
          <p className="eyebrow">Payment accepted</p>
          <h1>Your booking is confirmed.</h1>
          <p>
            Your {isIndianGuest ? "Indian guest" : "international guest"}{" "}
            advance payment of {currency}
            {advance.toLocaleString()} was accepted for {stay.title}.
          </p>

          <div className="booking-details-card">
            <h2>Booking details</h2>
            <div className="booking-detail-grid">
              <div>
                <span>Stay</span>
                <strong>{stay.title}</strong>
              </div>
              <div>
                <span>Booked by</span>
                <strong>{booking.guestName}</strong>
              </div>
              <div>
                <span>Guest type</span>
                <strong>
                  {isIndianGuest ? "Indian guest" : "International guest"}
                </strong>
              </div>
              <div>
                <span>Check-in</span>
                <strong>{formattedCheckIn}</strong>
              </div>
              <div>
                <span>Check-out</span>
                <strong>{formattedCheckOut}</strong>
              </div>
              <div>
                <span>Nights</span>
                <strong>{nights}</strong>
              </div>
              <div>
                <span>Guests</span>
                <strong>
                  {booking.guests} guest{Number(booking.guests) > 1 ? "s" : ""}
                </strong>
              </div>
              <div>
                <span>Nightly rate</span>
                <strong>
                  {currency}
                  {nightlyPrice.toLocaleString()}
                </strong>
              </div>
              <div>
                <span>Card</span>
                <strong>{maskedCard}</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>
                  {currency}
                  {subtotal.toLocaleString()}
                </strong>
              </div>
              <div>
                <span>Service fee</span>
                <strong>
                  {currency}
                  {serviceFee.toLocaleString()}
                </strong>
              </div>
              <div>
                <span>Taxes</span>
                <strong>
                  {currency}
                  {taxes.toLocaleString()}
                </strong>
              </div>
              <div className="booking-total">
                <span>Total paid</span>
                <strong>
                  {currency}
                  {advance.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          <Link to="/discover" className="primary-btn">
            Explore more stays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell detail-shell">
      <Link to="/" className="back-link">
        ← Back to homes
      </Link>

      <div className="detail-hero">
        <img src={stay.image} alt={stay.title} />
      </div>

      <div className="detail-content">
        <div>
          <p className="eyebrow dark">{stay.tag}</p>
          <h1>{stay.title}</h1>
          <p className="detail-location">{stay.location}</p>
        </div>

        <div className="detail-meta">
          <span>★ {stay.rating}</span>
          <span>{stay.reviews} reviews</span>
          <span>Entire home</span>
        </div>

        <div className="detail-card">
          <div className="detail-price-row">
            <strong>
              {currency}
              {nightlyPrice.toLocaleString()}
            </strong>
            <span>/ night</span>
          </div>
          <ul>
            <li>2 guests</li>
            <li>1 bedroom</li>
            <li>2 bathrooms</li>
            <li>Sea-view terrace</li>
          </ul>
          <div className="advance-booking">
            <BookingFields
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              guests={booking.guests}
              onChange={updateBooking}
            />
            <BillingFields
              guestName={booking.guestName}
              guestType={booking.guestType}
              mobileNumber={booking.mobileNumber}
              idProofType={booking.idProofType}
              idProofNumber={booking.idProofNumber}
              onChange={updateBooking}
              onGuestTypeChange={(guestType) =>
                setBooking((current) => ({ ...current, guestType }))
              }
            />
            <PaymentFields
              card={booking.card}
              onChange={updateBooking}
              currency={currency}
              nightlyPrice={nightlyPrice}
              nights={nights}
              advance={advance}
            />
            <button
              type="button"
              className="primary-btn"
              disabled={
                !booking.guestName.trim() ||
                !booking.mobileNumber.trim() ||
                !booking.idProofType ||
                !booking.idProofNumber.trim() ||
                !nights ||
                !booking.card ||
                savingBooking
              }
              onClick={submitBooking}
            >
              {savingBooking
                ? "Saving booking..."
                : `Pay advance ${currency}${(advance || nightlyPrice).toLocaleString()}`}
            </button>
            {bookingError && (
              <p className="booking-error" role="alert">
                {bookingError}
              </p>
            )}
            <small className="payment-note">
              Demo payment only. No real card is charged.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailPage;
