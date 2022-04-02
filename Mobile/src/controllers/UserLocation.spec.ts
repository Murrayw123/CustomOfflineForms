import { LocationObject, LocationPermissionResponse } from 'expo-location/build/Location.types';
import { ILocationController, UserLocation } from 'controllers/UserLocation';
import { ToastService, ToastType } from 'services/ToastService';

describe('LocationService', () => {
    let toastServiceSubscriber: jest.Mock;
    let requestLocation: jest.Mock;
    let requestPermissionsAsync: jest.Mock;
    let toastService: ToastService;

    let subject: UserLocation;

    class MockLocation implements ILocationController {
        public async requestPermissionsAsync(): Promise<LocationPermissionResponse> {
            return requestPermissionsAsync();
        }

        public async getCurrentPositionAsync(): Promise<LocationObject> {
            return requestLocation();
        }
    }

    beforeEach(() => {
        requestLocation = jest.fn();
        requestPermissionsAsync = jest.fn();
        toastService = new ToastService();
        toastServiceSubscriber = jest.fn();

        toastService.subscribe(toastServiceSubscriber as any);

        requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
        subject = new UserLocation(new MockLocation(), toastService);
    });

    it('should get the location of the user', () => {
        const location = subject.getLocationForComponent();
        expect(location).toBeDefined();
    });

    it('should gracefully handle an error when the user declines location permissions', async () => {
        requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
        const location = await subject.getLocationForComponent();
        expect(location.coords.latitude).toEqual(0);
        expect(location.coords.longitude).toEqual(0);
        expect(toastServiceSubscriber).toHaveBeenCalledWith({
            message: 'Location permission denied',
            type: ToastType.Error
        });
    });
});
