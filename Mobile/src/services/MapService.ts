import { RealmCollection } from 'services/RealmCollection';
import { MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema } from 'configurations/MundaBiddi';

export interface MapMarker {
    _id: number;
    latitude: number;
    longitude: number;
    [key: string]: any;
}

export class MapService {
    private _realmCollection: RealmCollection;

    constructor(realmCollection: RealmCollection) {
        this._realmCollection = realmCollection;
    }

    public get mapTrack(): GeoJSON.FeatureCollection {
        const mapTrack =
            this._realmCollection.getRealmObjectsAsJS()[MundaBiddiTrackInfoSchema.name][0].data;
        return JSON.parse(JSON.parse(mapTrack as unknown as string));
    }

    public subscribeToMapMarkerChanges(callback: (markers: MapMarker[]) => void): void {
        this._realmCollection.subscribeToRealmChanges(realmObjectsAsJS => {
            const markers = realmObjectsAsJS[MundaBiddiProblemSchema.name];
            callback(markers as MapMarker[]);
        });
    }

    public static getDescriptionFromMapMarker(marker: MapMarker) {
        return {
            description: marker.description,
            title: marker.type
        };
    }

    public static get centerCoordinate(): { longitude: number; latitude: number } {
        return {
            longitude: 116.1683,
            latitude: -31.9022
        };
    }
}
