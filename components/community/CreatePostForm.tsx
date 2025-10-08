import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Importar ImagePicker
import { CommunityService } from '@/src/services/MockCommunityService'; // Cambiar createPost por CommunityService
import { CommunityPost } from '@/src/types/community';

interface CreatePostFormProps {
  onPostCreated: (newPost: CommunityPost) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [text, setText] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null); // Nuevo estado para la imagen
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestPermissions = async () => {
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

    if (mediaLibraryStatus !== 'granted' && cameraStatus !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a tu galería y cámara.');
      return false;
    }
    if (mediaLibraryStatus !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a tu galería de fotos.');
      return false;
    }
    if (cameraStatus !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a tu cámara.');
      return false;
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleAddMedia = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    Alert.alert(
      'Añadir Imagen',
      '¿Desde dónde quieres seleccionar la imagen?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Galería',
          onPress: pickImageFromLibrary,
        },
        {
          text: 'Cámara',
          onPress: takePhotoWithCamera,
        },
      ],
      { cancelable: true }
    );
  };

  const handlePublish = async () => {
    if ((text.trim().length === 0 && !selectedImageUri) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newPost = await CommunityService.addPost({
        id: `post-${Date.now()}`, // ID temporal, el servicio mock lo generará
        content: text.trim(),
        imageUrl: selectedImageUri,
        createdAt: new Date().toISOString(),
        author: { id: 'user-1', name: 'Tú', avatarUrl: 'https://i.pravatar.cc/150?u=gonzalo' }, // Autor mock
        stats: { likes: 0, dislikes: 0, comments: 0 },
        viewerInteraction: null,
      });
      onPostCreated(newPost);
      setText(''); // Clear input on success
      setSelectedImageUri(null); // Clear selected image
    } catch (error) {
      console.error("Failed to create post:", error);
      Alert.alert('Error', 'No se pudo crear la publicación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = (text.trim().length === 0 && !selectedImageUri) || isSubmitting;

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
      marginBottom: selectedImageUri ? 12 : 0, // Espacio si hay imagen
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
    imagePreviewContainer: {
      position: 'relative',
      marginBottom: 12,
      alignSelf: 'center',
    },
    imagePreview: {
      width: 200,
      height: 150,
      borderRadius: 8,
      resizeMode: 'cover',
    },
    removeImageButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 15,
      padding: 5,
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
      {selectedImageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImageUri(null)}>
            <MaterialIcons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} disabled={isSubmitting} onPress={handleAddMedia}>
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
