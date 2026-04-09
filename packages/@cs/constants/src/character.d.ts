/**
 * Character Constants
 * Extracted from monolith App.jsx Region 2b
 */
export declare const PHYSICAL_ATTRS: readonly ["Hair", "Skin Tone", "Build", "Height", "Scars/Marks", "Facial Hair", "Age Range", "Distinguishing Feature"];
export declare const MANNERISMS: readonly ["Avoids eye contact", "Fidgets with hands", "Speaks softly", "Loud & assertive", "Slow deliberate movements", "Quick nervous gestures", "Crosses arms often", "Leans in when speaking", "Maintains intense eye contact", "Touches face frequently", "Stiff posture", "Relaxed slouch", "Paces when thinking", "Still & composed", "Smiles rarely", "Laughs easily", "Bites lip", "Taps fingers", "Looks away when lying", "Stands with hands in pockets"];
export declare const WARDROBE_ITEMS: readonly ["Trench coat", "Leather jacket", "Sari", "Business suit", "Worn jeans", "Military uniform", "Lab coat", "Hoodie", "Evening gown", "Traditional kurta", "Bomber jacket", "Flannel shirt", "Turtleneck", "Overalls", "Vintage dress", "Tank top", "Formal vest", "Rain poncho"];
export declare const EMOTIONS_LIST: readonly ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust", "Love", "Longing", "Desperation", "Resignation", "Determination", "Confusion", "Awe", "Guilt", "Jealousy", "Pride", "Anxiety", "Hope", "Contempt", "Vulnerability", "Defiance", "Grief"];
export declare const emotionIntensity: {
    readonly Joy: 9;
    readonly Sadness: 3;
    readonly Anger: 8;
    readonly Fear: 4;
    readonly Surprise: 7;
    readonly Disgust: 2;
    readonly Love: 8;
    readonly Longing: 5;
    readonly Desperation: 3;
    readonly Resignation: 2;
    readonly Determination: 7;
    readonly Confusion: 4;
    readonly Awe: 8;
    readonly Guilt: 3;
    readonly Jealousy: 5;
    readonly Pride: 7;
    readonly Anxiety: 4;
    readonly Hope: 7;
    readonly Contempt: 5;
    readonly Vulnerability: 3;
    readonly Defiance: 8;
    readonly Grief: 2;
};
export declare const CHAR_COLORS_PALETTE: readonly ["#22D3EE", "#F472B6", "#A78BFA", "#FB923C", "#22C55E", "#FCD34D", "#3B82F6", "#F97316"];
export type PhysicalAttr = typeof PHYSICAL_ATTRS[number];
export type Mannerism = typeof MANNERISMS[number];
export type WardrobeItem = typeof WARDROBE_ITEMS[number];
export type EmotionLabel = typeof EMOTIONS_LIST[number];
//# sourceMappingURL=character.d.ts.map