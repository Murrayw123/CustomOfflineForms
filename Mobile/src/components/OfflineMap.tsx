import MapboxGL from '@react-native-mapbox-gl/maps';

const hasOfflineMap = async () => {
    return MapboxGL.offlineManager.getPack('offlineMap');
};

export const offlineMapDownloader = async (bounds: [[number, number], [number, number]]) => {
    const progressListener = (offlineRegion: any, status: any) =>
        console.log(offlineRegion, status);
    const errorListener = (offlineRegion: any, err: any) => console.log(offlineRegion, err);

    const offlineMap = await hasOfflineMap();

    if (!offlineMap) {
        MapboxGL.offlineManager.createPack(
            {
                name: 'offlineMap',
                bounds: bounds,
                minZoom: 10,
                maxZoom: 21,
                styleURL: 'mapbox://styles/murrayw123/ckkdfkpan08m317ogw6ebdoli'
            },
            progressListener,
            errorListener
        );
    }
};
