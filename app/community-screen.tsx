import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { CommunityPost } from '@/src/types/community';
import { getPosts, interactWithPost } from '@/src/services/MockCommunityService';

import { PostItem } from '@/components/community/PostItem';
import { CreatePostForm } from '@/components/community/CreatePostForm';


export default function CommunityScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { posts: fetchedPosts } = await getPosts(); // Destructure to get only the posts array
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  const handleInteraction = async (postId: string, interaction: 'like' | 'dislike') => {
    // Optimistic UI Update
    setPosts(currentPosts =>
      currentPosts.map(p => {
        if (p.id === postId) {
          const currentInteraction = p.viewerInteraction;
          const newStats = { ...p.stats };

          // If clicking the same interaction, undo it
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

    // Call the service in the background
    try {
      await interactWithPost(postId, interaction);
      // In a real app, you might re-fetch or sync state here if the service call returns a different state than the optimistic one.
    } catch (error) {
      console.error("Failed to save interaction:", error);
      // Here you would revert the optimistic update on failure
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem post={item} onInteraction={handleInteraction} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<CreatePostForm onPostCreated={handlePostCreated} />}
        onRefresh={() => { /* Logic for pull-to-refresh */ }}
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
  title: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 16, // Add some padding at the bottom
  },
});
