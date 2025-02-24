import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddCustomerShippingAddressMutation, useDeleteCustomerShippingAddressMutation, useFetchCustomerShippingAddressesQuery, useUpdateCustomerShippingAddressMutation } from '../Redux/AddressSlice/addressApi';
import {REACT_APP_API_URL} from '@env'
import useFetch from '../CustomHooks/useFetch';
// const DeliveryScreen = () => {
//   const [shipaddresses, setshipaddresses] = useState([]);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     zip_code: '',
//     customization: '',
//     country: '',
//   });

//   const handleAddOrEditAddress = () => {
//     if (editIndex !== null) {
//       const updatedAddresses = [...shipaddresses];
//       updatedAddresses[editIndex] = newAddress;
//       setshipaddresses(updatedAddresses);
//       setEditIndex(null);
//     } else {
//       setshipaddresses([...shipaddresses, newAddress]);
//     }

//     setIsFormVisible(false);
//     setNewAddress({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       city: '',
//       zip_code: '',
//       customization: '',
//       country: '',
//     });
//   };

//   const handleEdit = (index) => {
//     setEditIndex(index);
//     setNewAddress(shipaddresses[index]);
//     setIsFormVisible(true);
//   };

//   const handleDelete = (index) => {
//     const updatedAddresses = shipaddresses.filter((_, i) => i !== index);
//     setshipaddresses(updatedAddresses);
//   };

//   const renderAddressItem = ({ item, index }) => (
//     <View style={styles.addressCard}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.addCardTitle}>Delivery Address {index + 1}</Text>
//         <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editIcon}>
//          <Icon name="edit" size={21} color="#53B175"/>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.addCardText}>{item.name}</Text>
//       <Text style={styles.addCardText}>{item.email}</Text>
//       <Text style={styles.addCardText}>{item.phone}</Text>
//       <Text style={styles.addCardText}>{item.address}</Text>
//       <Text style={styles.addCardText}>{item.city}</Text>
//       <Text style={styles.addCardText}>{item.zip_code}</Text>
//       <Text style={styles.addCardText}>{item.customization}</Text>
//       <Text style={styles.addCardText}>{item.country}</Text>
//       <TouchableOpacity
//         style={styles.deleteIcon}
//         onPress={() => handleDelete(index)}
//       >
//         <Icon name="delete" size={22} color="#d9534f" />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {isFormVisible ? (
//         <ScrollView contentContainerStyle={styles.scContainer}>
//           <Text style={styles.heading}>Shipping Address</Text>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Name:</Text>
//             <TextInput
//               style={styles.input}
//               value={newAddress.name}
//               onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
//               placeholder="Enter your name"
//             />
//           </View>
//           <View style={styles.rowContainer}>
//             <View style={styles.halfInputContainer}>
//               <Text style={styles.label}>Phone:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={newAddress.phone}
//                 onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
//                 placeholder="Enter your phone number"
//                 keyboardType="phone-pad"
//               />
//             </View>
//             <View style={styles.halfInputContainer}>
//               <Text style={styles.label}>Email:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={newAddress.email}
//                 onChangeText={(text) => setNewAddress({ ...newAddress, email: text })}
//                 placeholder="Enter your email"
//                 keyboardType="email-address"
//               />
//             </View>
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Address:</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={newAddress.address}
//               onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
//               placeholder="Enter your address"
//               multiline
//             />
//           </View>
//           <View style={styles.rowContainer}>
//             <View style={styles.halfInputContainer}>
//               <Text style={styles.label}>Town / City:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={newAddress.city}
//                 onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
//                 placeholder="Enter your city"
//               />
//             </View>
//             <View style={styles.halfInputContainer}>
//               <Text style={styles.label}>Postcode / ZIP:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={newAddress.zip_code}
//                 onChangeText={(text) => setNewAddress({ ...newAddress, zip_code: text })}
//                 placeholder="Enter your ZIP code"
//                 keyboardType="numeric"
//               />
//             </View>
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Customization:</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               value={newAddress.customization}
//               onChangeText={(text) =>
//                 setNewAddress({ ...newAddress, customization: text })
//               }
//               placeholder="Enter customization details"
//               multiline
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Country:</Text>
//             <TextInput
//               style={styles.input}
//               value={newAddress.country}
//               onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
//               placeholder="Enter your country"
//             />
//           </View>
//           <TouchableOpacity style={styles.submitButton} onPress={handleAddOrEditAddress}>
//             <Text style={styles.submitText}>{editIndex !== null ? 'Update Address' : 'Save Address'}</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       ) : (
//         <View>
//           <Text style={styles.title}>Delivery Addresses</Text>

