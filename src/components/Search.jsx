import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useFetch from "../CustomHooks/useFetch";
import {REACT_APP_IMG_URL} from '@env';
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const products = useFetch('sp/api/products/')

  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchText.toLowerCase())
  // );
  // Check if products is not null or undefined before filtering
  const filteredProducts = products && Array.isArray(products) 
  ? products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    )
  : []; // Return an empty array if products is null or not an array

// Now you can safely use filteredProducts in your component
  const handleProductPress = (item) => {
    navigation.navigate('Shop', {
        screen: 'Product_details',
        params: { item }, // Pass the item as a parameter
    });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
      <Image source={{uri : REACT_APP_IMG_URL + item.product_imgs[0].images}} style={{
        width:45,
        height:45,
        marginRight:15
      }}/>
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );


  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      {/* Search Input Field */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a product..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <MaterialIcons name="search" size={20} style={styles.searchIcon}/>
      {/* Filtered Products */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
        />
      ) : (
        // Show Not Found Image
        <View style={styles.notFoundContainer}>
          <Image
            source={require('../assets/img/filter.png')}
            style={styles.notFoundImage}
          />
          <Text style={styles.notFoundText}>No products found!</Text>
        </View>
      )}
    </View>
    </TouchableWithoutFeedback>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop:20,
    paddingBottom:95
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 46,
    paddingVertical:12,
    marginBottom: 16,
    position:"relative",
    fontSize:14,
    fontFamily:"Gilroy-SemiBold",
    width:"95%",
    marginHorizontal:"auto",
    marginTop:20
  },
  searchIcon:{
    position:"absolute",
    top:53,
    left:45
  },
  productList: {
    paddingBottom: 16,
  },
  productItem: {
    width:"95%",
    marginHorizontal:"auto",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor:"#fff",
    flexDirection:"row",
    alignItems:"center",
    overflow:"hidden",
    padding:15
  },
  productName: {
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    color: "#4A4C4F",
  },
  notFoundContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  notFoundImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    objectFit:"cover"
  },
  notFoundText: {
    fontSize: 18,
    fontFamily:"Gilroy-SemiBold",
    color: "#555",
  },
});