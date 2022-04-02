import { Dimensions, StyleSheet } from 'react-native';

export const StyleURL = 'mapbox://styles/murrayw123/ckkdfkpan08m317ogw6ebdoli';
export const mapStyles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'tomato',
        position: 'absolute'
    },
    map: {
        flex: 1
    },
    gpsTouchable: {
        position: 'absolute',
        right: 10,
        top: 80,
        zIndex: 9999,
        width: 50,
        height: 50
    },
    downloadMap: {
        position: 'absolute',
        right: 10,
        top: 140,
        zIndex: 9999,
        width: 50,
        height: 50
    },
    gps: {
        position: 'absolute',
        backgroundColor: '#fff'
    },
    activity: {
        position: 'absolute',
        backgroundColor: 'transparent',
        color: 'grey'
    }
});
