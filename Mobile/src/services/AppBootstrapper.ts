import { Database } from 'services/Db';
import { RealmCollection } from 'services/RealmCollection';
import { RealmFactory } from 'services/RealmFactory';
import { Credentials } from 'realm';
import { Subject } from 'rxjs';
import { NavigationService } from 'services/NavigationService';
import { ConfigurationService } from 'services/ConfigurationService';

export interface Services {
    db: Database;
    realmFactory: RealmFactory;
    realmCollection: RealmCollection;
    navigationService: NavigationService;
    configurationService: ConfigurationService;
    errorObserver: Subject<string>;
}

const defaultRoutes = [{ key: 'forms', title: 'Forms', icon: 'clipboard' }];

export function factory(): Services {
    const db = new Database('dynamicforms_dev-xezyh', Credentials.anonymous());
    const realmFactory = new RealmFactory(db);
    const realmCollection = new RealmCollection(realmFactory);
    const navigationService = new NavigationService(defaultRoutes);
    const configurationService = new ConfigurationService();
    const errorObserver = new Subject<string>();

    return {
        db,
        realmFactory,
        realmCollection,
        navigationService,
        configurationService,
        errorObserver
    };
}

export class AppBootstrapper {
    private readonly _db: Database;
    private readonly _realmCollection: RealmCollection;
    private readonly _realmFactory: RealmFactory;
    private readonly _errorObservable: Subject<string>;
    private readonly _navigationService: NavigationService;
    private readonly _configurationService: ConfigurationService;

    constructor(factory: () => Services = () => factory()) {
        const {
            db,
            realmFactory,
            realmCollection,
            errorObserver,
            navigationService,
            configurationService
        } = factory();
        this._db = db;
        this._realmFactory = realmFactory;
        this._realmCollection = realmCollection;
        this._errorObservable = errorObserver;
        this._configurationService = configurationService;
        this._navigationService = navigationService;
    }

    public async bootstrap(): Promise<void> {
        const { partitionValue, schemas, additionalRoutes } =
            this._configurationService.configuration;

        additionalRoutes.forEach(route => this._navigationService.addRoute(route));

        await this._db.login();
        await this._realmCollection.addRealm(partitionValue, schemas);
    }

    public get services(): Services {
        return {
            db: this._db,
            realmFactory: this._realmFactory,
            realmCollection: this._realmCollection,
            navigationService: this._navigationService,
            configurationService: this._configurationService,
            errorObserver: this._errorObservable
        };
    }
}
