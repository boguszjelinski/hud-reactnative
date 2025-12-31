/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid, 
  Platform, 
  StatusBar, 
  StyleSheet, useColorScheme, View, 
  Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Geolocation, {
  GeoError,
  GeoPosition,
} from "@react-native-community/geolocation";

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle='dark-content' />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [speedKmh, setSpeedKmh] = useState<number>(0);

  useEffect(() => {
    let watchId: number | null = null;

    const requestPermission = async (): Promise<void> => {
      if (Platform.OS === "android") {
        const permissions = [
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS 
        ];
        await PermissionsAndroid.requestMultiple(permissions);
      }

      watchId = Geolocation.watchPosition(
        (position: GeoPosition) => {
          // speed is meters per second (may be null)
          const speedMps: number = position.coords.speed ?? 0;
          setSpeedKmh(speedMps * 3.6);
        },
        (error: GeoError) => {
          console.warn("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 500,
        }
      );
    };

    requestPermission();
    StatusBar.setHidden(true, 'slide'); // setHidden(hidden, animation)
    return () => {
      StatusBar.setHidden(false, 'slide'); 
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
       <Text style={styles.mirroredText}>
        {speedKmh.toFixed(0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
   mirroredText: {
    fontSize: 500,
    color: "white",
    fontWeight: "bold",
    transform: [{ scaleY: -1 }],
  },
});

export default App;
