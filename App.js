
import React, { Component } from "react";
import { View } from "react-native";
import ScheduleReminder from './src/scheduleReminder'

class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScheduleReminder />
      </View>
    );
  }
}

export default App;
