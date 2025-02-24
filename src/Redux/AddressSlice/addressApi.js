import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../UserAndAuthServices/LocalStorageService';
import { useSelector } from 'react-redux';
import { REACT_APP_API_URL, REACT_APP_IMG_URL } from '@env';

const baseQuery = fetchBaseQuery({
  baseUrl: `${REACT_APP_API_URL}sp/api/`,
  prepareHeaders: async (headers) => {
    const { access_token } = await getToken(); // Ensure getToken is defined and returns the token
    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`);
    }
    return headers;
  },
});

// const baseQuery = async (args, api, extraOptions) => {
//   const { access_token } = await getToken(); // Await the token retrieval

//   const headers = new Headers();
//   if (access_token) {
//     headers.set('authorization', `Bearer ${access_token}`);
//   }

//   // Call the original fetchBaseQuery with the modified headers
//   return fetchBaseQuery({
//     baseUrl: `${process.env.REACT_APP_API_URL}sp/api/`,
//     prepareHeaders: (headers) => {
//       return headers; // Return the modified headers
//     },
//   })(args, api, extraOptions);
// };

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery,
  endpoints: (builder) => ({
    fetchCustomerShippingAddresses: builder.query({
      query: () => 'customershippingaddress/',
    }),
    addCustomerShippingAddress: builder.mutation({
      query: (address) => ({
        url: 'customershippingaddress/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: address,
      }),
    }),
    updateCustomerShippingAddress: builder.mutation({
      query: ({ shipping_address_id, ...address }) => ({
        url: `customershippingaddress/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          shipping_address_id,
          ...address
        },
      }),
    }),
    deleteCustomerShippingAddress: builder.mutation({
      query: (shipping_address_id) => ({
        url: 'customershippingaddress/',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { shipping_address_id },
      }),
    }),
    fetchCustomerBillingAddresses: builder.query({
      query: () => 'customerbillingaddress/',
    }),
    addCustomerBillingAddress: builder.mutation({
      query: (address) => ({
        url: 'customerbillingaddress/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: address,
      }),
    }),
    updateCustomerBillingAddress: builder.mutation({
      query: ({ billing_address_id, ...address }) => ({
        url: `customerbillingaddress/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          billing_address_id,
          ...address
        },
      }),
    }),
    deleteCustomerBillingAddress: builder.mutation({
      query: (billing_address_id) => ({
        url: 'customerbillingaddress/',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { billing_address_id },
      }),
    }),
  }),
});

export const {
  useFetchCustomerShippingAddressesQuery,
  useAddCustomerShippingAddressMutation,
  useUpdateCustomerShippingAddressMutation,
  useFetchCustomerBillingAddressesQuery,
  useAddCustomerBillingAddressMutation,
  useDeleteCustomerShippingAddressMutation,
  useUpdateCustomerBillingAddressMutation,
  useDeleteCustomerBillingAddressMutation
} = addressApi;