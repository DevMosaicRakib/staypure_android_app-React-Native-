import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
import { useChangeUserPasswordMutation } from '../Redux/UserAndAuthServices/userAuthApi';
import AntDesign from "react-native-vector-icons/AntDesign";

const ChangePasswordScreen = ({route}) => {
  const access_token = route.params.access_token;
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [passwordVisible3, setPasswordVisible3] = useState(false);
  const [server_error, setServerError] = useState({});
  const [nonFieldError,setNonFieldError] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const navigation = useNavigation();
  const handleSubmit = async () => {
    const actualData = {
      old_password: currentPassword,
      password: newPassword,
      password2: confirmPassword,
    };
    const res = await changeUserPassword({ actualData, access_token });
    if (res.error) {
      // setServerMsg({})
      console.log(res.error.data.errors);
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
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserProfile' }], // Navigate back to the UserProfile screen
      });
    }
  };
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    // Cleanup subscriptions on component unmount
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: keyboardOpen ? 120 : 0 },
        ]}>

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
              marginTop:100
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
      <View style={styles.container}>
    
      <Text style={styles.title}>Change Password</Text>


      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      {server_error.old_password && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.old_password[0]}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!passwordVisible2}
        />
        <TouchableOpacity onPress={() => setPasswordVisible2(!passwordVisible2)}>
          <Text style={styles.eyeIcon}>{passwordVisible2 ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      {server_error.password && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.password[0]}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!passwordVisible3}
        />
        <TouchableOpacity onPress={() => setPasswordVisible3(!passwordVisible3)}>
          <Text style={styles.eyeIcon}>{passwordVisible3 ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>  
      {server_error.password2 && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.password2[0]}</Text>}

      <TouchableOpacity style={styles.button}   onPress={handleSubmit}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>


    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F5F5F5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 22,
      fontFamily:"Gilroy-Bold",
      color: '#242424',
      marginBottom: 30,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      width: '100%',
    },
    input: {
    //   flex: 1,
      width:"100%",
      height: 50,
      borderWidth: 1,
      borderColor: '#CCC',
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 14,
      fontFamily:"Gilroy-SemiBold",
      backgroundColor: '#FFF',
      position:"relative"
    },
    eyeIcon: {
      //   marginLeft: 10,
        fontSize: 18,
        color: '#888',
        position:"absolute",
        top:-12,
        right:10
      },
      button: {
        backgroundColor: '#53B175',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
      },
      buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily:"Gilroy-SemiBold",
      },
})