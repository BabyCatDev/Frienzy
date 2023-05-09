import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { groupListener, locationListener } from '../services/location/geolocation';
import { setGroupLocations, setLocation } from '../redux/actions/data/UserLocation';
import auth from '@react-native-firebase/auth';

export const useLocationForUser = (userId) => {
  const dispatch = useDispatch();

  const handleLocationChange = useCallback(
    (change) => {
      //console.log('In location change', change.docs[0].data());
      dispatch(setLocation(change.docs[0].data()));
      //dispatch(setLocation())
      //dispatch(setConversations(change.docs.map((item) => ({ ...item.data() }))));
    },
    [dispatch]
  );

  useEffect(() => {
    let listenerInstance;

    listenerInstance = locationListener(handleLocationChange, userId);

    return () => {
      listenerInstance && listenerInstance();
    };
  }, [handleLocationChange]);
};

export const useLocationForGroup = (groupId) => {
  const dispatch = useDispatch();

  const handleGroupLocationChange = useCallback(
    (change) => {
      const usersLocations = change.docs
        .filter((item) => item.id != auth().currentUser.uid)
        .map((item) => {
          const itemData = item.data();
          return {
            ...itemData.currentLocation,
            name: itemData.name,
            profilePic: itemData.profilePic,
          };
        });
      dispatch(setGroupLocations(usersLocations));
    },
    [dispatch]
  );

  useEffect(() => {
    let listenerInstance;

    listenerInstance = groupListener(handleGroupLocationChange, groupId);

    return () => {
      listenerInstance && listenerInstance();
    };
  }, [handleGroupLocationChange]);
};
