//@flow
import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import {
  STREAM_API_KEY,
  STREAM_API_TOKEN,
  STREAM_APP_ID,
} from 'react-native-dotenv';

import Icon from './components/Icon';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SinglePostScreen from './screens/SinglePostScreen';
import StatusUpdateScreen from './screens/StatusUpdateScreen';

import { Avatar, StreamApp, IconBadge } from 'expo-activity-feed';
import type { UserResponse } from './types';

// $FlowFixMe
const NotificationsStack = createStackNavigator({
  Notifications: { screen: NotificationsScreen },
});

const ProfileStack = createStackNavigator({
  Profile: { screen: ProfileScreen },
});

const SearchStack = createStackNavigator({
  Search: { screen: SearchScreen },
});

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Notifications: NotificationsStack,
    Profile: ProfileStack,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return <Icon name="home" />;
        } else if (routeName === 'Search') {
          return <Icon name="search" />;
        } else if (routeName === 'Notifications') {
          return (
            <IconBadge showNumber>
              <Icon name="notifications" />
            </IconBadge>
          );
        } else if (routeName === 'Profile') {
          return (
            <Avatar
              source={(userData: UserResponse) => userData.data.profileImage}
              size={25}
              noShadow
            />
          );
        }
      },
    }),
    initialRouteName: 'Home',
  },
);

const doNotShowHeaderOption = {
  navigationOptions: {
    header: null,
  },
};

const Navigation = createStackNavigator({
  Tabs: {
    screen: TabNavigator,
    ...doNotShowHeaderOption,
  },
  SinglePost: { screen: SinglePostScreen },
  NewPost: { screen: StatusUpdateScreen },
  EditProfile: { screen: EditProfileScreen },
});

const App = () => {
  let apiKey = STREAM_API_KEY;
  let appId = STREAM_APP_ID;
  let token = STREAM_API_TOKEN;

  return (
    <StreamApp
      apiKey={apiKey}
      appId={appId}
      token={token}
      defaultUserData={{
        name: 'Justice a3dprinter',
        url: 'tripheo0412@gmail.com',
        desc: 'Smart, violent and brutally tough solutions to crime.',
        profileImage:
          'https://images-na.ssl-images-amazon.com/images/I/81NadegaTkL._SX522_.jpg',
        coverImage:
          'http://colorfully.eu/wp-content/uploads/2012/10/empty-road-highway-with-fog-facebook-cover.jpg',
      }}
    >
      <Navigation />
    </StreamApp>
  );
};

export default App;
