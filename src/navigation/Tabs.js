import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import ChatScreen from '../ChatScreen';
import HomeScreen from '../Home';
import PostScreen from '../Post';
import ProfileScreen from '../Profile';


const Tabs = () => {

  const Tab = createBottomTabNavigator();
  return (

    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
  >

    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {display: 'none'},
        tabBarStyle: {
          position: 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 0,
          height: 60,
          ...styles.shadow,
        },
      }}>
  <Tab.Screen
  name="Home"
  options={{
    headerShown: false,
    tabBarIcon: ({ focused }) => (
      <View
      style={{alignItems: 'center', justifyContent: 'center', top: 0}}>
        <Image
          source={require('../assets/home.png')}
          resizeMode="contain"
          style={{
            width: 25,
            height: 25,
            tintColor: focused ? '#2DBABC' : '#444444',
          }}
        />
    
      </View>
    ),
  }}
  component={HomeScreen}
/>

      <Tab.Screen
        name="Post"
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 0}}>
              <Image
                source={require('../assets/post.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#2DBABC' : '#444444',
                }}
              />
            </View>
          ),
        }}
        component={PostScreen}
      />
      <Tab.Screen
        name="Chat"
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 0}}>
              <Image
                source={require('../assets/chat.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#2DBABC' : '#444444',
                }}
              />
            </View>
          ),
        }}
        component={ChatScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 0}}>
              <Image
                source={require('../assets/user.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#2DBABC' : '#444444',
                }}
              />
            </View>
          ),
        }}
        component={ProfileScreen}
      />
    </Tab.Navigator>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({



    container: {
    flex: 1,
  },
  shadow: {
    shadowColor: '#2DBABC',
    shadowOffset: {
      width: 0,
      height: 10,
      top: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;
