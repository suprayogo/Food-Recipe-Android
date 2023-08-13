import React, {useState} from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {useSelector} from 'react-redux';

function AllRecipe({route, navigation}) {
  const [showSearch, setShowSearch] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true); // State untuk menunjukkan loading
  const setRecipeInfoAll = route.params?.recipeInfoAll;
  const token = useSelector(state => state.auth.token);

  const toggleLike = async id => {
    try {
      const response = await axios.post(
        `https://glorious-cow-hospital-gown.cyclic.app/recipes/${id}/like`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Response from server:', response.data);

      if (!likedItems.includes(id)) {
        setLikedItems([...likedItems, id]);
      } else {
        setLikedItems(likedItems.filter(item => item !== id));
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.error('Authentication failed. Please log in again.');
        } else {
          console.error('Error liking recipe:', error.response.data.message);
        }
      } else {
        console.error('An unexpected error occurred:', error.message);
      }
    }
  };

  const fetchLikeStatus = async id => {
    try {
      const response = await axios.get(
        `https://glorious-cow-hospital-gown.cyclic.app/recipes/${id}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.isLiked) {
        setLikedItems(prevLikedItems => [...prevLikedItems, id]);
      }
    } catch (error) {
      console.error('Error fetching like status:', error.message);
    }
  };

  React.useEffect(() => {
    const recipeIdsToCheck = setRecipeInfoAll.map(item => item.id);

    const fetchLikeStatusForAll = async () => {
      setLoading(true); // Menampilkan loading saat fetch status like
      await Promise.all(recipeIdsToCheck.map(id => fetchLikeStatus(id)));
      setLoading(false); // Menyembunyikan loading setelah selesai fetching
    };

    fetchLikeStatusForAll();
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchText('');
  };

  const renderItem = ({item}) => {
    if (
      searchText &&
      !item.title.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return null;
    }

    const isLiked = likedItems.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.recipeItemContainer}
        onPress={() =>
          navigation.navigate('DetailRecipe', {recipeInfoAll: item})
        }>
        <Image source={{uri: item.recipePicture}} style={styles.recipeImage} />
        <Text style={styles.recipeName}>{item.title}</Text>
        <Icon
          name="heart"
          size={30}
          color={isLiked ? '#2DBABC' : 'gray'}
          onPress={() => toggleLike(item.id)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="chevron-left" size={20} color="#2DBABC" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Recipes</Text>
        <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
          <Icon name="search" size={20} color="#2DBABC" />
        </TouchableOpacity>
      </View>
      {showSearch && (
        <View style={styles.searchBar}>
          <TextInput
            style={[styles.searchInput, {backgroundColor: '#DDDDDD'}]}
            placeholder="Search"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        </View>
      )}
      {loading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#2DBABC"
        />
      ) : (
        <FlatList
          data={setRecipeInfoAll}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2DBABC',
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  recipeItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  recipeImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 35,
  },
  recipeName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
});

export default AllRecipe;
