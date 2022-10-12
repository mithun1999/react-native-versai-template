import { HStack, Spinner } from 'native-base'
import React, { ReactNode } from 'react'

function LoadingWrapper({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <>
      {loading ? (
        <HStack justifyContent="center" alignItems="center" height="100%" width="100%">
          <Spinner color="white" size="lg" />
        </HStack>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default LoadingWrapper
