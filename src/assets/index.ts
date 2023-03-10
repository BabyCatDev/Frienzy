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

 

  static splash = Assets.getBitmap(require("../../assets/imgs/splash.png"));

}
