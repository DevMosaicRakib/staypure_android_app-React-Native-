import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useResetPasswordMutation } from '../Redux/UserAndAuthServices/userAuthApi';
import AntDesign from "react-native-vector-icons/AntDesign";
const ResetPasswordScreen = ({navigation,route}) => {
  const [server_error, setServerError] = useState({});
  const id = route.params.uid;
  const token = route.params.token;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [resetPassword] = useResetPasswordMutation()
  const [nonFieldError,setNonFieldError] = useState("");
  // const handleResetPassword = () => {
  //   if (password !== confirmPassword) {
  //     Alert.alert('Error', 'Passwords do not match');
  //     return;
  //   }
  //   // Add API call logic to reset password using `id` and `token`
  //   Alert.alert('Success', 'Password has been reset successfully!');
  //   navigation.reset({
  //     index: 0,
  //     routes: [{name: 'Login'}],
  //   }); // Navigate back after success
  // };


  const handleResetPassword = async () => {
    try {
    const actualData = {
      password: password,
      password2: confirmPassword,
    }
    const res = await resetPassword({ actualData, id, token })
    if (res.error) {
      // setServerMsg({})
      setServerError(res.error.data.errors)
      if(res.error.data.errors.non_field_errors){
        setNonFieldError(res?.error?.data?.errors?.non_field_errors[0])
      }
    }
    if (res.data) {
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
                  fontSize: 16,
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
        {/* <View>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      
      <View>
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => setPasswordVisible2(!passwordVisible2)}>
          <Text style={styles.eyeIcon}>{passwordVisible2 ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View> */}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        {server_error.password && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:14,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.password[0]}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!passwordVisible2}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible2(!passwordVisible2)}>
            <Text style={styles.eyeIcon}>{passwordVisible2 ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        {server_error.password2 && <Text style={{
          width:"95%",
          marginHorizontal:"auto",
          marginBottom:10,
          fontSize:14,
          fontFamily:"Gilroy-Medium",
          color:"#e14877"
        }}>***{server_error.password2[0]}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Gilroy-Bold',
    color: '#242424',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 5,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
    color: '#7C7C7C',
    position: 'relative',
  },
  button: {
    backgroundColor: '#53B175',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Gilroy-SemiBold',
  },
  eyeIcon: {
    //   marginLeft: 10,
    fontSize: 18,
    color: '#888',
    position: 'absolute',
    top: -22,
    right: 10,
  },
});
