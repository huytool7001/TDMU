import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import authAPIs from '../apis/Auth';
import { Context } from '../utils/context';
import styles from '../themes/components/ReLoginAlert';

const ReLoginAlert = () => {
  const [context, setContext] = React.useContext(Context);

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();

      const result = await authAPIs.signOut(context.token);

      if (result.err) {
        Alert.alert('Oops!', result.err, [{ text: 'Ok' }]);
        return;
      }

      setContext({ ...context, token: '', expire: false });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={context.expire}
      children={
        <View style={styles.container}>
          <Text>Phiên làm việc đã hết hạn, vui lòng đăng nhập lại</Text>
          <Button title="X Đóng" onPress={handleSignOut} color="#cc0000"></Button>
        </View>
      }
    ></Modal>
  );
};

export default ReLoginAlert;
