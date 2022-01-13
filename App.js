import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View,ScrollView} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text,Input, Button, Overlay} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from "react-datepicker";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import axios from "axios";
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


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
        <Stack.Screen
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
        />
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
        navigation.navigate('customerBook');
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
  const [email, onChangeEmail] = useState('');
  const [comments, onChangeComments] = useState('');
  const [plate, onChangePlate] = useState('');
  const [selectedType, setSelectedType] = useState('0');
  const [selectedVehType, setSelectedVehType] = useState('0');
  const [selectedVehMake, setSelectedVehMake] = useState('0');

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const bookingJson = {
    serviceType:"Repair",
    name:"test3",
    phone:"55555666",
    email:"a@a.com",
    date:"11/1/2022",
    vehType:"minivan",
    vehMake:"volvo",
    vehFuel:"gas",
    plate: "123456789",
    comments:"commentarios"
}
  const postBooking = async() => {
    var response = false;
    await axios.post('http://192.168.1.74:8080/book/savebooking',bookingJson,config)
    .then(res => {
      response = res.data;
    })
    .catch(err => err); 
    if(response===true){
      alert("good");
    } else {
      alert("sorry");
    }
  }

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
    <ScrollView >
      <Text> Service Type: </Text>
      <Picker
        selectedValue={selectedService}
        style={{ height: 50, width: '70%' , marginTop: 20}}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedService(itemValue)
        }>
        <Picker.Item label="Annual Service" value="AnnualService" />
        <Picker.Item label="Major Service" value="MajorService" />
        <Picker.Item label="Repair" value="Repair" />
        <Picker.Item label="Major Repair" value="MajorRepair" />
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
      <Input
      placeholder = "Email"
      containerStyle = {inputStyle}
      onChangeText = {onChangeEmail}
      />
      
      
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
      
      <Picker
        selectedValue={selectedVehType}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedVehType(itemValue)
        }>
        <Picker.Item label="Minibus" value="Minibus" />
        <Picker.Item label="Van" value="Van" />
        <Picker.Item label="Car" value="Car" />
        <Picker.Item label="Motorcycle" value="Motorcycle" />
      </Picker>
      {/* car api to generate values here: https://github.com/Savage3D/car-makes-models-data */}
      <Picker
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
      <Input
      placeholder = "Comments"
      containerStyle = {inputStyle}
      onChangeText = {onChangeComments}
      />
      <Button
      title = "Book"
      buttonStyle={buttonStyle}
      onPress = {() => {
        postBooking();
        navigation.navigate('customerHistory');
      }
      }
      />
    </ScrollView>
    
  )
}

const CustomerHistory = ({navigation}) => {
  return(
    // one per booking
    <View> 
      <Text>
        Type: Date: etc.
      </Text>
    </View>
  );
  
}

const AdminManage = ({navigation}) => {
  const [timeframe, setTimeframe] = React.useState('perday');
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

  return(
    <View> 
      <RadioButton.Group onValueChange={newValue => setTimeframe(newValue)} value={timeframe}>
        <View style={{flexDirection: 'row'}}>
          <Text>Per Day</Text>
          <RadioButton value="perday" />
          <Text>Per Week</Text>
          <RadioButton value="perweek" />
        </View>
      </RadioButton.Group>

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
      <View style={{flexDirection: 'row'}}>
        <View><Text> ID </Text></View>
        <View><Text> Type </Text></View>
        <View><Text> Mechanic </Text></View>
      </View>
      <Button
      title = "Get Schedule"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('manageBooking');
      }
      }
      />
    </View>
  );

}

const ManageBooking = ({navigation}) => {
  const [mechanic, setMechanic] = useState('0');
  const [status, setStatus] = useState('0');
  return(
    <View style={styles.container}>
      <Text> Mechanic: </Text>
      <Picker
        selectedValue={mechanic}
        style={{ height: 50, width: '70%' , marginTop: 20}}
        onValueChange={(itemValue, itemIndex) =>
          setMechanic(itemValue)
        }>
        <Picker.Item label="Mechanic 1" value="m1" />
        <Picker.Item label="Mechanic 2" value="m2" />
        <Picker.Item label="Mechanic 3" value="m3" />
        <Picker.Item label="Mechanic 4" value="m4" />
      </Picker>
      <Text> Fixed Cost: </Text>
      {/* possibly cost disabled with the fixed cost */}
      <Input
      placeholder = "0"
      type = 'number'
      containerStyle = {inputStyle}
      // onChangeText = {onChangeCost}
      />
      <Button
      title = " + Add Part/Item "
      buttonStyle={buttonStyle}
      // onPress = {() => {
      //   navigation.navigate('customerHistory');
      // }
      // }
      />
      <Text> Status: </Text>
      <Picker
        selectedValue={status}
        style={{ height: 50, width: '70%'}}
        onValueChange={(itemValue, itemIndex) =>
          setStatus(itemValue)
        }>
        <Picker.Item label="Booked" value="m1" />
        <Picker.Item label="In Service" value="m2" />
        <Picker.Item label="Fixed/Completed" value="m3" />
        <Picker.Item label="Collected" value="m4" />
        <Picker.Item label="Scrapped/Unrepairable" value="m5" />
      </Picker>
      <Button
      title = "Generate Invoice"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('Login');
      }
      }
      />
    </View>
    
  )
}

const Invoice = ({navigation}) => {
  return(
    <View>
      <Text>
        Report here
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
