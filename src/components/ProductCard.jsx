import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import {REACT_APP_IMG_URL} from '@env';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../Redux/CartSlice/cartApi';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

const ProductCard = ({item,device,openModal}) => {
  // console.log(device)
  // console.log(item)
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  
  const [addItemToCart] = useAddItemToCartMutation();
  const navigation = useNavigation();
  const { access_token } = useSelector(state => state.auth)
  // Active Variant
  const [activeVariant, setActiveVariant] = useState({
    typeId: item?.variants[0]?.variant_type.id || null,
    value: item?.variants[0]?.value || null,
    price: item?.variants[0]?.price || null,
    discountPrice: item?.variants[0]?.discount_price || null,
    // image: item?.variants[0]?.images[0]?.images || null
  });

  // useEffect(()=>{
  //   setActiveVariant({
  //     typeId: item?.variants[0]?.variant_type.id || null,
  //     value: item?.variants[0]?.value || null,
  //     price: item?.variants[0]?.price || null,
  //     discountPrice: item?.variants[0]?.discount_price || null,
  //     image: item?.variants[0]?.images[0]?.images || null
  //   })
  // },[item])



  // Add to Basket Functionality
  const handleAddToCart = async () => {
    try {
      if (activeVariant) {
        
        if (access_token) {
          const response = await addItemToCart({ products_id: item.id, variant_id:activeVariant.typeId,quantity: 1 });
          console.log(response)
          if (response.data) {
            refetch()
            navigation.dispatch(
              CommonActions.reset({
                  index: 0, // The index of the active screen
                  routes: [
                  {
                      name: "Cart", // The parent navigator or screen name
                      params: { screen: "Cart_stack"}, // Target screen in CartAndCheckoutNavigator
                  },
                  ],
              })
              );
          }
        } else {
          const response = await addItemToCart({ products_id: item.id, variant_id:activeVariant.typeId,quantity: 1 , device:device });
          console.log(response)
          if (response.data) {
            refetch()
            navigation.dispatch(
              CommonActions.reset({
                  index: 0, // The index of the active screen
                  routes: [
                  {
                      name: "Cart", // The parent navigator or screen name
                      params: { screen: "Cart_stack"}, // Target screen in CartAndCheckoutNavigator
                  },
                  ],
              })
              );
          }
        }

      } 
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  return (
    <TouchableOpacity onPress={()=>{
      navigation.navigate("Product_details" , {item,device})
    }} style={styles.card}>
      <Image
        source={{ uri: REACT_APP_IMG_URL + item.product_imgs[0].images }}
        style={styles.image}
      />
      <Text style={styles.title}>{item.name.length>30 ? item.name.slice(0,30) + "..." : item.name}</Text>
      <Text style={styles.description}>{activeVariant.value},price</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>৳ {activeVariant.discountPrice}</Text>
        <TouchableOpacity style={styles.addButton} onPress={()=>{openModal(item)}}>
          <Fontisto name="plus-a" size={14} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default ProductCard

const styles = StyleSheet.create({
    card: {
        width: 108,
        height:175,
        borderRadius: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal:2,
        marginBottom:8,
        justifyContent:"center",
        cursor:"pointer"
      },
      image: {
        width: "100%",
        height: 100,
        resizeMode: 'cover',
        marginBottom: 1,
      },
      title: {
        width:"100%",
        paddingRight:5,
        fontSize: 11.5,
        fontFamily:"Gilroy-SemiBold",
        textAlign: 'left',
        marginBottom: 1,
        marginLeft:10,
        color:"#242424"
      },
      description: {
        width:"95%",
        fontSize: 10,
        color: '#7C7C7C',
        textAlign:"left",
        marginBottom: 1,
        marginLeft:10,
        fontFamily:"Gilroy-SemiBold",
      },
      footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom:10,
      },
      price: {
        fontSize: 12.5,
        fontFamily:"Gilroy-Bold",
        color:"#242424",
        marginLeft:10,
      },
      addButton: {
        backgroundColor: '#53B175',
        width: 28,
        height: 28,
        borderRadius: 10,
        marginRight:6,
        justifyContent: 'center',
        alignItems: 'center',
      },
})