import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { conversationListener } from "../services/firebase/conversations";
import { setConversations } from "../redux/actions/data/Conversations";

export const useConversations = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.FrienzyAuth.userDetails)

  const handleConversationChange = useCallback(
      (change) => {
          dispatch(setConversations(change.docs.map(item => ({ ...item.data() }))))
      },
      [dispatch],
  )

  useEffect(() => {
    let listenerInstance;
    if (userDetails != null && userDetails.groups.length > 0) {
      listenerInstance = conversationListener(handleConversationChange, userDetails.groups)
    }

    return () => {
      listenerInstance && listenerInstance()
    }

  }, [handleConversationChange, userDetails])
}
