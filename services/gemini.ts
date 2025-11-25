import { GoogleGenAI } from "@google/genai";
import { BrandAnalysis, SonicBrief, Track, LicensingPlan, FullAnalysisResult, LicensingParams } from "../types";
import { MOCK_TRACK_POOL } from "./mockData";

// --- HELPER: JSON Parsing ---
function parseGeminiJSON<T>(text: string): T {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", text);
    throw new Error("AI response was not valid JSON.");
  }
}

// --- MAIN SERVICE CLASS ---
class SoundMyBrandService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is missing from environment variables");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  // 1. ANALYZE BRAND
  async analyzeBrand(inputData: Record<string, any>, budget: number, licensingParams: LicensingParams): Promise<BrandAnalysis> {
    const prompt = `
    You are an expert Brand Strategist.
    Analyze the following brand profile.
    
    Input Profile:
    - Brand Name: ${inputData.brandName}
    - Industry: ${inputData.industry}
    - Description (What they do): ${inputData.description}
    - Brand Values / Vibe: ${inputData.values}
    - Reference: ${inputData.referenceLink || 'None'}
    
    Licensing Parameters (Fixed):
    - Usage Scope: ${licensingParams.usage}
    - Term Length: ${licensingParams.term}
    - Territory: ${licensingParams.territory}
    - Budget Cap: €${budget}

    Infer:
    - Archetype (e.g. Explorer, Hero), Tone.
    - Comparison Brands (Real world competitors or stylistic matches).
    - Infer the placements (e.g. TV, Social, OLV) based on the Usage Scope provided.

    Return strictly valid JSON.
    Format:
    {
      "brand_name": "${inputData.brandName}",
      "industry": "${inputData.industry}",
      "description": "${inputData.description}",
      "inferred_values": ["string"],
      "archetype": "string",
      "tone_keywords": ["string"],
      "comparison_brands": ["string"],
      "usage": {
        "placements": ["string"],
        "term_months": number,
        "geos": ["string"],
        "usage_type": "${licensingParams.usage}",
        "term_length": "${licensingParams.term}",
        "territory_scope": "${licensingParams.territory}"
      },
      "budget_eur": number,
      "notes": "string"
    }
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return parseGeminiJSON<BrandAnalysis>(response.text!);
  }

  // 2. CREATE SONIC BRIEF
  async createSonicBrief(brandAnalysis: BrandAnalysis): Promise<SonicBrief> {
    const prompt = `
    You are an expert Music Supervisor.
    Create a highly detailed Sonic Brief based on this Brand Analysis:
    ${JSON.stringify(brandAnalysis)}

    Principles:
    - Modern, clean production.
    - Tech-forward, commercial aesthetic.
    - Avoid retro unless specified in values.
    - Lyrics must be sync-friendly.

    Return strictly valid JSON.
    Format:
    {
      "overall_mood": ["string"],
      "energy": "low" | "medium_low" | "medium" | "medium_high" | "high",
      "valence": "negative" | "neutral" | "positive" | "high",
      "bpm_range": [number, number],
      "keys": ["string"],
      "instrumentation": ["string"],
      "genres": ["string"],
      "vocal_style": "string",
      "lyric_themes": ["string"],
      "sync_contexts": ["string"],
      "must_avoid": {
        "feel": ["string"],
        "lyrics": ["string"]
      }
    }
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return parseGeminiJSON<SonicBrief>(response.text!);
  }

  // 3. SCORE TRACKS
  async rankTracks(brief: SonicBrief, analysis: BrandAnalysis): Promise<{
    recommendations: { commercial: Track[], library: Track[], indie: Track[] }
  }> {
    const candidateTracks = MOCK_TRACK_POOL;

    const prompt = `
    You are a Music Supervisor.
    
    Context:
    Sonic Brief: ${JSON.stringify(brief)}
    Brand Analysis: ${JSON.stringify(analysis)}
    
    Task: Analyze these candidate tracks and select fits for a "Spotify Reference Playlist". Score them (0.0-1.0).
    Candidate Tracks: ${JSON.stringify(candidateTracks.map(t => ({id: t.id, title: t.title, artist: t.artist, tags: t.mood_tags})))}
    
    Return strictly valid JSON:
    {
      "track_recommendations": {
        "commercial": [TrackObjects with sync_fit_score and fit_reasons]
      }
    }
    
    Filter logic: 
    - Return top 15 matches.
    - Be generous with scoring if the mood fits generally.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const result = parseGeminiJSON<{
      track_recommendations: { commercial: any[] }
    }>(response.text!);

    // Hydrate the lightweight response results with full track data
    const hydrate = (list: any[]) => list.map(item => {
      const full = candidateTracks.find(t => t.id === item.id);
      return { ...full, ...item };
    }).filter(t => t.id); // ensure found

    return {
      recommendations: {
        commercial: hydrate(result.track_recommendations.commercial || []),
        library: [], // No longer used
        indie: []    // No longer used
      }
    };
  }

  // 4. GENERATE AI PROMPT
  async generateAiPrompt(brief: SonicBrief): Promise<string> {
      const prompt = `
      Create a highly optimized prompt for a generative music AI (like Suno or Udio) based on this sonic brief.
      Brief: ${JSON.stringify(brief)}
      
      The prompt should be concise, listing genres, key instruments, mood, and bpm.
      Output just the prompt string.
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text || "Cinematic ambient corporate build up, 120bpm";
  }

  // 5. CREATE LICENSING PLAN
  async createLicensingPlan(analysis: BrandAnalysis, brief: SonicBrief): Promise<LicensingPlan> {
    const prompt = `
    You are a Music Licensing Expert.
    Create a strategic Licensing Plan based on the user's strict requirements.

    USER REQUIREMENTS:
    - Usage Scope: ${analysis.usage.usage_type}
    - Term: ${analysis.usage.term_length}
    - Territory: ${analysis.usage.territory_scope}
    - User Budget Limit: €${analysis.budget_eur}

    CALCULATION LOGIC (Using PRS/MCPS 2025 Rate Card Estimates):
    1. Calculate the "Market Value" for the requested Usage/Term/Territory.
    2. Compare Market Value to User Budget.
    
    CRITICAL PRICING RULES:
    1. "Indie" Route and "Bespoke" Route MUST have the SAME pricing range. Do not make Bespoke more expensive.
    2. "Known Artist" is the most expensive.
    3. "Library" is the least expensive.

    FORMATTING RULES:
    1. The "recommended_route" MUST be the one that fits the budget best.
    2. The first item in "notes" MUST strictly follow this format:
       "Based on your selection of ${analysis.usage.usage_type} for ${analysis.usage.term_length} in ${analysis.usage.territory_scope}, we suggest that you follow the [INSERT ROUTE HERE] route. Prices average around €[INSERT AVERAGE]..."

    Return strictly valid JSON:
    {
      "budget_eur": ${analysis.budget_eur},
      "routes": [
        {
          "route": "Library" | "Indie" | "Bespoke" | "KnownArtist",
          "est_cost_range": [min, max],
          "risk": "low" | "medium" | "high",
          "time_to_clear_days": number,
          "use_cases": ["string"],
          "pros": ["string"],
          "cons": ["string"]
        }
      ],
      "recommended_route": "string",
      "notes": ["string"]
    }
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return parseGeminiJSON<LicensingPlan>(response.text!);
  }

  // ORCHESTRATOR
  async generateFullStrategy(inputData: Record<string, any>, budget: number, licensingParams: LicensingParams): Promise<FullAnalysisResult> {
    // Pipeline - Sequential Steps
    // 1. We must have Brand Analysis first
    const brandAnalysis = await this.analyzeBrand(inputData, budget, licensingParams);
    
    // 2. We must have Sonic Brief second (depends on Brand Analysis)
    const sonicBrief = await this.createSonicBrief(brandAnalysis);

    // 3. Parallel Execution: Tracks, Licensing, and AI Prompt can all run simultaneously 
    const [rankResults, licensingPlan, aiPrompt] = await Promise.all([
      this.rankTracks(sonicBrief, brandAnalysis),
      this.createLicensingPlan(brandAnalysis, sonicBrief),
      this.generateAiPrompt(sonicBrief)
    ]);

    return {
      brand_analysis: brandAnalysis,
      sonic_brief: sonicBrief,
      track_recommendations: {
        commercial: rankResults.recommendations.commercial,
        library: rankResults.recommendations.library,
        indie: rankResults.recommendations.indie
      },
      licensing_plan: licensingPlan,
      gen_ai_prompt: aiPrompt
    };
  }
}

export const geminiService = new SoundMyBrandService();