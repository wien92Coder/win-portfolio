import type { MouseEvent, ReactNode } from 'react';
import { useTransition } from '../context/TransitionContext';
import { useUI } from '../context/UIContext';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Cursor mode while hovering this link. */
  cursorMode?: 'link' | 'view';
  onClick?: () => void;
};

/**
 * Drop-in replacement for <Link> that routes through the transition overlay
 * instead of navigating instantly, and drives the custom cursor.
 * External URLs and modified clicks (new tab, middle click) fall through to
 * the browser so the link keeps behaving like a link.
 */
export function TransitionLink({ href, children, className, cursorMode = 'link', onClick }: Props) {
  const { navigateTo } = useTransition();
  const { setCursor, setMenuOpen } = useUI();

  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isExternal || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      onClick?.();
      return;
    }
    event.preventDefault();
    onClick?.();
    setMenuOpen(false);
    setCursor('default');
    navigateTo(href);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setCursor(cursorMode)}
      onMouseLeave={() => setCursor('default')}
      className={className}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
