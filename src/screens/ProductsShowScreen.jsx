import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import pnf from '../assets/img/pnf.png'

const ProductsShowScreen = ({route}) => {
    const Params = route.params
    // console.log(Params)
    const ProductsData = route.params.Products
    const device = route.params.device
    const modal = route.params.openModal
    console.log(ProductsData)
    const navigation = useNavigation()
    
    const renderCategory = ({ item }) => (
        <TouchableOpacity onPress={()=>{navigation.navigate("Product_details" , {item})}} style={{
          alignItems:"center",
          marginBottom:5,
          justifyContent:"center"
        }}>
          <ProductCard item={item} device={device} openModal={modal}/>
        </TouchableOpacity>
      );

      const screenWidth = Dimensions.get('window').width;  
  return (
    <View>
      {ProductsData && ProductsData.length ? (
            <FlatList
            data={ProductsData}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={3}
            nestedScrollEnabled={true}
            contentContainerStyle={[styles.grid]}
            />
      ):(
        <View style={{
          width:"100%",
          height:"90%",
          alignItems:"center",
          justifyContent:"center",
        }}>
         <Image 
            source={pnf}
            style={{
              width:300,
              height:300,
              resizeMode:"contain",
              marginVertical:"auto",
            }}
          /> 
         </View>
      )}
    </View>
  )
}

export default ProductsShowScreen

const styles = StyleSheet.create({ 
    grid: {
      width: '100%',
      paddingHorizontal:12,
      paddingTop:10,
      paddingBottom:96,
    },
    card: {
      width: '45%', // Each card takes 45% of the width
      height:248.51,
      aspectRatio: 1, // Maintains a square shape
      marginHorizontal: '2.5%', // Equal spacing around each card
      backgroundColor: '#f9f9f9', // Optional: Background color
      borderRadius: 8, // Optional: Rounded corners
      alignItems: 'center', // Center content inside the card
      justifyContent: 'center', // Center content inside the card
      marginTop:36,
      marginBottom:60
    },
})
