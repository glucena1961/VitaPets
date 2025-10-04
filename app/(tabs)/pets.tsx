import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Alert, View, Image, TouchableOpacity } from 'react-native';
import { Button, Card, FAB, Text } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { getPets, deletePet } from '../../src/data/PetService';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function PetListScreen() {
  const [pets, setPets] = React.useState([]);
  const router = useRouter();
  const { t } = useTranslation(); // Hook para traducciones

  const loadPets = useCallback(async () => {
    const petsData = await getPets();
    setPets(petsData);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      t('delete_pet_alert.title'),
      t('delete_pet_alert.message'),
      [
        { text: t('delete_pet_alert.cancel'), style: 'cancel' },
        {
          text: t('delete_pet_alert.confirm'),
          onPress: async () => {
            await deletePet(id);
            loadPets();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Pet }) => (
    <Card style={styles.card}>
      <View style={styles.cardLayout}>
        {/* Columna Izquierda: Imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={item.photo_uri ? { uri: item.photo_uri } : require('../../assets/images/icon.png')} // CORREGIDO
            style={styles.petImage}
          />
        </View>

        {/* Columna Derecha: Textos */}
        <View style={styles.textContainer}>
          <ThemedText style={styles.petName}>{item.name || t('pet_form.unnamed')}</ThemedText> // CORREGIDO
          <ThemedText style={styles.petBreed}>{item.breed || t('pet_form.no_species')}</ThemedText> // CORREGIDO
        </View>
      </View>

      {/* Acciones de la tarjeta */}
      <Card.Actions style={styles.cardActions}>
        <Button onPress={() => router.push({ pathname: '/pet-qr-detail', params: { petId: item.id } })}>{t('common.view_qr')}</Button>
        <Button onPress={() => router.push(`/pet-form?id=${item.id}`)}>{t('common.edit')}</Button>
        <Button onPress={() => handleDelete(item.id)}>{t('common.delete')}</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={pets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        style={styles.flatList}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push('/pet-form')}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  cardLayout: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  petBreed: {
    fontSize: 14,
    color: 'gray',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  cardActions: {
    justifyContent: 'center',
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
