import React, { useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View,ScrollView,fieldset} from 'react-native';
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
import CalendarPicker from 'react-native-calendar-picker';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const Stack = createNativeStackNavigator();
const url = 'http://192.168.1.74:8080/book';
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
        <Stack.Screen
          name="bookingsScreen"
          component={BookingsScreen}
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
        navigation.navigate('adminManage');
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
  const [selectedService, setSelectedService] = useState('AnnualService');
  const [name, onChangeName] = useState('');
  const [phone, onChangePhone] = useState('');
  const [email, onChangeEmail] = useState('');
  const [comments, onChangeComments] = useState('');
  const [plate, onChangePlate] = useState('');
  const [vehFuel, setVehFuel] = useState('');
  const [vehType, setVehType] = useState('');
  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]);
  const today = new Date();
  const usertest='4';
  useEffect(async()=>{
    let user = await getUserInfo();
    onChangeName(user.name);
    onChangePhone(user.phone);
    onChangeEmail(user.email);
    setUnavailableDates(await getUnavailableDates(selectedService));
  },[]);

  const [date, setDate] = useState(new Date());
  // const [mode, setMode] = useState('date');
  // const [show, setShow] = useState(false);
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const minDate = new Date();//calendar dates

  
  const postBooking = async() => {
    
    const stringDate = date.toISOString().substring(0,10);
    console.log(stringDate);
    const bookingJson = {
      serviceType:selectedService,
      name:name,
      phone:phone,
      email:email,
      date:stringDate,
      vehType:vehType,
      vehMake:vehMake,
      vehModel:vehModel,
      vehFuel:vehFuel,
      plate: plate,
      comments:comments
    }
    var response = false;
    await axios.post(url+'/savebooking',bookingJson,config)
    .then(res => {
      response = res.data;
    })
    .catch(err => err); 
    if(response){
      alert("booked");
    } else {
      alert("Sorry, no slots available on the date selected")
    }
    console.log(response);
  }

  const getUserInfo = async() => {
    var response;
    await axios.get(url+'/getpastdetails/'+usertest)
    .then(res=>{
      response = res.data;
    })
    .catch(error => console.error(`Error: ${error}`));
    return response;
  }

  const getUnavailableDates = async(service) => {
    var response;
    await axios.get(url+'/getUnavailableDates/'+service)
    .then(res=>{
      response = res.data;
    })
    .catch(error => console.error(`Error: ${error}`));
    return response;
  }

  //const [selectedDate, setDate] = useState(new Date());
  return (
    
    <ScrollView >
      <Text> Service Type: </Text>
      <Picker
        selectedValue={selectedService}
        style={{ height: 50, width: '70%' , marginTop: 20}}
        onValueChange={async(itemValue, itemIndex) =>{
          setSelectedService(itemValue);
          setUnavailableDates(await getUnavailableDates(itemValue));
          console.log(unavailableDates);
        }
          
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
      value={name}
      />
      <Input
      placeholder = "Phone Number"
      type = 'number'
      containerStyle = {inputStyle}
      onChangeText = {onChangePhone}
      value={phone}
      />
      <Input
      placeholder = "Email"
      containerStyle = {inputStyle}
      onChangeText = {onChangeEmail}
      value={email}
      />
      
      
      <View>
        <CalendarPicker
          onDateChange={setDate}
          disabledDates={unavailableDates}
          minDate={today}
        />
        {/* <Button onPress={showDatepicker} title={"Select date:  " + date.getDate() + " / " + date.getMonth() + " / " + date.getFullYear()} /> */}
      </View>
      {/* <View>
        <Button onPress={showTimepicker} title={"Show time picker!"} />
      </View> */}
      {/* {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          minimumDate={new Date(2022, 1, 13)}
          onChange={onChange}
        />
        )} */}
      
      <Picker
        selectedValue={vehType}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setVehType(itemValue)
        }>
        <Picker.Item label="Minibus" value="Minibus" />
        <Picker.Item label="Van" value="Van" />
        <Picker.Item label="Car" value="Car" />
        <Picker.Item label="Motorcycle" value="Motorcycle" />
      </Picker>
      {/* car api to generate values here: https://github.com/Savage3D/car-makes-models-data */}
      <Picker
        selectedValue={vehMake}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setVehMake(itemValue)
        }>
        <Picker.Item label="Volvo" value="Volvo" />
        <Picker.Item label="VW" value="Volkswagen" />
        <Picker.Item label="BMW" value="BMW" />
      </Picker>
      <Picker
        selectedValue={vehModel}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setVehModel(itemValue)
        }>
        <Picker.Item label="Pointer" value="Pointer" />
        <Picker.Item label="Figo" value="Figo" />
        <Picker.Item label="Escape" value="Escape" />
        <Picker.Item label="Ka" value="Ka" />
      </Picker>
      <Picker
        selectedValue={vehFuel}
        style={{ height: 50, width: '70%' }}
        onValueChange={(itemValue, itemIndex) =>
          setVehFuel(itemValue)
        }>
        <Picker.Item label="Diesel" value="Diesel" />
        <Picker.Item label="Petrol" value="Petrol" />
        <Picker.Item label="Hybrid" value="Hybrid" />
        <Picker.Item label="Electric" value="Electric" />
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
        navigation.navigate('customer');
      }
      }
      />
    </ScrollView>
    
  )
}

