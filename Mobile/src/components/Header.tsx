import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Platform } from 'react-native';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const HeaderComponent = () => (
    <Appbar.Header>
        <Appbar.Content title={'TrailScout'} subtitle={"For all your reporting needs"} />
        <Appbar.Action icon={MORE_ICON} />
    </Appbar.Header>
);
