import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../themes/screens/SplashScreen';

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation="zoomInDown"
          style={styles.logo}
          resizeMode="stretch"
          source={require('../assets/Icon.png')}
        />
      </View>
      <Animatable.View style={styles.footer} animation="slideInUp">
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.title}>Thu Dau Mot University!</Text>
        <Text style={styles.text}>Sign in to continue</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
            <LinearGradient
              colors={['#2596be', '#085c8d']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Get Started</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;
