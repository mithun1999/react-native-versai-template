import { Button, Text, VStack } from 'native-base'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import MUSelect from '../../ui/atoms/select/Select'
import { FormInput, FormTextAreaInput } from '../../ui/molecules/FormInput'
import AppLayout from '../../ui/templates/appLayout'
import { hp, wp } from '../../utils/responsive.util'
import Header from './components/Header'
// import EntypoIcon from 'react-native-vector-icons/Entypo'
// import FeatherIcon from 'react-native-vector-icons/Feather'
import Snackbar from 'react-native-snackbar'
import { sendFeedback } from '../../modules/feedback/api/feedback.api'
import { Options } from './staticData'

export default function Feedback() {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      subject: '',
      message: '',
      priority: 0,
    },
  })
  const [loading, setLoading] = useState<boolean>(false)

  const submit = async ({ subject: title, message, priority }: { subject: string; message: string; priority: any }) => {
    if (title.length < 2 || title.length < 2) return
    setLoading(true)
    try {
      await sendFeedback({ priority: parseInt(priority), message, title })
      setValue('subject', '')
      setValue('message', '')
      setValue('priority', 0)
    } catch (error) {
      Snackbar.show({
        text: 'Unable to send feedback',
        backgroundColor: '#d32f2f',
      })
    }
    setLoading(false)
  }

  return (
    <AppLayout>
      <VStack justifyContent="space-between" h="full">
        <Header />
        <VStack>
          <VStack alignItems="center" w="full">
            <Text fontWeight={700} fontSize={hp(18)} lineHeight={hp(28.8)} color="white">
              We’d love to hear from you!
            </Text>
            <Text fontWeight={700} fontSize={hp(18)} lineHeight={hp(28.8)} color="white">
              Let us know below
            </Text>
          </VStack>
          <VStack space={hp(16)} mt={hp(24)} mx={wp(5)}>
            <FormInput control={control} name="subject" placeholder="Subject" h={hp(56)} />
            <FormTextAreaInput control={control} name="message" placeholder="Message" />
            <Controller
              control={control}
              name="priority"
              rules={{ required: 'Required' }}
              render={({ field: { value, onChange, ref } }) => (
                <MUSelect
                  selectedValue={String(value)}
                  onValueChange={onChange}
                  placeholder="Choose priority"
                  accessibilityLabel="Priority"
                  _selectedItem={{ bg: '#5162FF' }}
                >
                  {Options.map(({ ...props }) => (
                    <MUSelect.Option key={props.label} {...props} />
                  ))}
                </MUSelect>
              )}
            />

            {/* <Button bgColor="rgba(255, 255, 255, 0.1)" h={hp(56)} borderRadius={8} justifyContent="flex-start">
              <HStack alignItems="center" space={wp(16)}>
                <Icon as={EntypoIcon} name="image" color="white" opacity={0.6} size={'md'} />
                <Text color="white" opacity={0.6}>
                  Upload Screenshot
                </Text>
              </HStack>
            </Button>
            <HStack
              bgColor="rgba(255, 255, 255, 0.4)"
              borderRadius={8}
              h={hp(34)}
              alignItems="center"
              px={wp(8)}
              justifyContent="space-between"
            >
              <Text fontSize={hp(12)} color="white">
                screenshot_124.png
              </Text>
              <IconButton icon={<Icon as={FeatherIcon} name="x" color="white" size="sm" />} />
            </HStack> */}
          </VStack>
        </VStack>
        <Button
          h={hp(56)}
          borderRadius={8}
          bgColor="#5162FF"
          _pressed={{ opacity: '80' }}
          onPress={handleSubmit(submit)}
          isLoading={loading}
          disabled={loading}
        >
          <Text fontWeight={500} color="white" fontSize={18}>
            Send
          </Text>
        </Button>
      </VStack>
    </AppLayout>
  )
}
