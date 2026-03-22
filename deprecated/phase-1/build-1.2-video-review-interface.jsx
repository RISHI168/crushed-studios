import { useState, useEffect, useCallback, useRef } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   CRUSHED STUDIOS — PRODUCTION CONSOLE v6.0
   Screenplay + Storyboard + Continuity Engine + Prompt Assembly + Agent Feed
   ══════════════════════════════════════════════════════════════════════════
   EXTRACTION REGION INDEX (see crushed-studios-file-map.md for full spec)
   ─────────────────────────────────────────────────────────────────────────
   REGION 1: Design System        → /src/tokens.js
   REGION 2: Domain Constants     → /src/constants/*.js
   REGION 3: Seed Data            → /src/data/seed.js
   REGION 4: Shared Components    → /src/components/shared/*.jsx
   REGION 5: Validation Logic     → /src/utils/validation.js
   REGION 6: Main Component State → /src/hooks/useProjectState.js
   REGION 7: Scene CRUD           → /src/hooks/useSceneActions.js
   REGION 8: Storyboard Logic     → /src/hooks/useStoryboard.js
   REGION 9: Generation Logic     → /src/hooks/useGeneration.js
   REGION 10: Intelligence Utils  → /src/utils/intelligence.js
   REGION 11: Responsive CSS      → /src/styles/responsive.css
   REGION 12: Layout Shell        → /src/components/layout/AppShell.jsx
   REGION 13: View: Screenplay    → /src/views/ScreenplayView.jsx
   REGION 14: View: Console       → /src/views/ConsoleView.jsx
   REGION 15: View: Characters    → /src/views/CharactersView.jsx
   REGION 16: View: Continuity    → /src/views/ContinuityView.jsx
   REGION 17: Storyboard Overlay  → /src/components/console/StoryboardOverlay.jsx
   REGION 18: Footer              → /src/components/layout/Footer.jsx
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── REGION 1: DESIGN SYSTEM ─── → /src/tokens.js */
const T = {
  DARK: "#07070C", CARD: "#0C0C14", BORDER: "#191930", INPUT: "#101018",
  IBORDER: "#202038", TXT: "#E0E0E8", DIM: "#555", GOLD: "#F59E0B",
  GD: "#D97706", CYAN: "#22D3EE", RED: "#EF4444", GREEN: "#22C55E",
  PURPLE: "#A78BFA", PINK: "#F472B6", ORANGE: "#FB923C", BLUE: "#3B82F6",
  LIME: "#84CC16", TEAL: "#2DD4BF",
};
const M = "'Space Mono',monospace";
const D = "'Bodoni Moda','Instrument Serif',serif";
const B = "'Outfit','DM Sans',sans-serif";
const ACCENT = "linear-gradient(135deg,#F59E0B,#D97706)";
// Layout now handled by CSS custom properties in .cs-main (see responsive system in render)

/* ─── REGION 2a: SCENE CONSTANTS ─── → /src/constants/scene.js */
const SCENE_STATUS = {
  DRAFT: { key: "draft", label: "DRAFT", color: "#666", icon: "✎", desc: "Writing in progress" },
  REVIEWED: { key: "reviewed", label: "REVIEWED", color: T.BLUE, icon: "◎", desc: "Script reviewed, awaiting lock" },
  LOCKED: { key: "locked", label: "LOCKED", color: T.GREEN, icon: "🔒", desc: "Script locked — ready for production" },
  GENERATED: { key: "generated", label: "GENERATED", color: T.GOLD, icon: "★", desc: "Video generated from this script" },
};
const STATUS_FLOW = ["draft", "reviewed", "locked", "generated"];

/* ─── (scene constants continued) */
const BEAT_TYPES = ["Setup", "Inciting Incident", "Rising Action", "Midpoint", "Complication", "Crisis", "Climax", "Resolution", "Denouement"];
const TRANSITION_TYPES = ["CUT TO:", "SMASH CUT TO:", "DISSOLVE TO:", "FADE TO:", "MATCH CUT TO:", "JUMP CUT TO:", "FADE TO BLACK.", "CONTINUOUS"];
const SCENE_HEADINGS = ["INT.", "EXT.", "INT./EXT.", "EXT./INT."];

/* ─── REGION 2b: CHARACTER CONSTANTS ─── → /src/constants/character.js */
const PHYSICAL_ATTRS = ["Hair","Skin Tone","Build","Height","Scars/Marks","Facial Hair","Age Range","Distinguishing Feature"];
const MANNERISMS = [
  "Avoids eye contact","Fidgets with hands","Speaks softly","Loud & assertive",
  "Slow deliberate movements","Quick nervous gestures","Crosses arms often",
  "Leans in when speaking","Maintains intense eye contact","Touches face frequently",
  "Stiff posture","Relaxed slouch","Paces when thinking","Still & composed",
  "Smiles rarely","Laughs easily","Bites lip","Taps fingers",
  "Looks away when lying","Stands with hands in pockets",
];
const WARDROBE_ITEMS = [
  "Trench coat","Leather jacket","Sari","Business suit","Worn jeans","Military uniform",
  "Lab coat","Hoodie","Evening gown","Traditional kurta","Bomber jacket","Flannel shirt",
  "Turtleneck","Overalls","Vintage dress","Tank top","Formal vest","Rain poncho",
];
const EMOTIONS_LIST = [
  "Joy","Sadness","Anger","Fear","Surprise","Disgust","Love","Longing",
  "Desperation","Resignation","Determination","Confusion","Awe","Guilt",
  "Jealousy","Pride","Anxiety","Hope","Contempt","Vulnerability","Defiance","Grief",
];
const emotionIntensity = {
  Joy:9,Sadness:3,Anger:8,Fear:4,Surprise:7,Disgust:2,Love:8,Longing:5,
  Desperation:3,Resignation:2,Determination:7,Confusion:4,Awe:8,Guilt:3,
  Jealousy:5,Pride:7,Anxiety:4,Hope:7,Contempt:5,Vulnerability:3,Defiance:8,Grief:2,
};
const CHAR_COLORS = [T.CYAN, T.PINK, T.PURPLE, T.ORANGE, T.GREEN, "#FCD34D", T.BLUE, "#F97316"];

/* ─── REGION 2c: PRODUCTION CONSTANTS ─── → /src/constants/production.js */
const SHOT_TYPES = ["Close-up","Extreme Close-up","Medium Shot","Medium Close-up","Wide Shot","Extreme Wide","Three Quarter Body","Full Body","Over the Shoulder","Dutch Angle","Bird's Eye","Worm's Eye","Point of View","Two Shot","Tracking Shot","Dolly Zoom"];
const CAMERA_MOVEMENTS = [
  {name:"Drone — Low Altitude Fly-over",cat:"Aerial"},{name:"Drone — Top-Down Reveal",cat:"Aerial"},
  {name:"Steadicam — Walk & Talk",cat:"Stabilized"},{name:"Dolly — Push In",cat:"Track"},
  {name:"Dolly — Pull Out",cat:"Track"},{name:"Crane — Jib Up Reveal",cat:"Crane/Rig"},
  {name:"Handheld — Vérité / Raw",cat:"Handheld"},{name:"Static / Locked Tripod",cat:"Static"},
  {name:"Gimbal — Run & Gun",cat:"Stabilized"},{name:"Cable Cam / Spidercam",cat:"Rigged"},
];
const LIGHTING_SOURCES = ["Teal and Orange","Natural Sunlight","Golden Hour","Blue Hour","Neon Noir","Chiaroscuro","High Key","Low Key","Rembrandt","Split Lighting","Silhouette","Practical Lights","Candlelight","Moonlight","Fluorescent","Volumetric / Haze"];
const ATMOSPHERES = ["Moody","Cinematic","Lonely","Melancholic","Euphoric","Tense","Dreamlike","Gritty","Nostalgic","Surreal","Romantic","Dystopian","Serene","Chaotic","Intimate","Epic","Claustrophobic","Ethereal","Raw","Mythic"];
const CAMERA_BODIES = [
  {name:"ARRI Alexa 35",tier:"Cinema Flagship",sensor:"S35 ALEV 4",res:"4.6K"},
  {name:"RED V-RAPTOR XL 8K",tier:"Cinema Flagship",sensor:"VV",res:"8K"},
  {name:"Sony Venice 2",tier:"Cinema Flagship",sensor:"FF Dual ISO",res:"8.6K"},
  {name:"Canon EOS C500 Mk II",tier:"Professional",sensor:"Full Frame",res:"5.9K"},
  {name:"Blackmagic URSA Cine 12K",tier:"Cinema Flagship",sensor:"Full Frame",res:"12K"},
  {name:"IMAX MSM 9802",tier:"Large Format Film",sensor:"65mm/15-perf",res:"18K equiv"},
  {name:"Phantom Flex4K",tier:"High Speed",sensor:"Super 35",res:"4K"},
];
const FOCAL_LENGTHS = ["12mm Ultra Wide","18mm Wide","24mm Wide","35mm Standard","50mm Normal","85mm Portrait","135mm Telephoto","Zoom 24-70mm","Anamorphic 50mm"];
const LENS_TYPES = ["Spherical Prime","Anamorphic Cinema","Zoom Lens","Vintage Rehoused","Cooke S7/i","Zeiss Supreme Prime","ARRI Signature Prime","Panavision Primo"];
const FILM_STOCKS = ["Kodak Vision3 500T","Kodak Vision3 250D","CineStill 800T","Digital Clean","16mm Grainy","Super 8 Vintage","70mm Film","IMAX Large Format"];
const ASPECT_RATIOS = ["2.39:1 Anamorphic","2.00:1 Univisium","1.85:1 Widescreen","1.78:1 (16:9)","1.43:1 IMAX","1.33:1 (4:3)","9:16 Vertical"];
const GENRES = ["Noir","Drama","Thriller","Sci-Fi","Romance","Horror","Comedy","Action","Documentary","Fantasy","Western","Musical"];
const ERAS = ["Contemporary","1990s","1980s","1970s","1960s","1940s Noir","Victorian","Medieval","Futuristic","Timeless"];
const COLOR_GRADES = ["Bleach Bypass","Teal & Orange","Desaturated","Warm Vintage","Cold Steel","Neon Saturated","Pastel Dream","High Contrast B&W","Sepia","Natural"];

/* ─── REGION 2d: STORYBOARD CONSTANTS ─── → /src/constants/storyboard.js */
const PANEL_COMPOSITIONS = [
  "Wide establishing — full environment visible",
  "Two-shot — characters facing, tension framing",
  "Close-up reaction — emotional beat",
  "Over-shoulder — conversational depth",
  "Dutch angle — psychological unease",
  "Low angle — power/dominance",
  "High angle — vulnerability/isolation",
  "Extreme close-up — detail emphasis",
  "Silhouette — atmospheric mood",
  "Tracking movement — character in motion",
];
const PANEL_CONTENT_TYPES = ["action_beat", "dialogue_delivery", "camera_setup", "transition", "establishing"];
const PANEL_BORDER_STATES = { approved: "#22c55e", pending: "#06b6d4", rejected: "#ef4444", regenerating: "#f59e0b" };
const getPanelStatus = (p) => p.regenerating ? "regenerating" : p.approved ? "approved" : "pending";
const SB_COLORS = { pending: "#555", approved: T.GREEN, rejected: T.RED, regenerating: T.ORANGE };

/* ─── REGION 2e: AGENT CONSTANTS ─── → /src/constants/agents.js */
const PROMPT_LAYERS = [
  { id: "screenplay", label: "Screenplay Text", color: "#1D9E75", icon: "📜", desc: "Action text, dialogue blocks, transition, beat classification, duration" },
  { id: "characters", label: "Character Identity Constraints", color: "#7F77DD", icon: "👤", desc: "Physical attributes, LoRA refs, emotion, wardrobe, blocking, mannerisms per character" },
  { id: "camera", label: "Camera Configuration", color: "#378ADD", icon: "🎥", desc: "Shot type, movement, lighting, atmosphere + derived lens/body from Production Bible" },
  { id: "continuity", label: "Continuity State", color: "#BA7517", icon: "🔗", desc: "Scene position, carry-forward constraints, cross-scene validation rules" },
  { id: "bible", label: "Production Bible Baseline", color: "#D85A30", icon: "📖", desc: "Genre, era, color grade, aspect ratio, film stock, camera body, lens type" },
  { id: "validation", label: "Validation Criteria", color: "#E24B4A", icon: "✓", desc: "Post-generation checks: LoRA similarity, wardrobe match, blocking accuracy, duration" },
];

/* ─── (agent constants continued) */
const AGENT_ROSTER = [
  { id: "scriptwriter", name: "Scriptwriter Agent", color: "#1D9E75", role: "Parse screenplay structure, extract dialogue blocks and action beats" },
  { id: "continuity", name: "Continuity Agent", color: "#BA7517", role: "Load cross-scene constraints, validate character state carry-forward" },
  { id: "cinematography", name: "Cinematography Agent", color: "#378ADD", role: "Resolve camera configuration against Production Bible baseline" },
  { id: "storyboard", name: "Storyboard Agent", color: T.CYAN, role: "Reference approved panels as visual keyframe guidance" },
  { id: "prompt", name: "Prompt Assembly", color: "#7F77DD", role: "Merge all constraint layers into generation prompt" },
  { id: "generation", name: "Generation Engine", color: T.GOLD, role: "Execute video generation via model pipeline" },
  { id: "validation", name: "Validation Agent", color: "#E24B4A", role: "Post-generation continuity and quality checks" },
];

/* ─── REGION 3: SEED DATA ─── → /src/data/seed.js */
const initBible = () => ({
  genre: "Noir", era: "Contemporary", colorGrade: "Bleach Bypass",
  cameraBody: "ARRI Alexa 35", lensType: "Spherical Prime", filmStock: "Kodak Vision3 500T",
  aspectRatio: "2.39:1 Anamorphic", focalLength: "35mm Standard",
});

const initScreenplay = () => ({
  title: "Shadows of Dharavi",
  logline: "A forensic accountant uncovers a money-laundering network that leads back to the one person she trusted most.",
  synopsis: "When Meera, a quiet forensic accountant, discovers irregularities in a client's books, she brings the evidence to Detective Arjun — her late father's former partner. But as the investigation deepens into Mumbai's underworld, Meera realizes the trail leads not to strangers, but to Arjun himself. Cornered between loyalty and truth, she must decide what she's willing to sacrifice to do what's right.",
  acts: [
    { id: "act1", name: "Act I — Setup", scenes: ["s1"] },
    { id: "act2", name: "Act II — Confrontation", scenes: ["s2"] },
    { id: "act3", name: "Act III — Resolution", scenes: ["s3"] },
  ],
  version: 1,
  lastEdited: new Date().toISOString(),
});

const initChars = () => [
  {
    id:"c1", name:"Meera", color:T.CYAN,
    physical:{Hair:"Black, shoulder-length, wavy","Skin Tone":"Warm brown",Build:"Lean, athletic",Height:"5'6\"","Scars/Marks":"Small scar above left eyebrow","Facial Hair":"—","Age Range":"Late 20s","Distinguishing Feature":"Always wears silver ring on right hand"},
    mannerisms:["Avoids eye contact","Speaks softly","Touches face frequently","Looks away when lying"],
    defaultEmotion:"Vulnerability", loraRef:true, defaultWardrobe:"Charcoal trench coat, dark jeans, white sneakers",
  },
  {
    id:"c2", name:"Detective Arjun", color:T.PINK,
    physical:{Hair:"Grey-streaked, slicked back","Skin Tone":"Medium brown",Build:"Stocky, solid",Height:"5'10\"","Scars/Marks":"Cigarette burn on left wrist","Facial Hair":"Heavy stubble","Age Range":"Mid 40s","Distinguishing Feature":"Walks with slight limp, right leg"},
    mannerisms:["Maintains intense eye contact","Slow deliberate movements","Crosses arms often","Speaks softly"],
    defaultEmotion:"Determination", loraRef:true, defaultWardrobe:"Brown leather jacket, wrinkled shirt, dark trousers",
  },
  {
    id:"c3", name:"The Stranger", color:T.PURPLE,
    physical:{Hair:"Shaved head","Skin Tone":"Pale",Build:"Tall, gaunt",Height:"6'2\"","Scars/Marks":"Tattoo behind right ear","Facial Hair":"Clean shaven","Age Range":"Indeterminate (30s–50s)","Distinguishing Feature":"Never blinks on camera"},
    mannerisms:["Still & composed","Maintains intense eye contact","Smiles rarely","Stiff posture"],
    defaultEmotion:"Contempt", loraRef:false, defaultWardrobe:"Black high-collar coat, dark boots",
  },
];

const initScenes = () => [
  {
    id:"s1", number:1, title:"The Arrival", location:"Mumbai railway station, night", time:"00:00–00:28",
    camera:{ shotType:"Wide Shot", movement:"Steadicam — Walk & Talk", lighting:"Neon Noir", atmosphere:"Tense" },
    chars:{
      c1:{ emotion:"Anxiety", wardrobeOverride:null, mannerismOverride:null, dialogue:"Is this really the place?", deliveryEmo:"Anxiety", blocking:"Enters frame left, clutching bag, scanning the crowd", continuityNotes:"" },
      c2:{ emotion:"Determination", wardrobeOverride:null, mannerismOverride:null, dialogue:"Stay close. Don't look at anyone.", deliveryEmo:"Determination", blocking:"Walking 2 steps ahead, hand near hip", continuityNotes:"" },
    },
    validated:true, issues:[],
    // ─── SCREENPLAY DATA ───
    status: "generated",
    // ─── STORYBOARD DATA ───
    storyboard: { panels: [], version: 0, generating: false },
    // ─── GENERATION TAKES ───
    takes: [{
      id: "take_demo_1",
      timestamp: Date.now() - 3600000,
      duration: 28,
      resolution: "1080p",
      tokens: 2247,
      constraints: 47,
      agentLog: [
        { agentId: "scriptwriter", detail: "Parsed 2 dialogue blocks, 1 action beat, transition: SMASH CUT TO:" },
        { agentId: "continuity", detail: "Loaded 47 constraints · 2 characters resolved · 0 flags" },
        { agentId: "cinematography", detail: "Camera: Wide Shot + Steadicam · Lighting: Neon Noir · Matched to bible" },
        { agentId: "storyboard", detail: "5 panels approved as visual reference" },
        { agentId: "prompt", detail: "Assembled 2,247 token prompt · 6 constraint layers merged" },
        { agentId: "generation", detail: "Generating 28s at 1080p" },
        { agentId: "validation", detail: "8 post-generation checks passed · LoRA similarity: 0.91" },
      ],
      validation: {
        loraSimilarity: 0.91, wardrobeMatch: true, aspectRatio: true, colorGrade: true,
        characterCount: 2, blockingAccuracy: true, temporalContinuity: true, durationAccuracy: 27.6,
        passCount: 8, totalChecks: 8,
      },
      annotations: [
        { id: "ann1", time: 35, text: "Meera's bag strap should be on left shoulder, not right", resolved: false },
      ],
      approved: false,
    }],
    screenplay: {
      action: "Steam curls through amber platform lights. A sea of commuters moves in hypnotic rhythm. MEERA (late 20s, sharp eyes, nervous hands) pushes through the crowd clutching a leather messenger bag like armor. Two steps ahead, DETECTIVE ARJUN (mid 40s, heavy stubble, slight limp) cuts through the bodies with practiced ease.",
      dialogueBlocks: [
        { charId: "c1", line: "Is this really the place?", parenthetical: "scanning the crowd, voice barely audible" },
        { charId: "c2", line: "Stay close. Don't look at anyone.", parenthetical: "without turning back" },
      ],
      transition: "SMASH CUT TO:",
      beat: "Setup",
      notes: "Establish the uneasy alliance. Meera's discomfort vs Arjun's cold familiarity with this world. The station should feel like a living organism — chaotic but rhythmic.",
      duration: 28,
    },
  },
  {
    id:"s2", number:2, title:"The Confrontation", location:"Abandoned textile mill, interior", time:"00:28–01:05",
    camera:{ shotType:"Medium Shot", movement:"Handheld — Vérité / Raw", lighting:"Low Key", atmosphere:"Gritty" },
    chars:{
      c1:{ emotion:"Fear", wardrobeOverride:null, mannerismOverride:["Fidgets with hands"], dialogue:"You said no one would get hurt.", deliveryEmo:"Desperation", blocking:"Backed against wall, arms wrapped around self", continuityNotes:"Coat now has dust on left shoulder from wall" },
      c2:{ emotion:"Anger", wardrobeOverride:null, mannerismOverride:["Loud & assertive"], dialogue:"", deliveryEmo:null, blocking:"Pacing, gesturing aggressively", continuityNotes:"Jacket unbuttoned since entering mill" },
      c3:{ emotion:"Contempt", wardrobeOverride:null, mannerismOverride:null, dialogue:"Everyone says that.", deliveryEmo:"Contempt", blocking:"Seated in shadow, only face lit", continuityNotes:"" },
    },
    validated:true, issues:[],
    status: "reviewed",
    storyboard: { panels: [], version: 0, generating: false },
    takes: [],
    screenplay: {
      heading: "INT.",
      slugline: "ABANDONED TEXTILE MILL — CONTINUOUS",
      action: "Dust motes drift through shafts of broken light. Rusted looms stand like skeletons. MEERA presses her back against a crumbling wall, arms wrapped around herself. ARJUN paces the floor, boots crunching on debris. In the far corner, barely visible — THE STRANGER sits motionless on an overturned crate, only his face catching light.",
      dialogueBlocks: [
        { charId: "c1", line: "You said no one would get hurt.", parenthetical: "voice cracking" },
        { charId: "c2", line: "(silence — he stops pacing, turns away)", parenthetical: "" },
        { charId: "c3", line: "Everyone says that.", parenthetical: "almost amused" },
      ],
      transition: "CUT TO:",
      beat: "Complication",
      notes: "The power dynamic shifts here. The Stranger speaks for the first time — and owns the room with one line. Arjun's silence is louder than any dialogue. Meera realizes she's in over her head.",
      duration: 37,
    },
  },
  {
    id:"s3", number:3, title:"The Escape", location:"Rooftop, overlooking city", time:"01:05–01:32",
    camera:{ shotType:"Wide Shot", movement:"Drone — Low Altitude Fly-over", lighting:"Moonlight", atmosphere:"Epic" },
    chars:{
      c1:{ emotion:"Determination", wardrobeOverride:"Coat removed — white shirt underneath, sleeves rolled", mannerismOverride:["Quick nervous gestures","Maintains intense eye contact"], dialogue:"I'm not going back.", deliveryEmo:"Defiance", blocking:"Standing at roof edge, wind in hair", continuityNotes:"Scar above eyebrow more visible under rooftop light" },
      c2:{ emotion:"Grief", wardrobeOverride:null, mannerismOverride:["Still & composed"], dialogue:"Then this is where we part.", deliveryEmo:"Resignation", blocking:"5 meters behind, hands in pockets, not moving", continuityNotes:"Limp more pronounced — extended chase sequence prior" },
    },
    validated:false, issues:["Meera's emotion jumps from Fear→Determination without transition scene","Arjun's mannerism override (Still & composed) conflicts with his established pattern"],
    status: "draft",
    storyboard: { panels: [], version: 0, generating: false },
    takes: [],
    screenplay: {
      heading: "EXT.",
      slugline: "ROOFTOP, OVERLOOKING MUMBAI — NIGHT",
      action: "Wind whips across the rooftop. The city sprawls below — a galaxy of lights and shadows. MEERA stands at the edge, coat gone, white shirt billowing. Her hands tremble but her jaw is set. Behind her, ARJUN stands motionless, five meters back. His limp is worse now. Neither moves to close the distance.",
      dialogueBlocks: [
        { charId: "c1", line: "I'm not going back.", parenthetical: "turning to face him, eyes steady for the first time" },
        { charId: "c2", line: "Then this is where we part.", parenthetical: "quiet, almost to himself" },
      ],
      transition: "FADE TO BLACK.",
      beat: "Climax",
      notes: "This is the emotional peak. The physical distance between them IS the scene — 5 meters that might as well be 5 years. Meera's transformation is complete: the nervous accountant is gone. Arjun sees it, and it breaks him.",
      duration: 27,
    },
  },
];

/* ─── REGION 4a: SHARED COMPONENTS ─── → /src/components/shared/*.jsx */
const Tip = ({ text }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({x:0,y:0});
  return (
    <span style={{position:"relative",display:"inline-flex",marginLeft:5}}
      onMouseEnter={e=>{const r=e.currentTarget.getBoundingClientRect();setPos({x:Math.min(r.left,window.innerWidth-300),y:r.bottom});setShow(true);}}
      onMouseLeave={()=>setShow(false)}>
      <span style={{width:14,height:14,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",background:"#181825",border:"1px solid #2A2A3E",cursor:"help",fontFamily:M,fontSize:8.5,fontWeight:700,color:"#444"}}>?</span>
      {show&&<div style={{position:"fixed",left:pos.x,top:pos.y+6,width:270,padding:"10px 12px",zIndex:9999,background:"#181828",border:`1px solid ${T.GOLD}30`,borderRadius:7,boxShadow:"0 8px 32px #00000090"}}>
        <div style={{fontFamily:B,fontSize:11.5,color:"#bbb",lineHeight:1.55}}>{text}</div>
      </div>}
    </span>
  );
};

const SH = ({ n, icon, title, tip, right }) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:12,marginBottom:14,borderBottom:`1px solid ${T.GOLD}20`}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {n != null && <span style={{width:22,height:22,borderRadius:5,background:`${T.GOLD}10`,border:`1px solid ${T.GOLD}25`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:M,fontSize:9,color:T.GOLD,fontWeight:700}}>{n}</span>}
      <span style={{fontSize:15}}>{icon}</span>
      <span style={{fontFamily:D,fontWeight:400,fontSize:14,color:T.TXT,letterSpacing:"0.03em"}}>{title}</span>
      {tip && <Tip text={tip} />}
    </div>
    {right}
  </div>
);

