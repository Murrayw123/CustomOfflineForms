import { LocationObject, LocationPermissionResponse } from 'expo-location/build/Location.types';
import { ILocationController, UserLocation } from 'controllers/UserLocation';
import { Subject } from 'rxjs';

describe('LocationService', () => {
    let requestLocation: jest.Mock;
    let requestPermissionsAsync: jest.Mock;
    let errorObserver: Subject<string>;

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
        errorObserver = new Subject();

        errorObserver.next = jest.fn();

        requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
        subject = new UserLocation(new MockLocation(), errorObserver);
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
        expect(errorObserver.next).toHaveBeenCalled();
    });
});
