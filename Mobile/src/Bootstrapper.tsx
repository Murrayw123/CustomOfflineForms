import React, { useEffect } from 'react';
import { AppBootstrapper } from 'services/AppBootstrapper';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { HeaderComponent } from 'components/Header';
import { NavigationComponent } from 'components/BottomBar';
import { ServicesContext } from 'services/Context';
import { ToastComponent } from 'components/ToastComponent';

interface BootstrapperProps {
    appBootstrapper: AppBootstrapper;
}

export const Bootstrapper = (props: BootstrapperProps) => {
    const [loading, setLoading] = React.useState(true);
    const { appBootstrapper } = props;

    const bootstrap = async () => {
        await appBootstrapper.bootstrap();
        setLoading(false);
    };

    useEffect(() => {
        bootstrap();
        return () => {
            appBootstrapper.cleanUp();
        };
    }, [appBootstrapper]);

    return (
        <PaperProvider>
            {loading ? (
                <Text>Loading</Text>
            ) : (
                <ServicesContext.Provider value={appBootstrapper.services}>
                    <>
                        <HeaderComponent />
                        <NavigationComponent />
                        <ToastComponent />
                    </>
                </ServicesContext.Provider>
            )}
        </PaperProvider>
    );
};
