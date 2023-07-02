import { useEffect, useState } from 'react';
import { groupListener } from '../services/firebase/conversations';

export const useGroup = (groupId) => {
  const [groupInfo, setGroupInfo] = useState(null);

  useEffect(() => {
    let listenerInstance;
    if (groupId != null) {
      listenerInstance = groupListener((groupData) => {
        setGroupInfo(groupData);
      }, groupId);
    }

    return () => {
      listenerInstance && listenerInstance();
    };
  }, [groupId]);

  return {
    groupInfo
  };
};
