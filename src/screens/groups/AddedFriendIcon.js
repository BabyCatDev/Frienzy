import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { useUser } from '../../hooks/useUser';
import normalize from 'react-native-normalize';
import { Colors } from '../../utils/Colors';

const AddedFriendIcon = ({ uid }) => {

    const { data: userData, isLoading } = useUser(uid);

    if (isLoading) return <></>

    return (
        <View style={styles.contactImageContainer}>
            <Image 
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.contactImage}
                source={{ uri: userData?.profilePic ?? null }}
            />
        </View>
  )
}

export default AddedFriendIcon;

const styles = StyleSheet.create({
    contactImageContainer: {
        width: normalize(60),
        height: normalize(60),
        borderRadius: normalize(30),
        marginRight: normalize(-20),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.darkGray,
      },
    contactImage: {
        width: normalize(60),
        height: normalize(60),
        borderRadius: normalize(30),
        backgroundColor: Colors.darkGray,
      },
})