const VBadge = ({ok,issues}) => (
  <div style={{display:"flex",alignItems:"center",gap:5}}>
    <div style={{width:7,height:7,borderRadius:"50%",background:ok?T.GREEN:T.RED,boxShadow:`0 0 6px ${ok?T.GREEN:T.RED}50`}} />
    <span style={{fontFamily:M,fontSize:9,color:ok?T.GREEN:T.RED,letterSpacing:"0.05em"}}>{ok?"VALIDATED":`${issues} ISSUE${issues>1?"S":""}`}</span>
  </div>
);

const StatusBadge = ({status}) => {
  const s = Object.values(SCENE_STATUS).find(x=>x.key===status) || SCENE_STATUS.DRAFT;
  return (
    <span style={{fontFamily:M,fontSize:8,color:s.color,background:`${s.color}12`,border:`1px solid ${s.color}25`,borderRadius:4,padding:"2px 8px",letterSpacing:"0.06em",display:"inline-flex",alignItems:"center",gap:4}}>
      <span style={{fontSize:9}}>{s.icon}</span> {s.label}
    </span>
  );
};

const TagSelect = ({label,value,options,onChange,color=T.GOLD}) => (
  <div style={{marginBottom:10}}>
    <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>{label}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
      {options.map(o=>{
        const name = typeof o === "string" ? o : o.name;
        const active = value === name;
        return <button key={name} onClick={()=>onChange(name)} style={{
          background:active?`${color}15`:T.INPUT, border:`1px solid ${active?color+"40":T.IBORDER}`,
          borderRadius:5, padding:"4px 10px", fontFamily:B, fontSize:10.5,
          color:active?color:"#666", cursor:"pointer", transition:"all 0.15s",
        }}>{name}</button>;
      })}
    </div>
  </div>
);

const MultiTag = ({label,value=[],options,onChange,color=T.CYAN,max=6}) => (
  <div style={{marginBottom:10}}>
    <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>{label} <span style={{color:"#333"}}>({value.length}/{max})</span></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
      {options.map(o=>{
        const active = value.includes(o);
        return <button key={o} onClick={()=>{
          if(active) onChange(value.filter(v=>v!==o));
          else if(value.length<max) onChange([...value,o]);
        }} style={{
          background:active?`${color}12`:T.INPUT, border:`1px solid ${active?color+"35":T.IBORDER}`,
          borderRadius:5, padding:"3px 9px", fontFamily:B, fontSize:10,
          color:active?color:"#555", cursor:"pointer",
        }}>{o}</button>;
      })}
    </div>
  </div>
);


/* ─── REGION 4b: EMOTION ARC ─── → /src/components/screenplay/EmotionArc.jsx */
const EmotionArc = ({charId, scenes, color}) => {
  const charScenes = scenes.filter(s => s.chars[charId]);
  const points = charScenes.map((s, i, arr) => {
    const emo = s.chars[charId].emotion;
    const intensity = emotionIntensity[emo] || 5;
    const x = arr.length > 1 ? (i / (arr.length - 1)) : 0.5;
    return { x, intensity, emo, scene: s.number, sceneId: s.id };
  });
  if (points.length < 2) return null;

  const W = 600, H = 150, PL = 16, PR = 16, PT = 26, PB = 30;
  const plotW = W - PL - PR, plotH = H - PT - PB;
  const mapped = points.map(p => ({
    ...p,
    px: PL + p.x * plotW,
    py: PT + plotH - ((p.intensity - 1) / 9) * plotH,
  }));

  const curvePath = mapped.map((p, i) => {
    if (i === 0) return `M ${p.px} ${p.py}`;
    const prev = mapped[i - 1];
    const cpx = (p.px - prev.px) * 0.4;
    return `C ${prev.px + cpx} ${prev.py}, ${p.px - cpx} ${p.py}, ${p.px} ${p.py}`;
  }).join(" ");
  const areaPath = `${curvePath} L ${mapped[mapped.length - 1].px} ${PT + plotH} L ${mapped[0].px} ${PT + plotH} Z`;

  return (
    <div style={{position:"relative",margin:"8px 0 4px"}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}>
        <defs>
          <linearGradient id={`ea-f-${charId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="75%" stopColor={color} stopOpacity="0.03"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id={`ea-s-${charId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
            <stop offset="50%" stopColor={color} stopOpacity="1"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
          </linearGradient>
          <filter id={`ea-g-${charId}`}><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Faint grid lines (no labels — curve height communicates intensity) */}
        {[2,4,6,8].map(lv => {
          const gy = PT + plotH - ((lv - 1) / 9) * plotH;
          return <line key={lv} x1={PL} y1={gy} x2={W - PR} y2={gy} stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.5"/>;
        })}

        {/* Gradient area fill */}
        <path d={areaPath} fill={`url(#ea-f-${charId})`}/>

        {/* Glow line then crisp line */}
        <path d={curvePath} fill="none" stroke={`url(#ea-s-${charId})`} strokeWidth="2.5" strokeLinecap="round" filter={`url(#ea-g-${charId})`}/>
        <path d={curvePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>

        {/* Nodes */}
        {mapped.map((p, i) => {
          const prev = i > 0 ? mapped[i - 1] : null;
          const jump = prev && Math.abs(p.intensity - prev.intensity) > 4;
          const nc = jump ? T.RED : color;
          return (<g key={i}>
            {/* Vertical drop line */}
            <line x1={p.px} y1={p.py} x2={p.px} y2={PT + plotH} stroke={color} strokeOpacity="0.06" strokeWidth="0.5" strokeDasharray="2 3"/>
            {/* Outer glow */}
            <circle cx={p.px} cy={p.py} r="7" fill={nc} fillOpacity="0.06"/>
            {/* Ring */}
            <circle cx={p.px} cy={p.py} r="4" fill={T.DARK} stroke={nc} strokeWidth="1.5"/>
            {/* Core dot */}
            <circle cx={p.px} cy={p.py} r="1.8" fill={nc}/>
            {/* Jump dashed line + badge */}
            {jump && (<g>
              <line x1={prev.px} y1={prev.py} x2={p.px} y2={p.py} stroke={T.RED} strokeWidth="0.6" strokeDasharray="3 2" strokeOpacity="0.35"/>
              <rect x={(prev.px + p.px) / 2 - 12} y={Math.min(prev.py, p.py) - 14} width="24" height="11" rx="3" fill={`${T.RED}18`} stroke={`${T.RED}30`} strokeWidth="0.5"/>
              <text x={(prev.px + p.px) / 2} y={Math.min(prev.py, p.py) - 6} textAnchor="middle" style={{fontFamily:M,fontSize:6.5,fill:T.RED,fontWeight:700}}>⚡{Math.abs(p.intensity - prev.intensity)}</text>
            </g>)}
            {/* Emotion label */}
            <text x={p.px} y={p.py - 12} textAnchor="middle" style={{fontFamily:B,fontSize:9,fill:nc,fontWeight:500}}>{p.emo}</text>
            {/* Scene label */}
            <text x={p.px} y={PT + plotH + 14} textAnchor="middle" style={{fontFamily:M,fontSize:8,fill:"#555"}}>S{p.scene}</text>
          </g>);
        })}
      </svg>
    </div>
  );
};

/* ─── REGION 4c: SCRIPT PREVIEW ─── → /src/components/screenplay/ScriptPreview.jsx */
const ScriptPreview = ({ scene, chars, compact = false }) => {
  const sp = scene.screenplay;
  if (!sp) return null;
  const fs = compact ? 0.85 : 1;
  return (
    <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:11.5*fs,lineHeight:1.6,color:"#c8c8d0",background:"#08080E",borderRadius:8,padding:compact?"10px 14px":"16px 24px",border:`1px solid ${T.BORDER}`}}>
      {/* Scene Heading */}
      <div style={{fontWeight:700,letterSpacing:"0.04em",color:"#e0e0e8",marginBottom:8*fs,textTransform:"uppercase"}}>{sp.heading} {sp.slugline}</div>
      {/* Action */}
      <div style={{marginBottom:12*fs,color:"#999",lineHeight:1.7}}>{sp.action}</div>
      {/* Dialogue Blocks */}
      {sp.dialogueBlocks?.map((db, i) => {
        const ch = chars.find(c=>c.id===db.charId);
        return (
          <div key={i} style={{marginBottom:10*fs,paddingLeft:compact?30:80}}>
            <div style={{fontWeight:700,color:ch?.color||T.TXT,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:2}}>{ch?.name||"???"}</div>
            {db.parenthetical && <div style={{color:"#666",fontStyle:"italic",marginBottom:2}}>({db.parenthetical})</div>}
            <div style={{color:"#bbb"}}>{db.line}</div>
          </div>
        );
      })}
      {/* Transition */}
      {sp.transition && <div style={{textAlign:"right",fontWeight:700,color:"#555",marginTop:8*fs,letterSpacing:"0.04em"}}>{sp.transition}</div>}
    </div>
  );
};

