import { DoaApiResponse, DoaItem, DoaCategory, DoaTabType, DoaSearchResult, DoaTimelineSection } from "@/types/doa";
import doaData from "@/content/doa/doa-collection.json";
import Fuse from "fuse.js";
import { populateContextMap, naturalLanguageKeywords } from "@/lib/doaContextMap";

// Static data access - no API calls needed
export const getAllDoa = (): DoaItem[] => {
  const data = doaData as DoaApiResponse;
  return data.data;
};

export const getDoaById = (id: number): DoaItem | undefined => {
  const allDoa = getAllDoa();
  return allDoa.find((doa) => doa.id === id);
};

export const getDoaByGroup = (groupName: string): DoaItem[] => {
  const allDoa = getAllDoa();
  return allDoa.filter((doa) => doa.grup === groupName);
};

// Categorize doa for different tabs
export const categorizeDoaForTabs = (): Record<DoaTabType, DoaItem[]> => {
  const allDoa = getAllDoa();

  // Daily routine doa (sehari-hari) - based on common daily activities
  const dailyKeywords = [
    'tidur', 'bangun', 'pagi', 'malam', 'makan', 'minum', 'wc', 'wudhu', 
    'keluar rumah', 'masuk rumah', 'kendaraan', 'perjalanan pendek'
  ];

  // Situational doa - everything else
  const seharihariDoa = allDoa.filter((doa) => {
    const lowerTags = doa.tag.map(tag => tag.toLowerCase());
    const lowerGrup = doa.grup.toLowerCase();
    const lowerNama = doa.nama.toLowerCase();
    
    return dailyKeywords.some(keyword => 
      lowerTags.some(tag => tag.includes(keyword)) ||
      lowerGrup.includes(keyword) ||
      lowerNama.includes(keyword)
    );
  });

  const situasionalDoa = allDoa.filter((doa) => !seharihariDoa.includes(doa));

  return {
    'sehari-hari': seharihariDoa,
    'situasional': situasionalDoa,
    'favorit': [] // Will be populated from localStorage
  };
};

// Get unique groups for categorization
export const getDoaGroups = (): string[] => {
  const allDoa = getAllDoa();
  const groups = [...new Set(allDoa.map((doa) => doa.grup))];
  return groups.sort();
};

// Enhanced search functionality with Fuse.js and context mapping
let fuseInstance: Fuse<DoaItem> | null = null;
let contextMapPopulated: any = null;

const initializeSearch = () => {
  if (!fuseInstance) {
    const allDoa = getAllDoa();
    
    // Fuse.js configuration for fuzzy search
    const fuseOptions = {
      keys: [
        { name: 'nama', weight: 1.0 },
        { name: 'idn', weight: 0.8 },
        { name: 'grup', weight: 0.6 },
        { name: 'tag', weight: 0.4 },
        { name: 'ar', weight: 0.3 },
        { name: 'tr', weight: 0.5 }
      ],
      threshold: 0.4, // Lower = more strict matching
      includeScore: true,
      minMatchCharLength: 2
    };
    
    fuseInstance = new Fuse(allDoa, fuseOptions);
    
    // Populate context map
    contextMapPopulated = populateContextMap(allDoa);
  }
  
  return { fuse: fuseInstance, contextMap: contextMapPopulated };
};

// Context-aware search
const getContextualDoa = (query: string): number[] => {
  const { contextMap } = initializeSearch();
  const lowerQuery = query.toLowerCase();
  const matchedIds: Set<number> = new Set();
  
  // Check against context patterns
  Object.values(contextMap as Record<string, Record<string, number[]>>).forEach((category) => {
    Object.entries(category).forEach(([pattern, ids]) => {
      const keywords = pattern.split('|');
      
      if (keywords.some(keyword => lowerQuery.includes(keyword.replace('_', ' ')))) {
        ids.forEach(id => matchedIds.add(id));
      }
    });
  });
  
  // Check natural language keywords
  Object.entries(naturalLanguageKeywords).forEach(([key, synonyms]) => {
    if (lowerQuery.includes(key) || synonyms.some(syn => lowerQuery.includes(syn))) {
      // Find related doa based on the context
      Object.values(contextMap as Record<string, Record<string, number[]>>).forEach((category) => {
        Object.entries(category).forEach(([pattern, ids]) => {
          if (pattern.includes(key)) {
            ids.forEach(id => matchedIds.add(id));
          }
        });
      });
    }
  });
  
  return Array.from(matchedIds);
};

export const searchDoa = (query: string): DoaSearchResult[] => {
  if (!query || query.length < 3) return [];
  
  const { fuse } = initializeSearch();
  const allDoa = getAllDoa();
  
  // Get contextual matches
  const contextualIds = getContextualDoa(query);
  
  // Get Fuse.js fuzzy search results
  const fuseResults = fuse.search(query);
  
  // Combine and score results
  const combinedResults = new Map<number, DoaSearchResult>();
  
  // Add contextual matches with high score
  contextualIds.forEach(id => {
    const doa = allDoa.find(d => d.id === id);
    if (doa && !combinedResults.has(id)) {
      combinedResults.set(id, {
        item: doa,
        score: 0.1 // High relevance for contextual matches
      });
    }
  });
  
  // Add fuzzy search results
  fuseResults.forEach(result => {
    const id = result.item.id;
    if (!combinedResults.has(id)) {
      combinedResults.set(id, {
        item: result.item,
        score: result.score || 1
      });
    } else {
      // Boost score for items that match both contextual and fuzzy
      const existing = combinedResults.get(id)!;
      existing.score = Math.min(existing.score * 0.5, 0.05);
    }
  });
  
  // Sort by score (lower score = better match) and limit results
  return Array.from(combinedResults.values())
    .sort((a, b) => a.score - b.score)
    .slice(0, 20); // Limit to top 20 results
};

// Generate URL-friendly slug for doa
export const generateDoaSlug = (doa: DoaItem): string => {
  return doa.nama
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Get doa by slug
export const getDoaBySlug = (slug: string): DoaItem | undefined => {
  const allDoa = getAllDoa();
  return allDoa.find(doa => generateDoaSlug(doa) === slug);
};

// Generate slug for groups
export const generateGroupSlug = (groupName: string): string => {
  return groupName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

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