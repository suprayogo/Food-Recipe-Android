import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; 

function CategoryResultPage({ route, navigation }) {
  const { categoryId } = route.params; // Ambil ID kategori dari params
  const [title, setTitle] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
        setLoading(true); 
      const response = await axios.get(`https://glorious-cow-hospital-gown.cyclic.app/category?categoryId=${categoryId}`);
      if (response.data.recipes && response.data.recipes.length > 0) {
        setSearchResults(response.data.recipes);
        const categoryName = response.data.recipes[0].categoryName; // Ambil categoryName dari objek resep pertama
        setTitle(`Results for ${categoryName}`);
      } else {
        setSearchResults([]); // Kosongkan hasil pencarian jika data tidak tersedia
        setTitle("Results"); // Set judul ke pesan error jika data tidak tersedia
      }
      setLoading(false);
    } catch (error) {
        setLoading(false)
      console.error("Error fetching data:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItemContainer}
      onPress={() => navigation.navigate('DetailRecipe', { recipeInfoAll: item })}
    >
      <Image source={{ uri: item.recipePicture }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#2DBABC" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 24 }}></View>
      </View>
      {loading ? ( // Menampilkan ActivityIndicator saat loading
    <ActivityIndicator size="large" color="#2DBABC" style={styles.loadingIndicator} />
  ) : searchResults.length === 0 ? (
    <Text style={styles.notFoundText}>Recipes Not Found</Text>
  ) : (
    <FlatList
      data={searchResults}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2DBABC',
  },
  recipeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  notFoundText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default CategoryResultPage;
