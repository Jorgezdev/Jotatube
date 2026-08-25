import { Video, Channel, VideoComment, Playlist, AppNotification, UserProfile } from '../types';
import { INITIAL_VIDEOS, INITIAL_CHANNELS, INITIAL_COMMENTS } from '../data/videos';
import { StorageService } from './storage';

export const initialPlaylists: Playlist[] = [
  {
    id: 'pl-favs',
    name: 'Favoritos de Ciencia y Cine',
    videoIds: ['v-bunny', 'v-steel'],
    createdAt: 'Hace 1 mes',
    isPrivate: false
  },
  {
    id: 'pl-sports',
    name: 'Deportes Extremos',
    videoIds: ['v-escapes', 'v-subaru'],
    createdAt: 'Hace 2 semanas',
    isPrivate: true
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Nuevo video en Cineastas Pro',
    message: 'Se ha publicado "Tears of Steel - Cortometraje de Acción Real"',
    timestamp: 'Hace 2 horas',
    videoId: 'v-steel',
    isRead: false,
    type: 'upload'
  },
  {
    id: 'notif-2',
    title: 'Tendencia en Tecnología',
    message: 'Blender Open Movie ya superó los 4.5 millones de reproducciones.',
    timestamp: 'Hace 5 horas',
    videoId: 'v-bunny',
    isRead: false,
    type: 'system'
  }
];

export const initialUser: UserProfile = {
  isAuthenticated: true,
  username: '@developer_pro',
  name: 'Dev Principal',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  biometricRegistered: true,
  biometricType: 'touchid'
};

const STORAGE_KEYS = {
  VIDEOS: 'yt_videos_data',
  CHANNELS: 'yt_channels_data',
  LIKED: 'yt_liked_videos',
  DISLIKED: 'yt_disliked_videos'
};

export const VideoService = {
  getVideos(): Video[] {
    return StorageService.get<Video[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  },

  saveVideos(videos: Video[]): void {
    StorageService.set(STORAGE_KEYS.VIDEOS, videos);
  },

  getChannels(): Channel[] {
    return StorageService.get<Channel[]>(STORAGE_KEYS.CHANNELS, INITIAL_CHANNELS);
  },

  saveChannels(channels: Channel[]): void {
    StorageService.set(STORAGE_KEYS.CHANNELS, channels);
  },

  getLikedVideos(): string[] {
    return StorageService.get<string[]>(STORAGE_KEYS.LIKED, []);
  },

  saveLikedVideos(ids: string[]): void {
    StorageService.set(STORAGE_KEYS.LIKED, ids);
  },

  getDislikedVideos(): string[] {
    return StorageService.get<string[]>(STORAGE_KEYS.DISLIKED, []);
  },

  saveDislikedVideos(ids: string[]): void {
    StorageService.set(STORAGE_KEYS.DISLIKED, ids);
  },

  toggleLike(videoId: string, currentLiked: string[], currentDisliked: string[]) {
    let nextLiked: string[];
    let nextDisliked = currentDisliked.filter(id => id !== videoId);

    if (currentLiked.includes(videoId)) {
      nextLiked = currentLiked.filter(id => id !== videoId);
    } else {
      nextLiked = [...currentLiked, videoId];
    }

    this.saveLikedVideos(nextLiked);
    this.saveDislikedVideos(nextDisliked);

    return { liked: nextLiked, disliked: nextDisliked };
  },

  toggleDislike(videoId: string, currentLiked: string[], currentDisliked: string[]) {
    let nextDisliked: string[];
    let nextLiked = currentLiked.filter(id => id !== videoId);

    if (currentDisliked.includes(videoId)) {
      nextDisliked = currentDisliked.filter(id => id !== videoId);
    } else {
      nextDisliked = [...currentDisliked, videoId];
    }

    this.saveLikedVideos(nextLiked);
    this.saveDislikedVideos(nextDisliked);

    return { liked: nextLiked, disliked: nextDisliked };
  }
};
