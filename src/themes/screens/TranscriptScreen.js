import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  modalTable: { backgroundColor: '#fff' },
  contentContainer: { top: 100, marginBottom: 100 },
  tableHeader: { fontWeight: 'bold', textAlign: 'center' },
  bottomSectionContainer: { marginTop: 20, marginHorizontal: 32 },
  flexRow: { display: 'flex', flexDirection: 'row' },
  flex2: { flex: 2 },
  flex1End: { flex: 1, alignItems: 'flex-end' },
  notFoundText: { textAlign: 'center', fontStyle: 'italic' },
});

export default styles;
