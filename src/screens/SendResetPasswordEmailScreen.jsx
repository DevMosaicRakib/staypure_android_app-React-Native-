import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSendPasswordResetEmailMutation } from '../Redux/UserAndAuthServices/userAuthApi';
import AntDesign from "react-native-vector-icons/AntDesign";

const SendResetPasswordEmailScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation()
  const [server_error, setServerError] = useState({})
  const [nonFieldError,setNonFieldError] = useState("");
  const [sendPasswordResetEmail] = useSendPasswordResetEmailMutation()
  // const handleSendEmail = () => {
  //   // Add API call logic to send reset password email
  //   Alert.alert('Reset Link Sent', 'Please check your email for the reset link.');
  //   setTimeout(()=>{
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: 'ResetPassword' }], 
  //       });
  //   },3000)
  // };
  const handleSendEmail = async () => {
    try {
      const actualData = {
        email: email,
      }
      const res = await sendPasswordResetEmail(actualData)
    
      if (res.error) {
        console.log(res.error.data.errors)
        setServerError(res.error.data.errors)
        if(res.error.data.errors.non_field_errors){
          setNonFieldError(res?.error?.data?.errors?.non_field_errors[0])
        }
      }
      if (res.data) {
        console.log(res.data)
        setServerError({})
        // setServerMsg(res.data)
        Alert.alert('Success',res.data.msg)
      }
    } catch (error) {
        if (error.response) {
            Alert.alert('Error', error.response.data.detail || 'An error occurred');
        } else {
            Alert.alert('Error', 'Network error');
        }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
      {nonFieldError && (
          <View style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              width:"95%",
              marginHorizontal:"auto",
              borderWidth:1,
              borderColor:"#7C7C7C",
              padding: 15,
              borderRadius:16,
              marginBottom:30
          }}>
              <Text style={{
                  width: "90%",
                  fontSize: 14,
                  fontFamily: "Gilroy-SemiBold",
                  color: "#e14877",
                  textAlign:"center"
                  

              }}>
                {nonFieldError}
              </Text>
              <TouchableOpacity onPress={() => {setNonFieldError("")}}>
                  <Text>
                      <AntDesign name="close" style={{
                      fontSize: 20,
                      fontFamily: "Gilroy-SemiBold",
                      color: "gray"
                  }}/>
                  </Text>
              </TouchableOpacity>
          </View>
      )}
      <Text style={styles.title}>Reset Your Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
        {server_error.email && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:20,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.email[0]}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Send Reset Email</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>

  )
}

export default SendResetPasswordEmailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontFamily:"Gilroy-Bold",
    textAlign: 'center',
    marginBottom: 20,
    color:"#242424"
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    backgroundColor:"#FFF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize:13,
    fontFamily:"Gilroy-SemiBold",
    color:"#7C7C7C"
  },
  button: {
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold"
  },
});