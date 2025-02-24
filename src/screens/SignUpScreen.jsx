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
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch } from 'react-redux';
import { useRegisterUserMutation } from '../Redux/UserAndAuthServices/userAuthApi';
import { CommonActions } from '@react-navigation/native';

const initialUser = {username:"",email:"",password:"",password2:""}
const SignUpScreen = () => {
  const [user,setUser] = useState(initialUser)
  const dispatch = useDispatch();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [nonFieldError,setNonFieldError] = useState("");


    const handleChange = (name, value) => {
      setUser ((currentUser ) => ({
          ...currentUser ,
          [name]: value,
      }));
  };

    const [server_error, setServerError] = useState({})
    const [registerUser] = useRegisterUserMutation();
    const handleSubmit = async () => {
      const actualData = user;
      // console.log(actualData);
      try {
          const res = await registerUser (actualData);
  
          // Check if the response is valid JSON
          if (res.error) {
            if (res?.error?.data?.errors?.non_field_errors) {
              setNonFieldError(res?.error?.data?.errors?.non_field_errors[0])
            }
            setServerError(res.error.data.errors);
          } else if (res.data) {
              console.log(res.data);
              setServerError({});
              setUser (initialUser );
              Alert.alert("Registration Successful", "You have successfully registered!");
              setTimeout(() => {
                  navigation.dispatch(
                      CommonActions.reset({
                          index: 0,
                          routes: [{ name: "Account", params: { screen: "Login" } }],
                      })
                  );
              }, 2000);
          }
      } catch (error) {
          console.error("Error during registration:", error);
          Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
  };
  console.log(nonFieldError)

    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const navigation = useNavigation()
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
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Enter your credentials to continue</Text>
      
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(value) => handleChange('username', value)}
        value={user.username}
      />
      </View>
      {server_error.username && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.username[0]}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleChange('email', value)}
          value={user.email}
          keyboardType="email-address"
        />
        {/* {emailValid && <Text style={styles.validIcon}>✓</Text>} */}
      </View>
      {server_error.email && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:12,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.email[0]}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(value) => handleChange('password', value)}
          value={user.password}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
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
          placeholder="Re-type Password"
          onChangeText={(value) => handleChange('password2', value)}
          value={user.password2}
          secureTextEntry={!passwordVisible2}
        />
        <TouchableOpacity onPress={() => setPasswordVisible2(!passwordVisible2)}>
          <Text style={styles.eyeIcon}>{passwordVisible2 ? '👁️' : '🙈'}</Text>
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

      <Text style={styles.terms}>
        By continuing you agree to our{' '}
        <Text style={styles.nolink}>Terms of Service</Text> and{' '}
        <Text style={styles.nolink}>Privacy Policy</Text>.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={()=>{
          // navigation.navigate('Login')
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], 
            });
        }}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>


    </View>
    </ScrollView>
    </TouchableWithoutFeedback>

    );
}

export default SignUpScreen

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
    logo: {
      width: 50,
      height: 50,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontFamily:"Gilroy-Bold",
      color: '#242424',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 13,
      fontFamily:"Gilroy-SemiBold",
      color: '#7C7C7C',
      marginBottom: 20,
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
    validIcon: {
      marginLeft: 10,
      fontSize: 18,
      color: 'green',
      fontFamily:"Gilroy-SemiBold",
      position:"absolute",
      top:12,
      right:10
    },
    eyeIcon: {
    //   marginLeft: 10,
      fontSize: 18,
      color: '#888',
      position:"absolute",
      top:-12,
      right:10
    },
    terms: {
      fontSize: 14,
      fontFamily:"Gilroy-SemiBold",
      color: '#7C7C7C',
      marginVertical: 10,
      textAlign: 'center',
    },
    link: {
      color: '#53B175',
      fontFamily:"Gilroy-SemiBold",
      textDecorationLine: 'underline',
      fontSize: 14,
      marginTop:18
    },
    nolink: {
      color: '#53B175',
      fontFamily:"Gilroy-SemiBold",
      fontSize: 14,
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
    footerText: {
      fontSize: 14,
      fontFamily:"Gilroy-SemiBold",
      color: '#7C7C7C',
      marginTop: 20,
    },
  });