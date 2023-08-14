import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

export default function EditProfile() {
    const [fullname, setFullname] = React.useState(profile?.fullname || "");
    const [email, setEmail] = React.useState(profile?.email || "");
    const [phoneNumber, setPhoneNumber] = React.useState(
      profile?.phoneNumber || ""
    );
    const [password, setPassword] = React.useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSaveChanges = () => {
    // Implement saving changes logic here
  };

  const chooseProfilePicture = () => {
    // Implement profile picture selection logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={chooseProfilePicture}>
        {profilePicture ? (
          <Image source={{uri: profilePicture}} style={styles.profilePicture} />
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
