import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, View, } from 'react-native';
import { ListItem, Input, Button, Overlay } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { fcmService } from './FCMService'

class ScheduleReminder extends Component {
  state = {
    isDateTimePickerVisible: false,
    notificationTime: moment(),
    notificationTitle: '',
    notificationDescription: '',
    isVisibleOverlay: false,
    notifyData: {}
  };

  componentDidMount() {
    fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  }

  onRegister = (token) => {
    console.log("[Notification fcm ] onRegister:", token)
  }

  onNotification = (notify) => {
    console.log("[Notification fcm ] : onNotification:", notify)
    const notification = fcmService.buildNotification(this.createNotification(notify))
    fcmService.displayNotification(notification)
  }

  onOpenNotification = (notify) => {
    console.log("[Notification fcm ] : onOpenNotification ", notify)
    this.setState({ notifyData: notify._data }, () => this.setState({ isVisibleOverlay: true }))
  }

  setReminder = () => {
    const { notificationTime } = this.state;
    const { notificationDescription, notificationTitle } = this.state
    let body = {
      _title: notificationTitle,
      _body: notificationDescription,
      _data: {
        title: notificationTitle,
        body: notificationDescription,
      },
      _notificationId: Math.random().toString(),
      time: notificationTime
    }
    this.scheduleReminder(body)
  };

  scheduleReminder = (notifyDetails) => {
    const notification = fcmService.buildNotification(this.createNotification(notifyDetails))
    fcmService.scheduleNotification(notification, notifyDetails.time)
    this.resetState()
  }

  closeOverLay = () => {
    this.setState({ isVisibleOverlay: false })
  }

  createNotification = (notify) => {
    const channelObj = {
      channelId: "SmapleChannelID",
      channelName: "SmapleChannelName",
      channelDes: "SmapleChannelDes"
    }
    const channel = fcmService.buildChannel(channelObj)
    const buildNotify = {
      title: notify._title,
      content: notify._body,
      sound: 'default',
      channel: channel,
      data: notify._data,
      colorBgIcon: "#1A243B",
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
      vibrate: true,
      dataId: notify._notificationId
    }
    return buildNotify
  }

  resetState = () => {
    this.setState({
      notificationTime: moment(),
      notificationTitle: '',
      notificationDescription: ''
    })
  }

  displayDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  closeDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handlePicked = date => {
    this.closeDateTimePicker();
    this.setState({
      notificationTime: moment(date),
    });
  };

  handleValueChange = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    const { isDateTimePickerVisible,
      notificationTime, notificationTitle,
      notificationDescription, notifyData } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.cardTitleView}>
          <Text style={styles.cardTitle}>Add Reminder</Text>
        </View>
        <ListItem
          title="Time"
          titleStyle={styles.titleStyle}
          onPress={this.displayDateTimePicker}
          rightElement={<Text style={{ opacity: 0.7 }}>{moment(notificationTime).format('LT')}</Text>}
        />
        <View style={styles.titleView}>
          <Input
            style={styles.titleinput}
            value={notificationTitle}
            onChangeText={(text) => this.handleValueChange(text, 'notificationTitle')}
            placeholder="Title"
          />
          <Input
            multiline={true}
            numberOfLines={3}
            style={styles.titleinput}
            value={notificationDescription}
            onChangeText={(text) => this.handleValueChange(text, 'notificationDescription')}
            placeholder="Description"
          />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Button
            title="Add reminder"
            buttonStyle={{ width: 200, height: 40 }}
            onPress={() => this.setReminder()}
          />
        </View>
        <Overlay
          style={{ flex: 1 }}
          isVisible={this.state.isVisibleOverlay}
          onBackdropPress={() => this.closeOverLay()}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ margin: 20, fontSize: 20, fontWeight: '600' }}>{notifyData && notifyData.title}</Text>
            <Text style={{ margin: 20, fontSize: 16 }}>{notifyData && notifyData.body}</Text>
          </View>
        </Overlay>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handlePicked}
          onCancel={this.closeDateTimePicker}
          mode="datetime"
          is24Hour={false}
          date={new Date(notificationTime)}
          titleIOS="Pick your Notification time"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF0',
  },
  cardTitleView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#585858',
    fontWeight: '600',
  },
  titleStyle: {
    fontSize: 20,
    color: '#585858',
  },
  subtitleStyle: {
    fontSize: 16,
    color: '#585858',
  },
  titleView: {
    margin: 20,
    backgroundColor: '#EEEFF0',
  },
  titleinput: {
    fontSize: 20,
    fontWeight: '600',
    margin: 5,
    backgroundColor: "#fff"
  }
});
export default ScheduleReminder