import { MundaBiddiConfiguration } from 'configurations/MundaBiddi';

export interface IConfiguration {
    additionalRoutes: { key: string; title: string; icon: string }[];
    partitionValue: string;
    schemas: Realm.ObjectSchema[];
}

export class ConfigurationService {
    private _configuration: IConfiguration;

    constructor(configuration: IConfiguration = MundaBiddiConfiguration) {
        this._configuration = configuration;
    }

    public get configuration(): IConfiguration {
        return this._configuration;
    }
}
