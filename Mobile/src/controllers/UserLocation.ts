import { LocationObject } from 'expo-location/build/Location.types';
import { ToastService } from 'services/ToastService';

export interface ILocationController {
    requestForegroundPermissionsAsync: () => Promise<{ status: string }>;
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
    private _toastService: ToastService;
    constructor(locationController: ILocationController, toastService: ToastService) {
        this._locationController = locationController;
        this._toastService = toastService;
    }

    private async _requestPermission(): Promise<boolean> {
        const { status } = await this._locationController.requestForegroundPermissionsAsync();
        return status === 'granted';
    }

    // gracefully handle a users decision to not allow location permissions
    public async getLocationForComponent(): Promise<LocationObject> {
        const permissionGranted = await this._requestPermission();
        if (permissionGranted) {
            return this._locationController.getCurrentPositionAsync();
        } else {
            this._toastService.publishErrorToast(
                'Location permission denied: Please enable location permissions'
            );
            return emptyCoordinates;
        }
    }
}
