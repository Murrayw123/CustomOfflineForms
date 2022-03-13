import { Database } from 'services/Db';
import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { Credentials } from 'realm';
import { Subject } from 'rxjs';
import { NavigationService } from 'services/NavigationService';
import { ConfigurationService } from 'services/ConfigurationService';
import { MapService } from 'services/MapService';

export interface Services {
    db: Database;
    realmFactory: RealmFactory;
    realmCollection: RealmCollection;
    navigationService: NavigationService;
    configurationService: ConfigurationService;
    mapService: MapService;
    errorObserver: Subject<string>;
}

const defaultRoutes = [{ key: 'forms', title: 'Forms', icon: 'clipboard' }];

export function factory(): Services {
    const db = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
    const realmFactory = new RealmFactory(db);
    const navigationService = new NavigationService(defaultRoutes);
    const configurationService = new ConfigurationService();
    const realmCollection = new RealmCollection(realmFactory, configurationService);
    const errorObserver = new Subject<string>();
    const mapService = new MapService(realmCollection);

    return {
        db,
        realmFactory,
        realmCollection,
        navigationService,
        configurationService,
        errorObserver,
        mapService
    };
}

export class AppBootstrapper {
    private _services: Services;

    constructor(factory: () => Services) {
        this._services = factory();
    }

    public async bootstrap(): Promise<void> {
        const { db, realmCollection } = this._services;
        const { schemas, additionalRoutes } = this._services.configurationService.configuration;

        additionalRoutes.forEach(route => this._services.navigationService.addRoute(route));

        await db.login();
        await realmCollection.addRealm(schemas);
    }

    public cleanUp(): void {
        this._services.realmCollection.closeAllRealms();
    }

    public get services(): Services {
        return this._services;
    }
}
