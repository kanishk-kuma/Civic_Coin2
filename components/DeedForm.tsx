import React, { useState } from 'react';
import { MapPin, Camera, X, ArrowLeft, Send, Sparkles, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';
import { Deed } from '../types';

interface Props {
  category?: string;
  onCancel: () => void;
  onSubmit: (deed: Omit<Deed, 'id' | 'status' | 'pointsAwarded'>) => void;
}

const DeedForm: React.FC<Props> = ({ category, onCancel, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmit({
        description: category ? `[${category}] ${description}` : description,
        location,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`, // Keep dummy URL for internal data consistency
        timestamp: new Date().toLocaleString(),
        aiClassification: category || 'Processing...'
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploaded(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className="group flex items-center text-slate-800 hover:text-black font-bold transition-all bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        {category && (
          <span className="px-3 py-1 bg-white text-[#1a365d] rounded-full text-xs font-black uppercase tracking-widest border border-slate-200 shadow-sm">
            {category}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Page Title */}
        <div className="mb-10 bg-gradient-to-br from-emerald-900 to-green-950 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden text-white border border-white/10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 p-8 opacity-20">
              <Sparkles className="w-32 h-32 rotate-12" />
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-3 relative z-10">
            {category ? `Report: ${category}` : 'Report a New Deed'}
          </h2>
          <p className="text-emerald-100 font-medium text-lg max-w-2xl relative z-10">
            Capture your contribution to receive Civic Points and official recognition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Evidence Photo Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group hover:border-blue-200 transition-colors">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                   <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <Camera className="w-4 h-4" />
                   </div>
                   <label className="text-xs font-black text-slate-700 uppercase tracking-widest">1. Evidence Photo</label>
                </div>
                {imageUploaded && <span className="text-[10px] font-bold text-green-700 flex items-center bg-green-100 px-3 py-1 rounded-full border border-green-200">File Selected</span>}
              </div>
              <div 
                className={`h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 z-10 ${imageUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/50'}`}
              >
                {imageUploaded ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="bg-emerald-500 p-3 rounded-full shadow-lg shadow-emerald-200 mb-3">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-900 font-black text-lg">Image uploaded</p>
                    <button 
                      type="button"
                      onClick={() => setImageUploaded(false)}
                      className="mt-4 text-[10px] uppercase tracking-widest font-black text-slate-500 hover:text-red-600 transition-colors flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Replace Photo
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 transition-transform group-hover:scale-110">
                      <ImageIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-800 font-bold">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">PNG, JPG, HEIC up to 10MB</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Location Information Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group hover:border-orange-200 transition-colors">
               <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <MapPin className="w-4 h-4" />
                     </div>
                     <label className="text-xs font-black text-slate-700 uppercase tracking-widest">3. Location Details</label>
                  </div>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within/input:text-orange-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input 
                      required
                      type="text" 
                      placeholder="Neighborhood, street, or landmark..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-900 placeholder-slate-400 font-bold text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-3 flex items-center gap-1">
                     <Info className="w-3 h-3" />
                     Precise location helps us verify your deed faster.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="h-full">
            {/* Description Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl h-full flex flex-col relative overflow-hidden group hover:border-purple-200 transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[6rem] -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Info className="w-4 h-4" />
                     </div>
                     <label className="text-xs font-black text-slate-700 uppercase tracking-widest">2. Impact Description</label>
                  </div>
                  <div className="relative flex-grow">
                     <textarea 
                      required
                      placeholder="Describe what you did and the impact it had on the community..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-full p-5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-slate-900 placeholder-slate-400 text-base font-medium leading-relaxed resize-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-3 text-right">
                     Minimum 20 characters required.
                  </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 pt-4 border-t border-slate-200/50">
          <button 
            type="button"
            onClick={onCancel}
            className="order-2 sm:order-1 flex-1 py-5 text-slate-600 font-bold rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:shadow-md"
          >
            Cancel Request
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`order-1 sm:order-2 flex-[2] py-5 bg-[#10b981] hover:bg-[#059669] text-white font-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'}`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Finalizing Submission...
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-3" />
                Submit Official Report
              </>
            )}
          </button>
        </div>
      </form>
      
      <p className="text-center text-[10px] text-slate-500 font-medium px-10">
        By submitting, you agree to the Civic Transparency Guidelines. Submissions are geostamped and verified by authorized community volunteers.
      </p>
    </div>
  );
};

export default DeedForm;