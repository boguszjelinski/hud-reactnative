/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Geolocation, {
  GeoError,
  GeoPosition,
} from "@react-native-community/geolocation";
import React, { useEffect, useState } from "react";
import { 
  StatusBar, 
  StyleSheet, 
  View, 
  Text,
  PermissionsAndroid,
  Platform,
 } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
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

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
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
    textAlignVertical: 'top',
    alignItems: "center",
  },
  mirroredText: {
    fontSize: 330,
    color: "white",
    fontWeight: "bold",
    transform: [{ scaleY: -1 }],
  },
});

export default App;
