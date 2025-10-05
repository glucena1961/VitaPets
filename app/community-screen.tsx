import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CommunityPost } from '@/src/types/community';
import { getPosts, interactWithPost } from '@/src/services/MockCommunityService';

import { PostItem } from '@/components/community/PostItem';
import { CreatePostForm } from '@/components/community/CreatePostForm';
import { useRouter, useFocusEffect } from 'expo-router';

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usar useFocusEffect para recargar los datos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          // Siempre obtenemos la página 1 para refrescar la vista inicial
          const { posts: fetchedPosts } = await getPosts(1);
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    }, []) // El array vacío asegura que la función fetchPosts no se recree innecesariamente
  );

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  const handleCommentPress = (postId: string) => {
    // Ya no necesitamos pasar un callback, useFocusEffect se encargará de actualizar
    router.push({
      pathname: '/post-detail-screen',
      params: { id: postId },
    });
  };

  const handleInteraction = async (postId: string, interaction: 'like' | 'dislike') => {
    // El manejo optimista de la UI para los likes/dislikes sigue siendo útil
    // para una respuesta instantánea mientras el usuario está en la pantalla.
    setPosts(currentPosts =>
      currentPosts.map(p => {
        if (p.id === postId) {
          const currentInteraction = p.viewerInteraction;
          const newStats = { ...p.stats };

          if (currentInteraction === interaction) {
            if (interaction === 'like') newStats.likes -= 1;
            if (interaction === 'dislike') newStats.dislikes -= 1;
            return { ...p, viewerInteraction: null, stats: newStats };
          } else {
            if (currentInteraction === 'like') newStats.likes -= 1;
            if (currentInteraction === 'dislike') newStats.dislikes -= 1;
            if (interaction === 'like') newStats.likes += 1;
            if (interaction === 'dislike') newStats.dislikes += 1;
            return { ...p, viewerInteraction: interaction, stats: newStats };
          }
        }
        return p;
      })
    );

    try {
      await interactWithPost(postId, interaction);
    } catch (error) {
      console.error("Failed to save interaction:", error);
      // En una app real, aquí se revertiría el cambio optimista si falla la llamada
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem post={item} onInteraction={handleInteraction} onCommentPress={handleCommentPress} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<CreatePostForm onPostCreated={handlePostCreated} />}
        onRefresh={() => { /* La lógica de pull-to-refresh podría llamar a fetchPosts aquí */ }}
        refreshing={isLoading}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
});