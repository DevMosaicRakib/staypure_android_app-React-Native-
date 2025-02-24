import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { decode } from 'html-entities';
import {REACT_APP_IMG_URL} from '@env';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../Redux/CartSlice/cartApi';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import EvilIcons from "react-native-vector-icons/EvilIcons"
import {REACT_APP_API_URL} from "@env"

const extractPlainText = (htmlString) => {
  // Remove HTML tags using regex
  const text = htmlString.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  return decode(text);
};

const ProductDetailsScreen = ({ sameDay,setSameDay,setIsModalOpen,checkoutFromProudctDetails }) => {
    const route = useRoute()
    const { item,device } = route.params || {};
    console.log(device)
    // const [modalOpen,setModalOpen] = useState(false)
    const [quantity, setQuantity] = useState(1);
    // const [cartItems,setCartItems] = useState([])

    // const CartData = async ()=>{
    //   const res = await axios.get(`${REACT_APP_API_URL}sp/api/cartitems/cartlist/`)
    //   console.log(res.data)
    //   setCartItems(res.data)
    // };

    // useEffect(()=>{
    //   CartData();
    // },[])
    const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const totalCartItems = cartItems?.[0]?.total_cartitems || 0;
    const [addItemToCart] = useAddItemToCartMutation();
    const navigation = useNavigation()
    const { access_token } = useSelector(state => state.auth)

    const minQty = item?.min_quantity ? parseInt(item?.min_quantity) : 1;
    const totalStock = item?.total_stock ? parseInt(item?.total_stock) : null;
  
    // Find the cart item that matches the product name
    const cartItem = cartItems?.find((i) => i.products.name === item?.name);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    // Determine the initial count
    const initialCount =
    cartQuantity >= totalStock
      ? 0
      : minQty > totalStock
      ? totalStock
      : cartQuantity && minQty > totalStock - cartQuantity
      ? totalStock - cartQuantity
      : minQty;

      useEffect(() => {
        if (cartQuantity >= totalStock) {
          setQuantity(0);
        } else {
          setQuantity(
            minQty > totalStock
              ? totalStock
              : cartQuantity && minQty > totalStock - cartQuantity
              ? totalStock - cartQuantity
              : minQty
          );
        }
      }, [item, cartQuantity, totalStock]);  

      const decreaseQuantity = () => {
        if (quantity > minQty && quantity > 0) {
          setQuantity(quantity - 1);
        } else {
          Alert.alert("Fixed Quantity!", "Sorry! You can't add to cart below this quantity.");
          // Toast.show({
          //   type: 'error',
          //   text1: 'Fixed Quantity!',
          //   text2: "Sorry! You can't add to cart below this quantity.",
          //   visibilityTime: 2000,
          //   position: 'top',  // 'top', 'bottom', or 'center'
          // });
        }
      };
    
      const increaseQuantity = () => {
        if (cartQuantity >= totalStock || quantity >= totalStock - cartQuantity) {
          Alert.alert("Out of Stock", "Sorry! This product is out of stock now.");
          // Toast.show({
          //   type: 'error',
          //   text1: 'Out of Stock!',
          //   text2: "Sorry! This product is out of stock now.",
          //   visibilityTime: 2000,
          //   position: 'top',
          // });
        } else if (totalStock === null || quantity < totalStock) {
          setQuantity(quantity + 1);
        }
      };    

    // Variant Functions
    const [activeVariant, setActiveVariant] = useState(() => {
      const firstVariant = item?.variants[0];
      return firstVariant
        ? {
            id: firstVariant.id,
            typeId: firstVariant.variant_type.id,
            value: firstVariant.value,
            price: firstVariant.price || null,
            discountPrice: firstVariant.discount_price || null,
            // image: firstVariant.images[0]?.images || null,
          }
        : null;
    });
  
    const [activeIndex, setActiveIndex] = useState(0);
    const screenWidth = Dimensions.get("window").width;
    const flatListRef = useRef(null);
  
    const handleVariantClick = (typeId, value) => {
      const selectedVariant = item?.variants.find(
        (variant) => variant.variant_type.id === typeId && variant.value === value
      );
      if (selectedVariant) {
        setActiveVariant({
          id: selectedVariant.id,
          typeId,
          value,
          price: selectedVariant.price || null,
          discountPrice: selectedVariant.discount_price || null,
          // image: selectedVariant.images[0]?.images || null,
        });
      }
    };
  

    const htmlDescription = item?.description || "";
    const plainTextDescription = extractPlainText(htmlDescription);

    // Add to Cart Functionality
    const handleAddToCart = async () => {
      try {
        if (quantity !== 0) {
          if (activeVariant) {
            if (access_token) {
              const response = await addItemToCart({ products_id: item.id, variant_id: activeVariant.id, quantity });
              console.log(response);
              if (response.data) {
                // Ensure query is initialized before calling refetch
                if (cartItems) {
                  refetch();
                }
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Cart", params: { screen: "Cart_stack" } }],
                  })
                );
              }
            } else {
              const response = await addItemToCart({ products_id: item.id, variant_id: activeVariant.id, quantity, device });
              console.log(response);
              if (response.data) {
                // Ensure query is initialized before calling refetch
                if (cartItems) {
                  refetch();
                }
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Cart", params: { screen: "Cart_stack" } }],
                  })
                );
              }
            }
          }
        } else {
          Alert.alert("Out of Stock", "Sorry! This product is out of stock now.");
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    };
    
    // Buy Now Functionality
    const handleBuyNow = async () => {
      try {
        if (quantity !== 0) {
          if (activeVariant) {
            if (access_token) {
              const response = await addItemToCart({
                products_id: item.id,
                variant_id: activeVariant.id,
                quantity
              });
    
              if (response?.data) {
                // refetch()
                // if (cartItems && refetch) {
                //   await refetch(); // ✅ Ensure refetch exists
                // }
                setIsModalOpen(true);
                checkoutFromProudctDetails(true)
              } else {
                console.error("Failed to add item to cart");
              }
            } else {
              const response = await addItemToCart({
                products_id: item.id,
                variant_id: activeVariant.id,
                quantity,
                device
              });
    
              if (response?.data) {
                console.log(response);
                // refetch()
                // if (cartItems && refetch) {
                //   await refetch(); // ✅ Ensure refetch exists
                // }
                setIsModalOpen(true);
                checkoutFromProudctDetails(true)
              } else {
                console.error("Failed to add item to cart");
              }
            }
          }
        } else {
          Alert.alert("Out of Stock", "Sorry! This product is out of stock now.");
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    };
    
    const showToast = (message) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      {/* Product Images Section */} 
      <View style={[styles.imageContainer, { width: screenWidth }]}>
      <View style={{
              width:screenWidth
            }}>
              <Image
              source={{ uri: process.env.REACT_APP_IMG_URL + item?.product_imgs[0]?.images }}
              style={[styles.productImage]}
            />
            </View>
      </View>
        
        {/* Product Name and Price Related Information */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item?.name}</Text>
          <Text style={styles.productPriceRelatedInfo}>{activeVariant.value}, Price</Text>
        </View>

      {/* Product Variants Section */}
      <View >
      {Object.values(
        item.variants.reduce((acc, variant) => {
          const { variant_type } = variant;

          // Group variants by variant_type.id
          if (!acc[variant_type.id]) {
            acc[variant_type.id] = {
              variant_type,
              values: [],
            };
          }

          // Add the variant value to the corresponding group
          acc[variant_type.id].values.push(variant);
          return acc;
        }, {})
      ).map(({ variant_type, values }, index) => (
        <View key={index} style={[styles.variantSection,{flexDirection:"row",alignItems:"center",gap:10}]}>
          <Text style={styles.variantTypeText}>{variant_type.typeName}:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.variantValues}
          >
            {values.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.variantValue,
                  activeVariant?.id === v.id && styles.activeVariantValue,
                ]}
                onPress={() => handleVariantClick(v.variant_type.id, v.value)}
              >
                <Text style={[styles.variantValueText,activeVariant?.id === v.id && {color:"#fff"}]}>{v.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>

        {/* Quantity and Price Container */}
        <View style={styles.priceContainer}>
          <View style={styles.quantityControl}>
            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.priceText}>৳ {activeVariant?.discountPrice}</Text>
        </View>
        
        {/* Product Details Section */}
        <View style={[styles.detailSection,{borderWidth:1,padding:5,borderColor:"gray",borderRadius:10}]}>
          {item?.short_description?.split('\n').map((line, index) => (
            
              <Text key={index} style={[styles.sectionDescription]}>
              {'\u2022'} {line}
            </Text>
            
          ))}
        </View>
        
        {/* Cart and Buy Now Buttons */}
        {/* <TouchableOpacity style={styles.addToBasketButton} onPress={handleAddToCart}>
          <Text style={styles.addToBasketText}>Add To Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
        style={[
          styles.button,
          item?.stock === 'Out Of Stock' ? styles.disabledButtonadd : styles.addToBasketButton,
        ]}
        onPress={() => {
          console.log('Stock status:', item?.stock);
          if (item?.stock === 'Out Of Stock') {
            showToast('Sorry! This product is out of stock now.');
          } else {
            handleAddToCart();
          }
        }}
        disabled={item?.stock === 'Out Of Stock'}
      >
        <Text style={styles.addToBasketText}>Add To Cart</Text>
        {/* <AiOutlineShoppingCart style={styles.icon} /> */}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          item?.stock === 'Out Of Stock' ? styles.disabledButtonbuy : styles.buyNowButton,
        ]}
        onPress={() => {
          console.log('Stock status:', item?.stock);
          if (item?.stock === 'Out Of Stock') {
            Alert.alert('Out of stock !','Sorry! This product is out of stock now.');
          } else {
            if (item?.same_day_delivery) {
              setSameDay(item?.same_day_delivery);
            }
            handleBuyNow(); refetch();
          }
        }}
        disabled={item?.stock === 'Out Of Stock'}
      >
        <Text style={styles.buyNowText}>Buy Now</Text>
        {/* <GiBuyCard style={styles.icon} /> */}
      </TouchableOpacity>
      </ScrollView>
    );
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingBottom: 120,
      },
    container: {
        flex: 1,
        backgroundColor: '#F2F3F2',
        paddingBottom:120
      },
      imageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 16,
        // width: 413.6,
        height: 280,
        backgroundColor:"#fff",
        marginHorizontal: "auto",
        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,
      },
      productImage: {
        width:"100%",
        height: "90%",
        marginVertical:"auto",
        marginHorizontal:"auto",
        resizeMode:"contain"
      },
      dotsContainer: {
        position: "absolute",
        top: 320, // Or top: 320, if needed
        left: 0, 
        right: 0, // Spreads the container evenly across the width
        flexDirection: "row",
        justifyContent: "center",
      },               
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
      },
      activeDot: {
        backgroundColor: "#53B175",
      },
      inactiveDot: {
        backgroundColor: '#fff',
      },
      favoriteIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      productInfo: {
        marginBottom: 16,
      },
      productName: {
        fontSize: 18,
        color: '#242424',
        fontFamily:"Gilroy-SemiBold",
        paddingHorizontal:20
      },
      productPriceRelatedInfo: {
        fontSize: 14,
        color: '#7C7C7C',
        fontFamily:"Gilroy-Regular",
        paddingHorizontal:20,
        marginTop:5,
        marginLeft:2
      },
      priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal:20,
      },
      quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        
      },
      quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#53B175',
        backgroundColor:"#53B175",
        borderRadius: 8,
      },
      quantityText: {
        fontSize: 20,
        color: '#fff',
        fontFamily:"Gilroy-Regular"
      },
      quantityValue: {
        fontSize: 14,
        color: '#242424',
        marginHorizontal: 15,
        fontFamily:"Gilroy-SemiBold"
      },
      priceText: {
        fontSize: 18,
        color: '#242424',
        fontFamily:"Gilroy-Bold"
      },
      detailSection: {
        marginBottom: 16,
        marginHorizontal:20,
      },
      sectionTitle: {
        fontSize: 16,
        fontFamily:"Gilroy-SemiBold",
        color: '#242424',
        marginBottom: 8,
      },
      sectionDescription: {
        fontSize: 13,
        color: '#7C7C7C',
        fontFamily:"Gilroy-Regular"
      },
      addToBasketButton: {
        backgroundColor: '#53B175',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal:20,
      },
      addToBasketText: {
        fontSize: 14,
        color: '#fff',
        fontFamily:"Gilroy-SemiBold"
      },
      buyNowButton:{
        backgroundColor: '#e14877',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal:20,
        marginTop:10
      },
      buyNowText:{
        fontSize: 14,
        color: '#fff',
        fontFamily:"Gilroy-SemiBold"
      },
      disabledButtonadd: {
        backgroundColor: '#ccc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal:20,
      },
      disabledButtonbuy: {
        backgroundColor: '#ccc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal:20,
        marginTop:10
      },
      variantSection:{
        paddingHorizontal:20,
        marginBottom:16,
        overflow:"hidden"
      },
      variant:{
        flexDirection:"row",
        gap:10,
        alignItems:"center",
        marginBottom:10
      },
      variantTypeText:{
        fontSize:14,
        fontFamily:"Gilroy-SemiBold",
        color:"#242424"
      },
      variantValues:{
        flexDirection:"row",
        alignItems:"center",
        gap:10,
        
      },
      variantValue:{
        borderWidth:1,
        borderColor:"gray",
        borderRadius:16
      },
      variantValueText:{
        fontSize:13,
        fontFamily:"Gilroy-Regular",
        paddingHorizontal:10,
        paddingVertical:5,
        color:"#242424"
      },
      activeVariantValue: {
        backgroundColor: "#228553",
        
      },
    

})