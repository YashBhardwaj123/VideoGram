const API_KEY = 'AIzaSyBtjJqRFnmda_uYr8IdVaRaQLBHOGJMDTM';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

export interface VideoDetails extends Video {
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    commentCount: string;
  };
  snippet: Video['snippet'] & {
    categoryId: string;
    tags: string[];
  };
}

export const getIndianSuggestions = (): string[] => {
  return [
    'Bollywood songs 2024',
    'Indian cricket highlights',
    'Bollywood movies',
    'Indian cooking recipes',
    'Bhojpuri songs',
    'Telugu movies',
    'Tamil songs',
    'Indian classical music',
    'Punjabi songs',
    'Indian street food',
    'Bollywood dance',
    'Indian festivals',
    'Hindi comedy shows',
    'Indian travel vlogs',
    'Desi wedding songs'
  ];
};

export const searchVideos = async (query: string, maxResults: number = 20): Promise<Video[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&regionCode=IN&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const data = await response.json();
    const items = data.items || [];
    const videoIds = items.map((item: any) => item.id.videoId).filter(Boolean);
    if (videoIds.length === 0) return [];

    // Fetch video details for durations
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
    );
    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    const detailsData = await detailsResponse.json();
    const detailsMap: Record<string, any> = {};
    (detailsData.items || []).forEach((item: any) => {
      detailsMap[item.id] = item;
    });

    // Merge duration and statistics into each video
    return items.map((item: any) => {
      const details = detailsMap[item.id.videoId];
      return {
        ...item,
        contentDetails: details?.contentDetails,
        statistics: details?.statistics,
      };
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

export const getTrendingVideos = async (maxResults: number = 20): Promise<Video[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=IN&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending videos');
    }
    
    const data = await response.json();
    const items = data.items || [];
    const videoIds = items.map((item: any) => item.id).filter(Boolean);
    if (videoIds.length === 0) return [];

    // Fetch contentDetails for durations
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails&id=${videoIds.join(',')}&key=${API_KEY}`
    );
    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    const detailsData = await detailsResponse.json();
    const detailsMap: Record<string, any> = {};
    (detailsData.items || []).forEach((item: any) => {
      detailsMap[item.id] = item;
    });

    // Merge duration into each video
    return items.map((item: any) => {
      const details = detailsMap[item.id];
      return {
        id: { videoId: item.id },
        snippet: item.snippet,
        statistics: item.statistics,
        contentDetails: details?.contentDetails,
      };
    });
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
};

export const getVideoDetails = async (videoId: string): Promise<VideoDetails | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const data = await response.json();
    const video = data.items?.[0];
    
    if (!video) return null;
    
    return {
      id: { videoId: video.id },
      snippet: video.snippet,
      statistics: video.statistics
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};
