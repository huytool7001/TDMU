import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: { position: 'absolute', paddingHorizontal: 5, maxWidth: windowWidth, zIndex: 3, marginTop: 10 },
  dropDownContainer: { top: 0, position: 'relative', height: 400 },
});

export default styles;
