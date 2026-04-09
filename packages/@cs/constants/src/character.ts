/**
 * Character Constants
 * Extracted from monolith App.jsx Region 2b
 */

import { T, CHAR_COLORS } from '@cs/tokens';

export const PHYSICAL_ATTRS = [
  'Hair',
  'Skin Tone',
  'Build',
  'Height',
  'Scars/Marks',
  'Facial Hair',
  'Age Range',
  'Distinguishing Feature',
] as const;

export const MANNERISMS = [
  'Avoids eye contact',
  'Fidgets with hands',
  'Speaks softly',
  'Loud & assertive',
  'Slow deliberate movements',
  'Quick nervous gestures',
  'Crosses arms often',
  'Leans in when speaking',
  'Maintains intense eye contact',
  'Touches face frequently',
  'Stiff posture',
  'Relaxed slouch',
  'Paces when thinking',
  'Still & composed',
  'Smiles rarely',
  'Laughs easily',
  'Bites lip',
  'Taps fingers',
  'Looks away when lying',
  'Stands with hands in pockets',
] as const;

export const WARDROBE_ITEMS = [
  'Trench coat',
  'Leather jacket',
  'Sari',
  'Business suit',
  'Worn jeans',
  'Military uniform',
  'Lab coat',
  'Hoodie',
  'Evening gown',
  'Traditional kurta',
  'Bomber jacket',
  'Flannel shirt',
  'Turtleneck',
  'Overalls',
  'Vintage dress',
  'Tank top',
  'Formal vest',
  'Rain poncho',
] as const;

export const EMOTIONS_LIST = [
  'Joy',
  'Sadness',
  'Anger',
  'Fear',
  'Surprise',
  'Disgust',
  'Love',
  'Longing',
  'Desperation',
  'Resignation',
  'Determination',
  'Confusion',
  'Awe',
  'Guilt',
  'Jealousy',
  'Pride',
  'Anxiety',
  'Hope',
  'Contempt',
  'Vulnerability',
  'Defiance',
  'Grief',
] as const;

export const emotionIntensity = {
  Joy: 9,
  Sadness: 3,
  Anger: 8,
  Fear: 4,
  Surprise: 7,
  Disgust: 2,
  Love: 8,
  Longing: 5,
  Desperation: 3,
  Resignation: 2,
  Determination: 7,
  Confusion: 4,
  Awe: 8,
  Guilt: 3,
  Jealousy: 5,
  Pride: 7,
  Anxiety: 4,
  Hope: 7,
  Contempt: 5,
  Vulnerability: 3,
  Defiance: 8,
  Grief: 2,
} as const;

export const CHAR_COLORS_PALETTE = CHAR_COLORS;

export type PhysicalAttr = typeof PHYSICAL_ATTRS[number];
export type Mannerism = typeof MANNERISMS[number];
export type WardrobeItem = typeof WARDROBE_ITEMS[number];
export type EmotionLabel = typeof EMOTIONS_LIST[number];
