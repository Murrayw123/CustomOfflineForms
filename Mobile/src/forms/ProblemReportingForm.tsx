import React from 'react';
import { Formik } from 'formik';
import { MundaBiddiProblemValidationSchema } from 'models/MundaBiddiProblem';
import { Button, Text, TextInput } from 'react-native-paper';
import { LocationWithButton } from 'components/Location';
import { SelectableMenuItem } from 'components/ItemWithPopup';
import { View } from 'react-native';
import { CameraComponent } from 'components/CameraWithImage';

const MundabiddiProblems = [
    { display: 'Trail Obstructed', value: 'trail_obstruction' },
    { display: 'Trail eroded', value: 'trail_eroded' },
    { display: 'Structural Damage', value: 'structural_damage' },
    { display: 'Motorised Vehicle on Trail', value: 'vehicle_on_trail' },
    { display: 'Missing Markers', value: 'missing_markers' },
    { display: 'Other', value: 'other' }
];

export const MundabiddiProblemReport = () => {
    const formik = {
        validationSchema: MundaBiddiProblemValidationSchema,
        initialValues: {
            org: 'Mundabiddi Trail Foundation',
            description: '',
            latitude: '0',
            longitude: '0',
            type: '',
            image: ''
        },
        onSubmit: (values: any) => {
            console.log(values);
        }
    };

    return (
        <Formik
            onSubmit={formik.onSubmit}
            initialValues={formik.initialValues}
            validationSchema={formik.validationSchema}
        >
            {({ handleChange, values }) => (
                <View>
                    <TextInput label="Organisation" value={values.org} disabled={true} />
                    <SelectableMenuItem
                        value={values.type}
                        onMenuItemSelected={handleChange('type')}
                        menuOptions={MundabiddiProblems}
                    />
                    <TextInput
                        label="Problem Description"
                        value={values.description}
                        onChangeText={handleChange('description')}
                    />
                    <LocationWithButton
                        onLatitudeChange={handleChange('latitude')}
                        onLongitudeChange={handleChange('longitude')}
                        latitude={values.latitude}
                        longitude={values.longitude}
                    />
                    <CameraComponent />
                    <Button icon="camera" onPress={() => console.log('Pressed')}>
                        <Text> Press me </Text>
                    </Button>
                </View>
            )}
        </Formik>
    );
};
