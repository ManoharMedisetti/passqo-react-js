import { Utensils, Wine, Sparkles } from "lucide-react";

export function TastingMenuFeature({ event, details }) {
  const menu = details?.tastingMenu || [
    {
      course: "Amuse-Bouche",
      dish: "Wild Smoked Sea Trout with Pickled Sea Fennel",
      description: "Infused with lemon verbena emulsion and crispy kelp cracker.",
      pairing: "Kinsale Craft Gin & Elderflower Tonic",
    },
    {
      course: "Starter",
      dish: "Heirloom Beetroot Carpaccio & Whipped Goat's Curd",
      description: "Toasted pine nuts, blackberry balsamic reduction, micro sorrel.",
      pairing: "Domaine Vacheron Sancerre 2022",
    },
    {
      course: "Main Course",
      dish: "Dry-Aged Wagyu Sirloin with Morel Mushroom Jus",
      description: "Charred baby leeks, black garlic purée, and truffle pomme purée.",
      pairing: "Château de Beaucastel Châteauneuf-du-Pape 2018",
    },
    {
      course: "Dessert",
      dish: "Dark Valrhona Chocolate Crémeux & Passion Fruit Gel",
      description: "Smoked Maldon sea salt, cacao nib brittle, and bourbon vanilla gelato.",
      pairing: "Quinta do Noval 20-Year Tawny Port",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Curated Tasting Menu & Pairings
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Multi-course gastronomic journey crafted by award-winning culinary hosts.
          </p>
        </div>
        <span className="text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit flex-shrink-0">
          <Utensils className="w-3.5 h-3.5" />
          <span>{menu.length} Courses</span>
        </span>
      </div>

      <div className="space-y-3">
        {menu.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 transition-all space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="text-[11px] font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-0.5 rounded-md w-fit">
                {item.course}
              </span>
              {item.pairing && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1 w-fit">
                  <Wine className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pairing: {item.pairing}</span>
                </span>
              )}
            </div>

            <h4 className="font-extrabold text-sm sm:text-base text-[#1B1B23]">
              {item.dish}
            </h4>

            {item.description && (
              <p className="text-xs text-[#6E6969] leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TastingMenuFeature;

