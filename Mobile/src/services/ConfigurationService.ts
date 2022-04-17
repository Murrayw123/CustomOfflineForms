import * as Yup from 'yup';

export interface FormType {
    name: string;
    modelSchema: Realm.ObjectSchema;
    validationSchema: Yup.ObjectSchema;
    initialValues: { [key: string]: string | boolean };
    formFieldOptions: { [key: string]: { options: Array<{ display: string; value: string }> } };
}

export interface IConfiguration {
    partitionValue: string;
    schemas: Realm.ObjectSchema[];
    formTypes: FormType[];
    offlineMapBoundingBox: [[number, number], [number, number]];
    mapMarkers: { schema: Realm.ObjectSchema; marker: string; formType?: FormType }[];
    centerCoordinates: { latitude: number; longitude: number };
}

export class ConfigurationService {
    private _configuration: IConfiguration;

    constructor(configuration: IConfiguration) {
        this._configuration = configuration;
    }

    public get configuration(): IConfiguration {
        return this._configuration;
    }
}
