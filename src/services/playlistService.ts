import { Playlist, AppNotification, UserProfile } from '../types';
import { initialPlaylists, initialNotifications, initialUser } from './videoService';
import { StorageService } from './storage';

const STORAGE_KEYS = {
  PLAYLISTS: 'yt_user_playlists',
  NOTIFICATIONS: 'yt_user_notifications',
  USER: 'yt_user_profile',
  DARK_MODE: 'yt_dark_mode'
};

export const PlaylistService = {
  getPlaylists(): Playlist[] {
    return StorageService.get<Playlist[]>(STORAGE_KEYS.PLAYLISTS, initialPlaylists);
  },

  savePlaylists(playlists: Playlist[]): void {
    StorageService.set(STORAGE_KEYS.PLAYLISTS, playlists);
  },

  createPlaylist(playlists: Playlist[], name: string, isPrivate: boolean = false, initialVideoId?: string): Playlist[] {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name: name.trim(),
      videoIds: initialVideoId ? [initialVideoId] : [],
      createdAt: 'Hoy',
      isPrivate
    };

    const updated = [...playlists, newPlaylist];
    this.savePlaylists(updated);
    return updated;
  },

  addVideoToPlaylist(playlists: Playlist[], playlistId: string, videoId: string): Playlist[] {
    const updated = playlists.map(pl => {
      if (pl.id === playlistId && !pl.videoIds.includes(videoId)) {
        return {
          ...pl,
          videoIds: [...pl.videoIds, videoId]
        };
      }
      return pl;
    });

    this.savePlaylists(updated);
    return updated;
  },

  removeVideoFromPlaylist(playlists: Playlist[], playlistId: string, videoId: string): Playlist[] {
    const updated = playlists.map(pl => {
      if (pl.id === playlistId) {
        return {
          ...pl,
          videoIds: pl.videoIds.filter(id => id !== videoId)
        };
      }
      return pl;
    });

    this.savePlaylists(updated);
    return updated;
  }
};

export const NotificationService = {
  getNotifications(): AppNotification[] {
    return StorageService.get<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },

  saveNotifications(notifications: AppNotification[]): void {
    StorageService.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  markAsRead(notifications: AppNotification[], notificationId: string): AppNotification[] {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.saveNotifications(updated);
    return updated;
  },

  markAllAsRead(notifications: AppNotification[]): AppNotification[] {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    this.saveNotifications(updated);
    return updated;
  },

  clearAll(): AppNotification[] {
    this.saveNotifications([]);
    return [];
  }
};

export const UserService = {
  getUser(): UserProfile {
    return StorageService.get<UserProfile>(STORAGE_KEYS.USER, initialUser);
  },

  saveUser(user: UserProfile): void {
    StorageService.set(STORAGE_KEYS.USER, user);
  },

  getDarkMode(): boolean {
    return StorageService.get<boolean>(STORAGE_KEYS.DARK_MODE, true);
  },

  saveDarkMode(isDark: boolean): void {
    StorageService.set(STORAGE_KEYS.DARK_MODE, isDark);
  }
};
