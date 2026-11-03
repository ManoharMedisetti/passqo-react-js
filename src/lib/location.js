const CITY_KEY = "passqo-user-city";
const COUNTRY_KEY = "passqo-user-country";
const COORDS_KEY = "passqo-user-coords";

// Whitelist of allowed European countries (Ireland & wider European hubs)
const ALLOWED_EUROPEAN_COUNTRIES = new Set([
  "IE", "GB", "UK", "FR", "DE", "ES", "IT", "NL", "BE", "PT",
  "CH", "AT", "SE", "NO", "DK", "FI", "PL", "CZ", "HU", "GR", "HR"
]);

// Whitelist of valid Irish & European cities
const VALID_CITIES = new Set([
  "dublin", "cork", "galway", "limerick", "waterford", "drogheda",
  "dundalk", "swords", "kilkenny", "bray", "navan", "ennis", "tralee",
  "carlow", "sligo", "athlone", "wexford", "letterkenny", "mullingar",
  "belfast", "derry", "london", "paris", "berlin", "amsterdam",
  "barcelona", "madrid", "rome", "milan", "vienna", "zurich",
  "brussels", "copenhagen", "stockholm", "oslo", "helsinki",
  "lisbon", "prague", "warsaw", "budapest", "edinburgh"
]);

function isAllowedLocation(city, country) {
  if (!city) return false;
  const cNorm = city.toLowerCase().trim();
  if (VALID_CITIES.has(cNorm)) return true;
  if (country && ALLOWED_EUROPEAN_COUNTRIES.has(country.toUpperCase().trim())) return true;
  return false;
}

export function getCachedCoords() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COORDS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.lat === "number" && typeof parsed?.lng === "number" ? parsed : null;
  } catch {
    return null;
  }
}

export async function detectCoords() {
  const cached = getCachedCoords();
  if (cached) return cached;

  if (typeof navigator === "undefined" || !navigator.geolocation) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try { localStorage.setItem(COORDS_KEY, JSON.stringify(coords)); } catch { /* private mode */ }
        resolve(coords);
      },
      () => resolve(null),
      { timeout: 8000 },
    );
  });
}

export function getCachedLocation() {
  if (typeof window === "undefined") return { city: "Dublin", country: "IE" };
  try {
    const city = localStorage.getItem(CITY_KEY);
    const country = localStorage.getItem(COUNTRY_KEY);

    if (city && isAllowedLocation(city, country)) {
      return { city, country };
    }

    // Purge Indian or non-European cities from localStorage and fallback to Dublin
    localStorage.setItem(CITY_KEY, "Dublin");
    localStorage.setItem(COUNTRY_KEY, "IE");
    return { city: "Dublin", country: "IE" };
  } catch {
    return { city: "Dublin", country: "IE" };
  }
}

export function clearCachedLocation() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CITY_KEY, "Dublin");
    localStorage.setItem(COUNTRY_KEY, "IE");
  } catch { /* storage blocked */ }
}

export function setCachedLocation(city, country = "IE") {
  if (typeof window === "undefined") return;
  const finalCity = isAllowedLocation(city, country) ? city : "Dublin";
  const finalCountry = country ? country.toUpperCase() : "IE";
  try {
    localStorage.setItem(CITY_KEY, finalCity);
    localStorage.setItem(COUNTRY_KEY, finalCountry);
    window.dispatchEvent(
      new CustomEvent("passqo-location-changed", {
        detail: { city: finalCity, country: finalCountry },
      })
    );
  } catch { /* storage blocked */ }
}

export async function detectLocation() {
  const cached = getCachedLocation();
  if (cached.city && isAllowedLocation(cached.city, cached.country)) {
    return cached;
  }

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { city: "Dublin", country: "IE" };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county;
          const country = data.address?.country_code?.toUpperCase();

          if (city && isAllowedLocation(city, country)) {
            setCachedLocation(city, country);
            resolve({ city, country });
          } else {
            // Default to Dublin for devices outside Ireland/Europe
            setCachedLocation("Dublin", "IE");
            resolve({ city: "Dublin", country: "IE" });
          }
        } catch {
          setCachedLocation("Dublin", "IE");
          resolve({ city: "Dublin", country: "IE" });
        }
      },
      () => {
        setCachedLocation("Dublin", "IE");
        resolve({ city: "Dublin", country: "IE" });
      },
      { timeout: 8000 }
    );
  });
}


