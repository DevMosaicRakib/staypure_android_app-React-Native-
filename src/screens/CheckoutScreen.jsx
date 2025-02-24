import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,Animated, Easing,  FlatList,
  Image,
  Alert,
  Linking,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from "react-redux";
import axios from "axios";
import { useFetchCustomerShippingAddressesQuery } from "../Redux/AddressSlice/addressApi";
import useFetch from "../CustomHooks/useFetch";
import {REACT_APP_API_URL} from '@env'

const PaymentScreen = ({isCOD, setIsCOD,orderConfirmation,handleSubmit}) => {
  const [selectedMethod, setSelectedMethod] = useState("bkash"); // Default selected method
  // const [isCOD, setIsCOD] = useState(false); // Cash on Delivery toggle
  const [fullPayment,setFullPayment] = useState(true);
  const paymentAmount = 1030; // Example amount
  const navigation = useNavigation()
  const PartialMessage = useFetch('sp/api/partialmessage/')
  console.log(PartialMessage)
  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handlePayNow = () => {
    navigation.navigate('OrderSuccess');
  };

  return (
    <View style={[styles.section,{marginTop:10}]}>
      <View>
        <Text style={styles.sectionTitle}>Payment Method</Text>
      </View>
      {/* Payment Method Options */}
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handlePaymentMethodChange("bkash")}
        >
          <View style={styles.radioCircle}>
            {selectedMethod === "bkash" && <View style={styles.selectedCircle} />}
          </View>
          <Image source={require("../assets/img/pay_gateway-img/bkash.png")} style={[styles.icon,{width:60}]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {Alert.alert("Sorry!",'This Service is not available now !')}}
        >
          <View style={styles.radioCircle}>
            {selectedMethod === "nagad" && <View  style={styles.selectedCircle}/>}
          </View>
          <Image source={require("../assets/img/pay_gateway-img/nagad.png")} style={[styles.icon,{width:60}]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {Alert.alert("Sorry!",'This Service is not available now !')}}
        >
          <View style={styles.radioCircle}>
            {selectedMethod === "rocket" && <View style={styles.selectedCircle}/>}
          </View>
          <Image source={require("../assets/img/pay_gateway-img/rocket.png")} style={[styles.icon,{width:30}]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {Alert.alert("Sorry!",'This Service is not available now !')}
          }
        >
          <View style={styles.radioCircle}>
            {selectedMethod === "card" && <View  style={styles.selectedCircle}/>}
          </View>
          <Image source={require("../assets/img/pay_gateway-img/card.png")} style={[styles.icon,{width:30}]} />
        </TouchableOpacity>
      </View>

       {isCOD && (
               <View style={{
                width:"82%",
                marginHorizontal:"auto",
                flexDirection:"row",
                // alignItems:"center",
                justifyContent:"center",
                borderWidth:1,
                borderColor:"gray",
                padding:8,
                borderRadius:10,
                marginBottom:15,
               }}>
                  <Text style={{
                    fontSize:10,
                    fontFamily:"Gilroy-Bold",
                    color:"orangered",
                    marginRight:5
                  }}>
                    Notice :
                  </Text>
                  <Text style={{
                    fontFamily:"Gilroy-SemiBold",
                    fontSize:9,
                    width:"80%"
                  }}>
                  {PartialMessage?.[0]?.partial_cod_message_for_checkout}
                  </Text>
                </View> 
       )}   

      {/* Pay Now Button */}
      <TouchableOpacity style={styles.footer} onPress={()=>{
        handleSubmit(fullPayment);
        // navigation.navigate('OrderSuccess');
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'OrderFailed' }], 
        //   });
      }}>
        <Text style={styles.checkoutButtonText}>Pay Now</Text>

        <View style={styles.checkoutButton}>
          <Text style={styles.totalPrice}>৳ {orderConfirmation}</Text>
        </View>
      </TouchableOpacity>

      {/* Cash on Delivery Option */}
      <View style={styles.codSection}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {setIsCOD(!isCOD);setFullPayment(false)}}
        >
          <MaterialIcons
            name={isCOD ? "check-box" : "check-box-outline-blank"}
            size={16}
            color="#53B175"
          />
        </TouchableOpacity>
        <Text style={styles.codText}>
          CASH ON DELIVERY / PARTIAL COD{" "}
          <Text style={{ color: "#e14877" }}> (*** for prevent fake order)</Text>
        </Text>
      </View>
    </View>
  );
};

