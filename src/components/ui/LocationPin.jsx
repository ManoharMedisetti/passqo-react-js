export function LocationPin({ className = "h-3.5 w-3.5" }) {
  return (
    <img
      src="/brand/pin.png"
      onError={(e) => {
        // Fallback to location SVG icon if brand pin png doesn't exist
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/icons/venue.svg";
      }}
      alt=""
      aria-hidden="true"
      className={`inline-block align-[-0.2em] ${className}`}
    />
  );
}

export default LocationPin;

