import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { CommunityPost, CommunityComment } from '@/src/types/community';
import { getPosts, getComments, addComment, interactWithPost } from '@/src/services/MockCommunityService';
import { PostItem } from '@/components/community/PostItem';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

// Helper function to format time (re-used from PostItem)
const formatTimeAgo = (isoDate: string) => {
  const date = new Date(isoDate);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "a";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "min";
  return Math.floor(seconds) + "s";
};

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const postId = typeof id === 'string' ? id : undefined;
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!postId) return;
      setIsLoading(true);
      try {
        // In a real app, we'd fetch a single post by ID
        const { posts: allPosts } = await getPosts(); // Mock service only has get all posts, now correctly destructuring
        const fetchedPost = allPosts.find(p => p.id === postId);
        setPost(fetchedPost || null);

        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching post details or comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handlePostInteraction = async (interactedPostId: string, interaction: 'like' | 'dislike') => {
    if (!post || interactedPostId !== post.id) return;

    // Optimistic UI Update for the single post
    setPost(currentPost => {
      if (!currentPost) return null;
      const currentInteraction = currentPost.viewerInteraction;
      const newStats = { ...currentPost.stats };

      if (currentInteraction === interaction) {
        if (interaction === 'like') newStats.likes -= 1;
        if (interaction === 'dislike') newStats.dislikes -= 1;
        return { ...currentPost, viewerInteraction: null, stats: newStats };
      } else {
        if (currentInteraction === 'like') newStats.likes -= 1;
        if (currentInteraction === 'dislike') newStats.dislikes -= 1;
        if (interaction === 'like') newStats.likes += 1;
        if (interaction === 'dislike') newStats.dislikes += 1;
        return { ...currentPost, viewerInteraction: interaction, stats: newStats };
      }
    });

    try {
      await interactWithPost(interactedPostId, interaction);
    } catch (error) {
      console.error("Failed to save interaction:", error);
      // Revert optimistic update on failure in a real app
    }
  };

  const handleAddComment = async () => {
    if (!postId || newCommentText.trim().length === 0 || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await addComment(postId, newCommentText);
      setComments(currentComments => [newComment, ...currentComments]);
      setNewCommentText('');
      // Also update the comment count on the post itself
      setPost(currentPost => currentPost ? { ...currentPost, stats: { ...currentPost.stats, comments: currentPost.stats.comments + 1 } } : null);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.tint} />
        <ThemedText>Cargando publicación...</ThemedText>
      </ThemedView>
    );
  }

  if (!post) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Publicación no encontrada.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Image source={{ uri: item.author.avatarUrl }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <ThemedText style={styles.commentAuthor}>{item.author.name}</ThemedText>
              <ThemedText style={styles.commentText}>{item.content}</ThemedText>
              <ThemedText style={styles.commentTimestamp}>{formatTimeAgo(item.createdAt)}</ThemedText>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View>
            <PostItem post={post} onInteraction={handlePostInteraction} />
            <ThemedText type="subtitle" style={styles.commentsTitle}>Comentarios</ThemedText>
          </View>
        }
        ListEmptyComponent={
          <ThemedText style={styles.noCommentsText}>Sé el primero en comentar.</ThemedText>
        }
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Escribe un comentario..."
          placeholderTextColor={theme.secondaryText}
          value={newCommentText}
          onChangeText={setNewCommentText}
          editable={!isSubmittingComment}
        />
        <TouchableOpacity
          style={[styles.sendButton, (newCommentText.trim().length === 0 || isSubmittingComment) && styles.sendButtonDisabled]}
          onPress={handleAddComment}
          disabled={newCommentText.trim().length === 0 || isSubmittingComment}
        >
          {isSubmittingComment ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialIcons name="send" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  commentsTitle: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    marginTop: 2,
  },
  commentTimestamp: {
    fontSize: 12,
    color: Colors.light.secondaryText,
    marginTop: 4,
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.light.secondaryText,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
  },
  sendButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.secondaryBackground,
  },
});
