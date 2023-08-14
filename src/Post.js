/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {CommonActions, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Button, TextInput} from 'react-native-paper';
import {PERMISSIONS, request} from 'react-native-permissions';
import {useSelector} from 'react-redux';

export default function Post() {
  const [title, setTittle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [video_link, setVideoLink] = useState('');
  const [category, setCategory] = useState('');
  const [recipePicture, setRecipePicture] = useState(null);
  const auth = useSelector(state => state?.auth);
  const navigation = useNavigation();
  const [newPhoztoChosen, setNewPhoztoChosen] = useState(false);
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [phostoSize, setPhostoSize] = useState(0);
  const [phoxtoFormat, setPhoxtoFormat] = useState('');

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'App needs access to your gallery ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Gallery permission given');
        chooseImage();
      } else {
        const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, {
          title: 'Gallery Permission',
          message: 'App needs access to your gallery',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        console.log(result);

        if (result === 'granted') {
          console.log('Gallery permission given');
          chooseImage();
        } else {
          console.log('Gallery permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        takeImage();
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Camera permission denied');
        const tryAgain = await showRetryDialog();//try again camera
        if (tryAgain) {
          requestCameraPermission(); 
        } else {
          console.log('User chose not to try again');
        }
      } else {
        console.log('Camera permission request canceled');
      }
    } catch (err) {
      Alert.alert('Error', err);
    }
  };

//for ask camera again
  const showRetryDialog = async () => {
    return new Promise(resolve => {
      Alert.alert(
        'Camera Permission Denied',
        'The app needs access to your camera to take photos. Please allow the camera permission in your device settings.',
        [
          {text: 'Cancel', onPress: () => resolve(false), style: 'cancel'},
          {text: 'Try Again', onPress: () => resolve(true)},
        ],
        {cancelable: false},
      );
    });
  };

  const takeImage = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri};
        setPhostoSize(response.assets[0].fileSize);
        setPhoxtoFormat(response.assets[0].type);
        setRecipePicture(source.uri);
        setNewPhoztoChosen(true);
      }
    });
  };
  const chooseImage = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setPhostoSize(response.assets[0].fileSize);
        setPhoxtoFormat(response.assets[0].type);
        const source = {uri: response.assets[0].uri};
        setRecipePicture(source.uri);
        setNewPhoztoChosen(true);
      }
    });
  };
  const removeImage = () => {
    setRecipePicture(null);
    setNewPhoztoChosen(false);
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      if (title === '') {
        Alert.alert('Title cant be empty');
      } else if (ingredients === '') {
        Alert.alert('Ingredients cant be empty');
      } else if (video_link === '') {
        Alert.alert('Video Link cant be empty');
      } else if (category === '') {
        Alert.alert('Category cant be empty');
      } else if (recipePicture === null) {
        Alert.alert('Image cant be empty');
      } else if (phostoSize > 2000000) {
        Alert.alert('Image size cant be more than 2MB');
      } else if (
        phoxtoFormat !== 'image/jpeg' &&
        phoxtoFormat !== 'image/png' &&
        phoxtoFormat !== 'image/jpg' &&
        phoxtoFormat !== 'image/webp'
      ) {
        Alert.alert('Image format must be jpeg or png or jpg or webp');
      }
      const token = auth?.token;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('ingredients', ingredients);
      formData.append('video_link', video_link);
      formData.append('category', category);
      formData.append('photo', {
        uri: recipePicture,
        type: 'image/jpeg',
        name: 'image',
      });

      console.log(formData);
      await axios
        .post(
          `https://glorious-cow-hospital-gown.cyclic.app/recipes`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        .then(res => {
          setRecipePicture(null);
          setTittle('');
          setIngredients('');
          setVideoLink('');
          setCategory('');
          setNewPhoztoChosen(false);
          if (res.data.message === 'Success insert data') {
            navigation.navigate('Home');
          }
          scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
        });
    } catch (error) {
      console.log('Error while adding recipe:', error);

      if (error.response) {
        // console.log('Response data:', error.response.data);
        // console.log('Response status:', error.response.status);
        // console.log('Response headers:', error.response.headers);
        console.log('-------');
        console.log(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.token) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    }
  }, [auth.token, navigation]);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ecf5f6" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 15}
        style={{flex: 1}}>
        <ScrollView style={styles.scroll} ref={scrollViewRef}>
          <Text style={styles.text}>Add Your Recipe</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#7abec1"
              keyboardType="default"
              underlineColor="transparent"
              theme={{roundness: 10}}
              value={title}
              onChangeText={value => setTittle(value)}
              mode="outlined"
              outlineColor={'#7abec1'}
              activeOutlineColor="#2DBABC"
            />

