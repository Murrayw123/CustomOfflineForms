import { Subject } from 'rxjs';

export enum ToastType {
    Success,
    Error
}

export interface Toast {
    message: string;
    type: ToastType;
}

export class ToastService {
    private _observable: Subject<Toast>;

    constructor() {
        this._observable = new Subject();
    }

    public publishSuccessToast(message: string): void {
        this._observable.next({ type: ToastType.Success, message: message });
    }

    public publishErrorToast(message: string): void {
        this._observable.next({ type: ToastType.Error, message: message });
    }

    public subscribe(callback: { next: (toast: Toast) => void }): void {
        this._observable.subscribe(callback);
    }
}
