import { FormControllerCollection, FormValues } from 'controllers/FormController';

export class FormSaverService {
    private _formControllerCollection: FormControllerCollection;

    constructor(formControllerCollection: FormControllerCollection) {
        this._formControllerCollection = formControllerCollection;
    }

    public saveForm(values: FormValues, schema: string) {
        const formController = this._formControllerCollection.getFormControllerByName(schema);
        formController.createNewFormSubmission(values);
    }
}
