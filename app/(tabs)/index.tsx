
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const styles = createStyles(colorScheme);

  const handleNotImplemented = () => {
    Alert.alert(t('common.notImplemented'), t('common.notImplementedMessage'));
  };

  const menuItems = [
    {
      icon: 'pets',
      label: t('home_new.my_pets'),
      onPress: () => router.push('/(tabs)/pets'),
    },
    {
      icon: 'qr-code-2',
      label: t('home_new.digital_card'),
      onPress: () => router.push('/(tabs)/pets'), // Navigate to pets to select one for QR
    },
    {
      icon: 'medical-services',
      label: t('home_new.medical_history'),
      onPress: () => router.push('/(tabs)/medical'),
    },
    {
      icon: 'groups',
      label: t('home_new.community'),
      onPress: () => router.push('/community-screen'),
    },
    {
      icon: 'smart-toy',
      label: t('home_new.ask_ai'),
      onPress: () => router.push('/ai-consultation-screen'),
    },
     {
      icon: 'auto-stories',
      label: t('home_new.my_diary'),
      onPress: () => router.push('/my-diary-screen'),
    },
  ];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/splash-icon.png')} // Placeholder image
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerTextContainer}>
            <ThemedText type="title" style={styles.bannerTitle}>
              {t('home_new.banner_title')}
            </ThemedText>
            <ThemedText style={styles.bannerSubtitle}>
              {t('home_new.banner_subtitle')}
            </ThemedText>
          </View>
        </View>

        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.gridItem} onPress={item.onPress}>
              <View style={styles.gridItemIconContainer}>
                <MaterialIcons name={item.icon as any} size={32} color={Colors[colorScheme ?? 'light'].tint} />
              </View>
              <ThemedText style={styles.gridItemLabel}>{item.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => {
    const theme = Colors[colorScheme ?? 'light'];
    return StyleSheet.create({
        screen: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
        },
        bannerContainer: {
            height: 256,
            position: 'relative',
            justifyContent: 'flex-end',
        },
        bannerImage: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            resizeMode: 'cover',
        },
        bannerOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        bannerTextContainer: {
            padding: 16,
        },
        bannerTitle: {
            color: '#FFFFFF',
            fontWeight: 'bold',
        },
        bannerSubtitle: {
            color: '#FFFFFF',
            fontSize: 16,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: 16,
        },
        gridItem: {
            width: '45%',
            aspectRatio: 1,
            backgroundColor: theme.card,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            padding: 8,
            // Shadow for iOS
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            // Elevation for Android
            elevation: 2,
        },
        gridItemIconContainer: {
            padding: 12,
            borderRadius: 999,
            backgroundColor: theme.background,
            marginBottom: 8,
        },
        gridItemLabel: {
            textAlign: 'center',
            fontWeight: '500',
        },
    });
};
