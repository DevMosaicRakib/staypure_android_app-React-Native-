import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import {REACT_APP_IMG_URL} from "@env"
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../Redux/CartSlice/cartApi";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const CartPopUpModal = ({cartPopModalOpen,data,closeModal,device}) => {
  console.log("cartpopupmodal",data)
  const [quantity, setQuantity] = useState(1);
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const totalCartItems = cartItems?.[0]?.total_cartitems || 0;
  const [addItemToCart] = useAddItemToCartMutation();
  const navigation = useNavigation()
  const { access_token } = useSelector(state => state.auth)

  const minQty = data?.min_quantity ? parseInt(data?.min_quantity) : 1;
  const totalStock = data?.total_stock ? parseInt(data?.total_stock) : null;

  // Find the cart item that matches the product name
  const cartItem = cartItems?.find((i) => i.products.name === data?.name);
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
    }, [data, cartQuantity, totalStock]);  

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
      const [activeVariant, setActiveVariant] = useState(() => {
        const firstVariant = data?.variants[0];
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
      const handleVariantClick = (typeId, value) => {
        const selectedVariant = data?.variants.find(
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

          // Add to Cart Functionality
          const handleAddToCart = async () => {
            try {
              if (quantity !== 0) {
                if (activeVariant) {
                  if (access_token) {
                    const response = await addItemToCart({ products_id: data.id, variant_id: activeVariant.id, quantity });
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
                      closeModal()
                    }
                  } else {
                    const response = await addItemToCart({ products_id: data.id, variant_id: activeVariant.id, quantity, device });
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
                      closeModal()
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

  return (
    <Modal visible={cartPopModalOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => closeModal()}
          >
            <Text style={styles.closeText}>❌</Text>
          </TouchableOpacity>
          <View style={{
            width:"100%",
            height:200,
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            gap:10
          }}>
              <View style={{
                width:"40%",
                height:180,
                overflow:"hidden",
              }}>
                 <Image
                    source={{ uri: REACT_APP_IMG_URL + data.product_imgs[0].images }}
                    style={styles.image}
                  />
              </View>

              <View style={{
                width:"100%",
              }}>
                        {/* Product Name and Price Related Information */}
                        <View style={styles.productInfo}>
                          <Text style={styles.productName}>{data?.name}</Text>
                          <Text style={styles.productPriceRelatedInfo}>{activeVariant.value}, Price</Text>
                        </View>
                
                      {/* Product Variants Section */}
                      <View >
                      {Object.values(
                        data.variants.reduce((acc, variant) => {
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
                          {data?.short_description?.split('\n').map((line, index) => (
                            
                              <Text key={index} style={[styles.sectionDescription]}>
                              {'\u2022'} {line}
                            </Text>
                            
                          ))}
                        </View>

                        {/* For Cart Functionality button */}
                        <TouchableOpacity onPress={() => {
                            console.log('Stock status:', data?.stock);
                            if (data?.stock === 'Out Of Stock') {
                              Alert.alert('Out of stock !','Sorry! This product is out of stock now.');
                            } else {
                              handleAddToCart();
                              
                            }
                          }}>
                          <Text style={{
                            fontFamily:"Gilroy-SemiBold",
                            fontSize:12,
                            backgroundColor: data?.stock === 'Out Of Stock' ? "gray" : "green", 
                            width:75,
                            height:25,
                            borderRadius:10,
                            textAlign:"center",
                            textAlignVertical:"center",
                            color:"#fff"
                          }}>Continue</Text>
                        </TouchableOpacity>
              </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CartPopUpModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height:"auto",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 3,
    right: 5,
    padding: 5,
  },
  closeText: {
    fontSize: 9,
    fontFamily:"Gilroy-Bold",
    color: "orangered",
  },
  image: {
    width: "100%",
    height: "100",
    resizeMode: 'cover',
  },
  productInfo: {
    marginVertical: 10,
  },
  productName: {
    width:"60%",
    fontSize: 13.5,
    color: '#242424',
    fontFamily:"Gilroy-SemiBold",
    // paddingHorizontal:20
  },
  productPriceRelatedInfo: {
    fontSize: 11,
    color: '#7C7C7C',
    fontFamily:"Gilroy-SemiBold",
    // paddingHorizontal:20,
    marginTop:5,
    marginLeft:2
  },
  priceContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
    gap:40,
    marginBottom: 10,
    // paddingHorizontal:20,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom:8
  },
  quantityButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#53B175',
    backgroundColor:"#53B175",
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    color: '#fff',
    fontFamily:"Gilroy-Regular"
  },
  quantityValue: {
    fontSize: 13,
    color: '#242424',
    marginHorizontal: 15,
    fontFamily:"Gilroy-SemiBold"
  },
  priceText: {
    fontSize: 13,
    color: '#242424',
    fontFamily:"Gilroy-Bold"
  },
  detailSection: {
    marginBottom: 10,
    width:"60%"
    // marginHorizontal:20,
  },
  variantSection:{
    // paddingHorizontal:20,
    marginBottom:10,
    overflow:"hidden"
  },
  variant:{
    flexDirection:"row",
    gap:10,
    alignItems:"center",
    marginBottom:10
  },
  variantTypeText:{
    fontSize:13,
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
    fontSize:10,
    fontFamily:"Gilroy-Regular",
    paddingHorizontal:10,
    paddingVertical:2,
    color:"#242424"
  },
  activeVariantValue: {
    backgroundColor: "#228553",
    
  },
  sectionDescription: {
    fontSize: 10,
    color: '#7C7C7C',
    fontFamily:"Gilroy-SemiBold"
  },
})