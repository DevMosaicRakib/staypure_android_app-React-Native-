import AsyncStorage from '@react-native-async-storage/async-storage';

  // Function to store tokens
  const storeToken = async (value) => {
      if (value) {
        //   console.log("Store Token");
          const { access, refresh } = value;
        //   console.log("Store access Token", access)
        //   console.log("Store refresh Token", refresh)
          try {
              await AsyncStorage.setItem('access_token', access);
              await AsyncStorage.setItem('refresh_token', refresh);
          } catch (error) {
              console.error("Error storing tokens", error);
          }
      }
  };
  
  // Function to get tokens
  const getToken = async () => {
      try {
          const access_token = await AsyncStorage.getItem('access_token');
          const refresh_token = await AsyncStorage.getItem('refresh_token');
        //   console.log("get access", access_token)
        //   console.log("get refresh", refresh_token)
          return { access_token, refresh_token };
      } catch (error) {
          console.error("Error retrieving tokens", error);
          return { access_token: null, refresh_token: null };
      }
  };
  
  // Function to remove tokens
  const removeToken = async () => {
      try {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
      } catch (error) {
          console.error("Error removing tokens", error);
      }
  };
  
  export { storeToken, getToken, removeToken };  