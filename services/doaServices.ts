import { DoaItem, DoaTabType, DoaSearchResult, DoaTimelineSection } from "@/types/doa";
import { 
  getAllDoa as getAllDoaFromMDX,
  getDoaByGroup as getDoaByGroupFromMDX,
  getDoaGroups as getDoaGroupsFromMDX,
  generateDoaSlug,
  generateGroupSlug,
  getDoaBySlug as getDoaBySlugFromMDX
} from "@/lib/doa-utils";
import { 
  getFavoriteIds, 
  getFavoriteGroupSlugs
} from "@/lib/doa-client-utils";
import { sehariHariMapping } from "@/lib/doa-mapping";
import { DoaSearchEngine } from "@/lib/doa-search-engine";

// MDX-based data access
export const getAllDoa = async (): Promise<DoaItem[]> => {
  return await getAllDoaFromMDX();
};


export const getDoaByGroup = async (groupName: string): Promise<DoaItem[]> => {
  return await getDoaByGroupFromMDX(groupName);
};


// Categorize doa for different tabs
export const categorizeDoaForTabs = async (): Promise<Record<DoaTabType, DoaItem[]>> => {
  const allDoa = await getAllDoa();

  // Get all slugs and group names from sehari-hari mapping
  const sehariHariItems = sehariHariMapping.flatMap(section => section.list);
  
  // Filter doa based on the mapping (includes both individual slugs and group names)
  const seharihariDoa = allDoa.filter(doa => {
    // Check if it's in the list as an individual slug
    if (sehariHariItems.includes(doa.slug)) {
      return true;
    }
    
    // Check if it belongs to a group that's in the list
    return sehariHariItems.some(item => {
      // If item contains spaces and starts with uppercase, it's likely a group name
      if (item.includes(" ") && item[0] === item[0].toUpperCase()) {
        return doa.grup === item;
      }
      return false;
    });
  });

  return {
    'sehari-hari': seharihariDoa,
    'semua': allDoa,
    'favorit': [] // Populated dynamically from localStorage via getFavoriteDoa()
  };
};

// Get unique groups for categorization
export const getDoaGroups = async (): Promise<string[]> => {
  return await getDoaGroupsFromMDX();
};

// Enhanced search functionality with semantic understanding
let searchEngine: DoaSearchEngine | null = null;

const getSearchEngine = async (): Promise<DoaSearchEngine> => {
  if (!searchEngine) {
    const allDoa = await getAllDoa();
    searchEngine = new DoaSearchEngine(allDoa);
  }
  return searchEngine;
};

export const searchDoa = async (query: string): Promise<DoaSearchResult[]> => {
  if (!query || query.length < 2) return [];
  
  const engine = await getSearchEngine();
  return engine.search(query);
};

// New function for search suggestions
export const getSearchSuggestions = async (partialQuery: string, limit: number = 5): Promise<string[]> => {
  if (!partialQuery || partialQuery.length < 1) return [];
  
  const engine = await getSearchEngine();
  return engine.getSuggestions(partialQuery, limit);
};

// Get doa by slug
export const getDoaBySlug = async (slug: string): Promise<DoaItem | undefined> => {
  return await getDoaBySlugFromMDX(slug);
};

// Export slug generators from doa-utils
export { generateDoaSlug, generateGroupSlug };

// Export mapping for external use
export { sehariHariMapping };

// Timeline organization for daily doa with group support
export const organizeDoaByTimeline = (doaList: DoaItem[]) => {
  const timelineMap: Record<string, DoaTimelineSection> = {
    pagi: {
      key: 'pagi',
      label: 'Pagi',
      icon: '🌅',
      items: [],
      groups: []
    },
    siang: {
      key: 'siang', 
      label: 'Siang',
      icon: '🌞',
      items: [],
      groups: []
    },
    sore: {
      key: 'sore',
      label: 'Sore', 
      icon: '🌆',
      items: [],
      groups: []
    },
    malam: {
      key: 'malam',
      label: 'Malam',
      icon: '🌙', 
      items: [],
      groups: []
    }
  };

  // Group doa by grup name
  const groupedDoa = doaList.reduce((acc, doa) => {
    if (!acc[doa.grup]) {
      acc[doa.grup] = [];
    }
    acc[doa.grup].push(doa);
    return acc;
  }, {} as Record<string, DoaItem[]>);

  // Process each group
  Object.entries(groupedDoa).forEach(([grupName, doaItems]) => {
    const lowerGrupName = grupName.toLowerCase();
    const firstDoa = doaItems[0];
    const lowerContent = [firstDoa.nama, firstDoa.grup, ...firstDoa.tag].join(' ').toLowerCase();
    
    let targetSection: DoaTimelineSection;
    
    // Determine which time section this group belongs to
    if (lowerGrupName.includes('dzikir pagi') || lowerContent.includes('pagi') || lowerContent.includes('bangun') || lowerContent.includes('subuh')) {
      targetSection = timelineMap.pagi;
    } else if (lowerGrupName.includes('dzikir petang') || lowerContent.includes('sore') || lowerContent.includes('petang') || lowerContent.includes('maghrib') || lowerContent.includes('ashar')) {
      targetSection = timelineMap.sore;
    } else if (lowerContent.includes('malam') || lowerContent.includes('tidur') || lowerContent.includes('isya')) {
      targetSection = timelineMap.malam;
    } else {
      // Default to siang for general daily activities
      targetSection = timelineMap.siang;
    }
    
    // Handle special group cases (Dzikir Pagi/Petang)
    if (lowerGrupName.includes('dzikir pagi') || lowerGrupName.includes('dzikir petang')) {
      targetSection.groups.push({
        name: grupName,
        items: doaItems,
        slug: generateGroupSlug(grupName)
      });
    } else {
      // Add individual doa items for other groups
      targetSection.items.push(...doaItems);
    }
  });

  return timelineMap;
};


export const getFavoriteDoa = async (): Promise<DoaItem[]> => {
  const slugs = new Set(getFavoriteIds());
  if (slugs.size === 0) return [];
  const all = await getAllDoa();
  // Preserve the saved order by slugs list
  const orderedSlugs = getFavoriteIds();
  const bySlug = new Map(all.map((d) => [d.slug, d] as const));
  return orderedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as DoaItem[];
};


export const getAllGroups = async (): Promise<import("@/types/doa").DoaGroup[]> => {
  const names = await getDoaGroups();
  const groups = await Promise.all(
    names.map(async (name) => ({
      name,
      items: await getDoaByGroup(name),
      slug: generateGroupSlug(name)
    }))
  );
  return groups;
};

export const getFavoriteGroups = async (): Promise<import("@/types/doa").DoaGroup[]> => {
  const slugs = getFavoriteGroupSlugs();
  if (slugs.length === 0) return [];
  const allGroups = await getAllGroups();
  const bySlug = new Map(allGroups.map((g) => [g.slug, g] as const));
  // Preserve saved order
  return slugs.map((s) => bySlug.get(s)).filter(Boolean) as import("@/types/doa").DoaGroup[];
};