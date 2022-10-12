import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { BellIcon, ChartIcon, InboxIcon, NewsIcon, UserIcon } from '../icons'
import { Alerts, Inbox, News, Profile, Stats } from '../screens'
import TabIcon from '../ui/atoms/tabIcon'
import BottomTab from '../ui/organisms/bottomTab'
import { AppTabParam } from './stack.interface'

const Tab = createBottomTabNavigator<AppTabParam>()

function AppTab() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Inbox"
        tabBar={(props) => <BottomTab {...props} />}
      >
        {/* <Tab.Screen
          name="Stats"
          component={Stats}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={ChartIcon} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="News"
          component={News}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={NewsIcon} focused={focused} />,
          }}
        /> */}
        <Tab.Screen
          name="Inbox"
          component={Inbox}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={InboxIcon} focused={focused} />,
          }}
        />
        {/* <Tab.Screen
          name="Alerts"
          component={Alerts}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={BellIcon} focused={focused} />,
          }}
        /> */}
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon Icon={UserIcon} focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </>
  )
}

export default AppTab
