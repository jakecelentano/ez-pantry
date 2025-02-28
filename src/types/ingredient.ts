// src/types/ingredient.ts

export type IngredientCategory = 
  | 'Protein'
  | 'Grain'
  | 'Vegetable'
  | 'Fruit'
  | 'Dairy'
  | 'Condiment'
  | 'Spice'
  | 'Herb'
  | 'Oil'
  | 'Vinegar'
  | 'Baking'
  | 'Sweetener'
  | 'Nut'
  | 'Beverage'
  | 'Other';

export type StorageLocation = 'Pantry' | 'Refrigerator' | 'Freezer';

export interface SeasonalAvailability {
  region: string;
  months: number[]; // 1-12 representing Jan-Dec
}

export interface ShelfLife {
  pantry?: number; // days
  refrigerated?: number; // days
  frozen?: number; // days
}

export interface NutritionPerServing {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  alternateNames?: string[];
  category: IngredientCategory;
  imageUrl?: string;
  seasonality?: SeasonalAvailability[];
  shelfLife: ShelfLife;
  nutritionPerServing?: NutritionPerServing;
  commonUnits: string[];
  commonSubstitutes?: string[];
  sustainabilityScore?: number; // 1-10 scale
  createdAt: string;
  updatedAt: string;
}

export interface PantryItem {
  id: string;
  userId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number;
  unit: string;
  expirationDate?: string;
  location: StorageLocation;
  addedDate: string;
  updatedDate: string;
}

export interface IngredientFilter {
  category?: IngredientCategory[];
  query?: string;
  inPantry?: boolean;
  limit?: number;
  offset?: number;
}