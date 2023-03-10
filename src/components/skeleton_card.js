import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Colors } from "../utils/AppConstants";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export const SkeletonCard = ({
  status,
  decorateLine,
  arrowDown,
  shortTitle,
  infoRows = 0,
  steppers,
  totalInfo
}) => {
  const { width, height } = useWindowDimensions();
  const infoLines = new Array(infoRows).fill(
    <View style={{ ...styles.info, marginBottom: 8 }}>
      <Text style={{ width: 120, height: 20, borderRadius: 12 }} />
      <Text style={{ width: 50, height: 20, borderRadius: 12 }} />
    </View>
  );
  return (
    <View
      style={{
        ...styles.card,
        width: width < height ? null : 342,
        marginBottom: width < height ? 8 : 16,
      }}
    >
      <SkeletonPlaceholder>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* AVATAR */}
          <View style={{ width: 64, height: 64, borderRadius: 50 }} />

          <View
            style={{
              ...styles.cardTitleContainer,
              alignSelf: status ? null : "center",
            }}
          >
            {/* TITLE */}
            <Text
              style={{
                width: shortTitle ? "40%" : 215,
                height: 24,
                borderRadius: 12,
                marginBottom: 8,
                textAlignVertical: "center",
              }}
            />
            {/* STATUS */}
            {status && (
              <View style={styles.statusContainer}>
                <View
                  style={{
                    width: 103,
                    height: 24,
                    borderRadius: 12,
                    marginBottom: 8,
                    marginRight: 8,
                  }}
                />
                <View style={{ width: 65, height: 24, borderRadius: 12 }} />
              </View>
            )}
          </View>

          {arrowDown && (
            <View style={{ width: 24, height: 24, borderRadius: 50 }} />
          )}
        </View>

        {decorateLine && <View style={styles.decorateLine} />}

        
        {steppers &&  <View
            style={{
              flexDirection: "row",
              width: "100%",
              // backgroundColor: "yellow",
              height: 44,
              // marginVertical: 8,
              marginTop: 8,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  borderColor: Colors.grayscale[100],
                  borderRadius: 12,
                  width: 123,
                  marginRight: 8,
                  justifyContent: "center",
                  paddingLeft: 16,
                }}
              />
              <View
                style={{
                  borderColor: Colors.grayscale[100],
                  borderRadius: 12,
                  width: 123,
                }}
              />
            </View>

            {totalInfo && <View style={{ alignSelf: "center" }}>
              <View
                style={{
                  borderColor: Colors.grayscale[100],
                  borderRadius: 12,
                  width: 40,
                  height: 16,
                  marginBottom: 4,
                }}
              />
              <View
                style={{
                  borderColor: Colors.grayscale[100],
                  borderRadius: 12,
                  width: 30,
                  alignSelf: "flex-end",
                  height: 16,
                }}
              />
            </View>}
          </View>}
        
        <View style={{ marginTop: decorateLine ? 0 : 8, marginBottom: infoRows == 1? 12:0}}>
          {infoLines.map((el, i) => (
            <View key={i}>{el}</View>
          ))}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  decorateLine: {
    borderBottomWidth: 1,
    borderColor: Colors.grayscale[100],
    marginTop: 12,
    marginBottom: 12,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 12,
  },
  infoAll: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 36,
    alignItems: "center",
    // backgroundColor: "yellow",
    marginBottom: 12,
    // paddingBottom: 12
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
  },
  cardTitleContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  card: {
    backgroundColor: Colors.grayscale[0],
    borderRadius: 16,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 4,
  },
  cardTitleContainerAllComponents: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 10,
  },
});
