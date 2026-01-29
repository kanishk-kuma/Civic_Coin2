import React, { useState, useEffect, useRef } from 'react';
import { Shield, Star, MapPin, PlusCircle, CheckCircle, Award, LayoutDashboard, Search, User, Menu, X, ArrowRightLeft, Settings, Home, LogOut, ChevronRight } from 'lucide-react';
import { Deed, DeedStatus, Reward, UserState, AppView, CivicEvent } from './types';
import UserDashboard from './components/UserDashboard';
import NGOPortal from './components/NGOPortal';
import DeedForm from './components/DeedForm';
import ActivityHistory from './components/ActivityHistory';
import CertificateView from './components/CertificateView';
import SettingsView from './components/SettingsView';
import DeedCategories from './components/DeedCategories';
import AuthModal from './components/AuthModal';

const CivicCoinLogo = () => (
  <div className="flex flex-col items-center group cursor-pointer select-none">
    <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105 duration-300">
      <path 
        d="M 40 12 A 18 18 0 1 0 40 38 L 60 12 A 18 18 0 1 1 60 38" 
        stroke="#1a365d" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
    <div className="text-[15px] font-black tracking-[0.45em] flex items-center -mt-1 ml-1">
      <span 
        className="text-[#60a5fa]"
        style={{ textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000' }}
      >
        CIVIC
      </span>
      <span 
        className="text-[#1a365d] ml-2"
        style={{ textShadow: '-0.5px -0.5px 0 #fff, 0.5px -0.5px 0 #fff, -0.5px 0.5px 0 #fff, 0.5px 0.5px 0 #fff' }}
      >
        COIN.
      </span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('USER');
  const [lastView, setLastView] = useState<AppView>('USER'); // Track previous view
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{name: string, email: string} | null>(null);

  // Scroll detection for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [userState, setUserState] = useState<UserState>({
    points: 0,
    deeds: [],
    rewards: []
  });

  const [activeEvent, setActiveEvent] = useState<CivicEvent | null>(null);

  const handleAddDeed = (newDeed: Omit<Deed, 'id' | 'status' | 'pointsAwarded'>) => {
    const basePoints = 50;
    const pointsAwarded = activeEvent ? Math.round(basePoints * activeEvent.multiplier) : basePoints;
    
    const deed: Deed = {
      ...newDeed,
      id: Math.random().toString(36).substr(2, 9),
      status: DeedStatus.PENDING,
      pointsAwarded
    };
    setUserState(prev => ({
      ...prev,
      deeds: [deed, ...prev.deeds]
    }));
    setView('USER');
    // Scroll to deeds section after adding
    setTimeout(() => {
      const element = document.getElementById('recent-activity');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleVerifyDeed = (id: string) => {
    setUserState(prev => {
      const updatedDeeds = prev.deeds.map(d => 
        d.id === id ? { ...d, status: DeedStatus.VERIFIED } : d
      );
      const verifiedDeed = prev.deeds.find(d => d.id === id);
      
      if (verifiedDeed && verifiedDeed.status !== DeedStatus.VERIFIED) {
        const newReward: Reward = {
          id: `r-${Date.now()}`,
          type: Math.random() > 0.5 ? 'LETTER' : 'VOUCHER',
          title: 'Official Civic Recognition',
          issuedDate: new Date().toISOString().split('T')[0],
          description: `Reward for deed: ${verifiedDeed.description.substring(0, 30)}...`,
          code: Math.random().toString(36).toUpperCase().substring(2, 8)
        };
        
        return {
          ...prev,
          points: prev.points + (verifiedDeed.pointsAwarded || 50),
          deeds: updatedDeeds,
          rewards: [newReward, ...prev.rewards]
        };
      }
      return prev;
    });
  };

  const handleRejectDeed = (id: string) => {
    setUserState(prev => ({
      ...prev,
      deeds: prev.deeds.map(d => 
        d.id === id ? { ...d, status: DeedStatus.INVALID } : d
      )
    }));
  };

  const handlePostEvent = (event: CivicEvent) => {
    setActiveEvent(event);
  };

  const scrollToSection = (id: string) => {
    if (view !== 'USER') {
      setView('USER');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuth = (profile: { name: string, email: string }) => {
    setUserProfile(profile);
    // Upon auth (Sign in or Create Account), navigate to Home (USER view)
    setView('USER');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen civic-global-theme font-sans">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuth={handleAuth}
      />

      {/* Sticky Navigation Header */}
      {view !== 'CERTIFICATE' && (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 py-2 shadow-sm' : 'bg-transparent border-transparent py-4'}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div onClick={() => setView('USER')} className="cursor-pointer">
              <CivicCoinLogo />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {!userProfile ? (
                <>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-bold text-slate-600 hover:text-[#1a365d] transition-colors">Home</button>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-bold text-slate-600 hover:text-[#1a365d] transition-colors">How it Works</button>
                  <button onClick={() => scrollToSection('our-vision')} className="text-sm font-bold text-slate-600 hover:text-[#1a365d] transition-colors">Vision</button>
                </>
              ) : (
                <>
                  {/* Authenticated user nav items can go here if needed, currently only Profile is requested */}
                </>
              )}
              
              {/* Profile Text Link - Only show if authenticated AND not in NGO view */}
              {userProfile && view !== 'NGO' && (
                <div className="relative h-full flex items-center ml-4">
                  <button 
                    onClick={() => {
                      setLastView(view);
                      setView('SETTINGS');
                    }}
                    className="text-sm font-bold text-slate-600 hover:text-[#1a365d] transition-colors cursor-pointer"
                  >
                    Profile
                  </button>
                </div>
              )}
            </nav>

            <div className="flex items-center space-x-4">
               {/* Sign up / Sign in Button */}
               {!userProfile ? (
                 <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm"
                 >
                   Sign up / Sign in
                 </button>
               ) : (
                 view !== 'NGO' && (
                  <div className="flex items-center gap-3">
                      <div className="hidden md:flex items-center gap-3 bg-orange-50 py-1.5 px-3 rounded-xl border border-orange-100 shadow-sm">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Star className="w-4 h-4 fill-white" />
                          </div>
                          <div className="hidden lg:block">
                            <p className="text-xs font-black text-slate-900 leading-none">{userState.points}</p>
                            <p className="text-[9px] font-bold text-orange-600 leading-none mt-0.5">Civic Points</p>
                          </div>
                      </div>
                      <button 
                          onClick={() => {
                            setUserProfile(null);
                            setView('USER');
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-2.5 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm flex items-center gap-2"
                      >
                          <LogOut className="w-4 h-4" />
                          <span className="hidden sm:inline">Sign Out</span>
                      </button>
                  </div>
                 )
               )}
            </div>
          </div>
        </header>
      )}

      <main className={`${view !== 'CERTIFICATE' ? 'pt-24' : ''}`}>
        <div className="w-full">
          {view === 'USER' && (
            <UserDashboard 
              userState={userState} 
              activeEvent={activeEvent}
              onReportDeed={() => setView('DEED_CATEGORIES')} 
              onViewAll={() => setView('HISTORY')}
              onViewCertificate={() => setView('CERTIFICATE')}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setView('FORM');
              }}
              userProfile={userProfile}
            />
          )}
          
          {/* Inner Views rendered within a centered container for focus */}
          <div className={`${view !== 'USER' && view !== 'CERTIFICATE' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
            {view === 'DEED_CATEGORIES' && (
              <DeedCategories 
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setView('FORM');
                }}
                onBack={() => setView('USER')}
              />
            )}
            {view === 'NGO' && (
              <NGOPortal 
                deeds={userState.deeds} 
                onVerify={handleVerifyDeed} 
                onReject={handleRejectDeed}
                onPostEvent={handlePostEvent}
                activeEvent={activeEvent}
                onBack={() => setView('SETTINGS')}
              />
            )}
            {view === 'FORM' && (
              <DeedForm 
                category={selectedCategory}
                onCancel={() => setView('USER')} 
                onSubmit={handleAddDeed} 
              />
            )}
            {view === 'HISTORY' && (
              <ActivityHistory 
                deeds={userState.deeds}
                onBack={() => setView('USER')}
                onReportDeed={() => setView('DEED_CATEGORIES')}
                userState={userState}
              />
            )}
            {view === 'SETTINGS' && (
              <SettingsView 
                userState={userState}
                userProfile={userProfile}
                onSwitchToNGO={() => setView('NGO')}
                onBack={() => setView(lastView)}
              />
            )}
          </div>
          
          {view === 'CERTIFICATE' && (
            <CertificateView 
              points={userState.points}
              onBack={() => setView('USER')}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      {view === 'USER' && (
        <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-20">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                 <div className="mb-4"><CivicCoinLogo /></div>
                 <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                    Empowering citizens to build better communities through recognized actions, verified impact, and government-backed rewards.
                 </p>
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                 <ul className="space-y-2 text-sm text-slate-600">
                    <li className="hover:text-emerald-600 cursor-pointer">About Us</li>
                    <li className="hover:text-emerald-600 cursor-pointer">Partnerships</li>
                    <li className="hover:text-emerald-600 cursor-pointer">Gov Integration</li>
                    <li className="hover:text-emerald-600 cursor-pointer">Privacy Policy</li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
                 <ul className="space-y-2 text-sm text-slate-600">
                    <li className="hover:text-emerald-600 cursor-pointer">Twitter / X</li>
                    <li className="hover:text-emerald-600 cursor-pointer">LinkedIn</li>
                    <li className="hover:text-emerald-600 cursor-pointer">Contact Support</li>
                 </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
              © 2024 Civic Coin Initiative. All rights reserved.
           </div>
        </footer>
      )}
    </div>
  );
};

export default App;