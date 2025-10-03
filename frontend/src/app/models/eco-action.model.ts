export interface EcoAction {
  _id: string;
  name: string;
  category: 'transportation' | 'waste' | 'food' | 'energy' | 'water';
  co2Saved: number;
  waterSaved: number;
  wasteSaved: number;
  icon: string;
  description: string;
}

export interface UserAction {
  _id: string;
  userId: string;
  actionId: string | EcoAction;
  quantity: number;
  date: Date;
  co2SavedTotal: number;
  waterSavedTotal: number;
  wasteSavedTotal: number;
}

export interface Impact {
  co2: number;
  water: number;
  waste: number;
}

export interface UserStats {
  userId: string;
  username: string;
  currentStreak: number;
  longestStreak: number;
  totalCO2Saved: number;
  totalWaterSaved: number;
  totalWasteSaved: number;
}
