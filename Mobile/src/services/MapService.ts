import { RealmCollection } from 'services/RealmCollection';
import { MundaBiddiTrackInfoSchema } from 'configurations/MundaBiddi';
import { ConfigurationService } from 'services/ConfigurationService';
import { MarkerService } from 'services/MarkerService';

export class MapService {
    private _realmCollection: RealmCollection;
    private _configurationService: ConfigurationService;
    private _markerService: MarkerService;

    constructor(
        realmCollection: RealmCollection,
        configurationService: ConfigurationService,
        markerService: MarkerService
    ) {
        this._realmCollection = realmCollection;
        this._configurationService = configurationService;
        this._markerService = markerService;
    }

    public get mapTrack(): GeoJSON.FeatureCollection {
        const mapTrack =
            this._realmCollection.getRealmObjectsAsJS()[MundaBiddiTrackInfoSchema.name][0].data;
        return JSON.parse(JSON.parse(mapTrack as unknown as string));
    }
    public getMapCenterCoordinates(): { latitude: number; longitude: number } {
        return this._configurationService.configuration.centerCoordinates;
    }
}
