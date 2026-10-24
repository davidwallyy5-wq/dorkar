export type LandmarkCategory =
  | 'historical'
  | 'education'
  | 'market'
  | 'nature'
  | 'health'
  | 'transport'
  | 'community'
  | 'cultural'
  | 'resort';

export interface MirzapurLandmark {
  id: string;
  name: string;
  nameEn: string;
  category: LandmarkCategory;
  categoryName: string;
  x: number; // percentage on canvas (0-100)
  y: number; // percentage on canvas (0-100)
  icon: string;
  badge: string;
  subtitle: string;
  description: string;
  deliveryReach: string;
  deliveryTime: string;
  funFact: string;
  orderPrompt?: string;
  accentColor: string;
}

export interface MirzapurCharacter {
  id: string;
  name: string;
  role: string;
  activity: string;
  speech: string;
  x: number;
  y: number;
  type:
    | 'shopping'
    | 'waving'
    | 'drinking_tea'
    | 'gardening'
    | 'bicycle'
    | 'carrier'
    | 'shohayok'
    | 'celebrating'
    | 'farmer'
    | 'customer'
    | 'runner';
  animation: 'bounce' | 'pulse' | 'sway' | 'walk' | 'float' | 'celebrating';
}

export interface MirzapurRouteRider {
  id: string;
  name: string;
  riderCode: string;
  vehicle: 'scooter' | 'bicycle' | 'cng';
  status: 'ডেলিভারির পথে' | 'অর্ডার সংগ্রহ করছে' | 'ডেলিভারি সম্পন্ন';
  route: 'highway' | 'town_bazaar' | 'jamurki_mohera' | 'cadet_kumudini';
  direction: 'forward' | 'reverse';
  duration: number;
}

export interface DeliverySimulationStep {
  step: number;
  title: string;
  location: string;
  x: number;
  y: number;
  description: string;
}
