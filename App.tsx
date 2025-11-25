import React, { useState, useEffect } from 'react';
import { geminiService } from './services/gemini';
import { FullAnalysisResult, LicensingParams } from './types';
import { BrandCard, SonicBriefCard, TrackResults, LicensingView } from './components/AnalysisDisplay';
import { Loader2, Music4, ArrowRight, Globe2, Calendar, MonitorPlay, Zap } from 'lucide-react';

const SocialProof = () => (
  <div className="flex flex-wrap justify-center items-center gap-8 py-6 border-b border-slate-200/60 bg-white/30 backdrop-blur-sm">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-4">Trusted by creative teams at</span>
      {['Ogilvy', 'Wieden+Kennedy', 'McCann', 'Publicis', 'Droga5'].map((agency, i) => (
          <span key={i} className="text-sm font-bold text-slate-400/80 uppercase tracking-widest hover:text-teal-600 transition-colors cursor-default">
              {agency}
          </span>
      ))}
  </div>
);

// --- SMART LOADING VIEW ---
const SmartLoadingView = ({ budget, params }: { budget: number, params: LicensingParams }) => {
    const [projectedRoute, setProjectedRoute] = useState<string>("Analyzing...");
    
    useEffect(() => {
        // Quick Client-Side Heuristic for Immediate Feedback
        let complexityScore = 1;
        if (params.usage === 'All Media') complexityScore *= 3;
        if (params.territory === 'Worldwide') complexityScore *= 2.5;
        if (params.territory === 'Single Continent') complexityScore *= 1.5;
        if (params.term === '24 Months') complexityScore *= 1.5;
        
        // Base arbitrary cost unit to compare against
        const baseCost = 2000; 
        const estimatedMarketVal = baseCost * complexityScore;
        
        // Ratio of Budget to Estimated Need
        const feasibility = budget / estimatedMarketVal;
        
        // Determine likely route
        let likely = "Library";
        if (feasibility > 10) likely = "Known Artist";
        else if (feasibility > 4) likely = "Bespoke or Indie";
        else if (feasibility > 2) likely = "Indie or Library";
        
        // Artificial delay for effect
        const t = setTimeout(() => {
            setProjectedRoute(likely);
        }, 800);
        return () => clearTimeout(t);
    }, [budget, params]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-8 relative overflow-hidden ring-1 ring-slate-100 group">
                <div className="absolute inset-0 bg-teal-50/50 animate-pulse"></div>
                <Music4 className="w-10 h-10 text-teal-500 relative z-10 animate-bounce" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
                 <h2 className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Preliminary Feasibility Check</h2>
                 
                 <div className="flex justify-between items-center mb-4 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="text-xs font-medium text-slate-500">Your Budget</span>
                     <span className="text-sm font-bold text-slate-900">€{budget.toLocaleString()}</span>
                 </div>

                 <div className="space-y-1">
                     <div className="text-[10px] uppercase font-bold text-teal-600 tracking-widest">Based on your terms</div>
                     <div className="text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2">
                         {projectedRoute === "Analyzing..." ? (
                             <span className="animate-pulse">Calculating...</span>
                         ) : (
                             <>
                                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                                {projectedRoute}
                             </>
                         )}
                     </div>
                     <div className="text-xs text-slate-400 mt-2 font-medium">Processing full strategy...</div>
                 </div>
            </div>
        </div>
    );
}

