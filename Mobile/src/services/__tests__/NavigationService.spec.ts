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

    it('should pop routes from the stack when the back button is pressed', () => {
        // add a route because why not
        subject.addRoute({ key: 'settings', title: 'Settings', icon: 'settings' });
        const currentIndex = subject.currentIndex;
        subject.currentIndex = 2;

        expect(subject.currentIndex).toBe(2);

        subject.goBack();
        expect(subject.currentIndex).toBe(currentIndex);
    });

    it('should pop routes from the stack when the back button is pressed case 2', () => {
        subject = new NavigationService([
            { key: 'forms', title: 'Forms', icon: 'form' },
            { key: 'map', title: 'Map', icon: 'map' }
        ]);

        subject.currentIndex = 1;
        subject.goBack();
        expect(subject.currentIndex).toBe(0);
    });

    it('should pop routes from the stack when the back button is pressed case 3', () => {
        subject = new NavigationService([
            { key: 'forms', title: 'Forms', icon: 'form' },
            { key: 'map', title: 'Map', icon: 'map' }
        ]);

        subject.currentIndex = 1;
        subject.goBack();
        const currentIndex = subject.goBack();
        expect(currentIndex).toBe(-1);
    });

    it('should pop routes from the stack when the back button is pressed case 4', () => {
        subject.addRoute({ key: 'settings', title: 'Settings', icon: 'settings' });

        subject.currentIndex = 0;
        subject.currentIndex = 1;
        subject.currentIndex = 2;
        subject.currentIndex = 0;

        subject.goBack();
        subject.goBack();
        subject.goBack();
        subject.goBack();

        expect(subject.currentIndex).toBe(0);
    });

    it('should push the same history object twice', () => {
        subject.addRoute({ key: 'settings', title: 'Settings', icon: 'settings' });
        const currentIndex = subject.currentIndex;
        subject.currentIndex = 2;
        subject.currentIndex = 2;
        subject.goBack();
        expect(subject.currentIndex).toBe(currentIndex);
    });
});
