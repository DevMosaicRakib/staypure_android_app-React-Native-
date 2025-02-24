import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../UserAndAuthServices/LocalStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_API_URL} from '@env'
  // Function to get the device ID from AsyncStorage
  async function getDeviceId() {
    try {
        const deviceId = await AsyncStorage.getItem('device');
        return deviceId;
    } catch (error) {
        console.error("Error retrieving device ID", error);
        return null;
    }
  }







const baseQuery = fetchBaseQuery({
  baseUrl: `${REACT_APP_API_URL}sp/api/`,
  credentials: 'include',  // Ensures cookies are sent with requests
  prepareHeaders: async (headers) => {
    const { access_token } = await getToken();
    let device = await getDeviceId();
    // const deviceCookie = getCookie('device');  // Get device cookie
    console.log("deviceIdState",device)
    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`);
    }
    if (device) {
      headers.set('device', device);  // Set Device-ID header
    }
    
    return headers;
  },
});

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  endpoints: (builder) => ({
    fetchCartItems: builder.query({
      query: () => 'cartitems/cartlist/',
    }),
    addItemToCart: builder.mutation({
      query: (item) => ({
        url: 'cartitems/add_item/',
        method: 'POST',
        body: item,
      }),
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `cartitems/update_item/${id}/`,
        method: 'PATCH',
        body: { quantity },
      }),
    }),
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `cartitems/cartitem_delete/${id}/`,
        method: 'DELETE',
      }),
    }),
    deleteAllCartItems: builder.mutation({
      query: () => ({
        url: 'cartitems/allcart_delete/',
        method: 'DELETE',
      }),
    }),
    addCoupon: builder.mutation({
      query: (couponCode) => ({
        url: 'cartitems/add_coupon/',
        method: 'POST',
        body: { coupon: couponCode },
      }),
    }),
  }),
});

export const {
  useFetchCartItemsQuery,
  useAddItemToCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useDeleteAllCartItemsMutation,
  useAddCouponMutation,
} = cartApi;
