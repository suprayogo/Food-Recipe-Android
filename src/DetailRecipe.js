import React from 'react';
import {Text, Button, Avatar} from 'react-native-paper';
import {
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/AntDesign';
import {useRoute} from '@react-navigation/native';

function DetailRecipe(props) {
  const [type, setType] = React.useState('ingredients');

  {
    /* Intergrasi of Start*/
  }

  const {navigation} = props;
  const route = useRoute();
  const setRecipeInfoAll = route.params?.recipeInfoAll;

const idYt = setRecipeInfoAll.video_link;
console.log(idYt)
  const openYoutubeLink = () => {
    const youtubeLink =`https://www.youtube.com/embed/${idYt}` // Replace this with the actual YouTube link
    Linking.openURL(youtubeLink)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle the URL: " + youtubeLink);
        } else {
          return Linking.openURL(youtubeLink);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  {
    /* Intergrasi of End*/
  }






  return (
    <View style={{flex: 1, alignItems: 'flex-start'}}>
      {/* Header Background */}
      <View style={{flex: 0.8, width: '100%'}}>
        <ImageBackground
          source={{uri: setRecipeInfoAll.recipePicture}}
          resizeMode="cover"
          style={{height: '100%', justifyContent: 'flex-end', width: '100%'}}
          imageStyle={{
            borderRadius: 6,
            resizeMode: 'cover',
            position: 'absolute',
            top: 0,
          }}>
          <View style={{position: 'absolute', top: 20, marginLeft: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrowleft" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{marginBottom: 25, padding: 20}}>
            <Text
              variant="titleLarge"
              style={{
                color: '#fff',
                fontSize: 30,
                marginBottom: 2,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10,
              }}
              numberOfLines={1}>
              {setRecipeInfoAll.title}
            </Text>
            <Text
              style={{
                color: '#fff',
                marginBottom: 2,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10,
              }}
              numberOfLines={1}>
              By {setRecipeInfoAll.namechef}
            </Text>
          </View>
        </ImageBackground>
      </View>
      {/* End of Header Background */}

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          minWidth: '100%',
          backgroundColor: 'white',
          marginTop: -20,
          borderRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}>
        {/* Button Switch */}
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Button
            labelStyle={
              type === 'ingredients'
                ? styles.buttonActive
                : styles.buttonNonActive
            }
            onPress={() => setType('ingredients')}>
            Ingredients
          </Button>
          <Button
            labelStyle={
              type === 'video' ? styles.buttonActive : styles.buttonNonActive
            }
            onPress={() => setType('video')}>
            Video Step
          </Button>
        </View>

        <ScrollView>
          {/* Ingredients View */}
          {type === 'ingredients' ? (
            <View style={styles.container}>
              {setRecipeInfoAll.ingredients
                .split('.')
                .filter(sentence => sentence !== '')
                .map((sentence, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bullet}>{'\u2022'}</Text>
                    <Text style={styles.ingredientText}>{sentence}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <>
              {/* Video Step View */}
              {/* {[...new Array(5)].map((item, key) => ( */}
              <TouchableOpacity onPress={openYoutubeLink}>
              <View
                // key={key}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#edfafa',
                  padding: 10,
                  borderRadius: 15,
                  alignItems: 'center',
                  gap: 25,
                  marginBottom: 15,
                }}>
                <Avatar.Icon
                  size={60}
                  icon="play"
                  style={{borderRadius: 20, backgroundColor: '#2DBABC'}}
                />
                <View>
                  <Text style={{fontSize: 18}}>Cooking Tutorials</Text>
                </View>

              </View>
                </TouchableOpacity>
              {/* ))} */}
            </>
          )}
        </ScrollView>
      </View>
      {/* End Of Main Content */}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonActive: {
    color: '#18172B',
    borderBottomWidth: 2,
    borderBottomColor: '#2DBABC',
    fontSize: 16,
  },
  buttonNonActive: {color: '#666666', fontSize: 16},

  container: {
    backgroundColor: '#edfafa',
    borderRadius: 10,
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 14,
  },
});

export default DetailRecipe;
