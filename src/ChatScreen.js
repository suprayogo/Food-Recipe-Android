import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null)
  const navigation = useNavigation();
  const [mode, setMode] = useState('LIGHT');
  const isFocused = useIsFocused();

  useEffect(() => {
    getUsers();
  }, [isFocused]);

  const getUsers = async () => {
    try {
      const profile = await AsyncStorage.getItem('profile');
      if (profile !== null) {
        const profileData = JSON.parse(profile);
        let id;
        if (profileData && profileData?.data?.length > 0) {
          // id = profileData?.data[0].id;
          setId(profileData?.data[0].id)
        }
        
        const email = profileData.data[0].email;

        firestore()
          .collection('users')
          .where('email', '!=', profileData.data[0].email)
          .get()
          .then(querySnapshot => {
            const tempData = querySnapshot.docs.map(doc => doc.data());
            console.log(tempData);
            setUsers(tempData);
          })
          .catch(error => {
            console.log('Error retrieving users:', error);
          });
      } else {
        console.log('Profile not found');
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
    }
  };

  const renderUserItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.userItem, {backgroundColor: '#edfafa'}]}
        onPress={() => {
          navigation.navigate('DetailChat', {data: item, id: id});
        }}>
        <Image
          source={require('./assets/Avatar.png')}
          style={styles.userIcon}
        />
        <Text style={styles.name}>{item.fullname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: mode === 'LIGHT' ? 'white' : '#212121'},
      ]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages Rooms</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: '#2DBABC',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  userItem: {
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    height: 60,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
  },
  name: {color: 'black', marginLeft: 20, fontSize: 20},
});
