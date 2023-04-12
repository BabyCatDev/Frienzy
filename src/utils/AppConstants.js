import { Platform, StatusBar } from "react-native";
import StaticSafeAreaInsets from "react-native-static-safe-area-insets";

export const Colors = {
  primary: {
    1000: "#0B56D5",
    900: "#0D63F3",
    800: "#2B77F5",
    700: "#4A8AF6",
    600: "#689EF8",
    500: "#86B1F9",
    400: "#A4C5FB",
    300: "#C3D8FC",
    200: "#E1ECFE",
    100: "#F9FAFE",
  },
  grayscale: {
    1000: "#16172E",
    900: "#1D3145",
    800: "#2C4A67",
    700: "#3B6289",
    600: "#4A7BAC",
    500: "#6893BE",
    400: "#8AACCD",
    300: "#ACC4DC",
    200: "#CFDDEA",
    100: "#F1F5F9",
    0: "#FFFFFF",
  },
  additional: {
    red: {
      100: "#D50B24",
      70: "#F54157",
      20: "#FCC9CF",
    },
    green: {
      100: "#0BD58A",
      70: "#92F9D3",
      20: "#C9FCE9",
    },
    orange: {
      100: "#F5BE51",
      70: "#F9D897",
      20: "#FDF2DC",
    },
  },
};

export const Sizes = {
  small: 8,
  normal: 10,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 47,

  fonts: {
    h1: 20,
    h2: 16,
    h3: 14,
  },

  safeAreaInsetsTop: StaticSafeAreaInsets.safeAreaInsetsTop,
  safeAreaInsetsBottom: StaticSafeAreaInsets.safeAreaInsetsBottom,
  safeAreaInsetsLeft: StaticSafeAreaInsets.safeAreaInsetsLeft,
  safeAreaInsetsRight: StaticSafeAreaInsets.safeAreaInsetsRight,

  header: {
    height: Platform.select({
      ios: 56 + StaticSafeAreaInsets.safeAreaInsetsTop,
      android: 56,
    }),
  },
  tabs: {
    height: Platform.select({
      ios: 50 + StaticSafeAreaInsets.safeAreaInsetsBottom,
      android: 56,
    }),
  },
};

export const ScreenNames = {
  SplashStack: {
    SPLASH: "Splash",
  },
  AuthStack: {
    SIGN_UP: "SignUp",
    SIGN_IN: "SignIn",
    FORGOT_PASS: "ForgotPass",
    ONBOARDING: "Onboarding",
  },
  MainStack: {
    BOTTOM_TABS: "BottomTabs",
    SEARCH: "Search",
    NOTIFICATIONS: "Notifications",
    CREATE_ORDER: "CreateOrder",
    ADD_TO_SHOWCASE: "AddToShowcase",
    MOVING_FLOW: "MovingFlow",
    PIN_CODE: "PinCode",
    SUPPLY_ORDER: "SupplyOrder",
    AddProductSupply: "AddProductSupply",
    PRODUCT_COMPOSITION: "ProductComposition",
  },
  SupplyStack: {
    All_PRODUCTS: "AllProducts",
    CHOUSEN_PRODUCTS: "ChousenProducts",
    ADD_SUPPLY: "AddSupply",
  },
  ProfileStack: {
    PROFILE: "Profile",
  },
  ProductComposStack: {
    VIEW_COMPOSITION: "ViewComposition",
    SET_COMPOSITION: "SetComposition",
  },
  SetCompositionTopTabs: {
    ALL: "AllInComposition",
    SELECTED: "SelectedInComposition",
  },

  CreateWriteOffStack: {
    WRITE_OFF_NAV: "WriteOffNav",
    WRITE_OFF_SCREEN: "WriteOffScreen",
    All_WRITES_OFF: "AllWritesOff",
    SELECTED_WRITES_OFF: "SelectedWritesOff",
    CREATE_WRITE_OFF: "CreateWriteOff",
    ALL_WRITES_OFF: "AllWritesOff",
    SELECTED_WRITES_OFF: "SelectedWritesOff",
  },

  CreateOrderStack: {
    SELECT_PRODUCTS: "SelectProducts",
    ORDERING: "Ordering",
  },
  CreateMovingStack: {
    CREATE_MOVING: "CreateMoving",
    ADD_MOVING: "AddMovingProduct",
    ALL: "AllMovingProducts",
    SELECTED: "SelectedMovingProduct",
  },

  AddToShowcaseStack: {
    SELECT_COMPONENTS: "SelectComponents",
    VIEW_PRODUCT: "ViewProduct",
  },
  SelectComponentsTopTabs: {
    ALL: "AllComponents",
    SELECTED: "Selected",
  },
  SelectProductsTopTabs: {
    ALL: "AllProducts",
    SELECTED: "SelectedProducts",
  },
  EditProductTopTabs: {
    COMMON: "CommonEdit",
    PRODUCTS: "ProductsEdit",
  },
  ViewProductsTopTabs: {
    COMMON: "CommonView",
    PRODUCTS: "ProductsView",
  },
  ProductsStack: {
    PRODUCTS: "Products",
    VIEW_PRODUCT: "ViewProduct",
  },
  StockTopTabs: {
    STOCK: "Stock",
    SUPPLIES: "Supplies",
    VIEW_SUPPLIES: "ViewSupplies",
    VIEW_WRITESOFF: "ViewWritesOff",
    VIEW_MOVEMENT: "ViewMovement",
    WRITE_OFF: "WriteOff",
    MOVEMENTS: "Movements",
  },
  OrdersStack: {
    ORDERS: "Orders",
    VIEW_ORDERS: "ViewOrders",
  },
  EditOrdersTopTabs: {
    COMMON: "OrdersView",
    WORK_AREA: "OrdersEdit",
  },
  HomeStack: {},
};

export const TabNames = {
  ORDERS: "OrdersTab",
  PRODUCTS: "ProductsTab",
  STOCK: "StockTab",
  PROFILE: "ProfileTab",
  ACTION: "ActionTab",
};
