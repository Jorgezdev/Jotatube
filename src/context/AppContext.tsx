import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Video,
  Channel,
  VideoComment,
  Playlist,
  AppNotification,
  UserProfile,
  ViewMode,
  ConnectionSpeed
} from '../types';
import {
  VideoService,
  CommentService,
  PlaylistService,
  NotificationService,
  UserService
} from '../services';

interface AppContextType {
  // UI & Navigation
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedVideo: Video | null;
  setSelectedVideo: (video: Video | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Data Collections
  videos: Video[];
  channels: Channel[];
  comments: VideoComment[];
  playlists: Playlist[];
  notifications: AppNotification[];
  user: UserProfile;

  // User Interactions & Actions
  likedVideos: string[];
  dislikedVideos: string[];
  toggleLike: (videoId: string) => void;
  toggleDislike: (videoId: string) => void;
  toggleSubscribe: (channelId: string) => void;
  addComment: (videoId: string, text: string) => void;
  toggleLikeComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
  createPlaylist: (name: string, isPrivate?: boolean, initialVideoId?: string) => void;
  addVideoToPlaylist: (playlistId: string, videoId: string) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Auth / Profile (Demo / Local)
  loginWithBiometrics: (name: string) => Promise<boolean>;
  registerBiometrics: (name: string, type: 'touchid' | 'faceid') => Promise<boolean>;
  logout: () => void;

  // Debug & Network Modulation Demo
  connectionSpeed: ConnectionSpeed;
  setConnectionSpeed: (speed: ConnectionSpeed) => void;
  cacheSavedBytes: number;
  addCacheBytes: (bytes: number) => void;
  resetCacheBytes: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [darkMode, setDarkMode] = useState<boolean>(() => UserService.getDarkMode());

  // Entity State loaded via Services
  const [videos, setVideos] = useState<Video[]>(() => VideoService.getVideos());
  const [channels, setChannels] = useState<Channel[]>(() => VideoService.getChannels());
  const [comments, setComments] = useState<VideoComment[]>(() => CommentService.getComments());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => PlaylistService.getPlaylists());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => NotificationService.getNotifications());
  const [user, setUser] = useState<UserProfile>(() => UserService.getUser());

  const [likedVideos, setLikedVideos] = useState<string[]>(() => VideoService.getLikedVideos());
  const [dislikedVideos, setDislikedVideos] = useState<string[]>(() => VideoService.getDislikedVideos());

  // Debug & Demo Simulation State
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>('fast');
  const [cacheSavedBytes, setCacheSavedBytes] = useState<number>(142850);

  // Sync Dark mode to document and storage
  useEffect(() => {
    UserService.saveDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync user profile
  useEffect(() => {
    UserService.saveUser(user);
  }, [user]);

  // Sync channels
  useEffect(() => {
    VideoService.saveChannels(channels);
  }, [channels]);

  // Sync videos
  useEffect(() => {
    VideoService.saveVideos(videos);
  }, [videos]);

    // handlers que delegan en los services

  const toggleLike = (videoId: string) => {
    const { liked, disliked } = VideoService.toggleLike(videoId, likedVideos, dislikedVideos);
    setLikedVideos(liked);
    setDislikedVideos(disliked);

    // Update video like counter in state
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const isNowLiked = liked.includes(videoId);
          return {
            ...v,
            likes: isNowLiked ? v.likes + 1 : Math.max(0, v.likes - 1)
          };
        }
        return v;
      })
    );
  };

  const toggleDislike = (videoId: string) => {
    const { liked, disliked } = VideoService.toggleDislike(videoId, likedVideos, dislikedVideos);
    setLikedVideos(liked);
    setDislikedVideos(disliked);
  };

  const toggleSubscribe = (channelId: string) => {
    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === channelId) {
          const nextSub = !ch.isSubscribed;
          return {
            ...ch,
            isSubscribed: nextSub,
            subscribers: nextSub ? ch.subscribers + 1 : Math.max(0, ch.subscribers - 1)
          };
        }
        return ch;
      })
    );
  };

  const addComment = (videoId: string, text: string) => {
    const updated = CommentService.addComment(
      comments,
      videoId,
      text,
      user.name || user.username || 'Usuario Invitado',
      user.avatar
    );
    setComments(updated);
  };

  const toggleLikeComment = (commentId: string) => {
    const updated = CommentService.toggleLikeComment(comments, commentId);
    setComments(updated);
  };

  const deleteComment = (commentId: string) => {
    const updated = CommentService.deleteComment(comments, commentId);
    setComments(updated);
  };

  const createPlaylist = (name: string, isPrivate: boolean = false, initialVideoId?: string) => {
    const updated = PlaylistService.createPlaylist(playlists, name, isPrivate, initialVideoId);
    setPlaylists(updated);
  };

  const addVideoToPlaylist = (playlistId: string, videoId: string) => {
    const updated = PlaylistService.addVideoToPlaylist(playlists, playlistId, videoId);
    setPlaylists(updated);
  };

  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    const updated = PlaylistService.removeVideoFromPlaylist(playlists, playlistId, videoId);
    setPlaylists(updated);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = NotificationService.markAsRead(notifications, id);
    setNotifications(updated);
  };

  const markAllNotificationsAsRead = () => {
    const updated = NotificationService.markAllAsRead(notifications);
    setNotifications(updated);
  };

  const clearNotifications = () => {
    const updated = NotificationService.clearAll();
    setNotifications(updated);
  };

  // Demo Biometric Auth Flow
  const loginWithBiometrics = async (name: string): Promise<boolean> => {
    setUser(prev => ({
      ...prev,
      isAuthenticated: true,
      name: name || prev.name,
      username: name ? `@${name.toLowerCase().replace(/\s+/g, '')}` : prev.username
    }));
    return true;
  };

  const registerBiometrics = async (name: string, type: 'touchid' | 'faceid'): Promise<boolean> => {
    setUser(prev => ({
      ...prev,
      name: name || 'Usuario Principal',
      username: name ? `@${name.toLowerCase().replace(/\s+/g, '')}` : '@dev_user',
      biometricRegistered: true,
      biometricType: type,
      isAuthenticated: true
    }));
    return true;
  };

  const logout = () => {
    setUser(prev => ({
      ...prev,
      isAuthenticated: false
    }));
  };

  // Demo Network Modulation & Cache Metrics
  const addCacheBytes = (bytes: number) => {
    setCacheSavedBytes(prev => prev + bytes);
  };

  const resetCacheBytes = () => {
    setCacheSavedBytes(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedVideo,
        setSelectedVideo,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        darkMode,
        setDarkMode,
        videos,
        channels,
        comments,
        playlists,
        notifications,
        user,
        likedVideos,
        dislikedVideos,
        toggleLike,
        toggleDislike,
        toggleSubscribe,
        addComment,
        toggleLikeComment,
        deleteComment,
        createPlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        loginWithBiometrics,
        registerBiometrics,
        logout,
        connectionSpeed,
        setConnectionSpeed,
        cacheSavedBytes,
        addCacheBytes,
        resetCacheBytes
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
