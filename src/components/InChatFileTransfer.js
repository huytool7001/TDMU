import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const InChatFileTransfer = ({ file }) => {
  let source;
  switch (true) {
    case file.type.includes('pdf'): {
      source = require('../assets/pdf.jpg');
      break;
    }
    case file.type.includes('doc'): {
      source = require('../assets/doc.jpg');
      break;
    }
    case file.type.includes('xls'): {
      source = require('../assets/xls.jpg');
      break;
    }
    case file.type.includes('txt'): {
      source = require('../assets/txt.jpg');
      break;
    }
    case file.type.includes('png'): {
      source = require('../assets/png.jpg');
      break;
    }
    case file.type.includes('jpg'): {
      source = require('../assets/pdf.jpg');
      break;
    }
    case file.type.includes('ppt'): {
      source = require('../assets/ppt.jpg');
      break;
    }
    case file.type.includes('zip'): {
      source = require('../assets/zip.jpg');
      break;
    }
    default: {
      source = require('../assets/unknown.png');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image source={source} style={{ height: 60, width: 60 }} />
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">
            {file.name.replaceAll('%20', ' ')}
          </Text>
          <Text style={styles.textSize}>{Math.floor((file.size / 1024) * 100) / 100}KB</Text>
        </View>
      </View>
    </View>
  );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'black',
    marginTop: 10,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textSize: {
    color: 'black',
    marginTop: 5,
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 5,
  },
  textContainer: {
    width: 0,
    flexGrow: 1,
    textAlign: 'justify',
  },
  frame: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginTop: -4,
    width: '100%',
  },
});