function App() {
  // Input State
  const [inputData, setInputData] = useState({
    brandName: '',
    industry: '',
    description: '',
    values: '',
    referenceLink: ''
  });
  const [budget, setBudget] = useState(10000);
  
  // Licensing Parameters State
  const [licensingParams, setLicensingParams] = useState({
    usage: 'Online Only',
    term: '12 Months',
    territory: 'Single Country'
  });

  // App State
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [data, setData] = useState<FullAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'tracks' | 'licensing'>('brief');
  
  const handleAnalyze = async () => {
    if (!inputData.brandName || !inputData.description) return;
    
    try {
      setError(null);
      setStatus('processing'); // Simplified status since we show Smart View immediately

      const result = await geminiService.generateFullStrategy(inputData, budget, licensingParams);
      
      setData(result);
      setStatus('complete');
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please check your inputs and API key.");
      setStatus('idle');
    }
  };

  const resetApp = () => {
    setData(null);
    setStatus('idle');
    setInputData({brandName: '', industry: '', description: '', values: '', referenceLink: ''});
    setBudget(10000);
    setLicensingParams({ usage: 'Online Only', term: '12 Months', territory: 'Single Country' });
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* HEADER */}
      <header className="border-b border-slate-200/60 bg-white/60 sticky top-0 z-50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
              <Music4 className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-xl text-slate-900 tracking-tight leading-none">SOUND MY BRAND</h1>
                <span className="text-[9px] text-teal-600 font-bold uppercase tracking-[0.2em] block mt-0.5">Sonic Intelligence Unit</span>
            </div>
          </div>
          {status === 'complete' && (
              <button 
                  onClick={resetApp}
                  className="text-[10px] font-bold text-slate-500 hover:text-teal-600 uppercase tracking-widest transition-colors border border-slate-200 px-5 py-2.5 rounded-lg hover:bg-white hover:border-teal-200 hover:shadow-sm bg-white/50"
              >
                  New Project
              </button>
          )}
        </div>
      </header>

      {status === 'idle' && <SocialProof />}

      {/* INPUT SECTION */}
      {status === 'idle' && (
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                AI-Powered Sync Strategy
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tighter leading-tight">
              Find the perfect sound <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400">in seconds.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Input your brand DNA. We generate the brief, analyze the competition, and curate sync-ready tracks from the world's best catalogues.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden ring-1 ring-slate-100">
             
            <div className="grid md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-8">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Brand Identity</label>
                        <div className="space-y-4">
                            <input 
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium shadow-sm"
                                placeholder="Brand Name (e.g. Acme Motors)"
                                value={inputData.brandName}
                                onChange={e => setInputData({...inputData, brandName: e.target.value})}
                            />
                            <input 
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium shadow-sm"
                                placeholder="Industry (e.g. Automotive, Tech)"
                                value={inputData.industry}
                                onChange={e => setInputData({...inputData, industry: e.target.value})}
                            />
                        </div>
                    </div>

                     <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">Vibe Check</label>
                        <input 
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium shadow-sm"
                            placeholder="Key Values (e.g. Innovative, Warm, Rebellious)"
                            value={inputData.values}
                            onChange={e => setInputData({...inputData, values: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="space-y-8 flex flex-col">
                    <div className="flex-1 flex flex-col">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">The Brief</label>
                        <textarea 
                            className="w-full flex-1 bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium resize-none leading-relaxed min-h-[100px] shadow-sm"
                            placeholder="Insert Your Brief Here..."
                            value={inputData.description}
                            onChange={e => setInputData({...inputData, description: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 flex justify-between">
                            <span>Max Budget Cap</span>
                            <span className="text-teal-600 font-bold">€{budget.toLocaleString()}</span>
                        </label>
                        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                             <input 
                                type="range" 
                                min="1000" 
                                max="100000" 
                                step="1000" 
                                value={budget} 
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* LICENSING PARAMETERS */}
            <div className="border-t border-slate-100 pt-8 pb-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Licensing Requirements</label>
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Usage */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MonitorPlay className="w-4 h-4" /></div>
                        <select 
                            value={licensingParams.usage}
                            onChange={(e) => setLicensingParams({...licensingParams, usage: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 pl-12 text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium appearance-none cursor-pointer hover:border-teal-300"
                        >
                            <option value="Online Only">Online Only</option>
                            <option value="All Media">All Media</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                    </div>

                    {/* Term */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Calendar className="w-4 h-4" /></div>
                         <select 
                            value={licensingParams.term}
                            onChange={(e) => setLicensingParams({...licensingParams, term: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 pl-12 text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium appearance-none cursor-pointer hover:border-teal-300"
                        >
                            <option value="3 Months">3 Months</option>
                            <option value="6 Months">6 Months</option>
                            <option value="12 Months">12 Months</option>
                            <option value="24 Months">24 Months</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                    </div>

                    {/* Territory */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Globe2 className="w-4 h-4" /></div>
                         <select 
                            value={licensingParams.territory}
                            onChange={(e) => setLicensingParams({...licensingParams, territory: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 pl-12 text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-sm font-medium appearance-none cursor-pointer hover:border-teal-300"
                        >
                            <option value="Single Country">Single Country</option>
                            <option value="Single Continent">Single Continent</option>
                            <option value="Worldwide">Worldwide</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end pt-8 mt-6">
                 <button
                    onClick={handleAnalyze}
                    disabled={!inputData.brandName || !inputData.description || status !== 'idle'}
                    className="w-full md:w-auto bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold px-12 py-5 rounded-xl shadow-xl shadow-teal-500/30 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-3 uppercase tracking-wider text-xs transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {status === 'idle' ? (
                        <>Generate Strategy <ArrowRight className="w-4 h-4" /></>
                    ) : (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing Input</>
                    )}
                </button>
            </div>

            {error && <div className="mt-6 text-rose-600 text-xs font-medium text-center bg-rose-50 py-3 rounded-xl border border-rose-100">{error}</div>}
          </div>
        </div>
      )}

      {/* LOADING VIEW */}
      {status === 'processing' && (
        <SmartLoadingView budget={budget} params={licensingParams} />
      )}

      {/* RESULTS VIEW */}
      {status === 'complete' && data && (
          <div className="max-w-[1600px] mx-auto px-6 py-8">
              {/* Navigation Tabs */}
              <div className="flex justify-center gap-2 mb-12 bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-lg shadow-slate-200/50 border border-white w-fit mx-auto">
                  {[
                      {id: 'brief', label: 'Analysis & Brief'},
                      {id: 'tracks', label: 'Track Selection'},
                      {id: 'licensing', label: 'Licensing Plan'}
                  ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.1em] rounded-full transition-all ${
                            activeTab === tab.id 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>

              {/* Content Areas */}
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                  {activeTab === 'brief' && (
                      <div className="grid gap-8">
                          <BrandCard data={data.brand_analysis} />
                          <SonicBriefCard data={data.sonic_brief} />
                      </div>
                  )}

                  {activeTab === 'tracks' && (
                       <TrackResults tracks={data.track_recommendations} videoFile={null} />
                  )}

                  {activeTab === 'licensing' && (
                      <LicensingView plan={data.licensing_plan} />
                  )}
              </div>
          </div>
      )}
    </div>
  );
}

export default App;