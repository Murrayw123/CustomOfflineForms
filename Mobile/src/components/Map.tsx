import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
    'pk.eyJ1IjoibXVycmF5dzEyMyIsImEiOiJja2FhYW1ja24weGxyMnNudjZvcWh0ZnA2In0.HFw1UOLPuKINwj_-nT0dyw'
);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    container: {
        height: 300,
        width: 300,
        backgroundColor: 'tomato'
    },
    map: {
        flex: 1
    }
});

export const Map = () => {
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map} />
            </View>
        </View>
    );
};
