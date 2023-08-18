import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button, TextInput} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

function EditProfile({route}) {
  const {profileData} = route.params;

  console.log('Received profile data:', profileData);

  const [fullname, setFullname] = React.useState(profileData?.fullname || '');
  const [email, setEmail] = React.useState(profileData?.email || '');
  const [phoneNumber, setPhoneNumber] = React.useState(
    profileData?.phoneNumber || '',
  );
  const [password, setPassword] = React.useState('');
  const [selectedFile, setSelectedFile] = useState(
    profileData?.profilePicture || null,
  );
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);

  const handleSaveChanges = async () => {
    if (!token) {
      console.error('Tidak ada token ditemukan. Pengguna belum terotentikasi.');
      return;
    }

    try {
      const profileResponse = await axios.patch(
        `https://glorious-cow-hospital-gown.cyclic.app/profile`,
        {
          fullname,
          email,
          phoneNumber,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Profil berhasil diedit:', profileResponse.data);

      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.fileName,
        });

        try {
          const photoResponse = await axios.patch(
            `https://glorious-cow-hospital-gown.cyclic.app/profile/photo`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          console.log('Foto profil berhasil diubah:', photoResponse.data);
        } catch (photoError) {
          console.error('Error saat mengubah foto profil:', photoError);
        }
      }

      navigation.navigate('Tabs', {
        screen: 'Profile',
        params: {updatedProfileData: profileResponse.data},
      });
    } catch (error) {
      console.error('Error saat mengedit profil:', error);
    }
  };

 
const chooseProfilePicture = () => {
  const options = {
    mediaType: 'photo',
    includeBase64: false,
    quality: 1,
  };

  launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.assets && response.assets.length > 0) {
      const selectedAsset = response.assets[0];

      // Check if selected image exceeds 2MB
      if (selectedAsset.fileSize > 2 * 1024 * 1024) {
        // Display an error message using Alert
        Alert.alert(
          'Error',
          'Selected image size exceeds 2MB. Please choose a smaller image.',
          [{ text: 'OK' }]
        );
        return;
      }

      setSelectedFile(selectedAsset);
    }
  });
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={chooseProfilePicture}>
        {selectedFile && selectedFile.uri ? (
          <Image
            source={{uri: selectedFile.uri}}
            style={styles.profilePicture}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Choose Profile Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Fullname"
        placeholderTextColor="#7abec1"
        keyboardType="default"
        underlineColor="transparent"
        theme={{roundness: 10}}
        value={fullname}
        onChangeText={value => setFullname(value)}
        mode="outlined"
        outlineColor={'#7abec1'}
        activeOutlineColor="#2DBABC"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7abec1"
        keyboardType="default"
        underlineColor="transparent"
        theme={{roundness: 10}}
        value={email}
        onChangeText={value => setEmail(value)}
        mode="outlined"
        outlineColor={'#7abec1'}
        activeOutlineColor="#2DBABC"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#7abec1"
        keyboardType="default"
        underlineColor="transparent"
        theme={{roundness: 10}}
        value={phoneNumber}
        onChangeText={value => setPhoneNumber(value)}
        mode="outlined"
        outlineColor={'#7abec1'}
        activeOutlineColor="#2DBABC"
      />
{/* 
      <TextInput
        style={styles.input}
        placeholder="Change password if you want "
        placeholderTextColor="#7abec1"
        keyboardType="default"
        underlineColor="transparent"
        theme={{roundness: 10}}
        value={password}
        onChangeText={value => setPassword(value)}
        mode="outlined"
        outlineColor={'#7abec1'}
        activeOutlineColor="#2DBABC"
        secureTextEntry={true}
      /> */}

      <Button
        mode="contained"
        onPress={handleSaveChanges}
        style={styles.saveButton}>
        Save Changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf5f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#298994',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#7abec1',
  },
  input: {
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    height: 50,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#2DBABC',
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
});

export default EditProfile;
