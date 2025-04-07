export const getVideoPlayerPropertiesDefaults = () => ({
  src: "https://www.example.com/sample-video.mp4",
  width: "640px",
  height: "360px",
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  poster: "", 
  playbackRate: 1, 
  padding: "10px",
  margin: "0px",
  backgroundColor: "transparent",
  border: "1px solid #ccc",
  start: 0,
  end: 0, 
  showRelated: true,
});

export interface VideoPlayerPropertiesDefaults {
  src: string;
  width: string;
  height: string;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  poster: string;
  playbackRate: number;
  padding: string;
  margin: string;
  backgroundColor: string;
  border: string;
  start: number; 
  end: number; 
  showRelated: boolean; 
}