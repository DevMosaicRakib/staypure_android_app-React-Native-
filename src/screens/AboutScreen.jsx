import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.text}>
          Welcome to Grocery Cloud Kitchen! We are dedicated to providing high-quality grocery items and delicious meals delivered to your doorstep.
        </Text>
        <Text style={styles.text}>
          Our mission is to make your life easier by offering a seamless shopping experience and tasty meal options for busy lifestyles. Thank you for choosing us!
        </Text>
        <Text style={styles.text}>For inquiries, contact us at contact@staypurebd.com.</Text>
      </ScrollView>
    </SafeAreaView>

  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { paddingVertical: 20, paddingHorizontal:30 },
  title: { fontSize: 22, fontFamily:"Gilroy-Bold", color: '#242424', marginBottom: 20 },
  text: { fontSize: 14, fontFamily:"Gilroy-SemiBold", color: '#666', marginBottom: 15 },
});