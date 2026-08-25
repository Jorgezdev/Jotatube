import { VideoComment } from '../types';
import { INITIAL_COMMENTS } from '../data/videos';
import { StorageService } from './storage';

const STORAGE_KEY = 'yt_video_comments';

export const CommentService = {
  getComments(): VideoComment[] {
    return StorageService.get<VideoComment[]>(STORAGE_KEY, INITIAL_COMMENTS);
  },

  saveComments(comments: VideoComment[]): void {
    StorageService.set(STORAGE_KEY, comments);
  },

  addComment(
    comments: VideoComment[],
    videoId: string,
    text: string,
    userName: string,
    userAvatar?: string
  ): VideoComment[] {
    const newComment: VideoComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      videoId,
      userName: userName || 'Usuario Invitado',
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: text.trim(),
      likes: 0,
      timestamp: 'Hace un momento'
    };

    const updated = [newComment, ...comments];
    this.saveComments(updated);
    return updated;
  },

  toggleLikeComment(comments: VideoComment[], commentId: string): VideoComment[] {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLikedByMe;
        return {
          ...c,
          isLikedByMe: isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    });
    this.saveComments(updated);
    return updated;
  },

  deleteComment(comments: VideoComment[], commentId: string): VideoComment[] {
    const updated = comments.filter(c => c.id !== commentId);
    this.saveComments(updated);
    return updated;
  }
};
