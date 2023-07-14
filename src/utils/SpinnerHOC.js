import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';

export const SpinnerHOC = (WrappedComponent) => {
  return class extends Component {
    render() {
      const { loading, ...props } = this.props;
      if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        );
      } else {
        return <WrappedComponent {...props} />;
      }
    }
  };
};
