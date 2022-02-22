import * as React from 'react';
import { View } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface Props {
    menuOptions: Array<{ display: string; value: string }>;
    value: string;
    onMenuItemSelected: (value: string) => void;
}

export const SelectableMenuItem = (props: Props) => {
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>Show menu</Button>}
            >
                {props.menuOptions.map((item, index) => (
                    <Menu.Item
                        key={index}
                        title={item.display}
                        onPress={() => {
                            props.onMenuItemSelected(item.value);
                            closeMenu();
                        }}
                    />
                ))}
            </Menu>
        </View>
    );
};
