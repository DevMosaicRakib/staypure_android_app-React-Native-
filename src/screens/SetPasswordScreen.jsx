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

const SetPasswordScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const handleResetPassword = () => {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      // Add API call logic to reset password using `id` and `token`
      Alert.alert('Success', 'Password has been reset successfully!');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }); // Navigate back after success
    };
    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Text style={styles.title}>Set Your Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Re-type password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!passwordVisible2}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible2(!passwordVisible2)}>
              <Text style={styles.eyeIcon}>{passwordVisible2 ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
  
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Set Password</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
}

export default SetPasswordScreen

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