//           {shipaddresses.length === 0 ? (
//             <Text style={styles.noAddressText}>
//               You don't have any shipping address yet. Click the "Add New" button to add one.
//             </Text>
//           ) : (
//             <FlatList
//               shipaddresses={shipaddresses}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderAddressItem}
//             />
//           )}
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => setIsFormVisible(true)}
//           >
//             <Text style={styles.buttonText}>Add New Address</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// export default DeliveryScreen;


const DeliveryScreen = () => {
  const {
    data: shipaddresses,
    error,
    refetch: refetchShippingAddresses,
  } = useFetchCustomerShippingAddressesQuery();
  const [addCustomerShippingAddress] = useAddCustomerShippingAddressMutation();
  const [updateCustomerShippingAddress] = useUpdateCustomerShippingAddressMutation();
  const [deleteCustomerShippingAddress] = useDeleteCustomerShippingAddressMutation();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    customization: "",
    country: "Bangladesh",
  });

  // useEffect(() => {
  //   if (shipaddresses) {
  //     setshipaddresses(shipaddresses);
  //   }
  // }, [shipaddresses]);
  console.log(shipaddresses)
  const handleAddOrEditAddress = async () => {
    try {
      if (editIndex !== null) {
        // Update existing address
        await updateCustomerShippingAddress({
          shipping_address_id: shipaddresses[editIndex].id, // Assuming each address has an id
          ...newAddress,
        });
        Alert.alert("Success","Shipping address updated successfully");
      } else {
        // Add new address
        await addCustomerShippingAddress(newAddress);
        Alert.alert("Success","Shipping address added successfully");
      }
      resetForm();
      refetchShippingAddresses(); // Refresh the list of addresses
    } catch (error) {
      console.error("Error saving shipping address:", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewAddress(shipaddresses[index]);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomerShippingAddress(id);
      Alert.alert("Success","Shipping address deleted successfully");
      refetchShippingAddresses(); // Refresh the list of addresses
    } catch (error) {
      console.error("Error deleting shipping address:", error);
    }
  };

  const resetForm = () => {
    setIsFormVisible(false);
    setEditIndex(null);
    setNewAddress({
      name: "",
      email: "",
      phone: "",
      address: "",
      area: "",
      customization: "",
      country: "Bangladesh",
    });
  };
  // const [shippaddressArea,setShippaddressArea] = useState('')
  const [showDropdownarea, setShowDropdownarea] = useState(false);
  // const addressAreas = async () => {
  //   const res = await axios.get(`${REACT_APP_API_URL}sp/api/shippingaddressarea/`)
  //   // console.log(res.data)
  //   setShippaddressArea(res.data)
  // }
  // useEffect(()=>{
  //   addressAreas()
  // },[])
  const shippaddressArea = useFetch('sp/api/shippingaddressarea/')

  const handleSelectArea = (selectedArea) => {
    setNewAddress({ ...newAddress, area: selectedArea });
    setShowDropdownarea(false);
  };

  const renderAddressItem = ({ item, index }) => (
    <View style={styles.addressCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.addCardTitle}>Delivery Address {index + 1}</Text>
        <TouchableOpacity onPress={() => handleEdit(index)} style={styles.editIcon}>
          <Icon name="edit" size={18} color="#53B175" />
        </TouchableOpacity>
      </View>
      <Text style={styles.addCardText}>{item.name}</Text>
      <Text style={styles.addCardText}>{item.email}</Text>
      <Text style={styles.addCardText}>{item.phone}</Text>
      <Text style={styles.addCardText}>{item.address}</Text>
      <Text style={styles.addCardText}>{item.country}</Text>
      <Text style={styles.addCardText}>{item.customization}</Text>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDelete(item.id)} // Assuming each address has an id
      >
        <Icon name="delete" size={22} color="#d9534f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isFormVisible ? (
        <ScrollView contentContainerStyle={styles.scContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Shipping Address</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={newAddress.name}
              onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
              placeholder="Name"
            />
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Phone:</Text>
              <TextInput
                style={styles.input}
                value={newAddress.phone}
                onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.halfInputContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={newAddress.email}
                onChangeText={(text) => setNewAddress({ ...newAddress, email: text })}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={styles.input}
              value={newAddress.address}
              onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
              placeholder="Address"
              multiline
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Areas:</Text>
            {/* <TextInput
              style={styles.input}
              value={newAddress.area}
              onChangeText={(text) => setNewAddress({ ...newAddress, area: text })}
              placeholder="Select an area"
              multiline
            /> */}
            {/* Input Field (Touchable to Show Dropdown) */}
            <TouchableOpacity onPress={() => setShowDropdownarea(!showDropdownarea)}>
              <TextInput
                style={[styles.input,{position:"relative"}]}
                value={newAddress.area}
                placeholder="Select an area"
                editable={false} // Prevent manual input
              />
            </TouchableOpacity>
            {/* Dropdown Shipp Address Areas  */}
            {showDropdownarea && (
              <View>
                {shippaddressArea?.map((item,index)=>(
                  <TouchableOpacity key={index} style={{
                    width:"100%",
                    position:"absolute",
                    left:0,
                    right:0,
                    bottom:-33,
                    backgroundColor:"#ECEFF1",
                    zIndex:999
                    // marginHorizontal:"auto"
                  }}
                  onPress={() => handleSelectArea(item.place)}
                  >
                  
                    <Text style={{
                      padding:10,
                      fontSize:11,
                      fontFamily:"Gilroy-SemiBold",
                    }}>{item.place}</Text>
                  
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Comment:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAddress.customization}
              onChangeText={(text) => setNewAddress({ ...newAddress, customization: text })}
              placeholder="Write your comment"
              multiline
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country:</Text>
            <TextInput
              style={styles.input}
              value={newAddress.country}
              onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
              placeholder="Country"
            />
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleAddOrEditAddress}>
            <Text style={styles.submitText}>{editIndex !== null ? 'Update Address' : 'Save Address'}</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View>
          <Text style={styles.title}>Delivery Addresses</Text>
          {shipaddresses?.length === 0 ? (
            <Text style={styles.noAddressText}>
              You don't have any shipping address yet. Click the "Add New" button to add one.
            </Text>
          ) : (
            <FlatList
              data={shipaddresses}
              keyExtractor={(item) => item.id.toString()} // Assuming each address has a unique id
              renderItem={renderAddressItem}
            />
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setIsFormVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DeliveryScreen;

const styles = StyleSheet.create({
  scContainer: {
    flexGrow: 1,
    paddingBottom: 110,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    marginBottom: 20,
    color: "#242424",
  },
  noAddressText: {
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#36c285",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
  },
  addressCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
    position: "relative",
  },
  addCardTitle: {
    fontSize: 16,
    fontFamily: "Gilroy-Bold",
    color: "#242424",
    marginBottom: 10,
  },
  addCardText: {
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
    color: "gray",
    marginBottom: 5,
  },
  iconContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    top: 10,
  },
  editIcon: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  deleteIcon: {
    position: "absolute",
    right: 30,
    bottom: 20,
  },
  icon: {
    color: "#fff",
    fontSize: 16,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    marginBottom: 20,
    color: "#242424",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    padding: 10,
    fontSize: 13,
    fontFamily: "Gilroy-SemiBold",
    borderRadius: 5,
  },
  textArea: {
    height: 60,
    textAlignVertical: "top",
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInputContainer: {
    width: "48%",
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
  },
  submitButton: {
    backgroundColor: "#23bb73",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Gilroy-Bold",
  },
});
