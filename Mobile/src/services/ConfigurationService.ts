import * as Yup from 'yup';

interface FormType {
    name: string;
    modelSchema: Realm.ObjectSchema;
    validationSchema: Yup.ObjectSchema;
    initialValues: { [key: string]: string };
    formFieldOptions: { [key: string]: { options: Array<{ display: string; value: string }> } };
}

export interface IConfiguration {
    additionalRoutes: { key: string; title: string; icon: string }[];
    partitionValue: string;
    schemas: Realm.ObjectSchema[];
    formTypes: FormType[];
}

export class ConfigurationService {
    private _configuration: IConfiguration;

    constructor(configuration: IConfiguration) {
        this._configuration = configuration;
    }

    public get configuration(): IConfiguration {
        return this._configuration;
    }

    public getFormTypeFromKey(key: string): FormType {
        const res = this._configuration.formTypes.find(formType => formType.name === key);
        if (!res) {
            throw new Error(`Form type with key ${key} not found`);
        } else {
            return res;
        }
    }
}
