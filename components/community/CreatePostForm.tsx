import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { createPost } from '@/src/services/MockCommunityService';
import { CommunityPost } from '@/src/types/community';

interface CreatePostFormProps {
  onPostCreated: (newPost: CommunityPost) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (text.trim().length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newPost = await createPost(text);
      onPostCreated(newPost);
      setText(''); // Clear input on success
    } catch (error) {
      console.error("Failed to create post:", error);
      // Optionally, show an alert to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = text.trim().length === 0 || isSubmitting;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      padding: 16,
      margin: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      minHeight: 60,
      maxHeight: 150,
      fontSize: 16,
      color: theme.text,
      paddingTop: 8, // Align text better with avatar
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    iconButton: {
      padding: 8,
    },
    publishButton: {
      backgroundColor: '#20df6c', // Green color from spec
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    publishButtonDisabled: {
      backgroundColor: theme.secondaryBackground,
    },
    publishButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  // In a real app, this would come from the logged-in user's context
  const currentUserAvatar = 'https://i.pravatar.cc/150?u=gonzalo';

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
        <TextInput
          style={styles.textInput}
          placeholder="Comparte tus experiencias o haz preguntas..."
          placeholderTextColor={theme.secondaryText}
          multiline
          value={text}
          onChangeText={setText}
          editable={!isSubmitting}
        />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} disabled={isSubmitting}>
          <MaterialIcons name="add-photo-alternate" size={28} color={isSubmitting ? theme.secondaryText : theme.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.publishButton, isButtonDisabled && styles.publishButtonDisabled]} disabled={isButtonDisabled} onPress={handlePublish}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.publishButtonText}>Publicar</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
