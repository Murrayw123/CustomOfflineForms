import * as React from 'react';
import { useContext } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { ServicesContext } from 'Bootstrapper';

export const NavigationComponent = () => {
    const { navigationService, configurationService } = useContext(ServicesContext);
    const [index, setIndex] = React.useState(navigationService.currentIndex);
    const [routes, setRoutes] = React.useState(navigationService.routes);

    navigationService.subscribeToComponentChange(index => {
        setIndex(index);
    });

    navigationService.subscribeToAvailableRoutesChange(routes => {
        setRoutes(routes);
    });

    const renderScene = BottomNavigation.SceneMap(configurationService.configuration.sceneMap);

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={index => {
                navigationService.currentIndex = index;
            }}
            renderScene={renderScene}
        />
    );
};
