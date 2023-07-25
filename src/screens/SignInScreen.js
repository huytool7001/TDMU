import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useTheme } from 'react-native-paper';
import authAPIs from '../apis/Auth';
import { Context } from '../utils/context';
import styles from '../themes/screens/SignInScreen';

GoogleSignin.configure({
  webClientId: '869859501130-uouaup2hk7mb26beso4o5jk7ql7objcn.apps.googleusercontent.com',
  // webClientId: '79837717230-kttlrk5m6c41mps51smaofmf6j6jso6d.apps.googleusercontent.com',
});

const SignInScreen = () => {
  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const { colors } = useTheme();
  const [context, setContext] = React.useContext(Context);

  const textInputChange = (val) => {
    if (val.trim().length !== 0) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleSignIn = async () => {
    // setContext({ ...context, token: 'tdmu' });
    // setContext({ ...context, isLoading: true });

    // const result = await userAPIs.signIn({
    //   userId: data.username,
    //   password: data.password,
    // });

    // setContext({ ...context, isLoading: false });

    // if (result.err) {
    //   Alert.alert('Oops!', result.err, [{ text: 'Ok' }]);
    //   return;
    // }

    // if (result.token) {
    //   setContext({ ...context, token: result.token });
    // }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      const result = await authAPIs.signIn(token.accessToken);
      setContext({ ...context, token: result.access_token, userId: result.userName, role: result.roles });
      if (result.expires_in) {
        setTimeout(() => {
          setContext({ ...context, expire: true });
        }, result.expires_in * 1000);
      }
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2596be" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}
        >
          Username
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Username"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}
        >
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.textForgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn} onPress={handleSignIn}>
            <LinearGradient colors={['#2596be', '#085c8d']} style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}
              >
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignInWithGoogle}
            style={[
              styles.signIn,
              {
                borderColor: '#085c8d',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}
          >
            <Text
              style={[
                styles.textSign,
                {
                  color: '#085c8d',
                },
              ]}
            >
              Sign In With Google
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;
