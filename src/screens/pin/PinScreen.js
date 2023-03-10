import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Colors, ScreenNames } from "../../utils/AppConstants";
import { Dimensions } from "react-native";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSelector } from "react-redux";
import { checkUserPinApiCall } from "../../network";
import { useDispatch } from "react-redux";
import { setPin } from "../../store/slices/AuthSlice";
import { useFocusEffect } from "@react-navigation/native";
import { Strings } from "../../utils/Localizations";
import {
  HeaderLeft,
  HeaderStyle,
  HeaderTitle,
} from "../../components/lav.header";

const { height, width } = Dimensions.get("screen");
const CELL_COUNT = 4;

const PinScreen = ({ navigation, route }) => {
  const [value, setValue] = useState("");
  const ref = useRef(null);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const token = useSelector((state) => state.auth.token);

  const [isPortrait, setIsPortrait] = useState(height >= width);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  // const pinRef = useRef(null);

  const dispatch = useDispatch();

  let dimensionsHandler;

  const checkPin = async (value) => {
    setLoading(true);

    try {
      await checkUserPinApiCall({ token, pin: value + "" });
      dispatch(setPin(value + ""));

      setTimeout(() => {
        navigation.replace(route.params.nextRoute);
      }, 300);
    } catch (error) {
      setError(error.response.data.error);
      setValue("");
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(false);
      setValue("");
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: HeaderLeft,
      headerTitle: HeaderTitle,
      headerShadowVisible: false,
      headerTitleContainerStyle: {
        marginHorizontal: 8,
      },
      headerStyle: HeaderStyle,
      headerTitleAlign: Platform.isPad ? "center" : "left",
      title: route.params.title ?? "",
    });

    dimensionsHandler = Dimensions.addEventListener(
      "change",
      ({ window: { width, height } }) => {
        setIsPortrait(width < height);
      }
    );
    return () => {
      dimensionsHandler.remove();
    };
  }, []);

  const handleChangeText = async (val) => {
    setValue(val);
    setError("");
    if (val.length === 4) {
      checkPin(val);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.root}>
        <View style={styles.textView}>
          <Text style={[styles.mainText, !isPortrait && styles.landscape]}>
          {Localization.getString("pin", "enterPin")}
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator
            color={Colors.primary[900]}
            style={{ marginTop: 30 }}
            size="large"
          />
        ) : (
          <CodeField
            ref={ref}
            {...props}
            autoFocus={true}
            caretHidden={false}
            value={value}
            onChangeText={handleChangeText}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
        )}
        <Text style={styles.errorText}>{error ?? ""}</Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.grayscale[100],
    fontFamily: "Roboto",
  },
  textView: { width: 344, marginHorizontal: 16, alignSelf: "center" },
  mainText: {
    marginTop: 16,
    fontWeight: "600",
    fontSize: 20,
    textAlign: Platform.isPad ? "center" : "left",
    color: Colors.grayscale[900],
    lineHeight: 24,
  },
  landscape: { textAlign: "center" },
  codeFieldRoot: {
    marginTop: 16,
    justifyContent: "space-between",
    width: 344,
    marginHorizontal: 16,
    alignSelf: "center",
  },
  cell: {
    width: 74,
    height: 55,
    justifyContent: "center",
    borderRadius: 12,
    lineHeight: 38,
    backgroundColor: Colors.grayscale[0],
  },
  cellText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "600",
    fontSize: 25,
    color: Colors.grayscale[900],
  },
  focusCell: {
    borderColor: Colors.primary[900],
    borderWidth: 1,
  },
  errorText: {
    width: 344,
    color: Colors.additional.red[100],
    marginHorizontal: 16,
    marginTop: 15,
    textAlign: "left",
    alignSelf: "center",
  },
});

export default PinScreen;
