
import React, { useState, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CommunityPost } from '@/src/types/community';
import { CommunityService } from '@/src/services/MockCommunityService';

import { PostItem } from '@/components/community/PostItem';
import { CreatePostForm } from '@/components/community/CreatePostForm';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function CommunityScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          '¡Únete a la comunidad de VitaPet para cuidar mejor a nuestras mascotas! Descarga la app aquí: https://vitapet.app/download',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleShare} style={{ marginRight: 16 }}>
          <MaterialIcons
            name="share"
            size={24}
            color={Colors[colorScheme].text}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colorScheme]);

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const { posts: fetchedPosts } = await CommunityService.getPosts(1);
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    }, [])
  );

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  const handleCommentPress = (postId: string) => {
    router.push({
      pathname: '/post-detail-screen',
      params: { id: postId },
    });
  };

  const handleInteraction = async (postId: string, interaction: 'like' | 'dislike') => {
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
      await CommunityService.toggleLike(postId, interaction); // Asumiendo que el servicio tiene esta lógica
    } catch (error) {
      console.error("Failed to save interaction:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem post={item} onInteraction={handleInteraction} onCommentPress={handleCommentPress} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<CreatePostForm onPostCreated={handlePostCreated} />}
        onRefresh={() => {}}
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
