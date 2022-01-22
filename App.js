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
import JWT from 'expo-jwt';
import axios from "axios";
import CalendarPicker from 'react-native-calendar-picker'; //https://github.com/stephy/CalendarPicker
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';
const customTextProps = {
  style: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: 'black'
    
  }
};

setCustomText(customTextProps);
const Stack = createNativeStackNavigator();
const url = 'http://192.168.0.10:8080/book';
const key = "gersgarage2022";
const tableStyle = {borderCollapse: 'collapse',
fontSize: '1em',
fontFamily: 'sans-serif',
boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
justifyContent:'space-evenly'};
const tableHeaderStyle = {backgroundColor:'lightgray',fontSize:'1.2em',flexDirection: "row",justifyContent:'space-evenly'};
const headerStyle = {
  title: "Ger's Garage",
  justifyContent: 'center',
  headerStyle: {
    backgroundColor: '#736e80',
    
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  },
}
const buttonStyle = {backgroundColor:'#736e80' ,margin:20 };
const inputStyle = {width:'70%',textAlign:'center'};
const pickerStyle = {
  backgroundColor:'lightgray',
  height: 50,
  width: 250,
  marginTop: 20,
};

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
  const [visible, setVisible] = useState(false);  //sets visibility of the Overlay to show if wrong password/user
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const [username, onChangeUsername] = React.useState("undefined");
  const [password, onChangePassword] = React.useState("undefined");
  var token = "";
  const grantAccess = async () => { //GET request to see if user and password exist in SQL database
    const url = 'http://192.168.0.10:8080/book/users/' + token;
    const accessGranted = (await axios.get(`${url}`)).data;
    
    return(
      accessGranted
    )
  }

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
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text style={{color:'red'}}>Incorrect Username / Password</Text>
      </Overlay>
      <Button
      title = "Log In"
      buttonStyle={buttonStyle}
      onPress = {async () => {
          token= JWT.encode({user: username, password: password},key).toString(); //generates token for the specific user
          if((await grantAccess())==true){ //checks if the GET request was true for user password and navigates to next screen
            if(username=='ger'){
              navigation.navigate('adminManage');
            } else {
              navigation.navigate('customer',{user:username});
            }
          } else {
            toggleOverlay();
          }
          
        }
      }
    />
    </View>
  )
}

const Customer = ({route, navigation}) => {
  const username=route.params.user;

  return (
    <View><Text h2> Choose an option: </Text>
      <Button
      title = "Book Service"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('customerBook',{user:username});
      }
      }
      />
      <Button
      title = "See Past Bookings"
      buttonStyle={buttonStyle}
      onPress = {() => {
        navigation.navigate('customerHistory',{user:username});
      }
      }
      />
    </View>
  )
}

