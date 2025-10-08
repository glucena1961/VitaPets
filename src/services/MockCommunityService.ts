import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommunityPost, CommunityUser, CommunityComment } from '@/src/types/community';

// --- Configuración de Logging ---
const ENABLE_MOCK_LOGS = true; // Habilitado para depuración

const mockLog = (...args: any[]) => {
  if (ENABLE_MOCK_LOGS) {
    console.log('[MockCommunityService]', ...args);
  }
};

// --- Base de datos Falsa (Mock Database) ---
export const mockUsers: Record<string, CommunityUser> = {
  'user-1': { id: 'user-1', name: 'Gonzalo', avatarUrl: 'https://i.pravatar.cc/150?u=gonzalo' },
  'user-2': { id: 'user-2', name: 'Sofía', avatarUrl: 'https://i.pravatar.cc/150?u=sofia' },
  'user-3': { id: 'user-3', name: 'Laura', avatarUrl: 'https://i.pravatar.cc/150?u=laura' },
  'user-4': { id: 'user-4', name: 'Carlos', avatarUrl: 'https://i.pravatar.cc/150?u=carlos' },
};

const ASYNC_STORAGE_KEY = '@CommunityPosts';

// --- Datos Iniciales (Solo para la primera vez) ---
const initialPosts: CommunityPost[] = [
    {
        id: 'post-1',
        author: mockUsers['user-2'],
        content: '¡Hola a todos! Acabo de adoptar un cachorro de Golden Retriever. ¿Algún consejo para las primeras semanas?',
        imageUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3234.jpg',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        stats: { likes: 15, dislikes: 0, comments: 2 },
        viewerInteraction: null,
    },
    {
        id: 'post-2',
        author: mockUsers['user-3'],
        content: 'Mi gato ha estado un poco decaído últimamente. ¿Debería preocuparme? No ha dejado de comer, pero duerme más de lo normal.',
        imageUrl: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        stats: { likes: 8, dislikes: 1, comments: 1 },
        viewerInteraction: 'liked',
    },
];

// --- Funciones de Ayuda para AsyncStorage ---

const getStoredPosts = async (): Promise<CommunityPost[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (jsonValue !== null) {
      mockLog('Posts cargados desde AsyncStorage.');
      return JSON.parse(jsonValue);
    } else {
      // Si no hay nada, inicializa con los datos de ejemplo y guárdalos
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(initialPosts));
      mockLog('No se encontraron posts. Inicializando con datos de ejemplo.');
      return initialPosts;
    }
  } catch (e) {
    console.error('Failed to fetch posts from storage', e);
    return initialPosts; // Devuelve datos iniciales en caso de error
  }
};

const setStoredPosts = async (posts: CommunityPost[]) => {
  try {
    const jsonValue = JSON.stringify(posts);
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY, jsonValue);
    mockLog('Posts guardados en AsyncStorage.');
  } catch (e) {
    console.error('Failed to save posts to storage', e);
  }
};


// --- Interfaz del Servicio ---

export const CommunityService = {
  async getPosts(page: number = 1, limit: number = 10): Promise<{ posts: CommunityPost[], hasMore: boolean }> {
    mockLog(`getPosts(page: ${page}, limit: ${limit})`);
    const allPosts = await getStoredPosts();
    const startIndex = (page - 1) * limit;
    const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);
    const hasMore = allPosts.length > startIndex + limit;
    return { posts: paginatedPosts, hasMore };
  },

  async addPost(postData: Omit<CommunityPost, 'id' | 'author' | 'createdAt' | 'stats' | 'viewerInteraction'> & { author: CommunityUser }): Promise<CommunityPost> {
    mockLog('addPost', postData);
    const allPosts = await getStoredPosts();
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      stats: { likes: 0, dislikes: 0, comments: 0 },
      viewerInteraction: null,
    };
    const updatedPosts = [newPost, ...allPosts];
    await setStoredPosts(updatedPosts);
    return newPost;
  },

  async getComments(postId: string): Promise<CommunityComment[]> {
    // En un servicio real, esto tendría su propia tabla y lógica.
    // Aquí lo simulamos para que funcione.
    mockLog(`getComments for postId: ${postId}`);
    if (postId === 'post-1') {
      return [
        { id: 'comment-1', author: mockUsers['user-4'], content: '¡Felicidades! Mucha paciencia y refuerzo positivo. ¡Y esconde los zapatos!', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() },
        { id: 'comment-2', author: mockUsers['user-1'], content: 'Jajaja, ¡gracias por el consejo! Tomo nota.', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      ];
    }
    if (postId === 'post-2') {
         return [
            { id: 'comment-3', author: mockUsers['user-2'], content: 'A veces solo están más perezosos. Mientras coma y beba bien, obsérvalo. Si tienes dudas, una visita al veterinario nunca está de más para tu tranquilidad.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
        ];
    }
    return [];
  },

  async addComment(postId: string, commentData: { content: string; author: CommunityUser }): Promise<CommunityComment> {
     // Esto no será persistente en el mock actual, pero simula la acción.
    mockLog(`addComment to postId: ${postId}`, commentData);
    const newComment: CommunityComment = {
        ...commentData,
        id: `comment-${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    // Aquí iría la lógica para guardar el comentario en AsyncStorage si fuera necesario.
    // Por simplicidad del mock, solo lo devolvemos.
    return newComment;
  },
};