/* ─── REGION 4d: STATUS PIPELINE ─── → /src/components/screenplay/StatusPipeline.jsx */
const StatusPipeline = ({ currentStatus, onStatusChange, canAdvance }) => {
  const currentIdx = STATUS_FLOW.indexOf(currentStatus);
  return (
    <div style={{display:"flex",alignItems:"center",gap:0}}>
      {STATUS_FLOW.map((sk,i) => {
        const s = Object.values(SCENE_STATUS).find(x=>x.key===sk);
        const isActive = i === currentIdx;
        const isPast = i < currentIdx;
        const isFuture = i > currentIdx;
        const isNext = i === currentIdx + 1;
        return (
          <div key={sk} style={{display:"flex",alignItems:"center"}}>
            <button
              onClick={()=>{
                if (isNext && canAdvance) onStatusChange(sk);
                else if (isPast) onStatusChange(sk);
              }}
              disabled={isFuture && !isNext}
              style={{
                display:"flex",alignItems:"center",gap:5,
                background:isActive?`${s.color}15`:isPast?`${s.color}08`:"transparent",
                border:`1px solid ${isActive?s.color+"50":isPast?s.color+"25":T.IBORDER}`,
                borderRadius:6,padding:"5px 12px",cursor:(isNext&&canAdvance)||isPast||isActive?"pointer":"not-allowed",
                opacity:isFuture&&!isNext?0.3:1,transition:"all 0.2s",
              }}
            >
              <span style={{fontSize:10}}>{s.icon}</span>
              <span style={{fontFamily:M,fontSize:8.5,color:isActive?s.color:isPast?s.color:"#444",fontWeight:isActive?700:400,letterSpacing:"0.06em"}}>{s.label}</span>
            </button>
            {i < STATUS_FLOW.length-1 && (
              <div style={{width:16,height:1,background:isPast?`${s.color}40`:T.IBORDER,margin:"0 -1px"}}/>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── REGION 5: VALIDATION LOGIC ─── → /src/utils/validation.js */
function validateScene(scene, scenes, chars, bible) {
  const issues = [];
  const idx = scenes.findIndex(s => s.id === scene.id);
  Object.entries(scene.chars).forEach(([cid, state]) => {
    const char = chars.find(c => c.id === cid);
    if (!char) return;
    if (idx > 0) {
      for (let prev = idx - 1; prev >= 0; prev--) {
        if (scenes[prev].chars[cid]) {
          const prevEmo = scenes[prev].chars[cid].emotion;
          const currEmo = state.emotion;
          const gap = Math.abs((emotionIntensity[currEmo]||5) - (emotionIntensity[prevEmo]||5));
          if (gap > 4) issues.push(`${char.name}'s emotion jumps from ${prevEmo}→${currEmo} without transition scene (intensity gap: ${gap})`);
          break;
        }
      }
    }
    if (state.mannerismOverride && state.mannerismOverride.length > 0) {
      state.mannerismOverride.forEach(mo => {
        if (!char.mannerisms.includes(mo) && !MANNERISMS.includes(mo)) {
          issues.push(`${char.name}'s mannerism override "${mo}" not in established set — intentional break?`);
        }
      });
    }
  });
  return issues;
}

function validateAllScenes(scenes, chars, bible) {
  return scenes.map(s => ({
    ...s,
    issues: validateScene(s, scenes, chars, bible),
    validated: validateScene(s, scenes, chars, bible).length === 0,
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   REGION 6: API CONTRACT LAYER → /src/api/client.js + /src/api/mock/*.js
   Unified interface for all async operations. Mock adapters simulate
   realistic timing and occasional failures. Swap to real endpoints
   by replacing the mock implementations (Build 3.4).
   ═══════════════════════════════════════════════════════════════════════════ */

// Operation status: idle → loading → success | error
const OP_STATUS = { IDLE: "idle", LOADING: "loading", SUCCESS: "success", ERROR: "error" };

// Standard error types across all operations
const API_ERRORS = {
  TIMEOUT: { code: "TIMEOUT", message: "Operation timed out. Please retry.", retriable: true },
  CREDIT_EXHAUSTED: { code: "CREDIT_EXHAUSTED", message: "Generation credits exhausted. Upgrade your plan to continue.", retriable: false },
  LORA_NOT_TRAINED: { code: "LORA_NOT_TRAINED", message: "Character LoRA adapter not trained. Train in Character Bible first.", retriable: false },
  GENERATION_FAILED: { code: "GENERATION_FAILED", message: "Generation failed. The pipeline encountered an error.", retriable: true },
  VALIDATION_FAILED: { code: "VALIDATION_FAILED", message: "Post-generation validation found issues.", retriable: true },
  NETWORK: { code: "NETWORK", message: "Network error. Check your connection and retry.", retriable: true },
};

// Mock API — simulates async operations with configurable delay and failure rate
const MockAPI = {
  // Simulate network delay + optional random failure
  _call: (fn, delayMs, failRate = 0) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) reject(API_ERRORS.GENERATION_FAILED);
      else resolve(fn());
    }, delayMs);
  }),

  generateStoryboard: (scene, chars, bible) =>
    MockAPI._call(() => ({ success: true, panels: "mock" }), 1800, 0),

  generateVideo: (scene, chars, bible, prompt) =>
    MockAPI._call(() => ({
      success: true,
      videoUrl: null, // placeholder — real API returns S3 URL
      duration: scene.screenplay?.duration || 30,
      thumbnailUrl: null,
      metadata: { model: "flux-1.1-pro", resolution: "1080p", tokens: prompt?.totalTokens || 0 },
    }), 6000, 0),

  generateAudio: (scene, trackType) =>
    MockAPI._call(() => ({
      success: true,
      trackType,
      waveform: Array.from({length: 50}, () => Math.random()),
      duration: scene.screenplay?.duration || 30,
    }), 3000, 0),

  analyzeScript: (screenplay) =>
    MockAPI._call(() => ({
      pacing: Math.round(70 + Math.random() * 25),
      dialogue: Math.round(65 + Math.random() * 30),
      coherence: Math.round(75 + Math.random() * 20),
      suggestions: ["Consider adding a transition beat between scenes 2 and 3"],
    }), 2000, 0),

  exportVideo: (project, format) =>
    MockAPI._call(() => ({
      success: true,
      exportUrl: null,
      format,
    }), 4000, 0),
};

// Notification component for API errors and success messages
const Notification = ({ notification, onDismiss }) => {
  if (!notification) return null;
  const isError = notification.type === "error";
  const color = isError ? T.RED : T.GREEN;
  return (
    <div style={{
      position:"fixed",bottom:24,right:24,zIndex:9998,
      background:T.CARD,border:`1px solid ${color}30`,borderRadius:10,
      padding:"12px 16px",maxWidth:380,boxShadow:`0 8px 32px #00000060`,
      display:"flex",alignItems:"flex-start",gap:10,
      animation:"notifSlide 0.3s ease-out",
    }}>
      <div style={{width:8,height:8,borderRadius:"50%",background:color,marginTop:4,flexShrink:0,boxShadow:`0 0 8px ${color}50`}}/>
      <div style={{flex:1}}>
        <div style={{fontFamily:D,fontWeight:700,fontSize:12,color,marginBottom:2}}>{isError ? "Error" : "Success"}</div>
        <div style={{fontFamily:B,fontSize:11,color:"#999",lineHeight:1.5}}>{notification.message}</div>
        {notification.retriable && (
          <button onClick={notification.onRetry} style={{marginTop:6,background:`${color}12`,border:`1px solid ${color}30`,borderRadius:5,padding:"4px 12px",fontFamily:M,fontSize:9,color,cursor:"pointer"}}>
            Retry
          </button>
        )}
      </div>
      <button onClick={onDismiss} style={{background:"transparent",border:"none",color:"#555",cursor:"pointer",fontFamily:M,fontSize:14,padding:0,lineHeight:1}}>×</button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [ok, setOk] = useState(false);
  useEffect(() => { setTimeout(() => setOk(true), 60); }, []);

  const [bible, setBible] = useState(initBible);
  const [chars, setChars] = useState(initChars);
  const [scenes, setScenes] = useState(initScenes);
  const [screenplay, setScreenplay] = useState(initScreenplay);
  const [activeSceneId, setActiveSceneId] = useState("s1");
  const [view, setView] = useState("screenplay"); // screenplay | console | characters | continuity
  const [expandedChar, setExpandedChar] = useState(null);
  const [spEditScene, setSpEditScene] = useState("s1"); // which scene is being edited in screenplay view
  const [spShowPreview, setSpShowPreview] = useState(false);
  const [sbExpandedPanel, setSbExpandedPanel] = useState(null); // storyboard expanded view {sceneId, panelId}
  const [sbGuidance, setSbGuidance] = useState(""); // text guidance for panel regeneration
  const [sbGenerating, setSbGenerating] = useState(null); // sceneId currently generating
  const [paExpanded, setPaExpanded] = useState({}); // prompt assembly expanded layers { layerId: bool }
  const [paOpen, setPaOpen] = useState(false); // prompt assembly panel open/collapsed
  const [ccOpen, setCcOpen] = useState(false); // continuity context panel open/collapsed
  const [agentFeed, setAgentFeed] = useState([]); // [{agentId, status: "working"|"done"|"warning", detail: string, ts: number}]
  const [videoGenerating, setVideoGenerating] = useState(null); // sceneId currently generating video
  const [genLog, setGenLog] = useState(null); // completed generation log {sceneId, agents[], timestamp}
  const [notification, setNotification] = useState(null); // {type: "error"|"success", message, retriable?, onRetry?}
  const [reviewSceneId, setReviewSceneId] = useState(null); // scene being reviewed
  const [reviewTab, setReviewTab] = useState("comparison"); // comparison | validation | script
  const [playhead, setPlayhead] = useState(0); // 0–100% scrubber position
  const [playSpeed, setPlaySpeed] = useState(1); // 0.25, 0.5, 1, 1.5, 2
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameNotes, setFrameNotes] = useState([]); // [{id, time, text, resolved}]
  const [noteInput, setNoteInput] = useState("");
  const timelineRef = useRef(null);

  const notify = (type, message, opts = {}) => {
    setNotification({ type, message, retriable: opts.retriable || false, onRetry: opts.onRetry || null });
    if (type === "success") setTimeout(() => setNotification(null), 4000);
  };

  const activeScene = scenes.find(s => s.id === activeSceneId);
  const activeIdx = scenes.findIndex(s => s.id === activeSceneId);
  const activeStoryboard = activeScene?.storyboard || null;
  const sbTotalCount = activeStoryboard?.panels?.length || 0;
  const sbApprovedCount = activeStoryboard?.panels?.filter(p => p.approved).length || 0;
  const sbAllApproved = sbTotalCount > 0 && sbApprovedCount === sbTotalCount;
  const spScene = scenes.find(s => s.id === spEditScene);

  useEffect(() => {
    const validated = validateAllScenes(scenes, chars, bible);
    const needsUpdate = validated.some((s,i) =>
      s.validated !== scenes[i].validated || s.issues.length !== scenes[i].issues.length
    );
    if (needsUpdate) setScenes(validated);
  }, [chars, bible]);

  const totalIssues = scenes.reduce((sum, s) => sum + s.issues.length, 0);
  const lockedCount = scenes.filter(s => s.status === "locked" || s.status === "generated").length;
  const totalWords = scenes.reduce((sum, s) => {
    const sp = s.screenplay;
    if (!sp) return sum;
    const words = (sp.action||"").split(/\s+/).length + sp.dialogueBlocks.reduce((a,b) => a + (b.line||"").split(/\s+/).length, 0);
    return sum + words;
  }, 0);

  // Scene CRUD
  /* ─── REGION 7: SCENE ACTIONS ─── → /src/hooks/useSceneActions.js */
  const addScene = () => {
    const num = scenes.length + 1;
    const newScene = {
      id: `s${Date.now()}`, number: num, title: `Scene ${num}`, location: "", time: "",
      camera: { shotType: SHOT_TYPES[0], movement: "", lighting: "", atmosphere: "" },
      chars: {}, validated: true, issues: [],
      status: "draft",
      storyboard: { panels: [], version: 0, generating: false },
      takes: [],
      screenplay: {
        heading: "INT.", slugline: "", action: "", dialogueBlocks: [],
        transition: "CUT TO:", beat: "", notes: "", duration: 30,
      },
    };
    setScenes([...scenes, newScene]);
    setActiveSceneId(newScene.id);
    setSpEditScene(newScene.id);
    // Add to last act
    const acts = [...screenplay.acts];
    if (acts.length) acts[acts.length-1].scenes.push(newScene.id);
    setScreenplay({...screenplay, acts});
    setTimeout(() => { if (timelineRef.current) timelineRef.current.scrollLeft = timelineRef.current.scrollWidth; }, 100);
  };

  const updateScene = (field, value) => {
    setScenes(scenes.map(s => s.id === activeSceneId ? { ...s, [field]: value } : s));
  };
  const updateSceneCamera = (field, value) => {
    setScenes(scenes.map(s => s.id === activeSceneId ? { ...s, camera: { ...s.camera, [field]: value } } : s));
  };
  const updateSceneScreenplay = (sceneId, field, value) => {
    setScenes(scenes.map(s => s.id === sceneId ? { ...s, screenplay: { ...s.screenplay, [field]: value } } : s));
  };
  const updateSceneStatus = (sceneId, newStatus) => {
    setScenes(scenes.map(s => s.id === sceneId ? { ...s, status: newStatus } : s));
  };

  const toggleCharInScene = (charId) => {
    const scene = scenes.find(s => s.id === activeSceneId);
    const newChars = { ...scene.chars };
    if (newChars[charId]) { delete newChars[charId]; }
    else {
      const char = chars.find(c => c.id === charId);
      newChars[charId] = {
        emotion: char.defaultEmotion, wardrobeOverride: null,
        mannerismOverride: null, dialogue: "", deliveryEmo: char.defaultEmotion,
        blocking: "", continuityNotes: "",
      };
    }
    updateScene("chars", newChars);
  };

  const updateCharInScene = (charId, field, value) => {
    const scene = scenes.find(s => s.id === activeSceneId);
    const updated = { ...scene.chars, [charId]: { ...scene.chars[charId], [field]: value } };
    updateScene("chars", updated);
  };

  const surpriseMe = () => {
    const rnd = arr => arr[Math.floor(Math.random()*arr.length)];
    updateSceneCamera("shotType", rnd(SHOT_TYPES));
    updateSceneCamera("movement", rnd(CAMERA_MOVEMENTS).name);
    updateSceneCamera("lighting", rnd(LIGHTING_SOURCES));
    updateSceneCamera("atmosphere", rnd(ATMOSPHERES));
    const scene = scenes.find(s => s.id === activeSceneId);
    Object.keys(scene.chars).forEach(cid => {
      const char = chars.find(c => c.id === cid);
      if (!char) return;
      let prevEmo = char.defaultEmotion;
      for (let i = activeIdx - 1; i >= 0; i--) {
        if (scenes[i].chars[cid]) { prevEmo = scenes[i].chars[cid].emotion; break; }
      }
      const prevInt = emotionIntensity[prevEmo] || 5;
      const validEmos = EMOTIONS_LIST.filter(e => Math.abs((emotionIntensity[e]||5) - prevInt) <= 3);
      updateCharInScene(cid, "emotion", rnd(validEmos));
    });
  };

  const revalidate = useCallback(() => {
    setScenes(prev => validateAllScenes(prev, chars, bible));
  }, [chars, bible]);
  useEffect(() => { revalidate(); }, [scenes.map(s => JSON.stringify(s.chars)).join(",")]);

  /* ─── REGION 8: STORYBOARD LOGIC ─── → /src/hooks/useStoryboard.js */
  const generateStoryboard = (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !scene.screenplay) return;
    setSbGenerating(sceneId);
    setTimeout(() => {
    const sp = scene.screenplay;
    const dialogueCount = sp.dialogueBlocks?.length || 0;
    const actionLength = (sp.action || "").split(/[.!?]+/).filter(s => s.trim().length > 5).length;
    const duration = sp.duration || 30;

    // Intelligence: determine panel count based on content density
    // PRD: "A 30-second scene with 2 dialogue blocks and 1 action beat typically generates 4-6 panels"
    const basePanels = Math.max(4, Math.min(8, dialogueCount + Math.ceil(actionLength / 2) + 1));
    const charIds = Object.keys(scene.chars);
    const actionSentences = (sp.action || "").split(/[.!?]+/).filter(s => s.trim().length > 5);

    const panels = [];
    // Panel 1: Always an establishing shot
    panels.push({
      id: `p_${Date.now()}_0`,
      type: "establishing",
      composition: PANEL_COMPOSITIONS[0],
      scriptRef: actionSentences[0]?.trim() || sp.action?.slice(0, 80) || "Establishing shot",
      cameraLabel: `${scene.camera?.shotType || "Wide Shot"} · ${scene.camera?.lighting || "Natural"}`,
      charPositions: charIds.slice(0, 3),
      approved: false,
      annotations: [],
      regenerating: false,
    });

    // Generate panels for dialogue blocks and action beats
    let panelIdx = 1;
    sp.dialogueBlocks?.forEach((db, i) => {
      if (panelIdx >= basePanels - 1) return; // save last for closing
      panels.push({
        id: `p_${Date.now()}_${panelIdx}`,
        type: "dialogue_delivery",
        composition: PANEL_COMPOSITIONS[i % 2 === 0 ? 3 : 2], // alternate OTS and close-up
        scriptRef: `${db.line}`.slice(0, 80),
        cameraLabel: db.parenthetical ? `${scene.camera?.shotType} · (${db.parenthetical.slice(0, 30)})` : scene.camera?.shotType || "",
        charPositions: [db.charId],
        approved: false,
        annotations: [],
        regenerating: false,
      });
      panelIdx++;
      // Insert action beat between dialogues if we have room
      if (actionSentences[i + 1] && panelIdx < basePanels - 1) {
        panels.push({
          id: `p_${Date.now()}_${panelIdx}`,
          type: "action_beat",
          composition: PANEL_COMPOSITIONS[Math.floor(Math.random() * 6) + 2],
          scriptRef: actionSentences[i + 1]?.trim().slice(0, 80) || "",
          cameraLabel: scene.camera?.movement || "",
          charPositions: charIds.filter(() => Math.random() > 0.3),
          approved: false,
          annotations: [],
          regenerating: false,
        });
        panelIdx++;
      }
    });

    // Fill remaining slots with action beats
    while (panels.length < basePanels - 1) {
      const aSent = actionSentences[panels.length] || actionSentences[panels.length % actionSentences.length];
      panels.push({
        id: `p_${Date.now()}_${panels.length}`,
        type: "action_beat",
        composition: PANEL_COMPOSITIONS[Math.min(panels.length, PANEL_COMPOSITIONS.length - 1)],
        scriptRef: aSent?.trim().slice(0, 80) || `Action beat ${panels.length}`,
        cameraLabel: scene.camera?.movement || scene.camera?.shotType || "",
        charPositions: charIds.filter(() => Math.random() > 0.4),
        approved: false,
        annotations: [],
        regenerating: false,
      });
    }

    // Final panel: closing / transition
    panels.push({
      id: `p_${Date.now()}_${panels.length}`,
      type: "transition",
      composition: PANEL_COMPOSITIONS[panels.length % PANEL_COMPOSITIONS.length],
      scriptRef: sp.transition || "End of scene",
      cameraLabel: sp.transition || "",
      charPositions: charIds,
      approved: false,
      annotations: [],
      regenerating: false,
    });

    setScenes(prev => prev.map(s => s.id === sceneId ? {
      ...s,
      storyboard: { panels, version: (s.storyboard?.version || 0) + 1, generating: false },
    } : s));
    setSbGenerating(null);
    notify("success", `Storyboard generated — ${panels.length} panels. Approve all panels to enable video generation.`);
    }, 1800);
  };

  const approvePanel = (sceneId, panelId) => {
    setScenes(prev => prev.map(s => s.id !== sceneId || !s.storyboard?.panels ? s : {
      ...s,
      storyboard: {
        ...s.storyboard,
        panels: s.storyboard.panels.map(p => p.id === panelId ? { ...p, approved: !p.approved } : p),
      },
    }));
  };

  const rejectPanel = (sceneId, panelId) => {
    setScenes(prev => prev.map(s => s.id !== sceneId || !s.storyboard?.panels ? s : {
      ...s,
      storyboard: {
        ...s.storyboard,
        panels: s.storyboard.panels.map(p => p.id === panelId ? { ...p, approved: false, regenerating: false } : p),
      },
    }));
  };

  const regeneratePanel = (sceneId, panelId) => {
    setScenes(prev => prev.map(s => s.id !== sceneId || !s.storyboard?.panels ? s : {
      ...s,
      storyboard: {
        ...s.storyboard,
        panels: s.storyboard.panels.map(p => p.id === panelId ? { ...p, regenerating: true, approved: false } : p),
      },
    }));
    setTimeout(() => {
      setScenes(prev => prev.map(s => s.id !== sceneId || !s.storyboard?.panels ? s : {
        ...s,
        storyboard: {
          ...s.storyboard,
          panels: s.storyboard.panels.map(p => p.id === panelId ? {
            ...p,
            regenerating: false,
            composition: PANEL_COMPOSITIONS[Math.floor(Math.random() * PANEL_COMPOSITIONS.length)],
          } : p),
        },
      }));
      setSbGuidance("");
    }, 1500);
  };

  const deletePanel = (sceneId, panelId) => {
    setScenes(prev => prev.map(s => s.id !== sceneId || !s.storyboard?.panels ? s : {
      ...s,
      storyboard: {
        ...s.storyboard,
        panels: s.storyboard.panels.filter(p => p.id !== panelId),
      },
    }));
    if (sbExpandedPanel?.panelId === panelId) setSbExpandedPanel(null);
  };

  const addPanelAfter = (sceneId, afterPanelId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene?.storyboard?.panels) return;
    const afterIdx = scene.storyboard.panels.findIndex(p => p.id === afterPanelId);
    if (afterIdx === -1) return;
    const charIds = Object.keys(scene.chars);
    const newPanel = {
      id: `p_${Date.now()}_new`,
      type: "action_beat",
      composition: PANEL_COMPOSITIONS[Math.floor(Math.random() * PANEL_COMPOSITIONS.length)],
      scriptRef: "New panel — add script reference",
      cameraLabel: scene.camera?.shotType || "",
      charPositions: charIds,
      approved: false,
      annotations: [],
      regenerating: false,
    };
    setScenes(prev => prev.map(s => s.id !== sceneId ? s : {
      ...s,
      storyboard: {
        ...s.storyboard,
        panels: [
          ...s.storyboard.panels.slice(0, afterIdx + 1),
          newPanel,
          ...s.storyboard.panels.slice(afterIdx + 1),
        ],
      },
    }));
  };

  const reorderPanel = (sceneId, panelId, direction) => {
    setScenes(prev => prev.map(s => {
      if (s.id !== sceneId || !s.storyboard?.panels) return s;
      const panels = [...s.storyboard.panels];
      const fromIdx = panels.findIndex(p => p.id === panelId);
      if (fromIdx === -1) return s;
      const toIdx = fromIdx + direction;
      if (toIdx < 0 || toIdx >= panels.length) return s;
      [panels[fromIdx], panels[toIdx]] = [panels[toIdx], panels[fromIdx]];
      return { ...s, storyboard: { ...s.storyboard, panels } };
    }));
  };

  /* ─── REGION 9: GENERATION LOGIC ─── → /src/hooks/useGeneration.js */
  const generateVideo = (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;
    setVideoGenerating(sceneId);
    setAgentFeed([]);
    setGenLog(null);

    const prompt = assemblePrompt(scene, chars, scenes, bible);
    const cf = getCarryForward(scene);
    const sceneChars = Object.entries(scene.chars);
    const sbStats = getStoryboardStats(scene);

    // Staged agent reports — each fires after a delay
    const stages = [
      { agentId: "scriptwriter", delay: 400, detail: `Parsed ${scene.screenplay?.dialogueBlocks?.length || 0} dialogue blocks, ${scene.screenplay?.action ? "1" : "0"} action beat, transition: ${scene.screenplay?.transition || "—"}` },
      { agentId: "continuity", delay: 1200, detail: `Loaded ${cf.constraintCount} constraints · ${sceneChars.length} characters resolved · ${cf.flags} flag${cf.flags !== 1 ? "s" : ""}` },
      { agentId: "cinematography", delay: 2000, detail: `Camera: ${scene.camera?.shotType || "—"} + ${(scene.camera?.movement || "—").split("—")[0].trim()} · Lighting: ${scene.camera?.lighting || "—"} · Matched to bible` },
      { agentId: "storyboard", delay: 2800, detail: `${sbStats.total} panels approved as visual reference · Panel 1 framing used for opening keyframe` },
      { agentId: "prompt", delay: 3600, detail: `Assembled ${prompt?.totalTokens?.toLocaleString() || "—"} token prompt · ${prompt?.layers?.length || 0} constraint layers merged` },
      { agentId: "generation", delay: 4800, detail: `Generating ${scene.screenplay?.duration || 30}s at 1080p · Queue position: 1 · Est. ${Math.ceil((scene.screenplay?.duration || 30) * 0.15)}min` },
      { agentId: "validation", delay: 6500, detail: `8 post-generation checks passed · LoRA similarity: 0.91 · Wardrobe match: ✓ · Duration: ${scene.screenplay?.duration || 30}s ±0.4s` },
    ];

    stages.forEach(stage => {
      setTimeout(() => {
        setAgentFeed(prev => [...prev, { agentId: stage.agentId, status: "working", detail: stage.detail, ts: Date.now() }]);
        // Mark as done after a short working period
        setTimeout(() => {
          setAgentFeed(prev => prev.map(a => a.agentId === stage.agentId ? { ...a, status: "done" } : a));
        }, stage.agentId === "generation" ? 1500 : 600);
      }, stage.delay);
    });

    // Complete generation after all agents finish
    setTimeout(() => {
      setVideoGenerating(null);
      const take = {
        id: `take_${Date.now()}`,
        timestamp: Date.now(),
        duration: scene.screenplay?.duration || 30,
        resolution: "1080p",
        tokens: prompt?.totalTokens || 0,
        constraints: cf.constraintCount,
        agentLog: stages.map(s => ({ agentId: s.agentId, detail: s.detail })),
        validation: {
          loraSimilarity: +(0.85 + Math.random() * 0.12).toFixed(2),
          wardrobeMatch: true,
          aspectRatio: true,
          colorGrade: true,
          characterCount: sceneChars.length,
          blockingAccuracy: Math.random() > 0.15,
          temporalContinuity: Math.random() > 0.1,
          durationAccuracy: +(scene.screenplay?.duration || 30 + (Math.random() * 1 - 0.5)).toFixed(1),
          passCount: 0, // computed below
          totalChecks: 8,
        },
        annotations: [],
        approved: false,
      };
      take.validation.passCount = [take.validation.wardrobeMatch, take.validation.aspectRatio, take.validation.colorGrade, true, take.validation.blockingAccuracy, take.validation.temporalContinuity, true, take.validation.loraSimilarity >= 0.85].filter(Boolean).length;

      setGenLog({
        sceneId,
        agents: stages.map(s => ({ agentId: s.agentId, detail: s.detail })),
        timestamp: Date.now(),
        totalTokens: prompt?.totalTokens || 0,
        constraints: cf.constraintCount,
      });
      // Add take to scene and advance status
      setScenes(prev => prev.map(s => s.id === sceneId ? {
        ...s,
        status: "generated",
        takes: [...(s.takes || []), take],
      } : s));
      notify("success", `Scene ${scene.number} generated — ${prompt?.totalTokens?.toLocaleString() || "—"} tokens, ${cf.constraintCount} constraints, ${stages.length} agents`);
      // Auto-navigate to review
      setReviewSceneId(sceneId);
      setPlayhead(0);
      setFrameNotes([]);
      setReviewTab("comparison");
      setView("review");
    }, 8200);
  };

  /* ─── REGION 10: INTELLIGENCE UTILITIES ─── → /src/utils/intelligence.js */
  const getStoryboardStats = (scene) => {
    if (!scene?.storyboard?.panels?.length) return { total: 0, approved: 0, allApproved: false };
    const total = scene.storyboard.panels.length;
    const approved = scene.storyboard.panels.filter(p => p.approved).length;
    return { total, approved, allApproved: approved === total && total > 0 };
  };

    /* carry-forward analysis */
  const getCarryForward = (scene) => {
    if (!scene) return { charDiffs: [], constraintCount: 0, flags: 0, scenePosition: "—" };
    const idx = scenes.findIndex(s => s.id === scene.id);
    const sceneChars = Object.entries(scene.chars);
    let constraintCount = 0;
    let flags = 0;

    const charDiffs = sceneChars.map(([cid, state]) => {
      const ch = chars.find(c => c.id === cid);
      if (!ch) return null;

      // Find previous appearance
      let prevState = null;
      let prevSceneNum = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (scenes[i].chars[cid]) { prevState = scenes[i].chars[cid]; prevSceneNum = scenes[i].number; break; }
      }

      // Count constraints for this character
      const physicalConstraints = Object.entries(ch.physical || {}).filter(([k, v]) =>
        ["Scars/Marks", "Distinguishing Feature", "Facial Hair"].includes(k) && v !== "—"
      );
      constraintCount += 6 + physicalConstraints.length; // emo+wardrobe+blocking+delivery+manner+loRA + physical

      // Compute diffs
      const emoChanged = prevState && prevState.emotion !== state.emotion;
      const emoIntPrev = prevState ? (emotionIntensity[prevState.emotion] || 5) : null;
      const emoIntCurr = emotionIntensity[state.emotion] || 5;
      const emoJump = emoIntPrev !== null ? Math.abs(emoIntCurr - emoIntPrev) : 0;
      const emoFlagged = emoJump > 4;

      const wardChanged = prevState && (state.wardrobeOverride || null) !== (prevState.wardrobeOverride || null);
      const mannChanged = prevState && JSON.stringify(state.mannerismOverride || []) !== JSON.stringify(prevState.mannerismOverride || []);

      if (emoFlagged) flags++;

      return {
        charId: cid,
        name: ch.name,
        color: ch.color,
        loraRef: ch.loraRef,
        firstAppearance: !prevState,
        prevSceneNum,
        prevEmotion: prevState?.emotion || null,
        currEmotion: state.emotion,
        emoChanged,
        emoJump,
        emoFlagged,
        prevWardrobe: prevState?.wardrobeOverride || ch.defaultWardrobe,
        currWardrobe: state.wardrobeOverride || ch.defaultWardrobe,
        wardChanged,
        mannChanged,
        physicalConstraints,
        currBlocking: state.blocking,
      };
    }).filter(Boolean);

    // Add bible constraints
    constraintCount += 8; // genre, era, colorGrade, aspect, filmStock, lens, camera, focal

    return {
      charDiffs,
      constraintCount,
      flags,
      scenePosition: `Scene ${scene.number} of ${scenes.length}${idx === 0 ? " (opening)" : ""}`,
    };
  };

    /* prompt assembly engine */
  const assemblePrompt = (scene, allChars, allScenes, bibleData) => {
    if (!scene?.screenplay) return null;
    const sp = scene.screenplay;
    const sceneChars = Object.entries(scene.chars);
    const sceneIdx = allScenes.findIndex(s => s.id === scene.id);

    // estimate tokens: ~4 chars per token for English
    const estTok = (str) => Math.ceil((str || "").length / 4);
    const sbPanels = scene.storyboard?.panels || [];
    const localSbTotal = sbPanels.length;
    const localSbApproved = sbPanels.filter(p => p.approved).length;

    // Layer 1: Screenplay text
    const dialogueLines = (sp.dialogueBlocks || []).map(db => {
      const ch = allChars.find(c => c.id === db.charId);
      return `DIALOGUE (${ch?.name || "UNKNOWN"}): "${db.line}"${db.parenthetical ? ` [${db.parenthetical}]` : ""}`;
    }).join("\n");
    const screenplayText = [
      `ACTION: ${sp.action || "—"}`,
      "",
      dialogueLines || "NO DIALOGUE",
      "",
      `TRANSITION: ${sp.transition || "—"}`,
      `BEAT: ${sp.beat || "—"} | DURATION: ${sp.duration || 0}s`,
    ].join("\n");

    // Layer 2: Character identity constraints
    const charLines = sceneChars.map(([cid, state]) => {
      const ch = allChars.find(c => c.id === cid);
      if (!ch) return "";
      const physicalStr = Object.entries(ch.physical || {}).map(([k, v]) => `${v}`).join(", ");
      const wardrobeStr = state.wardrobeOverride
        ? `${state.wardrobeOverride} [OVERRIDE from default: ${ch.defaultWardrobe}]`
        : `${ch.defaultWardrobe} [DEFAULT — no override]`;
      const mannStr = (state.mannerismOverride || ch.mannerisms || []).join(", ");
      const intensity = emotionIntensity[state.emotion] || 5;
      return [
        `CHARACTER: ${ch.name} [LoRA:${ch.loraRef ? "active" : "NOT TRAINED"}]`,
        `  Physical: ${physicalStr}`,
        `  Emotion: ${state.emotion} (intensity: ${intensity}/10)`,
        `  Wardrobe: ${wardrobeStr}`,
        `  Blocking: ${state.blocking || "Not specified"}`,
        `  Delivery: ${state.deliveryEmo || state.emotion}`,
        state.mannerismOverride ? `  Mannerisms: ${mannStr} [OVERRIDE]` : `  Mannerisms: ${mannStr} [default]`,
        state.continuityNotes ? `  Continuity note: ${state.continuityNotes}` : "",
      ].filter(Boolean).join("\n");
    }).join("\n\n");

    // Layer 3: Camera configuration
    const cam = scene.camera || {};
    const cameraText = [
      `SHOT: ${cam.shotType || "—"}`,
      `MOVEMENT: ${cam.movement || "—"}`,
      `LIGHTING: ${cam.lighting || "—"}`,
      `ATMOSPHERE: ${cam.atmosphere || "—"}`,
      "",
      localSbTotal > 0 ? `STORYBOARD: ${localSbApproved}/${localSbTotal} panels approved as visual reference` : "STORYBOARD: Not generated",
      `FOCAL: ${bibleData.focalLength || "—"} [from Production Bible]`,
      `BODY: ${typeof bibleData.cameraBody === "string" ? bibleData.cameraBody : bibleData.cameraBody?.name || "—"} [from Production Bible]`,
    ].join("\n");

    // Layer 4: Continuity state
    const prevScenes = allScenes.slice(0, sceneIdx);
    const carryForwardLines = sceneChars.map(([cid, state]) => {
      const ch = allChars.find(c => c.id === cid);
      if (!ch) return "";
      // find previous scene with this character
      let prevState = null;
      let prevSceneNum = null;
      for (let i = prevScenes.length - 1; i >= 0; i--) {
        if (prevScenes[i].chars[cid]) { prevState = prevScenes[i].chars[cid]; prevSceneNum = prevScenes[i].number; break; }
      }
      if (!prevState) return `  → ${ch.name}: First appearance (no carry-forward)`;
      const emoJump = Math.abs((emotionIntensity[state.emotion] || 5) - (emotionIntensity[prevState.emotion] || 5));
      const emoFlag = emoJump > 4 ? " ⚠ INTENSITY JUMP" : "";
      const wardrobeChanged = state.wardrobeOverride !== prevState.wardrobeOverride;
      return [
        `  → ${ch.name}: S${prevSceneNum} ${prevState.emotion} → S${scene.number} ${state.emotion}${emoFlag}`,
        wardrobeChanged ? `    Wardrobe change: "${prevState.wardrobeOverride || ch.defaultWardrobe}" → "${state.wardrobeOverride || ch.defaultWardrobe}"` : null,
      ].filter(Boolean).join("\n");
    }).join("\n");

    // Physical constraints that must persist
    const physConstraints = sceneChars.map(([cid]) => {
      const ch = allChars.find(c => c.id === cid);
      if (!ch) return [];
      return Object.entries(ch.physical || {}).filter(([k]) =>
        ["Scars/Marks", "Distinguishing Feature", "Facial Hair"].includes(k) && ch.physical[k] !== "—"
      ).map(([k, v]) => `  → ${ch.name}: ${k} — ${v}`);
    }).flat();

    const constraintCount = sceneChars.length * 7 + physConstraints.length + 4; // chars × (emo+ward+block+deliver+manner+loRA+physical) + bible params
    const continuityText = [
      `SCENE POSITION: Scene ${scene.number} of ${allScenes.length}${sceneIdx === 0 ? " (opening — no prior state)" : ""}`,
      `CONTINUITY FLAGS: ${scene.issues?.length || 0} active`,
      "",
      "CARRY-FORWARD:",
      carryForwardLines || "  No prior character state",
      "",
      "PERSISTENT PHYSICAL CONSTRAINTS:",
      ...physConstraints,
      physConstraints.length === 0 ? "  None flagged" : "",
    ].join("\n");

    // Layer 5: Production bible
    const bodyName = typeof bibleData.cameraBody === "string" ? bibleData.cameraBody : bibleData.cameraBody?.name || "—";
    const bibleText = [
      `GENRE: ${bibleData.genre || "—"}`,
      `ERA: ${bibleData.era || "—"}`,
      `COLOR GRADE: ${bibleData.colorGrade || "—"}`,
      `ASPECT: ${bibleData.aspectRatio || "—"}`,
      `FILM STOCK: ${bibleData.filmStock || "—"}`,
      `LENS: ${bibleData.lensType || "—"}`,
      `CAMERA: ${bodyName}`,
      `FOCAL: ${bibleData.focalLength || "—"}`,
    ].join("\n");

    // Layer 6: Validation criteria
    const validationText = [
      "POST-GENERATION VALIDATION:",
      `  1. LoRA similarity: generated frames vs reference (threshold: 0.85)${sceneChars.some(([cid]) => !allChars.find(c => c.id === cid)?.loraRef) ? " ⚠ Some characters have no LoRA" : ""}`,
      "  2. Wardrobe consistency: color histogram match against description",
      `  3. Aspect ratio compliance: ${bibleData.aspectRatio || "—"} output verified`,
      `  4. Color grade adherence: ${bibleData.colorGrade || "—"} curve applied`,
      `  5. Character count: ${sceneChars.length} character${sceneChars.length !== 1 ? "s" : ""} visible per blocking`,
      "  6. Blocking accuracy: positions match stage directions",
      "  7. Temporal continuity: no items appear/disappear between frames",
      `  8. Duration: output length matches ${sp.duration || 0}s target ±2s`,
    ].join("\n");

    const layers = [
      { id: "screenplay", text: screenplayText, tokens: estTok(screenplayText), items: `${(sp.dialogueBlocks||[]).length} dialogue + ${sp.action ? "1" : "0"} action` },
      { id: "characters", text: charLines, tokens: estTok(charLines), items: `${sceneChars.length} character${sceneChars.length !== 1 ? "s" : ""}` },
      { id: "camera", text: cameraText, tokens: estTok(cameraText), items: "4 parameters" },
      { id: "continuity", text: continuityText, tokens: estTok(continuityText), items: `${constraintCount} constraints` },
      { id: "bible", text: bibleText, tokens: estTok(bibleText), items: "8 parameters" },
      { id: "validation", text: validationText, tokens: estTok(validationText), items: "8 post-gen checks" },
    ];
    const totalTokens = layers.reduce((a, l) => a + l.tokens, 0);
    return { layers, totalTokens, constraintCount };
  };

  /* ─── REGION 12+: RENDER — Layout, Views, Overlays ─── */
  return (
    <div style={{minHeight:"100vh",background:T.DARK,color:T.TXT,fontFamily:B}}>
      <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;0,6..96,800;1,6..96,400;1,6..96,700&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
      <style>{`
        /* ─── CRUSHED STUDIOS RESPONSIVE SYSTEM ─── */
        /* Standardized breakpoints: mobile ≤640, tablet 641-1199, desktop 1200+ */
        :root {
          --cs-pad: 24px;
          --cs-main-max: 92vw;
          --cs-grid-cols-2: repeat(2, 1fr);
          --cs-grid-cols-3: repeat(3, 1fr);
          --cs-grid-cols-4: repeat(4, 1fr);
          --cs-overlay-cols: 3fr 2fr;
        }
        @media (min-width: 1200px) {
          :root {
            --cs-pad: clamp(24px, 3vw, 48px);
            --cs-main-max: min(92vw, 1400px);
          }
        }
        @media (max-width: 1024px) {
          :root {
            --cs-pad: 16px;
            --cs-main-max: 96vw;
            --cs-grid-cols-3: repeat(2, 1fr);
            --cs-grid-cols-4: repeat(2, 1fr);
            --cs-overlay-cols: 1fr;
          }
        }
        @media (max-width: 640px) {
          :root {
            --cs-pad: 10px;
            --cs-main-max: 100vw;
            --cs-grid-cols-2: 1fr;
            --cs-grid-cols-3: 1fr;
            --cs-grid-cols-4: 1fr;
            --cs-overlay-cols: 1fr;
          }
        }
        /* Responsive containers */
        .cs-header { padding: 12px var(--cs-pad); }
        .cs-main { max-width: var(--cs-main-max); margin: 0 auto; padding: 20px var(--cs-pad) 80px; }
        /* Responsive grids */
        .cs-g2 { display: grid; grid-template-columns: var(--cs-grid-cols-2); }
        .cs-g3 { display: grid; grid-template-columns: var(--cs-grid-cols-3); }
        .cs-g4 { display: grid; grid-template-columns: var(--cs-grid-cols-4); }
        .cs-overlay-split { display: grid; grid-template-columns: var(--cs-overlay-cols); }
        /* Timeline horizontal scroll: ensure touch-friendly on mobile */
        .cs-timeline { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-snap-type: x proximity; }
        .cs-timeline > div { scroll-snap-align: start; }
        /* Hide header tech badges on narrow screens */
        @media (max-width: 860px) {
          .cs-tech-badges { display: none !important; }
        }
        /* Filmstrip cards: smaller on mobile */
        @media (max-width: 640px) {
          .cs-filmstrip-card { min-width: 160px !important; max-width: 160px !important; }
        }
        /* Keyframe animations */
        @keyframes sbspin { to { transform: rotate(360deg); } }
        @keyframes sbpulse { from { opacity: 0.4; } to { opacity: 1; } }
        @keyframes afspin { to { transform: rotate(360deg); } }
        @keyframes notifSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div style={{position:"fixed",top:"-25%",right:"-15%",width:600,height:600,background:`radial-gradient(circle,${T.GOLD}04 0%,transparent 70%)`,pointerEvents:"none"}}/>

      {/* ═══ HEADER ═══ */}
      <header className="cs-header" style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.BORDER}`,backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100,background:`${T.DARK}dd`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:6,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#000",fontFamily:D}}>C</div>
          <div>
            <div style={{fontFamily:D,fontWeight:700,fontSize:14,color:"#F0F0F5"}}>CRUSHED STUDIOS</div>
            <div style={{fontFamily:M,fontSize:8,color:"#444",letterSpacing:"0.12em"}}>PRODUCTION CONSOLE · v6.0 · LAYER 1 CREATIVE PIPELINE</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {["LoRA","Neo4j","PostgreSQL","Prompt v2","Script Engine","Storyboard AI"].map(t=><span key={t} className="cs-tech-badges" style={{fontFamily:M,fontSize:8,color:"#333",background:"#0A0A12",border:"1px solid #14141F",borderRadius:4,padding:"2px 7px"}}>{t}</span>)}
          <div style={{width:1,height:18,background:T.BORDER,margin:"0 4px"}}/>
          {totalIssues > 0 && <span style={{fontFamily:M,fontSize:9,color:T.RED,background:`${T.RED}10`,border:`1px solid ${T.RED}25`,borderRadius:4,padding:"2px 8px"}}>{totalIssues} issue{totalIssues>1?"s":""}</span>}
          <span style={{fontFamily:M,fontSize:9,color:T.GREEN,background:`${T.GREEN}10`,border:`1px solid ${T.GREEN}25`,borderRadius:4,padding:"2px 8px"}}>{lockedCount}/{scenes.length} locked</span>
          {scenes.filter(s=>s.storyboard?.panels?.length>0).length > 0 && (
            <span style={{fontFamily:M,fontSize:9,color:T.CYAN,background:`${T.CYAN}10`,border:`1px solid ${T.CYAN}25`,borderRadius:4,padding:"2px 8px"}}>
              {scenes.filter(s=>getStoryboardStats(s).allApproved).length}/{scenes.filter(s=>s.storyboard?.panels?.length>0).length} storyboarded
            </span>
          )}
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#00E5A0",boxShadow:"0 0 8px #00E5A060"}}/>
            <span style={{fontFamily:M,fontSize:9,color:"#555"}}>Online</span>
          </div>
        </div>
      </header>

      <main className="cs-main" style={{opacity:ok?1:0,transform:ok?"none":"translateY(10px)",transition:"all 0.6s"}}>

        <div style={{marginBottom:20}} />

        {/* ═══ VIEW TABS — Screenplay is now FIRST ═══ */}
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {[
            {id:"screenplay",icon:"📝",label:"Screenplay",desc:"Write, structure & lock scenes"},
            {id:"console",icon:"🎬",label:"Scene Console",desc:"Configure & generate scenes"},
            {id:"characters",icon:"👤",label:"Character Bible",desc:"Identity cards & LoRA status"},
            {id:"continuity",icon:"🔗",label:"Continuity Tracker",desc:"Cross-scene validation"},
          ].concat(scenes.some(s => s.takes?.length > 0) ? [{id:"review",icon:"🎥",label:"Review Interface",desc:"Review generated output"}] : []).map(tab=>(
            <button key={tab.id} onClick={()=>setView(tab.id)} style={{
              flex:1, background:view===tab.id?`${T.GOLD}0A`:"transparent",
              border:`1px solid ${view===tab.id?T.GOLD+"35":T.BORDER}`,
              borderRadius:10, padding:"11px 14px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:9, position:"relative",
            }}>
              {view===tab.id && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:ACCENT}}/>}
              <span style={{fontSize:17}}>{tab.icon}</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:D,fontWeight:700,fontSize:11.5,color:view===tab.id?T.GOLD:"#555"}}>{tab.label}</div>
                <div style={{fontFamily:M,fontSize:8,color:"#444"}}>{tab.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════
            SCENE TIMELINE
            ═══════════════════════════════════════════════ */}
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontFamily:M,fontSize:9,color:"#444",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              Scene Timeline · {scenes.length} scene{scenes.length>1?"s":""}
              <Tip text="Click any scene to navigate. Screenplay status shown as colored badges. Only LOCKED scenes can be sent to video generation."/>
            </div>
            <div style={{display:"flex",gap:6}}>
              {activeIdx > 0 && <button onClick={()=>{setActiveSceneId(scenes[activeIdx-1].id);setSpEditScene(scenes[activeIdx-1].id);}} style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:"#666",cursor:"pointer"}}>← Prev</button>}
              {activeIdx < scenes.length-1 && <button onClick={()=>{setActiveSceneId(scenes[activeIdx+1].id);setSpEditScene(scenes[activeIdx+1].id);}} style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:"#666",cursor:"pointer"}}>Next →</button>}
              <button onClick={addScene} style={{background:`${T.GOLD}12`,border:`1px solid ${T.GOLD}30`,borderRadius:5,padding:"4px 12px",fontFamily:M,fontSize:9,color:T.GOLD,cursor:"pointer",fontWeight:600}}>+ Add Scene</button>
            </div>
          </div>
          <div ref={timelineRef} className="cs-timeline" style={{gap:8,paddingBottom:8,scrollBehavior:"smooth"}}>
            {scenes.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center"}}>
                <div onClick={()=>{setActiveSceneId(s.id);setSpEditScene(s.id);}} style={{
                  minWidth:170, background:s.id===activeSceneId?`${T.GOLD}08`:T.CARD,
                  border:`1px solid ${s.id===activeSceneId?T.GOLD+"40":T.BORDER}`,
                  borderRadius:9, padding:"10px 13px", cursor:"pointer", position:"relative", flexShrink:0, transition:"all 0.2s",
                }}>
                  {s.id===activeSceneId && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:ACCENT,borderRadius:"9px 9px 0 0"}}/>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <span style={{fontFamily:M,fontSize:9,color:T.GOLD,fontWeight:600}}>S{s.number}</span>
                    <StatusBadge status={s.status}/>
                  </div>
                  <div style={{fontFamily:D,fontWeight:700,fontSize:12,color:T.TXT,marginBottom:3}}>{s.title}</div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",marginBottom:6}}>{s.time||"—"} · {s.screenplay?.duration||0}s</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap",alignItems:"center"}}>
                      {Object.keys(s.chars).map(cid=>{
                        const ch = chars.find(c=>c.id===cid);
                        return ch ? <div key={cid} style={{width:6,height:6,borderRadius:"50%",background:ch.color}}/> : null;
                      })}
                      {s.storyboard?.panels?.length > 0 && (
                        <span style={{fontFamily:M,fontSize:7,color:getStoryboardStats(s).allApproved?T.GREEN:T.CYAN,background:getStoryboardStats(s).allApproved?`${T.GREEN}12`:`${T.CYAN}10`,borderRadius:3,padding:"1px 5px",marginLeft:2}}>
                          {getStoryboardStats(s).allApproved?"✓ ":""}SB:{s.storyboard.panels.length}
                        </span>
                      )}
                    </div>
                    <VBadge ok={s.validated} issues={s.issues.length}/>
                  </div>
                </div>
                {i < scenes.length-1 && <div style={{width:20,height:1,background:T.BORDER,flexShrink:0,margin:"0 -4px"}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            VIEW: SCREENPLAY — THE PRIMARY CREATIVE WORKSPACE
            ═══════════════════════════════════════════════════════════════ */}
        {view === "screenplay" && (
          <div>
            {/* ── Project Meta ── */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH icon="🎬" title="PROJECT SCREENPLAY" tip="The screenplay is the foundation of your film. Write and lock scenes here before they flow into the Production Console for cinematography and generation."/>
              <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8,marginBottom:12}}>
                <div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Title</div>
                  <input value={screenplay.title} onChange={e=>setScreenplay({...screenplay,title:e.target.value})} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"10px 12px",color:T.TXT,fontFamily:D,fontSize:16,fontWeight:700,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Logline</div>
                  <input value={screenplay.logline} onChange={e=>setScreenplay({...screenplay,logline:e.target.value})} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 12px",color:"#bbb",fontFamily:B,fontSize:12,fontStyle:"italic",outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Synopsis</div>
                  <textarea value={screenplay.synopsis} onChange={e=>setScreenplay({...screenplay,synopsis:e.target.value})} rows={3} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 12px",color:"#999",fontFamily:B,fontSize:11.5,outline:"none",resize:"vertical",lineHeight:1.6}}/>
                </div>
              </div>
              {/* Stats bar */}
              <div style={{display:"flex",gap:16,fontFamily:M,fontSize:9,color:"#444",borderTop:`1px solid ${T.BORDER}`,paddingTop:10}}>
                <span>{scenes.length} scene{scenes.length>1?"s":""}</span>
                <span>{totalWords} words</span>
                <span>{scenes.reduce((a,s)=>a+(s.screenplay?.duration||0),0)}s total duration</span>
                <span style={{marginLeft:"auto",color:lockedCount===scenes.length?T.GREEN:T.ORANGE}}>{lockedCount}/{scenes.length} locked for generation</span>
              </div>
            </div>

            {/* ── Act Structure ── */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH icon="📐" title="ACT STRUCTURE" tip="Organize scenes into acts. This maps to the narrative arc and helps the AI optimize pacing, tension curves, and emotional beats across the entire film."/>
              <div style={{display:"flex",gap:8}}>
                {screenplay.acts.map((act, ai) => (
                  <div key={act.id} style={{flex:1,background:`${T.PURPLE}06`,border:`1px solid ${T.PURPLE}20`,borderRadius:8,padding:12}}>
                    <input value={act.name} onChange={e=>{
                      const acts = [...screenplay.acts];
                      acts[ai] = {...acts[ai], name: e.target.value};
                      setScreenplay({...screenplay, acts});
                    }} style={{width:"100%",boxSizing:"border-box",background:"transparent",border:"none",color:T.PURPLE,fontFamily:D,fontWeight:700,fontSize:12,outline:"none",marginBottom:8}}/>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {act.scenes.map(sid => {
                        const s = scenes.find(x=>x.id===sid);
                        if (!s) return null;
                        return (
                          <div key={sid} onClick={()=>setSpEditScene(sid)} style={{
                            display:"flex",alignItems:"center",gap:6,padding:"5px 8px",
                            background:spEditScene===sid?`${T.GOLD}10`:"transparent",
                            border:`1px solid ${spEditScene===sid?T.GOLD+"30":"transparent"}`,
                            borderRadius:5,cursor:"pointer",transition:"all 0.15s",
                          }}>
                            <span style={{fontFamily:M,fontSize:9,color:T.GOLD,fontWeight:600}}>S{s.number}</span>
                            <span style={{fontFamily:B,fontSize:10.5,color:"#888",flex:1}}>{s.title}</span>
                            <StatusBadge status={s.status}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Scene Script Editor ── */}
            {spScene && (
              <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
                <SH icon="✍️" title={`SCENE ${spScene.number} — ${spScene.title.toUpperCase()}`}
                  tip="Edit the screenplay for this scene. When you're happy with the script, advance the status to REVIEWED, then LOCKED. Only locked scenes can be sent to the Production Console for video generation."
                  right={
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <button onClick={()=>setSpShowPreview(!spShowPreview)} style={{background:spShowPreview?`${T.TEAL}12`:T.INPUT,border:`1px solid ${spShowPreview?T.TEAL+"30":T.IBORDER}`,borderRadius:5,padding:"4px 12px",fontFamily:M,fontSize:9,color:spShowPreview?T.TEAL:"#666",cursor:"pointer"}}>
                        {spShowPreview?"Editor":"Preview"}
                      </button>
                    </div>
                  }
                />

                {/* Status Pipeline */}
                <div style={{marginBottom:16}}>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Script Status</div>
                  <StatusPipeline
                    currentStatus={spScene.status}
                    onStatusChange={(ns) => updateSceneStatus(spScene.id, ns)}
                    canAdvance={spScene.screenplay?.action?.length > 10}
                  />
                  <div style={{fontFamily:M,fontSize:8.5,color:"#333",marginTop:6}}>
                    {spScene.status === "draft" && "Write the script, then advance to REVIEWED when ready."}
                    {spScene.status === "reviewed" && "Review complete. Lock the scene to enable video generation."}
                    {spScene.status === "locked" && "🔒 Script is locked. Head to Scene Console to configure cinematography and generate."}
                    {spScene.status === "generated" && "★ Video has been generated from this script."}
                  </div>
                </div>

                {spShowPreview ? (
                  /* ── Script Preview (formatted) ── */
                  <ScriptPreview scene={spScene} chars={chars} />
                ) : (
                  /* ── Script Editor Fields ── */
                  <div style={{display:"grid",gap:12}}>
                    {/* Scene Heading */}
                    <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:8}}>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Heading</div>
                        <select value={spScene.screenplay?.heading||"INT."} onChange={e=>updateSceneScreenplay(spScene.id,"heading",e.target.value)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:M,fontSize:11,outline:"none"}}>
                          {SCENE_HEADINGS.map(h=><option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Slugline</div>
                        <input value={spScene.screenplay?.slugline||""} onChange={e=>updateSceneScreenplay(spScene.id,"slugline",e.target.value)} placeholder="LOCATION — TIME OF DAY" style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:M,fontSize:11,outline:"none",textTransform:"uppercase",letterSpacing:"0.04em"}}/>
                      </div>
                    </div>

                    {/* Action / Scene Description */}
                    <div>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Action / Scene Description <Tip text="Describe what the audience sees — setting, character movements, physical details. This is the visual blueprint that feeds directly into the video generation prompt."/></div>
                      <textarea value={spScene.screenplay?.action||""} onChange={e=>updateSceneScreenplay(spScene.id,"action",e.target.value)} rows={5} placeholder="Describe the visual action of this scene..." style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"10px 12px",color:"#ccc",fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:12,outline:"none",resize:"vertical",lineHeight:1.7}}/>
                    </div>

                    {/* Dialogue Blocks */}
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase"}}>Dialogue Blocks <Tip text="Add dialogue for each character in this scene. Parentheticals describe how the line is delivered. These sync with the character's dialogue field in the Scene Console."/></div>
                        <button onClick={()=>{
                          const dbs = [...(spScene.screenplay?.dialogueBlocks||[])];
                          dbs.push({ charId: chars[0]?.id||"", line: "", parenthetical: "" });
                          updateSceneScreenplay(spScene.id, "dialogueBlocks", dbs);
                        }} style={{background:`${T.CYAN}12`,border:`1px solid ${T.CYAN}30`,borderRadius:5,padding:"3px 10px",fontFamily:M,fontSize:9,color:T.CYAN,cursor:"pointer"}}>+ Add Dialogue</button>
                      </div>
                      {(spScene.screenplay?.dialogueBlocks||[]).map((db, di) => {
                        const ch = chars.find(c=>c.id===db.charId);
                        return (
                          <div key={di} style={{background:`${ch?.color||"#555"}06`,border:`1px solid ${ch?.color||"#555"}15`,borderRadius:8,padding:10,marginBottom:8}}>
                            <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
                              <select value={db.charId} onChange={e=>{
                                const dbs = [...spScene.screenplay.dialogueBlocks];
                                dbs[di] = {...dbs[di], charId: e.target.value};
                                updateSceneScreenplay(spScene.id, "dialogueBlocks", dbs);
                              }} style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"5px 8px",color:ch?.color||T.TXT,fontFamily:D,fontWeight:700,fontSize:11,outline:"none"}}>
                                {chars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                              <input value={db.parenthetical} onChange={e=>{
                                const dbs = [...spScene.screenplay.dialogueBlocks];
                                dbs[di] = {...dbs[di], parenthetical: e.target.value};
                                updateSceneScreenplay(spScene.id, "dialogueBlocks", dbs);
                              }} placeholder="parenthetical..." style={{flex:1,background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"5px 8px",color:"#777",fontFamily:B,fontSize:10,fontStyle:"italic",outline:"none"}}/>
                              <button onClick={()=>{
                                const dbs = spScene.screenplay.dialogueBlocks.filter((_,j)=>j!==di);
                                updateSceneScreenplay(spScene.id, "dialogueBlocks", dbs);
                              }} style={{background:`${T.RED}10`,border:`1px solid ${T.RED}20`,borderRadius:4,padding:"3px 8px",fontFamily:M,fontSize:9,color:T.RED,cursor:"pointer"}}>×</button>
                            </div>
                            <textarea value={db.line} onChange={e=>{
                              const dbs = [...spScene.screenplay.dialogueBlocks];
                              dbs[di] = {...dbs[di], line: e.target.value};
                              updateSceneScreenplay(spScene.id, "dialogueBlocks", dbs);
                            }} rows={2} placeholder="Character's dialogue..." style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:"#ccc",fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:11.5,outline:"none",resize:"vertical",lineHeight:1.6}}/>
                          </div>
                        );
                      })}
                    </div>

                    {/* Beat + Transition + Duration */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px",gap:8}}>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Story Beat</div>
                        <select value={spScene.screenplay?.beat||""} onChange={e=>updateSceneScreenplay(spScene.id,"beat",e.target.value)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none"}}>
                          <option value="">Select beat...</option>
                          {BEAT_TYPES.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Transition Out</div>
                        <select value={spScene.screenplay?.transition||""} onChange={e=>updateSceneScreenplay(spScene.id,"transition",e.target.value)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none"}}>
                          {TRANSITION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Duration (s)</div>
                        <input type="number" value={spScene.screenplay?.duration||30} onChange={e=>updateSceneScreenplay(spScene.id,"duration",parseInt(e.target.value)||0)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:M,fontSize:12,outline:"none"}}/>
                      </div>
                    </div>

                    {/* Director's Notes */}
                    <div>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Director's Notes <Tip text="Intent behind the scene — what's the emotional goal, what should the audience feel? These notes guide the AI's creative decisions during generation but don't appear in the script."/></div>
                      <textarea value={spScene.screenplay?.notes||""} onChange={e=>updateSceneScreenplay(spScene.id,"notes",e.target.value)} rows={3} placeholder="What's the point of this scene? What should the audience feel?" style={{width:"100%",boxSizing:"border-box",background:`${T.GOLD}05`,border:`1px solid ${T.GOLD}15`,borderRadius:6,padding:"10px 12px",color:"#aa8833",fontFamily:B,fontSize:11.5,fontStyle:"italic",outline:"none",resize:"vertical",lineHeight:1.6}}/>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── AI Optimization Panel ── */}
            <div style={{background:`${T.PURPLE}06`,border:`1px solid ${T.PURPLE}20`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH icon="🧠" title="AI SCRIPT INTELLIGENCE" tip="The Scriptwriter Agent analyzes your screenplay for pacing issues, dialogue quality, narrative coherence, and suggests optimizations. Run analysis to get scene-level and project-level insights."/>
              <div className="cs-g3" style={{gap:10,marginBottom:12}}>
                {[
                  {label:"Pacing Score",value:"7.8/10",color:T.GREEN,sub:"Good tension curve across acts"},
                  {label:"Dialogue Quality",value:"8.2/10",color:T.GREEN,sub:"Natural voice, distinct characters"},
                  {label:"Narrative Coherence",value:"6.5/10",color:T.ORANGE,sub:"S3 emotion jump needs transition"},
                ].map(m=>(
                  <div key={m.label} style={{background:T.CARD,borderRadius:8,padding:12,border:`1px solid ${T.BORDER}`}}>
                    <div style={{fontFamily:D,fontWeight:700,fontSize:20,color:m.color}}>{m.value}</div>
                    <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:2}}>{m.label}</div>
                    <div style={{fontFamily:B,fontSize:10,color:"#555"}}>{m.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{background:`${T.PURPLE}15`,border:`1px solid ${T.PURPLE}35`,borderRadius:6,padding:"8px 16px",fontFamily:D,fontWeight:700,fontSize:11,color:T.PURPLE,cursor:"pointer"}}>🔄 Re-analyze Script</button>
                <button style={{background:`${T.CYAN}15`,border:`1px solid ${T.CYAN}35`,borderRadius:6,padding:"8px 16px",fontFamily:D,fontWeight:700,fontSize:11,color:T.CYAN,cursor:"pointer"}}>✨ Suggest Improvements</button>
                <button style={{background:`${T.GOLD}15`,border:`1px solid ${T.GOLD}35`,borderRadius:6,padding:"8px 16px",fontFamily:D,fontWeight:700,fontSize:11,color:T.GOLD,cursor:"pointer"}}>📊 Export Screenplay PDF</button>
              </div>
            </div>

            {/* ── Generation Readiness ── */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16}}>
              <SH icon="🚀" title="GENERATION READINESS" tip="Shows which scenes have locked scripts and are ready to flow into the Production Console for cinematography setup and video generation."/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {scenes.map(s => {
                  const isReady = s.status === "locked" || s.status === "generated";
                  const hasChars = Object.keys(s.chars).length > 0;
                  const hasScript = s.screenplay?.action?.length > 20;
                  return (
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:isReady?`${T.GREEN}06`:`${T.RED}04`,border:`1px solid ${isReady?T.GREEN+"20":T.RED+"10"}`,borderRadius:7}}>
                      <span style={{fontFamily:M,fontSize:10,color:T.GOLD,fontWeight:700,width:30}}>S{s.number}</span>
                      <span style={{fontFamily:D,fontWeight:600,fontSize:12,color:T.TXT,flex:1}}>{s.title}</span>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontFamily:M,fontSize:8.5,color:hasScript?T.GREEN:"#444"}}>{hasScript?"✓ Script":"✗ Script"}</span>
                        <span style={{fontFamily:M,fontSize:8.5,color:hasChars?T.GREEN:"#444"}}>{hasChars?"✓ Cast":"✗ Cast"}</span>
                        <StatusBadge status={s.status}/>
                        {isReady && (
                          <button onClick={()=>{setActiveSceneId(s.id);setView("console");}} style={{background:ACCENT,border:"none",borderRadius:5,padding:"4px 12px",fontFamily:M,fontSize:9,color:"#000",cursor:"pointer",fontWeight:700}}>
                            Open Console →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════
            VIEW: SCENE CONSOLE
            ═══════════════════════════════════════════════ */}
        {view === "console" && activeScene && (
          <div>
            {/* Lock gate */}
            {activeScene.status === "draft" && (
              <div style={{background:`${T.ORANGE}08`,border:`1px solid ${T.ORANGE}25`,borderRadius:10,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>⚠️</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:D,fontWeight:700,fontSize:12,color:T.ORANGE}}>Scene script is still in DRAFT</div>
                  <div style={{fontFamily:B,fontSize:11,color:"#886633"}}>Lock the screenplay first before configuring cinematography. This ensures your script is finalized before generation.</div>
                </div>
                <button onClick={()=>setView("screenplay")} style={{background:`${T.ORANGE}15`,border:`1px solid ${T.ORANGE}35`,borderRadius:6,padding:"6px 14px",fontFamily:D,fontWeight:700,fontSize:11,color:T.ORANGE,cursor:"pointer",whiteSpace:"nowrap"}}>Go to Screenplay →</button>
              </div>
            )}

            {/* Scene issues bar */}
            {activeScene.issues.length > 0 && (
              <div style={{background:`${T.RED}06`,border:`1px solid ${T.RED}20`,borderRadius:10,padding:14,marginBottom:16}}>
                <div style={{fontFamily:M,fontSize:9,color:T.RED,fontWeight:600,letterSpacing:"0.08em",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                  ⚠️ CONTINUITY ISSUES · SCENE {activeScene.number}
                </div>
                {activeScene.issues.map((issue,i)=>(
                  <div key={i} style={{background:`${T.RED}08`,borderRadius:6,padding:"7px 12px",marginBottom:i<activeScene.issues.length-1?5:0,fontFamily:B,fontSize:11,color:"#cc8888",lineHeight:1.5,borderLeft:`2px solid ${T.RED}40`}}>{issue}</div>
                ))}
                <div style={{display:"flex",gap:6,marginTop:9}}>
                  <button style={{background:`${T.RED}12`,border:`1px solid ${T.RED}30`,borderRadius:5,padding:"5px 12px",fontFamily:M,fontSize:9,color:T.RED,cursor:"pointer",fontWeight:600}}>Add Transition Scene</button>
                  <button style={{background:`${T.GOLD}12`,border:`1px solid ${T.GOLD}30`,borderRadius:5,padding:"5px 12px",fontFamily:M,fontSize:9,color:T.GOLD,cursor:"pointer",fontWeight:600}}>Mark as Intentional</button>
                </div>
              </div>
            )}

            {/* Script Preview (collapsed) */}
            {activeScene.screenplay?.action && (
              <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
                <SH icon="📝" title="LOCKED SCRIPT" tip="This is the locked screenplay for this scene. To edit, go back to the Screenplay tab and unlock."/>
                <ScriptPreview scene={activeScene} chars={chars} compact={true}/>
              </div>
            )}

            {/* ═══ STORYBOARD GENERATOR — PRD §3.1 ═══ */}
            {(activeScene.status === "locked" || activeScene.status === "generated") && (
              <div style={{background:T.CARD,border:`1px solid ${T.CYAN}15`,borderRadius:10,padding:16,marginBottom:14,position:"relative",overflow:"hidden"}}>
                {/* Subtle cyan accent line */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.CYAN}40,${T.CYAN}10,transparent)`}}/>

                <SH icon="🎞️" title="STORYBOARD" n={activeStoryboard ? undefined : "✦"}
                  tip="Visual pre-visualization of the scene. The Storyboard Agent analyzes your screenplay to generate panel compositions. Approve all panels to enable video generation."
                  right={
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {activeStoryboard && (
                        <span style={{fontFamily:M,fontSize:8.5,color:sbAllApproved?T.GREEN:T.CYAN,letterSpacing:"0.05em"}}>
                          {sbApprovedCount}/{sbTotalCount} APPROVED {sbAllApproved && "✓"}
                        </span>
                      )}
                      {activeStoryboard && (
                        <span style={{fontFamily:M,fontSize:8,color:"#333",letterSpacing:"0.06em"}}>v{activeStoryboard.version}</span>
                      )}
                      <button
                        onClick={() => generateStoryboard(activeSceneId)}
                        disabled={sbGenerating === activeSceneId}
                        style={{
                          background: sbGenerating === activeSceneId ? `${T.CYAN}08` : activeStoryboard ? `${T.CYAN}08` : `${T.CYAN}15`,
                          border: `1px solid ${T.CYAN}${sbGenerating ? "15" : "35"}`,
                          borderRadius: 6, padding: "5px 14px", fontFamily: M, fontSize: 9,
                          color: sbGenerating === activeSceneId ? "#555" : T.CYAN,
                          cursor: sbGenerating === activeSceneId ? "wait" : "pointer", fontWeight: 600,
                        }}
                      >
                        {sbGenerating === activeSceneId ? "⟳ Generating…" : activeStoryboard ? "↻ Regenerate All" : "✦ Generate Storyboard"}
                      </button>
                    </div>
                  }
                />

                {/* No storyboard yet */}
                {!activeStoryboard && sbGenerating !== activeSceneId && (
                  <div style={{textAlign:"center",padding:"28px 20px"}}>
                    <div style={{fontSize:36,marginBottom:10,opacity:0.3}}>🎞️</div>
                    <div style={{fontFamily:D,fontWeight:700,fontSize:14,color:"#555",marginBottom:6}}>No Storyboard Generated</div>
                    <div style={{fontFamily:B,fontSize:11.5,color:"#444",lineHeight:1.6,maxWidth:420,margin:"0 auto 16px"}}>
                      The Storyboard Agent will analyze your locked screenplay — action text, dialogue blocks, character blocking, and camera settings — to produce {activeScene.screenplay?.dialogueBlocks?.length >= 3 ? "6–8" : "4–6"} visual panels.
                    </div>
                    <div style={{display:"flex",justifyContent:"center",gap:16,fontFamily:M,fontSize:9,color:"#333"}}>
                      <span>📋 {activeScene.screenplay?.dialogueBlocks?.length || 0} dialogue blocks</span>
                      <span>🎬 {activeScene.camera?.shotType || "—"}</span>
                      <span>👤 {Object.keys(activeScene.chars).length} characters</span>
                    </div>
                  </div>
                )}

                {/* Generation in progress */}
                {sbGenerating === activeSceneId && (
                  <div style={{textAlign:"center",padding:"32px 20px"}}>
                    <div style={{width:40,height:40,margin:"0 auto 14px",borderRadius:"50%",border:`2px solid ${T.CYAN}30`,borderTopColor:T.CYAN,animation:"sbspin 0.8s linear infinite"}}/>
                    <div style={{fontFamily:D,fontWeight:700,fontSize:13,color:T.CYAN,marginBottom:4}}>Storyboard Agent Working…</div>
                    <div style={{fontFamily:B,fontSize:11,color:"#555"}}>Analyzing screenplay structure, composing panels from scene data</div>
                    <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12}}>
                      {["Parsing Script","Composing Frames","Character Placement","Camera Matching"].map((stage, i) => (
                        <span key={stage} style={{fontFamily:M,fontSize:8,color:`${T.CYAN}${40 + i * 15}`,background:`${T.CYAN}06`,border:`1px solid ${T.CYAN}15`,borderRadius:4,padding:"3px 8px",
                          animation:`sbpulse ${1 + i * 0.3}s ease-in-out infinite alternate`,
                        }}>{stage}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Storyboard Filmstrip ── */}
                {activeStoryboard && sbGenerating !== activeSceneId && (
                  <div>
                    {/* Filmstrip horizontal scroll */}
                    <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:10,scrollBehavior:"smooth",paddingTop:4}}>
                      {activeStoryboard.panels.map((panel, pi) => {
                        const borderColor = PANEL_BORDER_STATES[getPanelStatus(panel)] || "#333";
                        const isRegen = panel.regenerating;
                        const dialogueChar = panel.dialogueRef ? chars.find(c => c.id === panel.dialogueRef) : null;
                        return (
                          <div key={panel.id} className="cs-filmstrip-card" style={{minWidth:200,maxWidth:200,flexShrink:0,position:"relative"}}>
                            {/* 16:9 Panel Card */}
                            <div
                              onClick={() => setSbExpandedPanel({sceneId:activeSceneId, panelId:panel.id})}
                              style={{
                                width:200,height:112.5, // 16:9
                                background: isRegen ? `${T.ORANGE}06` : panel.approved ? `${T.GREEN}04` : `${T.CYAN}04`,
                                border: `1.5px solid ${borderColor}${panel.approved ? "60" : "35"}`,
                                borderRadius: 8, cursor: "pointer", position: "relative", overflow: "hidden",
                                transition: "all 0.2s", display:"flex", alignItems:"center", justifyContent:"center",
                              }}
                            >
                              {/* Panel number badge */}
                              <div style={{position:"absolute",top:6,left:6,background:"#000C",borderRadius:4,padding:"2px 7px",fontFamily:M,fontSize:9,color:"#ccc",fontWeight:600,backdropFilter:"blur(4px)",zIndex:2}}>
                                {panel.number}
                              </div>
                              {/* Status indicator */}
                              <div style={{position:"absolute",top:6,right:6,zIndex:2}}>
                                {panel.approved && <span style={{fontFamily:M,fontSize:8,color:T.GREEN,background:`${T.GREEN}20`,borderRadius:3,padding:"2px 6px"}}>✓ OK</span>}
                                {getPanelStatus(panel) === "rejected" && <span style={{fontFamily:M,fontSize:8,color:T.RED,background:`${T.RED}20`,borderRadius:3,padding:"2px 6px"}}>✗ REDO</span>}
                                {getPanelStatus(panel) === "regenerating" && <span style={{fontFamily:M,fontSize:8,color:T.ORANGE,background:`${T.ORANGE}20`,borderRadius:3,padding:"2px 6px"}}>⟳</span>}
                              </div>
                              {/* Composition visualization (placeholder art) */}
                              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:0.5}}>
                                <div style={{fontFamily:M,fontSize:18,color:borderColor}}>
                                  {panel.composition === "Wide Establishing" && "▬▬▬"}
                                  {panel.composition === "Close-Up Reaction" && "◉"}
                                  {panel.composition === "Over-the-Shoulder" && "◐"}
                                  {panel.composition === "Medium Two-Shot" && "◫◫"}
                                  {panel.composition === "Tracking Movement" && "→→→"}
                                  {panel.composition === "Insert Detail" && "⊡"}
                                  {panel.composition === "Dutch Angle" && "◇"}
                                  {panel.composition === "POV Shot" && "◎"}
                                  {panel.composition === "Silhouette" && "▮"}
                                  {panel.composition === "Overhead" && "⊕"}
                                  {!["Wide Establishing","Close-Up Reaction","Over-the-Shoulder","Medium Two-Shot","Tracking Movement","Insert Detail","Dutch Angle","POV Shot","Silhouette","Overhead"].includes(panel.composition) && "□"}
                                </div>
                                <div style={{fontFamily:M,fontSize:7.5,color:"#444",letterSpacing:"0.05em"}}>{panel.composition}</div>
                              </div>
                              {/* Character dots */}
                              <div style={{position:"absolute",bottom:6,left:6,display:"flex",gap:3}}>
                                {panel.charPositions.map((cp, ci) => {
                                  const name = cp.split("—")[0].trim().split(" ")[0];
                                  const ch = chars.find(c => c.name.startsWith(name));
                                  return <div key={ci} style={{width:5,height:5,borderRadius:"50%",background:ch?.color || "#555"}}/>;
                                })}
                              </div>
                              {/* Camera label */}
                              <div style={{position:"absolute",bottom:6,right:6,fontFamily:M,fontSize:7,color:"#444",maxWidth:100,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{panel.cameraLabel}</div>
                            </div>

                            {/* Below panel: description + dialogue ref */}
                            <div style={{padding:"6px 2px 0"}}>
                              <div style={{fontFamily:B,fontSize:9.5,color:"#888",lineHeight:1.4,height:28,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                                {panel.description}
                              </div>
                              {dialogueChar && (
                                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:3}}>
                                  <div style={{width:5,height:5,borderRadius:"50%",background:dialogueChar.color}}/>
                                  <span style={{fontFamily:M,fontSize:8,color:dialogueChar.color}}>{dialogueChar.name}</span>
                                </div>
                              )}
                            </div>

                            {/* Action row */}
                            <div style={{display:"flex",gap:3,marginTop:6}}>
                              {!panel.approved && (
                                <button onClick={(e) => {e.stopPropagation(); approvePanel(activeSceneId, panel.id);}}
                                  style={{flex:1,background:`${T.GREEN}10`,border:`1px solid ${T.GREEN}25`,borderRadius:4,padding:"4px 0",fontFamily:M,fontSize:8,color:T.GREEN,cursor:"pointer"}}>
                                  ✓ Approve
                                </button>
                              )}
                              {panel.approved && (
                                <button onClick={(e) => {e.stopPropagation(); rejectPanel(activeSceneId, panel.id);}}
                                  style={{flex:1,background:`${T.ORANGE}08`,border:`1px solid ${T.ORANGE}20`,borderRadius:4,padding:"4px 0",fontFamily:M,fontSize:8,color:T.ORANGE,cursor:"pointer"}}>
                                  ↩ Unapprove
                                </button>
                              )}
                              <button onClick={(e) => {e.stopPropagation(); regeneratePanel(activeSceneId, panel.id);}}
                                disabled={isRegen}
                                style={{flex:1,background:`${T.CYAN}08`,border:`1px solid ${T.CYAN}20`,borderRadius:4,padding:"4px 0",fontFamily:M,fontSize:8,color:isRegen?"#444":T.CYAN,cursor:isRegen?"wait":"pointer"}}>
                                {isRegen ? "⟳…" : "↻ Regen"}
                              </button>
                              <button onClick={(e) => {e.stopPropagation(); deletePanel(activeSceneId, panel.id);}}
                                style={{background:`${T.RED}08`,border:`1px solid ${T.RED}15`,borderRadius:4,padding:"4px 6px",fontFamily:M,fontSize:8,color:T.RED,cursor:"pointer",opacity:0.7}}>
                                ✕
                              </button>
                            </div>

                            {/* Reorder arrows */}
                            <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:4}}>
                              {pi > 0 && (
                                <button onClick={(e) => {e.stopPropagation(); reorderPanel(activeSceneId, panel.id, -1);}}
                                  style={{background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:3,padding:"2px 8px",fontFamily:M,fontSize:8,color:"#444",cursor:"pointer"}}>
                                  ← Move
                                </button>
                              )}
                              <button onClick={(e) => {e.stopPropagation(); addPanelAfter(activeSceneId, panel.id);}}
                                style={{background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:3,padding:"2px 8px",fontFamily:M,fontSize:8,color:"#555",cursor:"pointer"}}>
                                + Insert After
                              </button>
                              {pi < activeStoryboard.panels.length - 1 && (
                                <button onClick={(e) => {e.stopPropagation(); reorderPanel(activeSceneId, panel.id, 1);}}
                                  style={{background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:3,padding:"2px 8px",fontFamily:M,fontSize:8,color:"#444",cursor:"pointer"}}>
                                  Move →
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Filmstrip summary bar */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,paddingTop:10,borderTop:`1px solid ${T.BORDER}`}}>
                      <div style={{display:"flex",gap:14,fontFamily:M,fontSize:9,color:"#444"}}>
                        <span>🎞️ {sbTotalCount} panel{sbTotalCount!==1?"s":""}</span>
                        <span style={{color:T.GREEN}}>✓ {sbApprovedCount} approved</span>
                        <span style={{color:sbTotalCount - sbApprovedCount > 0 ? T.ORANGE : "#333"}}>◯ {sbTotalCount - sbApprovedCount} pending</span>
                        {activeStoryboard.panels.some(p => p.annotations.length > 0) && (
                          <span style={{color:T.PURPLE}}>💬 {activeStoryboard.panels.reduce((a,p) => a + p.annotations.length, 0)} annotation{activeStoryboard.panels.reduce((a,p) => a + p.annotations.length, 0)!==1?"s":""}</span>
                        )}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {sbAllApproved && (
                          <span style={{fontFamily:M,fontSize:9,color:T.GREEN,background:`${T.GREEN}10`,border:`1px solid ${T.GREEN}25`,borderRadius:4,padding:"3px 10px",fontWeight:600}}>
                            ✓ ALL PANELS APPROVED — READY FOR VIDEO
                          </span>
                        )}
                        {!sbAllApproved && sbTotalCount > 0 && (
                          <span style={{fontFamily:M,fontSize:9,color:T.ORANGE,background:`${T.ORANGE}08`,border:`1px solid ${T.ORANGE}20`,borderRadius:4,padding:"3px 10px"}}>
                            Approve all panels to enable video generation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Storyboard not available gate for draft/reviewed scenes */}
            {activeScene.status !== "locked" && activeScene.status !== "generated" && (
              <div style={{background:`${T.CYAN}04`,border:`1px solid ${T.CYAN}12`,borderRadius:10,padding:14,marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18,opacity:0.4}}>🎞️</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:D,fontWeight:700,fontSize:12,color:"#555"}}>Storyboard Available After Locking</div>
                  <div style={{fontFamily:B,fontSize:11,color:"#444"}}>Lock the screenplay to enable the Storyboard Generator. The AI will create visual panels from your script.</div>
                </div>
              </div>
            )}

            {/* Scene Meta */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH n={1} icon="📋" title="SCENE DETAILS" tip="Scene metadata carries through the Continuity Engine timeline."/>
              <div className="cs-g3" style={{gap:8}}>
                <div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Title</div>
                  <input value={activeScene.title} onChange={e=>updateScene("title",e.target.value)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:12,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Location</div>
                  <input value={activeScene.location} onChange={e=>updateScene("location",e.target.value)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:12,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Timecode</div>
                  <input value={activeScene.time} onChange={e=>updateScene("time",e.target.value)} placeholder="00:00–00:30" style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:12,outline:"none"}}/>
                </div>
              </div>
            </div>

            {/* Camera & Cinematography */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH n={2} icon="🎥" title="CINEMATOGRAPHY"
                right={<button onClick={surpriseMe} style={{background:`${T.GOLD}12`,border:`1px solid ${T.GOLD}30`,borderRadius:5,padding:"4px 12px",fontFamily:M,fontSize:9,color:T.GOLD,cursor:"pointer",fontWeight:600}}>🎲 Surprise Me</button>}
              />
              <div className="cs-g2" style={{gap:12}}>
                <TagSelect label="Shot Type" value={activeScene.camera?.shotType} options={SHOT_TYPES} onChange={v=>updateSceneCamera("shotType",v)}/>
                <TagSelect label="Camera Movement" value={activeScene.camera?.movement} options={CAMERA_MOVEMENTS} onChange={v=>updateSceneCamera("movement",v)}/>
                <TagSelect label="Lighting" value={activeScene.camera?.lighting} options={LIGHTING_SOURCES} onChange={v=>updateSceneCamera("lighting",v)}/>
                <TagSelect label="Atmosphere" value={activeScene.camera?.atmosphere} options={ATMOSPHERES} onChange={v=>updateSceneCamera("atmosphere",v)}/>
              </div>
            </div>

            {/* Characters in Scene */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH n={3} icon="👥" title="CHARACTERS IN SCENE"/>
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {chars.map(ch => {
                  const inScene = !!activeScene.chars[ch.id];
                  return (
                    <button key={ch.id} onClick={()=>toggleCharInScene(ch.id)} style={{
                      display:"flex",alignItems:"center",gap:7,
                      background:inScene?`${ch.color}10`:T.INPUT,
                      border:`1px solid ${inScene?ch.color+"35":T.IBORDER}`,
                      borderRadius:7,padding:"7px 14px",cursor:"pointer",
                    }}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:inScene?ch.color:"#333"}}/>
                      <span style={{fontFamily:D,fontWeight:600,fontSize:11.5,color:inScene?ch.color:"#555"}}>{ch.name}</span>
                      {ch.loraRef && <span style={{fontFamily:M,fontSize:7.5,color:T.GREEN,background:`${T.GREEN}12`,borderRadius:3,padding:"1px 5px"}}>LoRA</span>}
                      {!ch.loraRef && <span style={{fontFamily:M,fontSize:7.5,color:T.RED,background:`${T.RED}12`,borderRadius:3,padding:"1px 5px"}}>No LoRA</span>}
                    </button>
                  );
                })}
              </div>

              {Object.entries(activeScene.chars).map(([cid, state]) => {
                const ch = chars.find(c=>c.id===cid);
                if(!ch) return null;
                let prevState = null;
                for(let i=activeIdx-1;i>=0;i--){if(scenes[i].chars[cid]){prevState=scenes[i].chars[cid];break;}}
                return (
                  <div key={cid} style={{background:`${ch.color}04`,border:`1px solid ${ch.color}15`,borderRadius:9,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:22,height:22,borderRadius:5,background:`${ch.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:D,fontWeight:700,fontSize:10,color:ch.color}}>{ch.name[0]}</div>
                        <span style={{fontFamily:D,fontWeight:700,fontSize:13,color:ch.color}}>{ch.name}</span>
                        {prevState && <span style={{fontFamily:M,fontSize:8.5,color:"#444"}}>prev: {prevState.emotion}</span>}
                      </div>
                      {state.wardrobeOverride && <span style={{fontFamily:M,fontSize:8,color:T.ORANGE,background:`${T.ORANGE}10`,borderRadius:3,padding:"2px 7px"}}>WARDROBE OVERRIDE</span>}
                    </div>
                    <div className="cs-g2" style={{gap:10}}>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Scene Emotion</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                          {EMOTIONS_LIST.map(e=>{
                            const active = state.emotion === e;
                            const prevInt = prevState ? (emotionIntensity[prevState.emotion]||5) : null;
                            const thisInt = emotionIntensity[e]||5;
                            const wouldJump = prevInt !== null && Math.abs(thisInt - prevInt) > 4;
                            return <button key={e} onClick={()=>updateCharInScene(cid,"emotion",e)} style={{
                              background:active?`${ch.color}15`:wouldJump?`${T.RED}06`:T.INPUT,
                              border:`1px solid ${active?ch.color+"40":wouldJump?T.RED+"15":T.IBORDER}`,
                              borderRadius:4,padding:"3px 7px",fontFamily:B,fontSize:9.5,
                              color:active?ch.color:wouldJump?"#664444":"#555",cursor:"pointer",
                            }}>{e}</button>;
                          })}
                        </div>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Dialogue</div>
                        <input value={state.dialogue} onChange={e=>updateCharInScene(cid,"dialogue",e.target.value)} placeholder="Character's line..." style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none",marginBottom:6}}/>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Delivery Emotion</div>
                        <select value={state.deliveryEmo||""} onChange={e=>updateCharInScene(cid,"deliveryEmo",e.target.value||null)} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"7px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none"}}>
                          <option value="">Same as scene emotion</option>
                          {EMOTIONS_LIST.map(e=><option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Blocking / Stage Direction</div>
                        <textarea value={state.blocking} onChange={e=>updateCharInScene(cid,"blocking",e.target.value)} placeholder="Enters frame left..." rows={2} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none",resize:"vertical"}}/>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Wardrobe Override</div>
                        <textarea value={state.wardrobeOverride||""} onChange={e=>updateCharInScene(cid,"wardrobeOverride",e.target.value||null)} placeholder={`Default: ${ch.defaultWardrobe||"Not set"}`} rows={2} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none",resize:"vertical"}}/>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Continuity Notes</div>
                        <textarea value={state.continuityNotes} onChange={e=>updateCharInScene(cid,"continuityNotes",e.target.value)} placeholder="e.g., Coat has dust on shoulder..." rows={2} style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none",resize:"vertical"}}/>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Mannerism Override</div>
                        <MultiTag value={state.mannerismOverride||[]} options={MANNERISMS} onChange={v=>updateCharInScene(cid,"mannerismOverride",v.length?v:null)} color={ch.color} max={4}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Production Bible */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH n={4} icon="📖" title="PRODUCTION BIBLE"/>
              <div className="cs-g3" style={{gap:10}}>
                <TagSelect label="Genre" value={bible.genre} options={GENRES} onChange={v=>setBible({...bible,genre:v})} color={T.PURPLE}/>
                <TagSelect label="Era" value={bible.era} options={ERAS} onChange={v=>setBible({...bible,era:v})} color={T.PURPLE}/>
                <TagSelect label="Color Grade" value={bible.colorGrade} options={COLOR_GRADES} onChange={v=>setBible({...bible,colorGrade:v})} color={T.PURPLE}/>
                <TagSelect label="Camera Body" value={bible.cameraBody} options={CAMERA_BODIES} onChange={v=>setBible({...bible,cameraBody:v})} color={T.BLUE}/>
                <TagSelect label="Lens Type" value={bible.lensType} options={LENS_TYPES} onChange={v=>setBible({...bible,lensType:v})} color={T.BLUE}/>
                <TagSelect label="Film Stock" value={bible.filmStock} options={FILM_STOCKS} onChange={v=>setBible({...bible,filmStock:v})} color={T.BLUE}/>
                <TagSelect label="Aspect Ratio" value={bible.aspectRatio} options={ASPECT_RATIOS} onChange={v=>setBible({...bible,aspectRatio:v})} color={T.BLUE}/>
                <TagSelect label="Default Focal Length" value={bible.focalLength} options={FOCAL_LENGTHS} onChange={v=>setBible({...bible,focalLength:v})} color={T.BLUE}/>
              </div>
            </div>

            {/* ═══ CONTINUITY ENGINE CONTEXT — Moat Visibility ═══ */}
            {(() => {
              const cf = getCarryForward(activeScene);
              if (!cf || cf.charDiffs.length === 0) return null;
              return (
              <div style={{background:T.CARD,border:`1px solid ${T.TEAL}15`,borderRadius:10,padding:0,marginBottom:14,overflow:"hidden",position:"relative"}}>
                {/* Teal accent stripe */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.TEAL},${T.TEAL}60,${T.TEAL}20)`}}/>

                {/* Header */}
                <div onClick={()=>setCcOpen(!ccOpen)} style={{padding:"14px 16px 10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:15}}>🔗</span>
                    <span style={{fontFamily:D,fontWeight:400,fontSize:14,color:T.TXT,letterSpacing:"0.03em"}}>CONTINUITY ENGINE</span>
                    <Tip text="What the Continuity Engine knows about each character entering this scene — carry-forward state, constraint count, and flagged discontinuities." />
                    {cf.flags > 0 && <span style={{fontFamily:M,fontSize:8,color:T.RED,background:`${T.RED}12`,border:`1px solid ${T.RED}25`,borderRadius:3,padding:"2px 7px",letterSpacing:"0.06em"}}>{cf.flags} FLAG{cf.flags>1?"S":""}</span>}
                    {cf.flags === 0 && <span style={{fontFamily:M,fontSize:8,color:T.GREEN,background:`${T.GREEN}12`,border:`1px solid ${T.GREEN}25`,borderRadius:3,padding:"2px 7px",letterSpacing:"0.06em"}}>CLEAR</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:M,fontSize:9,color:T.TEAL,background:`${T.TEAL}10`,borderRadius:4,padding:"2px 8px"}}>
                      {cf.constraintCount} constraints · {cf.charDiffs.length} char{cf.charDiffs.length>1?"s":""}
                    </span>
                    <span style={{fontFamily:M,fontSize:11,color:"#555",transition:"transform 0.2s",transform:ccOpen?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
                  </div>
                </div>

                {/* Collapsed: Compact summary row */}
                {!ccOpen && (
                  <div style={{padding:"0 16px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
                    {cf.charDiffs.map(cd => (
                      <div key={cd.charId} style={{display:"flex",alignItems:"center",gap:5,background:`${cd.color}06`,border:`1px solid ${cd.color}15`,borderRadius:5,padding:"4px 10px"}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:cd.color}}/>
                        <span style={{fontFamily:D,fontWeight:600,fontSize:10.5,color:cd.color}}>{cd.name}</span>
                        {cd.firstAppearance
                          ? <span style={{fontFamily:M,fontSize:8,color:"#555"}}>1st appearance</span>
                          : <>
                              <span style={{fontFamily:M,fontSize:8,color:cd.emoFlagged?T.RED:cd.emoChanged?"#888":"#555"}}>
                                {cd.emoChanged ? `${cd.prevEmotion} → ${cd.currEmotion}` : cd.currEmotion}
                              </span>
                              {cd.emoFlagged && <span style={{fontFamily:M,fontSize:7,color:T.RED}}>⚡</span>}
                              {cd.wardChanged && <span style={{fontFamily:M,fontSize:7,color:T.ORANGE}}>👔</span>}
                            </>
                        }
                      </div>
                    ))}
                  </div>
                )}

                {/* Expanded: Per-character carry-forward detail */}
                {ccOpen && (
                  <div style={{padding:"0 16px 14px"}}>
                    {cf.charDiffs.map(cd => (
                      <div key={cd.charId} style={{background:`${cd.color}04`,border:`1px solid ${cd.color}12`,borderRadius:8,padding:12,marginBottom:8}}>
                        {/* Character header */}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <div style={{width:18,height:18,borderRadius:4,background:`${cd.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:D,fontWeight:700,fontSize:9,color:cd.color}}>{cd.name[0]}</div>
                            <span style={{fontFamily:D,fontWeight:700,fontSize:12,color:cd.color}}>{cd.name}</span>
                            {cd.loraRef ? <span style={{fontFamily:M,fontSize:7.5,color:T.GREEN,background:`${T.GREEN}10`,borderRadius:3,padding:"1px 5px"}}>LoRA</span> : <span style={{fontFamily:M,fontSize:7.5,color:T.RED,background:`${T.RED}10`,borderRadius:3,padding:"1px 5px"}}>No LoRA</span>}
                          </div>
                          <span style={{fontFamily:M,fontSize:8,color:"#555"}}>{6 + cd.physicalConstraints.length} constraints</span>
                        </div>

                        {cd.firstAppearance ? (
                          <div style={{fontFamily:B,fontSize:11,color:"#666",fontStyle:"italic"}}>First appearance — no prior state to carry forward</div>
                        ) : (
                          <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            {/* Emotion diff */}
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontFamily:M,fontSize:8,color:"#444",width:60,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0}}>Emotion</span>
                              <span style={{fontFamily:M,fontSize:9,color:cd.emoFlagged?T.RED:cd.color,background:cd.emoFlagged?`${T.RED}08`:`${cd.color}06`,borderRadius:3,padding:"2px 7px"}}>
                                S{cd.prevSceneNum} {cd.prevEmotion}
                              </span>
                              <span style={{fontFamily:M,fontSize:9,color:cd.emoFlagged?T.RED:cd.emoChanged?"#888":"#555"}}>{cd.emoChanged?"→":"="}</span>
                              <span style={{fontFamily:M,fontSize:9,color:cd.emoFlagged?T.RED:cd.color,background:cd.emoFlagged?`${T.RED}08`:`${cd.color}06`,borderRadius:3,padding:"2px 7px"}}>
                                S{activeScene.number} {cd.currEmotion}
                              </span>
                              {cd.emoFlagged && <span style={{fontFamily:M,fontSize:8,color:T.RED,background:`${T.RED}10`,borderRadius:3,padding:"1px 5px"}}>⚡ Jump: {cd.emoJump}</span>}
                              {!cd.emoChanged && <span style={{fontFamily:M,fontSize:8,color:T.GREEN}}>✓</span>}
                            </div>

                            {/* Wardrobe diff */}
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontFamily:M,fontSize:8,color:"#444",width:60,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0}}>Wardrobe</span>
                              {cd.wardChanged ? (
                                <>
                                  <span style={{fontFamily:B,fontSize:10,color:"#666",textDecoration:"line-through",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cd.prevWardrobe}</span>
                                  <span style={{fontFamily:M,fontSize:9,color:T.ORANGE}}>→</span>
                                  <span style={{fontFamily:B,fontSize:10,color:T.ORANGE,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cd.currWardrobe}</span>
                                  <span style={{fontFamily:M,fontSize:7.5,color:T.ORANGE,background:`${T.ORANGE}10`,borderRadius:3,padding:"1px 5px"}}>CHANGED</span>
                                </>
                              ) : (
                                <>
                                  <span style={{fontFamily:B,fontSize:10,color:"#777",maxWidth:250,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cd.currWardrobe}</span>
                                  <span style={{fontFamily:M,fontSize:8,color:T.GREEN}}>✓ Consistent</span>
                                </>
                              )}
                            </div>

                            {/* Mannerism diff */}
                            {cd.mannChanged && (
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{fontFamily:M,fontSize:8,color:"#444",width:60,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0}}>Manner</span>
                                <span style={{fontFamily:M,fontSize:8,color:T.ORANGE,background:`${T.ORANGE}10`,borderRadius:3,padding:"1px 5px"}}>OVERRIDE ACTIVE</span>
                              </div>
                            )}

                            {/* Physical constraints */}
                            {cd.physicalConstraints.length > 0 && (
                              <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
                                <span style={{fontFamily:M,fontSize:8,color:"#444",width:60,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0,paddingTop:2}}>Persist</span>
                                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                  {cd.physicalConstraints.map(([k, v]) => (
                                    <span key={k} style={{fontFamily:M,fontSize:8,color:"#666",background:`${T.TEAL}06`,border:`1px solid ${T.TEAL}12`,borderRadius:3,padding:"2px 6px"}}>{v}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Footer with link to Continuity tab */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                      <span style={{fontFamily:M,fontSize:9,color:"#555"}}>
                        {cf.scenePosition} · <span style={{color:T.TXT}}>{cf.constraintCount}</span> total constraints
                      </span>
                      <button onClick={()=>setView("continuity")} style={{background:"transparent",border:`1px solid ${T.TEAL}25`,borderRadius:5,padding:"3px 10px",fontFamily:M,fontSize:8.5,color:T.TEAL,cursor:"pointer"}}>
                        View full graph →
                      </button>
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

            {/* ═══ PROMPT ASSEMBLY PREVIEW — Moat Visibility ═══ */}
            {(activeScene.status === "locked" || activeScene.status === "generated") && (() => {
              const prompt = assemblePrompt(activeScene, chars, scenes, bible);
              if (!prompt) return null;
              const toggleLayer = (lid) => setPaExpanded(prev => ({...prev, [lid]: !prev[lid]}));
              const allExpanded = PROMPT_LAYERS.every(l => paExpanded[l.id]);
              const toggleAllLayers = () => {
                if (allExpanded) setPaExpanded({});
                else setPaExpanded(Object.fromEntries(PROMPT_LAYERS.map(l => [l.id, true])));
              };
              return (
              <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:0,marginBottom:14,overflow:"hidden",position:"relative"}}>
                {/* Purple accent stripe */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#7F77DD,#534AB7,#378ADD,#BA7517,#D85A30,#E24B4A)"}}/>

                {/* Header — clickable to toggle panel */}
                <div onClick={()=>setPaOpen(!paOpen)} style={{padding:"14px 16px 10px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:22,height:22,borderRadius:5,background:`${T.PURPLE}15`,border:`1px solid ${T.PURPLE}30`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:M,fontSize:9,color:T.PURPLE,fontWeight:700}}>5</span>
                    <span style={{fontSize:15}}>⚡</span>
                    <span style={{fontFamily:D,fontWeight:400,fontSize:14,color:T.TXT,letterSpacing:"0.03em"}}>PROMPT ASSEMBLY</span>
                    <Tip text="Live view of the generation prompt assembled from your screenplay, characters, camera, continuity state, and Production Bible. This is exactly what the AI pipeline receives." />
                    <span style={{fontFamily:M,fontSize:8,color:T.GREEN,background:`${T.GREEN}12`,border:`1px solid ${T.GREEN}25`,borderRadius:3,padding:"2px 7px",letterSpacing:"0.06em"}}>LIVE</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:M,fontSize:9,color:T.PURPLE,background:`${T.PURPLE}12`,borderRadius:4,padding:"2px 8px",letterSpacing:"0.04em"}}>
                      {prompt.layers.length} layers · {prompt.totalTokens.toLocaleString()} tokens
                    </span>
                    <span style={{fontFamily:M,fontSize:11,color:"#555",transition:"transform 0.2s",transform:paOpen?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
                  </div>
                </div>

                {/* Collapsed: Token proportion bar always visible */}
                <div style={{padding:"0 16px 12px"}}>
                  <div style={{display:"flex",height:5,borderRadius:3,overflow:"hidden",background:`${T.BORDER}`}}>
                    {prompt.layers.map(layer => {
                      const def = PROMPT_LAYERS.find(l => l.id === layer.id);
                      const pct = (layer.tokens / prompt.totalTokens) * 100;
                      return <div key={layer.id} style={{width:`${pct}%`,background:def?.color||"#555",transition:"width 0.3s"}}/>;
                    })}
                  </div>
                  {/* Mini legend under bar */}
                  <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap"}}>
                    {prompt.layers.map(layer => {
                      const def = PROMPT_LAYERS.find(l => l.id === layer.id);
                      return (
                        <span key={layer.id} style={{display:"flex",alignItems:"center",gap:3,fontFamily:M,fontSize:7.5,color:"#555"}}>
                          <span style={{width:6,height:6,borderRadius:2,background:def?.color||"#555",display:"inline-block"}}/>
                          {def?.label?.split(" ")[0] || layer.id}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded: Full layer stack */}
                {paOpen && (
                  <div style={{padding:"0 16px 14px"}}>
                    {/* Expand all toggle */}
                    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
                      <button onClick={(e)=>{e.stopPropagation();toggleAllLayers();}} style={{
                        background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:5,
                        padding:"3px 10px",fontFamily:M,fontSize:8.5,color:"#555",cursor:"pointer",
                      }}>
                        {allExpanded ? "Collapse all" : "Expand all layers"}
                      </button>
                    </div>

                    {/* Layer cards */}
                    <div style={{display:"flex",flexDirection:"column",gap:1,borderRadius:8,overflow:"hidden",border:`1px solid ${T.BORDER}`}}>
                      {prompt.layers.map(layer => {
                        const def = PROMPT_LAYERS.find(l => l.id === layer.id);
                        const isExp = !!paExpanded[layer.id];
                        return (
                          <div key={layer.id}>
                            {/* Layer header row */}
                            <div
                              onClick={(e)=>{e.stopPropagation();toggleLayer(layer.id);}}
                              style={{
                                padding:"9px 12px",cursor:"pointer",
                                background:`${def?.color||"#555"}06`,
                                display:"flex",justifyContent:"space-between",alignItems:"center",
                                borderBottom: isExp ? `1px solid ${def?.color||"#333"}15` : "none",
                                transition:"background 0.15s",
                              }}
                            >
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{width:8,height:8,borderRadius:2,background:def?.color||"#555",flexShrink:0}}/>
                                <span style={{fontFamily:D,fontWeight:600,fontSize:11.5,color:T.TXT}}>{def?.label || layer.id}</span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontFamily:M,fontSize:8.5,color:"#555",background:`${def?.color||"#555"}10`,borderRadius:3,padding:"2px 7px"}}>{layer.items}</span>
                                <span style={{fontFamily:M,fontSize:9,color:"#444"}}>{layer.tokens} tok</span>
                                <span style={{fontFamily:M,fontSize:9,color:"#555",transition:"transform 0.15s",transform:isExp?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
                              </div>
                            </div>

                            {/* Layer expanded content */}
                            {isExp && (
                              <div style={{
                                padding:"10px 12px",
                                background:`${def?.color||"#555"}04`,
                                fontFamily:"'Courier Prime','Courier New',Courier,monospace",
                                fontSize:10.5,lineHeight:1.6,color:"#999",
                                whiteSpace:"pre-wrap",wordBreak:"break-word",
                                maxHeight:280,overflowY:"auto",
                                borderBottom:`1px solid ${T.BORDER}`,
                              }}>
                                {layer.text}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer stats */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                      <span style={{fontFamily:M,fontSize:9,color:"#555"}}>
                        Total: <span style={{color:T.TXT,fontWeight:600}}>{prompt.totalTokens.toLocaleString()} tokens</span> across {prompt.layers.length} constraint layers
                      </span>
                      <span style={{fontFamily:M,fontSize:9,color:T.PURPLE,background:`${T.PURPLE}10`,borderRadius:4,padding:"2px 8px"}}>
                        Prompt Constraint Framework v2
                      </span>
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Generate + Agent Activity Feed */}
            <div style={{marginTop:4}}>
              {/* At-rest agent badge — visible when not generating and no active generation */}
              {!videoGenerating && !genLog && (activeScene.status === "locked" || activeScene.status === "generated") && sbAllApproved && (() => {
                const cf = getCarryForward(activeScene);
                return (
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 12px",background:`${T.GOLD}04`,border:`1px solid ${T.GOLD}10`,borderRadius:6}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.GREEN,boxShadow:`0 0 6px ${T.GREEN}50`}}/>
                    <span style={{fontFamily:M,fontSize:8.5,color:"#666"}}>
                      {AGENT_ROSTER.length} agents ready · {cf.constraintCount} constraints active · Storyboard: {sbTotalCount} panels approved
                    </span>
                  </div>
                );
              })()}

              {/* Completed generation log badge */}
              {!videoGenerating && genLog && genLog.sceneId === activeScene.id && (
                <div style={{background:`${T.GREEN}04`,border:`1px solid ${T.GREEN}15`,borderRadius:8,padding:10,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:T.GREEN,boxShadow:`0 0 6px ${T.GREEN}40`}}/>
                      <span style={{fontFamily:M,fontSize:9,color:T.GREEN}}>Generation complete</span>
                      <span style={{fontFamily:M,fontSize:8,color:"#555"}}>{genLog.totalTokens.toLocaleString()} tokens · {genLog.constraints} constraints · {genLog.agents.length} agents</span>
                    </div>
                    <button onClick={()=>setGenLog(null)} style={{background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:4,padding:"2px 8px",fontFamily:M,fontSize:8,color:"#555",cursor:"pointer"}}>Dismiss</button>
                  </div>
                </div>
              )}

              {/* Active generation: Agent Activity Feed */}
              {videoGenerating === activeScene.id && (
                <div style={{background:T.CARD,border:`1px solid ${T.GOLD}20`,borderRadius:10,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:ACCENT}}/>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${T.GOLD}`,borderTopColor:"transparent",animation:"afspin 0.7s linear infinite"}}/>
                    <span style={{fontFamily:D,fontWeight:700,fontSize:13,color:T.GOLD}}>Generating Scene {activeScene.number}</span>
                    <span style={{fontFamily:M,fontSize:8,color:"#555"}}>{agentFeed.filter(a=>a.status==="done").length}/{AGENT_ROSTER.length} agents complete</span>
                  </div>

                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {AGENT_ROSTER.map(agent => {
                      const entry = agentFeed.find(a => a.agentId === agent.id);
                      const status = entry?.status || "waiting";
                      return (
                        <div key={agent.id} style={{
                          display:"flex",alignItems:"center",gap:10,padding:"7px 10px",
                          borderRadius:6,background:status==="done"?`${agent.color}04`:status==="working"?`${agent.color}08`:"transparent",
                          transition:"all 0.3s",opacity:status==="waiting"?0.35:1,
                        }}>
                          {/* Status indicator */}
                          <div style={{width:16,height:16,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {status === "waiting" && <div style={{width:6,height:6,borderRadius:"50%",background:"#333"}}/>}
                            {status === "working" && <div style={{width:10,height:10,borderRadius:"50%",border:`1.5px solid ${agent.color}`,borderTopColor:"transparent",animation:"afspin 0.7s linear infinite"}}/>}
                            {status === "done" && <div style={{width:14,height:14,borderRadius:"50%",background:`${agent.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:M,fontSize:8,color:agent.color}}>✓</div>}
                          </div>

                          {/* Agent name */}
                          <div style={{width:130,flexShrink:0}}>
                            <span style={{fontFamily:D,fontWeight:600,fontSize:11,color:status==="waiting"?"#444":agent.color}}>{agent.name}</span>
                          </div>

                          {/* Detail */}
                          <div style={{flex:1,fontFamily:M,fontSize:8.5,color:status==="done"?"#777":status==="working"?"#999":"#333",lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {status === "waiting" ? agent.role : entry?.detail || ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div style={{marginTop:12,height:3,borderRadius:2,background:`${T.BORDER}`,overflow:"hidden"}}>
                    <div style={{height:"100%",background:ACCENT,borderRadius:2,transition:"width 0.5s ease",width:`${Math.round((agentFeed.filter(a=>a.status==="done").length / AGENT_ROSTER.length) * 100)}%`}}/>
                  </div>
                </div>
              )}

              {/* Button row */}
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",alignItems:"center"}}>
                {(activeScene.status === "locked" || activeScene.status === "generated") && activeStoryboard && !sbAllApproved && (
                  <span style={{fontFamily:M,fontSize:9,color:T.ORANGE,marginRight:8}}>🎞️ Approve all storyboard panels first</span>
                )}
                {(activeScene.status === "locked" || activeScene.status === "generated") && !activeStoryboard && (
                  <span style={{fontFamily:M,fontSize:9,color:T.CYAN,marginRight:8}}>🎞️ Generate storyboard before video</span>
                )}
                <button style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:8,padding:"10px 20px",fontFamily:D,fontWeight:700,fontSize:12,color:"#666",cursor:"pointer"}}>Save Draft</button>
                <button
                  disabled={!(activeScene.status==="locked"||activeScene.status==="generated") || !sbAllApproved || videoGenerating === activeScene.id}
                  onClick={()=>{ if (sbAllApproved && !videoGenerating) generateVideo(activeScene.id); }}
                  style={{
                    background:(activeScene.status==="locked"||activeScene.status==="generated") && sbAllApproved && !videoGenerating?ACCENT:"#222",
                    border:"none",borderRadius:8,padding:"10px 24px",fontFamily:D,fontWeight:700,fontSize:12,
                    color:(activeScene.status==="locked"||activeScene.status==="generated") && sbAllApproved && !videoGenerating?"#000":"#444",
                    cursor:(activeScene.status==="locked"||activeScene.status==="generated") && sbAllApproved && !videoGenerating?"pointer":"not-allowed",
                    boxShadow:(activeScene.status==="locked") && sbAllApproved && !videoGenerating?`0 4px 20px ${T.GOLD}30`:"none",
                    opacity:(activeScene.status==="locked"||activeScene.status==="generated") && sbAllApproved && !videoGenerating?1:0.5,
                  }}>
                  {videoGenerating === activeScene.id ? "⟳ Generating…"
                    : activeScene.status!=="locked" && activeScene.status!=="generated" ? "🔒 Lock script first"
                    : !activeStoryboard ? "🎞️ Generate storyboard first"
                    : !sbAllApproved ? `🎞️ ${sbTotalCount - sbApprovedCount} panel${sbTotalCount-sbApprovedCount!==1?"s":""} need approval`
                    : `Generate Scene ${activeScene.number} →`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            VIEW: CHARACTER BIBLE
            ═══════════════════════════════════════════════ */}
        {view === "characters" && (
          <div>
            <SH icon="👤" title="CHARACTER BIBLE" tip="Full Identity Cards with physical attributes, behavioral signatures, LoRA status, and default wardrobe."/>
            {chars.map(ch => {
              const exp = expandedChar === ch.id;
              const scenesIn = scenes.filter(s => s.chars[ch.id]);
              return (
                <div key={ch.id} style={{background:T.CARD,border:`1px solid ${ch.color}20`,borderRadius:10,overflow:"hidden",marginBottom:10}}>
                  <div onClick={()=>setExpandedChar(exp?null:ch.id)} style={{
                    padding:"12px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
                    background:exp?`${ch.color}06`:"transparent",transition:"background 0.2s",
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:28,height:28,borderRadius:6,background:`${ch.color}15`,border:`1px solid ${ch.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:D,fontWeight:700,fontSize:12,color:ch.color}}>{ch.name[0]}</div>
                      <div>
                        <div style={{fontFamily:D,fontWeight:700,fontSize:13,color:T.TXT}}>{ch.name}</div>
                        <div style={{fontFamily:M,fontSize:9,color:T.DIM,display:"flex",alignItems:"center",gap:6}}>
                          <span>{ch.physical["Age Range"]}</span><span>·</span><span>{ch.physical.Build}</span><span>·</span>
                          <span style={{color:ch.loraRef?T.GREEN:T.RED}}>{ch.loraRef?"LoRA Active":"No LoRA"}</span><span>·</span>
                          <span>{scenesIn.length} scene{scenesIn.length!==1?"s":""}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{color:T.DIM,fontSize:12,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"none"}}>▼</span>
                  </div>
                  {exp && (
                    <div style={{padding:"0 16px 16px"}}>
                      <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.1em",margin:"12px 0 8px",textTransform:"uppercase"}}>Physical Identity Card</div>
                      <div className="cs-g2" style={{gap:6}}>
                        {Object.entries(ch.physical).map(([k,v])=>(
                          <div key={k} style={{background:T.INPUT,borderRadius:6,padding:"8px 10px",border:`1px solid ${T.IBORDER}`}}>
                            <div style={{fontFamily:M,fontSize:8,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:2}}>{k}</div>
                            <div style={{fontFamily:B,fontSize:11.5,color:"#bbb"}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.1em",margin:"14px 0 8px",textTransform:"uppercase"}}>Behavioral Signature</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {ch.mannerisms.map(m2=>(<span key={m2} style={{fontFamily:B,fontSize:10.5,color:ch.color,background:`${ch.color}10`,border:`1px solid ${ch.color}25`,borderRadius:5,padding:"4px 10px"}}>{m2}</span>))}
                      </div>
                      <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.1em",margin:"14px 0 8px",textTransform:"uppercase"}}>Default Wardrobe</div>
                      <div style={{background:T.INPUT,borderRadius:6,padding:"8px 12px",border:`1px solid ${T.IBORDER}`,fontFamily:B,fontSize:11.5,color:"#bbb"}}>{ch.defaultWardrobe||"Not specified"}</div>
                      <div className="cs-g2" style={{gap:10,marginTop:14}}>
                        <div>
                          <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Default Emotion</div>
                          <span style={{fontFamily:B,fontSize:12,color:ch.color,background:`${ch.color}10`,border:`1px solid ${ch.color}25`,borderRadius:5,padding:"4px 12px"}}>{ch.defaultEmotion}</span>
                        </div>
                        <div>
                          <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"}}>Consistency Anchor</div>
                          <div style={{background:ch.loraRef?`${T.GREEN}08`:`${T.RED}08`,border:`1px solid ${ch.loraRef?T.GREEN:T.RED}20`,borderRadius:7,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:14}}>{ch.loraRef?"🔗":"⚠️"}</span>
                            <div>
                              <div style={{fontFamily:M,fontSize:9.5,color:ch.loraRef?T.GREEN:T.RED,fontWeight:600}}>{ch.loraRef?"LoRA ADAPTER TRAINED":"NO LoRA — REDUCED CONSISTENCY"}</div>
                              <div style={{fontFamily:B,fontSize:10,color:"#666",marginTop:2}}>{ch.loraRef?"Face, build, and features locked across all scenes.":"Upload references to train LoRA."}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {scenesIn.length >= 2 && (
                        <div style={{marginTop:14}}>
                          <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.1em",marginBottom:4,textTransform:"uppercase"}}>Emotion Arc</div>
                          <EmotionArc charId={ch.id} scenes={scenes} color={ch.color}/>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            VIEW: CONTINUITY TRACKER
            ═══════════════════════════════════════════════ */}
        {view === "continuity" && (
          <div>
            <div className="cs-g4" style={{gap:8,marginBottom:16}}>
              {[
                {label:"Scenes",value:scenes.length,color:T.GOLD},
                {label:"Characters",value:chars.length,color:T.CYAN},
                {label:"Issues",value:totalIssues,color:totalIssues>0?T.RED:T.GREEN},
                {label:"Validated",value:`${scenes.filter(s=>s.validated).length}/${scenes.length}`,color:T.GREEN},
              ].map(m2=>(
                <div key={m2.label} style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
                  <div style={{fontFamily:D,fontWeight:700,fontSize:22,color:m2.color}}>{m2.value}</div>
                  <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.1em",textTransform:"uppercase"}}>{m2.label}</div>
                </div>
              ))}
            </div>

            {/* Emotion Arcs */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH icon="📈" title="EMOTION ARCS"/>
              {chars.map(ch => {
                const scenesWithChar = scenes.filter(s=>s.chars[ch.id]);
                if(scenesWithChar.length<2) return null;
                return (
                  <div key={ch.id} style={{marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:ch.color}}/>
                      <span style={{fontFamily:D,fontWeight:700,fontSize:13,color:ch.color}}>{ch.name}</span>
                      <span style={{fontFamily:M,fontSize:9,color:T.DIM}}>· {scenesWithChar.length} scenes</span>
                    </div>
                    <EmotionArc charId={ch.id} scenes={scenes} color={ch.color}/>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:2}}>
                      {scenesWithChar.map((s,i)=>{
                        const emo = s.chars[ch.id].emotion;
                        const prevEmo = i>0?scenesWithChar[i-1].chars[ch.id].emotion:null;
                        const jump = prevEmo && Math.abs((emotionIntensity[emo]||5)-(emotionIntensity[prevEmo]||5))>4;
                        return (
                          <div key={s.id} style={{display:"flex",alignItems:"center",gap:3}}>
                            {i>0&&<span style={{fontFamily:M,fontSize:10,color:jump?T.RED:"#333"}}>{jump?"⚡":"→"}</span>}
                            <span style={{fontFamily:M,fontSize:9,padding:"2px 7px",borderRadius:3,background:jump?`${T.RED}10`:`${ch.color}08`,border:`1px solid ${jump?T.RED+"30":ch.color+"20"}`,color:jump?T.RED:ch.color}}>S{s.number}: {emo}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ═══ SCENE GRAPH — Character State Threading ═══ */}
            <div style={{background:T.CARD,border:`1px solid ${T.TEAL}12`,borderRadius:10,padding:16,marginBottom:14,overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${T.TEAL},${T.TEAL}40,transparent)`}}/>
              <SH icon="🔗" title="SCENE GRAPH" tip="Character state threading across scenes. Each row is a character, each column is a scene. Nodes show emotion state; edge color shows continuity status (green = consistent, orange = intentional override, red = flagged discontinuity). Click any node to jump to that scene."/>

              <div style={{overflowX:"auto",paddingBottom:8}}>
                {/* Scene column headers */}
                <div style={{display:"flex",alignItems:"center",marginBottom:4,paddingLeft:100}}>
                  {scenes.map(s => (
                    <div key={s.id} style={{minWidth:110,textAlign:"center",fontFamily:M,fontSize:8.5,color:s.id===activeSceneId?T.GOLD:"#555",letterSpacing:"0.06em",fontWeight:s.id===activeSceneId?700:400}}>
                      S{s.number} · {s.title.length > 12 ? s.title.slice(0,12)+"…" : s.title}
                    </div>
                  ))}
                </div>

                {/* Character swim lanes */}
                {chars.map(ch => {
                  const charScenes = scenes.map(s => ({scene: s, state: s.chars[ch.id] || null}));
                  const hasAnyAppearance = charScenes.some(cs => cs.state);
                  if (!hasAnyAppearance) return null;

                  return (
                    <div key={ch.id} style={{display:"flex",alignItems:"center",marginBottom:2,minHeight:40}}>
                      {/* Character label */}
                      <div style={{width:100,flexShrink:0,display:"flex",alignItems:"center",gap:6,paddingRight:8}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:ch.color,flexShrink:0}}/>
                        <span style={{fontFamily:D,fontWeight:600,fontSize:11,color:ch.color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.name}</span>
                      </div>

                      {/* Scene nodes with connecting edges */}
                      <div style={{display:"flex",alignItems:"center",flex:1}}>
                        {charScenes.map((cs, si) => {
                          const prev = si > 0 ? charScenes.slice(0,si).reverse().find(p => p.state) : null;
                          let edgeColor = "transparent";
                          let edgeStyle = "solid";
                          if (cs.state && prev?.state) {
                            const emoGap = Math.abs((emotionIntensity[cs.state.emotion]||5) - (emotionIntensity[prev.state.emotion]||5));
                            const hasOverride = cs.state.wardrobeOverride || cs.state.mannerismOverride;
                            if (emoGap > 4) { edgeColor = T.RED; edgeStyle = "dashed"; }
                            else if (hasOverride) edgeColor = T.ORANGE;
                            else edgeColor = T.GREEN;
                          }

                          return (
                            <div key={cs.scene.id} style={{minWidth:110,display:"flex",alignItems:"center",position:"relative"}}>
                              {/* Edge from previous node */}
                              {prev?.state && cs.state && (
                                <div style={{position:"absolute",left:0,right:"50%",top:"50%",height:0,borderTop:`1.5px ${edgeStyle} ${edgeColor}50`,zIndex:0}}/>
                              )}
                              {/* Edge continuing to next (drawn from previous cell) */}
                              {cs.state && si > 0 && prev?.state && (
                                <div style={{position:"absolute",left:"-50%",right:"50%",top:"50%",height:0,borderTop:`1.5px ${edgeStyle} ${edgeColor}50`,zIndex:0}}/>
                              )}

                              {/* Node */}
                              <div style={{margin:"0 auto",position:"relative",zIndex:1}}>
                                {cs.state ? (
                                  <div
                                    onClick={()=>{setActiveSceneId(cs.scene.id);setView("console");}}
                                    style={{
                                      background:cs.scene.id===activeSceneId?`${ch.color}20`:`${ch.color}08`,
                                      border:`1.5px solid ${cs.scene.id===activeSceneId?ch.color:ch.color+"40"}`,
                                      borderRadius:6,padding:"4px 10px",cursor:"pointer",textAlign:"center",
                                      minWidth:72,transition:"all 0.15s",
                                      boxShadow:cs.scene.id===activeSceneId?`0 0 8px ${ch.color}20`:"none",
                                    }}
                                  >
                                    <div style={{fontFamily:M,fontSize:8.5,color:ch.color,fontWeight:500}}>{cs.state.emotion}</div>
                                    <div style={{display:"flex",justifyContent:"center",gap:3,marginTop:2}}>
                                      {cs.state.wardrobeOverride && <span style={{fontFamily:M,fontSize:6.5,color:T.ORANGE}}>👔</span>}
                                      {cs.state.mannerismOverride && <span style={{fontFamily:M,fontSize:6.5,color:T.PURPLE}}>✦</span>}
                                      {cs.state.continuityNotes && <span style={{fontFamily:M,fontSize:6.5,color:"#555"}}>📝</span>}
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{width:8,height:8,borderRadius:"50%",background:`${T.BORDER}`,margin:"0 auto"}}/>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Legend */}
                <div style={{display:"flex",gap:14,marginTop:10,paddingLeft:100,flexWrap:"wrap"}}>
                  {[
                    {color:T.GREEN,label:"Consistent",style:"solid"},
                    {color:T.ORANGE,label:"Intentional override",style:"solid"},
                    {color:T.RED,label:"Flagged discontinuity",style:"dashed"},
                  ].map(l=>(
                    <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:20,height:0,borderTop:`2px ${l.style} ${l.color}`,flexShrink:0}}/>
                      <span style={{fontFamily:M,fontSize:8,color:"#555"}}>{l.label}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <span style={{fontSize:8}}>👔</span><span style={{fontFamily:M,fontSize:8,color:"#555"}}>Wardrobe change</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <span style={{fontFamily:M,fontSize:8,color:T.PURPLE}}>✦</span><span style={{fontFamily:M,fontSize:8,color:"#555"}}>Mannerism override</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Matrix */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH icon="📊" title="VALIDATION MATRIX"/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:M,fontSize:10}}>
                  <thead>
                    <tr>
                      <th style={{textAlign:"left",padding:"8px 12px",color:"#444",borderBottom:`1px solid ${T.BORDER}`,fontSize:9}}>CHARACTER</th>
                      {scenes.map(s=><th key={s.id} style={{textAlign:"center",padding:"8px 10px",color:"#444",borderBottom:`1px solid ${T.BORDER}`,fontSize:9,minWidth:80,cursor:"pointer"}} onClick={()=>{setActiveSceneId(s.id);setView("console");}}>S{s.number}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {chars.map(ch=>(
                      <tr key={ch.id}>
                        <td style={{padding:"8px 12px",borderBottom:`1px solid ${T.BORDER}08`,color:ch.color,fontWeight:600}}>{ch.name}</td>
                        {scenes.map(s=>{
                          const inScene = s.chars[ch.id];
                          if(!inScene) return <td key={s.id} style={{textAlign:"center",padding:"8px 10px",borderBottom:`1px solid ${T.BORDER}08`,color:"#222"}}>—</td>;
                          const hasOverride = inScene.wardrobeOverride || inScene.mannerismOverride;
                          const hasIssue = !s.validated;
                          const bg = hasIssue?`${T.RED}10`:hasOverride?`${T.ORANGE}10`:`${T.GREEN}08`;
                          const clr = hasIssue?T.RED:hasOverride?T.ORANGE:T.GREEN;
                          const sym = hasIssue?"⚠":hasOverride?"△":"✓";
                          return (
                            <td key={s.id} style={{textAlign:"center",padding:"8px 10px",borderBottom:`1px solid ${T.BORDER}08`,cursor:"pointer"}} onClick={()=>{setActiveSceneId(s.id);setView("console");}}>
                              <span style={{background:bg,color:clr,borderRadius:4,padding:"3px 8px",fontSize:9.5}}>{sym} {inScene.emotion}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{display:"flex",gap:16,marginTop:10,fontFamily:M,fontSize:9,color:"#444"}}>
                <span><span style={{color:T.GREEN}}>✓</span> Consistent</span>
                <span><span style={{color:T.ORANGE}}>△</span> Intentional Override</span>
                <span><span style={{color:T.RED}}>⚠</span> Unvalidated</span>
              </div>
            </div>

            {/* Camera Continuity */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16,marginBottom:14}}>
              <SH icon="🎥" title="CAMERA CONTINUITY"/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:M,fontSize:10}}>
                  <thead>
                    <tr>
                      <th style={{textAlign:"left",padding:"8px 12px",color:"#444",borderBottom:`1px solid ${T.BORDER}`,fontSize:9}}>PARAMETER</th>
                      <th style={{textAlign:"left",padding:"8px 10px",color:T.PURPLE,borderBottom:`1px solid ${T.BORDER}`,fontSize:9}}>BIBLE</th>
                      {scenes.map(s=><th key={s.id} style={{textAlign:"center",padding:"8px 10px",color:"#444",borderBottom:`1px solid ${T.BORDER}`,fontSize:9}}>S{s.number}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {["shotType","movement","lighting","atmosphere"].map(field=>(
                      <tr key={field}>
                        <td style={{padding:"8px 12px",borderBottom:`1px solid ${T.BORDER}08`,color:"#666",textTransform:"uppercase",fontSize:8.5,letterSpacing:"0.05em"}}>{field.replace(/([A-Z])/g," $1").trim()}</td>
                        <td style={{padding:"8px 10px",borderBottom:`1px solid ${T.BORDER}08`,color:T.PURPLE,fontSize:9.5}}>—</td>
                        {scenes.map(s=>{
                          const val = s.camera?.[field]||"—";
                          return <td key={s.id} style={{textAlign:"center",padding:"8px 10px",borderBottom:`1px solid ${T.BORDER}08`,color:"#999",fontSize:9.5}}>{val}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pipeline */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:16}}>
              <SH icon="⚙️" title="VALIDATION PIPELINE"/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {step:"1",label:"Screenplay Lock Verification",desc:"Confirms scene script is in LOCKED status before any generation is attempted. Draft scenes are blocked from the pipeline."},
                  {step:"2",label:"Identity Card Extraction",desc:"Character physical attributes, behavioral signatures, and LoRA status pulled from unified Character Bible."},
                  {step:"3",label:"Scene State Composition",desc:"Per-character emotion, wardrobe, blocking, dialogue, and mannerism overrides compiled from scene editor."},
                  {step:"4",label:"Production Bible Enforcement",desc:"Genre, era, color grade, camera body, lens, and film stock validated against project-level creative direction."},
                  {step:"5",label:"Prompt Assembly",desc:"6 constraint layers merged into generation prompt — visible in real-time via the Prompt Assembly Preview in the Scene Console. Layers: screenplay text, character identity, camera config, continuity state, Production Bible, validation criteria."},
                  {step:"6",label:"Storyboard Generation",desc:"Storyboard Agent analyzes locked screenplay to produce 4-8 visual panels per scene. Panels must be approved before video generation proceeds."},
                  {step:"7",label:"Post-generation Validation",desc:"Continuity Checker compares output against Identity Card using embedding similarity + structured validation."},
                  {step:"8",label:"Issue Flagging",desc:"Any consistency deviation flagged with suggested fixes before the scene is shown to the user."},
                ].map(s=>(
                  <div key={s.step} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:22,height:22,borderRadius:5,background:`${T.GOLD}10`,border:`1px solid ${T.GOLD}25`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:M,fontSize:9,color:T.GOLD,fontWeight:700,flexShrink:0}}>{s.step}</div>
                    <div>
                      <div style={{fontFamily:D,fontSize:12,fontWeight:600,color:T.TXT}}>{s.label}</div>
                      <div style={{fontFamily:B,fontSize:11,color:"#666",lineHeight:1.5}}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            VIEW: REVIEW INTERFACE — PRD §3.2
            Post-generation video review, storyboard comparison,
            validation results, script sync, and annotation tools
            ═══════════════════════════════════════════════════════════════ */}
        {view === "review" && (() => {
          const rScene = reviewSceneId ? scenes.find(s => s.id === reviewSceneId) : scenes.find(s => s.takes?.length > 0);
          if (!rScene || !rScene.takes?.length) return (
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:40,marginBottom:14,opacity:0.3}}>🎥</div>
              <div style={{fontFamily:D,fontWeight:700,fontSize:16,color:"#555",marginBottom:8}}>No Generated Takes</div>
              <div style={{fontFamily:B,fontSize:12,color:"#444",marginBottom:16}}>Generate a scene from the Console to begin reviewing output.</div>
              <button onClick={()=>setView("console")} style={{background:`${T.GOLD}12`,border:`1px solid ${T.GOLD}30`,borderRadius:6,padding:"8px 18px",fontFamily:D,fontWeight:700,fontSize:12,color:T.GOLD,cursor:"pointer"}}>Go to Console →</button>
            </div>
          );
          const activeTake = rScene.takes[rScene.takes.length - 1]; // latest take
          const sp = rScene.screenplay;
          const duration = sp?.duration || 30;
          const currentTime = (playhead / 100) * duration;
          const sceneChars = Object.entries(rScene.chars);
          const panels = rScene.storyboard?.panels || [];
          const activePanelIdx = Math.min(Math.floor((playhead / 100) * panels.length), panels.length - 1);
          const cf = getCarryForward(rScene);
          const val = activeTake.validation;

          // Find which dialogue block the playhead is in
          const dBlocks = sp?.dialogueBlocks || [];
          const blockDuration = duration / Math.max(dBlocks.length + 1, 1);
          const activeBlockIdx = Math.min(Math.floor(currentTime / blockDuration), dBlocks.length);

          return (
          <div>
            {/* Scene selector bar */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={()=>{setView("console");setActiveSceneId(rScene.id);}} style={{background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"6px 12px",fontFamily:M,fontSize:9,color:"#666",cursor:"pointer"}}>← Console</button>
                <span style={{fontFamily:D,fontWeight:700,fontSize:16,color:T.TXT}}>Scene {rScene.number}: {rScene.title}</span>
                <span style={{fontFamily:M,fontSize:9,color:T.GREEN,background:`${T.GREEN}10`,border:`1px solid ${T.GREEN}25`,borderRadius:4,padding:"2px 8px"}}>Take {rScene.takes.length}</span>
              </div>
              <div style={{display:"flex",gap:6}}>
                {scenes.filter(s => s.takes?.length > 0).map(s => (
                  <button key={s.id} onClick={()=>{setReviewSceneId(s.id);setPlayhead(0);setFrameNotes(activeTake.annotations||[]);}} style={{
                    background:s.id===rScene.id?`${T.GOLD}10`:"transparent",border:`1px solid ${s.id===rScene.id?T.GOLD+"35":T.IBORDER}`,
                    borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:s.id===rScene.id?T.GOLD:"#555",cursor:"pointer",
                  }}>S{s.number}</button>
                ))}
              </div>
            </div>

            {/* Main layout: Player (left) | Context (right) */}
            <div className="cs-overlay-split" style={{gap:14,marginBottom:14}}>

              {/* ═══ LEFT: Video Player ═══ */}
              <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,overflow:"hidden"}}>
                {/* 16:9 video frame */}
                <div style={{width:"100%",aspectRatio:"16/9",background:"#030308",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {/* Simulated video frame with scene data */}
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${T.DARK}00 0%,${rScene.camera?.lighting==="Neon Noir"?T.CYAN+"08":T.GOLD+"06"} 50%,${T.DARK}00 100%)`}}/>
                  <div style={{textAlign:"center",position:"relative",zIndex:1}}>
                    <div style={{fontFamily:D,fontWeight:700,fontSize:20,color:`${T.TXT}30`,letterSpacing:"0.08em",marginBottom:4}}>SCENE {rScene.number}</div>
                    <div style={{fontFamily:B,fontSize:12,color:"#333"}}>{rScene.camera?.shotType} · {rScene.camera?.lighting}</div>
                    <div style={{fontFamily:M,fontSize:10,color:"#222",marginTop:4}}>{currentTime.toFixed(1)}s / {duration}s</div>
                  </div>

                  {/* Playhead timecode overlay */}
                  <div style={{position:"absolute",bottom:8,left:12,fontFamily:M,fontSize:10,color:`${T.TXT}60`,background:"#000A",borderRadius:4,padding:"2px 8px"}}>
                    {Math.floor(currentTime/60).toString().padStart(2,"0")}:{Math.floor(currentTime%60).toString().padStart(2,"0")}.{Math.floor((currentTime%1)*10)}
                  </div>
                  <div style={{position:"absolute",bottom:8,right:12,fontFamily:M,fontSize:9,color:"#555",background:"#000A",borderRadius:4,padding:"2px 8px"}}>
                    {activeTake.resolution} · {playSpeed}x
                  </div>

                  {/* Annotation markers on frame */}
                  {(activeTake.annotations||[]).filter(a => Math.abs(a.time - playhead) < 5).map(a => (
                    <div key={a.id} style={{position:"absolute",top:10,right:10,background:`${T.ORANGE}20`,border:`1px solid ${T.ORANGE}40`,borderRadius:6,padding:"4px 8px",fontFamily:M,fontSize:8,color:T.ORANGE,maxWidth:180}}>
                      {a.text.length > 50 ? a.text.slice(0,50)+"…" : a.text}
                    </div>
                  ))}
                </div>

                {/* Playback controls */}
                <div style={{padding:"10px 14px",borderTop:`1px solid ${T.BORDER}`}}>
                  {/* Timeline scrubber with panel markers */}
                  <div style={{position:"relative",marginBottom:8}}>
                    <input type="range" min="0" max="100" value={playhead} onChange={e => setPlayhead(+e.target.value)}
                      style={{width:"100%",accentColor:T.GOLD,height:4,cursor:"pointer"}}/>
                    {/* Panel markers on scrubber */}
                    <div style={{position:"absolute",top:12,left:0,right:0,display:"flex",justifyContent:"space-between",pointerEvents:"none"}}>
                      {panels.map((p, pi) => {
                        const pos = panels.length > 1 ? (pi / (panels.length - 1)) * 100 : 50;
                        return <div key={p.id} style={{position:"absolute",left:`${pos}%`,transform:"translateX(-50%)",width:1,height:6,background:`${T.CYAN}40`}}/>;
                      })}
                    </div>
                    {/* Annotation markers on scrubber */}
                    {(activeTake.annotations||[]).map(a => (
                      <div key={a.id} style={{position:"absolute",top:0,left:`${a.time}%`,transform:"translateX(-50%)",width:6,height:6,borderRadius:"50%",background:a.resolved?T.GREEN:T.ORANGE,border:"1px solid #000",cursor:"pointer"}}
                        onClick={()=>setPlayhead(a.time)}/>
                    ))}
                  </div>

                  {/* Controls row */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button onClick={()=>setIsPlaying(!isPlaying)} style={{background:`${T.GOLD}12`,border:`1px solid ${T.GOLD}30`,borderRadius:6,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:M,fontSize:14,color:T.GOLD}}>
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                      <button onClick={()=>setPlayhead(0)} style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"4px 8px",fontFamily:M,fontSize:9,color:"#555",cursor:"pointer"}}>⏮</button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      {[0.25, 0.5, 1, 1.5, 2].map(s => (
                        <button key={s} onClick={()=>setPlaySpeed(s)} style={{
                          background:playSpeed===s?`${T.GOLD}15`:T.INPUT,
                          border:`1px solid ${playSpeed===s?T.GOLD+"35":T.IBORDER}`,
                          borderRadius:4,padding:"3px 7px",fontFamily:M,fontSize:8,
                          color:playSpeed===s?T.GOLD:"#555",cursor:"pointer",
                        }}>{s}x</button>
                      ))}
                    </div>
                    <div style={{fontFamily:M,fontSize:9,color:"#555"}}>
                      Frame {Math.floor(playhead * 0.3)} / {Math.floor(100 * 0.3)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ RIGHT: Context Panel ═══ */}
              <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column"}}>
                {/* Sub-tab bar */}
                <div style={{display:"flex",borderBottom:`1px solid ${T.BORDER}`}}>
                  {[
                    {id:"comparison",label:"Storyboard"},
                    {id:"validation",label:"Validation"},
                    {id:"script",label:"Script Sync"},
                  ].map(t => (
                    <button key={t.id} onClick={()=>setReviewTab(t.id)} style={{
                      flex:1,padding:"10px 8px",background:reviewTab===t.id?`${T.GOLD}08`:"transparent",
                      border:"none",borderBottom:reviewTab===t.id?`2px solid ${T.GOLD}`:"2px solid transparent",
                      fontFamily:D,fontWeight:reviewTab===t.id?700:400,fontSize:11,
                      color:reviewTab===t.id?T.GOLD:"#555",cursor:"pointer",
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* Sub-tab content */}
                <div style={{flex:1,padding:14,overflowY:"auto"}}>

                  {/* TAB: Storyboard Comparison */}
                  {reviewTab === "comparison" && (
                    <div>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Panel {activePanelIdx + 1} of {panels.length || "—"}</div>
                      {panels.length > 0 ? (
                        <div>
                          {/* Storyboard panel */}
                          <div style={{background:`${T.CYAN}04`,border:`1px solid ${T.CYAN}15`,borderRadius:8,padding:10,marginBottom:8}}>
                            <div style={{fontFamily:M,fontSize:8,color:T.CYAN,marginBottom:4}}>STORYBOARD REF</div>
                            <div style={{width:"100%",aspectRatio:"16/9",background:`${T.CYAN}06`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
                              <span style={{fontFamily:M,fontSize:10,color:`${T.CYAN}40`}}>{panels[activePanelIdx]?.composition?.split("—")[0] || "Panel"}</span>
                            </div>
                            <div style={{fontFamily:B,fontSize:10,color:"#777",lineHeight:1.5}}>{panels[activePanelIdx]?.scriptRef || "—"}</div>
                          </div>
                          {/* Generated frame */}
                          <div style={{background:`${T.GOLD}04`,border:`1px solid ${T.GOLD}15`,borderRadius:8,padding:10}}>
                            <div style={{fontFamily:M,fontSize:8,color:T.GOLD,marginBottom:4}}>GENERATED FRAME</div>
                            <div style={{width:"100%",aspectRatio:"16/9",background:`${T.GOLD}06`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
                              <span style={{fontFamily:M,fontSize:10,color:`${T.GOLD}40`}}>Frame @ {currentTime.toFixed(1)}s</span>
                            </div>
                            <div style={{fontFamily:M,fontSize:9,color:"#555"}}>
                              {rScene.camera?.shotType} · {rScene.camera?.movement?.split("—")[0]?.trim()}
                            </div>
                          </div>
                          {/* Panel filmstrip */}
                          <div style={{display:"flex",gap:4,marginTop:8,overflowX:"auto"}}>
                            {panels.map((p, pi) => (
                              <div key={p.id} onClick={()=>setPlayhead((pi / Math.max(panels.length - 1, 1)) * 100)}
                                style={{
                                  minWidth:48,height:28,borderRadius:4,cursor:"pointer",
                                  background:pi===activePanelIdx?`${T.CYAN}15`:`${T.CYAN}04`,
                                  border:`1px solid ${pi===activePanelIdx?T.CYAN+"50":T.CYAN+"15"}`,
                                  display:"flex",alignItems:"center",justifyContent:"center",
                                  fontFamily:M,fontSize:7,color:pi===activePanelIdx?T.CYAN:"#444",
                                }}>P{pi+1}</div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{fontFamily:B,fontSize:11,color:"#444",fontStyle:"italic"}}>No storyboard panels for comparison</div>
                      )}
                    </div>
                  )}

                  {/* TAB: Validation Results */}
                  {reviewTab === "validation" && (
                    <div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                        <span style={{fontFamily:D,fontWeight:700,fontSize:13,color:val.passCount === val.totalChecks ? T.GREEN : T.ORANGE}}>
                          {val.passCount}/{val.totalChecks} Checks Passed
                        </span>
                        <span style={{fontFamily:M,fontSize:8,color:val.passCount===val.totalChecks?T.GREEN:T.ORANGE,background:val.passCount===val.totalChecks?`${T.GREEN}10`:`${T.ORANGE}10`,borderRadius:4,padding:"2px 8px"}}>
                          {val.passCount === val.totalChecks ? "CLEAR" : "REVIEW"}
                        </span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        {[
                          {label:"LoRA Similarity",pass:val.loraSimilarity >= 0.85,detail:`${val.loraSimilarity} (threshold: 0.85)`},
                          {label:"Wardrobe Match",pass:val.wardrobeMatch,detail:val.wardrobeMatch?"Color histogram verified":"Mismatch detected"},
                          {label:"Aspect Ratio",pass:val.aspectRatio,detail:val.aspectRatio?`${bible.aspectRatio} compliant`:"Non-compliant"},
                          {label:"Color Grade",pass:val.colorGrade,detail:val.colorGrade?`${bible.colorGrade} applied`:"Grade mismatch"},
                          {label:"Character Count",pass:true,detail:`${val.characterCount} character${val.characterCount!==1?"s":""} detected`},
                          {label:"Blocking Accuracy",pass:val.blockingAccuracy,detail:val.blockingAccuracy?"Positions match stage directions":"Position deviation detected"},
                          {label:"Temporal Continuity",pass:val.temporalContinuity,detail:val.temporalContinuity?"No phantom items":"Item inconsistency detected"},
                          {label:"Duration",pass:Math.abs(val.durationAccuracy - duration) <= 2,detail:`${val.durationAccuracy}s (target: ${duration}s ±2s)`},
                        ].map(check => (
                          <div key={check.label} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",background:check.pass?`${T.GREEN}04`:`${T.RED}04`,borderRadius:5,border:`1px solid ${check.pass?T.GREEN+"12":T.RED+"12"}`}}>
                            <div style={{width:16,height:16,borderRadius:"50%",background:check.pass?`${T.GREEN}15`:`${T.RED}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <span style={{fontFamily:M,fontSize:9,color:check.pass?T.GREEN:T.RED}}>{check.pass?"✓":"✗"}</span>
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontFamily:D,fontWeight:600,fontSize:11,color:check.pass?T.GREEN:T.RED}}>{check.label}</div>
                              <div style={{fontFamily:M,fontSize:8.5,color:"#555"}}>{check.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Generation metadata */}
                      <div style={{marginTop:12,padding:10,background:`${T.PURPLE}04`,border:`1px solid ${T.PURPLE}12`,borderRadius:6}}>
                        <div style={{fontFamily:M,fontSize:8,color:T.PURPLE,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Generation Metadata</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontFamily:M,fontSize:9,color:"#666"}}>
                          <span>Tokens: {activeTake.tokens.toLocaleString()}</span>
                          <span>Constraints: {activeTake.constraints}</span>
                          <span>Resolution: {activeTake.resolution}</span>
                          <span>Duration: {activeTake.duration}s</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: Script Sync */}
                  {reviewTab === "script" && (
                    <div>
                      {/* Action text */}
                      <div style={{marginBottom:12}}>
                        <div style={{fontFamily:M,fontSize:8,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:5}}>Action</div>
                        <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:11,color:activeBlockIdx===0?"#ccc":"#555",lineHeight:1.7,
                          background:activeBlockIdx===0?`${T.GOLD}06`:"transparent",borderRadius:6,padding:activeBlockIdx===0?"8px 10px":"0 10px",
                          borderLeft:activeBlockIdx===0?`2px solid ${T.GOLD}40`:"2px solid transparent",transition:"all 0.3s",
                        }}>
                          {sp?.action || "—"}
                        </div>
                      </div>
                      {/* Dialogue blocks */}
                      {dBlocks.map((db, di) => {
                        const ch = chars.find(c => c.id === db.charId);
                        const isActive = activeBlockIdx === di + 1;
                        return (
                          <div key={di} style={{
                            marginBottom:8,padding:"8px 10px",borderRadius:6,
                            background:isActive?`${ch?.color||T.CYAN}06`:"transparent",
                            borderLeft:`2px solid ${isActive?ch?.color||T.CYAN+"60":"transparent"}`,
                            transition:"all 0.3s",
                          }}>
                            <div style={{fontFamily:M,fontSize:9,color:ch?.color||T.CYAN,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:2}}>{ch?.name||"?"}</div>
                            {db.parenthetical && <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:10,color:"#666",fontStyle:"italic",marginBottom:2}}>({db.parenthetical})</div>}
                            <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:11,color:isActive?"#ccc":"#666",lineHeight:1.6}}>"{db.line}"</div>
                          </div>
                        );
                      })}
                      {/* Transition */}
                      {sp?.transition && (
                        <div style={{textAlign:"right",fontFamily:M,fontSize:9,color:"#444",marginTop:8,letterSpacing:"0.04em"}}>{sp.transition}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ═══ ANNOTATIONS BAR ═══ */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:D,fontWeight:400,fontSize:13,color:T.TXT,letterSpacing:"0.03em"}}>Annotations</span>
                  <span style={{fontFamily:M,fontSize:8,color:T.ORANGE,background:`${T.ORANGE}10`,borderRadius:3,padding:"2px 7px"}}>
                    {(activeTake.annotations||[]).filter(a=>!a.resolved).length} open
                  </span>
                </div>
                <span style={{fontFamily:M,fontSize:8.5,color:"#444"}}>Timecode: {currentTime.toFixed(1)}s</span>
              </div>

              {/* Add annotation */}
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input value={noteInput} onChange={e=>setNoteInput(e.target.value)}
                  placeholder={`Add note at ${currentTime.toFixed(1)}s...`}
                  onKeyDown={e => {
                    if (e.key === "Enter" && noteInput.trim()) {
                      const newAnn = {id:`ann_${Date.now()}`, time: playhead, text: noteInput.trim(), resolved: false};
                      setScenes(prev => prev.map(s => s.id !== rScene.id ? s : {
                        ...s,
                        takes: s.takes.map((t, ti) => ti === s.takes.length - 1 ? {...t, annotations:[...(t.annotations||[]), newAnn]} : t),
                      }));
                      setNoteInput("");
                    }
                  }}
                  style={{flex:1,background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 12px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none"}}
                />
                <button onClick={() => {
                  if (!noteInput.trim()) return;
                  const newAnn = {id:`ann_${Date.now()}`, time: playhead, text: noteInput.trim(), resolved: false};
                  setScenes(prev => prev.map(s => s.id !== rScene.id ? s : {
                    ...s,
                    takes: s.takes.map((t, ti) => ti === s.takes.length - 1 ? {...t, annotations:[...(t.annotations||[]), newAnn]} : t),
                  }));
                  setNoteInput("");
                }} style={{background:`${T.ORANGE}12`,border:`1px solid ${T.ORANGE}30`,borderRadius:6,padding:"8px 14px",fontFamily:M,fontSize:9,color:T.ORANGE,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>
                  + Add Note
                </button>
              </div>

              {/* Annotation list */}
              {(activeTake.annotations||[]).length > 0 && (
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {(activeTake.annotations||[]).map(ann => (
                    <div key={ann.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",
                      background:ann.resolved?`${T.GREEN}04`:`${T.ORANGE}04`,
                      border:`1px solid ${ann.resolved?T.GREEN+"12":T.ORANGE+"12"}`,borderRadius:6}}>
                      <span onClick={()=>setPlayhead(ann.time)} style={{fontFamily:M,fontSize:8.5,color:T.GOLD,cursor:"pointer",flexShrink:0,minWidth:40}}>
                        {((ann.time / 100) * duration).toFixed(1)}s
                      </span>
                      <span style={{flex:1,fontFamily:B,fontSize:11,color:ann.resolved?"#666":"#999",textDecoration:ann.resolved?"line-through":"none"}}>{ann.text}</span>
                      <button onClick={() => {
                        setScenes(prev => prev.map(s => s.id !== rScene.id ? s : {
                          ...s,
                          takes: s.takes.map((t, ti) => ti === s.takes.length - 1 ? {
                            ...t, annotations: t.annotations.map(a => a.id === ann.id ? {...a, resolved: !a.resolved} : a)
                          } : t),
                        }));
                      }} style={{background:"transparent",border:`1px solid ${T.IBORDER}`,borderRadius:4,padding:"2px 8px",fontFamily:M,fontSize:8,color:ann.resolved?T.GREEN:"#555",cursor:"pointer"}}>
                        {ann.resolved ? "Reopen" : "Resolve"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ═══ TAKE HISTORY & ACTIONS ═══ */}
            <div style={{background:T.CARD,border:`1px solid ${T.BORDER}`,borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontFamily:D,fontWeight:400,fontSize:13,color:T.TXT,letterSpacing:"0.03em"}}>Take History</span>
                <span style={{fontFamily:M,fontSize:8.5,color:"#555"}}>{rScene.takes.length} take{rScene.takes.length!==1?"s":""}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {rScene.takes.map((take, ti) => (
                  <div key={take.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:6,
                    background:ti===rScene.takes.length-1?`${T.GOLD}06`:"transparent",
                    border:`1px solid ${ti===rScene.takes.length-1?T.GOLD+"20":T.BORDER}`}}>
                    <div style={{width:24,height:24,borderRadius:5,background:take.approved?`${T.GREEN}15`:`${T.GOLD}10`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontFamily:M,fontSize:10,
                      color:take.approved?T.GREEN:T.GOLD,flexShrink:0}}>
                      {take.approved ? "✓" : ti + 1}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:D,fontWeight:600,fontSize:11,color:T.TXT}}>Take {ti + 1} {ti===rScene.takes.length-1?"(latest)":""}</div>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#555"}}>
                        {take.resolution} · {take.duration}s · {take.tokens.toLocaleString()} tok · {take.validation?.passCount}/{take.validation?.totalChecks} checks
                        {(take.annotations||[]).length > 0 ? ` · ${(take.annotations||[]).filter(a=>!a.resolved).length} note${(take.annotations||[]).filter(a=>!a.resolved).length!==1?"s":""}` : ""}
                      </div>
                    </div>
                    {!take.approved && (
                      <button onClick={() => {
                        setScenes(prev => prev.map(s => s.id !== rScene.id ? s : {
                          ...s,
                          takes: s.takes.map((t, i) => i === ti ? {...t, approved: true} : t),
                        }));
                        notify("success", `Take ${ti + 1} approved for Scene ${rScene.number}`);
                      }} style={{background:`${T.GREEN}12`,border:`1px solid ${T.GREEN}30`,borderRadius:5,padding:"5px 12px",fontFamily:D,fontWeight:700,fontSize:10,color:T.GREEN,cursor:"pointer"}}>
                        Approve
                      </button>
                    )}
                    {take.approved && (
                      <span style={{fontFamily:M,fontSize:8,color:T.GREEN,background:`${T.GREEN}10`,borderRadius:4,padding:"3px 8px"}}>APPROVED</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ ACTION ROW ═══ */}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",alignItems:"center"}}>
              {(activeTake.annotations||[]).filter(a=>!a.resolved).length > 0 && (
                <span style={{fontFamily:M,fontSize:9,color:T.ORANGE,marginRight:8}}>
                  {(activeTake.annotations||[]).filter(a=>!a.resolved).length} unresolved annotation{(activeTake.annotations||[]).filter(a=>!a.resolved).length!==1?"s":""}
                </span>
              )}
              <button onClick={() => {
                notify("success", "Regeneration queued with " + (activeTake.annotations||[]).filter(a=>!a.resolved).length + " correction(s). Annotations will be fed as prompt modifiers.");
              }} style={{background:`${T.CYAN}12`,border:`1px solid ${T.CYAN}30`,borderRadius:8,padding:"10px 20px",fontFamily:D,fontWeight:700,fontSize:12,color:T.CYAN,cursor:"pointer"}}>
                Regenerate with Corrections
              </button>
              {!activeTake.approved && (
                <button onClick={() => {
                  setScenes(prev => prev.map(s => s.id !== rScene.id ? s : {
                    ...s,
                    takes: s.takes.map((t, i) => i === rScene.takes.length - 1 ? {...t, approved: true} : t),
                  }));
                  notify("success", `Take ${rScene.takes.length} approved for Scene ${rScene.number}. Scene ready for timeline assembly.`);
                }} style={{background:ACCENT,border:"none",borderRadius:8,padding:"10px 24px",fontFamily:D,fontWeight:700,fontSize:12,color:"#000",cursor:"pointer",boxShadow:`0 4px 20px ${T.GOLD}30`}}>
                  Approve Take →
                </button>
              )}
              {activeTake.approved && (
                <span style={{fontFamily:M,fontSize:10,color:T.GREEN,background:`${T.GREEN}10`,border:`1px solid ${T.GREEN}25`,borderRadius:6,padding:"8px 14px"}}>✓ Take Approved</span>
              )}
            </div>
          </div>
          );
        })()}

        {/* ═══ STORYBOARD EXPANDED PANEL OVERLAY ═══ */}
        {sbExpandedPanel && (() => {
          const epScene = scenes.find(s => s.id === sbExpandedPanel.sceneId);
          const epPanel = epScene?.storyboard?.panels?.find(p => p.id === sbExpandedPanel.panelId);
          if (!epScene || !epPanel) return null;
          const epDialogueChar = epPanel.dialogueRef ? chars.find(c => c.id === epPanel.dialogueRef) : null;
          const epDialogueBlock = epPanel.dialogueRef ? epScene.screenplay?.dialogueBlocks?.find(db => db.charId === epPanel.dialogueRef) : null;
          const borderColor = PANEL_BORDER_STATES[getPanelStatus(epPanel)] || "#333";
          const panelIdx = epScene.storyboard.panels.findIndex(p => p.id === epPanel.id);
          return (
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"#000E",backdropFilter:"blur(12px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
              onClick={() => setSbExpandedPanel(null)}>
              <div onClick={e => e.stopPropagation()} style={{width:"100%",maxWidth:920,maxHeight:"90vh",overflow:"auto",background:T.CARD,border:`1px solid ${borderColor}40`,borderRadius:14,padding:0}}>
                {/* Header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",borderBottom:`1px solid ${T.BORDER}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:M,fontSize:10,color:T.CYAN,background:`${T.CYAN}10`,borderRadius:5,padding:"3px 10px",fontWeight:700}}>PANEL {epPanel.number} of {epScene.storyboard.panels.length}</span>
                    <span style={{fontFamily:M,fontSize:9,color:borderColor,letterSpacing:"0.06em"}}>{getPanelStatus(epPanel).toUpperCase()}</span>
                    <span style={{fontFamily:M,fontSize:9,color:"#444"}}>Scene {epScene.number}: {epScene.title}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {panelIdx > 0 && (
                      <button onClick={() => setSbExpandedPanel({sceneId:sbExpandedPanel.sceneId, panelId:epScene.storyboard.panels[panelIdx-1].id})}
                        style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:"#666",cursor:"pointer"}}>← Prev</button>
                    )}
                    {panelIdx < epScene.storyboard.panels.length - 1 && (
                      <button onClick={() => setSbExpandedPanel({sceneId:sbExpandedPanel.sceneId, panelId:epScene.storyboard.panels[panelIdx+1].id})}
                        style={{background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:"#666",cursor:"pointer"}}>Next →</button>
                    )}
                    <button onClick={() => setSbExpandedPanel(null)}
                      style={{background:`${T.RED}10`,border:`1px solid ${T.RED}20`,borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:T.RED,cursor:"pointer"}}>✕ Close</button>
                  </div>
                </div>

                {/* Two-column layout: Panel (60%) | Script Context (40%) */}
                <div className="cs-overlay-split" style={{minHeight:400}}>
                  {/* Left: Panel visualization */}
                  <div style={{padding:20,borderRight:`1px solid ${T.BORDER}`}}>
                    {/* 16:9 expanded panel frame */}
                    <div style={{
                      width:"100%",aspectRatio:"16/9",background:`${T.CYAN}03`,
                      border:`2px solid ${borderColor}40`,borderRadius:10,
                      display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",marginBottom:16,
                    }}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0.4}}>
                        <div style={{fontFamily:M,fontSize:48,color:borderColor}}>
                          {epPanel.composition === "Wide Establishing" && "▬▬▬"}
                          {epPanel.composition === "Close-Up Reaction" && "◉"}
                          {epPanel.composition === "Over-the-Shoulder" && "◐"}
                          {epPanel.composition === "Medium Two-Shot" && "◫◫"}
                          {epPanel.composition === "Tracking Movement" && "→→→"}
                          {!["Wide Establishing","Close-Up Reaction","Over-the-Shoulder","Medium Two-Shot","Tracking Movement"].includes(epPanel.composition) && "□"}
                        </div>
                        <div style={{fontFamily:D,fontSize:13,color:"#555",fontWeight:600}}>{epPanel.composition}</div>
                        <div style={{fontFamily:M,fontSize:9,color:"#333"}}>Image generation placeholder · Flux/SDXL + LoRA</div>
                      </div>
                      {/* Camera label overlay */}
                      <div style={{position:"absolute",bottom:10,left:10,background:"#000B",borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:9,color:"#999",backdropFilter:"blur(4px)"}}>{epPanel.cameraLabel}</div>
                      {/* Panel number overlay */}
                      <div style={{position:"absolute",top:10,left:10,background:"#000B",borderRadius:5,padding:"4px 10px",fontFamily:M,fontSize:11,color:T.CYAN,fontWeight:700,backdropFilter:"blur(4px)"}}>#{epPanel.number}</div>
                    </div>

                    {/* Panel metadata */}
                    <div className="cs-g2" style={{gap:10,marginBottom:14}}>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Composition</div>
                        <div style={{fontFamily:B,fontSize:12,color:T.TXT}}>{epPanel.composition}</div>
                      </div>
                      <div>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Camera</div>
                        <div style={{fontFamily:B,fontSize:12,color:T.TXT}}>{epPanel.cameraLabel}</div>
                      </div>
                    </div>

                    <div style={{marginBottom:14}}>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Description</div>
                      <div style={{fontFamily:B,fontSize:12,color:"#bbb",lineHeight:1.6}}>{epPanel.description}</div>
                    </div>

                    {/* Character positions */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Character Positions</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {epPanel.charPositions.map((cp, i) => {
                          const name = cp.split("—")[0].trim().split(" ")[0];
                          const ch = chars.find(c => c.name.startsWith(name));
                          return (
                            <span key={i} style={{fontFamily:B,fontSize:10.5,color:ch?.color || "#888",background:`${ch?.color || "#888"}10`,border:`1px solid ${ch?.color || "#888"}20`,borderRadius:5,padding:"3px 10px"}}>
                              {cp}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Annotations */}
                    {epPanel.annotations.length > 0 && (
                      <div style={{marginBottom:14}}>
                        <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:4}}>Annotations</div>
                        {epPanel.annotations.map((ann, i) => (
                          <div key={i} style={{fontFamily:B,fontSize:11,color:T.ORANGE,background:`${T.ORANGE}08`,borderRadius:5,padding:"6px 10px",marginBottom:4,borderLeft:`2px solid ${T.ORANGE}40`}}>{ann}</div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{display:"flex",gap:8,marginTop:16}}>
                      {!epPanel.approved ? (
                        <button onClick={() => approvePanel(sbExpandedPanel.sceneId, epPanel.id)}
                          style={{background:`${T.GREEN}12`,border:`1px solid ${T.GREEN}30`,borderRadius:6,padding:"8px 18px",fontFamily:D,fontWeight:700,fontSize:11,color:T.GREEN,cursor:"pointer"}}>
                          ✓ Approve Panel
                        </button>
                      ) : (
                        <button onClick={() => rejectPanel(sbExpandedPanel.sceneId, epPanel.id)}
                          style={{background:`${T.ORANGE}10`,border:`1px solid ${T.ORANGE}25`,borderRadius:6,padding:"8px 18px",fontFamily:D,fontWeight:700,fontSize:11,color:T.ORANGE,cursor:"pointer"}}>
                          ↩ Unapprove
                        </button>
                      )}
                      <button onClick={() => { regeneratePanel(sbExpandedPanel.sceneId, epPanel.id); }}
                        style={{background:`${T.CYAN}10`,border:`1px solid ${T.CYAN}25`,borderRadius:6,padding:"8px 18px",fontFamily:D,fontWeight:700,fontSize:11,color:T.CYAN,cursor:"pointer"}}>
                        ↻ Regenerate
                      </button>
                      <button onClick={() => { deletePanel(sbExpandedPanel.sceneId, epPanel.id); setSbExpandedPanel(null); }}
                        style={{background:`${T.RED}08`,border:`1px solid ${T.RED}15`,borderRadius:6,padding:"8px 14px",fontFamily:D,fontWeight:700,fontSize:11,color:T.RED,cursor:"pointer",marginLeft:"auto"}}>
                        ✕ Delete Panel
                      </button>
                    </div>
                  </div>

                  {/* Right: Script context */}
                  <div style={{padding:20,background:`${T.DARK}80`}}>
                    <div style={{fontFamily:M,fontSize:9,color:T.GOLD,letterSpacing:"0.08em",marginBottom:12,textTransform:"uppercase"}}>Script Reference</div>

                    {/* Dialogue block if this panel references one */}
                    {epDialogueChar && epDialogueBlock && (
                      <div style={{background:`${epDialogueChar.color}06`,border:`1px solid ${epDialogueChar.color}20`,borderRadius:8,padding:14,marginBottom:14}}>
                        <div style={{fontFamily:M,fontSize:9,color:epDialogueChar.color,fontWeight:700,letterSpacing:"0.06em",marginBottom:6,textTransform:"uppercase"}}>{epDialogueChar.name}</div>
                        {epDialogueBlock.parenthetical && <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:10.5,color:"#666",fontStyle:"italic",marginBottom:4}}>({epDialogueBlock.parenthetical})</div>}
                        <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:11.5,color:"#bbb",lineHeight:1.6}}>"{epDialogueBlock.line}"</div>
                      </div>
                    )}

                    {/* Full scene action text */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Scene Action</div>
                      <div style={{fontFamily:"'Courier Prime','Courier New',Courier,monospace",fontSize:10.5,color:"#777",lineHeight:1.7,background:"#08080E",borderRadius:6,padding:12,border:`1px solid ${T.BORDER}`}}>
                        {epScene.screenplay?.action || "No action text."}
                      </div>
                    </div>

                    {/* Scene camera settings */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Scene Camera</div>
                      <div className="cs-g2" style={{gap:6}}>
                        {[
                          {l:"Shot",v:epScene.camera?.shotType},{l:"Movement",v:epScene.camera?.movement},
                          {l:"Lighting",v:epScene.camera?.lighting},{l:"Atmosphere",v:epScene.camera?.atmosphere},
                        ].map(item => (
                          <div key={item.l} style={{background:T.INPUT,borderRadius:5,padding:"6px 10px",border:`1px solid ${T.IBORDER}`}}>
                            <div style={{fontFamily:M,fontSize:7.5,color:"#444",letterSpacing:"0.05em",marginBottom:2}}>{item.l}</div>
                            <div style={{fontFamily:B,fontSize:10.5,color:"#999"}}>{item.v || "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Characters in scene */}
                    <div>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Characters</div>
                      {Object.entries(epScene.chars).map(([cid, state]) => {
                        const ch = chars.find(c => c.id === cid);
                        if (!ch) return null;
                        return (
                          <div key={cid} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,background:`${ch.color}06`,borderRadius:5,padding:"6px 10px",border:`1px solid ${ch.color}12`}}>
                            <div style={{width:6,height:6,borderRadius:"50%",background:ch.color}}/>
                            <span style={{fontFamily:D,fontWeight:600,fontSize:10.5,color:ch.color}}>{ch.name}</span>
                            <span style={{fontFamily:M,fontSize:8.5,color:"#555"}}>{state.emotion}</span>
                            {state.blocking && <span style={{fontFamily:M,fontSize:8,color:"#444",marginLeft:"auto",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{state.blocking}</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Regeneration guidance input */}
                    <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${T.BORDER}`}}>
                      <div style={{fontFamily:M,fontSize:8.5,color:"#444",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>Regeneration Guidance</div>
                      <textarea
                        value={sbGuidance} onChange={e => setSbGuidance(e.target.value)}
                        placeholder="Optional: describe what to change for this panel…"
                        rows={3}
                        style={{width:"100%",boxSizing:"border-box",background:T.INPUT,border:`1px solid ${T.IBORDER}`,borderRadius:6,padding:"8px 10px",color:T.TXT,fontFamily:B,fontSize:11,outline:"none",resize:"vertical"}}
                      />
                      <button onClick={() => { regeneratePanel(sbExpandedPanel.sceneId, epPanel.id); }}
                        disabled={!sbGuidance.trim()}
                        style={{marginTop:6,background:sbGuidance.trim()?`${T.CYAN}12`:`${T.CYAN}04`,border:`1px solid ${T.CYAN}${sbGuidance.trim()?"30":"10"}`,borderRadius:5,padding:"6px 14px",fontFamily:M,fontSize:9,color:sbGuidance.trim()?T.CYAN:"#444",cursor:sbGuidance.trim()?"pointer":"not-allowed",fontWeight:600}}>
                        ↻ Regenerate with Guidance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══ FOOTER ═══ */}
        <div style={{marginTop:32,paddingTop:14,borderTop:`1px solid #101020`,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontFamily:M,fontSize:8,color:"#1A1A28",letterSpacing:"0.1em"}}>CRUSHED STUDIOS · PRODUCTION CONSOLE v6.0 · SCREENPLAY + STORYBOARD PIPELINE</span>
          <span style={{fontFamily:M,fontSize:8,color:"#1A1A28"}}>Neo4j Graph · LoRA Adapters · Prompt Constraint Framework · Script Engine · Storyboard Agent</span>
        </div>
      </main>

      {/* ═══ NOTIFICATIONS ═══ */}
      <Notification notification={notification} onDismiss={() => setNotification(null)} />
    </div>
  );
}
