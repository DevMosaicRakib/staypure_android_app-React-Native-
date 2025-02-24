import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, SafeAreaView, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Slider from "@react-native-community/slider";
import useFetch from '../CustomHooks/useFetch';
import { useNavigation } from '@react-navigation/native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const FilterPopup = ({ isOpen, onClose, device,openModal }) => {
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? screenHeight * 0.2 : screenHeight, // Slide in (80% height)
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigation = useNavigation()
  const catData = useFetch('sp/api/categories/')
  console.log(catData);
  const productsData = useFetch('sp/api/products/')
  // console.log(productsData)

  const handleSelectCategory = (catname) => {
    setSelectedCategory(catname);
    if (catname && productsData) {
      const filteredProducts = productsData.filter((item) => {
        // Check if the item's category matches the selected category
        return item?.Category?.catname === catname;
      });
      // setFilteredProducts(filtered);
      setTimeout(()=>{
        navigation.navigate("Products_show", { Name: catname, Products:filteredProducts , device:device, openModal: openModal});
        onClose()
      },1000)
    }
  };
  // const [filteredPrice, setFilteredPrice] = useState(0);
  const highestPrice = productsData && productsData.length > 0
  ? Math.max(...productsData.flatMap(product => 
      product.variants.length > 0 
        ? product.variants.map(variant => parseFloat(variant.discount_price))
        : [parseFloat(product.discount_price)] // Fallback to product discount_price if no variants
    ))
  : 0; // Default value

  // console.log(highestPrice);
  const [filteredPrice, setFilteredPrice] = useState(highestPrice?highestPrice:null);
  useEffect(() => {
    if (highestPrice > 0) {
      setFilteredPrice(highestPrice);
    }
  }, [highestPrice]);

  console.log(filteredPrice);

  const handlePriceChange = (value) => {
    setFilteredPrice(value);
  };

  const handlePricefilter = () => {
    if (filteredPrice > 0 && productsData) {
        let filteredProducts = productsData.filter(product => {
            // Find the highest discount_price among all variants
            const maxDiscountPrice = product.variants?.length > 0
                ? Math.max(...product.variants.map(variant => parseFloat(variant.discount_price)))
                : 0;

            return maxDiscountPrice <= filteredPrice;
        });

        setTimeout(() => {
            navigation.navigate("Products_show", { Name: '', Products: filteredProducts, device: device, openModal: openModal });
            onClose();
        }, 1000);

        return filteredProducts;
    }
};


  console.log(selectedCategory)
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleSelectCategory(item.catname)}
    >
      <View
        style={[
          styles.checkbox,
          selectedCategory === item.catname && styles.checkboxSelected,
        ]}
      >
        {selectedCategory === item.catname && <Feather name='check' style={styles.checkmark}/>}
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.catname && styles.categoryNameSelected,
        ]}
      >
        {item.catname}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1} // Close on pressing outside the popup
        />
      )}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }], // Slide animation
          },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          {/* <Entypo name="cross" style={styles.closeText}/> */}
           <Text style={styles.closeText}>❌</Text>
        </TouchableOpacity>
        <View style={{
          paddingHorizontal:10,
          paddingVertical:10
        }}>
        <Text style={styles.title}>Categories</Text>
        <FlatList
          data={catData}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Price filter start */}

      <View style={styles.priceFilter}>
        <Text style={{
          fontSize:16,
          fontFamily:"Gilroy-Bold",
          color:"#242424",
          marginBottom:10,
          width:"100%",
          textAlign:"left"
        }}>Price Filter</Text>
      <Text style={styles.priceText}>
        ৳ {Number(filteredPrice).toFixed(2)}
      </Text>
      <Slider
        style={styles.slider}
        value={filteredPrice}
        minimumValue={0}
        maximumValue={highestPrice}
        step={1} // Adjust step if required (e.g., 0.01 for finer precision)
        onValueChange={handlePriceChange}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1fb28a" // Customize the thumb color
      />
    </View>
    <View>
                {filteredPrice > 0 && ( // Show button only if filteredPrice is greater than 0
                    <TouchableOpacity style={{
                        width: '90%',
                        height: 60,
                        marginHorizontal: "auto",
                        marginTop:20
                    }} onPress={handlePricefilter}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: "Gilroy-SemiBold",
                            color: "#fff",
                            backgroundColor: "#53B145",
                            borderRadius: 10,
                            padding: 10,
                            textAlign: "center"
                        }}>
                            Filter Products in ৳{filteredPrice}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default FilterPopup;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 99, // Below the popup
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth, // Full width
    height: screenHeight * 0.99, // 80% height
    backgroundColor: 'white',
    zIndex: 100, // Above the overlay
    padding: 20,
    borderTopLeftRadius: 30, // Rounded corners
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
  },
  closeButton: {
    position:"absolute",
    top:10,
    right:20
  },
  closeText: {
    color: 'gray',
    fontSize: 10,
    fontWeight:"300"
  },
  title: {
    fontSize: 16,
    fontFamily:"Gilroy-Bold",
    marginBottom: 12,
    color:"#242424"
    // marginTop:15
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    borderColor: "#27ae60",
    backgroundColor: "#27ae60",
  },
  checkmark: {
    fontSize:14,
    color: "#fff",
    fontFamily:"Gilroy-Bold",
    textAlign:"center"
  },
  categoryName: {
    fontSize: 14,
    color: "#333",
    fontFamily:"Gilroy-SemiBold"
  },
  categoryNameSelected: {
    color: "#27ae60",
    fontFamily:"Gilroy-Bold",
  },
  priceFilter: {
    margin: 10,
    alignItems: "center",
  },
  priceText: {
    width:"90%",
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold",
    textAlign: "center",
    marginBottom: 10,
    color:"#53B175"
  },
  slider: {
    width: "90%",
    height: 40,
  },

});
