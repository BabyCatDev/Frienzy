import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Platform,
  useWindowDimensions,
  PermissionsAndroid,
  Text,
} from "react-native";
import Contacts from "react-native-contacts";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Header } from "../profile/Header";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import normalize from "react-native-normalize";
import SearchField from "./SearchField";
import ContactItem from "./ContactItem";
import { MainButton } from "../../components/main_button";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";

const ContactList = ({ navigation }) => {
  const mockData = [
    {
      recordID: "1",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "2",
      givenName: "Jane",

      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
    {
      recordID: "3",
      givenName: "John",
      familyName: "Doe",
      phoneNumbers: [
        {
          label: "mobile",
          number: "(555) 555-5555",
        },
      ],
    },
  ];
  const { height } = useWindowDimensions();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [isChange, setIsChange] = useState(false);
  const isAndroid = Platform.OS === "android";
  const scrollRef = useRef(null);
  const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
    KeyboardAwareScrollView
  );
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      console.log(scrollY.value, "scrollY.value");
    },
  });
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], {
      extrapolateRight: Extrapolation.CLAMP,
    });
    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, -50],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacity,
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  });

  const searchContacts = (search) => {
    if (search.length) {
      const filteredContacts = contacts.filter(
        (contact) =>
          contact.givenName.toLowerCase().includes(search.toLowerCase()) ||
          contact.familyName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredContacts(filteredContacts);
    } else {
      setFilteredContacts(contacts);
    }
  };

  async function getContacts() {
    if (Platform.OS === "android") {
      const andoidContactPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts Permission",
          message: "This app would like to view your contacts.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Contacts Permission granted");
        Contacts.getAll()
          .then((contacts) => {
            setContacts(contacts);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("Contacts permission denied");
      }
    } else {
      try {
        const contacts = await Contacts?.getAll();
        console.log(contacts, "my contacts");
        console.log(contacts[0].phoneNumbers, "my contacts");
        setContacts(contacts);
      } catch (error) {
        console.log(error);
      }
    }
  }
  useEffect(() => {
    getContacts();
  }, []);
  useEffect(() => {
    setFilteredContacts(contacts);
    // setFilteredContacts(mockData);
  }, [contacts]);
  useEffect(() => {
    searchContacts(search);
  }, [search]);

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
      <AnimatedKeyboardAwareScrollView
        keyboardDismissMode={"on-drag"}
        // keyboardDismissMode={'none'}
        onScroll={scrollHandler}
        keyboardShouldPersistTaps={"always"}
        ref={scrollRef}
        contentContainerStyle={{ minHeight: isChange ? "50%" : "100%" }}
        extraScrollHeight={isAndroid ? 0 : 75}
        onKeyboardDidShow={() => {
          isAndroid && scrollRef.current.scrollForExtraHeightOnAndroid(25);
        }}
        onKeyboardWillHide={() => !isAndroid && setIsChange(false)}
        onKeyboardDidHide={() => isAndroid && setIsChange(false)}
      >
      {/* <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        contentContainerStyle={{ minHeight: isChange ? "50%" : "100%" }}
        showsVerticalScrollIndicator={false}
      > */}
        {/* <ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{ minHeight: isChange ? "50%" : "100%" }}
        showsVerticalScrollIndicator={false}
      > */}
        <Animated.View
          // <View
          style={{
            ...animatedStyles,
          }}
        >
          <Header
            navigation={navigation}
            // onPressRight={() => navigation.navigate("UserProfile")}
            rightIcon={Assets.contactList}
            rightWidth={normalize(27)}
            rightHeight={normalize(27)}
            title={"Contacts"}
          />
          <SearchField
            search={search}
            setSearch={setSearch}
            // scrollY={scrollY}
          />
        </Animated.View>
        {/* </View> */}
        <View
          style={{
            ...AppStyles.loginContainer,
            paddingHorizontal: 0,
          }}
        >
          {filteredContacts.map((contact, index) => {
            return <ContactItem key={index} item={contact} index={index} />;
          })}
        </View>
        </AnimatedKeyboardAwareScrollView>
      {/* </Animated.ScrollView> */}
      {/* </ScrollView> */}
      <MainButton
        title={"CONTINUE"}
        containerStyle={{
          position: "absolute",
          bottom: height * 0.06,
          alignSelf: "center",
        }}
        onPress={() => console.log('continue')}
      />
    </LinearGradient>
  );
};

export default ContactList;
