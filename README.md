# School Search

![ezgif-4-1091531c5826](https://user-images.githubusercontent.com/15027672/97930463-6791bd80-1d91-11eb-9776-4cb8a33381cb.gif)

Static Data for  Schools and Displaying a Fluid UI with Filter & search fuctionalities.

React-native Project

Steps:
1: yarn
2: Connect a Mobile or Start a Emulator.
3: react-native run-android
4: Thats it!

Components:

Main Component is in App.js

                            This component is Basically for initializing with HOC's 

Second component is UI Screens/ Home / index.js

                            This components Holds entire Code to get Contacts from the API and load Post Cards in a Virtualized list also handles Network and Error from API

Third component is UI Screens/ Home / PostBodyComponent.js
                      
                            This is a card component which displays details dumbly and handles Clicks, Shares & Animations

Fourth component is UI Screens/ Home / Error.js
               
                            This shows the error message encountered by Home/Index.js

A Get Method to Access API's and get the Data back to Home/index.js


Unit Tests are missing


Thank You.

