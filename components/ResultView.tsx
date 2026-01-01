
import React from 'react';

interface ResultViewProps {
  original: string;
  generated: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ original, generated, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider text-center">Before Gym</p>
          <div className="aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img src={original} alt="Original" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider text-center">After Gym (AI)</p>
          <div className="aspect-square rounded-2xl overflow-hidden border border-emerald-500/30 bg-zinc-900 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <img src={generated} alt="Generated Gym Version" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all transform active:scale-95"
        >
          Try Another Photo
        </button>
        
        <button 
          onClick={() => {
            const link = document.createElement('a');
            link.href = generated;
            link.download = 'gymglow-after.png';
            link.click();
          }}
          className="text-zinc-400 hover:text-white text-sm underline underline-offset-4"
        >
          Download Result
        </button>
      </div>
    </div>
  );
};

export default ResultView;
