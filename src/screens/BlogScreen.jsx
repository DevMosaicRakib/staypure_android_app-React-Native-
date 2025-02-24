import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const BlogScreen = () => {
  const blogs = [
    {
      id: "1",
      title: "10 Healthy Snacks for Everyday",
      description:
        "Discover quick, nutritious snacks that you can include in your daily routine.",
      image:
        require("../assets/img/banImage/b1.png"),
    },
    {
      id: "2",
      title: "Benefits of Organic Vegetables",
      description:
        "Learn why choosing organic vegetables can improve your health and lifestyle.",
      image:
        require("../assets/img/banImage/b2.png"),
    },
    {
      id: "3",
      title: "Stay Hydrated This Summer",
      description:
        "Tips to keep yourself hydrated and refreshed during hot summer days.",
      image:
        require("../assets/img/banImage/b3.png"),
    },
  ];

  const renderBlog = ({ item }) => (
    <View style={styles.blogCard}>
      <Image source={item.image} style={styles.blogImage} />
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StayPure Blogs</Text>
        <Text style={styles.headerSubtitle}>Eat Fresh, Stay Pure</Text>
      </View>

      {/* Blog List */}
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={renderBlog}
        contentContainerStyle={styles.blogList}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

export default BlogScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    marginBottom:95
  },
  header: {
    // backgroundColor: "#16a34a",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily:"Gilroy-Bold",
    color: "#242424",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily:"Gilroy-SemiBold",
    color: "#53B175",
    marginTop: 5,
  },
  blogList: {
    padding: 16,
  },
  blogCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  blogContent: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 16,
    fontFamily:"Gilroy-SemiBold",
    color: "#242424",
  },
  blogDescription: {
    fontSize: 13,
    fontFamily:"Gilroy-SemiBold",
    color: "gray",
    marginVertical: 8,
  },
  readMoreButton: {
    alignSelf: "flex-start",
    backgroundColor: "#16a34a",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  readMoreText: {
    fontSize: 13,
    color: "#fff",
    fontFamily:"Gilroy-SemiBold"
  },
});