/** Representa un usuario simplificado para mostrar en la comunidad. */
export interface CommunityUser {
  id: string;
  name: string;
  avatarUrl: string;
}

/** Representa una única publicación en el feed de la comunidad. */
export interface CommunityPost {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string; // ISO 8601 format string
  author: CommunityUser;
  stats: {
    likes: number;
    dislikes: number;
    comments: number;
  };
  viewerInteraction: 'like' | 'dislike' | null;
}

/** Representa un comentario en una publicación de la comunidad. */
export interface CommunityComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string; // ISO 8601 format string
  author: CommunityUser;
}
