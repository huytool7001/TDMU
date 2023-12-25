import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Avatar, Bubble, GiftedChat, Send, SystemMessage } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { Context } from '../utils/context';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import InChatFileTransfer from '../components/InChatFileTransfer';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import notificationApis from '../apis/Notification';

const width = Dimensions.get('screen').width * 0.94;

export default function ChatScreen({ route }) {
  const [context, setContext] = useContext(Context);
  const { channel } = route.params;

  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(text) {
    if (files.length) {
      setLoading(true);
      files.forEach(async (file, index) => {
        const ref = storage().ref(`${Date.now() + '_' + file.name}`);
        await ref.putFile(file.fileCopyUri);
        const path = await ref.getDownloadURL();
        file.path = path;

        await firestore()
          .collection('GROUPS')
          .doc(channel.id)
          .collection('MESSAGES')
          .add({
            text: index === files.length - 1 ? text : '',
            createdAt: new Date().getTime(),
            user: {
              id: context.email,
              name: context.username,
              avatar: context.avatar,
            },
            file,
          });

        await firestore()
          .collection('GROUPS')
          .doc(channel.id)
          .set(
            {
              latestMessage: {
                text: index === files.length - 1 && text ? text : file.name,
                createdAt: new Date().getTime(),
                userId: context.email,
                username: context.username,
                system: false
              },
            },
            { merge: true },
          );

        notificationApis
          .create(channel.id, index === files.length - 1 && text ? text : file.name, context.email, context.username)
          .catch((e) => console.log(e));

        setLoading(false);
      });
    } else if (text) {
      await firestore()
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

      notificationApis.create(channel.id, text, context.email, context.username).catch((e) => console.log(e));
    }

    setTextInput('');
    setFiles([]);
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
    if (props.currentMessage.file) {
      return (
        <View style={styles.fileContainer}>
          {props.currentMessage.user.id !== context.email &&
            (props.currentMessage.user.id !== (props?.previousMessage?.user?.id || '') ||
              new Date(props.currentMessage.createdAt).getDate() !==
                new Date(props.previousMessage.createdAt).getDate()) && (
              <Text style={styles.name}>{props.currentMessage.user.name}</Text>
            )}
          <View
            style={{
              ...styles.fileContainer,
              backgroundColor: props.currentMessage.user.id === context.email ? '#218aff' : '#fff',
              borderBottomLeftRadius: props.currentMessage.user.id === context.email ? 15 : 5,
              borderBottomRightRadius: props.currentMessage.user.id === context.email ? 5 : 15,
            }}
          >
            <TouchableOpacity onPress={() => handleOpeningFile(props.currentMessage.file)}>
              <InChatFileTransfer style={{ marginTop: -10 }} file={props.currentMessage.file} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column' }}>
              {props.currentMessage.text && (
                <Text
                  style={{
                    ...styles.fileText,
                    color: props.currentMessage.user.id === context.email ? 'white' : 'black',
                  }}
                >
                  {props.currentMessage.text}
                </Text>
              )}
              <Text
                style={{
                  color: props.currentMessage.user.id === context.email ? 'white' : 'black',
                  textAlign: 'right',
                  fontSize: 10,
                  fontWeight: '400',
                  marginBottom: 4,
                  marginRight: 8,
                }}
              >
                {new Date(props.currentMessage.createdAt).toLocaleTimeString('en-US', {
                  hour12: true,
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>
      );
    }

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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={_pickDocument}>
          <Ionicons name="attach" size={30} color="orange" />
        </TouchableOpacity>
        <Send {...props} sendButtonProps={{}}>
          <TouchableOpacity onPress={() => !loading && handleSend(props.text)}>
            {loading ? (
              <ActivityIndicator
                size="small"
                style={{
                  marginHorizontal: 10,
                  marginBottom: 8,
                }}
              />
            ) : (
              <Ionicons
                name="send"
                style={{
                  marginHorizontal: 10,
                  marginBottom: 7,
                }}
                size={25}
                color="#2596be"
              />
            )}
          </TouchableOpacity>
        </Send>
      </View>
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

  // file
  const [files, setFiles] = useState([]);

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      setFiles([...files, ...result]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };

  const renderChatFooter = useCallback(() => {
    if (files.length) {
      return (
        <View style={styles.chatFooter}>
          <FlatList
            data={files}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ width }}>
                <InChatFileTransfer file={item} />
                <TouchableOpacity
                  onPress={() => setFiles([...files.slice(0, index), ...files.slice(index + 1)])}
                  style={styles.buttonFooterChat}
                >
                  <Text style={styles.textFooterChat}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      );
    }
    return null;
  }, [files]);

  const handleOpeningFile = async (file) => {
    const rootDir = RNFetchBlob.fs.dirs.DownloadDir;
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        path: rootDir + '/' + file.name,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };

    await RNFetchBlob.config(options).fetch('GET', file.path);

    return Alert.alert('Downloading file...', '1 tệp đang được tải xuống', [], { cancelable: true });
  };

  return (
    <GiftedChat
      text={textInput}
      onInputTextChanged={(text) => setTextInput(text)}
      messages={messages}
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
      renderChatFooter={renderChatFooter}
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
    textAlign: 'center',
  },
  name: {
    fontSize: 13,
    color: '#8e8e8e',
    marginBottom: 4,
    marginRight: 0,
  },
  container: {
    flex: 1,
  },
  paperClip: {
    marginTop: 8,
    marginHorizontal: 5,
    transform: [{ rotateY: '180deg' }],
  },
  sendButton: { marginBottom: 10, marginRight: 10 },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatFooter: {
    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    padding: 5,
    backgroundColor: '#218aff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxHeight: 300,
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  textTime: {
    fontSize: 10,
    color: 'gray',
    marginLeft: 2,
  },
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 66,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  textFooterChat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});
