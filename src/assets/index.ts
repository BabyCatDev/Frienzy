import AlertTriangle from "@lavanda/assets/svgs/alert-triangle.svg";
import ArrowDown from "@lavanda/assets/svgs/arrow-down.svg";
import BellNew from "@lavanda/assets/svgs/bell-new.svg";
import Bell from "@lavanda/assets/svgs/bell.svg";
import Calendar from "@lavanda/assets/svgs/calendar.svg";
import Camera from "@lavanda/assets/svgs/camera.svg";
import Check from "@lavanda/assets/svgs/check.svg";
import ChevronLeft from "@lavanda/assets/svgs/chevron-left.svg";
import ChevronRight from "@lavanda/assets/svgs/chevron-right.svg";
import Close from "@lavanda/assets/svgs/close.svg";
import Down from "@lavanda/assets/svgs/down.svg";
import DownArrow from "@lavanda/assets/svgs/downArrow";
import Grid from "@lavanda/assets/svgs/grid.svg";
import Home from "@lavanda/assets/svgs/home.svg";
import LeftBig from "@lavanda/assets/svgs/left-big.svg";
import Plus from "@lavanda/assets/svgs/plus.svg";
import ShoppingCart from "@lavanda/assets/svgs/shopping-cart.svg";
import SignOut from "@lavanda/assets/svgs/SignOut.svg";
import Store from "@lavanda/assets/svgs/store.svg";
import User from "@lavanda/assets/svgs/user.svg";
import SocialNav from "@lavanda/assets/svgs/social-nav.svg";
import Logo from "@lavanda/assets/svgs/logo.svg"
import ArrowBack from "@lavanda/assets/svgs/arrow-back.svg"
import PencilButton from "@lavanda/assets/svgs/pencil-button.svg"
import PickerArrow from "@lavanda/assets/svgs/picker-arrow.svg"
import UserPosition from "@lavanda/assets/svgs/user-position.svg"
import EmrgButton from "@lavanda/assets/svgs/emrg-button.svg"
import AddUser from "@lavanda/assets/svgs/add-user.svg"
import UserProfile from "@lavanda/assets/svgs/user-profile.svg"
import ContactList from "@lavanda/assets/svgs/contact-list.svg"
import SearchIcon from "@lavanda/assets/svgs/search-icon.svg"
import CheckSign from "@lavanda/assets/svgs/check-sign.svg"
import AddContact from "@lavanda/assets/svgs/add-contact.svg"
import WhiteBell from "@lavanda/assets/svgs/white-bell.svg"
import QrCode from "@lavanda/assets/svgs/qr-code.svg"
import RoundCorner from "@lavanda/assets/svgs/round-corner.svg"
import XClose from "@lavanda/assets/svgs/x-close.svg"
import EmrgDisabled from "@lavanda/assets/svgs/emrg-disabled.svg"

export default class Assets {
  static getVector(path: any) {
    return {
      type: "vector",
      path: path,
    };
  }

  static getBitmap(path: any) {
    return {
      type: "bitmap",
      path: path,
    };
  
  }
  static emrgDisabled = Assets.getVector(EmrgDisabled);
  static xClose = Assets.getVector(XClose);
  static roundCorner = Assets.getVector(RoundCorner);
  static qrCode = Assets.getVector(QrCode);
  static whiteBell = Assets.getVector(WhiteBell);
  static addContact = Assets.getVector(AddContact);
  static checkSign = Assets.getVector(CheckSign);
  static searchIcon = Assets.getVector(SearchIcon);
  static contactList = Assets.getVector(ContactList);
  static userProfile = Assets.getVector(UserProfile);
  static addUser = Assets.getVector(AddUser);
  static emrgButton = Assets.getVector(EmrgButton);
  static userPosition = Assets.getVector(UserPosition);
  static pickerArrow = Assets.getVector(PickerArrow);
  static pencilButton = Assets.getVector(PencilButton);
  static arrowBack = Assets.getVector(ArrowBack);
  static logo = Assets.getVector(Logo);
  static socialNav = Assets.getVector(SocialNav);
  static alertTriangle = Assets.getVector(AlertTriangle);
  static arrowDown = Assets.getVector(ArrowDown);
  static bellNew = Assets.getVector(BellNew);
  static bell = Assets.getVector(Bell);
  static calendar = Assets.getVector(Calendar);
  static camera = Assets.getVector(Camera);
  static check = Assets.getVector(Check);
  static chevronLeft = Assets.getVector(ChevronLeft);
  static chevronRight = Assets.getVector(ChevronRight);
  static close = Assets.getVector(Close);
  static down = Assets.getVector(Down);
  static downArrow = Assets.getVector(DownArrow);
  static grid = Assets.getVector(Grid);
  static home = Assets.getVector(Home);
  static leftBig = Assets.getVector(LeftBig);
  static plus = Assets.getVector(Plus);
  static shoppingCart = Assets.getVector(ShoppingCart);
  static signOut = Assets.getVector(SignOut);
  static store = Assets.getVector(Store);
  static user = Assets.getVector(User);

  static userPoint = Assets.getBitmap(require("../../assets/imgs/user.png"));
  static userMarker = Assets.getBitmap(require("../../assets/imgs/userMarker.png"));
  static emrgUserMarker = Assets.getBitmap(require("../../assets/imgs/emrgUserMarker.png"));
  static splash = Assets.getBitmap(require("../../assets/imgs/splash.png"));

}
