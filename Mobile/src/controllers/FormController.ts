import { BSON, ObjectSchema } from 'realm';
import { RealmCollection } from 'services/RealmCollection';
import { ConfigurationService } from 'services/ConfigurationService';

export interface FormValues {
    [key: string]: string;
}

interface ConvertedFormValues {
    _id: BSON.ObjectId;
    [key: string]: string | number | BSON.ObjectId;
}

const RESERVED_FIELDS = ['_id', 'org'];

export class FormController {
    private _schema: ObjectSchema;
    private _realmCollection: RealmCollection;
    private _configurationService: ConfigurationService;

    constructor(
        realmSchema: ObjectSchema,
        realmCollection: RealmCollection,
        configurationService: ConfigurationService
    ) {
        this._schema = realmSchema;
        this._realmCollection = realmCollection;
        this._configurationService = configurationService;
    }

    public createNewFormSubmission(formValues: FormValues): void {
        const realm = this._realmCollection.getRealm();
        realm.write(() => {
            realm.create(this._schema.name, this._parseFormValues(formValues));
        });
    }

    private _parseFormValues(formValues: FormValues): ConvertedFormValues {
        const partitionValue = this._configurationService.configuration.partitionValue;

        const realmObject: ConvertedFormValues = {
            _id: new BSON.ObjectId(),
            org: partitionValue
        };

        Object.keys(formValues)
            .filter(key => !RESERVED_FIELDS.includes(key))
            .forEach((key: string) => {
                if (this._schema.properties[key] === 'double') {
                    realmObject[key] = parseFloat(formValues[key]);
                } else {
                    realmObject[key] = formValues[key];
                }
            });
        return realmObject;
    }

    public get name(): string {
        return this._schema.name;
    }
}

export class FormControllerCollection {
    private _formControllers: FormController[];

    constructor() {
        this._formControllers = [];
    }

    public addFormController(formController: FormController): void {
        this._formControllers.push(formController);
    }

    public getFormControllerByName(name: string) {
        const res = this._formControllers.find(formController => formController.name === name);
        if (!res) {
            throw new Error(`FormController with name ${name} not found`);
        } else {
            return res;
        }
    }
}
