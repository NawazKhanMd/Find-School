import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, VirtualizedList, View, Text, InteractionManager, UIManager, LayoutAnimation, TextInput, ImageBackground, Platform, Picker } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { get } from './utils/fetch';                                     // Re-usable Function to get DATA from Restful API's
import { Post } from './postBodyComponent';                              // Each Card Component
import { Error } from './error';                                         // Error Component Handles UI on Internet or Bad Response

import { Icon } from '@ui-kitten/components';                            // 3rd party UI Component for Icons.   

const Schools = [{ "id": 0, "name": "Orchid International School", "type": 0, "total": 300, "since": 1990, "syllabus": "CBSE", "cultural_activities": true, "curricular_activities": true, "labs": true, "area_in_sqft": 5000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 1, "name": "Sai Sarasvathi School", "type": 1, "total": 150, "since": 2018, "syllabus": "SB", "cultural_activities": false, "curricular_activities": false, "labs": false, "area_in_sqft": 3000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 2, "name": "Newton International School", "type": 0, "total": 500, "since": 2002, "syllabus": "ICSE", "cultural_activities": false, "curricular_activities": false, "labs": true, "area_in_sqft": 2000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 3, "name": "Vidhyanikethan High School", "type": 0, "total": 500, "since": 2001, "syllabus": "CBSE", "cultural_activities": true, "curricular_activities": false, "labs": true, "area_in_sqft": 400, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 4, "name": "Khan Academy", "type": 0, "total": 1000, "since": 2006, "syllabus": "IGCSE", "cultural_activities": true, "curricular_activities": true, "labs": true, "area_in_sqft": 2000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 5, "name": "Newton International School", "type": 0, "total": 500, "since": 2008, "syllabus": "CBSE", "cultural_activities": false, "curricular_activities": false, "labs": true, "area_in_sqft": 2000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 6, "name": "The Olympiad International School", "type": 0, "total": 500, "since": 2008, "syllabus": "CBSE", "cultural_activities": false, "curricular_activities": true, "labs": true, "area_in_sqft": 2000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 7, "name": "LittleBuds Primary School", "type": 1, "total": 500, "since": 2015, "syllabus": "SB", "cultural_activities": true, "curricular_activities": false, "labs": false, "area_in_sqft": 2000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 8, "name": "Little Angels High School", "type": 0, "total": 500, "since": 2015, "syllabus": "ICSE", "cultural_activities": false, "curricular_activities": false, "labs": false, "area_in_sqft": 2000, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }, { "id": 9, "name": "The Lotus Iternational School", "type": 0, "total": 500, "since": 2019, "syllabus": "IGCSE", "cultural_activities": true, "curricular_activities": true, "labs": true, "area_in_sqft": 2300, "locations": ["Bangalore", "Pune", "Malaysia"], "foreign_exchange": true, "Awards_won_by_students": 10, "Awards_won_by_school": 3 }]
const api = 'https://randomuser.me/api/?results=20'                      // API url
const classes = [{"class":1,"total_students":15,"total_faculty":7,"avg_topper_marks":{"2020":"85"}},{"class":2,"total_students":15,"total_faculty":9,"avg_topper_marks":{"2019":"84","2020":"85"}},{"class":3,"total_students":20,"total_faculty":7,"avg_topper_marks":{"2018":"82","2019":"81","2020":"85"}},{"class":4,"total_students":15,"total_faculty":10,"avg_topper_marks":{"2017":"80","2018":"82","2019":"81","2020":"87"}},{"class":5,"total_students":23,"total_faculty":10,"avg_topper_marks":{"2016":"83","2017":"82","2018":"82","2019":"85","2020":"89"}},{"class":6,"total_students":40,"total_faculty":11,"avg_topper_marks":{"2015":"82","2016":"83","2017":"82","2018":"82","2019":"85","2020":"90"}},{"class":7,"total_students":40,"total_faculty":11,"avg_topper_marks":{"2014":"83","2015":"82","2016":"83","2017":"82","2018":"82","2019":"85","2020":"90"}},{"class":8,"total_students":40,"total_faculty":11,"avg_topper_marks":{"2013":"78","2014":"83","2015":"82","2016":"83","2017":"82","2018":"82","2019":"85","2020":"90"}},{"class":9,"total_students":40,"total_faculty":11,"avg_topper_marks":{"2012":"83","2013":"78","2014":"83","2015":"82","2016":"83","2017":"82","2018":"82","2019":"85","2020":"90"}},{"class":10,"total_students":40,"total_faculty":11,"avg_topper_marks":{"2011":"80","2012":"83","2013":"91","2014":"83","2015":"82","2016":"86","2017":"82","2018":"82","2019":"85","2020":"92"}}]
export default function Home({ }) {

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [selectedClass, setSelectedClass] = React.useState(null)
  const [selectedValue, setSelectedValue] = React.useState("");
  const [syllabusValue, setSyllabusValue] = useState("")
  const [searchKey, setSearchKey] = React.useState('');                  // Search Key Value
  const [locationKey, setlocationKey] = React.useState('')
  const [originalPosts, setOriginalPosts] = React.useState([]);          // Array of Cards which is used in the case of Search
  const [arrayOfPosts, setPostsData] = React.useState([]);               // Array of Contacts
  const [selectedCard, setSelectedIndex] = React.useState(-1);           // Keeping the index of selected card to expand or do the animations
  const [selectedView, setSelectedView] = React.useState(0);             // Toggle between Tab View and List View
  const [isOffline, setOfflineFlag] = React.useState(false);             // If Offline this will be true 
  const [isLoading, setLoadingFlag] = React.useState(0);                 // This hase 3 states 0 = LoadingHasFinised , 1 = is Loading, 2 = Network error

  useEffect(() => {
    NetInfo.addEventListener(state => {
      checkInternetAndCall(state.isInternetReachable)
    });
  }, []);
  const checkInternetAndCall = (flag) => {                               // Handles whether to call the API or display Error componet
    if (flag) {
      setOfflineFlag(false)
      getPosts();
    } else {
      if (isOffline == false) {
        setLoadingFlag(0);
        setOfflineFlag(true)
      }
    }
  }
  const getPosts = () => {                                               // Hits API and gets New Contacts that are pushed to the UI
    // get({
    //   url: api,
    // })()
    //   .then(response => {
    //     if (response != undefined) {
    //       setLoadingFlag(1);
    //       InteractionManager.runAfterInteractions(() => {
    //         setPostsData(arrayOfPosts.concat(response.data.results));
    //         setOriginalPosts(arrayOfPosts.concat(response.data.results));
    //       })
    //     } else {
    //       setLoadingFlag(2)
    //     }
    //   })
    //   .catch(error => {
    //     setLoadingFlag(2);
    //     console.log(error)
    //   });
    setLoadingFlag(1);
    setPostsData([...Schools]);
    setOriginalPosts([...Schools]);
  }
  const getItem = (data, index) => {                                   // For Virtualized Cards
    return {
      id: Math.random().toString(12).substring(0),                //Generating Unique ID's
      data: data[index],
      index: index,
      total: data.length                                          //data Object 
    }
  }
  const handleSelected = (index) => {                                    // Callback when Clicked on a card
    setSelectedIndex(selectedCard == index ? -1 : index)
  }
  const handlePicker = (value) => {
    setSelectedValue(value)
    if (value != 'None') {
      setSelectedClass(classes[Number(value)])
    } else {
      setSelectedClass(null)
    }
  }
  const handleSyllabusPicker = (value) => {
    setSyllabusValue(value)
    let temp_list = Array.from(originalPosts);
    if (value != 'None') {
      setSelectedView(1);
      temp_list = temp_list.filter((ele, index) => {
        let syllabus = ele.syllabus.toLowerCase();
        return syllabus.indexOf(value.toLowerCase()) != -1;
      });
    } else {
      setSelectedView(0);
    }
    setPostsData(temp_list);
  }
  const handleSearch = (value, type) => {                                      // Handles Searching the Contacts                  
    setSelectedIndex(-1)
    let temp_list = Array.from(originalPosts);
    setLoadingFlag(1)
    switch (type) {
      case 'name':
        setSearchKey(value)
        break;
      case 'locations':
        setlocationKey(value)
        break;
    }
    if (value != '') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedView(1)
      switch (type) {
        case 'name':
          temp_list = temp_list.filter((ele, index) => {
            let name = ele.name.toLowerCase();
            return name.indexOf(value.toLowerCase()) != -1;
          })
          break;
        case 'locations':
          temp_list = temp_list.filter((ele, index) => {
            let name = ele.locations.join('').toLowerCase();
            return name.indexOf(value.toLowerCase()) != -1;
          })
          break;
      }
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedView(0)
    }
    //alert(JSON.stringify(temp_list))
    setPostsData(temp_list);
  }
  const handleSearchClear = (type) => {                                      // Handles Clearing of Searched items
    setSelectedValue("None")
    setSyllabusValue("None")
    setSearchKey('');
    setlocationKey('');
    setLoadingFlag(1)
    setSelectedIndex(-1)
    setSelectedView(0)
    setPostsData(Array.from(originalPosts));
  }
  const BG_img = require('../../images/bg.gif');                         // Backgroung Image

  if (isLoading != 2 && !isOffline) {                                    // This is True when there are no errors and we can shoe the Cards
    return (
      <ImageBackground source={BG_img} style={styles.image}>
        <View style={styles.inputContainer}>
          <View style={styles.eachInputContainer}>
            {searchKey != '' &&                                            // Displayed only when the user Searches
              <TouchableWithoutFeedback onPress={() => handleSearchClear('name')}>
                <Icon fill='#8A56AC' style={styles.tabIcon} name={'close-square'} />
              </TouchableWithoutFeedback>
            }
            <TextInput style={styles.inputTag} value={searchKey} onChangeText={value => handleSearch(value, 'name')} placeholder={'School Name'} />
          </View>
          {(locationKey == '' && searchKey == '') &&                                            // Displayed only when the user Searches
            <Icon fill='#8A56AC' style={styles.tabIcon} name={'search'} />
          }
          <View style={styles.eachInputContainer}>
            <TextInput style={styles.inputTag} value={locationKey} onChangeText={value => handleSearch(value, 'locations')} placeholder={'Location'} />
            {locationKey != '' &&                                            // Displayed only when the user Searches
              <TouchableWithoutFeedback onPress={() => handleSearchClear('locations')}>
                <Icon fill='#8A56AC' style={styles.tabIcon} name={'close-square'} />
              </TouchableWithoutFeedback>
            }
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={{ ...styles.eachInputContainer, marginRight: 10 }}>
            <View style={styles.pickerTag} >
              <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => handlePicker(itemValue)}
              >
                <Picker.Item label=" - " value="None" />
                {Array.from('0123456789').map((ele, index) => <Picker.Item key={index} label={`class ${Number(ele) + 1}`} value={ele} />)}
              </Picker>
            </View>
          </View>
          {/* {(locationKey == '' && searchKey == '') &&                                            // Displayed only when the user Searches */}
          <Icon fill='#8A56AC' style={styles.tabIcon} name={'trending-up'} />
          {/* } */}
          <View style={{ ...styles.eachInputContainer, marginLeft: 10 }}>
            <View style={styles.pickerTag} >
              <Picker
                selectedValue={syllabusValue}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => handleSyllabusPicker(itemValue)}
              >
                <Picker.Item label=" - " value="None" />
                <Picker.Item label="CBSE" value="CBSE" />
                <Picker.Item label="ICSE" value="ICSE" />
                <Picker.Item label="IGCSE" value="IGCSE" />
                <Picker.Item label="State Board" value="SB" />
              </Picker>
            </View>
          </View>
        </View>
        <VirtualizedList                                                 // if the Loading is 0, we are showing empty cards
          data={isLoading == 0 ? Array.from(' '.repeat(20)) : arrayOfPosts}     // and if Loading is not 0 we are showing actual Cards
          initialNumToRender={4}
          renderItem={({ item }) => <Post selectedClass={selectedClass} {...item} selectedView={selectedView} handleSelected={(index) => handleSelected(index)} selectedCardIndex={selectedCard} />}
          keyExtractor={item => item.id}
          getItemCount={(data) => data.length}
          getItem={getItem}
        // onEndReached={() => {
        //   if (searchKey == '') {                                       // this will call the API for the next list of contacts only when the use is not searching
        //     getPosts()
        //   }
        // }}
        // onEndReachedThreshold={0.5}
        />
        {isLoading == 1 && arrayOfPosts.length == 0 &&                   // If the user searched for a name which is not there, this will become true
          <View style={styles.noResutlsContainer}>
            <Text style={[styles.noResultsContent]}>Oops we did not find anyone</Text>
          </View>
        }
      </ImageBackground>
    )
  } else {                                                               // This will show the Error Component if we encounter a error
    return (
      <Error state={isLoading} />
    )
  }
}

const styles = StyleSheet.create({
  noResutlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  noResultsContent: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#8A56AC',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  inputContainer: {
    borderColor: '#00000000',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    width: '95%',
    padding: 10,
    height: 40,
    margin: 10,
  }, eachInputContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, inputTag: {
    paddingLeft: 10,
    minWidth: '40%',
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 15,
    fontSize: 15,
    letterSpacing: 1.2,
    color: 'black',
    height: 50
  }, pickerTag: {
    textAlign: 'center',
    maxWidth: '94%',
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 15,
    fontSize: 15,
    letterSpacing: 1.2,
    color: 'black',
    height: 50
  },
  tabsView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 5,
  }, tabIcon: {
    padding: 20,
    width: 30,
    height: 30
  }, tabText: {
    fontWeight: 'bold',
    color: '#8A56AC'
  }, selectedTabText: {
    fontWeight: 'bold',
    color: '#F1F0F2'
  }, tab: {
    backgroundColor: '#F1F0F2',
    flex: 1,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#8A56AC',
    borderWidth: 3,
  }, selectedTab: {
    backgroundColor: '#8A56AC',
    flex: 1,
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: '#8A56AC',
    borderWidth: 3,
    elevation: 3
  }
})