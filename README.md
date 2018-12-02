# NavBeacon
Indoor navigation using BLE beacons

<b>Built in React-Native</b>
<b>Phone OS's Supported:</b></br>
iOS</br>
Android</br>

<b>Beacons Used:</b></br>
Kontakt.io</br>

<b>Devices Tested On:</b></br>
iPhone 6 Plus</br>
Samsung Galaxy S8

<b>Libraries Utilized:</b></br>
Makentoch React-Native-Beacons-Manager https://github.com/MacKentoch/react-native-beacons-manager </br>
AirBnB's React-Native-Maps https://github.com/react-community/react-native-maps</br>
React-Native-Elements https://github.com/react-native-training/react-native-elements</br>

<b>Pathing Design:<b></br>
Array of Room Coordinates</br>
Google-Maps PolyLines to draw the path</br>
Google-Maps Marker to show end location</br>

<b>Future Release Ideas</b></br>
<b>Acceleromter/Gyroscope:</b></br> To get a better idea which way a user is going</br>
<b>Database Implementation:</b></br> Store the beacons - (Minor, Major, Latitude, Longitude, KontaktID, Floor) and Rooms - (Room Number, Latitude, Longitude)</br>
<b>UI Changes:</b></br> Left Side Sliding Menu: Give the user access to Events, Restrooms, Food, Offices</br>
<b>Python Scraper:</b></br> Scrape Events</br>
<b>Pathing System:</b></br> Design a better way to path possibly with Dijkstra's shortest path algorithm? Current issue is following the path around corners as creating the Polyline requires getting the edge before the turn</br>
