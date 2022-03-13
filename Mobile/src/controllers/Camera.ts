import { CameraCapturedPicture, CameraPictureOptions } from 'expo-camera/build/Camera';
import { Subject } from 'rxjs';

export interface IExpoCamera {
    takePictureAsync: (options: CameraPictureOptions) => Promise<CameraCapturedPicture>;
    onCameraReady: (fn: () => void) => void;
}

export interface IStaticExpoCamera {
    requestCameraPermissionsAsync: () => Promise<{ status: string }>;
}

export class CameraController {
    private _cameraRef: IExpoCamera;
    private _camera: IStaticExpoCamera;
    private _errorObservable: Subject<string>;
    private _onPictureTakenObservable: Subject<string>;

    constructor(
        cameraRef: IExpoCamera,
        camera: IStaticExpoCamera,
        errorObservable: Subject<string>,
        onPictureTakenObservable: Subject<string>
    ) {
        this._cameraRef = cameraRef;
        this._camera = camera;
        this._errorObservable = errorObservable;
        this._onPictureTakenObservable = onPictureTakenObservable;
    }

    public subscribeToPictureTaken(fn: (picture: string) => void) {
        this._onPictureTakenObservable.subscribe(fn);
    }

    public async requestTakePicture(): Promise<void> {
        const permissionGranted = await this._requestPermission();
        if (permissionGranted) {
            return this._takePicture();
        } else {
            return this._errorObservable.next('Camera permission denied');
        }
    }

    private async _requestPermission(): Promise<boolean> {
        const { status } = await this._camera.requestCameraPermissionsAsync();
        return status === 'granted';
    }

    private async _takePicture(): Promise<void> {
        this._cameraRef.onCameraReady(async () => {
            const picture = await this._cameraRef.takePictureAsync({
                base64: true,
                exif: true,
                quality: 0.2,
                skipProcessing: false
            });

            if (picture.base64) {
                this._onPictureTakenObservable.next(picture.base64);
            } else {
                this._errorObservable.next('Picture not taken');
            }
        });
    }
}
