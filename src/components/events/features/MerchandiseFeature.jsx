import { ShoppingBag, Sparkles, Tag } from "lucide-react";

export function MerchandiseFeature({ event, details }) {
  const items = details?.merchandise || details?.shop || [
    {
      name: "Official Tour 2026 Heavyweight Tee",
      price: "€35.00",
      type: "Apparel",
      badge: "Limited Run",
      image: "/images/figma-sample/goa/headliner.png",
      sizes: "S · M · L · XL · 2XL",
    },
    {
      name: "Collector's Edition Vinyl LP (Signed)",
      price: "€45.00",
      type: "Music",
      badge: "Exclusive",
      image: "/images/figma-sample/goa/performance.png",
      sizes: "180g Heavy Vinyl",
    },
    {
      name: "Commemorative Silk-Screen Tour Poster",
      price: "€25.00",
      type: "Print Art",
      badge: "Numbered 1/500",
      image: "/images/figma-sample/goa/support-1.png",
      sizes: "A2 Heavyweight Paper",
    },
    {
      name: "Embroidered Zip Hoodie & Tote Pack",
      price: "€65.00",
      type: "Apparel",
      badge: "Selling Fast",
      image: "/images/figma-sample/goa/support-2.png",
      sizes: "S · M · L · XL",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Official Event Merchandise & Shop
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Pre-order official tour merchandise for priority pick-up at the venue merch desk.
          </p>
        </div>
        <span className="text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit flex-shrink-0">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Official Store</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {items.map((prod, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black/15 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 shadow-2xs relative">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-[#FF4E7A] uppercase tracking-wider">
                  {prod.type}
                </span>
                {prod.badge && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {prod.badge}
                  </span>
                )}
              </div>
              <p className="font-bold text-xs sm:text-sm text-[#1B1B23] truncate">
                {prod.name}
              </p>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-extrabold text-xs sm:text-sm text-[#1B1B23]">
                  {prod.price}
                </span>
                {prod.sizes && (
                  <span className="text-[10px] text-[#8C8C9E]">
                    {prod.sizes}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MerchandiseFeature;

