import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import FastImage from "react-native-fast-image";

import RNFS from 'react-native-fs';

export function getImgXtension(uri) {
  var basename = uri.split(/[\\/]/).pop();
  basename = basename.replace(/\?alt.*/,"")
  return /[.]/.exec(basename) ? /[^.]+$/.exec(basename) : undefined;
}

export async function findImageInCache(uri) {
  try {
    let info = await RNFS.stat(uri);
    return { ...info, exists: true, err: false };
  } catch (error) {
    return {
      exists: false,
      err: true,
      msg: error,
    };
  }
}

export async function cacheImage(uri, cacheUri, callback) {
  try {
    const downloadImage = RNFS.downloadFile({
      fromUrl: uri,
      toFile: cacheUri,
    });
    const downloaded = await downloadImage.promise;
    return {
      cached: true,
      err: false,
      path: downloaded,
    };
  } catch (error) {
    return {
      cached: false,
      err: true,
      msg: error,
    };
  }
}

const CacheImage = (props) => {
  const {
    source: { uri },
    cacheKey,
    style,
    children,
  } = props;
  const isMounted = useRef(true);
  const [imgUri, setUri] = useState("");

  const getPlatformURI = (uri) => {
    return Platform.select({
      ios: uri,
      android: 'file://' + uri,
    })
  }
  
  useEffect(() => {
    async function loadImg() {
      let imgXt = getImgXtension(uri);
      if (!imgXt || !imgXt?.length) {
        console.error(`Couldn't load Image:`, cacheKey);
        setUri(require('../../assets/imgs/emrgUserMarker.png'))
        return;
      }
      const cacheFileUri = `${RNFS.CachesDirectoryPath}/${cacheKey}.${imgXt[0]}`;
      let imgXistsInCache = await findImageInCache(cacheFileUri);
      if (imgXistsInCache.exists) {
        console.log("already cached: ", cacheFileUri);
        setUri(getPlatformURI(cacheFileUri));
      } else {
        let cached = await cacheImage(uri, cacheFileUri, () => {});
        if (cached.cached) {
          console.log("cached new image:", uri);
          setUri(getPlatformURI(cacheFileUri));
        } else {
          console.error(`Couldn't load Image:`, cacheKey);
          setUri(require('../../assets/imgs/userMarker.png'))
        }
      }
    }
    loadImg();
    return () => isMounted.current = null;
  }, [uri]);

  function isValidURI(uri) {
    return imgUri != '' && typeof imgUri == 'string';
  }

  return (  
    <FastImage source={isValidURI(imgUri)
      ? { uri: imgUri }
      : require('../../assets/imgs/userMarker.png')}
      style={style}

    >
          {children}
    </FastImage>
  );
};
export default CacheImage;