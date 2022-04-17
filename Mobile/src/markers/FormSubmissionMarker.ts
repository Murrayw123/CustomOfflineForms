import { FormType } from 'services/ConfigurationService';
import { DisplayableMapMarker, MapMarker } from 'services/MarkerService';

export class FormSubmissionMarker implements DisplayableMapMarker {
    private _formType: FormType;
    private _mapMarker: MapMarker;
    private _icon: string;

    constructor(formType: FormType, mapMarker: MapMarker, icon: string) {
        this._formType = formType;
        this._mapMarker = mapMarker;
        this._icon = icon;
    }

    public get _id(): number {
        return this._mapMarker._id;
    }

    public get latitude(): number {
        return this._mapMarker.latitude;
    }

    public get longitude(): number {
        return this._mapMarker.longitude;
    }

    public get formType(): FormType {
        return this._formType;
    }

    public get icon(): string {
        return this._icon;
    }

    public get type(): string {
        return this._mapMarker.type;
    }

    public get lastUpdated(): Date {
        return this._mapMarker.lastUpdated;
    }

    public get markerGroupType(): string {
        return 'Reported Problem';
    }

    public get title(): string {
        const markerType = this._formType.formFieldOptions.type.options.find(
            option => option.value === this.type
        );
        if (!markerType) {
            throw new Error('No marker type found');
        }
        return markerType.display;
    }

    public get description(): string {
        return this._mapMarker.description;
    }

    public get resolved(): boolean {
        return this._mapMarker.resolved;
    }
}
