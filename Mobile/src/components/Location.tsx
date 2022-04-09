import { UserLocation } from 'controllers/UserLocation';
import * as ExpoLocation from 'expo-location';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { IconButton, TextInput, ActivityIndicator } from 'react-native-paper';
import { ServicesContext } from 'services/Context';

interface Props {
    onLatitudeChange: (latitude: string) => void;
    onLongitudeChange: (longitude: string) => void;
    latitude: string;
    longitude: string;
}

const latLongIsTruthy = (latitude: string, longitude: string) => {
    return parseFloat(latitude) !== 0 && parseFloat(longitude) !== 0;
};

export const LocationWithButton = (props: Props): JSX.Element => {
    const { toastService } = useContext(ServicesContext);
    const [isLoading, setIsLoading] = React.useState(false);

    // ExpoLocation doesn't play nice with Jest, keep the construction in the React components
    const userLocation = new UserLocation(ExpoLocation, toastService);

    const getLocation = async () => {
        setIsLoading(true);
        const location = await userLocation.getLocationForComponent();
        props.onLatitudeChange(location.coords.latitude.toString());
        props.onLongitudeChange(location.coords.longitude.toString());
        setIsLoading(false);
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                padding: 10,
                width: 400,
                paddingLeft: 0
            }}
        >
            <TextInput
                label="Latitude"
                keyboardType="numeric"
                onChangeText={props.onLatitudeChange}
                value={String(props.latitude)}
                maxLength={10}
                disabled
                style={{ width: 150 }}
            />
            <TextInput
                label="Longitude"
                keyboardType="numeric"
                onChangeText={props.onLongitudeChange}
                value={String(props.longitude)}
                maxLength={10}
                disabled
                style={{ width: 150 }}
            />
            {isLoading && (
                <ActivityIndicator
                    animating={true}
                    color={'grey'}
                    style={{ marginLeft: 25, top: 4 }}
                />
            )}
            {!isLoading && latLongIsTruthy(props.latitude, props.longitude) && (
                <IconButton
                    icon="crosshairs-gps"
                    color="grey"
                    size={28}
                    onPress={getLocation}
                    style={{ marginLeft: 15, top: 7, backgroundColor: '#fff' }}
                />
            )}
            {!isLoading && !latLongIsTruthy(props.latitude, props.longitude) && (
                <IconButton
                    icon="crosshairs"
                    color="grey"
                    size={28}
                    onPress={getLocation}
                    style={{ marginLeft: 15, top: 7, backgroundColor: '#fff' }}
                />
            )}
        </View>
    );
};