const CustomerHistory = ({navigation}) => {
  const[bookings,getBookings] = useState([]);
  useEffect(() => {
    getUserBookings();
  },[]);

  const getUserBookings = async() => {
    await axios.get(url+'/getbookings/abc')
    .then(res=>{
      const allBookings = res.data.map(function(booking){
        return booking;
      });
      getBookings(allBookings)
    })
    .catch(error => console.error(`Error: ${error}`));
    return
      bookings;
    
  }

  return(
    
    <View> 
      <View>
        <View>
          <View><Text> BOOKINGS </Text></View>
        </View>
        <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
          <View><Text> ID </Text></View>
          <View><Text> Plate </Text></View>
          <View><Text> Date </Text></View>
          <View><Text> Status </Text></View>
        </View>

        {
          bookings.map(
            (booking) => (
              <View key={booking.serviceid} style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <View><Text>{booking.serviceID}</Text></View>
                <View><Text>{booking.carID}</Text></View>
                <View><Text>{booking.date}</Text></View>
                <View><Text>{booking.status}</Text></View>
              </View>
            )
          )
        }



        <View>

        </View>
      </View>
    </View>
  );
  
}

const AdminManage = ({navigation}) => {
  const [timeframe, setTimeframe] = useState('perDay');
  const [date, setDate] = useState(new Date());
  
  
  const [unavailableDates,setUnavailableDates] = useState([]);

  const disableWeekly = (value) => {
    var i=0;
    var j=0;
    var dateTemp = (new Date())
    dateTemp.setFullYear(2022);
    dateTemp.setMonth(0);
    dateTemp.setDate(2)
    const tempDates = [];
    if(value=='perDay'){
      setUnavailableDates([]);
    } else {
      for(i=0;i<=52;i++){
        for(j = 2; j<=7;j++){
          tempDates.push(dateTemp.setDate(dateTemp.getDate()+1));
        }
        dateTemp.setDate(dateTemp.getDate()+1)
      }
      setUnavailableDates(tempDates);
    }
  }

  return(
    <ScrollView> 
      
      <View>
        <RadioButtonGroup selected={timeframe} onSelected={(value) => {setTimeframe(value);disableWeekly(value)}} radioBackground='green'>
          <RadioButtonItem value='perDay' label='per Day'/>
          <RadioButtonItem value='perWeek' label='per Week'/>
        </RadioButtonGroup>
      </View>

      <View>
        <CalendarPicker
          onDateChange={setDate}
          disabledDates={unavailableDates}
        />
      </View>
      <Button
      title = "See/Manage Bookings"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('bookingsScreen',{passedDate: date.toISOString().substring(0,10),timeframe: timeframe});
      }
      }
      />
      <Button
      title = "Get Schedule"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('manageBooking');
      }
      }
      />
    </ScrollView>
  );

}

