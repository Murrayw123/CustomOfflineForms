import React, { useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { ServicesContext } from 'Bootstrapper';

MapboxGL.setAccessToken(
    'pk.eyJ1IjoibXVycmF5dzEyMyIsImEiOiJja2FhYW1ja24weGxyMnNudjZvcWh0ZnA2In0.HFw1UOLPuKINwj_-nT0dyw'
);

const StyleURL = 'mapbox://styles/murrayw123/ckkdfkpan08m317ogw6ebdoli';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'tomato'
    },
    map: {
        flex: 1
    }
});

const styles2 = StyleSheet.create({
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
    // const { mapService } = useContext(ServicesContext);
    // const mapTrack = mapService.getMapFeatures().mapTrack;
    // const parsedMapTrack = JSON.parse(mapTrack as any);
    // console.log(parsedMapTrack);

    return (
        <View style={styles2.page}>
            <View style={styles2.container}>
                <MapboxGL.MapView  />
                {/*{mapTrack && (*/}
                {/*    <MapboxGL.ShapeSource id="route" shape={parsedMapTrack}>*/}
                {/*        <MapboxGL.LineLayer*/}
                {/*            id="root"*/}
                {/*            style={{*/}
                {/*                lineColor: 'rgba(0,0,255,0)',*/}
                {/*                lineWidth: 5,*/}
                {/*                lineCap: 'round',*/}
                {/*                lineJoin: 'round'*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </MapboxGL.ShapeSource>*/}
                {/*)}*/}
            </View>
        </View>
    );
};
