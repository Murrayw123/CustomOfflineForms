import { RealmCollection } from 'services/RealmCollection';
import { MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema } from 'configurations/MundaBiddi';
import { ConfigurationService } from 'services/ConfigurationService';

export interface MapMarker {
    _id: number;
    latitude: number;
    longitude: number;
    [key: string]: any;
}

export class MapService {
    private _realmCollection: RealmCollection;
    private _configurationService: ConfigurationService;

    constructor(realmCollection: RealmCollection, configurationService: ConfigurationService) {
        this._realmCollection = realmCollection;
        this._configurationService = configurationService;
    }

    public get mapTrack(): GeoJSON.FeatureCollection {
        const mapTrack =
            this._realmCollection.getRealmObjectsAsJS()[MundaBiddiTrackInfoSchema.name][0].data;
        return JSON.parse(JSON.parse(mapTrack as unknown as string));
    }

    public subscribeToMapMarkerChanges(callback: (markers: MapMarker[]) => void): void {
        this._realmCollection.subscribeToRealmChanges(realmObjectsAsJS => {
            const markers = realmObjectsAsJS[MundaBiddiProblemSchema.name];
            console.log(markers);
            callback(markers as MapMarker[]);
        });
    }

    public getDescriptionFromMapMarker(marker: MapMarker) {
        const formType = this._configurationService.getFormTypeFromKey(
            MundaBiddiProblemSchema.name
        );
        const markerType = formType.formFieldOptions.type.options.find(
            option => option.value === marker.type
        );
        if (!markerType) {
            throw new Error('No marker type found');
        } else {
            return {
                description: marker.description,
                title: markerType.display
            };
        }
    }

    public static get centerCoordinate(): { longitude: number; latitude: number } {
        return {
            longitude: 116.1683,
            latitude: -31.9022
        };
    }
}