const CheckoutScreen = ({device}) => {
  const route = useRoute();
  const { date, time, timePreference } = route.params || {};
    // Convert date to DD/MM/YYYY format
    const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : "";

  // Convert time to HH:MM AM/PM format
  const formattedTime = time
    ? new Date(time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";
  console.log(formattedDate);
  console.log(formattedTime);
  console.log(timePreference);
  // console.log("Device",device)
  const { access_token } = useSelector(state => state.auth)
  const navigation = useNavigation();
  const [isCOD, setIsCOD] = useState(false);
  const [addNewAddressForm,setAddNewAddressForm] = useState(false)

  const totalAmount = 1030.0; // Replace with dynamic calculation
  const [loading, setLoading] = useState(false);
  const [carts,setCarts] = useState([]);
  const [codeValue, setCodeValue] = useState('');
  const [specialCode,setSpecialCode] = useState(false)
  // Animation reference
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Fetch Delivery Fee From API
  const shipping_charge = useFetch('sp/api/deliverycharge/delivery_charge_list')
  console.log(shipping_charge)

  //Order Summary Functions start here 
  // Fetch Cart Items Which are checked in cart from ApI Function
  const cartItems = async () => {
    try {
      if (access_token) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}sp/api/checkout/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`
            }
          }
        );
        setCarts(res.data)
      } else {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}sp/api/checkout/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'device': device
            }
          }
        );
        setCarts(res.data)
      }
      
      // console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    cartItems();
  },[])
  // console.log(carts)
  const [quantities, setQuantities] = useState({});
  const [totalSum,setTotalSum] = useState(0)
  const [partialCodAmount, setPartialCodAmount] = useState(0);
    
  useEffect(() => {
    if (carts && carts.length > 0) {
      const initialQuantities = {};
      let highestPartialCod = 0;
  
      carts.forEach(item => { 
        initialQuantities[item.id] = item.quantity; // Initialize quantities from backend
  
        const subTotal = Number(item.sub_total);
        const partialPercentage = item.products.partial_cod_in_percentage
          ? (Number(item.products.partial_cod_in_percentage) / 100) * subTotal
          : 0;
        
        const partialTaka = item.products.partial_cod_in_taka
          ? Number(item.products.partial_cod_in_taka)
          : 0;
  
        const maxPartial = Math.max(partialPercentage, partialTaka);
        highestPartialCod = Math.max(highestPartialCod, maxPartial);
      });
  
      setQuantities(initialQuantities);
      setTotalSum(carts[0].total_price); // Assuming total price is correct for all checked items
  
      // If no product has a partial COD, set the delivery charge as the partial COD
      setPartialCodAmount(highestPartialCod > 0 ? highestPartialCod : 1);
    }
  }, [carts]);

  // Fetch delivery charge functions start
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [activeCharge, setActiveCharge] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    if (shipping_charge?.length > 0) {
      const sortedCharges = [...shipping_charge].sort(
        (a, b) => parseFloat(a.min_amount) - parseFloat(b.min_amount)
      );
      setDeliveryCharges(sortedCharges);
    }
  }, [shipping_charge]);

  useEffect(() => {
    if (deliveryCharges?.length > 0) {
      const charge = deliveryCharges.find(
        (charge) =>
          totalSum >= parseFloat(charge.min_amount) &&
          (charge.max_amount === null ||
            charge.max_amount === "infinity" ||
            totalSum < parseFloat(charge.max_amount))
      );

      setActiveCharge(charge ? parseFloat(charge.delivery_charge) : 0);
    }
  }, [totalSum, deliveryCharges]);

  const getDeliveryCharge = (totalSum, deliveryCharges) => {
    const charge = deliveryCharges.find(
      (charge) =>
        totalSum >= parseFloat(charge.min_amount) &&
        (charge.max_amount === null ||
          charge.max_amount === "infinity" ||
          totalSum < parseFloat(charge.max_amount))
    );
    return charge ? parseFloat(charge.delivery_charge) : 0;
  };

  useEffect(() => {
    if (shipping_charge?.length > 0) {
      setDeliveryCharge(getDeliveryCharge(totalSum, shipping_charge));
    }
  }, [totalSum, shipping_charge]);
  const DeliveryCharge = deliveryCharge ? deliveryCharge : 0

  const forcodorderconfirmation = partialCodAmount? partialCodAmount : 1
  const afterConfirmationTotal = isCOD === true ? (totalSum + DeliveryCharge - partialCodAmount) : 0;
  // Coupon Apply Functions start here
  // Function to toggle coupon code visibility and rotation animation
  const toggleSpecialCode = () => {
    setSpecialCode((prev) => !prev);

    Animated.timing(rotateAnim, {
      toValue: specialCode ? 0 : 1, // Rotate back if true; forward if false
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  // Apply Coupon code Function
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
        `${process.env.REACT_APP_API_URL}sp/api/add-coupon-checkout/`,
        { coupon: codeValue },
        { headers }
      );
      console.log(response)
      Alert.alert("Success!",'Coupon code added successfully');
      // setTotalSum(response.data.total_price);
    } catch (error) {
      console.error('Error applying coupon:', error);
      Alert.alert("Alert!",error?.response?.data?.msg);
    }
  };

  // Interpolate rotation for arrow icon
  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  }); 

  // Fetch Shipping Address Areas from api
  const [newAddress, setNewAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    customization: "",
    country: "Bangladesh",
  });
  const [shippaddressArea,setShippaddressArea] = useState('')
  const [showDropdownarea, setShowDropdownarea] = useState(false);
  const addressAreas = async () => {
    const res = await axios.get(`${REACT_APP_API_URL}sp/api/shippingaddressarea/`)
    // console.log(res.data)
    setShippaddressArea(res.data)
  }
  useEffect(()=>{
    addressAreas()
  },[])

  const handleSelectArea = (selectedArea) => {
    setNewAddress({ ...newAddress, area: selectedArea });
    setShowDropdownarea(false);
  };

  // Delivery Address Functions start here 
  // Delivery Address Fetch From API
  const [isShippingAddress,setIsShippingAddress] = useState(false);
  const { data: shipaddresses, error, isLoading, refetch: refetchShippingAddresses } = useFetchCustomerShippingAddressesQuery();
  console.log(shipaddresses)
  useEffect(()=>{
    if (shipaddresses && shipaddresses.length) {
      setIsShippingAddress(true)
    }
  },[shipaddresses])
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current; // Animation reference

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);

    Animated.timing(dropdownAnim, {
      toValue: showDropdown ? 0 : 1, // Toggle between showing and hiding
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  const dropdownArrowRotation = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    // setShowDropdown(false);
    toggleDropdown()
  };

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], 
  });


  // Place Order Functions Start Here
  
  const handlePlaceOrder = async (orderData) => {
    try {
      if (access_token) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}sp/api/place-order/`,
          orderData,
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${access_token}`
              }
          }
      );
      console.log(response.data);
      // if (response.data.paymentID && response.data.bkashURL) {
      // // Redirect the user to bKash URL
      // window.location.href = response.data.bkashURL;
      // } else {
      // console.error('Failed to retrieve paymentID or bkashURL.');
      // }
      if (response.data.paymentID && response.data.bkashURL) {
        // Use Linking to open the bKash URL
        Linking.openURL(response.data.bkashURL).catch(err => {
          console.error('Failed to open URL:', err);
          Alert.alert("Error", "Failed to open payment link.");
        });
      } else {
        console.error('Failed to retrieve paymentID or bkashURL.');
      }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}sp/api/place-order/`,
          orderData,
          {
            headers: {
              'Content-Type': 'application/json',
              'device': device
            }
          }
      );
      console.log(response.data);
      if (response.data.error) {
        Alert.alert("Alert !",response?.data?.error)
      }
      if (response.data.paymentID && response.data.bkashURL) {
        // Use Linking to open the bKash URL
        Linking.openURL(response.data.bkashURL).catch(err => {
          console.error('Failed to open URL:', err);
          Alert.alert("Error", "Failed to open payment link.");
        });
      } else {
        console.error('Failed to retrieve paymentID or bkashURL.');
      }
      }

    } catch (error) {
        console.error('Error placing order:', error);
        Alert.alert("Alert!",error?.response?.data?.error || 'Failed to place order');
    }
  };

  const handleSubmit = (FullPayment) => {
    const paymentMethod = FullPayment ? 'Full Payment' : 'Cash on Delivery';
    // const deliveryCharge = shipping_charge && shipping_charge.length > 0 ? Number(shipping_charge[0].delivery_charge) : 0; // Get delivery charge
    const forcodorderconfirmation = partialCodAmount? partialCodAmount : 1 
    const afterConfirmationTotal = isCOD === true ? (Number(totalSum) + DeliveryCharge - partialCodAmount) : '0.00';
    const orderData = {
      shipping_address_id: selectedAddress.id, // Assuming selectedAddress is defined and has an id
      payment_method: paymentMethod,
      totalPrice: Number(totalSum) + DeliveryCharge,
      pcod: 0,
      orderConfirmation: FullPayment ? Number(totalSum) : forcodorderconfirmation, // Assuming forcodorderconfirmation is defined
      afterRemainTotal: afterConfirmationTotal, // Assuming afterConfirmationTotal is defined
      shipping_address: selectedAddress ? selectedAddress : newAddress, // Assuming selectedAddress is defined
    };
    handlePlaceOrder(orderData);
  };
  return (
    <ScrollView style={styles.container}>
      {/* Coupon code */}
      <View style={{width:"100%",marginBottom:10}}>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleSpecialCode}
      >
        {/* Animated Arrow */}
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <MaterialIcons name="keyboard-arrow-down" size={22} color="#53B175" />
        </Animated.View>

        {/* Button Text */}
        <Text style={styles.text}>Have any coupon code?</Text>
      </TouchableOpacity>
      {/* Input Section with Smooth Transition */}
      {specialCode && (
        <View  style={styles.inputContainer}>
          <TextInput
            style={styles.inputc}
            placeholder="Enter code"
            value={codeValue}
            onChangeText={setCodeValue}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleApplyCoupon}>
            <Text style={styles.sendButtonText}>Send Code</Text>
          </TouchableOpacity>
        </View >
      )}
      </View>
      {/* Delivery charge section */}
      <>
      {shipping_charge?.length ? (
        <View style={styles.dChargecontainer}>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
            {deliveryCharges?.map((charge, index) => (
              <View key={index} style={styles.chargeItem}>
                {/* Amount Range */}
                <Text style={styles.amountText}>
                  {charge.max_amount === null || charge.max_amount === "infinity"
                    ? `${charge.min_amount}+ tk`
                    : `${charge.min_amount} - ${charge.max_amount} tk`}
                </Text>

                {/* Delivery Charge Amount */}
                <Text
                  style={[
                    styles.deliveryChargeText,
                    parseFloat(charge.delivery_charge) === activeCharge &&
                    activeCharge > 0
                      ? styles.activeCharge
                      : styles.inactiveCharge,
                  ]}
                >
                  Delivery Charge {charge.delivery_charge} TK
                </Text>

                {/* Active Indicator Dot */}
                <View
                  style={[
                    styles.indicatorDot,
                    parseFloat(charge.delivery_charge) >= activeCharge &&
                    activeCharge > 0
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                ></View>
              </View>
            ))}
          {/* </ScrollView> */}

          {/* Indicator Line */}
          <View style={styles.indicatorLine}>
            <View
              style={[
                styles.activeIndicatorLine,
                { width: `${
                  ((deliveryCharges?.findIndex(
                    (c) => parseFloat(c.delivery_charge) === activeCharge
                  ) + 1) /
                    deliveryCharges?.length) *
                  100
                }%` },
              ]}
            ></View>
          </View>
        </View>
      ) : null}
    </>
    {/* keyboardShouldPersistTaps="handled" nestedScrollEnabled={true} */}
    {/* contentContainerStyle */}
        {/* Delivery Address */} 
        {/* ScrollView 1 */}
        <View style={{ flex: 1 }} >
        <View style={[styles.dcontainer,{marginBottom:20}]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between",paddingHorizontal:8 }}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <TouchableOpacity onPress={()=>{setAddNewAddressForm(!addNewAddressForm)}}>
              <Text style={{ fontSize: 12, fontFamily: "Gilroy-SemiBold", color: "#53B175" }}>Add New</Text>
            </TouchableOpacity>
          </View>
            {addNewAddressForm ? (
              // ScrollView 2
            <View style={[styles.scContainer,{backgroundColor:"#fff",paddingHorizontal:5,position:"relative"}]}>
              <TouchableOpacity style={{position:"absolute",top:5,right:5}} onPress={()=>{
                setAddNewAddressForm(false);
                setNewAddress(
                  {
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    area: "",
                    customization: "",
                    country: "Bangladesh",
                  }
                )
              }}>
                <Entypo name="cross" size={20} color="#242424"/>
              </TouchableOpacity>
            <View style={styles.inputContainerd}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.inputd}
                value={newAddress.name}
                onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
                placeholder="Name"
              />
            </View>
          
            <View style={styles.rowContainer}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.inputd}
                  value={newAddress.phone}
                  onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.inputd}
                  value={newAddress.email}
                  onChangeText={(text) => setNewAddress({ ...newAddress, email: text })}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              </View>
            </View>
          
            <View style={styles.inputContainerd}>
              <Text style={styles.label}>Address:</Text>
              <TextInput
                style={[styles.inputd, styles.textArea]}
                value={newAddress.address}
                onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
                placeholder="Address"
                multiline
              />
            </View>

            <View style={styles.inputContainerd}>
              <Text style={styles.label}>Area:</Text>
              
              {/* Input Field (Touchable to Show Dropdown) */}
              <TouchableOpacity onPress={() => setShowDropdownarea(!showDropdownarea)}>
                <TextInput
                  style={[styles.inputd,{position:"relative"}]}
                  value={newAddress.area}
                  placeholder="Select an area"
                  editable={false} // Prevent manual input
                />
              </TouchableOpacity>

              {/* Dropdown Shipp Address Areas  */}
              {showDropdownarea && (
                <View>
                  {shippaddressArea?.map((item,index)=>(
                    <TouchableOpacity key={index} style={{
                      width:"100%",
                      position:"absolute",
                      left:0,
                      right:0,
                      bottom:-33,
                      backgroundColor:"#ECEFF1",
                      zIndex:999
                      // marginHorizontal:"auto"
                    }}
                    onPress={() => handleSelectArea(item.place)}
                    >
                    
                      <Text style={{
                        padding:10,
                        fontSize:11,
                        fontFamily:"Gilroy-SemiBold",
                      }}>{item.place}</Text>
                    
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              

            </View>
          
            <View style={styles.inputContainerd}>
              <Text style={styles.label}>Comment:</Text>
              <TextInput
                style={[styles.inputd, styles.textArea]}
                value={newAddress.customization}
                onChangeText={(text) =>
                  setNewAddress({ ...newAddress, customization: text })
                }
                placeholder="Write your comments"
                multiline
              />
            </View>
          
            {/* <View style={styles.inputContainerd}>
              <Text style={styles.label}>Country:</Text>
              <TextInput
                style={styles.inputd}
                value={newAddress.country}
                onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
                placeholder="Enter your country"
              />
            </View> */}
            </View>
          
           
            ) : (
              <>
              <TouchableOpacity onPress={toggleDropdown}>
              <View style={styles.inputField}>
                <Text style={styles.placeholder}>
                  {selectedAddress
                    ? `${selectedAddress.address +", " + selectedAddress.city}`
                    : shipaddresses?.length > 0
                    ? "Select your delivery address"
                    : "You have no delivery address"}
                </Text>
                {isShippingAddress && (
                  <Animated.View style={{ transform: [{ rotate: dropdownArrowRotation }] }}>
                  <MaterialIcons name="keyboard-arrow-down" size={22} color="#53B175" />
                  </Animated.View>
                )}
                
              </View>
            </TouchableOpacity>
          {/* Dropdown List */}
        
          <Animated.View style={[styles.dropdownContainer, { height: dropdownHeight, overflow: "hidden" }]}>
            {shipaddresses?.length > 0 ? (
              <View style={{ maxHeight: 200 }}> {/* Set a fixed max height */}
                <FlatList
                  data={shipaddresses}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{ position: "relative" }}>
                      <TouchableOpacity style={styles.addressItem} onPress={() => handleAddressSelect(item)}>
                        <Text style={styles.addressText}>{item.name}</Text>
                        <Text style={styles.addressText}>{item.address + ", " + item.city}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  nestedScrollEnabled={true} // Enable scrolling inside FlatList
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={true}
                />
              </View>
            ) : (
              <Animated.Text style={styles.noAddressText}>
                No delivery addresses available
              </Animated.Text>
            )}
          </Animated.View>

     
        </>
            )}


        </View>
        </View>


      {/* Order Summary */}
      <View style={[styles.section]}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderItem}>
          <Text style={styles.itemText}>Item Subtotal</Text>
          <Text style={styles.itemText}>৳ {totalSum}</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.itemText}>Delivery Fee</Text>
          <Text style={styles.itemText}>৳ {DeliveryCharge}</Text>
        </View>
        {isCOD && (
          <View>
          <View style={styles.orderItem}>
          <Text style={styles.itemText}>Total Amount</Text>
          <Text style={styles.itemText}>৳ {Number(totalSum)+Number(DeliveryCharge)}</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.itemText}>Remain After Pay In COD</Text>
          <Text style={styles.itemText}>৳ {afterConfirmationTotal}</Text>
        </View>
        </View>
        )}
        
        <View style={styles.totalAmount}>
          <Text style={styles.totalText}>{isCOD ? "For Order Confirmation:" : "Total Amount:"}</Text>
          <Text style={styles.totalText}>৳{isCOD ? forcodorderconfirmation : (Number(totalSum)+Number(DeliveryCharge))}</Text>
        </View>
      </View>

      {/* bKash Payment */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>bKash Payment</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter bKash Account Number"
          keyboardType="phone-pad"
          value={bkashNumber}
          onChangeText={setBkashNumber}
        />
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleBkashPayment}
          disabled={loading}
        >
          <Icon name="credit-card" size={20} color="white" />
          <Text style={styles.payButtonText}>
            {loading ? "Processing..." : "Pay with bKash"}
          </Text>
        </TouchableOpacity>
      </View> */}
      <PaymentScreen isCOD={isCOD} setIsCOD={setIsCOD} orderConfirmation={isCOD ? forcodorderconfirmation : (Number(totalSum)+Number(DeliveryCharge))}
        handleSubmit={handleSubmit}
        />
    </ScrollView>
  );
};

