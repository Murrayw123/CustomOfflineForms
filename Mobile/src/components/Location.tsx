import { UserLocation } from 'controllers/UserLocation';
import * as ExpoLocation from 'expo-location';
import React, { useContext } from 'react';
import { Button, TextInput, Text } from 'react-native-paper';
import { ServicesContext } from 'Bootstrapper';

interface Props {
    onLatitudeChange: (latitude: string) => void;
    onLongitudeChange: (longitude: string) => void;
    latitude: string;
    longitude: string;
}

export const LocationWithButton = (props: Props): JSX.Element => {
    const { errorObserver } = useContext(ServicesContext);

    // ExpoLocation doesn't play nice with Jest, keep the construction in the React components
    const userLocation = new UserLocation(ExpoLocation, errorObserver);

    const getLocation = async () => {
        const location = await userLocation.getLocationForComponent();
        props.onLatitudeChange(location.coords.latitude.toString());
        props.onLongitudeChange(location.coords.longitude.toString());
    };

    return (
        <>
            <TextInput
                label="Latitude"
                keyboardType="numeric"
                onChangeText={props.onLatitudeChange}
                value={String(props.latitude)}
                maxLength={10}
            />
            <TextInput
                label="Longitude"
                keyboardType="numeric"
                onChangeText={props.onLongitudeChange}
                value={String(props.latitude)}
                maxLength={10}
            />

            <Button mode="contained" onPress={getLocation}>
                <Text> Get Location </Text>
            </Button>
        </>
    );
};
