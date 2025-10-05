import { CommunityPost, CommunityComment } from '../types/community';

// --- Configuración de Logging ---
const ENABLE_MOCK_LOGS = false; // Cambiar a true para ver los logs del mock service

const mockLog = (...args: any[]) => {
  if (ENABLE_MOCK_LOGS) {
    console.log('[MockService]', ...args);
  }
};

// --- Base de datos Falsa (Mock Database) ---
export let mockUsers = {
  'user-1': { id: 'user-1', name: 'Gonzalo', avatarUrl: 'https://i.pravatar.cc/150?u=gonzalo' },
  'user-2': { id: 'user-2', name: 'Sofía', avatarUrl: 'https://i.pravatar.cc/150?u=sofia' },
  'user-3': { id: 'user-3', name: 'Laura', avatarUrl: 'https://i.pravatar.cc/150?u=laura' },
  'user-4': { id: 'user-4', name: 'Carlos', avatarUrl: 'https://i.pravatar.cc/150?u=carlos' },
};

export let mockPosts: CommunityPost[] = [
  {
    id: 'post-1',
    content: '¿Alguien ha probado algún champú especial para perros con piel sensible? Mi labrador no para de rascarse. Agradezco cualquier recomendación.',
    imageUrl: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
    author: mockUsers['user-2'],
    stats: { likes: 15, dislikes: 0, comments: 4 },
    viewerInteraction: null,
  },
  {
    id: 'post-2',
    content: '¡Miren qué grande está mi cachorro! Parece que fue ayer cuando llegó a casa.',
    imageUrl: 'https://placedog.net/500/300?id=1',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Hace 5 horas
    author: mockUsers['user-3'],
    stats: { likes: 42, dislikes: 1, comments: 8 },
    viewerInteraction: 'like',
  },
  {
    id: 'post-3',
    content: 'Busco un buen veterinario por la zona centro que sea especialista en gatos. ¿Alguna sugerencia?',
    imageUrl: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ayer
    author: mockUsers['user-4'],
    stats: { likes: 8, dislikes: 0, comments: 2 },
    viewerInteraction: null,
  },
  {
    id: 'post-4',
    content: '¡Hoy es el cumpleaños número 5 de Rocky! 🎉 Le hemos preparado una tarta especial para perros.',
    imageUrl: 'https://placedog.net/500/500?id=2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    author: mockUsers['user-1'],
    stats: { likes: 112, dislikes: 3, comments: 25 },
    viewerInteraction: 'dislike',
  },
];

// --- Servicio Simulado ---

export const getPosts = (page: number = 1, limit: number = 5): Promise<{ posts: CommunityPost[]; hasMore: boolean }> => {
  mockLog(`Fetching posts for page ${page} with limit ${limit}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = mockPosts.slice(startIndex, endIndex);
      const hasMore = endIndex < mockPosts.length;
      resolve({ posts: paginatedPosts, hasMore });
    }, 800);
  });
};

export const createPost = (content: string): Promise<CommunityPost> => {
  mockLog(`Creating new post with content: "${content}"`);
  return new Promise(resolve => {
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        content,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        author: mockUsers['user-1'],
        stats: { likes: 0, dislikes: 0, comments: 0 },
        viewerInteraction: null,
      };
      mockPosts = [newPost, ...mockPosts];
      resolve(newPost);
    }, 1200);
  });
};

export const interactWithPost = (
  postId: string,
  interaction: 'like' | 'dislike'
): Promise<CommunityPost> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = mockPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        return reject(new Error('Post not found'));
      }

      const post = { ...mockPosts[postIndex] };
      const currentInteraction = post.viewerInteraction;

      if (currentInteraction === interaction) {
        post.viewerInteraction = null;
        if (interaction === 'like') post.stats.likes -= 1;
        if (interaction === 'dislike') post.stats.dislikes -= 1;
      } else {
        if (currentInteraction === 'like') post.stats.likes -= 1;
        if (currentInteraction === 'dislike') post.stats.dislikes -= 1;

        post.viewerInteraction = interaction;
        if (interaction === 'like') post.stats.likes += 1;
        if (interaction === 'dislike') post.stats.dislikes += 1;
      }

      mockPosts[postIndex] = post;
      resolve(post);
    }, 300);
  });
};

// --- Comentarios Falsos (Mock Comments) ---
const mockComments: { [postId: string]: CommunityComment[] } = {
  'post-1': [
    {
      id: 'comment-1-1',
      postId: 'post-1',
      content: '¡Hola Sofía! Yo uso el champú de avena de la marca PetCare y le va genial a mi beagle con piel sensible.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      author: mockUsers['user-1'],
    },
    {
      id: 'comment-1-2',
      postId: 'post-1',
      content: 'Prueba con un suplemento de omega-3, a veces ayuda mucho con la piel seca.',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      author: mockUsers['user-4'],
    },
  ],
  'post-2': [
    {
      id: 'comment-2-1',
      postId: 'post-2',
      content: '¡Qué monada! Se le ve muy feliz.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: mockUsers['user-1'],
    },
  ],
};

export const getComments = (postId: string): Promise<CommunityComment[]> => {
  mockLog(`Fetching comments for post ${postId}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockComments[postId] || []);
    }, 500);
  });
};

export const addComment = (
  postId: string,
  content: string
): Promise<CommunityComment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) {
        return reject(new Error('Post not found'));
      }

      if (!mockComments[postId]) {
        mockComments[postId] = [];
      }

      // Lógica de ID robusta y sin estado
      const newId = `comment-${postId}-${Date.now()}-${Math.random()}`;

      const newComment: CommunityComment = {
        id: newId,
        postId,
        content,
        createdAt: new Date().toISOString(),
        author: mockUsers['user-1'],
      };

      mockComments[postId].unshift(newComment);
      post.stats.comments += 1;

      resolve(newComment);
    }, 700);
  });
};