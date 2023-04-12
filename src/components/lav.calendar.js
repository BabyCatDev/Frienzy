import React, { useCallback, useState, useEffect } from "react";
import moment from "moment";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors, Sizes } from "../utils/AppConstants";
import { AssetImage } from "../assets/asset_image";
import LavAssets from "../assets";

LocaleConfig.locales["ru"] = {
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: [
    "Янв.",
    "Февр.",
    "Март",
    "Апр.",
    "Май",
    "Июнь",
    "Июль",
    "Авг.",
    "Сент.",
    "Окт.",
    "Нояб.",
    "Дек.",
  ],
  dayNames: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
  today: "Сегодня",
};
LocaleConfig.defaultLocale = "ru";

//SINGLECHOISE PROP CHANGE CHOOSING RANGE DATE TO SINGLE DATE
//CALLBACK NEED TO SET YOUR DATE/DATE_RANGE IN PARETN COMPONENT

export const LavCalendar = ({ sheetRef, callback, singleChoice }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [markedDays, setMarkedDays] = useState({});
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [isStart, setIsStart] = useState(true);

  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );
  }, []);

  useEffect(() => {
    if (start && end) {
      const startRange = start < end ? start : end;
      const endRange = start < end ? end : start;
      setMarkedDays(createDateRange(startRange, endRange));
    }
  }, [start, end]);

  function createDateRange(startDate, endDate) {
    const dateRange = {};
    if (startDate && endDate) {
      let start = moment(startDate).startOf("day").add(1, "days");
      const end = moment(endDate).startOf("day");
      while (end.isAfter(start)) {
        Object.assign(dateRange, {
          [start.format("YYYY-MM-DD")]: {
            customStyles: {
              text: { color: Colors.primary[900] },
              container: { backgroundColor: Colors.primary[200] },
            },
          },
        });
        start = start.add(1, "days");
      }
    }
    return dateRange;
  }

  const onDayPress = useCallback(
    (day) => {
      if (singleChoice) {
        setStart(day?.dateString);
        callback(day?.dateString);
        setTimeout(() => {
          sheetRef.current.close();
          setStart(undefined);
        }, 500);
      } else {
        isStart ? setStart(day?.dateString) : setEnd(day?.dateString);
        setIsStart((prev) => !prev);
      }
    },
    [start, end, markedDays]
  );
  return (
    <View style={{paddingHorizontal: 16}}>
      <Calendar
        hideExtraDays={true}
        enableSwipeMonths
        style={{ borderWidth: 0, height: 360 }}
        firstDay={1}
        renderArrow={(direction) => (
          <View>
            {direction == 'left'? <AssetImage
              asset={LavAssets.chevronLeft}
              width={20}
              height={20}
              stroke={Colors.grayscale[400]}
            />
          :
          <AssetImage
              asset={LavAssets.chevronRight}
              width={20}
              height={20}
              stroke={Colors.grayscale[400]}
            />
          }
          </View>
        )}
        onDayPress={onDayPress}
        markingType={"custom"}
        markedDates={{
          [currentDate]: {
            customStyles: { text: { color: Colors.primary[900] } },
          },
          [end]: {
            customStyles: {
              text: { color: Colors.grayscale[0] },
              container: { backgroundColor: Colors.primary[900] },
            },
          },
          [start]: {
            customStyles: {
              text: { color: Colors.grayscale[0] },
              container: { backgroundColor: Colors.primary[900] },
            },
          },
          ...markedDays,
        }}
        theme={{
          
          "stylesheet.calendar.main": {
            container: {
              backgroundColor: Colors.grayscale[0],
            },
          },

          "stylesheet.day.basic": {
            base: {
              width: 30,
              height: 30,
              alignItems: "center",
            },
            text: {
              ...styles.lavText,
              marginTop: Platform.OS == "android" ? 4 : 6,
              backgroundColor: "rgba(255, 255, 255, 0)",
            },
            //EMPTY OBJECTS NEED TO CLEAN UP THE STYLES
            selected: {},
            selectedText: {},
            today: {},
            todayText: {},
          },

          "stylesheet.calendar.header": {
            week: {
              ...styles.weekStyle,
            },
            dayHeader: {
              ...styles.lavText,
              ...styles.weekHeader,
            },
            monthText: {
              ...styles.lavText,
              margin: 0,
            },
            header: {
              ...styles.header,
            },
          },
        }}
      />
      {!singleChoice && (
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor:
              start && end ? Colors.primary[900] : Colors.primary[300],
          }}
          onPress={
            start && end
              ? () => {
                  callback({
                    start: start < end ? start : end,
                    end: start < end ? end : start,
                  });
                  sheetRef.current.close();
                  setStart(undefined);
                  setEnd(undefined);
                  setMarkedDays({});
                }
              : null
          }
        >
          <Text style={styles.buttonText}>Применить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lavText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Regular",
    }),
    fontWeight: Platform.select({
      ios: "400",
      android: undefined,
    }),
    color: Colors.grayscale[900],
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: Platform.select({
      ios: "500",
      android: undefined,
    }),
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Medium",
    }),
    color: Colors.grayscale[0],
  },
  weekStyle: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 9,
  },
  weekHeader: {
    width: 30,
    textAlign: "center",
    fontSize: 12,
    color: Colors.grayscale[400],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
});
