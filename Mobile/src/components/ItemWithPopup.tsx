import * as React from 'react';
import { View } from 'react-native';
import { IconButton, Menu, TextInput } from 'react-native-paper';

interface Props {
    menuOptions: Array<{ display: string; value: string }>;
    value: string;
    onMenuItemSelected: (value: string) => void;
    inputLabel: string;
}

const findDisplayValueFromMenuItems = (
    menuOptions: Array<{ display: string; value: string }>,
    value: string
) => {
    const menuItem = menuOptions.find(menuItem => menuItem.value === value);
    return menuItem ? menuItem.display : menuOptions[0].display;
};

export const SelectableMenuItem = (props: Props) => {
    const [visible, setVisible] = React.useState(false);

    const { value, menuOptions, onMenuItemSelected, inputLabel } = props;

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    return (
        <View
            style={{
                flexDirection: 'row',
                padding: 10,
                width: 400,
                paddingLeft: 0
            }}
        >
            <TextInput
                label={inputLabel}
                value={findDisplayValueFromMenuItems(menuOptions, value)}
                disabled={true}
                style={{ width: 250 }}
                onPressIn={openMenu}
            />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<IconButton onPress={openMenu} icon={'menu-down'} size={36} />}
            >
                {menuOptions.map((item, index) => (
                    <Menu.Item
                        key={index}
                        title={item.display}
                        onPress={() => {
                            onMenuItemSelected(item.value);
                            closeMenu();
                        }}
                    />
                ))}
            </Menu>
        </View>
    );
};
