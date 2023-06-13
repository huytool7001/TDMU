import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  paddingLeft: {
    paddingLeft: 16,
  },
  headerSection: {
    flexDirection: 'row',
    marginTop: '5%',
  },
  userInfoSection: { 
    marginLeft: '5%', 
    flexDirection: 'column' 
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default styles;
