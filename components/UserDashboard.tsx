import React, { useState } from 'react';
import { UserState, CivicEvent, DeedStatus } from '../types';
import { Shield, Zap, UploadCloud, UserCheck, Gift, Trophy, Award, Clock, Search, Filter, MapPin, CheckCircle, XCircle, Clock4, Leaf, Activity, Heart, FileText, Star, ChevronRight, Lock } from 'lucide-react';
import DeedCategories from './DeedCategories';

interface Props {
  userState: UserState;
  activeEvent: CivicEvent | null;
  onReportDeed: () => void;
  onViewAll: () => void;
  onViewCertificate: () => void;
  onSelectCategory: (category: string) => void;
  userProfile: { name: string; email: string } | null;
}

const UserDashboard: React.FC<Props> = ({ userState, activeEvent, onReportDeed, onViewAll, onViewCertificate, onSelectCategory, userProfile }) => {
  
  // History State & Logic
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DeedStatus>('ALL');

  const filteredDeeds = userState.deeds.filter(deed => {
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

  // Progress Logic
  const POINTS_PER_LEVEL = 500;
  const currentLevel = Math.floor(userState.points / POINTS_PER_LEVEL) + 1;
  const pointsInCurrentLevel = userState.points % POINTS_PER_LEVEL;
  const progressPercentage = Math.min((pointsInCurrentLevel / POINTS_PER_LEVEL) * 100, 100);
  const nextReward = currentLevel === 1 ? 'Municipal Tax Credit Voucher' : currentLevel === 2 ? 'Mayor\'s Recognition Medal' : 'State VIP Status';

  // Earned Rewards Logic
  const earnedTierRewards = [
     { threshold: 500, name: 'Municipal Tax Credit Voucher', icon: <FileText className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100' },
     { threshold: 1000, name: 'Mayor\'s Recognition Medal', icon: <Award className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100' },
     { threshold: 1500, name: 'State VIP Status', icon: <Trophy className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100' }
  ].filter(r => userState.points >= r.threshold);

  return (
    <div className="animate-in fade-in duration-700 relative">
      
      {/* Enhanced Background for Authenticated User */}
      {userProfile && (
         <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-teal-50/20 to-transparent"></div>
            
            {/* Soft Ambient Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-full blur-3xl opacity-70 translate-x-1/3 -translate-y-1/4"></div>
            <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-100/30 to-transparent rounded-full blur-3xl opacity-50 -translate-x-1/3"></div>
         </div>
      )}

      {/* 1. HERO / WELCOME SECTION */}
      {!userProfile ? (
        <section className="relative px-6 lg:px-8 pt-10 pb-20 lg:pt-20 lg:pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Reward Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Civic Sense</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              A government-backed platform that turns Good Samaritan acts into tangible value. Earn Civic Points, receive official vouchers, and build a better community.
            </p>
          </div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Abstract Hero Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200 to-blue-200 rounded-full blur-[100px] opacity-50"></div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
               <div className="space-y-4 translate-y-8">
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-500">
                     <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                        <Shield className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-slate-900">Verified Impact</h3>
                     <p className="text-xs text-slate-500 mt-1">Every deed checked by approved NGOs</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-500 delay-75">
                     <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                        <Gift className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-slate-900">Real Rewards</h3>
                     <p className="text-xs text-slate-500 mt-1">Tax credits & retail vouchers</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-500 delay-100">
                     <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 text-orange-600">
                        <Zap className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-slate-900">Multiplier Events</h3>
                     <p className="text-xs text-slate-500 mt-1">Earn 2x points during city drives</p>
                  </div>
                  <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-900/20 flex flex-col items-center text-center text-white transform hover:scale-105 transition-transform duration-500 delay-150">
                     <h3 className="text-4xl font-black mb-1">50k+</h3>
                     <p className="text-sm font-medium text-emerald-100">Deeds Recorded</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="pt-20 pb-20 max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="space-y-16">
               
               {/* Welcome Message */}
               <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                     <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                       Welcome back, {userProfile.name.split(' ')[0]}!
                     </h2>
                     <p className="text-slate-600 font-medium text-lg max-w-2xl">
                       Your contributions make our city stronger. Keep up the amazing work.
                     </p>
                  </div>
               </div>

               {/* Embedded Deed Categories */}
               <div>
                  <div className="mb-6 pl-2 border-l-4 border-emerald-500">
                     <h3 className="text-2xl font-black text-slate-900">Report a Deed</h3>
                     <p className="text-slate-500 text-sm font-medium">Select a category below to log a new contribution.</p>
                  </div>
                  <DeedCategories 
                     onSelectCategory={onSelectCategory} 
                     onBack={() => {}} 
                     compact={true} 
                  />
               </div>

               {/* Active Event Banner (Authenticated View) */}
               {activeEvent && activeEvent.isActive && (
                  <div>
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-1 shadow-2xl">
                       <div className="bg-white rounded-[20px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                             <Zap className="w-64 h-64 rotate-12" />
                          </div>
                          
                          <div className="relative z-10 flex-1">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">Limited Time</span>
                                <span className="text-orange-600 font-bold text-sm flex items-center gap-1"><Clock className="w-4 h-4"/> Ends in {activeEvent.durationDays} days</span>
                             </div>
                             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{activeEvent.occasion}</h2>
                             <p className="text-slate-600 text-lg">Participate in this city-wide initiative and earn <span className="font-bold text-orange-600">{activeEvent.multiplier}x Multiplier</span> on all points awarded.</p>
                          </div>
                       </div>
                    </div>
                  </div>
               )}

               {/* Embedded Activity History Section */}
               <div>
                  <div className="mb-6 pl-2 border-l-4 border-blue-500">
                     <h3 className="text-2xl font-black text-slate-900">Your Activity History</h3>
                     <p className="text-slate-500 text-sm font-medium">Track your submissions and verification status.</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                     <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                           <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input 
                              type="text" 
                              placeholder="Search deeds..." 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800"
                           />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                           {['ALL', DeedStatus.PENDING, DeedStatus.VERIFIED, DeedStatus.INVALID].map((status) => (
                              <button
                                 key={status}
                                 onClick={() => setStatusFilter(status as any)}
                                 className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${statusFilter === status ? 'bg-[#1a365d] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                              >
                                 {status === 'ALL' ? 'All' : status}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                        {filteredDeeds.length === 0 ? (
                           <div className="p-16 text-center text-slate-400">
                              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                 <Search className="w-10 h-10 text-slate-300" />
                              </div>
                              <p className="text-sm font-bold text-slate-600">No activities found</p>
                           </div>
                        ) : (
                           filteredDeeds.map(deed => (
                              <div key={deed.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center group">
                                 <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                       {getCategoryIcon(deed.description)}
                                    </div>
                                    <div className={`absolute -top-1.5 -right-1.5 p-0.5 rounded-full shadow border-2 border-white ${getStatusBg(deed.status)}`}>
                                       {getStatusIcon(deed.status)}
                                    </div>
                                 </div>
                                 
                                 <div className="flex-grow w-full">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-2">
                                       <h4 className="text-slate-900 font-bold text-sm line-clamp-1">{deed.description}</h4>
                                       <div className="flex items-center gap-2">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(deed.status)}`}>
                                             {deed.status}
                                          </span>
                                          {deed.status === DeedStatus.VERIFIED && (
                                             <span className="font-black text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                +{deed.pointsAwarded} pts
                                             </span>
                                          )}
                                       </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                                       <div className="flex items-center">
                                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                                          <span className="font-medium text-slate-500">{deed.location}</span>
                                       </div>
                                       <span className="text-slate-300">•</span>
                                       <div className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                                          <span className="font-medium text-slate-500">{deed.timestamp.split(',')[0]}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>

               {/* Your Progress & Earned Rewards Section */}
               <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Your Progress */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                     <div className="p-8 pb-0 flex justify-between items-center mb-6">
                        <div>
                           <h3 className="text-xl font-black text-slate-900">Your Progress</h3>
                           <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-1">Road to next tier</p>
                        </div>
                        <div className="bg-[#1a365d] text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md border border-blue-900">
                           Community Hero Lv. {currentLevel}
                        </div>
                     </div>
                     
                     <div className="px-8 pb-8">
                         {/* Progress Stats */}
                         <div className="flex justify-between items-end mb-3">
                             <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">Current Tier Progress</span>
                             <span className="text-emerald-600 font-black text-sm">
                               {pointsInCurrentLevel} <span className="text-slate-400">/ 500 XP</span>
                             </span>
                         </div>
                         
                         {/* Progress Bar */}
                         <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-8">
                             <div 
                               className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out relative"
                               style={{ width: `${progressPercentage}%` }}
                             >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                             </div>
                         </div>

                         {/* Upcoming Rewards */}
                         <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 group cursor-default hover:bg-slate-100 transition-colors">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600 shadow-sm group-hover:scale-105 transition-transform">
                               <Gift className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Upcoming Reward</p>
                               <p className="text-slate-900 font-bold text-sm">
                                  {nextReward}
                               </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                               <ChevronRight className="w-4 h-4" />
                            </div>
                         </div>
                     </div>
                  </div>

                  {/* Earned Rewards */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative flex flex-col">
                     <div className="p-8 pb-4">
                        <h3 className="text-xl font-black text-slate-900">Earned Rewards</h3>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-1">Unlocked Tier Benefits</p>
                     </div>
                     
                     <div className="px-8 pb-8 flex-grow">
                        {earnedTierRewards.length > 0 ? (
                           <div className="space-y-4">
                              {earnedTierRewards.map((reward, index) => (
                                 <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reward.bg} flex-shrink-0`}>
                                       {reward.icon}
                                    </div>
                                    <div className="flex-grow">
                                       <div className="flex items-center justify-between mb-0.5">
                                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Unlocked</p>
                                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                                       </div>
                                       <p className="text-sm font-bold text-slate-900 leading-tight">{reward.name}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                 <Lock className="w-6 h-6 text-slate-400" />
                              </div>
                              <p className="text-sm font-bold text-slate-600">No rewards earned yet</p>
                              <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Keep contributing to reach 500 points and unlock your first tier reward!</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Official Recognition Section - Moved from Home Page */}
               <div className="max-w-5xl mx-auto bg-[#1a365d] rounded-3xl relative overflow-hidden shadow-xl">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Award className="w-64 h-64 text-white rotate-12" />
                   </div>
                   <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-white">
                         <h2 className="text-2xl md:text-3xl font-black mb-4">Official Recognition</h2>
                         <p className="text-blue-100 text-lg max-w-xl">
                            Your contributions don't go unnoticed. Generate a government-issued certificate of appreciation once you hit 600 points.
                         </p>
                      </div>
                      <button 
                         onClick={onViewCertificate}
                         className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/50 transition-all hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
                      >
                         <Award className="w-5 h-5" />
                         View Certificate
                      </button>
                   </div>
               </div>

            </div>
        </div>
      )}

      {/* MARKETING SECTIONS - Only show for Guest Users */}
      {!userProfile && (
        <>
          {/* 2. STATISTICAL RIBBON */}
          <section className="bg-slate-900 py-12 border-y border-slate-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-black text-white">12k+</p>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Deeds</p>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-black text-white">5k+</p>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Active Citizens</p>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-black text-white">50k</p>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Coins Awarded</p>
               </div>
               <div className="space-y-1">
                  <p className="text-3xl lg:text-4xl font-black text-white">100+</p>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">NGO Partners</p>
               </div>
            </div>
          </section>

          {/* 3. INSTRUCTIONAL STEPPER */}
          <section id="how-it-works" className="py-24 bg-slate-50">
             <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                   <h2 className="text-3xl font-black text-slate-900 mb-4">How It Works</h2>
                   <p className="text-slate-600">Join the movement in three simple steps. We've streamlined the process to make helping your community as rewarding as it is impactful.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                   <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                   <div className="relative flex flex-col items-center text-center group">
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                         <UploadCloud className="w-10 h-10 text-emerald-600" />
                      </div>
                      <div className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-1 rounded mb-3">STEP 01</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Evidence</h3>
                      <p className="text-sm text-slate-500 leading-relaxed px-4">Snap a photo of your good deed—cleaning a park, helping a senior, or planting a tree.</p>
                   </div>

                   <div className="relative flex flex-col items-center text-center group">
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 delay-75">
                         <UserCheck className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-1 rounded mb-3">STEP 02</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Get Verified</h3>
                      <p className="text-sm text-slate-500 leading-relaxed px-4">Local NGOs review your submission by on field analysis of that specific location to ensure authenticity.</p>
                   </div>

                   <div className="relative flex flex-col items-center text-center group">
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 delay-150">
                         <Trophy className="w-10 h-10 text-orange-500" />
                      </div>
                      <div className="bg-orange-100 text-orange-800 text-xs font-black px-2 py-1 rounded mb-3">STEP 03</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Earn & Redeem</h3>
                      <p className="text-sm text-slate-500 leading-relaxed px-4">Collect Civic Points and redeem them for tax credits, certificates, or local vouchers.</p>
                   </div>
                </div>
             </div>
          </section>

          {/* 4. VISION SECTION */}
          <section id="our-vision" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-50/50 to-blue-50/50 rounded-full blur-[120px] -z-10 opacity-60"></div>

            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-[800px] mx-auto text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-emerald-600 mb-10 tracking-tight">
                  Our Vision
                </h2>
                <div className="relative">
                  <div className="absolute -top-8 -left-8 opacity-10">
                     <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.929 15.081C15.537 14.239 16.416 13.568 17.566 13.068C17.29 13.068 16.945 13.068 16.531 13.068C15.744 13.068 15.029 13.197 14.386 13.455C13.743 13.713 13.141 14.087 12.58 14.577L12.58 3.59999C14.918 3.59999 16.884 4.39499 18.478 5.98499C20.072 7.57499 20.869 9.61099 20.869 12.093C20.869 14.575 20.072 16.666 18.478 18.366C16.884 20.066 15.397 20.944 14.017 21ZM5.01699 21L5.01699 18C5.01699 16.896 5.32099 15.923 5.92899 15.081C6.53699 14.239 7.41599 13.568 8.56599 13.068C8.28999 13.068 7.94499 13.068 7.53099 13.068C6.74399 13.068 6.02899 13.197 5.38599 13.455C4.74299 13.713 4.14099 14.087 3.57999 14.577L3.57999 3.59999C5.91799 3.59999 7.88399 4.39499 9.47799 5.98499C11.072 7.57499 11.869 9.61099 11.869 12.093C11.869 14.575 11.072 16.666 9.47799 18.366C7.88399 20.066 6.39699 20.944 5.01699 21Z" /></svg>
                  </div>
                  <p className="text-lg md:text-xl text-slate-600 leading-[2.2] font-medium text-justify">
                    At Civic Coin, we believe that every small act of kindness is a building block for a stronger society. Our vision is to cultivate a transparent ecosystem where integrity and social responsibility are no longer abstract concepts but tangible assets. By bridging the gap between digital recognition and physical deeds, we empower citizens to take active ownership of their communities while fostering a culture of accountability through secure, verified reporting. We strive to inspire long-term positive habits—from environmental stewardship to neighborly support—that transform our cities into safer, more connected hubs of innovation. Ultimately, we are building a foundation of trust that redefines how the world perceives and incentivizes collective progress, one deed at a time.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default UserDashboard;