export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: number;
  category: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  likes: number;
  dislikes: number;
  description: string;
  publishedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  isSubscribed: boolean;
  description?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  timestamp: string;
  isLikedByMe?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
  createdAt: string;
  isPrivate: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  videoId?: string;
  isRead: boolean;
  type: 'upload' | 'comment' | 'system' | 'like';
}

export interface UserProfile {
  isAuthenticated: boolean;
  username: string;
  name?: string;
  avatar: string;
  biometricRegistered: boolean;
  biometricType?: 'touchid' | 'faceid';
}

export type ViewMode = 'home' | 'video' | 'playlists' | 'subscriptions' | 'privacy';

export type ConnectionSpeed = 'fast' | 'slow';
