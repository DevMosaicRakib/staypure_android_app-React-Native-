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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUpdateUserProfileMutation } from '../Redux/UserAndAuthServices/userAuthApi';
import { useSelector } from 'react-redux';
import {REACT_APP_IMG_URL} from "@env";

const UserProfileEdit = ({route}) => {
  // console.log(route.params)
    const userProfileData = route.params.userData;
    const { access_token } = useSelector(state => state.auth)
    // const token = route.params.access_token;
    console.log(access_token)
    console.log(userProfileData)
    const [updateUserProfile] = useUpdateUserProfileMutation();
    const [selectedImage, setSelectedImage] = useState(REACT_APP_IMG_URL + userProfileData.profile_picture);
    const [firstName, setFirstName] = useState(userProfileData.first_name || '');
    const [lastName, setLastName] = useState(userProfileData.last_name || '');
    const [username, setUsername] = useState(userProfileData.username || '');
    const [email, setEmail] = useState(userProfileData.email || '');
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

    const handleImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            const imageUri = response.assets[0].uri;
            setSelectedImage(imageUri);
          }
        });
      };

      const handleProfileSubmit = async () => {
        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('username', username);
        formData.append('email', email);
    
        if (selectedImage) {
          formData.append('profile_picture', {
            uri: selectedImage,
            type: 'image/jpeg', // Adjust the type based on the image format
            name: 'profile.jpg', // You can set a default name
          });
        }
    
        try {
          await updateUserProfile({ data: formData, access_token: access_token }); // Call your API function to update the profile
          // Optionally show a success message
          Alert.alert("Success",'Profile updated successfully !')
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserProfile' }], // Navigate back to the UserProfile screen
          });
        } catch (error) {
          console.error('Failed to update profile', error);
          // Optionally show an error message
        }
      };

    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: keyboardOpen ? 120 : 0 }]}>
        <View style={styles.container}>
          {/* Image with Touchable and Icon */}
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={selectedImage ? { uri: selectedImage } : require('../assets/img/Logo.png')}
                style={styles.profileImage}
              />
              {/* Edit Icon */}
              <View style={styles.iconContainer}>
                <Icon name="photo-camera" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text style={styles.title}>{userProfileData.username}</Text>
          <Text style={styles.subtitle}>{userProfileData.email}</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              // onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              // onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          {/* <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
          </View> */}

          {/* Save Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleProfileSubmit}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

export default UserProfileEdit

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
      imageContainer: {
        position: 'relative',
      },
      profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginBottom:10,
        borderWidth:2,
        borderColor:"#53B175",
        overflow:"hidden"
      },
      iconContainer: {
        position: 'absolute',
        bottom: 3,
        right: 1,
        backgroundColor: '#53B175',
        borderRadius: 15,
        padding: 5,
      },
      title: {
        fontSize: 16,
        fontFamily:"Gilroy-SemiBold",
        color: '#242424',
        marginBottom: 5,
      },
      subtitle: {
        fontSize: 13,
        fontFamily:"Gilroy-SemiBold",
        color: '#666',
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
        height: 45,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 13,
        fontFamily:"Gilroy-SemiBold",
        backgroundColor: '#FFF',
        position:"relative"
      },
      button: {
        backgroundColor: '#53B175',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
      },
      buttonText: {
        color: '#FFF',
        fontSize: 13,
        fontFamily:"Gilroy-SemiBold",
      },
    });