import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types/recipe';
import * as recipeApi from '../../api/recipes';

// Define state type
interface RecipeState {
  suggestedRecipes: Recipe[];
  savedRecipes: Recipe[];
  currentRecipe: Recipe | null;
  savedRecipeIds: string[];
  offlineSaveQueue: string[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: RecipeState = {
  suggestedRecipes: [],
  savedRecipes: [],
  currentRecipe: null,
  savedRecipeIds: [],
  offlineSaveQueue: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSuggestedRecipes = createAsyncThunk(
  'recipes/fetchSuggested',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await recipeApi.getSuggestedRecipes(ingredientIds);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch recipe suggestions');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchById',
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const response = await recipeApi.getRecipeById(recipeId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch recipe details');
    }
  }
);

export const fetchSavedRecipes = createAsyncThunk(
  'recipes/fetchSaved',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { userId: string } };
    try {
      const response = await recipeApi.getSavedRecipes(state.auth.userId);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch saved recipes');
    }
  }
);

export const saveRecipe = createAsyncThunk(
  'recipes/save',
  async (recipeId: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { userId: string } };
    try {
      const response = await recipeApi.saveRecipe(recipeId, state.auth.userId);
      return response.data;
    } catch (error) {
      if (!navigator.onLine) {
        // Return for offline handling
        return { recipeId, offline: true };
      }
      return rejectWithValue('Failed to save recipe');
    }
  }
);

export const unsaveRecipe = createAsyncThunk(
  'recipes/unsave',
  async (recipeId: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: { userId: string } };
    try {
      await recipeApi.unsaveRecipe(recipeId, state.auth.userId);
      return recipeId;
    } catch (error) {
      return rejectWithValue('Failed to remove saved recipe');
    }
  }
);

// Recipe slice
const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    // Optimistic updates
    addToSavedRecipes: (state, action: PayloadAction<string>) => {
      if (!state.savedRecipeIds.includes(action.payload)) {
        state.savedRecipeIds.push(action.payload);
      }
    },
    removeFromSavedRecipes: (state, action: PayloadAction<string>) => {
      state.savedRecipeIds = state.savedRecipeIds.filter(
        id => id !== action.payload
      );
    },
    addToOfflineSaveQueue: (state, action: PayloadAction<string>) => {
      if (!state.offlineSaveQueue.includes(action.payload)) {
        state.offlineSaveQueue.push(action.payload);
      }
    },
    clearOfflineSaveQueue: (state) => {
      state.offlineSaveQueue = [];
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch suggested recipes
    builder.addCase(fetchSuggestedRecipes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSuggestedRecipes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.suggestedRecipes = action.payload;
    });
    builder.addCase(fetchSuggestedRecipes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch recipe by ID
    builder.addCase(fetchRecipeById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRecipeById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentRecipe = action.payload;
    });
    builder.addCase(fetchRecipeById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch saved recipes
    builder.addCase(fetchSavedRecipes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSavedRecipes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.savedRecipes = action.payload;
      state.savedRecipeIds = action.payload.map(recipe => recipe.id);
    });
    builder.addCase(fetchSavedRecipes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Save recipe
    builder.addCase(saveRecipe.pending, (state) => {
      state.error = null;
    });
    builder.addCase(saveRecipe.fulfilled, (state, action) => {
      if (action.payload.offline) {
        // Handle offline case
        state.offlineSaveQueue.push(action.payload.recipeId);
      } else {
        // Handle successful save
        if (!state.savedRecipeIds.includes(action.payload.id)) {
          state.savedRecipeIds.push(action.payload.id);
        }
        if (!state.savedRecipes.find(r => r.id === action.payload.id)) {
          state.savedRecipes.push(action.payload);
        }
      }
    });
    builder.addCase(saveRecipe.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Unsave recipe
    builder.addCase(unsaveRecipe.fulfilled, (state, action) => {
      state.savedRecipeIds = state.savedRecipeIds.filter(
        id => id !== action.payload
      );
      state.savedRecipes = state.savedRecipes.filter(
        recipe => recipe.id !== action.payload
      );
    });
  },
});

// Export actions
export const {
  addToSavedRecipes,
  removeFromSavedRecipes,
  addToOfflineSaveQueue,
  clearOfflineSaveQueue,
  setCurrentRecipe,
  clearError,
} = recipeSlice.actions;

// Export reducer
export default recipeSlice.reducer;
