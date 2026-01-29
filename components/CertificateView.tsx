import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  points: number;
  onBack: () => void;
}

const CertificateView: React.FC<Props> = ({ points, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = certificateRef.current;
      
      // Capture the element as a canvas
      const canvas = await html2canvas(element, {
        scale: 3, // High resolution scale
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // Ensure we capture exactly what's shown including rotations and opacities
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.certificate-container') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.boxShadow = 'none';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF with dimensions matching the captured canvas aspect ratio
      // Standard A4 is 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CivicCoin-Certificate.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Action Controls */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center relative z-10">
        <button 
          onClick={onBack}
          disabled={isDownloading}
          className="flex items-center text-slate-600 hover:text-[#1a365d] font-bold transition-all bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center bg-[#10b981] text-white px-8 py-3 rounded-xl font-black transition-all shadow-lg active:scale-95 group ${isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#059669]'}`}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-3 transition-transform group-hover:translate-y-0.5" />
                Download PDF Certificate
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Certificate - Replicating the latest screenshot precisely */}
      <div 
        ref={certificateRef}
        className="certificate-container max-w-[850px] mx-auto bg-white shadow-2xl p-16 md:p-32 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 min-h-[1100px] flex flex-col justify-center"
      >
        
        {/* Slanted Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-35deg]">
          <span className="text-9xl font-black whitespace-nowrap">
            Certified by Civic Coin
          </span>
        </div>

        <div className="relative z-10 space-y-16">
          {/* Main Heading */}
          <div className="text-left mb-16">
            <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
              WORD OF APPRECIATION
            </h1>
          </div>
          
          {/* Certificate Body Text */}
          <div className="space-y-8 text-gray-700 text-lg leading-[1.8] font-medium max-w-2xl">
            <p>
              This is to formally express sincere appreciation and recognition for the dedicated efforts and 
              selfless service rendered towards establishing and promoting civic sense within society. Your 
              consistent commitment to encouraging responsible behavior, social awareness, mutual 
              respect, and community discipline has made a meaningful impact.
            </p>
            <p>
              Through your actions and initiatives, you have contributed significantly to nurturing a culture 
              of accountability, cleanliness, cooperation, and ethical public conduct. Such contributions 
              play a vital role in strengthening the social fabric and inspiring citizens to actively participate 
              in building a more conscious, respectful, and progressive society. This document stands as a 
              token of gratitude and acknowledgment for your valuable service to the community.
            </p>
          </div>

          {/* Credits and Certification Section */}
          <div className="space-y-12 pt-8">
            <div className="flex items-baseline max-w-md">
              <span className="font-bold text-gray-900 mr-2 text-lg">Accumulated Credits:</span>
              <span className="flex-1 border-b-2 border-gray-400 pb-1 font-bold text-2xl text-slate-800 px-4 text-center">
                {points}
              </span>
            </div>

            <div className="pt-8">
              <p className="text-gray-900 text-base leading-relaxed">
                <span className="font-bold mr-1">CERTIFIED BY</span> 
                <span className="italic">Certified by Civic Coin - Issued in recognition of exemplary civic responsibility.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;