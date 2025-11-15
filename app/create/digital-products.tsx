import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, Layers, Download, DollarSign } from 'lucide-react-native';

export default function DigitalProductsScreen() {
  const router = useRouter();

  const products = [
    {
      id: '1',
      name: 'Content Calendar Template',
      description: 'Pre-built 90-day content planning system with automation guides',
      category: 'Templates',
      price: '$27',
      bestFor: 'Content creators, social media managers'
    },
    {
      id: '2',
      name: 'Email Marketing Masterclass',
      description: 'Complete video course with templates and swipe files',
      category: 'Course',
      price: '$97',
      bestFor: 'Entrepreneurs, small business owners'
    },
    {
      id: '3',
      name: 'Instagram Growth Guide',
      description: 'Step-by-step ebook with proven strategies and templates',
      category: 'Ebook',
      price: '$47',
      bestFor: 'Influencers, brand builders'
    },
    {
      id: '4',
      name: 'Canva Design Pack',
      description: '200+ customizable templates for social media',
      category: 'Templates',
      price: '$37',
      bestFor: 'Coaches, course creators, consultants'
    },
    {
      id: '5',
      name: 'Notion Productivity System',
      description: 'All-in-one workspace for entrepreneurs',
      category: 'Tool',
      price: '$19',
      bestFor: 'Solopreneurs, freelancers'
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Digital Products</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <Layers size={24} color={Colors.primary} />
            <Text style={styles.introText}>
              Create passive income with high-demand digital products
            </Text>
          </View>

          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
                <View style={styles.priceTag}>
                  <DollarSign size={14} color={Colors.text} />
                  <Text style={styles.priceText}>{product.price.replace('$', '')}</Text>
                </View>
              </View>

              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.description}>{product.description}</Text>

              <View style={styles.bestForContainer}>
                <Text style={styles.bestForLabel}>Best For:</Text>
                <Text style={styles.bestForText}>{product.bestFor}</Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.previewButton}>
                  <Download size={16} color={Colors.primary} />
                  <Text style={styles.previewButtonText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton}>
                  <Text style={styles.createButtonText}>Create Similar</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    padding: 16,
  },
  intro: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + Colors.opacity10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  productCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  bestForContainer: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bestForLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  bestForText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary + Colors.opacity10,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  createButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
