import { Track } from '../types';

const generateTracks = (): Track[] => {
  const baseTracks: Partial<Track>[] = [
    // INDIE / ALTERNATIVE / ELECTRONIC
    { title: "Midnight City", artist: "M83", mood_tags: ["anthemic", "nocturnal", "cool"], instrumentation_tags: ["synth", "saxophone", "drum machine"], bpm: 105, energy: 0.8, valence: 0.6 },
    { title: "Intro", artist: "The xx", mood_tags: ["atmospheric", "minimal", "cinematic"], instrumentation_tags: ["guitar", "beat", "bass"], bpm: 100, energy: 0.6, valence: 0.4 },
    { title: "Walking On A Dream", artist: "Empire of the Sun", mood_tags: ["uplifting", "summery", "adventure"], instrumentation_tags: ["synth", "falsetto"], bpm: 127, energy: 0.8, valence: 0.8 },
    { title: "Electric Feel", artist: "MGMT", mood_tags: ["groovy", "psychedelic", "indie"], instrumentation_tags: ["bass", "synth", "flute"], bpm: 103, energy: 0.7, valence: 0.8 },
    { title: "Tongue Tied", artist: "Grouplove", mood_tags: ["fun", "youthful", "party"], instrumentation_tags: ["guitar", "synth"], bpm: 113, energy: 0.9, valence: 0.9 },
    { title: "Pumped Up Kicks", artist: "Foster The People", mood_tags: ["catchy", "indie", "laid back"], instrumentation_tags: ["whistle", "bass"], bpm: 128, energy: 0.7, valence: 0.6 },
    { title: "Kids", artist: "MGMT", mood_tags: ["nostalgic", "electronic", "catchy"], instrumentation_tags: ["synth lead", "beat"], bpm: 123, energy: 0.8, valence: 0.7 },
    { title: "Feel It Still", artist: "Portugal. The Man", mood_tags: ["retro", "cool", "groovy"], instrumentation_tags: ["bass", "falsetto"], bpm: 158, energy: 0.8, valence: 0.7 },
    { title: "Safe And Sound", artist: "Capital Cities", mood_tags: ["positive", "dance", "trumpet"], instrumentation_tags: ["synth", "trumpet"], bpm: 118, energy: 0.8, valence: 0.9 },
    { title: "Dog Days Are Over", artist: "Florence + The Machine", mood_tags: ["epic", "building", "joyful"], instrumentation_tags: ["harp", "clapping", "drums"], bpm: 150, energy: 0.9, valence: 0.7 },

    // POP / CHART / MAINSTREAM
    { title: "Levitating", artist: "Dua Lipa", mood_tags: ["disco", "dance", "confident"], instrumentation_tags: ["bass", "synth", "claps"], bpm: 103, energy: 0.9, valence: 0.9 },
    { title: "Blinding Lights", artist: "The Weeknd", mood_tags: ["retro-futuristic", "driving", "night"], instrumentation_tags: ["synth", "drum machine"], bpm: 171, energy: 0.9, valence: 0.6 },
    { title: "As It Was", artist: "Harry Styles", mood_tags: ["bittersweet", "driving", "nostalgic"], instrumentation_tags: ["synth", "drums"], bpm: 174, energy: 0.8, valence: 0.6 },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", mood_tags: ["happy", "dance", "family"], instrumentation_tags: ["bass", "horn"], bpm: 113, energy: 0.9, valence: 0.95 },
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", mood_tags: ["funk", "party", "confident"], instrumentation_tags: ["brass", "bass"], bpm: 115, energy: 0.95, valence: 0.9 },
    { title: "Happy", artist: "Pharrell Williams", mood_tags: ["joyful", "optimistic", "soul"], instrumentation_tags: ["claps", "vocals"], bpm: 160, energy: 0.9, valence: 1.0 },
    { title: "Flowers", artist: "Miley Cyrus", mood_tags: ["empowering", "disco", "confident"], instrumentation_tags: ["bass", "strings"], bpm: 118, energy: 0.7, valence: 0.8 },
    { title: "Watermelon Sugar", artist: "Harry Styles", mood_tags: ["summery", "relaxed", "warm"], instrumentation_tags: ["guitar", "horns"], bpm: 95, energy: 0.6, valence: 0.8 },
    { title: "Shake It Off", artist: "Taylor Swift", mood_tags: ["fun", "upbeat", "carefree"], instrumentation_tags: ["horns", "drums"], bpm: 160, energy: 0.9, valence: 0.9 },
    { title: "Shut Up and Dance", artist: "WALK THE MOON", mood_tags: ["anthemic", "rock", "party"], instrumentation_tags: ["guitar", "synth"], bpm: 128, energy: 0.9, valence: 0.9 },

    // ROCK / ANTHEMIC / DRIVING
    { title: "Seven Nation Army", artist: "The White Stripes", mood_tags: ["iconic", "gritty", "determined"], instrumentation_tags: ["guitar riff", "stomp"], bpm: 124, energy: 0.7, valence: 0.5 },
    { title: "Mr. Brightside", artist: "The Killers", mood_tags: ["energetic", "urgent", "classic"], instrumentation_tags: ["guitar", "synth"], bpm: 148, energy: 0.95, valence: 0.4 },
    { title: "Believer", artist: "Imagine Dragons", mood_tags: ["powerful", "percussive", "intense"], instrumentation_tags: ["drums", "vocals"], bpm: 125, energy: 0.9, valence: 0.5 },
    { title: "Eye of the Tiger", artist: "Survivor", mood_tags: ["determined", "motivational", "classic"], instrumentation_tags: ["guitar", "piano"], bpm: 109, energy: 0.8, valence: 0.6 },
    { title: "We Will Rock You", artist: "Queen", mood_tags: ["stomp", "anthemic", "crowd"], instrumentation_tags: ["stomp", "clap", "vocals"], bpm: 81, energy: 0.7, valence: 0.6 },
    { title: "Born to Run", artist: "Bruce Springsteen", mood_tags: ["freedom", "driving", "classic"], instrumentation_tags: ["saxophone", "guitar"], bpm: 146, energy: 0.9, valence: 0.7 },
    { title: "Heroes", artist: "David Bowie", mood_tags: ["inspiring", "legendary", "emotional"], instrumentation_tags: ["guitar", "synth"], bpm: 112, energy: 0.7, valence: 0.6 },
    { title: "Start Me Up", artist: "The Rolling Stones", mood_tags: ["rock", "classic", "raw"], instrumentation_tags: ["guitar riff"], bpm: 122, energy: 0.8, valence: 0.7 },
    { title: "Do I Wanna Know?", artist: "Arctic Monkeys", mood_tags: ["cool", "sexy", "rock"], instrumentation_tags: ["fuzz guitar", "beat"], bpm: 85, energy: 0.6, valence: 0.5 },
    { title: "Are You Gonna Be My Girl", artist: "Jet", mood_tags: ["high energy", "retro", "fun"], instrumentation_tags: ["tambourine", "guitar"], bpm: 105, energy: 0.9, valence: 0.8 },

    // ELECTRONIC / DANCE / HOUSE
    { title: "Get Lucky", artist: "Daft Punk", mood_tags: ["disco", "smooth", "night"], instrumentation_tags: ["guitar", "vocoder"], bpm: 116, energy: 0.8, valence: 0.8 },
    { title: "One More Time", artist: "Daft Punk", mood_tags: ["celebration", "house", "euphoric"], instrumentation_tags: ["autotune", "beat"], bpm: 123, energy: 0.9, valence: 0.8 },
    { title: "Levels", artist: "Avicii", mood_tags: ["festival", "huge", "uplifting"], instrumentation_tags: ["synth lead", "piano"], bpm: 126, energy: 1.0, valence: 0.9 },
    { title: "Titanium", artist: "David Guetta ft. Sia", mood_tags: ["powerful", "club", "emotional"], instrumentation_tags: ["synth", "vocals"], bpm: 126, energy: 0.9, valence: 0.6 },
    { title: "Latch", artist: "Disclosure ft. Sam Smith", mood_tags: ["groovy", "garage", "soulful"], instrumentation_tags: ["synth", "beat"], bpm: 122, energy: 0.8, valence: 0.7 },
    
    // ACOUSTIC / FOLK / WARM
    { title: "Home", artist: "Edward Sharpe & The Magnetic Zeros", mood_tags: ["wholesome", "folk", "travel"], instrumentation_tags: ["whistle", "trumpet", "guitar"], bpm: 110, energy: 0.6, valence: 0.8 },
    { title: "Ho Hey", artist: "The Lumineers", mood_tags: ["simple", "romantic", "folk"], instrumentation_tags: ["shout", "guitar"], bpm: 80, energy: 0.5, valence: 0.7 },
    { title: "Riptide", artist: "Vance Joy", mood_tags: ["indie", "catchy", "summer"], instrumentation_tags: ["ukulele", "voice"], bpm: 100, energy: 0.7, valence: 0.7 },
    { title: "Budapest", artist: "George Ezra", mood_tags: ["warm", "storytelling", "bluesy"], instrumentation_tags: ["guitar", "voice"], bpm: 128, energy: 0.6, valence: 0.6 },
    { title: "Dreams", artist: "Fleetwood Mac", mood_tags: ["timeless", "smooth", "chill"], instrumentation_tags: ["bass", "drums"], bpm: 120, energy: 0.5, valence: 0.7 },
  ];

  return baseTracks.map((t, i) => ({
    id: `t${i + 1}`,
    title: t.title!,
    artist: t.artist!,
    source: 'spotify',
    bpm: t.bpm || 120,
    energy: t.energy || 0.5,
    valence: t.valence || 0.5,
    mood_tags: t.mood_tags || [],
    instrumentation_tags: t.instrumentation_tags || [],
    vocal: 'mixed',
    route: 'commercial', // All real tracks are commercial/known artist
    exclusive: false,
    duration: `${Math.floor(Math.random() * 2) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    key: ['C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'Fm', 'G', 'Gm', 'A', 'Am', 'B', 'Bm'][Math.floor(Math.random() * 14)],
    waveform: Array.from({length: 40}, () => Math.random()),
    // High accuracy search link
    external_url: `https://open.spotify.com/search/${encodeURIComponent(t.title + " " + t.artist)}`
  }));
};

export const MOCK_TRACK_POOL: Track[] = generateTracks();