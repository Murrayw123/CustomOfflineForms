import React, { useContext } from 'react';
import { ServicesContext } from 'services/Context';
import { useNetInfo } from '@react-native-community/netinfo';
import { View } from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';

export const TopBarStatusIndicator = () => {
    const { realmSyncStatusService, offlineMapSyncStatusService } = useContext(ServicesContext);

    const { isConnected } = useNetInfo();
    const [syncing, setSyncing] = React.useState<boolean>();

    React.useEffect(() => {
        realmSyncStatusService.subscribe({
            next: changeNotification => {
                setSyncing(changeNotification.isSyncing);
            }
        });

        offlineMapSyncStatusService.subscribe(syncing => {
            setSyncing(syncing);
        });
    }, [realmSyncStatusService, offlineMapSyncStatusService]);

    const connectivityIcon = isConnected ? 'cloud-check' : 'cloud-alert';

    return (
        <View>
            {syncing ? (
                <ActivityIndicator
                    animating={true}
                    style={{ paddingRight: 15, paddingBottom: 15 }}
                />
            ) : (
                <Avatar.Icon
                    size={45}
                    icon={connectivityIcon}
                    style={{ backgroundColor: 'transparent', paddingRight: 15, paddingBottom: 15 }}
                />
            )}
        </View>
    );
};
