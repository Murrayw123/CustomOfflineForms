import { Database } from 'services/Db';
import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { Credentials } from 'realm';
import { Subject } from 'rxjs';
import { NavigationService } from 'services/NavigationService';
import { ConfigurationService, IConfiguration } from 'services/ConfigurationService';
import { MapService } from 'services/MapService';
import { MundaBiddiConfiguration } from 'configurations/MundaBiddi';
import { FormSaverService } from 'services/FormSaverService';
import { FormController, FormControllerCollection } from 'controllers/FormController';

export interface Services {
    db: Database;
    realmFactory: RealmFactory;
    realmCollection: RealmCollection;
    navigationService: NavigationService;
    configurationService: ConfigurationService;
    mapService: MapService;
    errorObserver: Subject<string>;
    formSaverService: FormSaverService;
    formControllerCollection: FormControllerCollection;
}

const defaultRoutes = [{ key: 'forms', title: 'Forms', icon: 'clipboard' }];

export function factory(configuration: IConfiguration = MundaBiddiConfiguration): Services {
    const db = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
    const configurationService = new ConfigurationService(configuration);
    const realmFactory = new RealmFactory(db, configurationService);
    const navigationService = new NavigationService(defaultRoutes);
    const realmCollection = new RealmCollection(realmFactory, configurationService);
    const errorObserver = new Subject<string>();
    const mapService = new MapService(realmCollection);
    const formControllerCollection = new FormControllerCollection();
    const formSaverService = new FormSaverService(formControllerCollection);

    return {
        db,
        realmFactory,
        realmCollection,
        navigationService,
        configurationService,
        errorObserver,
        mapService,
        formControllerCollection,
        formSaverService
    };
}

export class AppBootstrapper {
    private _services: Services;

    constructor(factory: () => Services) {
        this._services = factory();
    }

    public async bootstrap(): Promise<void> {
        const {
            db,
            realmCollection,
            formControllerCollection,
            configurationService,
            navigationService
        } = this._services;

        const { schemas, additionalRoutes, formTypes } = configurationService.configuration;

        additionalRoutes.forEach(route => navigationService.addRoute(route));

        formTypes.forEach(realmFormSchema => {
            const formController = new FormController(
                realmFormSchema,
                realmCollection,
                configurationService
            );
            formControllerCollection.addFormController(formController);
        });

        await db.login();
        await realmCollection.addRealm(schemas);
    }

    public async cleanUp(): Promise<void> {
        this._services.realmCollection.closeAllRealms();
        return this._services.db.logout();
    }

    public get services(): Services {
        return this._services;
    }
}
