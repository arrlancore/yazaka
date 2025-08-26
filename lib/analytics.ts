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

  // Catatan HSI interactions
  catatanView: (title: string, series: string) => {
    event({
      action: 'catatan_view',
      category: 'catatan_hsi',
      label: `${series}_${title}`,
    });
  },

  audioPlay: (title: string, series: string) => {
    event({
      action: 'audio_play',
      category: 'catatan_hsi',
      label: `${series}_${title}`,
    });
  },

  textJump: (timestamp: string, title: string) => {
    event({
      action: 'text_jump',
      category: 'catatan_hsi',
      label: `${title}_${timestamp}`,
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