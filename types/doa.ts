export interface DoaItem {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

export interface DoaApiResponse {
  status: string;
  total: number;
  data: DoaItem[];
}

export interface DoaCategory {
  name: string;
  items: DoaItem[];
}

export interface DoaContextMap {
  [key: string]: {
    [pattern: string]: number[];
  };
}

export interface DoaSearchResult {
  item: DoaItem;
  score: number;
}

export type DoaTabType = 'sehari-hari' | 'situasional' | 'favorit';

export interface DoaFavorite {
  id: number;
  dateAdded: string;
}

export interface DoaGroup {
  name: string;
  items: DoaItem[];
  slug: string;
}

export interface DoaTimelineSection {
  key: string;
  label: string;
  icon: string;
  items: DoaItem[];
  groups: DoaGroup[];
}