export default function UpcomingEvents() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-brand-dark">Upcoming Events</h3>
        <button className="text-[10px] font-bold text-bts-gold">View Calendar</button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 transition-colors">
          <div className="bg-white rounded-lg px-2 py-1 text-center shadow-sm border border-gray-100 min-w-[50px]">
            <p className="text-[8px] font-bold text-gray-400 uppercase">May</p>
            <p className="text-base font-extrabold leading-none">20</p>
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold leading-tight">Smart Contract Workshop</h5>
            <p className="text-[10px] text-gray-400">10:00 AM - 12:00 PM</p>
          </div>
          <span className="bg-green-50 text-green-600 text-[9px] font-bold px-2 py-0.5 rounded-full">Online</span>
        </div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 transition-colors">
          <div className="bg-white rounded-lg px-2 py-1 text-center shadow-sm border border-gray-100 min-w-[50px]">
            <p className="text-[8px] font-bold text-gray-400 uppercase">May</p>
            <p className="text-base font-extrabold leading-none">22</p>
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold leading-tight">Project Review Meeting</h5>
            <p className="text-[10px] text-gray-400">2:00 PM - 3:30 PM</p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded-full">Zoom</span>
        </div>
      </div>
      <a className="mt-6 block text-center text-xs font-bold text-gray-400 hover:text-brand-dark flex items-center justify-center gap-2" href="#">
        View full calendar
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
      </a>
    </div>
  );
}
