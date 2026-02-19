import { PostMeta, SeriesNavigation } from "@/types/blog";

/**
 * Get all series hub posts
 */
export function getSeriesHubs(posts: PostMeta[]): PostMeta[] {
  return posts.filter(post => post.isSeriesHub === true);
}

/**
 * Get series hub by series slug
 */
export function getSeriesHub(posts: PostMeta[], seriesSlug: string): PostMeta | null {
  return posts.find(post => 
    post.isSeriesHub === true && post.seriesSlug === seriesSlug
  ) || null;
}

/**
 * Get all posts in a specific series, sorted by order
 */
export function getSeriesPosts(posts: PostMeta[], seriesSlug: string): PostMeta[] {
  return posts
    .filter(post => post.series === seriesSlug)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

/**
 * Check if a post belongs to a series
 */
export function isSeriesPost(post: PostMeta): boolean {
  return !!post.series;
}

/**
 * Check if a post is a series hub
 */
export function isSeriesHub(post: PostMeta): boolean {
  return post.isSeriesHub === true;
}

/**
 * Get navigation data for a series post
 */
export function getSeriesNavigation(
  posts: PostMeta[], 
  currentPost: PostMeta
): SeriesNavigation | null {
  if (!isSeriesPost(currentPost) || !currentPost.series) {
    return null;
  }

  const seriesSlug = currentPost.series;
  const seriesHub = getSeriesHub(posts, seriesSlug);
  const allSeriesPosts = getSeriesPosts(posts, seriesSlug);
  
  const currentIndex = allSeriesPosts.findIndex(post => post.slug === currentPost.slug);
  
  if (currentIndex === -1) {
    return null;
  }

  const previousPost = currentIndex > 0 ? allSeriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allSeriesPosts.length - 1 ? allSeriesPosts[currentIndex + 1] : null;

  return {
    seriesHub,
    previousPost,
    nextPost,
    currentPosition: currentIndex + 1,
    totalPosts: allSeriesPosts.length,
    allSeriesPosts
  };
}

/**
 * Get all series with their metadata
 */
export function getAllSeries(posts: PostMeta[]): Array<{
  hub: PostMeta;
  posts: PostMeta[];
  totalPosts: number;
}> {
  const seriesHubs = getSeriesHubs(posts);
  
  return seriesHubs.map(hub => {
    const seriesPosts = hub.seriesSlug ? getSeriesPosts(posts, hub.seriesSlug) : [];
    
    return {
      hub,
      posts: seriesPosts,
      totalPosts: seriesPosts.length
    };
  });
}

/**
 * Get series overview data for a specific series
 */
export function getSeriesOverview(posts: PostMeta[], seriesSlug: string) {
  const hub = getSeriesHub(posts, seriesSlug);
  const seriesPosts = getSeriesPosts(posts, seriesSlug);
  
  if (!hub) {
    return null;
  }

  return {
    hub,
    posts: seriesPosts,
    totalPosts: seriesPosts.length,
    totalReadingTime: seriesPosts.reduce((total, post) => {
      const time = parseInt(post.readingTime?.replace(/\D/g, '') || '0');
      return total + time;
    }, 0)
  };
}