const CustomerBook = ({route, navigation}) => {
  const [selectedService, setSelectedService] = useState('AnnualService');
  const [name, onChangeName] = useState('');
  const [phone, onChangePhone] = useState('');
  const [email, onChangeEmail] = useState('');
  const [comments, onChangeComments] = useState('');
  const [plate, onChangePlate] = useState('');
  const [vehFuel, setVehFuel] = useState('');
  const [vehType, setVehType] = useState('Car');
  const [vehMake, setVehMake] = useState(1);
  const [vehModel, setVehModel] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [makesList,setMakesList] = useState([]);
  const [modelsList,setModelsList] = useState([]);
  const [isLoading,setLoading] = useState(true);
  const today = new Date();
  const usertest=route.params.user;
  useEffect(async()=>{
    let user = await getUserInfo();
    onChangeName(user.name);
    onChangePhone(user.phone);
    onChangeEmail(user.email);
    setUnavailableDates(await getUnavailableDates(selectedService));
    await getMakeList();
  },[isLoading]);
  useEffect(()=>{
    getModelList();
    
  },[vehMake]);

  const getMakeList = async() => {
    await axios.get(url+'/makeListGenerator')
    .then(res=>{
      const allMakes = res.data.map(function(make){
        return make;
      });
      setMakesList(allMakes);
      setLoading(false);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }

  const getModelList = async() => {
    await axios.get(url+'/modelListGenerator/'+vehMake)
    .then(res=>{
      const allModels = res.data.map(function(model){
        return model;
      });
      setModelsList(allModels);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }
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
    const bookingJson = {
      serviceType:selectedService,
      name:name,
      phone:phone,
      email:email,
      date:stringDate,
      vehType:vehType,
      vehMake:vehMake.toString(),
      vehModel:vehModel,
      vehFuel:vehFuel,
      plate: plate,
      comments:comments
    }
    var response = false;
    await axios.post(url+'/savebooking/'+usertest,bookingJson,config)
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
  
  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }
  //const [selectedDate, setDate] = useState(new Date());
  return (
    
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal:50,paddingVertical:50}}>
      <Text h2> Booking </Text>
      <Text h2>--------------</Text>
      <Text> Choose the service required: </Text>
      <Picker
        selectedValue={selectedService}
        style={pickerStyle}
        onValueChange={async(itemValue, itemIndex) =>{
          setSelectedService(itemValue);
          setUnavailableDates(await getUnavailableDates(itemValue));
        }
          
        }>
        <Picker.Item label="Annual Service" value="AnnualService" />
        <Picker.Item label="Major Service" value="MajorService" />
        <Picker.Item label="Repair" value="Repair" />
        <Picker.Item label="Major Repair" value="MajorRepair" />
      </Picker>
      {/* <DatePicker selected={selectedDate} onChange={(date) => setDate(date)} /> */}
      <Text style={{paddingTop:15}}> Name: </Text>
      <Input
      placeholder = "Ger"
      containerStyle = {pickerStyle}
      onChangeText = {onChangeName}
      value={name}
      />
      <Text style={{paddingTop:15}}> Phone Number: </Text>
      <Input
      placeholder = "0830000000"
      type = 'number'
      containerStyle = {pickerStyle}
      onChangeText = {onChangePhone}
      value={phone}
      />
      <Text style={{paddingTop:15}}> Email: </Text>
      <Input
      placeholder = "example@mail.com"
      containerStyle = {pickerStyle}
      onChangeText = {onChangeEmail}
      value={email}
      />
      
      <Text style={{paddingVertical:30}}> Choose a date: </Text>
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
      <Text style={{paddingTop:15}}> Vehicle Type: </Text>
      <Picker
        selectedValue={vehType}
        style={pickerStyle}
        onValueChange={(itemValue, itemIndex) =>
          setVehType(itemValue)
        }>
        <Picker.Item label="Car" value="Car" />
        <Picker.Item label="Van" value="Van" />
        <Picker.Item label="Minibus" value="Minibus" />
        <Picker.Item label="Motorcycle" value="Motorcycle" />
      </Picker>
      {/* car api to generate values here: https://github.com/Savage3D/car-makes-models-data */}
      <Text style={{paddingTop:15}}> Vehicle Make: </Text>
      <Picker
        selectedValue={vehMake}
        style={pickerStyle}
        onValueChange={(itemValue, itemIndex) =>
          setVehMake(itemValue)
        }>
        {
          makesList.map(      //Default value must be changed
            (make) => (
              <Picker.Item  key={make.makeId} label={make.makeName} value={make.makeId} />
            )
          )
        }
      </Picker>
      <Text style={{paddingTop:15}}> Vehicle Model: </Text>
      <Picker
        selectedValue={vehModel}
        style={pickerStyle}
        onValueChange={(itemValue, itemIndex) =>
          setVehModel(itemValue)
        }>
        {
          modelsList.map(
            (model) => (
              <Picker.Item  key={model.modelId} label={model.model} value={model.model} />
            )
          )
        }
      </Picker>
      <Text style={{paddingTop:15}}> Vehicle Fuel Type: </Text>
      <Picker
        selectedValue={vehFuel}
        style={pickerStyle}
        onValueChange={(itemValue, itemIndex) =>
          setVehFuel(itemValue)
        }>
        <Picker.Item label="Diesel" value="Diesel" />
        <Picker.Item label="Petrol" value="Petrol" />
        <Picker.Item label="Hybrid" value="Hybrid" />
        <Picker.Item label="Electric" value="Electric" />
      </Picker>
      <Text style={{paddingTop:15}}> License Plate: </Text>
      <Input
      placeholder = "IR0000000"
      containerStyle = {pickerStyle}
      onChangeText = {onChangePlate}
      />
      <Text style={{paddingTop:15}}> Comments: </Text>
      <Input
      placeholder = "..."
      containerStyle = {pickerStyle}
      onChangeText = {onChangeComments}
      />
      <Button
      title = "Book"
      buttonStyle={buttonStyle}
      onPress = {() => {
        postBooking();
        navigation.navigate('customer',{user:usertest});
      }
      }
      />
    </ScrollView>
    
  )
}

const CustomerHistory = ({route,navigation}) => {
  const user = route.params.user;
  const[bookings,getBookings] = useState([]);
  var key = 0;
  useEffect(() => {
    getUserBookings();
  },[]);

  const getUserBookings = async() => {
    await axios.get(url+'/getbookings/'+user)
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
      <View style={tableStyle}>
        <View style={tableHeaderStyle}>
          <View><Text> BOOKINGS </Text></View>
        </View>
        <View style={tableHeaderStyle}>
          <View><Text> ID </Text></View>
          <View><Text> Plate </Text></View>
          <View><Text> Date </Text></View>
          <View><Text> Status </Text></View>
        </View>

        {
          bookings.map(
            (booking) => {
              key+=1;
              return (
              <View key={booking.key} style={{flexDirection:'row',justifyContent: 'space-between'}}>
                <View><Text>{booking.serviceID}</Text></View>
                <View><Text>{booking.carID}</Text></View>
                <View><Text>{booking.date}</Text></View>
                <View><Text>{booking.status}</Text></View>
              </View>
            )}
          )
        }


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
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal:50,paddingVertical:50}}> 
      
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
    
    <ScrollView contentContainerStyle={tableStyle}> 
      
        <View style={tableHeaderStyle}>
          <View><Text> BOOKINGS {stringDate}</Text></View>
        </View>
        <View style={tableHeaderStyle}>
          <View><Text>    ID</Text></View>
          <View><Text>   Plate</Text></View>
          <View><Text>   Status</Text></View>
          <View><Text>MechanicID</Text></View>
        </View>

        {
          bookings.map(
            (booking) => {
              return(
                
              <View key={booking.serviceID} style={{flexDirection:'row',justifyContent: 'space-evenly'}}>
                <View><Text style={{color: 'blue'}}
                            onPress={() => navigation.navigate('manageBooking',{bookingID: booking.serviceID})}>{booking.serviceID}</Text></View>
                <View><Text>{booking.carID}</Text></View>
                <View><Text>{booking.status}</Text></View>
                <View><Text>      {booking.mechanicID}</Text></View>
              </View>
            )}
          )
        }
      
    </ScrollView>
  );
}

