import React, { createContext, useEffect } from 'react';
import { AppBootstrapper, factory, Services } from 'services/AppBootstrapper';
import { Provider as PaperProvider } from 'react-native-paper';
import { HeaderComponent } from 'components/Header';
import { NavigationComponent } from 'components/BottomBar';

export const ServicesContext = createContext({} as Services);

export const Bootstrapper = () => {
    const appBootstrapper = new AppBootstrapper(() => factory());

    const bootstrap = async () => {
        await appBootstrapper.bootstrap();
    };

    useEffect(() => {
        bootstrap();
        return () => {
            appBootstrapper.cleanUp();
        };
    });

    return (
        <PaperProvider>
            <ServicesContext.Provider value={appBootstrapper.services}>
                <>
                    <HeaderComponent />
                    <NavigationComponent />
                </>
            </ServicesContext.Provider>
        </PaperProvider>
    );
};
