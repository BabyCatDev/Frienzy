import { useSelector } from "react-redux";

export const useFriends = (friends, options={}) => {
  const allUsers = useSelector((state) => state.FrienzyData.allUsers);
  if (!allUsers)
    return { isLoading: true };
  const data =  allUsers ? allUsers.filter((user) => friends.includes(user.uid)) : [];
  return {
    isLoading: false,
    data
  };
}
