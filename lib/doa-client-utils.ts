// Client-side utilities for doa favorites (localStorage) and slug generation

import { DoaItem } from "@/types/doa";

const FAVORITES_KEY = 'bekhair_doa_favorites';
const GROUP_FAVORITES_KEY = 'bekhair_doa_group_favorites';

// Helper function to create URL-friendly slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate URL-friendly slug for doa
export const generateDoaSlug = (doa: DoaItem): string => {
  return createSlug(doa.nama);
};

// Generate slug for groups
export const generateGroupSlug = (groupName: string): string => {
  return createSlug(groupName);
};

const safeWindow = () => typeof window !== 'undefined' ? window : null;

export const getFavoriteIds = (): string[] => {
  const win = safeWindow();
  if (!win) return [];
  try {
    const raw = win.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export const setFavoriteIds = (slugs: string[]) => {
  const win = safeWindow();
  if (!win) return;
  try {
    win.localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(new Set(slugs))));
    // Notify listeners within same tab
    if (typeof win.dispatchEvent === 'function') {
      win.dispatchEvent(new CustomEvent('doa-favorites-changed'));
    }
  } catch {}
};

export const isFavorite = (slug: string): boolean => {
  const slugs = getFavoriteIds();
  return slugs.includes(slug);
};

export const toggleFavorite = (slug: string): boolean => {
  const slugs = new Set(getFavoriteIds());
  if (slugs.has(slug)) {
    slugs.delete(slug);
  } else {
    slugs.add(slug);
  }
  setFavoriteIds(Array.from(slugs));
  return slugs.has(slug);
};

export const getFavoriteGroupSlugs = (): string[] => {
  const win = safeWindow();
  if (!win) return [];
  try {
    const raw = win.localStorage.getItem(GROUP_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export const setFavoriteGroupSlugs = (slugs: string[]) => {
  const win = safeWindow();
  if (!win) return;
  try {
    win.localStorage.setItem(GROUP_FAVORITES_KEY, JSON.stringify(Array.from(new Set(slugs))));
    if (typeof win.dispatchEvent === 'function') {
      // Reuse same event so listeners refresh once
      win.dispatchEvent(new CustomEvent('doa-favorites-changed'));
    }
  } catch {}
};

export const isGroupFavorite = (groupSlug: string): boolean => {
  const slugs = getFavoriteGroupSlugs();
  return slugs.includes(groupSlug);
};

export const toggleFavoriteGroup = (groupSlug: string): boolean => {
  const set = new Set(getFavoriteGroupSlugs());
  if (set.has(groupSlug)) {
    set.delete(groupSlug);
  } else {
    set.add(groupSlug);
  }
  setFavoriteGroupSlugs(Array.from(set));
  return set.has(groupSlug);
};