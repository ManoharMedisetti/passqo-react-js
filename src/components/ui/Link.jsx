import React from "react";
import { Link as RouterLink } from "react-router-dom";

export function Link({ href, to, children, ...props }) {
  const destination = to || href || "#";
  if (
    typeof destination === "string" &&
    (destination.startsWith("http://") ||
      destination.startsWith("https://") ||
      destination.startsWith("mailto:") ||
      destination.startsWith("tel:"))
  ) {
    return (
      <a href={destination} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={destination} {...props}>
      {children}
    </RouterLink>
  );
}

export default Link;

