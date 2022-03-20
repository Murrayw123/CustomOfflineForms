import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

interface Props {
    onSave: () => void;
}

export const SaveButton = ({ onSave }: Props) => {
    return (
        <View style={{}}>
            <Button
                icon="check"
                mode="contained"
                onPress={onSave}
                style={{
                    width: 150,
                    alignSelf: 'flex-end',
                    marginTop: 10,
                    marginRight: 10
                }}
            >
                Submit
            </Button>
        </View>
    );
};
