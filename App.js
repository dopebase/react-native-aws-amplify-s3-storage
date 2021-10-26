import Amplify, {Storage} from 'aws-amplify';
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
import Video from 'react-native-video';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);

function S3StorageUpload() {
  const [asset, setAsset] = useState(null);
  const [progressText, setProgressText] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const selectFile = async () => {
    await launchImageLibrary({mediaType: 'mixed'}, result => {
      if (!result.assets) {
        Alert.alert(result.errorMessage);
        return;
      }
      setProgressText('');
      setAsset(result.assets[0]);
    });
  };

  const fetchResourceFromURI = async uri => {
    const response = await fetch(uri);
    console.log(response);
    const blob = await response.blob();
    return blob;
  };

  const uploadResource = async () => {
    if (isLoading) return;
    setisLoading(true);
    const img = await fetchResourceFromURI(asset.uri);
    return Storage.put(asset.uri, img, {
      level: 'public',
      contentType: asset.type,
      progressCallback(uploadProgress) {
        setProgressText(
          `Progress: ${Math.round(
            (uploadProgress.loaded / uploadProgress.total) * 100,
          )} %`,
        );
        console.log(
          `Progress: ${uploadProgress.loaded}/${uploadProgress.total}`,
        );
      },
    })
      .then(res => {
        setProgressText('Upload Done: 100%');
        setAsset(null);
        setisLoading(false);
        Storage.get(res.key)
          .then(result => console.log(result))
          .catch(err => {
            setProgressText('Upload Error');
            console.log(err);
          });
      })
      .catch(err => {
        setisLoading(false);
        setProgressText('Upload Error');
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectFile}>
        <Text style={[styles.button, {color: isLoading ? 'grey' : '#fff'}]}>
          SELECT {asset ? 'ANOTHER' : ''} FILE
        </Text>
      </TouchableOpacity>
      {asset ? (
        asset.type.split('/')[0] === 'image' ? (
          <Image
            style={styles.selectedImage}
            source={{uri: asset?.uri ?? ''}}
          />
        ) : (
          <Video
            style={styles.selectedImage}
            source={{uri: asset?.uri ?? ''}}
          />
        )
      ) : null}
      {asset && (
        <>
          <TouchableOpacity onPress={uploadResource}>
            <Text style={[styles.button, {color: isLoading ? 'grey' : '#fff'}]}>
              UPLOAD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => isLoading && setAsset(null)}>
            <Text
              style={[
                styles.cancelButton,
                {color: isLoading ? 'grey' : 'blue'},
              ]}>
              Remove Selected Image
            </Text>
          </TouchableOpacity>
        </>
      )}
      <Text>{progressText}</Text>
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
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    color: 'blue',
  },
  selectedImage: {
    width: 175,
    height: 200,
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
