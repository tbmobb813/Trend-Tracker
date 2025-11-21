import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import ContentToolCard from '@/components/ContentToolCard';
import { useRouter } from 'expo-router';
import { 
  Video,
  MessageSquare,
  Hash,
  AlertCircle,
  Image,
  FileText,
  ShoppingBag,
  Layers
} from 'lucide-react-native';

export default function CreateScreen() {
  const router = useRouter();

  const tools = [
    {
      id: 'tiktok-hooks',
      title: 'TikTok Hooks',
      description: 'Proven hooks and video ideas to boost your engagement',
      icon: <Video size={24} color={Colors.primary} />,
      route: '/create/tiktok-hooks'
    },
    {
      id: 'thread-generator',
      title: 'Thread Generator',
      description: 'Create engaging threads for Twitter and Threads app',
      icon: <MessageSquare size={24} color={Colors.primary} />,
      route: '/create/thread-generator'
    },
    {
      id: 'hashtag-suggestions',
      title: 'Hashtag Suggestions',
      description: 'Discover trending hashtags to increase your reach',
      icon: <Hash size={24} color={Colors.primary} />,
      route: '/create/hashtag-suggestions'
    },
    {
      id: 'post-troubleshooting',
      title: 'Post Troubleshooting',
      description: 'Solutions for common content performance issues',
      icon: <AlertCircle size={24} color={Colors.primary} />,
      route: '/create/post-troubleshooting'
    },
    {
      id: 'thumbnail-ideas',
      title: 'Thumbnail Ideas',
      description: 'High-converting thumbnail designs to boost your CTR',
      icon: <Image size={24} color={Colors.primary} />,
      route: '/create/thumbnail-ideas'
    },
    {
      id: 'caption-templates',
      title: 'Caption Templates',
      description: 'Ready-to-use captions to maximize your engagement',
      icon: <FileText size={24} color={Colors.primary} />,
      route: '/create/caption-templates'
    },
    {
      id: 'product-ideas',
      title: 'Product Ideas',
      description: 'Discover high-potential products to boost your sales',
      icon: <ShoppingBag size={24} color={Colors.primary} />,
      route: '/create/product-ideas'
    },
    {
      id: 'digital-products',
      title: 'Digital Products',
      description: 'Create passive income with digital products',
      icon: <Layers size={24} color={Colors.primary} />,
      route: '/create/digital-products'
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Content Tools</Text>
          <Text style={styles.subtitle}>
            Create better content with AI-powered tools
          </Text>
        </View>

        <View style={styles.toolsContainer}>
          {tools.map((tool) => (
            <ContentToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onPress={() => router.push(tool.route as any)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  toolsContainer: {
    padding: 16,
  },
});
