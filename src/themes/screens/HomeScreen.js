import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2596be',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: 40,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  title: { textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16 },
  container: {
    marginHorizontal: 2,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 8,
  },
  text: {
    color: '#000',
    lineHeight: 24,
    marginHorizontal: 4,
  },
  article: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 8 },
  modalHeader: {
    fontSize: 24,
    textAlign: 'justify',
    color: '#000'
  },
  modalSubtitle: {
    textAlign: 'right',
    color: '#a2a2a2',
    fontStyle: 'italic',
    marginVertical: 8
  }
});

export default styles;
