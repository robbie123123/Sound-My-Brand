import React, { useState, useRef, useEffect } from 'react';
import { BrandAnalysis, SonicBrief, Track, LicensingPlan, FullAnalysisResult } from '../types';
import { Target, Radio, Play, Pause, CheckCircle2, Zap, AlertTriangle, Activity, Layers, Disc, ExternalLink, Clock, Mail, MoreHorizontal, Heart, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// --- BRAND CARD ---
export const BrandCard = ({ data }: { data: BrandAnalysis }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative overflow-hidden group ring-1 ring-slate-100">
    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity text-rose-500">
        <Target className="w-40 h-40" />
    </div>
    
    <div className="grid md:grid-cols-2 gap-12 relative z-10">
      <div>
        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="p-1 bg-rose-100 rounded"><Target className="w-3 h-3" /></div> Brand DNA
        </h3>
        <div className="space-y-8">
            <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Brand Archetype</div>
                <div className="text-5xl font-light text-slate-900 tracking-tighter leading-tight">
                  {data.archetype}
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                    {data.tone_keywords.map(k => (
                        <span key={k} className="text-[10px] uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full font-bold">{k}</span>
                    ))}
                </div>
            </div>
            
            <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Core Values</div>
                <div className="flex flex-wrap gap-2">
                    {data.inferred_values.map((v, i) => (
                        <span key={i} className="text-sm font-medium text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">{v}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="border-l border-slate-100 pl-12 relative">
         <h3 className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <div className="p-1 bg-teal-100 rounded"><Layers className="w-3 h-3" /></div> Similar Brands
        </h3>
        
        <div className="space-y-8">
             <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-bold">Competitive Landscape</div>
                <div className="flex flex-col gap-3">
                    {data.comparison_brands?.map((b, i) => (
                        <div key={i} className="flex items-center justify-between text-sm font-medium text-slate-700 bg-slate-50/50 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-default group/brand">
                            <span>{b}</span>
                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover/brand:text-teal-400" />
                        </div>
                    )) || <div className="text-sm text-slate-400 italic">Analyzing market...</div>}
                </div>
             </div>

             <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">Deployment Strategy</div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="text-sm font-bold text-slate-900 px-3 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700">
                        {data.usage.term_months} MONTHS
                    </div>
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <div className="text-xs font-mono text-slate-500">{data.usage.geos.join(' / ')}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {data.usage.placements.slice(0,4).map(p => (
                        <span key={p} className="text-[9px] bg-slate-800 text-white px-2 py-1 rounded font-medium tracking-wide">{p.toUpperCase()}</span>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </div>
  </div>
);

// --- SONIC BRIEF CARD ---
export const SonicBriefCard = ({ data }: { data: SonicBrief }) => {
  const radarData = [
    { subject: 'ENERGY', A: data.energy === 'high' ? 100 : data.energy === 'medium_high' ? 75 : 50, fullMark: 100 },
    { subject: 'VALENCE', A: data.valence === 'high' ? 100 : data.valence === 'positive' ? 75 : 50, fullMark: 100 },
    { subject: 'TEMPO', A: (data.bpm_range[0] + data.bpm_range[1]) / 2 > 120 ? 90 : 60, fullMark: 100 },
    { subject: 'POP', A: 80, fullMark: 100 }, 
    { subject: 'TEXTURE', A: 60, fullMark: 100 },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 ring-1 ring-slate-100">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6 mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="p-1 bg-teal-100 text-teal-600 rounded"><Activity className="w-3 h-3" /></div> Sonic Architecture
        </h3>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="text-[10px] font-mono text-slate-400">AI GENERATED v2.4</div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Radar Viz */}
        <div className="lg:col-span-4 relative">
             <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-6 shadow-inner h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Profile" dataKey="A" stroke="#0d9488" strokeWidth={3} fill="#14b8a6" fillOpacity={0.2} />
                    </RadarChart>
                </ResponsiveContainer>
             </div>
             
             {/* Key Stats */}
             <div className="flex justify-between mt-6 gap-4">
                 <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                    <div className="text-[9px] text-slate-400 uppercase font-bold mb-1">Target BPM</div>
                    <div className="text-xl font-medium text-slate-900 tracking-tight">{data.bpm_range[0]}-{data.bpm_range[1]}</div>
                 </div>
                 <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                    <div className="text-[9px] text-amber-500 uppercase font-bold mb-1">Key Sig</div>
                    <div className="text-xl font-medium text-amber-700 tracking-tight">{data.keys[0]}</div>
                 </div>
             </div>
        </div>

        {/* Middle: Texture & Genre */}
        <div className="lg:col-span-5 space-y-8 pt-2">
             <div>
                <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest bg-teal-50 border border-teal-100 px-2 py-1 rounded">Sonic Palette</span>
                <div className="flex flex-wrap gap-x-4 gap-y-3 mt-4">
                    {data.genres.map((g, i) => (
                        <span key={i} className="text-3xl font-light text-slate-800 tracking-tight hover:text-teal-600 transition-colors cursor-default">{g}</span>
                    ))}
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-8">
                 <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2 mb-3 font-bold">Instrumentation</span>
                    <ul className="space-y-2">
                        {data.instrumentation.map((inst, i) => (
                            <li key={i} className="text-xs text-slate-600 font-medium flex items-center gap-2">
                                <div className="w-1 h-1 bg-rose-400 rounded-full"></div> {inst}
                            </li>
                        ))}
                    </ul>
                 </div>
                 <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2 mb-3 font-bold">Emotional Arc</span>
                    <div className="flex flex-wrap gap-2">
                         {data.overall_mood.map((m, i) => (
                             <span key={i} className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md font-medium">{m}</span>
                         ))}
                    </div>
                 </div>
             </div>
        </div>

        {/* Right: Guardrails */}
        <div className="lg:col-span-3 border-l border-slate-100 pl-8 flex flex-col justify-center space-y-8">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                 <div className="flex items-center gap-2 text-rose-600 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Avoid</span>
                 </div>
                 <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {data.must_avoid.feel.join(', ')}
                 </p>
            </div>
            <div>
                 <div className="flex items-center gap-2 text-slate-800 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Perfect For</span>
                 </div>
                 <ul className="space-y-2">
                    {data.sync_contexts.slice(0,3).map((c,i) => (
                        <li key={i} className="text-[10px] text-slate-600 uppercase font-bold bg-slate-50 px-2 py-1.5 rounded border border-slate-100">{c}</li>
                    ))}
                 </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- TRACK RESULTS ---
export const TrackResults = ({ tracks }: { tracks: FullAnalysisResult['track_recommendations'], videoFile: File | null }) => {
    // Only using 'commercial' tracks based on new requirements
    // SLICE TO 12 TRACKS
    const allTracks = tracks.commercial.slice(0, 12);

    return (
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 flex flex-col h-[calc(100vh-140px)] overflow-hidden">
             {/* Header */}
             <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-white">
                <div className="flex items-end gap-6">
                    <div className="w-48 h-48 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <Disc className="w-20 h-20 text-white opacity-80" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Public Playlist</div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Your Spoti-vibe playlist for references</h1>
                        <p className="text-slate-500 font-medium max-w-2xl text-sm leading-relaxed mb-6">
                            A curated selection of reference tracks matching your sonic brief. Use these to align stakeholders on mood, tempo, and instrumentation before beginning the licensing or composition process.
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center"><span className="text-[8px]">S</span></div> Spotify</span>
                            <span>•</span>
                            <span>{allTracks.length} Songs</span>
                        </div>
                    </div>
                </div>
             </div>

             {/* List Header */}
             <div className="grid grid-cols-[50px_4fr_3fr_2fr_1fr_60px] gap-4 px-8 py-3 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky top-0 z-10">
                 <div className="text-center">#</div>
                 <div>Title</div>
                 <div>Artist</div>
                 <div>Tags</div>
                 <div className="text-right">Time</div>
                 <div className="text-center">Link</div>
             </div>

            {/* List Body */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {allTracks.map((track, i) => (
                    <div 
                        key={track.id}
                        className="group grid grid-cols-[50px_4fr_3fr_2fr_1fr_60px] gap-4 px-8 py-3 items-center hover:bg-slate-50 transition-colors border-b border-slate-50"
                    >
                        <div className="text-center text-sm font-mono text-slate-400 group-hover:text-teal-600">
                             <span className="group-hover:hidden">{i + 1}</span>
                             <Play className="w-3 h-3 hidden group-hover:inline-block mx-auto fill-teal-600" />
                        </div>
                        
                        <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{track.title}</div>
                        </div>

                        <div className="text-sm font-medium text-slate-500 truncate">{track.artist}</div>

                        <div className="flex gap-2 truncate">
                            {track.mood_tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-medium uppercase truncate">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="text-right text-xs font-mono text-slate-400">{track.duration || "3:45"}</div>
                        
                        <div className="flex justify-center">
                            {track.external_url ? (
                                <a 
                                    href={track.external_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-300 hover:text-[#1DB954] transition-colors"
                                    title="Open in Spotify"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            ) : (
                                <button disabled className="p-2 text-slate-200">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- LICENSING VIEW ---
export const LicensingView = ({ plan }: { plan: LicensingPlan }) => {
    const handleContactClick = (subject: string) => {
        const body = `Hi Emeralds Music Team,\n\nI'm interested in the ${subject} licensing route for my project (Budget: €${plan.budget_eur}).\n\nPlease can you provide more details?`;
        window.location.href = `mailto:info@emeraldsmusic.com?subject=Licensing Enquiry: ${subject}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="space-y-10 pb-24 max-w-6xl mx-auto">
             {/* Premium Recommendation Card */}
             <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl shadow-2xl p-10 relative overflow-hidden ring-1 ring-white/20">
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-r from-amber-400 to-yellow-600 p-1.5 rounded shadow-lg shadow-amber-500/20">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-amber-400 font-bold text-sm uppercase tracking-[0.2em]">Based on your budget</h4>
                        </div>
                        <div className="text-5xl font-bold mb-4 tracking-tight">{plan.recommended_route}</div>
                        <p className="text-lg text-slate-300 leading-relaxed max-w-xl font-light">{plan.notes[0]}</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl min-w-[200px]">
                         <div className="text-xs text-slate-400 uppercase font-bold mb-2">Project Budget</div>
                         <div className="text-3xl font-mono text-white">€{plan.budget_eur.toLocaleString()}</div>
                         <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                         </div>
                    </div>
                </div>
                {/* Gold sheen effect */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {plan.routes.map((route) => {
                    const isRecommended = route.route === plan.recommended_route;
                    return (
                        <div key={route.route} className={`p-6 rounded-2xl border transition-all group hover:-translate-y-1 duration-300 relative overflow-hidden flex flex-col ${
                            isRecommended 
                            ? 'bg-white border-amber-400 ring-4 ring-amber-400/10 shadow-xl' 
                            : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-lg'
                        }`}>
                             {isRecommended && (
                                <div className="absolute top-0 inset-x-0 h-1 bg-amber-400"></div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h5 className={`font-bold uppercase tracking-wider text-xs mb-1 ${isRecommended ? 'text-amber-600' : 'text-slate-500'}`}>{route.route}</h5>
                                    <div className="text-2xl font-bold text-slate-900 tracking-tight">
                                        €{route.est_cost_range[0].toLocaleString()} 
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                       Up to €{(route.est_cost_range[1] / 1000).toFixed(0)}k
                                    </div>
                                </div>
                                {isRecommended ? (
                                    <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
                                        <Zap className="w-4 h-4 fill-amber-700" />
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 text-slate-400 p-2 rounded-full group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100 flex items-center justify-between">
                                <div className="text-[10px] text-slate-500 font-bold uppercase">Clearance</div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-teal-500" /> {route.time_to_clear_days} Days
                                </div>
                            </div>

                             <div className="mb-6 flex-1">
                                <div className="text-[9px] text-slate-400 uppercase font-bold mb-2">Use Cases</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {route.use_cases.map(uc => (
                                        <span key={uc} className={`text-[10px] font-medium px-2 py-1 rounded border ${isRecommended ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-white text-slate-600 border-slate-200'}`}>
                                            {uc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
                                {route.pros.map((p, i) => (
                                    <div key={i} className="flex gap-2 text-xs text-slate-600 leading-snug">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" /> 
                                        <span>{p}</span>
                                    </div>
                                ))}
                                {route.cons.map((c, i) => (
                                    <div key={i} className="flex gap-2 text-xs text-slate-500 leading-snug font-medium">
                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" /> 
                                        <span>{c}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleContactClick(route.route)}
                                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-md ${
                                    isRecommended 
                                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20' 
                                    : 'bg-slate-900 text-white hover:bg-teal-600 hover:shadow-teal-500/20'
                                }`}
                            >
                                Contact Emeralds <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}