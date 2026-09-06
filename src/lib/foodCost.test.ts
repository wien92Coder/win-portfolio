import { describe, expect, it } from 'vitest';
import { calculateFoodCost, type FoodCostInput } from './foodCost';

// Worked examples derived by hand from the brief's formulas (portfolio-framework.md §3.2):
//   Cost Per Unit = Purchase Price / Package Volume
//   Effective Cost = (Cost Per Unit × Quantity Used) / (Yield / 100)
//   Total COGS = Σ Effective Cost
//   Actual Food Cost % = (COGS / Target Selling Price) × 100
//   Gross Profit = Target Selling Price − COGS
//   Recommended Price = COGS / (Target Food Cost % / 100)
//   Status: healthy ≤ target; warning ≤ target+5; critical > target+5

function input(overrides: Partial<FoodCostInput>): FoodCostInput {
  return {
    targetSellingPrice: 25000,
    targetFoodCostPercent: 30,
    ingredients: [{ purchasePrice: 10000, packageVolume: 1000, quantityUsed: 250, yieldPercent: 100 }],
    ...overrides,
  };
}

describe('calculateFoodCost', () => {
  it('computes per-unit cost, effective cost, and total COGS from the brief formula', () => {
    // unit = 10,000 / 1,000 = 10; effective = 10 × 250 / 1 = 2,500
    const result = calculateFoodCost(input({}));
    expect(result.totalCogs).toBeCloseTo(2500, 6);
  });

  it('scales effective cost by yield percent', () => {
    // unit = 8,000 / 1,000 = 8; effective = 8 × 100 / (80/100) = 1,000
    const result = calculateFoodCost(
      input({
        targetSellingPrice: 10000,
        ingredients: [{ purchasePrice: 8000, packageVolume: 1000, quantityUsed: 100, yieldPercent: 80 }],
      }),
    );
    expect(result.totalCogs).toBeCloseTo(1000, 6);
  });

  it('sums effective costs across multiple ingredients', () => {
    const result = calculateFoodCost(
      input({
        targetSellingPrice: 10000,
        ingredients: [
          { purchasePrice: 8000, packageVolume: 1000, quantityUsed: 100, yieldPercent: 80 }, // 1,000
          { purchasePrice: 10000, packageVolume: 1000, quantityUsed: 100, yieldPercent: 100 }, // 1,000
        ],
      }),
    );
    expect(result.totalCogs).toBeCloseTo(2000, 6);
  });

  it('computes actual food cost ratio and gross profit on a healthy margin', () => {
    const result = calculateFoodCost(input({})); // COGS 2,500 on price 25,000
    expect(result.actualFoodCostPercent).toBeCloseTo(10, 6);
    expect(result.grossProfit).toBeCloseTo(22500, 6);
    expect(result.grossProfitMarginPercent).toBeCloseTo(90, 6);
    expect(result.status).toBe('healthy');
  });

  it('flags warning when actual is within 5 points above target', () => {
    // COGS 3,300 on price 10,000 → 33% (target 30)
    const result = calculateFoodCost(
      input({
        targetSellingPrice: 10000,
        ingredients: [{ purchasePrice: 3300, packageVolume: 1000, quantityUsed: 1000, yieldPercent: 100 }],
      }),
    );
    expect(result.status).toBe('warning');
  });

  it('keeps the exact 35% boundary as warning, not critical', () => {
    // COGS 3,500 on price 10,000 → 35% = target + 5
    const result = calculateFoodCost(
      input({
        targetSellingPrice: 10000,
        ingredients: [{ purchasePrice: 3500, packageVolume: 1000, quantityUsed: 1000, yieldPercent: 100 }],
      }),
    );
    expect(result.actualFoodCostPercent).toBe(35);
    expect(result.status).toBe('warning');
  });

  it('flags critical when actual exceeds target + 5', () => {
    // COGS 4,000 on price 10,000 → 40% > 35
    const result = calculateFoodCost(
      input({
        targetSellingPrice: 10000,
        ingredients: [{ purchasePrice: 4000, packageVolume: 1000, quantityUsed: 1000, yieldPercent: 100 }],
      }),
    );
    expect(result.status).toBe('critical');
  });

  it('computes the recommended selling price from the target food cost percent', () => {
    const result = calculateFoodCost(input({})); // COGS 2,500, target 30%
    expect(result.recommendedSellingPrice).toBeCloseTo(8333.33, 2);
  });

  it('returns nulls instead of NaN when the selling price is zero', () => {
    const result = calculateFoodCost(input({ targetSellingPrice: 0 }));
    expect(result.actualFoodCostPercent).toBeNull();
    expect(result.recommendedSellingPrice).toBeNull();
    expect(result.status).toBeNull();
    expect(Number.isNaN(result.totalCogs)).toBe(false);
  });
});