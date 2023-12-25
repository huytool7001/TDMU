import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { Alert } from 'react-native';

const onMessageReceived = async (message) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  // Alert.alert('A new FCM message arrived!', JSON.stringify(message));
  // Display a notification

  if (message.notification?.title && message.notification?.body) {
    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        color: '#1692c9',
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }
};

class Notification {
  constructor() {}

  load = async () => {
    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
    notifee.onBackgroundEvent(async () => {});
  };
}

const notification = new Notification();
export default notification;
