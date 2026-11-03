import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export function RichTextDisplay({ html, className }) {
  const [clean, setClean] = useState(null);

  useEffect(() => {
    if (!html) {
      setClean("");
      return;
    }
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "a", "ul", "ol", "li", "br", "p", "div", "span"],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
    setClean(sanitized);
  }, [html]);

  if (clean === null) return null;
  return (
    <div
      className={`[&_a]:text-[#FF4E7A] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default RichTextDisplay;

