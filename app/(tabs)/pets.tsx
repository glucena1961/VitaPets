import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Card, FAB, Text } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { getPets, deletePet } from '../../src/data/PetService';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function PetListScreen() {
  const [pets, setPets] = React.useState([]);
  const router = useRouter();

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
      'Borrar Mascota',
      '¿Estás seguro de que quieres borrar esta mascota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          onPress: async () => {
            await deletePet(id);
            loadPets();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Title title={item.basicInfo?.name || 'Sin nombre'} />
      <Card.Content>
        <Text>{item.basicInfo?.species || 'Especie no definida'}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push(`/pet-form?id=${item.id}`)}>Editar</Button>
        <Button onPress={() => handleDelete(item.id)}>Borrar</Button>
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
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 24, // Aumentado para dar más espacio
    marginBottom: 16,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingBottom: 80, // Espacio para que el FAB no tape el último item
  },
  card: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
