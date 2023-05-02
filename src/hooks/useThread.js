import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createConversation, threadListener, conversationListener } from '../services/conversations';

export const useThread = (threadId, contactId) => {
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.FrienzyAuth.userDetails);
   //const conversations = useSelector(state => state.FrienzyData.conversations);

    const [thread, setThread] = useState([])
    const handleThreadChange = useCallback(
        (change) => {
            setThread(change.docs.map(item => ({_id: item.id, id: item.id, ...item.data(), user: { _id: item.data().sentBy }})))
        },
        [dispatch],
    )

    useEffect(() => {
        let listenerInstance;
        // if (!convIdInst) {
        //     let conversation = conversations.find(item => item.members.some(member => member === contactId))
        //     if (!conversation) {
        //       console.log("Create")
        //         //createChat(contactId).then((res) => setChatIdInst(res.id))
        //     } else {
        //         setConvIdInst(conversation.id)
        //     }
        // }
        if (userDetails != null) {
            listenerInstance = threadListener(handleThreadChange, threadId)
        }

        return () => {
            listenerInstance && listenerInstance()
        }
    }, [handleThreadChange, userDetails])

    return { thread }
}