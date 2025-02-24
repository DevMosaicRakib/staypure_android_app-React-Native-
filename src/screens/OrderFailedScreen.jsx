import { CommonActions } from '@react-navigation/native';
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";


const OrderFailedScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(true);
    
    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
            setModalVisible(false);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
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
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
  
            {/* Image */}
            <Image
              source={require('../assets/img/fail.png')}
              style={styles.image}
            />
  
            {/* Title */}
            <Text style={styles.title}>Oops! Order Failed</Text>
  
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Something went terribly wrong.And if you placed order without signing up, you are already 
              a registered user now. Click on set password to set your own password for next login.
            </Text>
  
            {/* Try Again Button */}
            <TouchableOpacity style={styles.tryAgainButton}>
              <Text style={styles.tryAgainButtonText} onPress={() => {
                setModalVisible(false);
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
            }}>Please Try Again</Text>
            </TouchableOpacity>
  
            {/* Back to Home Button */}
            <TouchableOpacity style={styles.setPasswordButton} onPress={() => {
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
              <Text style={styles.setPasswordButtonText}>Set Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
}

export default OrderFailedScreen

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: "#fff",
      borderRadius: 10,
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical:10
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    closeButtonText: {
      fontSize: 34,
      fontFamily:"Gilroy-Regular",
      color: "#000",
    },
    image: {
      width: 100,
      height: 100,
      marginVertical: 10,
      padding:5
    },
    title: {
      fontSize: 26,
      fontFamily:"Gilroy-Bold",
      color: "#242424",
      marginVertical: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      fontFamily:"Gilroy-SemiBold",
      color: "#777",
      textAlign: "center",
      marginBottom: 20,
    },
    tryAgainButton: {
      backgroundColor: "#27ae60",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: "80%",
      alignItems: "center",
      marginVertical: 10,
    },
    tryAgainButtonText: {
      color: "#fff",
      fontFamily:"Gilroy-SemiBold",
      fontSize: 16,
    },
    setPasswordButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: "80%",
      alignItems: "center",
      borderColor: "#ccc",
      borderWidth: 1,
      marginVertical: 5,
    },
    setPasswordButtonText: {
      color: "#000",
      fontFamily:"Gilroy-SemiBold",
      fontSize: 16,
    },
  });