const ManageBooking = ({route, navigation}) => {
  const [name,setName] = useState('');
  const [plate, setPlate] = useState('');
  const [service,setService] = useState('');
  const [mechanic, setMechanic] = useState('0');
  const [status, setStatus] = useState('0');
  const [fixedCost, setFixedCost] = useState(0.0);
  const [partsList,setPartsList] = useState([]);
  const [mechanicList,setMechanicList] = useState([]);
  const bookingID = route.params.bookingID;
  const [partsUsed,setPartsUsed] = useState([]);
  const [vehType, setVehType] = useState('');
  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehFuel, setVehFuel] = useState('');
  const [partsUsedObjects,setPartsUsedObjects] = useState([]);
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var keyPart = 0;
  const postModifiedBooking = async() => {
    const modifiedBookingJson = {
      serviceID: bookingID,
      mechanicID:mechanic,
      parts:partsUsedObjects.map(part => ({serviceID:bookingID,partID:part.partID,quantity:part.quantity})),
      status:status
    }
    var response = false;
    await axios.post(url+'/saveModifiedBooking',modifiedBookingJson,config)
    .then(res => {
      response = res.data;
    })
    .catch(err => err); 
    if(response){
      alert("Booking Modified");
    } else {
      alert("Error")
    }
  }


  const [part,setPartUsed] = useState(0);
  

  useEffect(()=>{
    getBookingInfo(bookingID);
    getPartsList();
    getMechanicsList();
  },[]);
  
  
  const getBookingInfo = async(booking) => {
    var response;
    await axios.get(url+'/getbookingadmin/'+booking)
    .then(res=>{
      response = res.data;
      setMechanic(response.mechanicID.toString());
      setStatus(response.status);
      setName(response.userID);
      setPlate(response.carID);
      setService(response.repairID);
      getCarInfo(response.carID);
      
      getFixedCost(response.repairID);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  } //parts list from api https://github.com/eladvardi/Bootstrap-Car-Parts-Catalogue/blob/master/sql_data/data.sql

  const getMake = async(makeid) => {
    await axios.get(url+'/getMake/'+makeid)
    .then(res=>{
      setVehMake(res.data);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }


  const getCarInfo = async(plate) => {
    var response;
    await axios.get(url+'/getCarInfo/'+plate)
    .then(res=>{
      var resMake = "";
      response = res.data;
      getMake(response.make);
      setVehModel(response.model);
      setVehType(response.type);
      setVehFuel(response.fuel);
    })
    .catch(error => console.error(`Error: ${error}`));
  }

  const getFixedCost = async(repairT) => {
    var response;
    await axios.get(url+'/getFixedPrice/'+repairT)
    .then(res=>{
      response = res.data;
      setFixedCost(response);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }

  const getPartsList = async() => {
    await axios.get(url+'/partListGenerator')
    .then(res=>{
      const allParts = res.data.map(function(part){
        return part;
      });
      setPartsList(allParts);
    })
    .catch(error => console.error(`Error: ${error}`));
  }

  const getMechanicsList = async() => {
    await axios.get(url+'/mechanicListGenerator')
    .then(res=>{
      const allMechanics = res.data.map(function(mechanic){
        return mechanic;
      });
      setMechanicList(allMechanics);
    })
    .catch(error => console.error(`Error: ${error}`));
  }

  const getPartsUsed = () => {
    const allPartsUsed = partsUsed.map(
      function(part) {
        var found = null;
        partsList.forEach(d => {
          if(part == d.partID){
            found = d;
          }
        }
        )
        found.quantity=1;
        return found;
      }
    );
    setPartsUsedObjects(allPartsUsed);
  }

  return(
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal:50, paddingVertical:50 }}>
      <Text style={{paddingTop:20}}> Customer: </Text>
      <Text h4> {name} </Text>
      <Text style={{paddingTop:20}}> License Plate: </Text>
      <Text h4> {plate} </Text>
      <Text style={{paddingTop:20}}> Service ID: </Text>
      <Text h4> {service} </Text>
      <Text style={{paddingTop:20}}> Make: </Text>
      <Text h4> {vehMake} </Text>
      <Text style={{paddingTop:20}}> Model: </Text>
      <Text h4> {vehModel} </Text>
      <Text style={{paddingTop:20}}> Type: </Text>
      <Text h4> {vehType} </Text>
      <Text style={{paddingTop:20}}> Fuel: </Text>
      <Text h4> {vehFuel} </Text>
      <Picker
        selectedValue={mechanic}
        style={pickerStyle}
        onValueChange={(itemValue, itemIndex) =>{
          setMechanic(itemValue);
        }
        }>
        <Picker.Item  label='Mechanic' value='0' />
        {
          mechanicList.map(
            (mechanic) => (
              <Picker.Item  key={mechanic.mechanicID} label={mechanic.name} value={mechanic.mechanicID} />
            )
          )
        }
      </Picker>
      <Text style={{paddingTop:20}}> Fixed Cost: </Text>
      <Text h4> {fixedCost}</Text>
      <Text style={{paddingTop:20}}> Parts/Items: </Text>
      {
          partsUsedObjects.map(
            (part) => {
              part.keyPart = keyPart;
              keyPart +=1;
            return(
              <View style={{backgroundColor:'lightgray'}}>
                <Text style={{margin:20,marginBottom:0}} key={part.keyPart}>{part.description} :€ {part.cost}</Text>
                <Picker selectedValue={part.quantity} style={{width:100,height:45,backgroundColor:'gray',margin:15}} onValueChange={(itemValue)=>{part.quantity=itemValue;
                setPartsUsedObjects(partsUsedObjects.map(partT => partT.partID == part.partID ? {...partT, quantity:itemValue}:partT));
                }}>
                 <Picker.Item label='QTY' value={0}/>
                  <Picker.Item label='1' value={1}/>
                  <Picker.Item label='2' value={2}/>
                  <Picker.Item label='3' value={3}/>
                  <Picker.Item label='4' value={4}/>
                </Picker></View>
            )
            }
          )
        }
      <Picker
        selectedValue={0}
        style={pickerStyle}
        onValueChange={(itemValue, itemIndex) =>{
          //setPartUsed(itemValue);
          if(partsUsed.includes(itemValue)){

          } else {
            partsUsed.push(itemValue);
          }
          getPartsUsed();
        }
        }>
        <Picker.Item  label=' + Add Item/Part' value='0' />
        {
          partsList.map(
            (part) => {
              return(
              <Picker.Item  key={part.partID} label={part.description} value={part.partID} />
            )}
          )
        }
      </Picker>
      
      <Text style={{paddingTop:20}}> Status: </Text>
      <Picker
        selectedValue={status}
        style={pickerStyle}
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
      title = "Modify Booking"
      buttonStyle={buttonStyle}
      onPress = {() => {
        postModifiedBooking();
        // navigation.navigate('Login');
      }
      }
      />
      <Button
      title = "Generate Invoice"
      buttonStyle={buttonStyle}
      onPress = {() => {
        if(postModifiedBooking()){
          navigation.navigate('invoice',{serviceID:bookingID,parts:partsUsedObjects});
        }
        // navigation.navigate('Login');
      }
      }
      />
    </ScrollView>
    
  )
}

const Invoice = ({route, navigation}) => {
  const [name,setName] = useState('');
  const [plate, setPlate] = useState('');
  const [service,setService] = useState('');
  const [mechanic, setMechanic] = useState('0');
  const [status, setStatus] = useState('0');
  const [fixedCost, setFixedCost] = useState(0.0);
  const bookingID = route.params.serviceID;
  const [vehType, setVehType] = useState('');
  const [vehMake, setVehMake] = useState('');
  const [vehModel, setVehModel] = useState('');
  const [vehFuel, setVehFuel] = useState('');
  const [partsUsed, setPartsUsed] = useState([]);
  const partsUsedInfo = route.params.parts;
  var cost = fixedCost;
  const [cost2,setCost] = useState(0.0);

  const getMake = async(makeid) => {
    await axios.get(url+'/getMake/'+makeid)
    .then(res=>{
      setVehMake(res.data);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }

  const getModel = async(modelid) => {
    await axios.get(url+'/getModel/'+modelid)
    .then(res=>{
      setVehModel(res.data);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }

  useEffect(async ()=>{
    await getBookingInfo(bookingID);
    
  },[]);

  useEffect(async()=>{
    setCost(cost);
    
  },[cost]);
  const getBookingInfo = (booking) => {
    var response;
    return axios.get(url+'/getbookingadmin/'+booking)
    .then(res=>{
      response = res.data;
      setMechanic(response.mechanicID);
      setStatus(response.status);
      setName(response.userID);
      setPlate(response.carID);
      setService(response.repairID);
      getCarInfo(response.carID);
      getFixedCost(response.repairID);
      //getPartsUsed(route.params.serviceID);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }
  const getCarInfo = (plate) => {
    var response;
    return axios.get(url+'/getCarInfo/'+plate)
    .then(res=>{
      response = res.data;
      getMake(response.make);
      getModel(response.model);
      setVehType(response.type);
      setVehFuel(response.fuel);
    })
    .catch(error => console.error(`Error: ${error}`));
  }
 
  const getFixedCost = async(repairT) => {
    var response;
    await axios.get(url+'/getFixedPrice/'+repairT)
    .then(res=>{
      response = res.data;
      setFixedCost(response);
    })
    .catch(error => console.error(`Error: ${error}`));
    
  }
  return(
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal:50,paddingVertical:50}}>
      <Text style={{paddingTop:20}}> Customer: </Text>
      <Text h4> {name} </Text>
      <Text style={{paddingTop:20}}> License Plate: </Text>
      <Text h4> {plate} </Text>
      <Text style={{paddingTop:20}}> Service ID: </Text>
      <Text h4> {service} </Text>
      <Text style={{paddingTop:20}}> Make: </Text>
      <Text h4> {vehMake} </Text>
      <Text style={{paddingTop:20}}> Model: </Text>
      <Text h4> {vehModel} </Text>
      <Text style={{paddingTop:20}}> Type: </Text>
      <Text h4> {vehType} </Text>
      <Text style={{paddingTop:20}}> Fuel: </Text>
      <Text h4> {vehFuel} </Text>
      <Text style={{paddingTop:20}}> Mechanic: </Text>
      <Text h4> {mechanic} </Text>
      <Text style={{paddingTop:20}}> Status: </Text>
      <Text h4> {status} </Text>
      <Text style={{paddingTop:20}}> Fixed Cost: </Text>
      <Text h4> €{fixedCost} </Text>
      
      <Text style={{paddingTop:20}}> Parts Used: </Text>
      {
        partsUsedInfo.map((part) => {
          cost+=(part.cost*part.quantity);
          console.log(cost);
          return (
          <View key={part.keyPart}><Text h4> {part.description} {'\n'} Qty: {part.quantity} €{part.cost}/each</Text>
          </View>
          )}
          
        )
      }
      <Text style={{paddingTop:20}}> Total: </Text>
      <Text h4> €{cost2} </Text>
    </ScrollView>
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
