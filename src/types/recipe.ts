// src/types/recipe.ts
import { Ingredient } from 

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type DietaryTag = 'GF' | 'V' | 'VG' | 'DF' | 'NF' | 'Keto' | 'Paleo' | 'LowCarb';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';
export type CuisineType = 
  | 'Italian' 
  | 'Chinese' 
  | 'Mexican' 
  | 'Indian' 
  | 'Thai' 
  | 'French' 
  | 'Japanese' 
  | 'Mediterranean' 
  | 'American' 
  | 'Middle Eastern'
  | 'Korean'
  | 'Vietnamese'
  | 'African'
  | 'Caribbean'
  | 'Greek'
  | 'Spanish'
  | 'Other';

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  required: boolean;
  substitutes?: string[];
}

export interface InstructionStep {
  step: number;
  text: string;
  imageUrl?: string;
  timers?: {
    duration: number;
    description: string;
  }[];
  techniques?: string[];
}

export interface SFAHElements {
  salt: string[];
  fat: string[];
  acid: string[];
  heat: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface UserRating {
  userId: string;
  rating: number;
  review?: string;
  cookDate: string;
}

export interface SourceAttribution {
  author?: string;
  culturalOrigin?: string;
  link?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: DifficultyLevel;
  cuisineType: CuisineType;
  mealType: MealType[];
  dietaryTags: DietaryTag[];
  ingredients: RecipeIngredient[];
  instructions: InstructionStep[];
  sfah: SFAHElements;
  nutritionInfo?: NutritionInfo;
  sourceAttribution?: SourceAttribution;
  userRatings?: UserRating[];
  aiGenerated: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedRecipe extends Recipe {
  savedDate: string;
  category?: string[];
  notes?: string;
  made: boolean;
  userRating?: number;
}

export interface RecipeFilter {
  cuisineType?: CuisineType[];
  mealType?: MealType[];
  dietaryTags?: DietaryTag[];
  maxPrepTime?: number;
  maxCookTime?: number;
  difficulty?: DifficultyLevel[];
  ingredients?: string[];
  limit?: number;
  offset?: number;
}

export interface MealPlanEntry {
  id: string;
  userId: string;
  recipeId: string;
  recipe: Recipe;
  date: string;
  mealType: MealType;
  servings: number;
  createdAt: string;
}