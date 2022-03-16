import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import { useContext } from 'react';
import { ServicesContext } from 'services/Context';

const MyComponent = () => {
    const { errorObserver } = useContext(ServicesContext);

    const [visible, setVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    errorObserver.subscribe({
        next: (error: string) => {
            setErrorMessage(error);
            setVisible(true);
        }
    });

    return (
        <Provider>
            <View>
                <Button onPress={showDialog}>Show Dialog</Button>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{errorMessage}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
};

export default MyComponent;
