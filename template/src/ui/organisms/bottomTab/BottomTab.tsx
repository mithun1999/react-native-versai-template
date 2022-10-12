import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { hp } from '@/utils/responsive.util'
import { Pressable, Text, View } from 'native-base'
import React from 'react'
import { ImageBackground } from 'react-native'
import { bottomTabStyles as styles } from './bottomTab.style'

function BottomTab(props: BottomTabBarProps) {
  const { state, descriptors, navigation } = props

  return (
    <View style={styles.container}>
      {state.routes.map((route, idx) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const Icon = options.tabBarIcon as React.ElementType
        const isFocused = state.index === idx

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <View key={route.key} style={styles.tabButtonContainer}>
            <Pressable
              style={[styles.tabButton, isFocused && styles.tabButtonFocused]}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {isFocused ? (
                <ImageBackground source={require('../../../assets/images/png/shadow.png')} resizeMode="center">
                  <Icon />
                </ImageBackground>
              ) : (
                <Icon />
              )}
              <Text mt={2} fontSize={hp(10)} color="#EBCBFF">
                {label}
              </Text>
            </Pressable>
          </View>
        )
      })}
    </View>
  )
}

export default BottomTab
