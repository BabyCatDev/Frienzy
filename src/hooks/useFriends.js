import { useQuery } from "react-query";
import { keys } from "./queryKeys";
import { getFriendsForUser } from "../services/firebase/user";

export const useFriends = (friends, options={}) => {
  return useQuery(keys.friends(friends), () => getFriendsForUser(friends), options);
}
