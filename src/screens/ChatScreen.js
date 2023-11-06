import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Bubble, GiftedChat, Send, SystemMessage } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { Context } from '../utils/context';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function ChatScreen({ route }) {
  const [context, setContext] = useContext(Context);
  const { channel } = route.params;

  const [messages, setMessages] = useState([]);

  async function handleSend(messages) {
    const text = messages[0].text;

    firestore()
      .collection('GROUPS')
      .doc(channel.id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          id: context.email,
          name: context.username,
          avatar: context.avatar,
        },
      });

    await firestore()
      .collection('GROUPS')
      .doc(channel.id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
            userId: context.email,
            username: context.username,
          },
        },
        { merge: true },
      );
  }

  useEffect(() => {
    const messagesListener = firestore()
      .collection('GROUPS')
      .doc(channel.id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              _id: firebaseData.user.id,
            };
          }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    if (
      (props.currentMessage.user.id === (props?.previousMessage?.user?.id || '') &&
        new Date(props.currentMessage.createdAt).getDate() === new Date(props.previousMessage.createdAt).getDate()) ||
      props.currentMessage.user.id === context.email
    ) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#fff',
            },
          }}
        />
      );
    }

    return (
      <View>
        <Text style={styles.name}>{props.currentMessage.user.name}</Text>
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#fff',
            },
          }}
        />
      </View>
    );
  }

  function renderAvatar(props) {
    if (
      Object.entries(props.currentMessage.user).sort().toString() ===
        Object.entries(props?.previousMessage?.user || {})
          .sort()
          .toString() &&
      new Date(props.currentMessage.createdAt).getDate() === new Date(props.previousMessage.createdAt).getDate()
    ) {
      return <Avatar containerStyle={{ display: 'none' }}></Avatar>;
    }

    return <Avatar {...props} />;
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return <SystemMessage {...props} wrapperStyle={styles.systemMessageWrapper} textStyle={styles.systemMessageText} />;
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{ _id: context.email, name: context.name, avatar: context.avatar }}
      placeholder="Type your message here..."
      alwaysShowSend
      scrollToBottom
      renderAvatarOnTop
      showAvatarForEveryMessage
      renderBubble={renderBubble}
      renderAvatar={renderAvatar}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 20,
  },
  systemMessageText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  name: {
    fontSize: 13,
    color: '#8e8e8e',
    marginBottom: 4,
    marginRight: 0,
  },
});
