import { Database } from 'services/Db';
import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { NavigationService } from 'services/NavigationService';
import { ConfigurationService, IConfiguration } from 'services/ConfigurationService';
import { MapService } from 'services/MapService';
import { MundaBiddiConfiguration } from 'configurations/MundaBiddi';
import {
    FormController,
    FormControllerCollection,
    FormTypeCollection
} from 'controllers/FormController';
import { MarkerService } from 'services/MarkerService';
import { ToastService } from 'services/ToastService';
import { RealmSyncStatusService } from 'services/RealmSyncStatusService';
import { OfflineMapSyncStatusService } from 'services/OfflineMapSyncStatusService';

export interface Services {
    db: Database;
    realmFactory: RealmFactory;
    realmCollection: RealmCollection;
    navigationService: NavigationService;
    configurationService: ConfigurationService;
    mapService: MapService;
    markerService: MarkerService;
    toastService: ToastService;
    formControllerCollection: FormControllerCollection;
    formTypeCollection: FormTypeCollection;
    realmSyncStatusService: RealmSyncStatusService;
    offlineMapSyncStatusService: OfflineMapSyncStatusService;
}

const defaultRoutes = [
    { key: 'forms', title: 'Trail Report', icon: 'clipboard' },
    { key: 'map', title: 'Map', icon: 'map' }
];

export function servicesFactory(configuration: IConfiguration = MundaBiddiConfiguration): Services {
    const db = new Database('dynamicforms_dev-xezyh');
    const configurationService = new ConfigurationService(configuration);
    const realmFactory = new RealmFactory(db, configurationService);
    const navigationService = new NavigationService(defaultRoutes);
    const realmCollection = new RealmCollection(realmFactory, configurationService);
    const formTypeCollection = new FormTypeCollection();
    const formControllerCollection = new FormControllerCollection(formTypeCollection);
    const toastService = new ToastService();
    const markerService = new MarkerService(
        realmCollection,
        formTypeCollection,
        configurationService
    );
    const mapService = new MapService(realmCollection, configurationService, markerService);
    const realmSyncStatusService = new RealmSyncStatusService(
        realmCollection,
        configurationService
    );
    const offlineMapSyncStatusService = new OfflineMapSyncStatusService();

    return {
        db,
        realmFactory,
        realmCollection,
        navigationService,
        configurationService,
        toastService: toastService,
        mapService,
        markerService,
        formControllerCollection,
        formTypeCollection,
        realmSyncStatusService,
        offlineMapSyncStatusService
    };
}

export class AppBootstrapper {
    private _services: Services;

    constructor(factory: () => Services) {
        this._services = factory();
    }

    public async bootstrap(realmCredentials: Realm.Credentials): Promise<void> {
        const {
            db,
            realmCollection,
            formControllerCollection,
            configurationService,
            formTypeCollection
        } = this._services;

        const { schemas, formTypes } = configurationService.configuration;
        await db.login(realmCredentials);
        await realmCollection.addRealm(schemas);

        formTypes.forEach(formType => {
            formTypeCollection.addFormType(formType);

            const formController = new FormController(
                formType,
                realmCollection,
                configurationService
            );

            formControllerCollection.addFormController(formController);
        });

        realmCollection.markRealmsAsReady();
    }

    public async cleanUp(): Promise<void> {
        this._services.realmCollection.closeAllRealms();
        this._services.realmSyncStatusService.destroy();
        return this._services.db.logout();
    }

    public get services(): Services {
        return this._services;
    }
}
