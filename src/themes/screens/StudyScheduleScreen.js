import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  contentContainer: { top: 100, marginBottom: 100 },
  textDate: { fontWeight: 'bold', fontSize: 20, marginBottom: 20 },
  textSubjectName: { fontWeight: 'bold', fontSize: 16 }
});

export default styles;
