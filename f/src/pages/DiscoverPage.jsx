import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import StaySection from "../components/StaySection";
import { stays } from "../data/listings";
import SearchField from "../components/fields/SearchField";
import { getListings } from "../api/listingApi";
import { getCurrentAccount } from "../services/auth";

const regions = [
  "Maharashtra",
  "Goa",
  "Rajasthan",
  "Delhi",
  "Kerala",
  "United States",
  "United Kingdom",
  "Russia",
  "Dubai",
  "Japan",
];
function DiscoverPage() {
  const isAdmin = getCurrentAccount()?.role === "ADMIN";
  const [region, setRegion] = useState("");
  const [query, setQuery] = useState("");
  const [availableStays, setAvailableStays] = useState(stays);

  useEffect(() => {
    getListings()
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const staysByTitle = new Map(
            stays.map((stay) => [stay.title.toLowerCase(), stay]),
          );
          response.data.forEach((stay) =>
            staysByTitle.set(stay.title.toLowerCase(), stay),
          );
          setAvailableStays([...staysByTitle.values()]);
        }
      })
      .catch(() => setAvailableStays(stays));
  }, []);

  const filteredStays = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return availableStays.filter((stay) => {
      const searchableLocation = [stay.location, stay.state, stay.country]
        .filter(Boolean)
        .join(" ");
      const locationParts = String(stay.location || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      const listingRegions = [
        stay.state,
        stay.country,
        !stay.state && !stay.country ? locationParts.at(-1) : null,
      ]
        .filter(Boolean)
        .map((value) => value.toLowerCase());
      const matchesQuery =
        !normalizedQuery ||
        `${stay.title} ${searchableLocation}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesRegion =
        region && listingRegions.includes(region.toLowerCase());
      return matchesQuery && (region ? matchesRegion : isAdmin);
    });
  }, [availableStays, isAdmin, query, region]);

  const selectedLocation = region;
  const visibleStays = filteredStays
    .filter((stay, index, listings) => {
      const city = String(stay.location || stay.title)
        .split(",")[0]
        .trim()
        .toLowerCase();
      return (
        listings.findIndex(
          (listing) =>
            String(listing.location || listing.title)
              .split(",")[0]
              .trim()
              .toLowerCase() === city,
        ) === index
      );
    })
    .slice(0, 12);

  return (
    <div className="page-shell">
      <Header />
      <main className="discover-page">
        <section className="page-intro">
          <div>
            <p className="eyebrow">A better place to begin</p>
            <h1>
              {selectedLocation
                ? `Find your next stay in ${selectedLocation}.`
                : isAdmin
                  ? "All locations."
                  : "Choose a destination."}
            </h1>
            <p>
              Browse considered spaces for long weekends, slow seasons, and the
              stories you have not written yet.
            </p>
          </div>
          <div className="intro-image">
            <img
              src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1100&q=85"
              alt="Sunlit beach house overlooking the sea"
            />
          </div>
        </section>

        <section className="browse-tools" aria-label="Stay filters">
          <SearchField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="filter-pills">
            {regions.map((item) => (
              <button
                type="button"
                className={
                  region === item ? "filter-pill selected" : "filter-pill"
                }
                key={item}
                onClick={() =>
                  setRegion((current) => (current === item ? "" : item))
                }
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {visibleStays.length > 0 && (selectedLocation || isAdmin) ? (
          <StaySection stays={visibleStays} />
        ) : (
          <div className="detail-empty">
            <h2>
              {selectedLocation
                ? "No stays found"
                : "Select a location to begin"}
            </h2>
            <p>
              {selectedLocation
                ? "Try another state or country."
                : "Choose a state or country above to see available stays."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DiscoverPage;
