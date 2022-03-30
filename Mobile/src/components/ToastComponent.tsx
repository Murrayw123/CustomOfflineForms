import * as React from 'react';
import { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { ServicesContext } from 'services/Context';
import { Toast, ToastType } from 'services/ToastService';

export const ToastComponent = () => {
    const { toastService: toastService } = useContext(ServicesContext);

    const [visible, setVisible] = React.useState(false);
    const [toast, setToast] = React.useState({ message: '', type: ToastType.Success });

    const hideSnackBar = () => setVisible(false);

    useEffect(() => {
        toastService.subscribe({
            next: (toast: Toast) => {
                setToast({ message: toast.message, type: toast.type });
                setVisible(true);
            }
        });
    }, [toastService]);

    const toastStyle = toast.type === ToastType.Success ? styles.success : styles.error;

    return (
        <View>
            <Snackbar visible={visible} onDismiss={hideSnackBar} duration={2500} style={toastStyle}>
                <Text style={{ fontSize: 16 }}>
                    {ToastType[toast.type]} : {toast.message}
                </Text>
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    success: {
        backgroundColor: '#0e9600'
    },
    error: {
        backgroundColor: '#d15252',
    }
});
