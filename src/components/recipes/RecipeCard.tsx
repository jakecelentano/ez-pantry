// src/components/recipes/RecipeCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Recipe } from '../../types/recipe';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import SFAHIndicator from './SFAHIndicator';
import DietaryTags from './DietaryTags';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  userIngredients: string[];
  onViewDetails: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSaved,
  userIngredients,
  onViewDetails,
}) => {
  const [showFullInstructions, setShowFullInstructions] = useState(false);

  // Filter ingredients into ones user has and ones they need
  const userHasIngredients = recipe.ingredients.filter(ingredient =>
    userIngredients.includes(ingredient.name.toLowerCase())
  );
  
  const userNeedsIngredients = recipe.ingredients.filter(
    ingredient => !userIngredients.includes(ingredient.name.toLowerCase())
  );

  return (
    <View style={styles.card}>
      {/* Recipe Image */}
      <Image
        source={{ uri: recipe.imageUrl || 'https://via.placeholder.com/400x200' }}
        style={styles.image}
      />

      {/* Saved indicator */}
      {isSaved && (
        <View style={styles.savedBadge}>
          <Ionicons name="bookmark" size={16} color={COLORS.white} />
        </View>
      )}

      <ScrollView style={styles.contentContainer}>
        {/* Title and Tags Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          <DietaryTags tags={recipe.dietaryTags} />
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        {/* Recipe Meta */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.text} />
            <Text style={styles.metaText}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="restaurant-outline" size={16} color={COLORS.text} />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color={COLORS.text} />
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
          </View>
        </View>

        {/* SFAH Framework */}
        <SFAHIndicator sfah={recipe.sfah} />

        {/* Ingredients Section */}
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>

          {/* Ingredients user has */}
          {userHasIngredients.length > 0 && (
            <View style={styles.ingredientSection}>
              <Text style={styles.ingredientSectionTitle}>
                From your pantry ✓
              </Text>
              <View style={styles.ingredientsList}>
                {userHasIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <Text style={styles.ingredientChipTextHas}>
                      {ingredient.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Ingredients user needs */}
          {userNeedsIngredients.length > 0 && (
            <View style={styles.ingredientSection}>
              <Text style={styles.ingredientSectionTitle}>
                You'll need to add
              </Text>
              <View style={styles.ingredientsList}>
                {userNeedsIngredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientChip}>
                    <Text style={styles.ingredientChipTextNeeds}>
                      {ingredient.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Show Full Recipe Button */}
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowFullInstructions(!showFullInstructions)}
        >
          <Text style={styles.showMoreButtonText}>
            {showFullInstructions ? 'Hide full recipe' : 'Show full recipe'}
          </Text>
          <Ionicons
            name={showFullInstructions ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* Full Instructions (conditionally rendered) */}
        {showFullInstructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((step, index) => (
              <View key={index} style={styles.instructionStep}>
                <Text style={styles.stepNumber}>{step.step}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* View Details Button */}
        <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
          <Text style={styles.detailsButtonText}>View full details</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    height: '90%',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  savedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: SPACING.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.small,
  },
  title: {
    ...TYPOGRAPHY.heading,
    flex: 1,
    marginRight: SPACING.small,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.medium,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.large,
  },
  metaText: {
    ...TYPOGRAPHY.small,
    marginLeft: 4,
  },
  ingredientsContainer: {
    marginVertical: SPACING.medium,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subHeading,
    marginBottom: SPACING.small,
  },
  ingredientSection: {
    marginBottom: SPACING.small,
  },
  ingredientSectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientChip: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  ingredientChipTextHas: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
  },
  ingredientChipTextNeeds: {
    ...TYPOGRAPHY.small,
    color: COLORS.warning,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.small,
    marginVertical: SPACING.small,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  showMoreButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    marginRight: 4,
  },
  instructionsContainer: {
    marginTop: SPACING.small,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: SPACING.small,
  },
  stepNumber: {
    ...TYPOGRAPHY.subHeading,
    color: COLORS.primary,
    marginRight: SPACING.small,
    width: 24,
  },
  stepText: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  detailsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.small,
    marginVertical: SPACING.medium,
  },
  detailsButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    marginRight: 4,
  },
});

export default RecipeCard;