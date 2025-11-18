import { event } from '@/components/analytics/google-analytics';

// Track common user interactions
export const trackEvent = {
  // Quran interactions
  surahView: (surahName: string, surahNumber: number) => {
    event({
      action: 'surah_view',
      category: 'quran',
      label: `${surahNumber}_${surahName}`,
    });
  },

  // Prayer times interactions
  prayerTimeView: (location: string) => {
    event({
      action: 'prayer_time_view',
      category: 'prayer_times',
      label: location,
    });
  },

  // Qibla direction
  qiblaView: (location: string) => {
    event({
      action: 'qibla_view',
      category: 'qibla',
      label: location,
    });
  },

  // Hafalan (memorization) interactions
  hafalanStart: (surahName: string, targetType: string) => {
    event({
      action: 'hafalan_start',
      category: 'hafalan',
      label: `${targetType}_${surahName}`,
    });
  },

  hafalanComplete: (surahName: string, targetType: string) => {
    event({
      action: 'hafalan_complete',
      category: 'hafalan',
      label: `${targetType}_${surahName}`,
    });
  },

  // Blog interactions
  blogView: (title: string) => {
    event({
      action: 'blog_view',
      category: 'blog',
      label: title,
    });
  },

  // Download/External link clicks
  externalLink: (url: string, context: string) => {
    event({
      action: 'external_link_click',
      category: 'engagement',
      label: `${context}_${url}`,
    });
  },

  // Search actions
  search: (query: string, category: string) => {
    event({
      action: 'search',
      category: 'search',
      label: `${category}_${query}`,
    });
  },
};