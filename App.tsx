
import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import { generateGymVersion } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(async (image: string) => {
    setOriginalImage(image);
    setState(AppState.PROCESSING);
    setError(null);
    
    try {
      const result = await generateGymVersion(image);
      setGeneratedImage(result);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("Failed to generate gym version. The AI might be busy or the image was rejected.");
      setState(AppState.ERROR);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setOriginalImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-zinc-900 sticky top-0 bg-black/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tighter">GYMGLOW <span className="text-emerald-500">AI</span></h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {state === AppState.IDLE && (
          <div className="text-center space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
                See your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">future pump</span>
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl font-medium">
                Upload a photo or take a selfie to visualize your post-workout transformation using Gemini 2.5 AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setState(AppState.CAPTURING)}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-emerald-400 hover:text-black transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Take Selfie
              </button>
              
              <label className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all cursor-pointer transform active:scale-95 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
            
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Realistic Sweat', 'Muscle Pump', 'Gym Gear', 'Modern Lighting'].map((feat) => (
                <div key={feat} className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-tight">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === AppState.CAPTURING && (
          <div className="w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
             <h3 className="text-2xl font-bold">Position your face clearly</h3>
             <CameraView 
                onCapture={handleCapture}
                onCancel={() => setState(AppState.IDLE)}
             />
          </div>
        )}

        {state === AppState.PROCESSING && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Injecting Gains...</h3>
              <p className="text-zinc-500 italic">"The only bad workout is the one that didn't happen."</p>
            </div>
          </div>
        )}

        {state === AppState.RESULT && originalImage && generatedImage && (
          <ResultView 
            original={originalImage}
            generated={generatedImage}
            onReset={reset}
          />
        )}

        {state === AppState.ERROR && (
          <div className="max-w-md w-full p-8 bg-zinc-900 rounded-3xl border border-red-500/30 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Workout Interrupted</h3>
              <p className="text-zinc-400">{error || "Something went wrong with the AI transformation."}</p>
            </div>
            <button 
              onClick={reset}
              className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-all"
            >
              Back to Start
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-zinc-600 text-xs border-t border-zinc-900">
        <p>© 2024 GYMGLOW AI. No pain, no gain.</p>
      </footer>
    </div>
  );
};

export default App;
