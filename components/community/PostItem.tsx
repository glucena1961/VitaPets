import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CommunityPost } from '@/src/types/community';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
// Removed useRouter as navigation will be handled by parent via prop

interface PostItemProps {
  post: CommunityPost;
  onInteraction: (postId: string, interaction: 'like' | 'dislike') => void;
  onCommentPress: (postId: string) => void; // New prop
}

// A helper function to format time (in a real app, use a library like date-fns)
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

export const PostItem: React.FC<PostItemProps> = ({ post, onInteraction, onCommentPress }) => {
  // Removed useRouter
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const interactionIconColor = (interaction: 'like' | 'dislike') => {
    return post.viewerInteraction === interaction ? theme.tint : theme.icon;
  };

  // Removed handleCommentPress as it's now passed via prop

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontWeight: 'bold',
    },
    timestamp: {
      color: theme.secondaryText,
      fontSize: 12,
    },
    content: {
      marginBottom: 12,
      lineHeight: 22,
    },
    image: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: 8,
      marginBottom: 12,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <ThemedText style={styles.authorName}>{post.author.name}</ThemedText>
          <ThemedText style={styles.timestamp}>{formatTimeAgo(post.createdAt)}</ThemedText>
        </View>
      </View>

      {/* Content */}
      <ThemedText style={styles.content}>{post.content}</ThemedText>
      {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.image} />}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onInteraction(post.id, 'like')}>
          <MaterialIcons name="thumb-up" size={20} color={interactionIconColor('like')} />
          <ThemedText>{post.stats.likes}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onInteraction(post.id, 'dislike')}>
          <MaterialIcons name="thumb-down" size={20} color={interactionIconColor('dislike')} />
          <ThemedText>{post.stats.dislikes}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onCommentPress(post.id)}>
          <MaterialIcons name="comment" size={20} color={theme.icon} />
          <ThemedText>{post.stats.comments}</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
