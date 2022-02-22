import { LocationObject } from 'expo-location/build/Location.types';
import { Subject } from 'rxjs';

export interface ILocationController {
    requestPermissionsAsync: () => Promise<{ status: string }>;
    getCurrentPositionAsync: () => Promise<LocationObject>;
}
const emptyCoordinates: LocationObject = {
    coords: {
        accuracy: 0,
        altitude: 0,
        heading: 0,
        latitude: 0,
        longitude: 0,
        speed: 0,
        altitudeAccuracy: 0
    },
    timestamp: Date.now()
};

export class UserLocation {
    private _locationController: ILocationController;
    private _errorObservable: Subject<string>;
    constructor(locationController: ILocationController, errorObservable: Subject<string>) {
        this._locationController = locationController;
        this._errorObservable = errorObservable;
    }

    private async _requestPermission(): Promise<boolean> {
        const { status } = await this._locationController.requestPermissionsAsync();
        return status === 'granted';
    }

    // gracefully handle a users decision to not allow location permissions
    public async getLocationForComponent(): Promise<LocationObject> {
        const permissionGranted = await this._requestPermission();
        if (permissionGranted) {
            return this._locationController.getCurrentPositionAsync();
        } else {
            this._errorObservable.next('Location permission denied');
            return Promise.resolve(emptyCoordinates);
        }
    }
}
