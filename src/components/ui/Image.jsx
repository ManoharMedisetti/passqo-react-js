import React from "react";

export function Image({
  src,
  alt = "",
  width,
  height,
  priority = false,
  fill = false,
  className = "",
  style = {},
  ...props
}) {
  const imageStyle = fill
    ? {
        position: "absolute",
        height: "100%",
        width: "100%",
        inset: 0,
        objectFit: "cover",
        ...style,
      }
    : style;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      className={className}
      style={imageStyle}
      {...props}
    />
  );
}

export default Image;

