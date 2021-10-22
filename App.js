import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

function S3StorageUpload() {
  const [asset, setAsset] = useState(null);

  const selectFile = async () => {
    await launchImageLibrary({mediaType: 'mixed'}, result => {
      if (!result.assets) {
        Alert.alert(result.errorMessage);
        return;
      }
      setAsset(result.assets[0]);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectFile}>
        <Text style={styles.button}>SELECT {asset ? 'ANOTHER' : ''} FILE</Text>
      </TouchableOpacity>
      {asset && <Image style={styles.image} source={{uri: asset.uri}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'blue',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 350,
    height: 400,
    backgroundColor: 'red',
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default S3StorageUpload;

//B1CEU0g0WoBUAmiMA95koeRHgLSui3/lb66TBTOE
