import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const MyDetailsScreen = ({route}) => {
  const userData = route.params.userData;
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Account Details</Text>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userData.first_name && userData.last_name ? userData.first_name + '' + userData.last_name : ''}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{userData.username}</Text>
        </View>
        {/* <View style={styles.detailItem}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>+880 1234 567890</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>123 Grocery Street, Dhaka</Text>
        </View> */}

        <TouchableOpacity style={styles.button} onPress={()=>{
          navigation.navigate('UserProfileEdit',{userData})
        }}>
        <Text style={styles.buttonText}>Edit Account Info</Text>
        <Icon name="edit" size={18} color="#53B175" />
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

export default MyDetailsScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { paddingVertical: 20,paddingHorizontal:30 },
  title: { fontSize: 22, fontFamily:"Gilroy-Bold", color: '#242424', marginBottom: 20 },
  detailItem: { marginBottom: 15 },
  label: { fontSize: 15, color: '#666', fontFamily:"Gilroy-SemiBold" },
  value: { fontSize: 14, color: '#333', fontFamily:"Gilroy-SemiBold" },
  button: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    flexDirection:"row",
    alignContent:"center",
    justifyContent:"center",
    gap:10,
    borderWidth:1,
    borderColor:"#53B175",
    marginTop:40
  },
  buttonText: {
    color: '#53B175',
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold",
  },
});