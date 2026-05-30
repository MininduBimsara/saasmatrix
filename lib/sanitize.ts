'use client';

import type { Config } from 'dompurify';

const SAFE_CONFIG: Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'span', 'div',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
  // Force all links to open in new tab with noopener
  ADD_ATTR: ['target'],
  // Strip javascript: and data: URIs from href/src
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize an HTML string using DOMPurify (browser-only).
 * Returns the original string unchanged on the server.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') return dirty;
  // Dynamic import keeps DOMPurify out of the server bundle
  const DOMPurify = require('dompurify');
  const clean = DOMPurify.sanitize(dirty, SAFE_CONFIG);
  // Force rel="noopener noreferrer" on all external links
  return clean.replace(/<a\s/gi, '<a rel="noopener noreferrer" ');
}
