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
      const matchesQuery =
        !normalizedQuery ||
        `${stay.title} ${stay.location}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesRegion =
        (region === "Maharashtra" && /Maharashtra/i.test(stay.location)) ||
        (region === "Goa" && /Goa/i.test(stay.location)) ||
        (region === "Rajasthan" && /Rajasthan/i.test(stay.location)) ||
        (region === "Delhi" && /Delhi/i.test(stay.location)) ||
        (region === "Kerala" && /Kerala/i.test(stay.location)) ||
        (region === "United States" && /United States/i.test(stay.location)) ||
        (region === "United Kingdom" &&
          /United Kingdom/i.test(stay.location)) ||
        (region === "Russia" && /Russia/i.test(stay.location)) ||
        (region === "Dubai" && /Dubai/i.test(stay.location)) ||
        (region === "Japan" && /Japan/i.test(stay.location));
      return matchesQuery && (region ? matchesRegion : isAdmin);
    });
  }, [availableStays, isAdmin, query, region]);

  const selectedLocation = region;

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

        {filteredStays.length > 0 && (selectedLocation || isAdmin) ? (
          <StaySection stays={filteredStays} />
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
