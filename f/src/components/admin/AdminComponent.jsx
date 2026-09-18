import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Header from "../Header";
import {
  createListing,
  deleteListing,
  getAccounts,
  getBookings,
  getListings,
  updateListing,
} from "../../api/listingApi";
import { getCurrentAccount } from "../../services/auth";

function AdminComponent() {
  const account = getCurrentAccount();
  const [data, setData] = useState({
    listings: [],
    accounts: [],
    bookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationForm, setLocationForm] = useState({
    title: "",
    country: "",
    state: "",
    price: "",
    image: "",
  });
  const [locationMessage, setLocationMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showLocationManagement, setShowLocationManagement] = useState(false);

  useEffect(() => {
    if (account?.role !== "ADMIN") return;
    Promise.all([getListings(), getAccounts(), getBookings()])
      .then(([listings, accounts, bookings]) =>
        setData({
          listings: listings.data,
          accounts: accounts.data,
          bookings: bookings.data,
        }),
      )
      .catch(() =>
        setError(
          "Dashboard data could not be loaded. Check that the backend is running.",
        ),
      )
      .finally(() => setLoading(false));
  }, [account?.role]);

  if (account?.role !== "ADMIN")
    return <Navigate to="/admin/bookings" replace />;

  const recentBookings = [...data.bookings].sort(
    (left, right) =>
      new Date(right.createdAt || 0) - new Date(left.createdAt || 0),
  );
  const revenue = data.bookings.reduce(
    (total, booking) => total + Number(booking.payment?.totalPaid || 0),
    0,
  );
  const estimatedProfit = Math.round(revenue * 0.15);
  const now = Date.now();
  const currentPeriod = data.bookings.filter(
    (booking) =>
      now - new Date(booking.createdAt || 0).getTime() <= 30 * 86400000,
  ).length;
  const previousPeriod = data.bookings.filter((booking) => {
    const age = now - new Date(booking.createdAt || 0).getTime();
    return age > 30 * 86400000 && age <= 60 * 86400000;
  }).length;
  const growth = previousPeriod
    ? Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100)
    : currentPeriod
      ? 100
      : 0;
  const averageBooking = data.bookings.length
    ? Math.round(revenue / data.bookings.length)
    : 0;
  const guestsHosted = data.bookings.reduce(
    (total, booking) => total + Number(booking.billing?.guests || 0),
    0,
  );
  const userAccounts = data.accounts.filter(
    (item) => item.role !== "ADMIN",
  ).length;
  const adminAccounts = data.accounts.filter(
    (item) => item.role === "ADMIN",
  ).length;
  const locationCounts = data.bookings.reduce((counts, booking) => {
    const location = booking.listingLocation || "Unknown location";
    counts[location] = (counts[location] || 0) + 1;
    return counts;
  }, {});
  const topLocation = Object.entries(locationCounts).sort(
    (left, right) => right[1] - left[1],
  )[0];
  const metricSummaries = {
    listings: [
      data.listings.length,
      "Published locations currently available to guests.",
    ],
    accounts: [
      data.accounts.length,
      `${userAccounts} user accounts and ${adminAccounts} admin accounts are stored.`,
    ],
    bookings: [
      data.bookings.length,
      "Confirmed reservations stored in the booking history.",
    ],
    revenue: [
      `₹${revenue.toLocaleString()}`,
      `Average booking value is ₹${averageBooking.toLocaleString()}.`,
    ],
    profit: [
      `₹${estimatedProfit.toLocaleString()}`,
      "Estimated at a 15% operating margin from collected revenue.",
    ],
    growth: [
      `${growth >= 0 ? "+" : ""}${growth}%`,
      `${currentPeriod} bookings in the last 30 days versus ${previousPeriod} previously.`,
    ],
    average: [
      `₹${averageBooking.toLocaleString()}`,
      "Average recorded value per confirmed reservation.",
    ],
    guests: [
      guestsHosted,
      "Total guests included across confirmed reservations.",
    ],
    topLocation: [
      topLocation ? topLocation[0] : "No data",
      topLocation
        ? `${topLocation[1]} booking${topLocation[1] === 1 ? "" : "s"} recorded here.`
        : "A destination will appear after the first booking.",
    ],
  };
  const countries = [
    ...new Set(
      data.listings.map((listing) => listing.country || "Unspecified"),
    ),
  ];
  const states = [
    ...new Set(
      data.listings.map(
        (listing) => listing.state || listing.location || "Unspecified",
      ),
    ),
  ];

  const updateLocation = (event) =>
    setLocationForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const addLocation = async (event) => {
    event.preventDefault();
    setLocationMessage("");
    try {
      const response = await createListing({
        ...locationForm,
        location: `${locationForm.state}, ${locationForm.country}`,
        price: Number(locationForm.price),
        tag: "New location",
        rating: 5,
        reviews: 0,
      });
      setData((current) => ({
        ...current,
        listings: [...current.listings, response.data],
      }));
      setLocationForm({
        title: "",
        country: "",
        state: "",
        price: "",
        image: "",
      });
      setLocationMessage("Location added successfully.");
    } catch {
      setLocationMessage(
        "Location could not be added. Check the backend connection.",
      );
    }
  };

  const startEditing = (listing) => {
    setEditingId(listing.id);
    setLocationForm({
      title: listing.title || "",
      country: listing.country || "",
      state: listing.state || "",
      price: listing.price || "",
      image: listing.image || "",
    });
    setLocationMessage("Editing location.");
  };

  const saveLocation = async (event) => {
    event.preventDefault();
    setLocationMessage("");
    try {
      const response = await updateListing(editingId, {
        ...locationForm,
        location: `${locationForm.state}, ${locationForm.country}`,
        price: Number(locationForm.price),
        tag: "Updated location",
        rating: 5,
        reviews: 0,
      });
      setData((current) => ({
        ...current,
        listings: current.listings.map((listing) =>
          listing.id === editingId ? response.data : listing,
        ),
      }));
      setEditingId(null);
      setLocationForm({
        title: "",
        country: "",
        state: "",
        price: "",
        image: "",
      });
      setLocationMessage("Location updated successfully.");
    } catch {
      setLocationMessage("Location could not be updated.");
    }
  };

  const removeLocation = async (id) => {
    if (
      !window.confirm(
        "Remove this location? Existing booking details will be kept.",
      )
    )
      return;
    try {
      await deleteListing(id);
      setData((current) => ({
        ...current,
        listings: current.listings.filter((listing) => listing.id !== id),
      }));
      setLocationMessage("Location removed. Booking history was kept.");
    } catch {
      setLocationMessage("Location could not be removed.");
    }
  };

  return (
    <div className="page-shell">
      <Header />
      <main className="dashboard-page">
        <div className="admin-heading">
          <div>
            <p className="eyebrow dark">Operations overview</p>
            <h1>Admin dashboard</h1>
            <p>Monitor stays, accounts, and confirmed bookings in one place.</p>
          </div>
          <div className="admin-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setShowLocationManagement((visible) => !visible);
                setSelectedMetric(null);
              }}
            >
              {showLocationManagement ? "Hide locations" : "Manage Location"}
            </button>
            <Link to="/admin/bookings" className="primary-btn">
              Open bookings
            </Link>
          </div>
        </div>

        {loading && (
          <div className="detail-empty">
            <h2>Loading dashboard...</h2>
          </div>
        )}
        {error && (
          <div className="detail-empty">
            <h2>Dashboard unavailable</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="dashboard-stats" aria-label="Dashboard totals">
              {[
                [
                  "listings",
                  "Total stays",
                  data.listings.length,
                  "Published listings",
                ],
                [
                  "accounts",
                  "Accounts",
                  data.accounts.length,
                  `${userAccounts} users · ${adminAccounts} admins`,
                ],
                [
                  "bookings",
                  "Bookings",
                  data.bookings.length,
                  "Confirmed reservations",
                ],
                [
                  "revenue",
                  "Collected",
                  `₹${revenue.toLocaleString()}`,
                  "Recorded booking value",
                ],
                [
                  "profit",
                  "Estimated profit",
                  `₹${estimatedProfit.toLocaleString()}`,
                  "15% operating margin",
                ],
                [
                  "growth",
                  "Booking growth",
                  `${growth >= 0 ? "+" : ""}${growth}%`,
                  "Compared with previous 30 days",
                ],
                [
                  "average",
                  "Average booking",
                  `₹${averageBooking.toLocaleString()}`,
                  "Average value per reservation",
                ],
                [
                  "guests",
                  "Guests hosted",
                  guestsHosted,
                  "Total guests across bookings",
                ],
                [
                  "topLocation",
                  "Top destination",
                  topLocation ? topLocation[0] : "No data",
                  topLocation
                    ? `${topLocation[1]} bookings`
                    : "Awaiting bookings",
                ],
              ].map(([key, label, value, hint]) => (
                <button
                  type="button"
                  aria-pressed={selectedMetric === key}
                  className={
                    selectedMetric === key
                      ? "dashboard-stat selected"
                      : "dashboard-stat"
                  }
                  key={key}
                  onClick={() =>
                    setSelectedMetric(selectedMetric === key ? null : key)
                  }
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{hint}</small>
                  <em>
                    {selectedMetric === key
                      ? "Showing details"
                      : "View details"}
                  </em>
                </button>
              ))}
            </section>

            {selectedMetric && (
              <section className="dashboard-section metric-detail">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow dark">Selected field</p>
                    <h2>
                      {selectedMetric === "listings"
                        ? "Stay details"
                        : selectedMetric === "accounts"
                          ? "Account details"
                          : selectedMetric === "bookings"
                            ? "Booking details"
                            : selectedMetric === "revenue"
                              ? "Revenue details"
                              : selectedMetric === "profit"
                                ? "Profit details"
                                : selectedMetric === "growth"
                                  ? "Growth details"
                                  : selectedMetric === "average"
                                    ? "Average booking details"
                                    : selectedMetric === "guests"
                                      ? "Guest details"
                                      : "Top destination details"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setSelectedMetric(null)}
                  >
                    Hide details
                  </button>
                </div>
                <div className="metric-summary">
                  <span>Current value</span>
                  <strong>{metricSummaries[selectedMetric][0]}</strong>
                  <p>{metricSummaries[selectedMetric][1]}</p>
                </div>

                {selectedMetric === "listings" && (
                  <div className="dashboard-list">
                    {data.listings.map((listing) => (
                      <div className="dashboard-row" key={listing.id}>
                        <div>
                          <strong>{listing.title}</strong>
                          <span>
                            {listing.location ||
                              `${listing.state || ""}, ${listing.country || ""}`}
                          </span>
                        </div>
                        <strong>
                          ₹{Number(listing.price || 0).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
                {selectedMetric === "accounts" && (
                  <div className="dashboard-list">
                    {data.accounts.map((item) => (
                      <div className="dashboard-row" key={item.id}>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.email}</span>
                        </div>
                        <strong>{item.role}</strong>
                      </div>
                    ))}
                  </div>
                )}
                {selectedMetric === "bookings" && (
                  <div className="dashboard-list">
                    {recentBookings.map((booking) => (
                      <div className="dashboard-row" key={booking.id}>
                        <div>
                          <strong>{booking.listingTitle}</strong>
                          <span>
                            {booking.listingLocation || "Location not recorded"}{" "}
                            · {booking.billing?.guestName || "Guest"}
                          </span>
                        </div>
                        <strong>
                          {booking.payment?.currency}
                          {Number(
                            booking.payment?.totalPaid || 0,
                          ).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {showLocationManagement && (
              <section className="dashboard-section location-management">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow dark">Location management</p>
                    <h2>Add country and state</h2>
                  </div>
                  <span>
                    {countries.length} countries · {states.length} states
                  </span>
                </div>

                <form
                  className="location-form"
                  onSubmit={editingId ? saveLocation : addLocation}
                >
                  <input
                    name="title"
                    value={locationForm.title}
                    onChange={updateLocation}
                    placeholder="Listing title"
                    required
                  />
                  <input
                    name="country"
                    value={locationForm.country}
                    onChange={updateLocation}
                    placeholder="Country"
                    required
                  />
                  <input
                    name="state"
                    value={locationForm.state}
                    onChange={updateLocation}
                    placeholder="State / region"
                    required
                  />
                  <input
                    name="price"
                    type="number"
                    min="1"
                    value={locationForm.price}
                    onChange={updateLocation}
                    placeholder="Nightly price"
                    required
                  />
                  <input
                    name="image"
                    value={locationForm.image}
                    onChange={updateLocation}
                    placeholder="Image URL (optional)"
                  />
                  <button type="submit" className="primary-btn">
                    {editingId ? "Save changes" : "Add location"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setEditingId(null);
                        setLocationForm({
                          title: "",
                          country: "",
                          state: "",
                          price: "",
                          image: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>

                {locationMessage && (
                  <p className="login-note" role="status">
                    {locationMessage}
                  </p>
                )}
              </section>
            )}

            {showLocationManagement && (
              <section className="dashboard-section">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow dark">Location directory</p>
                    <h2>All locations</h2>
                  </div>
                  <span>{data.listings.length} total</span>
                </div>

                {data.listings.length === 0 ? (
                  <p className="dashboard-empty">
                    No locations have been added yet.
                  </p>
                ) : (
                  <div className="location-directory">
                    {data.listings.map((listing) => (
                      <div className="location-row" key={listing.id}>
                        <div>
                          <strong>{listing.title}</strong>
                          <span>
                            {listing.state ||
                              listing.location ||
                              "State not set"}
                            , {listing.country || "Country not set"}
                          </span>
                        </div>
                        <span>
                          {listing.location ||
                            `${listing.state || ""}, ${listing.country || ""}`}
                        </span>
                        <strong>
                          ₹{Number(listing.price || 0).toLocaleString()} / night
                        </strong>
                        <div className="location-actions">
                          <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => startEditing(listing)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="remove-booking-btn"
                            onClick={() => removeLocation(listing.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {selectedMetric === "bookings" && (
              <section className="dashboard-section">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow dark">Booking records</p>
                    <h2>All bookings</h2>
                  </div>
                  <Link to="/admin/bookings">Manage bookings</Link>
                </div>

                {recentBookings.length === 0 ? (
                  <p className="dashboard-empty">
                    No bookings have been created yet.
                  </p>
                ) : (
                  <div className="dashboard-list">
                    {recentBookings.map((booking) => (
                      <div className="dashboard-row" key={booking.id}>
                        <div>
                          <strong>{booking.listingTitle}</strong>
                          <span>
                            {booking.billing?.guestName ||
                              booking.accountName ||
                              "Guest"}{" "}
                            · {booking.checkIn || "Date pending"}
                          </span>
                        </div>
                        <strong>
                          {booking.payment?.currency}
                          {Number(
                            booking.payment?.totalPaid || 0,
                          ).toLocaleString()}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminComponent;
