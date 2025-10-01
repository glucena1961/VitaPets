import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, useColorScheme, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

export default function AiConsultationScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = () => {
    console.log('Query sent:', query);
    setResponse(t('ai.simulatedResponse'));
  };

  const handleClear = () => {
    setQuery('');
    setResponse('');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    mainContent: {
      padding: 16,
      gap: 24,
    },
    querySection: {
      gap: 16,
    },
    input: {
      height: 160,
      padding: 16,
      borderRadius: 8,
      textAlignVertical: 'top',
      backgroundColor: Colors[colorScheme].background,
      borderColor: Colors[colorScheme].border,
      borderWidth: 1,
      color: Colors[colorScheme].text,
      fontSize: 16,
    },
    sendButton: {
      height: 48,
      borderRadius: 8,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    responseSection: {
      gap: 8,
    },
    responseBox: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
      padding: 16,
      backgroundColor: Colors[colorScheme].background,
      minHeight: 100,
    },
    responseText: {
      color: Colors[colorScheme].secondaryText,
      fontSize: 14,
    },
    footer: {
      padding: 16,
    },
    clearButton: {
      height: 48,
      borderRadius: 8,
      backgroundColor: Colors[colorScheme].secondaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clearButtonText: {
      color: Colors[colorScheme].secondaryText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainContent}>
            <View style={styles.querySection}>
              <TextInput
                style={styles.input}
                placeholder={t('ai.placeholder')}
                placeholderTextColor={Colors[colorScheme].secondaryText}
                value={query}
                onChangeText={setQuery}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>{t('ai.send')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.responseSection}>
              <ThemedText type="subtitle">{t('ai.responseTitle')}</ThemedText>
              <View style={styles.responseBox}>
                <ThemedText style={styles.responseText}>
                  {response || t('ai.emptyResponse')}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>{t('ai.clear')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
