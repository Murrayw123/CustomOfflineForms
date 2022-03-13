import { RealmCollection } from 'services/RealmCollection';

export class MapService {
    private _realmCollection: RealmCollection;

    constructor(realmCollection: RealmCollection) {
        this._realmCollection = realmCollection;
    }

    public getMapFeatures(): { mapTrack: GeoJSON.FeatureCollection } {
        const realm = this._realmCollection.getRealm();
        const mapTrack = JSON.parse((realm.objects('MundaBiddiTrackInfo')[0] as any).data);
        return { mapTrack };
    }
}
