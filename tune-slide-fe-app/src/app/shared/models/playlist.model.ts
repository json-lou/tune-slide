export interface Playlist {
  name: string;
  description: string;
  playlistSettings: PlaylistSettings;
  trackSettings: TrackSettings;
}

export interface PlaylistSettings {
  length: number;
  content: boolean;
  privacy: boolean;
}

export interface TrackSettings {
  acousticness: number;
  danceability: number;
  instrumentalness: number;
  tempo: number;
  valence: number;
}
