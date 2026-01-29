import React, { useState } from 'react';
import { Deed, DeedStatus, UserState } from '../types';
import { ArrowLeft, Search, Clock, MapPin, CheckCircle, XCircle, Clock4, FileText, PlusCircle, Star, Filter, Heart, Leaf, Activity } from 'lucide-react';

interface Props {
  deeds: Deed[];
  onBack: () => void;
  onReportDeed: () => void;
  userState: UserState;
}

const ActivityHistory: React.FC<Props> = ({ deeds, onBack, onReportDeed, userState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DeedStatus>('ALL');

  const filteredDeeds = deeds.filter(deed => {
    const matchesSearch = deed.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deed.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || deed.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status: DeedStatus) => {
    switch (status) {
      case DeedStatus.VERIFIED:
        return 'bg-green-100 text-green-700 border-green-200';
      case DeedStatus.INVALID:
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: DeedStatus) => {
    switch (status) {
      case DeedStatus.VERIFIED:
        return <CheckCircle className="w-4 h-4 text-white" />;
      case DeedStatus.INVALID:
        return <XCircle className="w-4 h-4 text-white" />;
      default:
        return <Clock4 className="w-4 h-4 text-white" />;
    }
  };

  const getStatusBg = (status: DeedStatus) => {
    switch (status) {
      case DeedStatus.VERIFIED:
        return 'bg-emerald-500';
      case DeedStatus.INVALID:
        return 'bg-red-500';
      default:
        return 'bg-amber-500';
    }
  };

  const getCategoryIcon = (description: string) => {
     const lower = description.toLowerCase();
     if (lower.includes('environment') || lower.includes('tree') || lower.includes('clean')) return <Leaf className="w-6 h-6 text-emerald-500" />;
     if (lower.includes('health')) return <Activity className="w-6 h-6 text-pink-500" />;
     if (lower.includes('community') || lower.includes('help')) return <Heart className="w-6 h-6 text-red-500" />;
     return <FileText className="w-6 h-6 text-blue-500" />;
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-[#1a365d] font-bold transition-colors mb-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Impact History</h1>
          <p className="text-slate-500">Track your contributions and verify their status.</p>
        </div>
        
        <button 
          onClick={onReportDeed}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Report New Deed
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Points</span>
           <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="text-3xl font-black text-slate-800">{userState.points}</span>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Deeds</span>
           <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-3xl font-black text-slate-800">{userState.deeds.filter(d => d.status === DeedStatus.VERIFIED).length}</span>
           </div>
        </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</span>
           <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-3xl font-black text-slate-800">{userState.deeds.filter(d => d.status === DeedStatus.PENDING).length}</span>
           </div>
        </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invalid</span>
           <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-3xl font-black text-slate-800">{userState.deeds.filter(d => d.status === DeedStatus.INVALID).length}</span>
           </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60 mb-8">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by description or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
             <Filter className="w-5 h-5 text-slate-400 hidden md:block" />
             {['ALL', DeedStatus.PENDING, DeedStatus.VERIFIED, DeedStatus.INVALID].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${statusFilter === status ? 'bg-[#1a365d] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {status === 'ALL' ? 'All' : status}
                </button>
             ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredDeeds.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-lg font-bold text-slate-600">No matching activities found.</p>
              <p className="text-sm mt-1 text-slate-400">Try a different search term or check back later.</p>
            </div>
          ) : (
            filteredDeeds.map(deed => (
              <div key={deed.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-6 group items-start md:items-center">
                <div className="relative flex-shrink-0">
                  <div className="w-full md:w-20 md:h-20 h-40 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                    <div className="bg-white p-2 rounded-xl shadow-sm mb-1 group-hover:scale-110 transition-transform">
                      {getCategoryIcon(deed.description)}
                    </div>
                  </div>
                  
                  <div className={`absolute -top-1 -right-1 p-1 rounded-full shadow-md border-2 border-white ${getStatusBg(deed.status)}`}>
                    {getStatusIcon(deed.status)}
                  </div>
                </div>
                <div className="flex-grow flex flex-col justify-between w-full">
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 gap-2">
                       <h4 className="text-slate-900 font-bold text-lg leading-snug">{deed.description}</h4>
                       <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(deed.status)}`}>
                            {deed.status}
                        </span>
                        {deed.status === DeedStatus.VERIFIED && (
                            <span className="font-black text-emerald-600 flex items-center text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                                +{deed.pointsAwarded} PTS
                            </span>
                        )}
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2">
                    <div className="flex items-center bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                      <span className="font-bold text-slate-700 text-xs">{deed.location}</span>
                    </div>
                    <div className="flex items-center bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                      <span className="font-bold text-slate-700 text-xs">{deed.timestamp.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHistory;