import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text,Input, Button, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from "react-datepicker";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const Stack = createNativeStackNavigator();
const headerStyle = {
  justifyContent: 'center',
  headerStyle: {
    backgroundColor: '#736e80',
    
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  },
}
const buttonStyle = {backgroundColor:'#736e80' ,margin:10 };
const inputStyle = {width:'70%',textAlign:'center'};

export default function App() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options = {headerStyle}
        />
        <Stack.Screen
          name="customer"
          component={Customer}
          options = {headerStyle}
        />
        <Stack.Screen
          name="customerBook"
          component={CustomerBook}
          options = {headerStyle}
        />
        {/*<Stack.Screen
          name="customerHistory"
          component={CustomerHistory}
          options = {headerStyle}
        />
        <Stack.Screen
          name="adminManage"
          component={AdminManage}
          options = {headerStyle}
        />
        <Stack.Screen
          name="manageBooking"
          component={ManageBooking}
          options = {headerStyle}
        />
        <Stack.Screen
          name="invoice"
          component={Invoice}
          options = {headerStyle}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const Login = ({navigation}) => {
  const [username, onChangeUsername] = React.useState("undefined");
  const [password, onChangePassword] = React.useState("undefined");

  return (
    <View style={styles.container}>
      <Text h2> Login </Text>
      <Input
        placeholder = "username"
        containerStyle = {inputStyle}
        onChangeText = {onChangeUsername}
        leftIcon ={
          <Icon
          name='user'
          size={24}
          color= 'gray'
          />
        }
      /> 
      <Input
      placeholder = "password"
      secureTextEntry={true}
      containerStyle = {inputStyle}
      onChangeText = {onChangePassword}
      leftIcon={
        <Icon
          name='key'
          size={24}
          color='gray'
        />
        }
      />
      <Button
      title = "Log In"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('customer');
      }
      }
    />
    </View>
  )
}

const Customer = ({navigation}) => {

  return (
    <View>
      <Button
      title = "Book Service"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('customerBook');
      }
      }
      />
      <Button
      title = "See Past Bookings"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('customerHistory');
      }
      }
      />
    </View>
  )
}

const CustomerBook = ({navigation}) => {
  const [selectedService, setSelectedService] = useState('0');
  const [name, onChangeName] = useState('');
  const [phone, onChangePhone] = useState('');
  const [plate, onChangePlate] = useState('');
  const [selectedType, setSelectedType] = useState('0');
  const [selectedVehType, setSelectedVehType] = useState('0');
  const [selectedVehMake, setSelectedVehMake] = useState('0');

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  //const [selectedDate, setDate] = useState(new Date());
  return (
    <View style={styles.container}>
      <Text> Service Type: </Text>
      <Picker
        selectedValue={selectedService}
        style={{ height: 50, width: '70%' , marginTop: 20}}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedService(itemValue)
        }>
        <Picker.Item label="Annual Service" value="annual service" />
        <Picker.Item label="Major Service" value="major service" />
        <Picker.Item label="Repair" value="repair" />
        <Picker.Item label="Major Repair" value="major repair" />
      </Picker>
      {/* <DatePicker selected={selectedDate} onChange={(date) => setDate(date)} /> */}
      
      <Input
      placeholder = "Name"
      containerStyle = {inputStyle}
      onChangeText = {onChangeName}
      />
      <Input
      placeholder = "Phone Number"
      type = 'number'
      containerStyle = {inputStyle}
      onChangeText = {onChangePhone}
      />
      <View>
      <View>
        <Button onPress={showDatepicker} title={"Select date:  " + date.getDate() + " / " + date.getMonth() + " / " + date.getFullYear()} />
      </View>
      {/* <View>
        <Button onPress={showTimepicker} title={"Show time picker!"} />
      </View> */}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
        )}
      </View>
      <Picker
        selectedValue={selectedVehType}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedVehType(itemValue)
        }>
        <Picker.Item label="Minibus" value="minibus" />
        <Picker.Item label="Van" value="van" />
        <Picker.Item label="Car" value="car" />
        <Picker.Item label="Motorcycle" value="motorcycle" />
      </Picker>
      <Picker //car api to generate values here: https://github.com/Savage3D/car-makes-models-data
        selectedValue={selectedVehMake}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedVehMake(itemValue)
        }>
        <Picker.Item label="Volvo" value="minibus" />
        <Picker.Item label="VW" value="van" />
        <Picker.Item label="etc" value="car" />
      </Picker>
      <Picker
        selectedValue={selectedType}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedType(itemValue)
        }>
        <Picker.Item label="Diesel" value="diesel" />
        <Picker.Item label="Petrol" value="petrol" />
        <Picker.Item label="Hybrid" value="hybrid" />
        <Picker.Item label="Electric" value="electric" />
      </Picker>
      
      <Input
      placeholder = "License Plate"
      containerStyle = {inputStyle}
      onChangeText = {onChangePlate}
      />
      <Button
      title = "Book"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('customerHistory');
      }
      }
      />
    </View>
    
  )
}

const CustomerHistory = ({navigation}) => {
  <View> //one per booking
    <Text>
      Type: Date: etc.
    </Text>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
