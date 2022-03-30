import { ToastService, ToastType } from 'services/ToastService';

describe('Toast Service', () => {
    let subject: ToastService;

    beforeEach(() => {
        subject = new ToastService();
    });

    it('should allow the user to publish an error toast', () => {
        const subscriber = jest.fn();
        subject.subscribe(subscriber as any);
        subject.publishErrorToast('some error');
        expect(subscriber).toHaveBeenCalledWith({ type: ToastType.Error, message: 'some error' });
    });

    it('should allow the user to publish a success toast', () => {
        const subscriber = jest.fn();
        subject.subscribe(subscriber as any);
        subject.publishSuccessToast('some success message');
        expect(subscriber).toHaveBeenCalledWith({
            type: ToastType.Success,
            message: 'some success message'
        });
    });
});
