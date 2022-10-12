import React, { MutableRefObject, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList as FlatListType,
  FlatListProps,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native'
import { FlatList } from '@stream-io/flat-list-mvcp'
import { FlatList as RNFlatList } from 'react-native'

const styles = StyleSheet.create({
  indicatorContainer: {
    paddingVertical: 5,
    width: '100%',
  },
})

export type Props<T> = Omit<FlatListProps<T>, 'maintainVisibleContentPosition'> & {
  onEndReached: () => Promise<void>
  onStartReached: () => Promise<void>
  activityIndicatorColor?: string
  enableAutoscrollToTop?: boolean
  autoscrollToTopThreshold?: number
  onStartReachedThreshold?: number
  onEndReachedThreshold?: number
  showDefaultLoadingIndicators?: boolean
  HeaderLoadingIndicator?: React.ComponentType
  FooterLoadingIndicator?: React.ComponentType
  ListHeaderComponent?: React.ComponentType
  ListFooterComponent?: React.ComponentType
  ref?: React.RefObject<RNFlatList<any>>
}

export const BidirectionalFlatList = React.forwardRef(
  <T extends any>(
    props: Props<T>,
    ref: ((instance: FlatListType<T> | null) => void) | MutableRefObject<FlatListType<T> | null> | null,
  ) => {
    const {
      activityIndicatorColor = 'black',
      autoscrollToTopThreshold = 100,
      data,
      enableAutoscrollToTop,
      FooterLoadingIndicator,
      HeaderLoadingIndicator,
      ListHeaderComponent,
      ListFooterComponent,
      onEndReached = () => Promise.resolve(),
      onEndReachedThreshold = 10,
      onScroll,
      onStartReached = () => Promise.resolve(),
      onStartReachedThreshold = 10,
      showDefaultLoadingIndicators = true,
    } = props
    const [onStartReachedInProgress, setOnStartReachedInProgress] = useState(false)
    const [onEndReachedInProgress, setOnEndReachedInProgress] = useState(false)

    const onStartReachedTracker = useRef<Record<number, boolean>>({})
    const onEndReachedTracker = useRef<Record<number, boolean>>({})

    const onStartReachedInPromise = useRef<Promise<void> | null>(null)
    const onEndReachedInPromise = useRef<Promise<void> | null>(null)

    const maybeCallOnStartReached = () => {
      // If onStartReached has already been called for given data length, then ignore.
      if (data?.length && onStartReachedTracker.current[data.length]) {
        return
      }

      if (data?.length) {
        onStartReachedTracker.current[data.length] = true
      }

      setOnStartReachedInProgress(true)
      const p = () => {
        return new Promise<void>((resolve) => {
          onStartReachedInPromise.current = null
          setOnStartReachedInProgress(false)
          resolve()
        })
      }

      if (onEndReachedInPromise.current) {
        onEndReachedInPromise.current.finally(() => {
          onStartReachedInPromise.current = onStartReached().then(p)
        })
      } else {
        onStartReachedInPromise.current = onStartReached().then(p)
      }
    }

    const maybeCallOnEndReached = () => {
      // If onEndReached has already been called for given data length, then ignore.
      if (data?.length && onEndReachedTracker.current[data.length]) {
        return
      }

      if (data?.length) {
        onEndReachedTracker.current[data.length] = true
      }

      setOnEndReachedInProgress(true)
      const p = () => {
        return new Promise<void>((resolve) => {
          onStartReachedInPromise.current = null
          setOnEndReachedInProgress(false)
          resolve()
        })
      }

      if (onStartReachedInPromise.current) {
        onStartReachedInPromise.current.finally(() => {
          onEndReachedInPromise.current = onEndReached().then(p)
        })
      } else {
        onEndReachedInPromise.current = onEndReached().then(p)
      }
    }

    const handleScroll: ScrollViewProps['onScroll'] = (event) => {
      // Call the parent onScroll handler, if provided.
      onScroll?.(event)

      const offset = event.nativeEvent.contentOffset.y
      const visibleLength = event.nativeEvent.layoutMeasurement.height
      const contentLength = event.nativeEvent.contentSize.height

      // Check if scroll has reached either start of end of list.
      const isScrollAtStart = offset < onStartReachedThreshold
      const isScrollAtEnd = contentLength - visibleLength - offset < onEndReachedThreshold

      if (isScrollAtStart) {
        maybeCallOnStartReached()
      }

      if (isScrollAtEnd) {
        maybeCallOnEndReached()
      }
    }

    const renderHeaderLoadingIndicator = () => {
      if (!showDefaultLoadingIndicators) {
        if (ListHeaderComponent) {
          return <ListHeaderComponent />
        } else {
          return null
        }
      }

      if (!onStartReachedInProgress) return null

      if (HeaderLoadingIndicator) {
        return <HeaderLoadingIndicator />
      }

      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size={'small'} color={activityIndicatorColor} />
        </View>
      )
    }

    const renderFooterLoadingIndicator = () => {
      if (!showDefaultLoadingIndicators) {
        if (ListFooterComponent) {
          return <ListFooterComponent />
        } else {
          return null
        }
      }

      if (!onEndReachedInProgress) return null

      if (FooterLoadingIndicator) {
        return <FooterLoadingIndicator />
      }

      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size={'small'} color={activityIndicatorColor} />
        </View>
      )
    }

    return (
      <>
        <FlatList<T>
          {...props}
          ref={ref}
          progressViewOffset={50}
          ListHeaderComponent={renderHeaderLoadingIndicator}
          ListFooterComponent={renderFooterLoadingIndicator}
          onEndReached={null}
          onScroll={handleScroll}
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: enableAutoscrollToTop ? autoscrollToTopThreshold : undefined,
            minIndexForVisible: 1,
          }}
        />
      </>
    )
  },
) as unknown as BidirectionalFlatListType

export default BidirectionalFlatList

type BidirectionalFlatListType = <T extends any>(props: Props<T>) => React.ReactElement
