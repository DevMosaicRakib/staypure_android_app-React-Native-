import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,Animated, Easing, 
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { useFetchCartItemsQuery } from '../Redux/CartSlice/cartApi';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {REACT_APP_API_URL,REACT_APP_IMG_URL} from "@env"

const CartScreen = ({device,setIsModalOpen,setSameDay,checkoutFromProudctDetails}) => {
  const { data: cartItems, error, isLoading, refetch } = useFetchCartItemsQuery();
  const { access_token } = useSelector(state => state.auth)
  const navigation = useNavigation();
  // const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [totalSum, setTotalSum] = useState(0);
  const [specialCode, setSpecialCode] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Fetch cart items (replace with your actual fetch logic)
  // const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  // console.log(cartItems)
  // useEffect(()=>{
  //   cartRefetch()
  //  },[device,cartItems])


  useEffect(() => {
    if (cartItems?.length > 0) {
      const initialCheckedState = {};
      const initialQuantities = {};
      cartItems.forEach(item => {
        initialCheckedState[item.id] = item.is_checked;
        initialQuantities[item.id] = item.quantity;
      });
      setCheckedItems(initialCheckedState);
      setQuantities(initialQuantities);
      const initialTotal = cartItems[0]?.total_price;
      setTotalSum(initialTotal);
    }
  }, [cartItems]);


  const handleCheckboxChange = async (itemId) => {
    // Validate itemId
    if (!itemId) {
      Alert.alert("Invalid Item", "Item ID is missing.");
      return;
    }
  
    const currentState = !!checkedItems[itemId];
    const newState = !currentState;
  
    // Optimistically update the checkbox state
    setCheckedItems((prev) => ({ ...prev, [itemId]: newState }));
  
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(access_token && { 'Authorization': `Bearer ${access_token}` }),
        ...(device && { 'device': device }),
      };
  
      const response = await axios.patch(
        `https://api.staypurebd.com/sp/api/cartitems/${itemId}/update_is_checked/`,
        { is_checked: newState },
        { headers }
      );
  
      if (response.status === 200) {
        console.log("Checkbox updated successfully:", response.data);
        refetch(); // Refresh the list if needed
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating checkbox:", error);
      Alert.alert("Update Failed", "Could not update checkbox state. Please try again.");
  
      // Revert state if failed
      setCheckedItems((prev) => ({ ...prev, [itemId]: currentState }));
    }
  };
  
  

  const allUnchecked = Object.keys(checkedItems).length === 0 || Object.values(checkedItems).every(checked => !checked);

  const handleDeleteItem = async (itemId) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
        'device': device // Send deviceCookie in headers
      };
  
      // If access_token is not present, send the request without it
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device']
      }

      await axios.delete(
        process.env.REACT_APP_API_URL + `sp/api/cartitems/${itemId}/cartitem_delete/`,
        { headers }
      );
  
      refetch(); 
    
      // Update the state to remove the deleted item
      // setCartItems((prevCartItems) => prevCartItems.filter(item => item.id !== itemId));
    
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handleCouponInputChange = (text) => {
    setCouponCode(text);
  };

  const handleApplyCoupon = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`, // Ensure access_token is correctly set
        'device': device // Send deviceCookie in headers
      };
  
      // If access_token is not present, send the request without it
      if (!access_token) {
        delete headers['Authorization']; // Remove Authorization if not authenticated
      } else {
        delete headers['device']
      }
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}sp/api/cartitems/add_coupon/`,
        { coupon: couponCode },
        { headers }
      );
  
      setTotalSum(response.data.total_price);
      Alert.alert("Success",'Coupon code added successfully');
    } catch (error) {
      console.error('Error applying coupon:', error);
      Alert.alert("error",error?.response?.data?.msg);
    }
  };


  const updateQuantity = async (itemId, newQuantity, minQty, maxQty) => {
    // Ensure the quantity stays within limits
    if (newQuantity < minQty) {
      newQuantity = minQty;
    }
    if (maxQty !== null && newQuantity > maxQty) {
      newQuantity = maxQty;
    }
  
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': access_token ? `Bearer ${access_token}` : undefined,
        'device': device
      };
  
      // Adjust headers based on authentication
      if (!access_token) {
        delete headers['Authorization'];
      } else {
        delete headers['device'];
      }
  
      const response = await axios.patch(
        `${REACT_APP_API_URL}sp/api/cartitems/${itemId}/update_item/`,
        { quantity: newQuantity },
        { headers }
      );
  
      if (response.status === 200) {
        setQuantities(prevQuantities => ({
          ...prevQuantities,
          [itemId]: newQuantity
        }));
        refetch();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.error('Update Failed','Could not update the quantity. Please try again.')
      // Toast.show({
      //   type: 'error',
      //   text1: 'Update Failed',
      //   text2: 'Could not update the quantity. Please try again.',
      //   visibilityTime: 1000
      // });
    }
  };

  const decrementQuantity = (itemId, minQty) => {
    console.log(minQty)
    const currentQuantity = quantities[itemId] || 1;
    if (currentQuantity > minQty) {
      updateQuantity(itemId, currentQuantity - 1, minQty, null);
    }
    else{
      Alert.alert("Fixed Quantity!", "Sorry! You can't add to cart below this quantity.");
    }
  };
  
  const incrementQuantity = (itemId, maxQty) => {
    const currentQuantity = quantities[itemId] || 1;
    if (maxQty === null || currentQuantity < maxQty) {
      updateQuantity(itemId, currentQuantity + 1, 1, maxQty);
    }
    else {
      Alert.alert("Out of Stock", "Sorry! This product is out of stock now.");
    }
  };

  // const decrementQuantity = (itemId) => {
  //   const currentQuantity = quantities[itemId] || 1;
  //   if (currentQuantity > 1) {
  //     updateQuantity(itemId, currentQuantity - 1);
  //   }
  // };

  // const incrementQuantity = (itemId) => {
  //   const currentQuantity = quantities[itemId] || 1;
  //   updateQuantity(itemId, currentQuantity + 1);
  // };

  const toggleSpecialCode = () => {
    setSpecialCode((prev) => !prev);
    Animated.timing(rotateAnim, {
      toValue: specialCode ? 0 : 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

const toggleCheckbox = (id) => {
  setCheckedItems((prev) => ({
    ...prev,
    [id]: !prev[id], // Toggle checkbox state for the item
  }));
};

useEffect(() => {
  // Check if any product in the cart has same_day_delivery set to true
  const hasSameDayDelivery = cartItems.some(item => item?.products?.same_day_delivery);
  setSameDay(hasSameDayDelivery);
}, [cartItems]);

  // const renderItem = ({ item }) => (
  //   <View style={styles.cartItemContainer}>
      
  //   <View style={styles.cartItem}>
  //       {/* Checkbox */}
  //       <CheckBox
  //       value={!!checkedItems[item.id]}
  //       onValueChange={() => handleCheckboxChange(item.id)}
  //       tintColors={{ true: "#53B175", false: "gray" }} // Color styling
  //       style={[styles.checkbox]}
        
  //     />
  //     {/* Image and Details */}
  //     <Image source={{uri : REACT_APP_IMG_URL+item.products.product_imgs[0].images}} style={styles.itemImage} />
  //     <View style={styles.itemDetails}>
  //       <View>
  //       <Text style={styles.itemName}>{item.products.name.length>20 ? item.products.name.slice(0,20) + "..." : item.products.name}</Text>
  //       <Text style={styles.itemDetailsText}>{item.variant}, Price</Text>
  //       </View>

  //       <View style={styles.quantityControl}>
  //       <TouchableOpacity
  //         onPress={() => decrementQuantity(item.id, parseInt(item.products.min_quantity) || 1)}
  //         style={styles.controlButton}
  //       >
  //         {/* <Text style={styles.controlButtonText}>-</Text> */}
  //         <Icon name="minus" size={12} color=""/>
  //       </TouchableOpacity>
  //       <Text style={styles.quantity}>{quantities[item.id] || 1}</Text>
  //       <TouchableOpacity
  //         onPress={() => incrementQuantity(item.id, item.products.total_stock ? parseInt(item.products.total_stock) : null)}
  //         style={styles.controlButton}
  //       >
  //         {/* <Text style={styles.controlButtonText}>+</Text> */}
  //         <Icon name="plus" size={12} color="#53B175"/>
  //       </TouchableOpacity>
  //     </View>
  //     </View>

  //     <Text style={styles.itemPrice}>৳{Number(item.sub_total).toFixed(2)}</Text>
  //     <TouchableOpacity
  //       onPress={() => handleDeleteItem(item.id)}
  //       style={styles.removeButton}
  //     >
  //       {/* <Text style={styles.removeButtonText}>×</Text> */}
  //       <Entypo name="cross" size={21} color="gray"/>
  //     </TouchableOpacity>
  //   </View>
  //   </View>
  // );

  const renderItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItem}>
        {/* Checkbox */}
        {/* <CheckBox
          value={!!checkedItems[item.id]}
          onValueChange={() => handleCheckboxChange(item.id)}
          tintColors={{ true: "#53B175", false: "gray" }}
          style={styles.checkbox}
        /> */}
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleCheckboxChange(item.id)}
        >
          <MaterialIcons
            name={checkedItems[item.id] ? "check-box" : "check-box-outline-blank"}
            size={20}
            color="#53B175"
          />
        </TouchableOpacity>
        {/* Image and Details */}
        <Image 
          source={{ uri: item.products?.product_imgs?.[0]?.images 
              ? REACT_APP_IMG_URL + item.products.product_imgs[0].images 
              : '' 
          }} 
          style={styles.itemImage} 
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>
            {item.products?.name?.length > 20 
              ? item.products.name.slice(0, 20) + "..." 
              : item.products?.name || "Unknown Product"}
          </Text>
          <Text style={styles.itemDetailsText}>{item.variant || "No Variant"}, Price</Text>
          
          <View style={styles.quantityControl}>
            <TouchableOpacity onPress={() => decrementQuantity(item.id, parseInt(item.products.min_quantity) || 1)} style={styles.controlButton}>
              <Icon name="minus" size={12} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantities[item.id] || 1}</Text>
            <TouchableOpacity onPress={() => incrementQuantity(item.id, item.products.total_stock ? parseInt(item.products.total_stock) : null)} style={styles.controlButton}>
              <Icon name="plus" size={12} color="#53B175" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.itemPrice}>৳{Number(item.sub_total) || 0}</Text>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.removeButton}>
          <Entypo name="cross" size={21} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {cartItems && cartItems.length > 0 ? (
        <>
      <View style={{width:"100%"}}>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleSpecialCode}
      >
        {/* Animated Arrow */}
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <MaterialIcons name="keyboard-arrow-down" size={25} color="#53B175" />
        </Animated.View>

        {/* Button Text */}
        <Text style={styles.text}>Have any coupon code?</Text>
      </TouchableOpacity>
      {/* Input Section with Smooth Transition */}
      {specialCode && (
        <View  style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter code"
            value={couponCode}
            onChangeText={handleCouponInputChange}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleApplyCoupon}>
            <Text style={styles.sendButtonText}>Send Code</Text>
          </TouchableOpacity>
        </View >
      )}
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
      />
      <TouchableOpacity style={styles.footer} onPress={()=>{setIsModalOpen(true);checkoutFromProudctDetails(false)}}>
      <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
        
        <View style={styles.checkoutButton}>
        <Text style={styles.totalPrice}>৳{totalSum.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
        </>
      ):(
        <View style={{
          width:"100%",
          height:"75%",
          marginVertical:"auto",
          alignItems:"center",
          justifyContent:"center",
          position:"relative"
        }}>
          <Image source={require('../assets/img/emptyCart.png')} style={{
            width:350,
            height:350,
            resizeMode:"cover"
          }}/>
          <Text style={{
            fontSize:18,
            fontFamily:'Gilroy-SemiBold',
            color:"gray",
            width:"90%",
            marginHorizontal:"auto",
            textAlign:"center",
            position:"absolute",
            bottom:140
          }}>Your Cart Is Empty !</Text>
        </View>
      )}

    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItemContainer:{
    width:"100%",
    // height:96.98,
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
  },
  checkbox: {
    marginRight: 10, // Add space between checkbox and image
    alignSelf: "center", // Vertically center the checkbox
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    width:"94%",
    height:"auto",
    marginHorizontal:"auto",
    paddingHorizontal:10,
    paddingVertical:15
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    gap:10
  },
  itemName: {
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    color:"#242424"
  },
  itemDetailsText: {
    color: 'gray',
    fontFamily:"Gilroy-Regular",
    fontSize:12
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5
  },
  controlButton: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  controlButtonText: {
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold",
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
  },
  itemPrice: {
    fontSize: 13,
    fontFamily:"Gilroy-Bold",
    color:"#242424",
    marginRight: 16,
  },
  removeButton: {
    paddingHorizontal: 5,
  },
  removeButtonText: {
    color: '#ff0000',
    fontFamily:"Gilroy-Regular",
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:10,
    padding: 10,
    backgroundColor: '#28a745',
    // position: 'absolute',
    // bottom: 0,
    width: '90%',
    marginHorizontal:"auto",
    borderRadius: 16,
  },
  totalPrice: {
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold",
    color: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#53B175',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold",
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '90%',
    gap:10,
    marginHorizontal:"auto",
  },
  input: {
  //   flex: 1,
    width:"70%",
    height: 38,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical:8,
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    backgroundColor: '#FFF',
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#53B175",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sendButtonText: {
    fontSize: 13,
    fontFamily: "Gilroy-SemiBold",
    color: "#fff",
  },
});