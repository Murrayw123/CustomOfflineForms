import { RealmAsJS, RealmCollection } from 'services/RealmCollection';
import { FormTypeCollection } from 'controllers/FormController';
import { ConfigurationService, FormType } from 'services/ConfigurationService';
import { FormSubmissionMarker } from 'markers/FormSubmissionMarker';

export interface MapMarker {
    _id: number;
    latitude: number;
    longitude: number;
    [key: string]: any;
}

export interface DisplayableMapMarker extends MapMarker {
    title: string;
    description: string;
}

const mapMarkerFactory = (
    realmValues: MapMarker[],
    mapMarkerConfig: { schema: Realm.ObjectSchema; marker: string; formType?: FormType }
): DisplayableMapMarker[] => {
    const markers: DisplayableMapMarker[] = [];

    if (mapMarkerConfig.marker === 'FormSubmissionMarker') {
        realmValues.forEach(value => {
            markers.push(new FormSubmissionMarker(mapMarkerConfig.formType as any, value, ''));
        });
    }

    return markers;
};

export class MarkerService {
    private _realmCollection: RealmCollection;
    private _formTypeCollection: FormTypeCollection;
    private _configurationService: ConfigurationService;

    constructor(
        realmCollection: RealmCollection,
        formTypeCollection: FormTypeCollection,
        configurationService: ConfigurationService
    ) {
        this._realmCollection = realmCollection;
        this._formTypeCollection = formTypeCollection;
        this._configurationService = configurationService;
    }

    public subscribeToMapMarkerChanges(callback: (markers: DisplayableMapMarker[]) => void) {
        this._realmCollection.subscribeToRealmChanges(realmAsJS => {
            callback(this._getMapMarkersFromRealm(realmAsJS));
        });
    }

    private _getMapMarkersFromRealm(realmAsJS: RealmAsJS): DisplayableMapMarker[] {
        const mapMarkers: DisplayableMapMarker[][] = [];
        this._configurationService.configuration.mapMarkers.forEach(mapMarker => {
            mapMarkers.push(
                mapMarkerFactory(realmAsJS[mapMarker.schema.name] as MapMarker[], mapMarker)
            );
        });
        return mapMarkers.flat();
    }
}
