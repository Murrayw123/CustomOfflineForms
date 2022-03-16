import React, { useContext } from 'react';
import { Formik } from 'formik';
import { TextInput } from 'react-native-paper';
import { LocationWithButton } from 'components/Location';
import { SelectableMenuItem } from 'components/ItemWithPopup';
import { View } from 'react-native';
import { SaveButton } from 'components/SaveButton';
import { MundaBiddiProblemSchema } from 'configurations/MundaBiddi';
import { ServicesContext } from 'services/Context';
import { FormValues } from 'controllers/FormController';

export const ProblemReport = () => {
    const { formSaverService, configurationService } = useContext(ServicesContext);
    const formType = configurationService.getFormTypeFromKey(MundaBiddiProblemSchema.name);

    const formik = {
        onSubmit: (values: FormValues) => {
            formSaverService.saveForm(values, formType.name);
        },
        initialValues: formType.initialValues,
        validationSchema: formType.validationSchema
    };

    return (
        <Formik
            onSubmit={formik.onSubmit}
            initialValues={formik.initialValues}
            validationSchema={formik.validationSchema}
        >
            {({ handleChange, values, handleSubmit }) => (
                <View>
                    <TextInput label="Organisation" value={values.org} disabled={true} />
                    <SelectableMenuItem
                        value={values.type}
                        onMenuItemSelected={handleChange('type')}
                        menuOptions={formType.formFieldOptions.type.options}
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
                    <SaveButton onSave={handleSubmit} />
                </View>
            )}
        </Formik>
    );
};
