/**
 * Production Constants
 * Extracted from monolith App.jsx Region 2c
 */
export declare const SHOT_TYPES: readonly ["Close-up", "Extreme Close-up", "Medium Shot", "Medium Close-up", "Wide Shot", "Extreme Wide", "Three Quarter Body", "Full Body", "Over the Shoulder", "Dutch Angle", "Bird's Eye", "Worm's Eye", "Point of View", "Two Shot", "Tracking Shot", "Dolly Zoom"];
export declare const CAMERA_MOVEMENTS: readonly [{
    readonly name: "Drone — Low Altitude Fly-over";
    readonly cat: "Aerial";
}, {
    readonly name: "Drone — Top-Down Reveal";
    readonly cat: "Aerial";
}, {
    readonly name: "Steadicam — Walk & Talk";
    readonly cat: "Stabilized";
}, {
    readonly name: "Dolly — Push In";
    readonly cat: "Track";
}, {
    readonly name: "Dolly — Pull Out";
    readonly cat: "Track";
}, {
    readonly name: "Crane — Jib Up Reveal";
    readonly cat: "Crane/Rig";
}, {
    readonly name: "Handheld — Vérité / Raw";
    readonly cat: "Handheld";
}, {
    readonly name: "Static / Locked Tripod";
    readonly cat: "Static";
}, {
    readonly name: "Gimbal — Run & Gun";
    readonly cat: "Stabilized";
}, {
    readonly name: "Cable Cam / Spidercam";
    readonly cat: "Rigged";
}];
export declare const LIGHTING_SOURCES: readonly ["Teal and Orange", "Natural Sunlight", "Golden Hour", "Blue Hour", "Neon Noir", "Chiaroscuro", "High Key", "Low Key", "Rembrandt", "Split Lighting", "Silhouette", "Practical Lights", "Candlelight", "Moonlight", "Fluorescent", "Volumetric / Haze"];
export declare const ATMOSPHERES: readonly ["Moody", "Cinematic", "Lonely", "Melancholic", "Euphoric", "Tense", "Dreamlike", "Gritty", "Nostalgic", "Surreal", "Romantic", "Dystopian", "Serene", "Chaotic", "Intimate", "Epic", "Claustrophobic", "Ethereal", "Raw", "Mythic"];
export declare const CAMERA_BODIES: readonly [{
    readonly name: "ARRI Alexa 35";
    readonly tier: "Cinema Flagship";
    readonly sensor: "S35 ALEV 4";
    readonly res: "4.6K";
}, {
    readonly name: "RED V-RAPTOR XL 8K";
    readonly tier: "Cinema Flagship";
    readonly sensor: "VV";
    readonly res: "8K";
}, {
    readonly name: "Sony Venice 2";
    readonly tier: "Cinema Flagship";
    readonly sensor: "FF Dual ISO";
    readonly res: "8.6K";
}, {
    readonly name: "Canon EOS C500 Mk II";
    readonly tier: "Professional";
    readonly sensor: "Full Frame";
    readonly res: "5.9K";
}, {
    readonly name: "Blackmagic URSA Cine 12K";
    readonly tier: "Cinema Flagship";
    readonly sensor: "Full Frame";
    readonly res: "12K";
}, {
    readonly name: "IMAX MSM 9802";
    readonly tier: "Large Format Film";
    readonly sensor: "65mm/15-perf";
    readonly res: "18K equiv";
}, {
    readonly name: "Phantom Flex4K";
    readonly tier: "High Speed";
    readonly sensor: "Super 35";
    readonly res: "4K";
}];
export declare const FOCAL_LENGTHS: readonly ["12mm Ultra Wide", "18mm Wide", "24mm Wide", "35mm Standard", "50mm Normal", "85mm Portrait", "135mm Telephoto", "Zoom 24-70mm", "Anamorphic 50mm"];
export declare const LENS_TYPES: readonly ["Spherical Prime", "Anamorphic Cinema", "Zoom Lens", "Vintage Rehoused", "Cooke S7/i", "Zeiss Supreme Prime", "ARRI Signature Prime", "Panavision Primo"];
export declare const FILM_STOCKS: readonly ["Kodak Vision3 500T", "Kodak Vision3 250D", "CineStill 800T", "Digital Clean", "16mm Grainy", "Super 8 Vintage", "70mm Film", "IMAX Large Format"];
export declare const ASPECT_RATIOS: readonly ["2.39:1 Anamorphic", "2.00:1 Univisium", "1.85:1 Widescreen", "1.78:1 (16:9)", "1.43:1 IMAX", "1.33:1 (4:3)", "9:16 Vertical"];
export declare const GENRES: readonly ["Noir", "Drama", "Thriller", "Sci-Fi", "Romance", "Horror", "Comedy", "Action", "Documentary", "Fantasy", "Western", "Musical"];
export declare const ERAS: readonly ["Contemporary", "1990s", "1980s", "1970s", "1960s", "1940s Noir", "Victorian", "Medieval", "Futuristic", "Timeless"];
export declare const COLOR_GRADES: readonly ["Bleach Bypass", "Teal & Orange", "Desaturated", "Warm Vintage", "Cold Steel", "Neon Saturated", "Pastel Dream", "High Contrast B&W", "Sepia", "Natural"];
export type ShotType = typeof SHOT_TYPES[number];
export type LightingSource = typeof LIGHTING_SOURCES[number];
export type Atmosphere = typeof ATMOSPHERES[number];
export type FocalLength = typeof FOCAL_LENGTHS[number];
export type LensType = typeof LENS_TYPES[number];
export type FilmStock = typeof FILM_STOCKS[number];
export type AspectRatio = typeof ASPECT_RATIOS[number];
export type Genre = typeof GENRES[number];
export type Era = typeof ERAS[number];
export type ColorGrade = typeof COLOR_GRADES[number];
//# sourceMappingURL=production.d.ts.map