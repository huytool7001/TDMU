import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalTable: { backgroundColor: '#fff', width: windowWidth - 10 },
  contentContainer: { top: 100, marginBottom: 100 },
  tableHeader: { fontWeight: 'bold', textAlign: 'center' },
});

export default styles;
