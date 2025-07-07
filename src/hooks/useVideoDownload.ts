import { Video } from '../services/youtubeApi';
import { toast } from 'sonner';

export const useVideoDownload = () => {
  const downloadVideo = async (video: Video, format: 'mp3' | 'mp4') => {
    toast.error('Video download is currently disabled.');
    // Apify-based download logic removed for security reasons.
    // To re-enable downloads, implement a secure download method here.
    return;
    /*
    try {
      toast.info(`Starting ${format.toUpperCase()} download...`);
      
      const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      
      // Create Apify actor run for YouTube downloader
      const actorId = 'apify/youtube-url-downloader';
      
      const runInput = {
        videoUrls: [videoUrl],
        downloadVideo: format === 'mp4',
        downloadAudio: format === 'mp3',
        audioFormat: format === 'mp3' ? 'mp3' : undefined,
        videoFormat: format === 'mp4' ? 'mp4' : undefined
      };

      // Start the actor run
      const runResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_API_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!runResponse.ok) {
        throw new Error(`Failed to start download: ${runResponse.statusText}`);
      }

      const runData = await runResponse.json();
      const runId = runData.data.id;

      toast.info('Processing download, please wait...');

      // Poll for completion
      let completed = false;
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max

      while (!completed && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        
        const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`);
        const statusData = await statusResponse.json();
        
        if (statusData.data.status === 'SUCCEEDED') {
          completed = true;
          
          // Get the results
          const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${statusData.data.defaultDatasetId}/items?token=${APIFY_API_TOKEN}`);
          const results = await resultsResponse.json();
          
          if (results.length > 0 && results[0].files) {
            const files = results[0].files;
            const downloadUrl = format === 'mp3' ? files.audio : files.video;
            
            if (downloadUrl) {
              // Create download link
              const videoTitle = video.snippet.title.replace(/[^a-zA-Z0-9]/g, '_');
              const fileName = `${videoTitle}.${format}`;
              
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = fileName;
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              
              // Store download history
              const downloads = JSON.parse(localStorage.getItem(`downloaded_${format}`) || '[]');
              downloads.push({
                ...video,
                downloadedAt: new Date().toISOString(),
                format,
                downloadUrl
              });
              localStorage.setItem(`downloaded_${format}`, JSON.stringify(downloads));
              
              toast.success(`${format.toUpperCase()} download completed!`);
              console.log(`Downloaded ${format.toUpperCase()}: ${video.snippet.title}`);
            } else {
              throw new Error(`No ${format} file available`);
            }
          } else {
            throw new Error('No download results found');
          }
        } else if (statusData.data.status === 'FAILED') {
          throw new Error('Download failed');
        }
        
        attempts++;
      }
      
      if (!completed) {
        throw new Error('Download timeout - please try again');
      }
      
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      toast.error(`Failed to download ${format.toUpperCase()}: ${error.message}`);
    }
    */
  };

  return { downloadVideo };
};
