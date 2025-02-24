import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";


const OrdersScreen = () => {
  const { access_token } = useSelector(state => state.auth)
    // Customer Order Fetch
    const [order,setOrder] = useState([]);
    const allOrders = async ()=>{
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}sp/api/allorders/`,
          {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        }
        )
        console.log(response.data)
        setOrder(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      allOrders();
    },[])
    console.log(order)
    // Mock Data for Orders
    const [orders, setOrders] = useState([
      {
        id: "1",
        orderId: "ORD12345",
        items: "Apple, Banana, Mango",
        total: "৳25.99",
        status: "Pending",
      },
      {
        id: "2",
        orderId: "ORD12346",
        items: "Grapes, Orange",
        total: "৳15.49",
        status: "Delivered",
      },
      {
        id: "3",
        orderId: "ORD12347",
        items: "Watermelon",
        total: "৳10.00",
        status: "Pending",
      },
    ]);

  
    // Cancel Order Handler
    const handleCancelOrder = (orderId) => {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: () => {
              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order.orderId === orderId ? { ...order, status: "Cancelled" } : order
                )
              );
            },
          },
        ]
      );
    };
    const navigation = useNavigation()
  
    const renderOrderItem = ({ item }) => (
      <View style={[styles.orderCard,{position:"relative"}]}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {`ORD${Number(item.id) < 10 ? "0" : ""}${item.id}`}</Text>
        </View>
        <Text style={styles.orderDetails}>Items: {item.order_items.map((productItem,index)=>(
          <Text key={index}>{(productItem.product.name.length>20 ? productItem.product.name.slice(0,19) + ".." : productItem.product.name)+" , "}</Text>
        ))}</Text>
        <Text style={styles.orderDetails}>Total: {item.total_price}</Text>
        <Text
          style={[
            styles.orderStatus,
            {
              color:
                item.status === "Delivered"
                  ? "#53B175"
                  : item.status === "Processing"
                  ? "#FFA500"
                  : "#FF4D4D",
            },
          ]}
        >
          Status: {item.status}
        </Text>
        <TouchableOpacity style={{
          position:"absolute",
          bottom:10,
          right:10,
          
        }} onPress={()=>{
          navigation.navigate("OrderDetails", { order: item });
        }}>
          <Text style={{
            fontSize:14,
            fontFamily:"Gilroy-SemiBold",
            backgroundColor:"#7C7C7C",
            color:"#fff",
            paddingHorizontal:10,
            paddingVertical:5,
            borderRadius:10
          }}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>My Orders</Text> */}
      {orders.length > 0 ? (
        <FlatList
          data={order}
          keyExtractor={(item,index) => index.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noOrderContainer}>
          <Ionicons name="ios-cart" size={50} color="#ccc" />
          <Text style={styles.noOrderText}>No orders found</Text>
        </View>
      )}
    </View>

  )
}

export default OrdersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 18,
    fontFamily: "Gilroy-SemiBold",
    color: "#242424",
  },
  orderDetails: {
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
    color: "#555",
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginTop: 10,
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrderText: {
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
    color: "#ccc",
    marginTop: 10,
  },
});