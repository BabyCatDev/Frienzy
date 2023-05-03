import React, { useEffect, useState, useMemo } from "react";
import {
  useWindowDimensions,
  Text,
  FlatList,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { Header } from "../profile/Header";
import SearchField from "../../components/SearchField";
import Ionicon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import normalize from "react-native-normalize";
import FriendListItem from "./FriendListItem";
import { getFriendsForUser } from "../../services/firebase/user";
import { AppStyles } from "../../utils/AppStyles";

const MyFriends = ({ navigation }) => {

    const { height } = useWindowDimensions();
    const [friendList, setFriendList] = useState([]);
    const [query, setQuery] = useState("");
    const userDetails = useSelector(state => state.FrienzyAuth.userDetails)

  useEffect(() => {
    async function onStart() {
      const groups = await getFriendsForUser(userDetails.friends);
      setFriendList(groups)
    }
    onStart();
  }, []);

  const filteredItems = useMemo(() => {
    return [...friendList];
  }, [friendList]);

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
        <View>
            <Header
                onPressRight={() => navigation.push("Contacts")}
                rightIcon={() => <Ionicon color={"white"} name={"person-add-outline"} size={normalize(23)} />}
                title={"My Friends"}
                navigation={navigation}
            />
            <SearchField search={query} setSearch={setQuery} />
        </View>
        <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.uid}
            renderItem={({item, index}) => 
                <FriendListItem 
                    item={item} 
                    index={index} 
                    onPress={({itemClicked}) => console.log(itemClicked.id)} 
                /> 
            }
            ListEmptyComponent={
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40}}>
                    <Text style={{...AppStyles.medium22, color: "white"}}>{"No Friends Yet  :("}</Text>
                </View>
                
            }
        />
    </LinearGradient>
  );
};

export default MyFriends;
