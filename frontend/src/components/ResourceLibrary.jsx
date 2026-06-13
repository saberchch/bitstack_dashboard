import { Link } from 'react-router-dom';

export default function ResourceLibrary() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-brand-dark">Resource Library</h3>
        <Link to="/d-library" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className="bg-yellow-50 p-2 rounded-lg"><svg className="w-5 h-5 text-bts-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div><div><p className="text-xs font-bold text-brand-dark">eBooks</p><p className="text-[10px] text-gray-400">1,450+</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className="bg-green-50 p-2 rounded-lg"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div><div><p className="text-xs font-bold text-brand-dark">Notes</p><p className="text-[10px] text-gray-400">2,300+</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className="bg-blue-50 p-2 rounded-lg"><svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div><div><p className="text-xs font-bold text-brand-dark">Past Papers</p><p className="text-[10px] text-gray-400">860+</p></div></div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className="bg-red-50 p-2 rounded-lg"><svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg></div><div><p className="text-xs font-bold text-brand-dark">Videos</p><p className="text-[10px] text-gray-400">620+</p></div></div>
      </div>
    </div>
  );
}
