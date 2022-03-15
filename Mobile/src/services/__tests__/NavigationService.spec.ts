import { NavigationService } from 'services/NavigationService';

describe('Navigation Service', () => {
    let subject: NavigationService;

    beforeEach(() => {
        subject = new NavigationService([
            { key: 'forms', title: 'Forms', icon: 'form' },
            { key: 'map', title: 'Map', icon: 'map' }
        ]);
        subject.currentIndex = 0;
    });

    it('should set and get the current page', () => {
        subject.currentIndex = 1;
        expect(subject.currentIndex).toBe(1);
    });

    it('should notify subscribers when the current page changes', () => {
        const spy = jest.fn();
        subject.subscribeToComponentChange(spy);
        subject.currentIndex = 1;
        expect(spy).toHaveBeenCalledWith(1);
    });

    it('should notify on routes change', () => {
        const newRoute = { key: 'settings', title: 'Settings', icon: 'settings' };
        const spy = jest.fn();
        subject.subscribeToAvailableRoutesChange(spy);

        subject.addRoute(newRoute);
        expect(spy).toHaveBeenCalledWith([
            { key: 'forms', title: 'Forms', icon: 'form' },
            { key: 'map', title: 'Map', icon: 'map' },
            { key: 'settings', title: 'Settings', icon: 'settings' }
        ]);
    });
});
