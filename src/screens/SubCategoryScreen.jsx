import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { REACT_APP_API_URL, REACT_APP_IMG_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import useFetch from '../CustomHooks/useFetch';

const SubCategoryScreen = ({route}) => {
  const navigation = useNavigation()
  const products = useFetch('sp/api/products/')
  // console.log(products)
  const subCategories = route.params.subCategories
  console.log(subCategories)
  const device = route.params.device
  const openModal = route.params.openModal
  const handleSubCategorySubmit = (subcategory) => {
    const SubCategoryName = subcategory.subcatname 
    const encodedSubCategory = encodeURIComponent(subcategory.subcatname);
      // Filter products by subcategory name
    const filteredProducts = products.filter(
      (product) => product.Sub_category.subcatname === SubCategoryName
    );
    navigation.navigate('Products_show', {subCategory: encodedSubCategory, Name:SubCategoryName,Products:filteredProducts , device:device, openModal: openModal});
  };
    const renderCategory = ({ item }) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: item?.bgColor?.replace(/"/g, '') }]}
         onPress={()=>{
          handleSubCategorySubmit(item)
         }}
        >
          <Image
            source={{ uri: `${REACT_APP_IMG_URL}${item.image}` }}
            style={styles.SubcategoryImage}
          />
          <Text style={styles.SubcategoryText}>{item.subcatname}</Text>
        </TouchableOpacity>
      );
  return (
    <FlatList
        data={subCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        />
  )
}

export default SubCategoryScreen

const styles = StyleSheet.create({
    grid: {
      paddingTop: 16,
      paddingHorizontal:16,
      justifyContent: 'center',
      paddingBottom:120
    },
    card: {
      flex: 1,
      margin: 5,
      borderRadius: 12,
      maxWidth:"46%",
      height:140,
      // padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    SubcategoryImage: {
      width: "80%",
      height: 80,
      marginBottom: 15,
    },
    SubcategoryText: {
      fontSize: 13,
      fontFamily:"Gilroy-SemiBold",
      textAlign: 'center',
      color: '#242424',
    },
  });
  