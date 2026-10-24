/** Route table for the header, full-screen menu, and footer.
 *  Labels are translation keys so both locales stay in sync. */
export type NavItem = {
  href: string;
  key: string;
  metaKey: string;
  index: string;
  /** Preview image shown in the full-screen menu on hover. */
  image: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', key: 'menu.home', metaKey: 'menu.homeMeta', index: '01', image: '/portrait.jpg' },
  {
    href: '/work',
    key: 'menu.work',
    metaKey: 'menu.workMeta',
    index: '02',
    image: '/projects/rjHanania.webp',
  },
  {
    href: '/karya',
    key: 'menu.caseStudies',
    metaKey: 'menu.caseStudiesMeta',
    index: '03',
    image: '/images/healthcare-service.jpg',
  },
  {
    href: '/about',
    key: 'menu.studio',
    metaKey: 'menu.studioMeta',
    index: '04',
    image: '/photo.jpg',
  },
  {
    href: '/contact',
    key: 'menu.contact',
    metaKey: 'menu.contactMeta',
    index: '05',
    image: '/portrait.jpg',
  },
];
