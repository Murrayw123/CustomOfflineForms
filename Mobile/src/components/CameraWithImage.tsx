import { Camera } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export function Cae() {
    const cameraRef = useRef();
    const [hasPermission, setHasPermission] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);

    useEffect(() => {
        onHandlePermission();
    }, []);

    const onHandlePermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    if (hasPermission === null) {
        return <> </>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <>
            style={styles.container}
            <Camera ref={cameraRef} style={styles.container} onCameraReady={onCameraReady} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    bottomButtonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 28,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
