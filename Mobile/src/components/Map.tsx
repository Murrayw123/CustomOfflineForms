import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { ServicesContext } from 'services/Context';
import * as ExpoLocation from 'expo-location';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import { UserLocation } from 'controllers/UserLocation';
import { hasOfflineMap, offlineMapDownloader } from 'components/OfflineMap';
import { DisplayableMapMarker } from 'services/MarkerService';
import { MarkerModal } from 'components/MarkerModal';
import { generateMarkers } from 'components/Markers';
import { mapStyles, StyleURL } from 'components/MapStyles';

+MapboxGL.setAccessToken(
    'pk.eyJ1IjoibXVycmF5dzEyMyIsImEiOiJja2FhYW1ja24weGxyMnNudjZvcWh0ZnA2In0.HFw1UOLPuKINwj_-nT0dyw'
);

export const Map = () => {
    const {
        markerService,
        mapService,
        toastService,
        configurationService,
        offlineMapSyncStatusService
    } = useContext(ServicesContext);

    const { offlineMapBoundingBox, centerCoordinates } = configurationService.configuration;
    const userLocation = new UserLocation(ExpoLocation, toastService);

    const mapMarkers: DisplayableMapMarker[] = [];
    const mapTrack = mapService.mapTrack;

    const [markers, setMarkers] = React.useState(mapMarkers);
    const [syncingCoords, setSyncingCoords] = React.useState(false);
    const [downloadMapVisible, setDownloadMapVisible] = React.useState(false);
    const [markerModal, setMarkerModalShown] = React.useState<DisplayableMapMarker | null>();
    const [coords, setCoords] = React.useState([
        centerCoordinates.longitude,
        centerCoordinates.latitude
    ]);

    React.useEffect(() => {
        markerService.subscribeToMapMarkerChanges(markers => {
            setMarkers(markers);
        });
    }, [markerService]);

    React.useEffect(() => {
        hasOfflineMap().then(hasOfflineMap => {
            setDownloadMapVisible(!hasOfflineMap);
        });
    }, []);

    offlineMapSyncStatusService.subscribe((syncing: boolean) => {
        if (syncing) {
            setDownloadMapVisible(false);
        }
    });

    const downloadMap = () => {
        offlineMapDownloader(offlineMapBoundingBox, offlineMapSyncStatusService.updateSyncStatus);
    };

    const setCoordsOnPress = async () => {
        setSyncingCoords(true);
        const location = await userLocation.getLocationForComponent();
        setCoords([location.coords.longitude, location.coords.latitude]);
        setSyncingCoords(false);
    };

    return (
        <View style={mapStyles.page}>
            {markerModal && (
                <MarkerModal marker={markerModal} onDeselect={() => setMarkerModalShown(null)} />
            )}
            <View style={mapStyles.container}>
                <TouchableOpacity style={mapStyles.gpsTouchable} onPress={setCoordsOnPress}>
                    {syncingCoords ? (
                        <ActivityIndicator
                            animating={true}
                            style={mapStyles.activity}
                            size={40}
                            color={'grey'}
                        />
                    ) : (
                        <Avatar.Icon icon={'crosshairs-gps'} style={mapStyles.gps} size={40} />
                    )}
                </TouchableOpacity>
                {downloadMapVisible && (
                    <TouchableOpacity style={mapStyles.downloadMap} onPress={downloadMap}>
                        <Avatar.Icon icon={'cloud-download'} style={mapStyles.gps} size={40} />
                    </TouchableOpacity>
                )}
                <MapboxGL.MapView style={mapStyles.map} styleURL={StyleURL}>
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
                    {generateMarkers(markers, setMarkerModalShown)}
                </MapboxGL.MapView>
            </View>
        </View>
    );
};
