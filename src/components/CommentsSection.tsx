import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThumbsUp, Send, Trash2, MessageSquareCode, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId }) => {
  const { comments, addComment, deleteComment, toggleLikeComment, user, addCacheBytes } = useApp();
  const [newCommentText, setNewCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'likes' | 'newest'>('likes');

  const filteredComments = comments.filter(c => c.videoId === videoId);

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    // Newest sorting: added comments have larger timestamps or id timestamps
    return b.id.localeCompare(a.id);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    addComment(videoId, newCommentText);
    setNewCommentText('');
    addCacheBytes(300);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 md:p-6 mt-6 transition-all">
      
      {/* Comments Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900 mb-5">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-5 h-5 text-red-600 dark:text-red-500" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-sans">
            Comentarios ({filteredComments.length})
          </h3>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-1.5 self-end xs:self-auto font-sans">
          <span className="text-4xs text-zinc-400 dark:text-zinc-500 font-medium">Ordenar por:</span>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-2.5 py-1 text-4xs font-semibold rounded-md transition-all cursor-pointer ${
              sortBy === 'likes'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
            }`}
          >
            Más relevantes
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 text-4xs font-semibold rounded-md transition-all cursor-pointer ${
              sortBy === 'newest'
                ? 'bg-zinc-100 dark:bg-zinc-900 text-red-600 dark:text-red-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
            }`}
          >
            Más recientes
          </button>
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start mb-6">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 border border-red-200/50">
          {user.isAuthenticated ? user.username.charAt(0).toUpperCase() : '?'}
        </div>

        <div className="flex-1 space-y-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Añade un comentario público de forma 100% privada..."
            rows={2}
            className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none font-sans"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-5xs text-zinc-400 dark:text-zinc-500 font-mono">
              ★ Comentario cifrado en sandbox local
            </span>
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-900 text-white disabled:text-zinc-400 font-bold text-4xs rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Comentar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {sortedComments.length === 0 ? (
            <div className="py-8 text-center text-zinc-400 dark:text-zinc-500 font-sans italic">
              Sé el primero en comentar este video...
            </div>
          ) : (
            sortedComments.map(comment => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 py-3 border-b border-zinc-100/60 dark:border-zinc-900/40 last:border-0"
              >
                {/* Commenter avatar */}
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 shadow-xs border border-zinc-100 dark:border-zinc-900"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                      {comment.userName}
                    </span>
                    <span className="text-5xs text-zinc-400 dark:text-zinc-500 font-mono">
                      {comment.timestamp}
                    </span>
                    {comment.id.startsWith('c-added-') && (
                      <span className="text-5xs font-mono px-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded">
                        Tú
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans mt-1 leading-relaxed break-words whitespace-pre-wrap">
                    {comment.text}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-0.5">
                    {/* Like button */}
                    <button
                      onClick={() => toggleLikeComment(comment.id)}
                      className={`flex items-center gap-1 py-1 px-2 rounded-md transition-colors cursor-pointer text-4xs font-mono font-medium ${
                        comment.isLikedByMe
                          ? 'bg-red-50 dark:bg-red-950/20 text-red-600'
                          : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${comment.isLikedByMe ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>

                    {/* Delete button (If posted by user) */}
                    {comment.id.startsWith('c-added-') && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600 rounded-md transition-colors cursor-pointer shrink-0"
                        title="Eliminar comentario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
