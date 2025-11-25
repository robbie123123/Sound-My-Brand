export interface LicensingParams {
  usage: string;
  term: string;
  territory: string;
}

export interface BrandAnalysis {
  brand_name: string;
  industry: string;
  description: string;
  inferred_values: string[];
  archetype: string;
  tone_keywords: string[];
  comparison_brands: string[];
  usage: {
    placements: string[];
    term_months: number;
    geos: string[];
    // Explicit params
    usage_type: string;
    term_length: string;
    territory_scope: string;
  };
  budget_eur: number;
  notes: string;
}

export interface SonicBrief {
  overall_mood: string[];
  energy: "low" | "medium_low" | "medium" | "medium_high" | "high";
  valence: "negative" | "neutral" | "positive" | "high";
  bpm_range: [number, number];
  keys: string[];
  instrumentation: string[];
  genres: string[];
  vocal_style: string;
  lyric_themes: string[];
  sync_contexts: string[];
  must_avoid: {
    feel: string[];
    lyrics: string[];
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  source: "spotify" | "audio_network" | "extreme_music" | "epidemic_sound" | "artlist" | "musicbed" | "indie_db" | "mock_library" | "commercial";
  audio_url?: string; // Preview
  external_url?: string;
  bpm: number;
  energy: number;
  valence: number;
  mood_tags: string[];
  instrumentation_tags: string[];
  vocal: "male" | "female" | "mixed" | "instrumental";
  lyric_summary?: string;
  sync_fit_score?: number; // 0.0 to 1.0
  fit_reasons?: string[];
  route: "commercial" | "library" | "indie" | "bespoke" | "known_artist";
  exclusive: boolean;
  duration?: string;
  key?: string;
  waveform?: number[];
}

export interface LicensingRoute {
  route: string;
  est_cost_range: [number, number];
  risk: "low" | "medium" | "high";
  time_to_clear_days: number;
  use_cases: string[];
  pros: string[];
  cons: string[];
}

export interface LicensingPlan {
  budget_eur: number;
  routes: LicensingRoute[];
  recommended_route: string;
  notes: string[];
}

export interface FullAnalysisResult {
  brand_analysis: BrandAnalysis;
  sonic_brief: SonicBrief;
  track_recommendations: {
    commercial: Track[];
    library: Track[];
    indie: Track[];
  };
  licensing_plan: LicensingPlan;
  gen_ai_prompt?: string;
}