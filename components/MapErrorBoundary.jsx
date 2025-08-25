import React from "react";
import { Text, View } from "react-native";

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Map failed to load</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