<TextInput
              style={styles.input}
              placeholder="Category"
              placeholderTextColor="#7abec1"
              keyboardType="default"
              underlineColor="transparent"
              theme={{roundness: 10}}
              value={category}
              onChangeText={value => setCategory(value)}
              mode="outlined"
              outlineColor={'#7abec1'}
              activeOutlineColor="#2DBABC"
            />

            <Text style={{color: '#2DBABC', marginLeft: 20, marginBottom: 5}}>
            Please end a period (.) for each recipe and follow a space for each ingredient.
            </Text>
            <TextInput
              style={styles.input2}
              placeholder={`Examples of Ingredients:\n 1 ons gula.\n 10 gram cabai. \n 5 gram tomat.`}
              placeholderTextColor="#7abec1"
              keyboardType="default"
              underlineColor="transparent"
              theme={{roundness: 10}}
              value={ingredients}
              onChangeText={value => setIngredients(value)}
              mode="outlined"
              multiline={true}
              outlineColor={'#7abec1'}
              activeOutlineColor="#2DBABC"
            />

<Text style={{ color: '#2DBABC', marginLeft: 20, marginBottom: 5 }}>
        Copy the link from youtube and copy the id like the yellow text :{' '}
        https://www.youtube.com/watch?v=
        <Text style={{ backgroundColor: 'yellow' }}>3VjwogzQSD8</Text>
      </Text>

            <TextInput
              style={styles.input}
              placeholder="Example link id YouTube: 3VjwogzQSD8"
              placeholderTextColor="#7abec1"
              keyboardType="default"
              underlineColor="transparent"
              theme={{roundness: 10}}
              value={video_link}
              onChangeText={value => setVideoLink(value)}
              mode="outlined"
              outlineColor={'#7abec1'}
              activeOutlineColor="#2DBABC"
            />
          
          

            <Text style={styles.textAdd}>Add Image</Text>
            {recipePicture && (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: recipePicture}}
                  style={styles.imageGalery}
                />
                <Button
                  mode="contained"
                  style={styles.buttonStyle2}
                  labelStyle={{color: 'white'}}
                  title="Remove Photo"
                  onPress={removeImage}>
                  Remove Image
                </Button>
              </View>
            )}
            {!newPhoztoChosen && (
              <Button
                style={styles.buttonImageUpload}
                mode="outlined"
                labelStyle={{color: '#298994'}}
                theme={{colors: {outline: '#298994'}}}
                onPress={requestGalleryPermission}>
                Choose from Gallery
              </Button>
            )}
            {!newPhoztoChosen && (
              <Button
                style={styles.buttonImageUpload}
                mode="outlined"
                labelStyle={{color: '#298994'}}
                theme={{colors: {outline: '#298994'}}}
                onPress={requestCameraPermission}>
                Take Photo
              </Button>
            )}

            <TouchableOpacity
              mode="contained"
              style={styles.button}
              labelStyle={{color: 'white'}}
              theme={{colors: {outline: '#298994'}}}
              title="Submit Recipe"
              disabled={loading}
              onPress={handleAdd}>
             {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Add Recipe</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf5f6',
  },
  scroll: {
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    color: '#298994',
  },
  textAdd: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#298994',
  },
  input: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    height: 50,
  },
  input2: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    height: 150,
  },
  button: {
    backgroundColor: '#2DBABC',
    borderRadius: 10,
    margin: 10,
    height: 50,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  imageGalery: {
    width: 300,
    height: 300,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  buttonImageUpload: {
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '',
  },
  buttonStyle2: {
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
