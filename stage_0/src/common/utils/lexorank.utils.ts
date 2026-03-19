import { LexoRank } from 'lexorank';

/**
 * Calculates the new rank for a card based on its neighbors.
 */
export const LexoRankUtil = {
  calculateRank(prevRank?: string | undefined, nextRank?: string | undefined): string {
    // Scenario 1: First card in an empty list
    if (!prevRank && !nextRank) {
      return LexoRank.middle().toString();
    }

    // Scenario 2: Dropped at the very top (no previous card)
    if (!prevRank && nextRank) {
      const nextLexo = LexoRank.parse(nextRank);
      return nextLexo.genPrev().toString();
    }

    // Scenario 3: Dropped at the very bottom (no next card)
    if (prevRank && !nextRank) {
      const prevLexo = LexoRank.parse(prevRank);
      return prevLexo.genNext().toString();
    }

    // Scenario 4: Dropped between two cards
    if (prevRank && nextRank) {
      const prevLexo = LexoRank.parse(prevRank);
      const nextLexo = LexoRank.parse(nextRank);
      return prevLexo.between(nextLexo).toString();
    }

    throw new Error('Invalid rank calculation parameters');
  }
};
export type LexoRankUtilType = typeof LexoRankUtil