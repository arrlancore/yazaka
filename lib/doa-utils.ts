import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { DoaItem, DoaGroup } from "@/types/doa";

const DOA_PATH = path.join(process.cwd(), "content/doa/sources");

// Helper function to create URL-friendly slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get all MDX file paths recursively
function getDoaFilePaths(): { filePath: string; groupSlug: string; fileName: string }[] {
  const files: { filePath: string; groupSlug: string; fileName: string }[] = [];
  
  if (!fs.existsSync(DOA_PATH)) {
    return files;
  }
  
  const groupDirs = fs.readdirSync(DOA_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  groupDirs.forEach(groupSlug => {
    const groupPath = path.join(DOA_PATH, groupSlug);
    const mdxFiles = fs.readdirSync(groupPath)
      .filter(file => /\.mdx?$/.test(file));
    
    mdxFiles.forEach(fileName => {
      files.push({
        filePath: path.join(groupPath, fileName),
        groupSlug,
        fileName: fileName.replace(/\.mdx?$/, '')
      });
    });
  });
  
  return files;
}

// Parse single MDX file
function parseMDXFile(filePath: string): DoaItem | null {
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(source);
    
    return {
      ...data,
      tentang: content.trim() || data.tentang || ''
    } as DoaItem;
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error);
    return null;
  }
}

// Get all doa from MDX files
export async function getAllDoa(): Promise<DoaItem[]> {
  const filePaths = getDoaFilePaths();
  const doa: DoaItem[] = [];
  
  filePaths.forEach(({ filePath }) => {
    const doaItem = parseMDXFile(filePath);
    if (doaItem) {
      doa.push(doaItem);
    }
  });
  
  // Sort by group, then by order within each group
  return doa.sort((a, b) => {
    // First sort by group name
    const groupCompare = a.grup.localeCompare(b.grup);
    if (groupCompare !== 0) return groupCompare;
    
    // Then sort by order within the same group
    return (a.order || 0) - (b.order || 0);
  });
}

// Get doa by slug
export async function getDoaBySlug(slug: string): Promise<DoaItem | undefined> {
  const allDoa = await getAllDoa();
  return allDoa.find(doa => doa.slug === slug);
}

// Legacy function - kept for compatibility, but deprecated
export async function getDoaById(id: number): Promise<DoaItem | undefined> {
  console.warn('getDoaById is deprecated. Use getDoaBySlug instead.');
  // Try to find by order field (which replaced id)
  const allDoa = await getAllDoa();
  return allDoa.find(doa => doa.order === id);
}

// Get doa by group name (returns ordered by 'order' field)
export async function getDoaByGroup(groupName: string): Promise<DoaItem[]> {
  const allDoa = await getAllDoa();
  const groupDoa = allDoa.filter(doa => doa.grup === groupName);
  
  // Sort by order within the group
  return groupDoa.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get doa by group slug
export async function getDoaByGroupSlug(groupSlug: string): Promise<DoaItem[]> {
  const groupPath = path.join(DOA_PATH, groupSlug);
  
  if (!fs.existsSync(groupPath)) {
    return [];
  }
  
  const mdxFiles = fs.readdirSync(groupPath)
    .filter(file => /\.mdx?$/.test(file));
  
  const doa: DoaItem[] = [];
  
  mdxFiles.forEach(fileName => {
    const filePath = path.join(groupPath, fileName);
    const doaItem = parseMDXFile(filePath);
    if (doaItem) {
      doa.push(doaItem);
    }
  });
  
  // Sort by order within the group
  return doa.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get all available groups
export async function getAllGroups(): Promise<DoaGroup[]> {
  const allDoa = await getAllDoa();
  const groupMap = new Map<string, DoaItem[]>();
  
  allDoa.forEach(doa => {
    const grupSlug = createSlug(doa.grup);
    if (!groupMap.has(grupSlug)) {
      groupMap.set(grupSlug, []);
    }
    groupMap.get(grupSlug)!.push(doa);
  });
  
  return Array.from(groupMap.entries()).map(([slug, items]) => ({
    name: items[0].grup, // Use the original group name from first item
    slug,
    items
  }));
}

// Get unique group names
export async function getDoaGroups(): Promise<string[]> {
  const allDoa = await getAllDoa();
  const groups = [...new Set(allDoa.map(doa => doa.grup))];
  return groups.sort();
}

// Generate doa slug for individual doa
export function generateDoaSlug(doa: DoaItem): string {
  return createSlug(doa.nama);
}

// Generate group slug
export function generateGroupSlug(groupName: string): string {
  return createSlug(groupName);
}

// Note: getDoaBySlug is defined above (line 86-90)

// Search functionality (simplified - no Fuse.js needed)
export async function searchDoa(query: string): Promise<DoaItem[]> {
  if (!query || query.length < 2) return [];
  
  const allDoa = await getAllDoa();
  const lowerQuery = query.toLowerCase();
  
  return allDoa.filter(doa => {
    const searchableText = [
      doa.nama,
      doa.idn,
      doa.grup,
      doa.ar,
      doa.tr,
      ...(doa.tag || [])
    ].join(' ').toLowerCase();
    
    return searchableText.includes(lowerQuery);
  }).slice(0, 20); // Limit to 20 results
}

// Get available group slugs (for dynamic routing)
export async function getGroupSlugs(): Promise<string[]> {
  if (!fs.existsSync(DOA_PATH)) {
    return [];
  }
  
  return fs.readdirSync(DOA_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

export { createSlug };