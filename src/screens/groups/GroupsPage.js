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
import Assets from "../../assets";
import Ionicon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { getGroupsForUser } from "../../services/firebase/user";
import normalize from "react-native-normalize";
import GroupListItem from "./GroupListItem";

const GroupsPage = ({ navigation }) => {

    const { height } = useWindowDimensions();
    const [groupList, setGroupList] = useState([]);
    const [query, setQuery] = useState("");
    const conversations = useSelector(state => state.FrienzyData.conversations);

  // useEffect(() => {
  //   console.log(conversations);
  // }, []);

  // const filteredItems = useMemo(() => {
  //   return [...conversations];
  // }, [groupList]);

//   {filteredItems?.length == 0 && (
//     <Text
//       style={{
//         ...AppStyles.medium22,
//         ...AppStyles.notFoundPlaceholder,
//         top: (height - 2 * normalize(33)) / 2,
//       }}
//     >
//       {"Nothing found"}
//     </Text>
//   )}

// duplicate-outline
// create-outline
// person-add
// people-circle
// people-outline

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
        <View>
            <Header
                onPressRight={() => navigation.push("Contacts")}
                rightIcon={() => <Ionicon color={"white"} name={"duplicate-outline"} size={normalize(23)} />}
                title={"Frienzies"}
                friendsCounter={conversations ? conversations.length === 1 ? "1 Frienzy" : `${conversations.length} Frienzies` : "0 Frienzies"}
                navigation={navigation}
                noBackButton
            />
            <SearchField search={query} setSearch={setQuery} />
        </View>
        <FlatList
            data={conversations}
            renderItem={({item, index}) => 
                <GroupListItem 
                    item={item} 
                    index={index} 
                    onPress={({itemClicked}) => console.log(itemClicked.id)} 
                /> 
            }
            keyExtractor={item => item.id}
        />
    </LinearGradient>
  );
};

export default GroupsPage;
