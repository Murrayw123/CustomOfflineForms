import 'expo-dev-client';
import 'react-native-get-random-values';

import { registerRootComponent } from 'expo';
import React from 'react';
import { Bootstrapper } from 'Bootstrapper';
import { AppBootstrapper, servicesFactory } from 'services/AppBootstrapper';
import { MundaBiddiConfiguration } from 'configurations/MundaBiddi';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately

class App extends React.Component<any, any> {
    appBootstrapper = new AppBootstrapper(() => servicesFactory(MundaBiddiConfiguration));

    render() {
        return <Bootstrapper appBootstrapper={this.appBootstrapper} />;
    }
}

registerRootComponent(App);
