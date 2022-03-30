import MapboxGL from '@react-native-mapbox-gl/maps';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { DisplayableMapMarker } from 'services/MarkerService';

export const generateMarkers = (
    displayableMapMarkers: DisplayableMapMarker[],
    setMarkerShown: (marker: DisplayableMapMarker) => void
) => {
    return displayableMapMarkers.map(marker => {
        const id = marker._id.toString();
        return (
            <View key={id + 'view'}>
                <MapboxGL.MarkerView
                    key={id + 'point'}
                    id={id}
                    coordinate={[marker.longitude, marker.latitude]}
                >
                    <View
                        style={styles.container}
                        onTouchStart={() => {
                            setMarkerShown(marker);
                        }}
                    >
                        <Avatar.Icon
                            key={id + 'icon'}
                            style={styles.icon}
                            color={'#e2e809'}
                            icon={marker.icon}
                            size={50}
                        />
                    </View>
                </MapboxGL.MarkerView>
            </View>
        );
    });
};

export const styles = StyleSheet.create({
    container: {
        width: 0,
        height: 0,
        padding: 0,
        margin: 0
    },
    icon: {
        backgroundColor: 'black',
        width: 32,
        height: 32,
        padding: 0,
        margin: 0
    }
});
