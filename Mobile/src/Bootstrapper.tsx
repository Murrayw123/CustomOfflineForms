import React, { createContext, useEffect } from 'react';
import { View } from 'react-native';
import { AppBootstrapper, factory, Services } from 'services/AppBootstrapper';
import { MundabiddiProblemReport } from 'forms/ProblemReportingForm';
import { Provider as PaperProvider } from 'react-native-paper';

export const ServicesContext = createContext({} as Services);

export const Bootstrapper = () => {
    const appBootstrapper = new AppBootstrapper(() => factory());
    const bootstrap = async () => {
        await appBootstrapper.bootstrap();
    };

    useEffect(() => {
        bootstrap();
    });

    return (
        <PaperProvider>
            <ServicesContext.Provider value={appBootstrapper.services}>
                <View>
                    <MundabiddiProblemReport />
                </View>
            </ServicesContext.Provider>
        </PaperProvider>
    );
};
