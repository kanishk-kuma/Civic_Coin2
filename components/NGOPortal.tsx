import React, { useState } from 'react';
import { Deed, DeedStatus, CivicEvent } from '../types';
import { Shield, MapPin, Search, CheckCircle2, XCircle, Star, FileText, Clock, Zap, Calendar, Plus, Trash2, ChevronRight, Info, ClipboardCheck, ArrowLeft } from 'lucide-react';

interface Props {
  deeds: Deed[];
  activeEvent: CivicEvent | null;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  onPostEvent: (event: CivicEvent | null) => void;
  onBack: () => void;
}

const NGOPortal: React.FC<Props> = ({ deeds, activeEvent, onVerify, onReject, onPostEvent, onBack }) => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'EVENT'>('PENDING');
  const [selectedDeed, setSelectedDeed] = useState<Deed | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Event Form State
  const [eventOccasion, setEventOccasion] = useState('');
  const [eventDuration, setEventDuration] = useState('3');
  const [eventMultiplier, setEventMultiplier] = useState('2.0');

  const filteredDeeds = deeds.filter(d => {
    const matchesTab = activeTab === 'PENDING' ? d.status === DeedStatus.PENDING : d.status === DeedStatus.VERIFIED;
    const matchesSearch = d.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (id: string, action: 'verify' | 'reject') => {
    if (action === 'verify') {
      onVerify(id);
    } else {
      onReject(id);
    }
    setSelectedDeed(null);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CivicEvent = {
      id: Math.random().toString(36).substr(2, 9),
      occasion: eventOccasion,
      durationDays: parseInt(eventDuration),
      multiplier: parseFloat(eventMultiplier),
      postedAt: new Date().toISOString(),
      isActive: true
    };
    onPostEvent(newEvent);
    setEventOccasion('');
    alert('Event posted successfully! Citizens will now see the boosted points.');
  };

  const getDaysAgo = (dateStr: string) => {
    const now = new Date();
    const posted = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays}d ago`;
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      <div className="mb-6">
          <button 
            onClick={onBack}
            className="group flex items-center text-slate-800 hover:text-black font-bold transition-all bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="bg-gradient-to-br from-emerald-900/90 to-green-950/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden w-fit">
          <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none"></div>
          <h1 className="text-3xl font-black text-white tracking-tight relative z-10">Volunteer Hub</h1>
          <p className="text-emerald-100/80 font-medium relative z-10">Verify community contributions and manage city engagement.</p>
        </div>
        <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${activeTab !== 'EVENT' ? 'bg-[#1a365d] text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Verification
          </button>
          <button 
            onClick={() => setActiveTab('EVENT')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${activeTab === 'EVENT' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Post Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'EVENT' ? (
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             {/* Left Column: Form */}
             <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in slide-in-from-left-8 duration-500">
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white relative">
                   <Zap className="absolute top-4 right-6 w-12 h-12 opacity-10 rotate-12" />
                   <h2 className="text-xl font-black mb-1">New Community Boost</h2>
                   <p className="text-orange-100 text-[11px] font-medium">Create a time-limited point multiplier.</p>
                </div>
                <form onSubmit={handleCreateEvent} className="p-6 space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Reason / Occasion</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g., Earth Day Clean-Up"
                        value={eventOccasion}
                        onChange={(e) => setEventOccasion(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-black text-slate-900 text-sm"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Duration (Days)</label>
                        <input 
                          required
                          type="number"
                          min="1"
                          max="14"
                          value={eventDuration}
                          onChange={(e) => setEventDuration(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-black text-slate-900 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Multiplier</label>
                        <select 
                          value={eventMultiplier}
                          onChange={(e) => setEventMultiplier(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-black text-slate-900 text-sm"
                        >
                          <option value="1.5">1.5x</option>
                          <option value="2.0">2.0x</option>
                          <option value="2.5">2.5x</option>
                          <option value="3.0">3.0x</option>
                        </select>
                      </div>
                   </div>
                   <button 
                    type="submit"
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                   >
                     <Plus className="w-4 h-4" />
                     Post Live Boost
                   </button>
                </form>
             </div>

             {/* Right Column: Currently Posted Event */}
             <div className="lg:col-span-7 space-y-4 animate-in slide-in-from-right-8 duration-500">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Active City Status</h3>
                {activeEvent && activeEvent.isActive ? (
                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Zap className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-ping"></span>
                          Live Portal Event
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Posted {getDaysAgo(activeEvent.postedAt)}
                        </span>
                      </div>
                      
                      <h4 className="text-3xl font-black mb-6 tracking-tight">{activeEvent.occasion}</h4>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-inner">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reward Multiplier</p>
                          <p className="text-3xl font-black text-orange-400">{activeEvent.multiplier}x</p>
                        </div>
                        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-inner">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Validity Left</p>
                          <p className="text-3xl font-black text-blue-400">{activeEvent.durationDays} Days</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => onPostEvent(null)}
                        className="mt-8 flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest group"
                      >
                        <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                        Remove current event
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-sm">
                    <Calendar className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold mb-1">No event is currently live</p>
                    <p className="text-slate-400 text-xs">Use the form on the left to start a city-wide boost.</p>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <>
            {/* Sidebar List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[580px]">
                <div className="flex border-b border-slate-100">
                  <button 
                    onClick={() => setActiveTab('PENDING')}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === 'PENDING' ? 'text-blue-600 bg-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Pending ({deeds.filter(d => d.status === DeedStatus.PENDING).length})
                    {activeTab === 'PENDING' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab('VERIFIED')}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === 'VERIFIED' ? 'text-emerald-600 bg-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Verified
                    {activeTab === 'VERIFIED' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>}
                  </button>
                </div>

                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search ID, Location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                  {filteredDeeds.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">No records found</p>
                    </div>
                  ) : (
                    filteredDeeds.map(deed => (
                      <button 
                        key={deed.id}
                        onClick={() => setSelectedDeed(deed)}
                        className={`w-full text-left p-4 hover:bg-slate-50 transition-all flex gap-3 items-center group relative ${selectedDeed?.id === deed.id ? 'bg-blue-50/50' : ''}`}
                      >
                        {selectedDeed?.id === deed.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors border ${selectedDeed?.id === deed.id ? 'bg-white border-blue-100 shadow-sm' : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:shadow-sm'}`}>
                          <FileText className={`w-4 h-4 ${selectedDeed?.id === deed.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className={`font-bold text-xs truncate mb-1 ${selectedDeed?.id === deed.id ? 'text-blue-900' : 'text-slate-700'}`}>{deed.description}</p>
                          <div className="flex items-center text-[10px] text-slate-400 font-medium truncate">
                            <Clock className="w-3 h-3 mr-1" />
                            {deed.timestamp.split(',')[0]}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedDeed?.id === deed.id ? 'text-blue-500 translate-x-1' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1'}`} />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Detailed View - Precise Implementation */}
            <div className="lg:col-span-2">
              {selectedDeed ? (
                <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[580px] animate-in fade-in slide-in-from-right-4 duration-300 relative">
                  {/* Decorative Header bg */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-white -z-10"></div>

                  {/* Header Area */}
                  <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">CASE PROFILE</span>
                        <span className="text-[11px] font-bold text-slate-400 tracking-tight">ID: {selectedDeed.id.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-blue-600">
                           <ClipboardCheck className="w-6 h-6" />
                         </div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submission Review</h3>
                      </div>
                    </div>
                    
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
                      <div className="bg-[#10b981] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide leading-none mb-1">IMPACT PTS</p>
                        <p className="text-3xl font-black text-emerald-600 leading-none tracking-tight">+{selectedDeed.pointsAwarded}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 flex-grow overflow-y-auto space-y-6 custom-scrollbar py-2">
                    {/* Statement & Impact */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pl-1">
                        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">STATEMENT & IMPACT</p>
                      </div>
                      <div className="bg-slate-50 py-8 px-8 rounded-3xl border border-slate-100 relative group transition-colors hover:bg-slate-100/50">
                        <div className="absolute top-4 left-4 text-slate-300 text-4xl font-serif leading-none select-none">"</div>
                        <p className="text-slate-800 text-2xl font-bold italic text-center leading-relaxed relative z-10 px-4">
                          {selectedDeed.description}
                        </p>
                        <div className="absolute bottom-4 right-4 text-slate-300 text-4xl font-serif leading-none select-none rotate-180">"</div>
                      </div>
                    </div>

                    {/* Status and Time Boxes - Polished & Visible */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">CURRENT STATUS</p>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ring-4 ring-slate-50 ${selectedDeed.status === DeedStatus.PENDING ? 'bg-amber-400 animate-pulse' : selectedDeed.status === DeedStatus.VERIFIED ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          <span className={`text-lg font-black uppercase tracking-tight ${selectedDeed.status === DeedStatus.PENDING ? 'text-amber-600' : selectedDeed.status === DeedStatus.VERIFIED ? 'text-emerald-700' : 'text-red-600'}`}>
                            {selectedDeed.status}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">CAPTURED AT</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                             <Clock className="w-4 h-4" />
                          </div>
                          <span className="text-lg font-bold text-slate-700">
                            {selectedDeed.timestamp.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Geotagged Location Box */}
                    <div className="bg-slate-50 p-1.5 rounded-3xl border border-slate-100 flex items-center gap-4 pr-6 mb-4">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-blue-600">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1.5">GEOTAGGED LOCATION</p>
                        <p className="text-lg font-bold text-slate-800">{selectedDeed.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4 backdrop-blur-sm">
                    {selectedDeed.status === DeedStatus.PENDING ? (
                      <>
                        <button 
                          onClick={() => handleAction(selectedDeed.id, 'verify')}
                          className="flex-[3] bg-[#10b981] hover:bg-[#059669] text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:-translate-y-0.5"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          APPROVE DEED
                        </button>
                        <button 
                          onClick={() => handleAction(selectedDeed.id, 'reject')}
                          className="flex-1 py-4 border-2 border-slate-200 bg-white text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-2xl font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                        >
                          <XCircle className="w-4 h-4" />
                          REJECT
                        </button>
                      </>
                    ) : (
                      <div className={`w-full py-5 rounded-2xl text-center font-black uppercase tracking-widest text-sm shadow-sm flex items-center justify-center gap-3 ${selectedDeed.status === DeedStatus.VERIFIED ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {selectedDeed.status === DeedStatus.VERIFIED ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                        {selectedDeed.status === DeedStatus.VERIFIED ? 'Contribution Verified' : 'Submission Rejected'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[580px] bg-white rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-500">
                  <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 group">
                    <Shield className="w-10 h-10 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Awaiting Selection</h4>
                  <p className="text-slate-500 max-w-xs text-sm font-medium">Select a submission from the list to begin verification.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default NGOPortal;