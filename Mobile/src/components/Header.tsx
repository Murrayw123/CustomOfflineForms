import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { TopBarStatusIndicator } from 'components/TopBarStatusIndicator';

export const HeaderComponent = () => (
    <Appbar.Header style={{ padding: 0, margin: 0, height: 40 }}>
        <Appbar.Content
            style={{ bottom: 13 }}
            title={'TrailScout'}
            subtitle={'for all your reporting needs'}
        />
        <TopBarStatusIndicator />
    </Appbar.Header>
);
