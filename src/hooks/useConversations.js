import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { conversationListener } from "../services/firebase/conversations";
import { setConversations } from "../redux/actions/data/Conversations";

export const useConversations = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.FrienzyAuth.userDetails)

  const handleConversationChange = useCallback(
      (change) => {
        console.log("Im Here", change)
          dispatch(setConversations(change ? change.docs.map(item => ({ ...item.data() })) : []))
      },
      [dispatch],
  )

  useEffect(() => {
    let listenerInstance;
    if (userDetails != null) {
      listenerInstance = conversationListener(handleConversationChange, userDetails.uid)
    }

    return () => {
      listenerInstance && listenerInstance()
    }

  }, [handleConversationChange, userDetails])
}
