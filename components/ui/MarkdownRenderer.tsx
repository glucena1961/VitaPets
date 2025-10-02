import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  const renderNode = (text: string, index: number) => {
    // Handle bullet points
    if (text.startsWith('* ') || text.startsWith('- ')) {
      const bulletText = text.substring(2);
      return (
        <View key={index} style={styles.bulletPointContainer}>
          <ThemedText style={styles.bullet}>•</ThemedText>
          <ThemedText style={styles.bulletText}>{renderInline(bulletText)}</ThemedText>
        </View>
      );
    }

    return <ThemedText key={index} style={styles.paragraph}>{renderInline(text)}</ThemedText>;
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **bold**
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <ThemedText key={index} type="defaultSemiBold">
            {part.slice(2, -2)}
          </ThemedText>
        );
      }
      return part;
    });
  };

  const nodes = content.split('\n').map(renderNode);

  return <View>{nodes}</View>;
};

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 8,
    lineHeight: 22, // Improved line height for readability
  },
  bulletPointContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 10,
  },
  bullet: {
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    lineHeight: 22,
  },
});

export default MarkdownRenderer;
