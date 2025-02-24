import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
const OrderSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" style={styles.checkIcon}/>
        </View>
      </View>

      {/* Success Message */}
      <Text style={styles.title}>Your Order has been accepted</Text>
      <Text style={styles.subtitle}>
        Your items have been placed and are on their way to being processed.And if you placed order without signing up, you are already 
        a registered user now. Click on set password to set your own password for next login.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity
          style={styles.trackOrderButton}
          onPress={
            ()=>{
                navigation.navigate("Account", {
                    screen: "Orders", // The target screen in CartAndCheckoutNavigator
                  });
            }
          }
        >
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
            style={styles.trackOrderButton}
            onPress={() => {
                navigation.dispatch(
                CommonActions.reset({
                    index: 0, // The index of the active screen
                    routes: [
                    {
                        name: "Account", // The parent navigator or screen name
                        params: { screen: "Orders" }, // Target screen in CartAndCheckoutNavigator
                    },
                    ],
                })
                );
            }}
            >
            <Text style={styles.buttonText}>Track Order</Text>
            </TouchableOpacity>
        <TouchableOpacity
          style={styles.backHomeButton}
          onPress={() => {
            navigation.dispatch(
            CommonActions.reset({
                index: 0, // The index of the active screen
                routes: [
                {
                    name: "Shop", // The parent navigator or screen name
                    params: { screen: "Shop_stack" }, // Target screen in CartAndCheckoutNavigator
                },
                ],
            })
            );
        }}
        >
          <Text style={[styles.buttonText, { color: "#53B175" }]} onPress={() => {
            navigation.dispatch(
            CommonActions.reset({
                index: 0, // The index of the active screen
                routes: [
                {
                    name: "Account", // The parent navigator or screen name
                    params: { screen: "setPassword" }, // Target screen in CartAndCheckoutNavigator
                },
                ],
            })
            );
        }}>
            Set Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#53B175",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    fontSize: 80,
    color: "#FFFFFF",
    fontFamily:"Gilroy-Black",
  },
  title: {
    fontSize: 26,
    fontFamily:"Gilroy-Bold",
    color: "#181725",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    width:"85%",
    fontSize: 17,
    fontFamily:"Gilroy-SemiBold",
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  trackOrderButton: {
    width: "90%",
    backgroundColor: "#53B175",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  backHomeButton: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#53B175",
  },
  buttonText: {
    fontSize: 17,
    fontFamily:"Gilroy-SemiBold",
    color: "#FFFFFF",
  },
});

export default OrderSuccessScreen;
