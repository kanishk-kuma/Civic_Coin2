import React, { useState } from 'react';
import { User, Star, CheckCircle, ArrowRightLeft, Shield, ArrowLeft, X, Lock } from 'lucide-react';
import { UserState } from '../types';

interface Props {
  userState: UserState;
  userProfile: { name: string; email: string } | null;
  onSwitchToNGO: () => void;
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ userState, userProfile, onSwitchToNGO, onBack }) => {
  const displayProfile = userProfile || { name: 'Guest Citizen', email: 'guest@city.gov' };
  
  // Volunteer Auth State
  const [showNGOAuth, setShowNGOAuth] = useState(false);
  const [ngoId, setNgoId] = useState('');
  const [authError, setAuthError] = useState('');

  const handleNGOLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ngoId) {
        setAuthError('ID is required');
        return;
    }
    // Validation: 10 digit number
    if (/^\d{10}$/.test(ngoId)) {
      onSwitchToNGO();
    } else {
      setAuthError('Please enter a valid 10-digit Volunteer ID');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="group flex items-center text-slate-800 hover:text-black font-bold transition-all bg-white/60 hover:bg-white backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
      </div>

      <div className="bg-gradient-to-br from-emerald-900/90 to-green-950/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none"></div>
        <h1 className="text-3xl font-black text-white tracking-tight relative z-10">Settings & Profile</h1>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 flex flex-col md:flex-row gap-8 items-center md:items-start">
         {/* Profile Info */}
         <div className="flex flex-col items-center md:items-start space-y-4 flex-1">
             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-[#1a365d] shadow-inner border-4 border-white">
                <User className="w-10 h-10" />
             </div>
             <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-800">{displayProfile.name}</h2>
                <p className="text-slate-500 font-medium">{displayProfile.email}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                   {userProfile ? 'Verified Citizen' : 'Guest Account'}
                </div>
             </div>
         </div>

         {/* Stats */}
         <div className="flex-1 w-full space-y-4">
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                     <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                  </div>
                  <span className="font-bold text-slate-600">Civic Points</span>
               </div>
               <span className="text-2xl font-black text-[#1a365d]">{userState.points}</span>
            </div>
            
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                     <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-bold text-slate-600">Deeds Verified</span>
               </div>
               <span className="text-2xl font-black text-slate-800">
                  {userState.deeds.filter(d => d.status === 'VERIFIED').length}
               </span>
            </div>
         </div>
      </div>

      {/* Switch Account */}
      <div className="bg-[#1a365d] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
             <Shield className="w-32 h-32 rotate-12" />
         </div>
         <div className="relative z-10 max-w-lg">
            <h3 className="text-xl font-bold mb-2">Volunteer Portal Access</h3>
            <p className="text-blue-200 mb-6">Switch to the NGO interface to verify deeds and manage community events.</p>
            <button 
               onClick={() => setShowNGOAuth(true)}
               className="bg-white text-[#1a365d] px-6 py-3 rounded-xl font-black hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
            >
               Switch to Volunteer Hub
               <ArrowRightLeft className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Volunteer Auth Modal */}
      {showNGOAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowNGOAuth(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-[#1a365d] p-6 text-white text-center relative">
              <button onClick={() => setShowNGOAuth(false)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/20">
                 <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black">Volunteer Access</h3>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mt-1">Authorized Personnel Only</p>
            </div>
            
            <form onSubmit={handleNGOLogin} className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Unique Volunteer ID</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      autoFocus
                      type="text" 
                      maxLength={10}
                      placeholder="Enter 10-digit ID"
                      value={ngoId}
                      onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setNgoId(val);
                          setAuthError('');
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800 tracking-widest ${authError ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                    />
                  </div>
                  {authError && <p className="text-red-500 text-[10px] font-bold ml-1 animate-in slide-in-from-left-2">{authError}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1a365d] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                >
                  <span>Login to Hub</span>
                  <ArrowRightLeft className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;