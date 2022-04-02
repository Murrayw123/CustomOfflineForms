import MapboxGL from '@react-native-mapbox-gl/maps';

export const hasOfflineMap = async () => {
    return MapboxGL.offlineManager.getPack('offlineMap');
};

export const offlineMapDownloader = async (
    bounds: [[number, number], [number, number]],
    updateSyncStatus: (syncing: boolean) => void
) => {
    const progressListener = (offlineRegion: any, status: any) => {
        if (status.percentage === 100) {
            updateSyncStatus(false);
        } else {
            updateSyncStatus(true);
        }
    };
    const errorListener = (offlineRegion: any, err: any) => console.log(offlineRegion, err);

    const offlineMap = await hasOfflineMap();

    if (!offlineMap) {
        MapboxGL.offlineManager.createPack(
            {
                name: 'offlineMap',
                bounds: bounds,
                minZoom: 5,
                maxZoom: 12,
                styleURL: 'mapbox://styles/murrayw123/ckkdfkpan08m317ogw6ebdoli'
            },
            progressListener,
            errorListener
        );
    }
};
