import { Button, Modal, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Linking, NativeModules, Platform } from 'react-native'
import { checkVersion } from 'react-native-check-version'
import { hp } from '../../utils/responsive.util'
import Config from 'react-native-config'

function VersionPop() {
  const [isUpdateAvailable, setUpdateAvailable] = useState('')
  const bundleId = NativeModules.RNDeviceInfo ? NativeModules.RNDeviceInfo.bundleId : null

  async function versionCheck() {
    const version = await checkVersion()
    if (version && version.needsUpdate && (version.updateType === 'major' || version.updateType === 'minor')) {
      setUpdateAvailable(version.updateType)
    }
  }

  async function openAppStore() {
    if (Platform.OS === 'ios') {
      await Linking.openURL(
        `itms-apps://apps.apple.com/${Config.STORE_LOCALE}/app/${Config.APPLE_STORE_APP_NAME}/id${Config.APPLE_STORE_APP_ID}`,
      )
    } else if (Platform.OS === 'android') {
      await Linking.openURL(`market://details?id=${bundleId}`)
    }
  }

  useEffect(() => {
    versionCheck()
  }, [])

  return (
    <Modal isOpen={Boolean(isUpdateAvailable)} onClose={() => setUpdateAvailable('')}>
      <Modal.Content bg="#40329a">
        <Modal.Body>
          <Text fontSize={hp(16)}>New version of the app is available. Do you want to update it?</Text>
        </Modal.Body>
        <Modal.Footer bg="#40329a" borderColor="#40329a">
          {isUpdateAvailable === 'major' ? (
            <Button.Group space={2}>
              <Button bg="#5162FF" borderRadius="lg" onPress={openAppStore}>
                Update
              </Button>
            </Button.Group>
          ) : (
            <Button.Group space={2}>
              <Button
                bg="#5141a9"
                onPress={() => {
                  setUpdateAvailable('')
                }}
              >
                Cancel
              </Button>
              <Button
                bg="#5162FF"
                borderRadius="lg"
                onPress={() => {
                  setUpdateAvailable('')
                }}
              >
                Update
              </Button>
            </Button.Group>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default VersionPop
