import React from 'react';
import { Shield, Heart, Leaf, GraduationCap, Activity, Lightbulb } from 'lucide-react';

interface Props {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
  compact?: boolean;
}

const categories = [
  { id: 'civic', label: 'Civic Responsibility', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'community', label: 'Community Service', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'environment', label: 'Environment', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'health', label: 'Health', icon: Activity, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'innovation', label: 'Innovation', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const DeedCategories: React.FC<Props> = ({ onSelectCategory, onBack, compact = false }) => {
  return (
    <div className={`${compact ? '' : 'max-w-5xl mx-auto'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      {!compact && (
        <div className="mb-8 bg-gradient-to-br from-emerald-900/90 to-green-950/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none"></div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 drop-shadow-md relative z-10">Report a Deed</h1>
          <p className="text-emerald-100/80 font-medium relative z-10">Select a category to begin your submission.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.label)}
            className={`
              group relative flex flex-col items-center justify-center p-8 rounded-3xl 
              bg-white border-2 border-slate-100 shadow-sm 
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-xl
            `}
          >
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center mb-6 
              transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3
              ${cat.bg} ${cat.color}
            `}>
              <cat.icon className="w-10 h-10" strokeWidth={2} />
            </div>
            <span className="font-bold text-slate-700 text-lg group-hover:text-slate-900 text-center leading-tight">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeedCategories;