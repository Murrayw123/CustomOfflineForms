import React, { useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { ServicesContext } from 'services/Context';
import { MapMarker } from 'services/MapService';

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

export const Map = () => {
    const { mapService } = useContext(ServicesContext);
    const mapMarkers: MapMarker[] = [];
    const mapTrack = mapService.mapTrack;

    const [markers, setMarkers] = React.useState(mapMarkers);

    React.useEffect(() => {
        mapService.subscribeToMapMarkerChanges(markers => {
            setMarkers(markers);
        });
    }, [mapService]);

    const pointAnnotations = markers.map(m => {
        const id = m._id.toString();
        return <MapboxGL.PointAnnotation key={id} id={id} coordinate={[m.longitude, m.latitude]} />;
    });

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView style={styles.map} styleURL={StyleURL}>
                    {mapTrack && (
                        <MapboxGL.ShapeSource id="line1" shape={mapTrack}>
                            <MapboxGL.LineLayer id="linelayer1" style={{ lineColor: 'red' }} />
                        </MapboxGL.ShapeSource>
                    )}
                    {pointAnnotations}
                </MapboxGL.MapView>
            </View>
        </View>
    );
};
