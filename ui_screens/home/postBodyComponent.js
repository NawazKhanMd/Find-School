import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, StatusBar, Animated, TouchableOpacity, Share, Image, Linking, UIManager, Platform } from 'react-native';
import moment from 'moment';
import { Icon, Tooltip } from '@ui-kitten/components';
import { AreaChart, Grid, XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
const colors = ['#D47FA6', '#8A56AC', '#241332', '#4aaaaa', '#4666E5', '#132641', '#52912E', '#417623', '#253E12']   //Background Colors for Contact cards
const minH = (Dimensions.get('screen').height - StatusBar.currentHeight) / 3    // Min Height of a card once we hide content 
let prevSelected = -1                                                           // Previous Selected State

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Post = ({ selectedClass, data, index, selectedCardIndex, selectedView, handleSelected }) => {
    // alert(JSON.stringify(data))
    let chartData = []
    let chartXAxisData = []
    if (selectedClass != null) {
        for (const ele in selectedClass.avg_topper_marks) {
            chartData.push(Number(selectedClass.avg_topper_marks[ele]))
        }
        chartXAxisData = Object.keys(selectedClass.avg_topper_marks);
    }
    const ExtendBottom = new Animated.Value(-minH / 1.5)                         // Animated 
    const skrinkBottom = new Animated.Value(-15)                                 //          Values
    const rotateCard = new Animated.Value(1);                                    //                To
    const rotateBack = new Animated.Value(1);                                    //                  Handle
    const animatedValue = new Animated.Value(0);                                 //                        Sliding

    const [likes, updateLikes] = useState(false);                                // State to hold Fav Card or not this is not in redux/parentState for this is not saved anywhere
    const [tootlTipVisible, settootlTipVisible] = React.useState(false);         // Tooltip is displayed when user clicks on Share
    const [selectedCI, setSelectedCI] = useState(selectedCardIndex);             // Selected Card Index to Initiate Animated Slding

    const handleShare = (data) => {                                              // Handles Share Functionality
        settootlTipVisible(true)
        setTimeout(() => {
            settootlTipVisible(false)
            try {
                Share.share({
                    message: data.name['first'] + ', ' + data.name['last'] + '\n' + 'Phone : ' + data.phone + '\n' + 'Cell : ' + data.cell + '\n' + 'Email : ' + data.email,
                });
            } catch (error) {
                alert(error.message);
            }
        }, 800)
    }
    const handleDailer = (obj) => {                                              // Handles Dailing feature
        let phoneNumber = ''
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${obj}`;
        }
        else {
            phoneNumber = `telprompt:${obj}`;
        }

        Linking.openURL(phoneNumber);
    }
    const handleMail = (email) => {                                              // Handles MailTo Feature
        Linking.openURL('mailto:' + email);
    }

    useEffect(() => {                                                            // Animating Slide Feature as soon as selected Cardindex Changes
        prevSelected = selectedCI;
        Animated.timing(animatedValue,
            {
                toValue: selectedCI == index ? 1 : 0,
                duration: 500,
                useNativeDriver: false
            }).start();
        Animated.timing(
            rotateCard,
            {
                useNativeDriver: false,
                toValue: selectedCI == index ? 0 : 1,
                duration: 300,
            }
        ).start();
        Animated.timing(
            rotateBack,
            {
                useNativeDriver: false,
                toValue: selectedCI == prevSelected ? 0 : 1,
                duration: 500,
            }
        ).start();
        Animated.timing(
            skrinkBottom,
            {
                useNativeDriver: false,
                toValue: selectedCI == prevSelected ? -minH / 1.5 : -15,
                duration: 500,
            }
        ).start();
        Animated.timing(
            ExtendBottom,
            {
                useNativeDriver: false,
                toValue: selectedCI == index ? -15 : -minH / 1.5,
                duration: 150,
            }
        ).start();
    }, [selectedCI, selectedView]);

    let heightOfTheCard = 0
    let cardRotation = null
    let marginBottomOftheCard = 0

    if (selectedCI == index && selectedView == 0) {                             // Animating to Straight the card
        heightOfTheCard = 'auto'
        cardRotation = rotateCard.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-35deg']
        });
        marginBottomOftheCard = ExtendBottom
    } else if (index == prevSelected && selectedView == 0) {                    // Animating to Rotate the Card as this is the Previously selected card
        heightOfTheCard = minH
        cardRotation = rotateBack.interpolate({
            inputRange: [0, 1],
            outputRange: ['-35deg', '0deg']
        });
        marginBottomOftheCard = skrinkBottom;
    } else if (selectedView == 0) {                                             // Animating to display normal list with rotation
        heightOfTheCard = minH
        cardRotation = '-35deg';
        marginBottomOftheCard = -minH / 1.5
    } else {                                                                    // Animation to Zero Rotaion
        heightOfTheCard = 'auto'
        cardRotation = '0deg';
        marginBottomOftheCard = 0
    }
    return (
        <TouchableWithoutFeedback                                               // Updating Selected Card Index when Touched
            onPress={() => {
                handleSelected(index)
                setSelectedCI(index)
            }}>
            <Animated.View style={{                                            // Animated View reponsible for Rotation
                ...styles.container,
                backgroundColor: colors[index % 9],
                height: heightOfTheCard,
                marginBottom: marginBottomOftheCard,
                transform: [{
                    rotateX: cardRotation
                }],
            }}>
                {data.name != undefined &&
                    <View style={{ ...styles.mainInfo }}>
                        <Text style={styles.title}>{data.name}</Text>
                        <View style={{ ...styles.rowContainer, justifyContent: 'space-between',...styles.top10 }}>
                            <Text style={[styles.subTitle]}>Since {data.since}, {data.syllabus}</Text>
                            <Text style={[styles.subTitle]}>👨‍👩‍👦‍👦 {data.total} Students</Text>
                        </View>
                    </View>
                }
                {selectedCI != index &&
                    <View style={[styles.rowContainer, styles.txtCenter]}>
                        <Icon fill='#fff' style={styles.icon} name={'arrow-ios-downward'} />
                    </View>
                }
                {(selectedCI == index) &&                                                              // having this condition will improve performance
                    <Animated.View style={{ opacity: animatedValue }}>
                        <View style={styles.content}>
                            {data.locations != undefined && <Text style={styles.subTitle}>📍 Locations: {data.locations.join(', ')} {`\n`}</Text>}
                            {data.labs && <Text style={styles.subTitle}>🔬 School has Laboratories </Text>}
                            {data.curricular_activities && <Text style={styles.subTitle}>🏀 Encourages Cirricular Activities</Text>}
                            {data.cultural_activities && <Text style={styles.subTitle}>🤹‍♀️ Encourages in Cultural activities a lot! </Text>}
                            {data.Awards_won_by_students != undefined && <Text style={styles.subTitle}>🏅 {data.Awards_won_by_students} Awards won by Students</Text>}
                            {data.Awards_won_by_school != undefined && <Text style={styles.subTitle}>🥉 {data.Awards_won_by_school} Awards won by School Management</Text>}
                            {selectedClass != null && <Text style={styles.subTitle}>👨‍👩‍👦‍👦 Total Faculty is {selectedClass.total_faculty} for class {selectedClass.class}</Text>}
                            {selectedClass != null && <Text style={styles.subTitle}>👨‍👩‍👦‍👦 A Total {selectedClass.total_students} Students in class {selectedClass.class}</Text>}
                        </View>
                        {(selectedClass != null && selectedClass.class == 1) &&
                            <Text style={styles.subTitle}>🏁 Top 5 people scored an Average of {chartData[0]}%</Text>
                        }
                        {(selectedClass != null && selectedClass.class != 1) &&
                            <View style={styles.chartContent}>
                                <Text style={styles.subTitle}>🏁 This is how Top 5 students have performed in class {selectedClass.class}</Text>
                                <AreaChart
                                    style={{ height: 200 }}
                                    data={chartData}
                                    contentInset={{ top: 30, bottom: 30 }}
                                    curve={shape.curveNatural}
                                    svg={{ stroke: 'rgb(0, 0, 0, 0.5)', fill: 'rgba(255, 255, 255, 0.9)' }}
                                >
                                    {/* <Grid 
                                     svg={{ fill: 'white' }}
                                     /> */}
                                </AreaChart>
                                <XAxis
                                    style={{ marginHorizontal: 0,marginTop:10 }}
                                    data={chartData}
                                    formatLabel={(value, index) => chartXAxisData[value]}
                                    contentInset={{ left: 10, right: 10 }}
                                    svg={{ fontSize: 10, fill: 'white' }}
                                />
                            </View>
                        }
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => handleShare(data)} >
                                <Tooltip
                                    anchor={() => (<Icon fill={'white'} style={styles.actionIcons} name='share' />)}
                                    visible={tootlTipVisible}
                                    backdropStyle={styles.backdrop}
                                    onBackdropPress={() => settootlTipVisible(false)}>
                                    <Text style={{ ...styles.subTitle, ...styles.margH5 }}>Thank you!</Text>
                                    <Text style={styles.title}>😻</Text>
                                </Tooltip>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => updateLikes(!likes)} >
                                <View style={styles.likesContainer}>
                                    <Icon fill={'white'} style={styles.actionIcons} name={likes ? "heart" : 'heart-outline'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                }
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    top10: {
        marginTop: 10
    },
    textUnderline: {
        textDecorationLine: 'underline'
    },
    txtCenter: {
        justifyContent: 'center',
        textAlign: 'center'
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    mainInfo: {
        flex: 1
    },
    avatar: {
        borderRadius: 15,
        height: 72, width: 72
    },
    avatarContainer: {
        elevation: 3,
        borderRadius: 15,
        height: 72, width: 72
    },
    container: {
        display: 'flex',
        marginTop: 15,
        justifyContent: 'flex-start',
        padding: 15,
        elevation: 10,
        width: Dimensions.get('screen').width - 60,
        marginHorizontal: 30,
        borderRadius: 15
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        marginBottom: 5,
    }, subTitle: {
        color: 'white',
        fontSize: 13,
        letterSpacing: 1.2,
    }, chartContent: {
        paddingHorizontal: 15,
    }, content: {
        paddingVertical: 15,
    }, contentText: {
        color: 'white',
        fontSize: 15,
        letterSpacing: 1.2,
        marginTop: 5,
    }, actionsContainer: {
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }, actionIcons: {
        width: 20, height: 20,
        padding: 10,
    }, likesContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }, margH5: {
        marginHorizontal: 5
    }, backdrop: {
        backgroundColor: 'transparent',
    }, icon: {
        width: 15,
        height: 15,
        marginBottom: -12
    },
});