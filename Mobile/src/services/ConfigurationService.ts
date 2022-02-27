import { MundaBiddiConfiguration } from 'configurations/MundaBiddi';

export interface IConfiguration {
    sceneMap: { [key: string]: () => JSX.Element };
    additionalRoutes: { key: string; title: string; icon: string }[];
    partitionValue: string;
    schemas: Realm.ObjectSchema[];
}

export class ConfigurationService {
    private _configuration: IConfiguration;

    constructor() {
        this._configuration = MundaBiddiConfiguration();
    }

    public get configuration(): IConfiguration {
        return this._configuration;
    }
}
