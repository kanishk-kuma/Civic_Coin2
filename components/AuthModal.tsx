import React, { useState } from 'react';
import { X, Mail, Lock, User, Calendar, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (profile: { name: string; email: string }) => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuth }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    age: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth logic
    const profile = isSignUp 
      ? { name: formData.name, email: formData.email }
      : { name: formData.username || 'Citizen', email: `${(formData.username || 'citizen').toLowerCase().replace(/\s+/g, '.')}@city.gov` };
    
    onAuth(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
       <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-[#1a365d] p-6 text-white text-center relative overflow-hidden">
             <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
             </button>
             <h2 className="text-2xl font-black mb-1">{isSignUp ? 'Join the Movement' : 'Welcome Back'}</h2>
             <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">
               {isSignUp ? 'Create your Civic Profile' : 'Access your Dashboard'}
             </p>
          </div>
          
          {/* Toggle */}
          <div className="flex p-2 m-6 bg-slate-100 rounded-xl">
             <button 
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-white text-[#1a365d] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Sign In
             </button>
             <button 
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-white text-[#1a365d] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Sign Up
             </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
             {isSignUp ? (
               <>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         required
                         type="text"
                         placeholder="Jane Doe"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800"
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         required
                         type="email"
                         placeholder="jane@example.com"
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800"
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Age</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         required
                         type="number"
                         placeholder="25"
                         value={formData.age}
                         onChange={e => setFormData({...formData, age: e.target.value})}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800"
                       />
                    </div>
                 </div>
               </>
             ) : (
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">User Name</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         required
                         type="text"
                         placeholder="Enter your username"
                         value={formData.username}
                         onChange={e => setFormData({...formData, username: e.target.value})}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800"
                       />
                    </div>
                 </div>
             )}

             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                     required
                     type="password"
                     placeholder="••••••••"
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-800"
                   />
                </div>
             </div>

             <button 
               type="submit"
               className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
             >
               {isSignUp ? 'Create Account' : 'Sign In'}
               <ArrowRight className="w-4 h-4" />
             </button>
          </form>
       </div>
    </div>
  );
};

export default AuthModal;