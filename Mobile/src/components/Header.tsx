import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Platform } from 'react-native';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export const HeaderComponent = () => (
    <Appbar.Header style={{ padding: 0, margin: 0, height: 40 }}>
        <Appbar.Content
            style={{ bottom: 13 }}
            title={'TrailScout'}
            subtitle={'for all your reporting needs'}
        />
        {/*<Appbar.Action style={{padding: 0, margin: 0}} icon={MORE_ICON} />*/}
    </Appbar.Header>
);
