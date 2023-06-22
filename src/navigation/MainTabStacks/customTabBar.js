// import React, { useEffect, useState } from 'react';
// import { View, Pressable, StyleSheet } from 'react-native';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import { Colors } from '../../utils/Colors';

// const CustomTabBar = ({ state, descriptors, navigation }) => {
//   const [routeName, setRouteName] = useState('');

//   useEffect(() => {
//     setRouteName(getFocusedRouteNameFromRoute(state.routes[state.index]));
//   }, [state, navigation]);

//   if (routeName == 'GroupThread') {
//     return null;
//   }

//   return (
//     <View style={localStyles.navContainer}>
//       <View style={localStyles.tabContianer}>
//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const label =
//             options.tabBarLabel !== undefined
//               ? options.tabBarLabel
//               : options.title !== undefined
//               ? options.title
//               : route.name;

//           const icon = options.tabBarIcon;

//           const isFocused = state.index === index;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: 'tabPress',
//               target: route.key,
//               canPreventDefault: true,
//             });

//             if (!isFocused && !event.defaultPrevented) {
//               // The `merge: true` option makes sure that the params inside the tab screen are preserved
//               navigation.navigate({ name: route.name, merge: true });
//             }
//           };

//           const onLongPress = () => {
//             navigation.emit({
//               type: 'tabLongPress',
//               target: route.key,
//             });
//           };

//           return (
//             <Pressable
//               accessibilityRole="button"
//               accessibilityState={isFocused ? { selected: true } : {}}
//               accessibilityLabel={options.tabBarAccessibilityLabel}
//               testID={options.tabBarTestID}
//               onPress={onPress}
//               onLongPress={onLongPress}
//               style={{
//                 flex: 1,
//                 marginLeft: index == 0 ? 0 : 10,
//                 marginRight: index == 2 ? 0 : 10,
//               }}
//               key={index}
//             >
//               {isFocused ? (
//                 <LinearGradient
//                   useAngle={true}
//                   angle={90.72}
//                   colors={Colors.mainGradient}
//                   style={{
//                     alignItems: 'center',
//                     padding: 5,
//                     borderRadius: 20,
//                   }}
//                 >
//                   {icon(true)}
//                 </LinearGradient>
//               ) : (
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     padding: 5,
//                   }}
//                 >
//                   {icon(false)}
//                 </View>
//               )}
//             </Pressable>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default CustomTabBar;

// const localStyles = StyleSheet.create({
//   navContainer: {
//     position: 'absolute',
//     height: 80,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     bottom: 0,
//     left: '0%',
//     width: '100%',
//     backgroundColor: '#1F1D27',
//   },
//   tabContianer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     padding: 5,
//     borderRadius: 30,
//     backgroundColor: '#1A1822',
//     borderWidth: 0.25,
//     borderColor: '#313132',
//   },
//   activeTab: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 5,
//     backgroundColor: 'red',
//     marginHorizontal: 20,
//     borderRadius: 20,
//   },
//   inactiveTab: {
//     flex: 1,
//     padding: 5,
//     marginHorizontal: 20,
//     alignItems: 'center',
//   },
// });
