import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalTable: { backgroundColor: '#fff', width: windowWidth - 10 },
  contentContainer: { top: 100, marginBottom: 100, alignItems: 'center', paddingBottom: 50 },
  tableHeader: { fontWeight: 'bold', textAlign: 'center' },
  tableTitle: { fontWeight: 'bold', textAlign: 'left', fontSize: 16 },
  titleContainer: { backgroundColor: '#d2d2d2', marginTop: 12, width: '98%', paddingHorizontal: 10 },
});

export default styles;