export default CheckoutScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    marginBottom: 95,
    paddingHorizontal:15
  },
  dcontainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    // flexDirection:"column"
  },
  inputContainerd: {
    marginBottom: 10,
    width: "95%",
    marginHorizontal:"auto",
    flexDirection: "column", // Stack label and input vertically
  },
  label: {
    fontSize: 13,
    fontFamily: "Gilroy-SemiBold",
    marginBottom: 5,
    color: "#242424",
  },
  inputd: {
    width: "100%", // Take full width of container
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    padding: 5,
    fontSize: 12,
    fontFamily: "Gilroy-SemiBold",
    borderRadius: 5,
  },
  textArea: {
    height: 50, // Larger height for textarea
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  halfInputContainer: {
    width: "45.5%",
    flexDirection: "column", // Stack label and input vertically
  },
  
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily:"Gilroy-Bold",
    color: "#242424",
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    color: "#555",
  },
  totalAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  totalText: {
    fontSize: 14,
    fontFamily:"Gilroy-Bold",
    color: "#242424",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 12,
    color: "#333",
  },
  payButton: {
    backgroundColor: "#53B175",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
  },
  payButtonText: {
    color: "white",
    fontSize: 13,
    marginLeft: 10,
    fontFamily:"Gilroy-Bold"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    marginBottom: 15,
    width: '95%',
    gap:10,
    marginHorizontal:"auto",
  },
  inputc: {
  //   flex: 1,
    width:"75%",
    height: 35,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 12,
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
    fontSize: 13,
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
    fontSize: 12,
    fontFamily: "Gilroy-SemiBold",
    color: "#fff",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  placeholder: {
    fontSize: 12,
    fontFamily:"Gilroy-SemiBold",
    color: "#888",
  },
  dropdownContainer: {
    
    // borderWidth: 1,
    // borderColor: "#E0E0E0",
    // borderRadius: 10,
    marginTop: 5,
  },
  addressItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  addressText: {
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    color: "#333",
  },
  noAddressText: {
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    color: "#888",
    textAlign: "center",
    paddingVertical: 20,
  },

  // Modal Css
  // modalOverlay: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0,0,0,0.3)",
  // },
  // dropdownContainer: {
  //   width: "80%",
  //   backgroundColor: "#fff",
  //   borderRadius: 8,
  //   paddingVertical: 10,
  //   shadowColor: "#000",
  //   shadowOpacity: 0.2,
  //   shadowRadius: 5,
  //   elevation: 5,
  // },
  // dropdownItem: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  // },
  // dropdownText: {
  //   fontSize: 11,
  //   color: "#242424",
  // },

  // Payment Section Css 

  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap:10
  },
  icon: {
    // width: 40,
    height: 30,
    marginBottom: 5,
  },
  radioCircle: {
    height: 13,
    width: 13,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#53B175",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    height: 6,
    width: 6,
    borderRadius: 5,
    backgroundColor: "#53B175",
  },
  codSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  codText: {
    fontSize: 12,
    fontFamily:"Gilroy-Bold",
    color: "#242424",
    marginTop:10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 5,
    backgroundColor: '#e14877',
    width: '80%',
    marginHorizontal: "auto",
    borderRadius: 16,
    marginBottom:10
  },
  totalPrice: {
    fontSize: 13,
    fontFamily: "Gilroy-Bold",
    color: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#D8136B',
    borderRadius: 10,
    paddingVertical: 3,
    marginVertical:2,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    fontSize: 13,
    fontFamily: "Gilroy-SemiBold",
    color: '#fff',
  },

  dChargecontainer: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    backgroundColor: '#ECEFF1',
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    position: "relative",
  },
  chargeItem: {
    alignItems: "center",
    marginHorizontal: 5,
    // position: "relative",
    // backgroundColor:"red"
  },
  amountText: {
    color: "#444",
    fontSize: 12,
    fontFamily: "Gilroy-SemiBold",
  },
  deliveryChargeText: {
    fontSize: 8,
    fontFamily:"Gilroy-SemiBold",
    paddingHorizontal: 2,
    transition: "transform 0.3s",
  },
  activeCharge: {
    color: "#298A60",
    transform: [{ scale: 1.1 }],
  },
  inactiveCharge: {
    color: "#888",
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    position: "absolute",
    bottom: -8,
    left: "50%",
    // marginLeft: -4,
    transform: [{ translateX: "-50%" }],
    // zIndex:10
  },
  activeDot: {
    backgroundColor: "#298A60",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
  indicatorLine: {
    width: "75%", 
    height: 2,
    backgroundColor: "gray",
    position: "absolute",
    bottom: 3.5,
    left: "53.3%",
    transform: [{ translateX: "-50%" }],
    marginHorizontal:"auto"
  },
  activeIndicatorLine: {
    height: 2,
    backgroundColor: "#298A60",
    transition: "width 0.5s",
  },
});
