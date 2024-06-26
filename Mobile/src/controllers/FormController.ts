import { BSON } from 'realm';
import { ConfigurationService, FormType } from 'services/ConfigurationService';
import { RealmCollection, RealmRow } from 'services/RealmCollection';

export interface FormValues {
    [key: string]: string | number | Date | BSON.ObjectId | boolean;
}

interface ConvertedFormValues {
    _id: BSON.ObjectId;
    [key: string]: string | number | Date | BSON.ObjectId | boolean;
}

const RESERVED_FIELDS = ['_id', 'org'];

export class FormController {
    private _formType: FormType;
    private _realmCollection: RealmCollection;
    private _configurationService: ConfigurationService;

    constructor(
        formType: FormType,
        realmCollection: RealmCollection,
        configurationService: ConfigurationService
    ) {
        this._formType = formType;
        this._realmCollection = realmCollection;
        this._configurationService = configurationService;
    }

    get formTypeName(): string {
        return this._formType.name;
    }

    public createNewFormSubmission(formValues: FormValues): void {
        const realm = this._realmCollection.getRealm();
        realm.write(() => {
            realm.create(this._formType.name, this._parseFormValues(formValues));
        });
    }

    updateFormSubmission(form: RealmRow): void {
        const realm = this._realmCollection.getRealm();
        const formToUpdate = realm.objectForPrimaryKey(this._formType.name, form._id) as RealmRow;
        realm.write(() => {
            Object.keys(form).forEach(key => {
                if (!RESERVED_FIELDS.includes(key)) {
                    formToUpdate[key] = form[key];
                }
            });
        });
    }

    private _parseFormValues(formValues: FormValues): ConvertedFormValues {
        const partitionValue = this._configurationService.configuration.partitionValue;

        const realmObject: ConvertedFormValues = {
            _id: new BSON.ObjectId(),
            org: partitionValue,
            lastUpdated: new Date()
        };

        Object.keys(formValues)
            .filter(key => !RESERVED_FIELDS.includes(key))
            .forEach((key: string) => {
                if (this._formType.modelSchema.properties[key] === 'double') {
                    realmObject[key] = parseFloat(<string>formValues[key]);
                } else {
                    realmObject[key] = formValues[key];
                }
            });

        return realmObject;
    }
}

export class FormControllerCollection {
    private _formControllers: FormController[];
    private _formTypeCollection: FormTypeCollection;

    constructor(formTypeCollection: FormTypeCollection) {
        this._formControllers = [];
        this._formTypeCollection = formTypeCollection;
    }

    public addFormController(formController: FormController): void {
        this._formControllers.push(formController);
    }

    public getFormControllerFromFormTypeName(formTypeName: string) {
        const res = this._formControllers.find(
            formController => formController.formTypeName === formTypeName
        );
        if (!res) {
            throw new Error(`formController with name ${formTypeName} not found`);
        } else {
            return res;
        }
    }
}

export class FormTypeCollection {
    private _formTypeCollection: FormType[];

    constructor() {
        this._formTypeCollection = [];
    }

    public addFormType(formType: FormType): void {
        this._formTypeCollection.push(formType);
    }

    public getFormTypeByName(name: string): FormType {
        const res = this._formTypeCollection.find(formType => formType.name === name);
        if (!res) {
            throw new Error(`FormType with name ${name} not found`);
        } else {
            return res;
        }
    }
}
