import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { QrCode, Scan, Camera, CheckCircle2, Volume2 } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerScannerPage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState("Gate 1 - Main Entrance");
  const [toastMsg, setToastMsg] = useState("");

  const [stream, setStream] = useState([
    {
      id: "scan-1",
      time: "Just now",
      attendee: "Alex Turner",
      tier: "VIP Access",
      code: "#PQ-88941",
      valid: true,
    },
    {
      id: "scan-2",
      time: "3 mins ago",
      attendee: "Sarah Jenkins",
      tier: "General Admission",
      code: "#PQ-77120",
      valid: true,
    },
    {
      id: "scan-3",
      time: "8 mins ago",
      attendee: "Rahul Kumar",
      tier: "General Admission",
      code: "#PQ-77121",
      valid: true,
    },
  ]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880.0, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  };

  const handleSimulateScan = () => {
    playChime();
    const guestNames = ["Elena Rostova", "Liam O'Connor", "David Miller", "Priya Patel"];
    const randomGuest = guestNames[Math.floor(Math.random() * guestNames.length)];
    const randomCode = `#PQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const newScan = {
      id: "scan-" + Date.now(),
      time: "Just now",
      attendee: randomGuest,
      tier: "General Admission",
      code: randomCode,
      valid: true,
    };

    setStream((prev) => [newScan, ...prev]);
    setToastMsg(`✓ ${randomGuest} Admitted! (${randomCode})`);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="scanner"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Scanner"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
              Ticket Scanner
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Live Door Admission & QR Code Verification
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="h-9 px-3 rounded-full bg-[#F8FAFC] border border-[#EDE8E1] text-xs font-bold text-[#0F172A] focus:outline-none"
            >
              <option value="Gate 1 - Main Entrance">Gate 1 - Main Entrance</option>
              <option value="Gate 2 - VIP Access">Gate 2 - VIP Fast-track</option>
              <option value="Gate 3 - Backstage">Gate 3 - Backstage</option>
            </select>
          </div>
        </section>

        {toastMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Scanner Viewfinder Card matching scanner.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center space-y-4">
          {/* Target Box */}
          <div className="relative w-64 h-64 rounded-3xl border-2 border-dashed border-[#FF4E7A] bg-[#FFF0F4]/30 flex flex-col items-center justify-center p-4 overflow-hidden group">
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FF4E7A]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FF4E7A]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FF4E7A]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FF4E7A]" />

            <Camera className="w-12 h-12 text-[#FF4E7A] animate-pulse mb-3" />
            <span className="text-xs font-bold text-[#0F172A]">Point camera at Passqo QR</span>
            <span className="text-[11px] text-[#94A3B8] mt-1">Instant validation sound chime</span>
          </div>

          <button
            type="button"
            onClick={handleSimulateScan}
            className="h-11 px-6 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            <span>Simulate Scan Ticket</span>
          </button>
        </div>

        {/* Live Gate Activity Stream Table matching scanner.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-[#F1EFEA] flex items-center justify-between">
            <h3 className="font-display font-extrabold text-sm text-[#0F172A]">
              Live Gate Activity Stream
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Realtime
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1EFEA] text-[11px] font-extrabold uppercase text-[#94A3B8] tracking-wider bg-[#FAFAFA]">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Pass Code</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] text-xs">
                {stream.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 text-[#94A3B8]">
                      {item.time}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      {item.attendee}
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      {item.tier}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#64748B]">
                      {item.code}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Valid ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerScannerPage;
