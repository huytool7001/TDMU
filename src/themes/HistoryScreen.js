import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  flatList: {
    flex: 1
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopColor: '#000',
    borderTopWidth: 0.5,
  },
  room: {
    fontSize: 16,
    fontWeight: '500'
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic'
  }
});

export default styles;
