import React from 'react';
import { Button } from 'react-native-paper';

interface Props {
    onSave: () => void;
}

export const SaveButton = ({ onSave }: Props) => {
    return (
        <Button icon="check" mode="contained" onPress={onSave}>
            Submit Form
        </Button>
    );
};
