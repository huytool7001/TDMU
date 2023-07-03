import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalTable: { backgroundColor: '#fff', width: windowWidth - 10 },
  contentContainer: { top: 50, marginBottom: 50, alignItems: 'center', paddingBottom: 50 },
  tableHeader: { fontWeight: 'bold', textAlign: 'center' },
  tableTitle: { fontWeight: 'bold', textAlign: 'left', fontSize: 16 },
  titleContainer: {
    backgroundColor: '#d2d2d2',
    width: '97.5%',
    height: 40,
    marginTop: 20,
    paddingHorizontal: 10,
    display: 'flex',
    justifyContent: 'center'
  },
});

export default styles;
