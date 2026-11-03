import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatRupiah } from '../lib/format';
import { calculateFoodCost, type FoodCostStatus } from '../lib/foodCost';

interface IngredientRow {
  id: string;
  name: string;
  purchasePrice: string;
  packageVolume: string;
  quantityUsed: string;
  yieldPercent: string;
}

/** Same treatment as the contact form: no box, just a hairline under the value,
 *  the display face for the number, cobalt once the field is the active one. */
const FIELD =
  'mt-2 w-full cursor-text border-b border-ink/25 bg-transparent pb-2 font-display text-base tracking-tight tabular-nums transition-colors placeholder:text-ink/25 focus:border-accent focus:outline-none';

const NUMBER_FIELD = `${FIELD} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;

const STATUS_STYLE: Record<FoodCostStatus, string> = {
  healthy: 'border-[var(--status-ok)] text-[var(--status-ok)]',
  warning: 'border-[var(--status-warn)] text-[var(--status-warn)]',
  critical: 'border-[var(--status-crit)] text-[var(--status-crit)]',
};

/** Ids only need to be stable per render tree, so a counter beats a UUID here. */
let rowCounter = 0;

function newRow(name: string, yieldPercent: string): IngredientRow {
  rowCounter += 1;
  return {
    id: `ingredient-${rowCounter}`,
    name,
    purchasePrice: '',
    packageVolume: '',
    quantityUsed: '',
    yieldPercent,
  };
}

/**
 * Food cost & margin calculator — the proof-of-work widget from v1, redrawn in
 * the v2 editorial system: a hairline ingredient table, display-face numbers,
 * one cobalt accent for the recommended price. All formulas live in
 * lib/foodCost.ts and keep their own tests, so the UI only moves strings.
 */
export function FoodCostCalculator() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'id';

  const [menuName, setMenuName] = useState(() => t('playground.defaults.menuItem'));
  const [targetFoodCost, setTargetFoodCost] = useState(30);
  const [targetPrice, setTargetPrice] = useState(25000);
  const [rows, setRows] = useState<IngredientRow[]>(() => [
    newRow(t('playground.defaults.ingredientName'), String(t('playground.defaults.yield'))),
  ]);

  const result = useMemo(
    () =>
      calculateFoodCost({
        targetSellingPrice: targetPrice,
        targetFoodCostPercent: targetFoodCost,
        ingredients: rows.map((row) => ({
          purchasePrice: Number(row.purchasePrice) || 0,
          packageVolume: Number(row.packageVolume) || 0,
          quantityUsed: Number(row.quantityUsed) || 0,
          yieldPercent: Number(row.yieldPercent) || 0,
        })),
      }),
    [rows, targetFoodCost, targetPrice],
  );

  const addRow = () => {
    setRows((current) => [
      ...current,
      newRow(t('playground.defaults.ingredientName'), String(t('playground.defaults.yield'))),
    ]);
  };

  const updateRow = (id: string, patch: Partial<IngredientRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <div
      id="playground-results"
      className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14"
    >
      {/* ── INPUTS ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="playground-inputs">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b hairline border-b-ink/20 pb-4">
          <h2 id="playground-inputs" className="label text-ink/50">
            {t('playground.inputs')}
          </h2>
          <button
            type="button"
            onClick={addRow}
            className="label border border-ink/30 px-4 py-3.5 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-paper"
          >
            + {t('playground.addRow')}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="label text-ink/50">{t('playground.labels.menuName')}</span>
            <input
              type="text"
              value={menuName}
              onChange={(event) => setMenuName(event.target.value)}
              className={FIELD}
            />
          </label>

          <div>
            <span className="label flex items-baseline justify-between gap-3 text-ink/50">
              {t('playground.labels.targetFoodCost')}
              <span className="font-display text-lg tabular-nums text-accent">
                {targetFoodCost}%
              </span>
            </span>
            <input
              type="range"
              min={10}
              max={50}
              step={1}
              value={targetFoodCost}
              aria-label={t('playground.labels.targetFoodCost')}
              onChange={(event) => setTargetFoodCost(Number(event.target.value))}
              className="mt-4 w-full cursor-pointer accent-[var(--accent)]"
            />
          </div>

          <label className="block">
            <span className="label text-ink/50">{t('playground.labels.targetPrice')}</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={targetPrice}
              onChange={(event) => setTargetPrice(Number(event.target.value))}
              className={NUMBER_FIELD}
            />
          </label>
        </div>

        {/* Ingredient rows: two columns on phones, a six-column hairline table
            from lg. Every label stays visible at every breakpoint. */}
        <ul className="mt-10 flex flex-col">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className="grid grid-cols-2 gap-x-5 gap-y-5 border-b hairline border-b-ink/15 py-6 lg:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))_auto] lg:items-end lg:gap-4"
            >
              <label className="col-span-2 block lg:col-span-1">
                <span className="label text-ink/50">
                  <span className="mr-2 text-ink/30">{String(index + 1).padStart(2, '0')}</span>
                  {t('playground.labels.ingredientName')}
                </span>
                <input
                  type="text"
                  value={row.name}
                  onChange={(event) => updateRow(row.id, { name: event.target.value })}
                  className={FIELD}
                />
              </label>

              <label className="block">
                <span className="label text-ink/50">{t('playground.labels.purchasePrice')}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.purchasePrice}
                  onChange={(event) => updateRow(row.id, { purchasePrice: event.target.value })}
                  className={NUMBER_FIELD}
                />
              </label>

              <label className="block">
                <span className="label text-ink/50">{t('playground.labels.packageVolume')}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.packageVolume}
                  onChange={(event) => updateRow(row.id, { packageVolume: event.target.value })}
                  className={NUMBER_FIELD}
                />
              </label>

              <label className="block">
                <span className="label text-ink/50">{t('playground.labels.quantityUsed')}</span>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={row.quantityUsed}
                  onChange={(event) => updateRow(row.id, { quantityUsed: event.target.value })}
                  className={NUMBER_FIELD}
                />
              </label>

              <label className="block">
                <span className="label text-ink/50">{t('playground.labels.yield')}</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  inputMode="decimal"
                  value={row.yieldPercent}
                  onChange={(event) => updateRow(row.id, { yieldPercent: event.target.value })}
                  className={NUMBER_FIELD}
                />
              </label>

              <div className="col-span-2 flex justify-end lg:col-span-1">
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="label flex min-h-[44px] items-center text-ink/45 transition-colors duration-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ✕ {t('playground.removeRow')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── RESULTS ────────────────────────────────────────────────────────── */}
      <aside
        aria-labelledby="playground-results-heading"
        className="border border-ink/25 p-6 sm:p-8 lg:sticky lg:top-28 lg:self-start"
      >
        <div className="flex items-baseline justify-between gap-4 border-b hairline border-b-ink/20 pb-4">
          <h2 id="playground-results-heading" className="label text-ink/50">
            {t('playground.results')}
          </h2>
          <p className="label truncate text-ink/35">{menuName}</p>
        </div>

        <dl className="mt-8 flex flex-col gap-9" aria-live="polite">
          <div>
            <dt className="label text-ink/50">{t('playground.kpis.totalCogs')}</dt>
            <dd className="mt-3 font-display text-[clamp(1.9rem,7vw,2.75rem)] leading-none tracking-tight tabular-nums">
              {formatRupiah(result.totalCogs, lang)}
            </dd>
          </div>

          <div>
            <dt className="label text-ink/50">{t('playground.kpis.actualRatio')}</dt>
            <dd className="mt-3 font-display text-[clamp(1.9rem,7vw,2.75rem)] leading-none tracking-tight tabular-nums">
              {result.actualFoodCostPercent === null ? '—' : `${result.actualFoodCostPercent}%`}
            </dd>
            {result.status && (
              <span
                className={`label mt-4 inline-flex items-center gap-2 border px-3 py-2 transition-colors duration-300 ${STATUS_STYLE[result.status]}`}
              >
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {t(`playground.status.${result.status}`)}
              </span>
            )}
          </div>

          <div>
            <dt className="label text-ink/50">{t('playground.kpis.recommendedPrice')}</dt>
            <dd className="mt-3 font-display text-[clamp(1.9rem,7vw,2.75rem)] leading-none tracking-tight tabular-nums text-accent">
              {result.recommendedSellingPrice === null
                ? '—'
                : formatRupiah(result.recommendedSellingPrice, lang)}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
