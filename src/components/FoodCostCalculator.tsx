import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../i18n/config';
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

const INPUT_CLASS =
  'w-full border border-[color:var(--card-border)] bg-transparent px-2 py-1.5 text-[0.7rem] focus:border-[var(--accent)] focus:outline-none';

const STATUS_BADGE_CLASS: Record<FoodCostStatus, string> = {
  healthy: 'border-[color:var(--status-ok)] text-[var(--status-ok)]',
  warning: 'border-[color:var(--status-warn)] text-[var(--status-warn)]',
  critical: 'border-[color:var(--status-crit)] text-[var(--status-crit)]',
};

function newRow(defaultName: string): IngredientRow {
  return {
    id: crypto.randomUUID(),
    name: defaultName,
    purchasePrice: '',
    packageVolume: '',
    quantityUsed: '',
    yieldPercent: '100',
  };
}

export function FoodCostCalculator() {
  const { t, i18n } = useTranslation();
  const locale = normalizeLanguage(i18n.language);

  const [menuName, setMenuName] = useState(() => t('playground.defaults.menuItem'));
  const [targetFoodCost, setTargetFoodCost] = useState(30);
  const [targetPrice, setTargetPrice] = useState(25000);
  const [rows, setRows] = useState<IngredientRow[]>(() => [
    newRow(t('playground.defaults.ingredientName')),
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
    [rows, targetPrice, targetFoodCost],
  );

  function updateRow(id: string, patch: Partial<IngredientRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <section id="playground" className="py-24">
      <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">{t('nav.playground')}</p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-[0.03em]">
        {t('playground.title')}
      </h2>
      <p className="mt-2 text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
        {t('playground.tagline')}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <label className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            {t('playground.labels.menuName')}
          </label>
          <input
            type="text"
            value={menuName}
            onChange={(event) => setMenuName(event.target.value)}
            className={`${INPUT_CLASS} mt-2`}
          />

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t('playground.labels.targetFoodCost')}
              </label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={targetFoodCost}
                  onChange={(event) => setTargetFoodCost(Number(event.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
                <span className="w-10 text-right font-[family-name:var(--font-display)] text-[1.4rem] text-[var(--accent)]">
                  {targetFoodCost}%
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t('playground.labels.targetPrice')}
              </label>
              <input
                type="number"
                min={0}
                value={targetPrice}
                onChange={(event) => setTargetPrice(Number(event.target.value))}
                className={`${INPUT_CLASS} mt-2`}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t('playground.labels.ingredients')}
              </p>
              <button
                type="button"
                onClick={() => setRows((current) => [...current, newRow(t('playground.defaults.ingredientName'))])}
                className="border border-[var(--accent)] px-3 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--bg)]"
              >
                + {t('playground.addRow')}
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {rows.map((row, index) => (
                <fieldset
                  key={row.id}
                  className="grid grid-cols-2 items-end gap-3 border border-[color:var(--card-border)] p-3 sm:grid-cols-6"
                >
                  <legend className="sr-only">{`${t('playground.labels.ingredients')} ${index + 1}`}</legend>
                  <div className="col-span-2">
                    <label className="block text-[0.5rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {t('playground.labels.ingredientName')}
                    </label>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(event) => updateRow(row.id, { name: event.target.value })}
                      className={`${INPUT_CLASS} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-[0.5rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {t('playground.labels.purchasePrice')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={row.purchasePrice}
                      onChange={(event) => updateRow(row.id, { purchasePrice: event.target.value })}
                      className={`${INPUT_CLASS} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-[0.5rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {t('playground.labels.packageVolume')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={row.packageVolume}
                      onChange={(event) => updateRow(row.id, { packageVolume: event.target.value })}
                      className={`${INPUT_CLASS} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-[0.5rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {t('playground.labels.quantityUsed')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={row.quantityUsed}
                      onChange={(event) => updateRow(row.id, { quantityUsed: event.target.value })}
                      className={`${INPUT_CLASS} mt-1`}
                    />
                  </div>
                  <div>
                    <label className="block text-[0.5rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {t('playground.labels.yield')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.yieldPercent}
                      onChange={(event) => updateRow(row.id, { yieldPercent: event.target.value })}
                      className={`${INPUT_CLASS} mt-1`}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end sm:col-span-6">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--fg)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ✕ {t('playground.removeRow')}
                    </button>
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-[0.7rem] leading-[1.7] text-[var(--muted)]">
            {t('playground.credibility')}
          </p>
        </div>

        <aside className="border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-6 lg:self-start">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-[var(--muted)]">
            {t('playground.title')} — {t('playground.tagline')}
          </p>

          <dl className="mt-6 space-y-6">
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t('playground.kpis.totalCogs')}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-[2.2rem] leading-none text-[var(--fg)]">
                {formatRupiah(result.totalCogs, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t('playground.kpis.actualRatio')}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-[2.2rem] leading-none text-[var(--fg)]">
                {result.actualFoodCostPercent === null ? '—' : `${result.actualFoodCostPercent}%`}
              </dd>
              {result.status && (
                <span
                  className={`mt-3 inline-flex items-center gap-2 border px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] ${STATUS_BADGE_CLASS[result.status]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  {t(`playground.status.${result.status}`)}
                </span>
              )}
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                {t('playground.kpis.recommendedPrice')}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-[2.2rem] leading-none text-[var(--accent)]">
                {result.recommendedSellingPrice === null
                  ? '—'
                  : formatRupiah(result.recommendedSellingPrice, locale)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}