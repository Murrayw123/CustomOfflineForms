import React from 'react';
import { TextInput } from 'react-native-paper';
import { LocationWithButton } from 'components/Location';
import { SelectableMenuItem } from 'components/ItemWithPopup';
import { View } from 'react-native';
import { SaveButton } from 'components/SaveButton';
import { FormProps } from 'forms/FormHOC';

export const ProblemReportingForm = (props: FormProps) => {
    const { values, handleChange, formType, handleSubmit } = props;

    return (
        <View>
            <TextInput label="Organisation" value={values.org} disabled={true} />
            <SelectableMenuItem
                value={values.type}
                onMenuItemSelected={handleChange('type')}
                menuOptions={formType.formFieldOptions.type.options}
                inputLabel={'Problem Type'}
            />
            <TextInput
                label="Problem Description"
                value={values.description}
                onChangeText={handleChange('description')}
                style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 0, marginLeft: 0 }}
            />
            <LocationWithButton
                onLatitudeChange={handleChange('latitude')}
                onLongitudeChange={handleChange('longitude')}
                latitude={values.latitude}
                longitude={values.longitude}
            />
            <SaveButton onSave={handleSubmit} />
        </View>
    );
};
