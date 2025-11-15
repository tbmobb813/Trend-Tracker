import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react-native';

export default function ProductIdeasScreen() {
  const router = useRouter();

  const products = [
    {
      id: '1',
      name: 'Smart Home Organization System',
      description: 'Modular storage solutions with app integration for inventory tracking',
      category: 'Home & Living',
      price: '$49-89',
      salesPotential: 88,
      marketingAngles: [
        'Declutter your life in 30 days',
        'Never lose anything again',
        'Smart home meets minimalism'
      ]
    },
    {
      id: '2',
      name: 'Sustainable Workout Gear',
      description: 'Eco-friendly fitness equipment made from recycled materials',
      category: 'Fitness',
      price: '$35-120',
      salesPotential: 92,
      marketingAngles: [
        'Get fit, save the planet',
        'Strength meets sustainability',
        'Eco-warrior fitness'
      ]
    },
    {
      id: '3',
      name: 'Pet Comfort Tech',
      description: 'Temperature-regulating pet beds with health monitoring',
      category: 'Pet Care',
      price: '$79-149',
      salesPotential: 85,
      marketingAngles: [
        'Your pet deserves better sleep',
        'Health monitoring while they rest',
        'Premium comfort, peace of mind'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Product Ideas</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <ShoppingBag size={24} color={Colors.primary} />
            <Text style={styles.introText}>
              Discover high-potential products to boost your sales
            </Text>
          </View>

          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productTitleContainer}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.categoryBadge}>{product.category}</Text>
                </View>
                <View style={styles.potentialBadge}>
                  <TrendingUp size={14} color={Colors.success} />
                  <Text style={styles.potentialText}>{product.salesPotential}%</Text>
                </View>
              </View>

              <Text style={styles.description}>{product.description}</Text>

              <View style={styles.priceContainer}>
                <DollarSign size={16} color={Colors.text} />
                <Text style={styles.priceText}>{product.price}</Text>
              </View>

              <View style={styles.anglesSection}>
                <Text style={styles.anglesTitle}>Marketing Angles:</Text>
                {product.marketingAngles.map((angle, index) => (
                  <Text key={index} style={styles.angle}>• {angle}</Text>
                ))}
              </View>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Learn More</Text>
              </TouchableOpacity>
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
  productTitleContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  potentialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + Colors.opacity10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    height: 24,
  },
  potentialText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  anglesSection: {
    marginBottom: 12,
  },
  anglesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  angle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
