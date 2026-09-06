/**
 * Food Cost & Margin formulas, implemented exactly as specified in
 * portfolio-framework.md §3.2 (both locales):
 *
 *   Cost Per Unit          = Purchase Price / Package Volume
 *   Effective Cost          = (Cost Per Unit × Quantity Used) / (Yield / 100)
 *   Total Food Cost (COGS)  = Σ Effective Cost
 *   Actual Food Cost %      = (Total Food Cost / Target Selling Price) × 100
 *   Gross Profit            = Target Selling Price − Total Food Cost
 *   Gross Profit Margin %   = (Gross Profit / Target Selling Price) × 100
 *   Recommended Price       = Total Food Cost / (Target Food Cost % / 100)
 *
 * Status thresholds: healthy when actual ≤ target; warning when actual ≤
 * target + 5; critical when actual > target + 5.
 */

export type FoodCostStatus = 'healthy' | 'warning' | 'critical';

export interface IngredientInput {
  purchasePrice: number;
  packageVolume: number;
  quantityUsed: number;
  yieldPercent: number;
}

export interface FoodCostInput {
  targetSellingPrice: number;
  targetFoodCostPercent: number;
  ingredients: IngredientInput[];
}

export interface FoodCostOutput {
  totalCogs: number;
  actualFoodCostPercent: number | null;
  grossProfit: number;
  grossProfitMarginPercent: number | null;
  recommendedSellingPrice: number | null;
  status: FoodCostStatus | null;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateFoodCost(input: FoodCostInput): FoodCostOutput {
  const totalCogs = input.ingredients.reduce((sum, row) => {
    // Skip rows with unusable volumes/yields instead of producing Infinity
    if (!(row.packageVolume > 0) || !(row.yieldPercent > 0)) {
      return sum;
    }
    const costPerUnit = row.purchasePrice / row.packageVolume;
    const effectiveCost = (costPerUnit * row.quantityUsed) / (row.yieldPercent / 100);
    return sum + effectiveCost;
  }, 0);

  const price = input.targetSellingPrice;
  const hasPrice = price > 0;
  const target = input.targetFoodCostPercent;

  const actualFoodCostPercent = hasPrice ? round2((totalCogs / price) * 100) : null;
  const grossProfit = price - totalCogs;
  const grossProfitMarginPercent = hasPrice ? round2((grossProfit / price) * 100) : null;
  const recommendedSellingPrice =
    hasPrice && target > 0 ? round2(totalCogs / (target / 100)) : null;

  let status: FoodCostStatus | null = null;
  if (actualFoodCostPercent !== null) {
    status =
      actualFoodCostPercent <= target
        ? 'healthy'
        : actualFoodCostPercent <= target + 5
          ? 'warning'
          : 'critical';
  }

  return {
    totalCogs: round2(totalCogs),
    actualFoodCostPercent,
    grossProfit: round2(grossProfit),
    grossProfitMarginPercent,
    recommendedSellingPrice,
    status,
  };
}