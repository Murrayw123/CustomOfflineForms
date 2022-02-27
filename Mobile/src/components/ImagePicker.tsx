import React, { useState } from 'react';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Text } from 'react-native-paper';

export default function ImagePickerExample() {
    const [image, setImage] = useState('');

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <>
            <Button onPress={pickImage}>Pick an image from camera roll</Button>
            <Text>
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}{' '}
            </Text>
        </>
    );
}