const BookingsScreen = ({route, navigation}) => {
  const date = new Date(route.params.passedDate);
  const stringDate = date.toISOString().substring(0,10);
  const timeframe = route.params.timeframe;
  const[bookings,getBookings] = useState([]);
  var tempDate2 = '';
  var tempDate = new Date();
  var bookingsTemp = [];
  var bookingNum = 0;
  useEffect(() => {
    var i = 0;
    if(timeframe=='perDay'){
      getBookingsByDate(stringDate);
      bookingsTemp = bookings;
    } else if(timeframe=='perWeek'){
      getBookingsByWeek(stringDate);
    }
  },[]);

  const getBookingsByDate = async(date) => {
    await axios.get(url+'/bookingsDay/'+date)
    .then(res=>{
      const allBookings = res.data.map(function(booking){
        return booking;
      });
      getBookings(allBookings)
    })
    .catch(error => console.error(`Error: ${error}`));
  }

  const getBookingsByWeek = async(date) => {
    await axios.get(url+'/bookingsWeek/'+date)
    .then(res=>{
      const allBookings = res.data.map(function(booking){
        return booking;
      });
      getBookings(allBookings)
    })
    .catch(error => console.error(`Error: ${error}`));
  }


  return(
    
    <ScrollView> 
      <View>
        <View>
          <View><Text> BOOKINGS ON DATE </Text></View>
        </View>
        <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
          <View><Text> ID </Text></View>
          <View><Text> Plate </Text></View>
          <View><Text> Date </Text></View>
          <View><Text> Status </Text></View>
        </View>

        {
          bookings.map(
            (booking) => {
              return(
              <View key={booking.serviceid} style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <View><Text style={{color: 'blue'}}
                            onPress={() => navigation.navigate('manageBooking',{bookingID: booking.serviceID})}>{booking.serviceID}</Text></View>
                <View><Text>{booking.carID}</Text></View>
                <View><Text>{booking.date}</Text></View>
                <View><Text>{booking.status}</Text></View>
                <View><Text>{booking.mechanicID}</Text></View>
              </View>
            )}
          )
        }
        <View>

        </View>
      </View>
    </ScrollView>
  );
}

const ManageBooking = ({route, navigation}) => {
  const [mechanic, setMechanic] = useState('0');
  const [status, setStatus] = useState('0');
  const [fixedCost, setFixedCost] = useState(0.0);
  const bookingID = route.params.bookingID;
  console.log(bookingID);

  useEffect(async()=>{
    let booking = await getBookingInfo(bookingID);
    setMechanic(booking.mechanicID.toString());
    setStatus(booking.status);
  },[]);

  const getBookingInfo = async(booking) => {
    var response;
    await axios.get(url+'/getbookingadmin/'+booking)
    .then(res=>{
      response = res.data;
    })
    .catch(error => console.error(`Error: ${error}`));
    return response;
  }

  return(
    <View style={styles.container}>
      <Text> Mechanic: </Text>
      <Picker
        selectedValue={mechanic}
        style={{ height: 50, width: '70%' , marginTop: 20}}
        onValueChange={(itemValue, itemIndex) =>
          setMechanic(itemValue)
        }>
        <Picker.Item label="Mechanic 1" value="1" />
        <Picker.Item label="Mechanic 2" value="2" />
        <Picker.Item label="Mechanic 3" value="3" />
        <Picker.Item label="Mechanic 4" value="4" />
      </Picker>
      <Text> Fixed Cost: </Text>
      {/* possibly cost disabled with the fixed cost */}
      <Input
      placeholder = ""
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
        <Picker.Item label="Booked" value="booked" />
        <Picker.Item label="In Service" value="inservice" />
        <Picker.Item label="Fixed/Completed" value="complete" />
        <Picker.Item label="Collected" value="collected" />
        <Picker.Item label="Scrapped/Unrepairable" value="scrapped" />
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
