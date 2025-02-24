import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CommonActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import {REACT_APP_API_URL} from "@env"
const CheckoutModal = ({ isModalOpen, setIsModalOpen, sameDay,checkPd }) => {
  console.log(checkPd)
  const [otherDay,setOtherDay] = useState(false)  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date");
  const [timePreference, setTimePreference] = useState("before");
  const [notice, setNotice] = useState("");
  const [checkOutPopupMessage, setCheckOutPopupMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCheckoutPopupMessage = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_URL}sp/api/checkoutpopupmessage/`
        );
        setCheckOutPopupMessage(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCheckoutPopupMessage();
  }, []);

  const handleCheckoutToday = () => {
    if (sameDay) {
      const currentDateTime = selectedDate.toISOString();
      const state = navigation.getState();
  
      // Check if already inside the Cart screen
      // const outSideCart = state.routes.some(route => route.name === "Home");
      // console.log("From checkout",outSideCart)
  
      if (checkPd) {
        // If navigating from another screen, go through the Cart tab first
        navigation.dispatch(
          CommonActions.navigate({
            name: "Cart",
            params: {
              screen: "Checkout",
              params: { date: currentDateTime },
            },
          })
        );
        
      } else {
        // ✅ Directly navigate to Checkout when inside Cart
        navigation.navigate("Checkout", { date: currentDateTime });
      }
  
      setIsModalOpen(false);
    } else {
      setNotice("This product is not available for same-day delivery.");
    }
  };

  const showDateTimePicker = (currentMode) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const handleChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setShowPicker(false);
  };

  const formattedDate = selectedDate.toLocaleDateString(); // "MM/DD/YYYY" (based on locale)
  const formattedTime = selectedDate.toLocaleTimeString(); // "HH:MM AM/PM"
  // const proceedWithSelectedDate = () => {
  //   if (selectedDate) {
  //     const formattedDate = selectedDate.toISOString();
      
  //     navigation.navigate("Cart", { screen: "Checkout", params: {date: formattedDate, time: formattedTime, timePreference} });
  //     setIsModalOpen(false);
  //   }
  // };
  const proceedWithSelectedDate = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString();
      const state = navigation.getState();
  
      // Check if already inside the Cart screen
      // const outSideCart = state.routes.some(route => route.name === "Home");
  
      if (checkPd) {
        // If navigating from another screen, go through the Cart tab first
        navigation.dispatch(
          CommonActions.navigate({
            name: "Cart",
            params: {
              screen: "Checkout",
              params: { date: formattedDate, time: formattedTime, timePreference },
            },
          })
        );

      } else {
        // ✅ Directly navigate to Checkout when inside Cart
        navigation.navigate("Checkout", { 
          date: formattedDate, 
          time: formattedTime, 
          timePreference 
        });
      }
  
      setIsModalOpen(false);
    }
  };
  

  return (
    <Modal visible={isModalOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Please choose your delivery date & time</Text>

          {notice ? <Text style={styles.notice}>{notice}</Text> : null}

          <View style={styles.buttonContainer}>
            {!otherDay ? (
                <>
                <TouchableOpacity
              style={[styles.button, !sameDay && styles.disabledButton]}
              onPress={handleCheckoutToday}
              disabled={!sameDay}
            >
              <Text style={styles.buttonText}>Same Day Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.otherDayButton]}
              onPress={()=>{setOtherDay(true)}}
            >
              <Text style={styles.buttonText}>Other Day Delivery</Text>
            </TouchableOpacity>
                </>
            ) : (
                <>
             <TouchableOpacity
              style={[styles.button, styles.otherDayButton]}
              onPress={() => showDateTimePicker("date")}
            >
              <Text style={styles.buttonText}>Select Date</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.timeButton]}
              onPress={() => showDateTimePicker("time")}
            >
              <Text style={styles.buttonText}>Select Time</Text>
            </TouchableOpacity>
                </>
            )}
            
          </View>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode={mode}
              display="default"
              onChange={handleChange}
            />
          )}

            {otherDay && (
                <>
                <View style={{ width: "100%", marginTop: 5 }}>
                <Text style={{ 
                fontFamily: "Gilroy-SemiBold", 
                fontSize: 11, 
                color: "#242424", 
                paddingHorizontal: 8, 
                textAlign: "center" 
                }}>
                Your order will be delivered on {formattedDate} {timePreference} {formattedTime}
                </Text>
            </View>
            <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: "#e14877",    flex: 1,
                paddingVertical:2.5,
                borderRadius: 5,
                alignItems: "center",
                marginHorizontal: 5,
                backgroundColor: "#e14877", }]}
            onPress={proceedWithSelectedDate}
            >
            <Text style={{ color: "#fff",fontFamily:"Gilroy-SemiBold",fontSize:12 }}>Continue</Text>
          </TouchableOpacity>
                </>
            )}
         
          


          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalOpen(false)}
          >
            <Text style={styles.closeText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    height:"auto",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    marginBottom: 15,
    textAlign: "center",
  },
  notice: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#e14877",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  otherDayButton: {
    backgroundColor: "gray",
  },
  timeButton: {
    backgroundColor: "#007BFF",
  },
  confirmButton: {
    backgroundColor: "#298A60",
    marginTop: 10,
    marginBottom:15,
    minWidth: 100,
    minHeight:22 ,
    marginHorizontal:"auto"
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Gilroy-SemiBold",
    fontSize: 12,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 3,
    padding: 5,
  },
  closeText: {
    fontSize: 9,
    fontFamily:"Gilroy-Bold",
    color: "orangered",
  },
});

export default CheckoutModal;
