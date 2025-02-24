import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

const HelpScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.text}>
          Welcome to the Help Center. Here you can find answers to frequently asked questions and get support for any issues you might face while using our app.
        </Text>
        <View style={styles.faq}>
          <Text style={styles.question}>1. How can I place an order?</Text>
          <Text style={styles.answer}>Navigate to the Shop section, select items, and proceed to checkout.</Text>
        </View>
        <View style={styles.faq}>
          <Text style={styles.question}>2. How can I track my order?</Text>
          <Text style={styles.answer}>Go to the Orders section in your profile to track your current orders.</Text>
        </View>
        <Text style={styles.text}>For further assistance, please contact our support team at support@staypurebd.com.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HelpScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { paddingVertical: 20, paddingHorizontal:30 },
  title: { fontSize: 22, fontFamily:"Gilroy-Bold", color: '#242424', marginBottom: 20 },
  text: { fontSize: 14, fontFamily:"Gilroy-SemiBold", color: '#666', marginBottom: 15 },
  faq: { marginBottom: 20 },
  question: { fontSize: 15, fontFamily:"Gilroy-Bold", color: '#242424' },
  answer: { fontSize: 14, fontFamily:"Gilroy-SemiBold", color: '#666', marginTop: 5 },
});