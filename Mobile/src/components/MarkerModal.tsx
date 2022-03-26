import * as React from 'react';
import { Modal, Portal, Text, Title } from 'react-native-paper';
import { DisplayableMapMarker } from 'services/MarkerService';

interface MarkerModalProps {
    marker: DisplayableMapMarker;
    onDeselect: () => void;
}

export const MarkerModal = (props: MarkerModalProps) => {
    const containerStyle = {
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        marginLeft: 60,
        marginRight: 60,
        marginTop: 0,
        marginBottom: 0,
        height: 150
    };

    return (
        <Portal>
            <Modal
                visible={true}
                onDismiss={props.onDeselect}
                contentContainerStyle={containerStyle}
            >
                <Title style={{ color: 'black', textAlign: 'center', fontSize: 16 }}>
                    Marker Type: {props.marker.markerGroupType}
                </Title>

                <Text style={{ color: 'black', textAlign: 'center' }}>
                    Type: {props.marker.title}
                </Text>

                <Text style={{ color: 'black', textAlign: 'center' }}>
                    Description: {props.marker.description}
                </Text>
            </Modal>
        </Portal>
    );
};
