import React, { useContext } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { ServicesContext } from 'services/Context';
import * as ExpoLocation from 'expo-location';
import { MapMarker, MapService } from 'services/MapService';
import { Avatar } from 'react-native-paper';
import { UserLocation } from 'controllers/UserLocation';
+

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
        backgroundColor: 'tomato',
        position: 'absolute'
    },
    map: {
        flex: 1
    },
    gpsTouchable: {
        position: 'absolute',
        right: 10,
        top: 80,
        zIndex: 9999,
        width: 50,
        height: 50
    },
    gps: {
        position: 'absolute',
        backgroundColor: '#fff'
    }
});

export const Map = () => {
    const { mapService, errorObserver } = useContext(ServicesContext);
    const mapMarkers: MapMarker[] = [];
    const mapTrack = mapService.mapTrack;

    const [markers, setMarkers] = React.useState(mapMarkers);
    const [coords, setCoords] = React.useState([
        MapService.centerCoordinate.longitude,
        MapService.centerCoordinate.latitude
    ]);

    const userLocation = new UserLocation(ExpoLocation, errorObserver);

    React.useEffect(() => {
        mapService.subscribeToMapMarkerChanges(markers => {
            console.log(markers);
            setMarkers(markers);
        });
    }, [mapService]);

    const setCoordsOnPress = async () => {
        const location = await userLocation.getLocationForComponent();
        setCoords([location.coords.longitude, location.coords.latitude]);
    };

    const formatMapMarker = (marker: MapMarker): string => {
        const { title, description } = mapService.getDescriptionFromMapMarker(marker);
        return `${title}: \n ${description}`;
    };

    const pointAnnotations = markers.map(m => {
        const id = m._id.toString();

        return (
            <MapboxGL.PointAnnotation key={id} id={id} coordinate={[m.longitude, m.latitude]}>
                <View />
                <MapboxGL.Callout title={formatMapMarker(m)} />
            </MapboxGL.PointAnnotation>
        );
    });

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.gpsTouchable} onPress={setCoordsOnPress}>
                    <Avatar.Icon icon={'crosshairs-gps'} style={styles.gps} size={40} />
                </TouchableOpacity>
                <MapboxGL.MapView style={styles.map} styleURL={StyleURL}>
                    <MapboxGL.Camera
                        zoomLevel={12}
                        animationMode={'flyTo'}
                        animationDuration={1100}
                        centerCoordinate={coords}
                    />
                    {mapTrack && (
                        <MapboxGL.ShapeSource id="line1" shape={mapTrack}>
                            <MapboxGL.LineLayer
                                id="linelayer1"
                                style={{ lineColor: 'red', lineWidth: 2 }}
                            />
                        </MapboxGL.ShapeSource>
                    )}
                    {pointAnnotations}
                </MapboxGL.MapView>
            </View>
        </View>
    );
};
