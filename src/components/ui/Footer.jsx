import { Link } from "react-router-dom";
import { X } from "lucide-react";

const LINK = "text-[15px] text-[#66666F] hover:text-[#1B1B23] transition-colors";
const SOCIAL = "w-[34px] h-[34px] rounded-lg bg-[#FF4E7A] text-white flex items-center justify-center leading-none";

export function Footer() {
  return (
    <footer className="relative overflow-hidden mt-16 bg-gradient-to-b from-[#F5F0EB] via-[#F9E9EA] to-[#FDE2EA]">
      <div aria-hidden="true" className="absolute -top-36 right-[-60px] w-[360px] h-[360px] rounded-full bg-[#F4E6E6]/70" />
      <div aria-hidden="true" className="absolute -bottom-24 right-[-60px] w-[260px] h-[260px] rounded-full bg-[#EDE0E4]/70" />

      <div className="relative max-w-[1120px] mx-auto px-4 lg:px-0 pt-16 lg:pt-28 pb-24 lg:pb-16">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          <div>
            <Link to="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A] rounded-xl">
              <img
                src="/images/Logos/navbar%20logo.png"
                alt="Passqo"
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-transform duration-200 hover:scale-105 active:scale-95"
              />
            </Link>
            <nav className="flex flex-wrap items-center gap-x-10 gap-y-2 mt-8 lg:mt-12">
              <Link to="/" className="text-[15px] font-bold text-[#25252A]">Explore</Link>
              <Link to="/search" className={LINK}>Events</Link>
              <a href="mailto:support@passqo.com" className={LINK}>Contact</a>
              <Link to="/help/group-registration" className={LINK}>Support</Link>
            </nav>
            <p className="text-[13px] text-[#8A8A92] mt-6">
              &copy; {new Date().getFullYear()} Passqo. The pass that moves with you.
            </p>
          </div>

          <div className="lg:pt-2">
            <p className="text-sm font-bold text-[#25252A]">Follow us</p>
            <div className="flex items-center gap-3 mt-4" aria-label="Social media">
              <span className={SOCIAL} title="Instagram">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.25}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                </svg>
              </span>
              <span className={`${SOCIAL} text-[19px] font-bold`} title="LinkedIn">in</span>
              <span className={SOCIAL} title="X"><X className="w-5 h-5" strokeWidth={2.25} /></span>
              <span className={`${SOCIAL} text-[21px] font-bold`} title="Facebook">f</span>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-2 mt-8 lg:mt-12 text-sm text-[#55555D]">
              <Link to="/terms" className="hover:text-[#1B1B23] transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-[#1B1B23] transition-colors">Privacy Policy</Link>
            </div>
            <a href="mailto:support@passqo.com" className="block text-sm text-[#55555D] mt-4 hover:text-[#1B1B23] transition-colors">
              support@passqo.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

