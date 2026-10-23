import { useTranslation } from 'react-i18next';

/** Shape of one entry in `projects.items` in the locale files. */
export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  tech: string[];
  href: string;
  image: string;
  badge?: string;
};

/** URL slugs are stable and language-independent, so links never break when
 *  the visitor switches locale. Keyed by the ids used in the locale files. */
export const PROJECT_SLUGS: Record<string, string> = {
  hanania: 'rekam-jejak-hanania',
  'akar-jogja': 'akar-jogja',
  bliho: 'bliho',
  rms: 'revenue-management-system',
};

export function slugForProject(id: string): string {
  return PROJECT_SLUGS[id] ?? id;
}

export function projectIdFromSlug(slug: string): string | undefined {
  return Object.keys(PROJECT_SLUGS).find((id) => PROJECT_SLUGS[id] === slug);
}

/** The four project cards, translated, with slugs and 01-based indices. */
export function useProjects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as ProjectItem[];

  return items.map((item, i) => ({
    ...item,
    index: String(i + 1).padStart(2, '0'),
    slug: slugForProject(item.id),
  }));
}
