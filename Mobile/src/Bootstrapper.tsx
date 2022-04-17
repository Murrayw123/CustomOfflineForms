import React, { useEffect } from 'react';
import { AppBootstrapper } from 'services/AppBootstrapper';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import { HeaderComponent } from 'components/Header';
import { NavigationComponent } from 'components/BottomBar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { BackHandler } from 'react-native';

import { ServicesContext } from 'services/Context';
import { ToastComponent } from 'components/ToastComponent';

GoogleSignin.configure({
    webClientId: '994703068522-9qjspuml0tqvviaj76vbg2ru1dohdkrv.apps.googleusercontent.com'
});

interface BootstrapperProps {
    appBootstrapper: AppBootstrapper;
}

const silentlyGetRealmCredentials = async (): Promise<Realm.Credentials | null> => {
    try {
        const { idToken } = await GoogleSignin.signInSilently();
        if (idToken) {
            return Realm.Credentials.google(idToken);
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const Bootstrapper = (props: BootstrapperProps) => {
    const [signedIn, setSignedIn] = React.useState(false);
    const { appBootstrapper } = props;

    const signInToGoogle = async (): Promise<string | null> => {
        try {
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();
            if (idToken) {
                return idToken;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    const bootstrap = async () => {
        const realmCredentials = await silentlyGetRealmCredentials();
        if (realmCredentials) {
            await appBootstrapper.bootstrap(realmCredentials);
            setSignedIn(true);
        } else {
            const idToken = await signInToGoogle();
            if (idToken) {
                const realmCredentials = Realm.Credentials.google(idToken);
                await appBootstrapper.bootstrap(realmCredentials);
                setSignedIn(true);
            } else {
                await bootstrap();
            }
        }
    };

    const addEventListeners = () => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            const currentHistory = appBootstrapper.services.navigationService.goBack();
            if (currentHistory === -1) {
                BackHandler.exitApp();
            }
            return true;
        });
    };

    useEffect(() => {
        bootstrap();
        addEventListeners();
        return () => {
            appBootstrapper.cleanUp();
        };
    }, [appBootstrapper]);

    return (
        <PaperProvider>
            {signedIn ? (
                <ServicesContext.Provider value={appBootstrapper.services}>
                    <HeaderComponent />
                    <NavigationComponent />
                    <ToastComponent />
                </ServicesContext.Provider>
            ) : (
                <ActivityIndicator
                    animating={true}
                    style={{ paddingRight: 15, paddingBottom: 15, paddingTop: '80%' }}
                    size={80}
                    color={'grey'}
                />
            )}
        </PaperProvider>
    );
};
