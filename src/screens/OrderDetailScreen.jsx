import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

const OrderDetailScreen = ({route}) => {
      // Example Order Data passed via route.params
  const { order } = route.params;

  const [isOrderCancelled, setIsOrderCancelled] = useState(order.status === "Cancelled");

  // Cancel Order Handler
  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setIsOrderCancelled(true);
            // Here you can add API call to cancel the order
            Alert.alert("Order Cancelled", "Your order has been successfully cancelled.");
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{`ORD${Number(order.id) < 10 ? "0" : ""}${order.id}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>{order.formatted_created_date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee:</Text>
          <Text style={styles.value}>20</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Coupon Discount:</Text>
          <Text style={styles.value}>0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Adv Payment:</Text>
          <Text style={styles.value}>{order.paid_amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Cost:</Text>
          <Text style={styles.value}>{order.total_price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pending Amount:</Text>
          <Text style={styles.value}>{order.total_price-order.paid_amount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order Status:</Text>
          <Text style={styles.value}>{order.payment_status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Status:</Text>
          <Text style={[styles.value, order.status==='Failed' ? styles.cancelled : styles.active]}>
            {order.status==='Failed' ? "Cancelled" : order.status}
          </Text>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.productsContainer}>
        <Text style={styles.sectionTitle}>Products</Text>
        {order.order_items.map((item, index) => (
          <View key={index} style={styles.productItem}>
            {/* <Entypo name="box" size={20} color="#53B175" style={{ marginRight: 10 }} /> */}
            <Image source={{uri:process.env.REACT_APP_IMG_URL + item.product.product_imgs[0].images}} style={{
              marginRight:10,
              width:40,
              height:40
            }}/>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.product.name.length>20 ? item.product.name.slice(0,19) + "..." : item.product.name}</Text>
              <Text style={styles.productDetails}>
                1kg, Quantity: {item.quantity} | Price: ৳{item.total_price}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Delivery Details */}
      <View style={styles.deliveryDetails}>
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <Text style={styles.deliveryText}>{order.shipping_address.name}</Text>
        <Text style={styles.deliveryText}>{order.shipping_address.address}</Text>
        <Text style={styles.deliveryText}>{order.shipping_address.city}, {order.shipping_address.zip_code}</Text>
        <Text style={styles.deliveryText}>{order.shipping_address.country}</Text>
      </View>

      {/* Cancel Order Button */}
      {/* {!isOrderCancelled && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>
      )} */}
    </ScrollView>

  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop:20,
      paddingBottom:95,
      backgroundColor: "#f9f9f9",
      flexGrow: 1,
    },
    orderSummary: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      elevation: 2,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily:"Gilroy-Bold",
      marginBottom: 10,
      color: "#242424",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontFamily:"Gilroy-SemiBold",
      color: "#555",
    },
    value: {
      fontSize: 16,
      fontFamily:"Gilroy-SemiBold",
      color: "#333",
    },
    cancelled: {
      color: "#d9534f",
    },
    active: {
      color: "#5cb85c",
    },
    productsContainer: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      elevation: 2,
      marginBottom: 20,
    },
    productItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e5e5",
    },
    productName: {
      fontSize: 16,
      fontFamily:"Gilroy-Bold",
      color: "#242424",
    },
    productDetails: {
      fontSize: 15,
      fontFamily:"Gilroy-SemiBold",
      color: "gray",
    },
    deliveryDetails: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      elevation: 2,
      marginBottom: 20,
    },
    deliveryText: {
      fontSize: 15,
      fontFamily:"Gilroy-SemiBold",
      color: "#555",
      marginBottom: 5,
    },
    cancelButton: {
      backgroundColor: "#d9534f",
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    cancelButtonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily:"Gilroy-SemiBold",
    },
  });