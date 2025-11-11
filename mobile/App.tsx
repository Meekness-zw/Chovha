// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from 'react-native';

// // --- Type Definition for all screens ---
// export type RootStackParamList = {
//   RoleSelection: undefined;
//   PhoneInput: undefined;
//   OTPConfirmation: { role: 'driver' | 'rider' };
//   DriverRoleSelection: undefined; 
//   DriverLogin: undefined;
//   DriverSignUp: undefined;
//   DriverVehicleDetails: undefined;
//   DriverLicense: undefined;
//   DriverReviewStatus: undefined;
//   Home: undefined; 
//   SearchDestination: undefined;
// };

// // --- Import Screens ---
// // RIDER SIGN-UP FLOW
// // 🟢 FIXED PATH: Assumed location is screens/ride/
// import RiderPhoneInputScreen from './screens/ride/RiderPhoneInputScreen'; 
// // 🟢 FIXED PATH: Assumed location is screens/ride/
// import OTPConfirmationScreen from './screens/ride/OTPConfirmationScreen';
// import RoleSelectionScreen from './screens/RoleSelectionScreen'; 

// // DRIVER SCREENS
// // 🟢 FIXED PATH: Assumed location is screens/ride/ for consistency
// import DriverRoleSelectionScreen from './screens/DriverRoleSelection'; 
// import DriverLoginScreen from './screens/DriverLoginScreen'; 
// import DriverSignUpScreen from './screens/DriverSignUpScreen'; 
// import DriverVehicleDetailsScreen from './screens/DriverVehicleDetailsScreen'; 
// import DriverLicenseScreen from './screens/DriverLicenseScreen'; 
// import DriverReviewStatusScreen from './screens/DriverReviewStatusScreen';

// // RIDER MAIN SCREENS
// import RiderScreen from './screens/ride/RiderScreen'; 
// import SearchDestinationScreen from './screens/ride/SearchDestinationScreen'; 

// const Stack = createNativeStackNavigator<RootStackParamList>();

// function AppNavigator() {
//   return (
//     <Stack.Navigator 
//       id={undefined}
//       initialRouteName="RoleSelection" 
//       screenOptions={{
//         headerShown: false, 
//         animation: 'slide_from_right', 
//       }}
//     >

//       {/* Sign-Up Flow */}
//       <Stack.Screen 
//         name="RoleSelection"
//         component={RoleSelectionScreen} 
//       />

//       {/* Driver Role Selection */}
//       <Stack.Screen 
//         name="DriverRoleSelection" 
//         component={DriverRoleSelectionScreen} 
//       />

//       <Stack.Screen 
//         name="PhoneInput" 
//         component={RiderPhoneInputScreen}
//       />
//       <Stack.Screen 
//         name="OTPConfirmation" 
//         component={OTPConfirmationScreen} 
//       />

//       {/* Driver Application Flow */}
//       <Stack.Screen 
//         name="DriverLogin"
//         component={DriverLoginScreen} 
//       />
//       <Stack.Screen 
//         name="DriverSignUp" 
//         component={DriverSignUpScreen} 
//       />
//       <Stack.Screen 
//         name="DriverVehicleDetails" 
//         component={DriverVehicleDetailsScreen} 
//       />
//       <Stack.Screen 
//         name="DriverLicense" 
//         component={DriverLicenseScreen} 
//       />
//       <Stack.Screen 
//         name="DriverReviewStatus" 
//         component={DriverReviewStatusScreen} 
//         options={{
//           gestureEnabled: false, 
//         }}
//       />

//       {/* RIDER MAIN FLOW */}
//       <Stack.Screen 
//         name="Home" 
//         component={RiderScreen} 
//         options={{
//           headerShown: false, 
//         }}
//       />

//       {/* NEW SCREEN REGISTERED */}
//       <Stack.Screen 
//         name="SearchDestination" 
//         component={SearchDestinationScreen} 
//         options={{
//           headerShown: false, 
//         }}
//       />

//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" />
//       <AppNavigator />
//     </NavigationContainer>
//   );
// }
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// --- Type Definition for all screens ---
export type RootStackParamList = {
    RoleSelection: undefined;
    PhoneInput: { role: 'driver' | 'rider' };
    RiderPhoneInputScreen:{role:'rider'};
    OTPConfirmation: { role: 'driver' | 'rider'; phoneNumber: string };
    RiderOTPConfirmationScreen: { role: 'rider'; phoneNumber: string };
    DriverRoleSelection: undefined;
    DriverLogin: undefined;
    DriverSignUp: { phoneNumber: string };
    DriverVehicleDetails: undefined;
    DriverLicense: undefined;
    DriverReviewStatus: undefined;
    Home: undefined; // Maps to RiderScreen (Rider Home)
    DriverHome: undefined; // Maps to HomeScreen (Driver Dashboard)
    SearchDestination: undefined;
};

// --- Import Screens ---

// SHARED AUTH FLOW
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import PhoneInputScreen from './screens/PhoneInputScreen';
import OTPConfirmationScreen from './screens/OTPConfirmationScreen';

// DRIVER FLOW
import DriverRoleSelectionScreen from './screens/DriverRoleSelection';
import DriverLoginScreen from './screens/DriverLoginScreen';
import DriverSignUpScreen from './screens/DriverSignUpScreen';
import DriverVehicleDetailsScreen from './screens/DriverVehicleDetailsScreen';
import DriverLicenseScreen from './screens/DriverLicenseScreen';
import DriverReviewStatusScreen from './screens/DriverReviewStatusScreen';
// ✅ FIX: Use the existing root-level 'HomeScreen.jsx' for the Driver Home route
import DriverHomeRootScreen from './screens/HomeScreen';

// RIDER MAIN SCREENS
import RiderScreen from './screens/ride/RiderScreen';
import SearchDestinationScreen from './screens/ride/SearchDestinationScreen';
import RiderOTPConfirmationScreen from './screens/ride/RiderOTPConfirmationScreen';
import RiderPhoneInputScreen from './screens/ride/RiderPhoneInputScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator
            id={undefined} // Resolves TS2769 error
            initialRouteName="RoleSelection"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >

            {/* 1. ROLE SELECTION */}
            <Stack.Screen
                name="RoleSelection"
                component={RoleSelectionScreen}
            />

            {/* 2. PHONE INPUT (SHARED) */}
            <Stack.Screen
                name="PhoneInput"
                component={PhoneInputScreen} // Uses the generic component
            />

            {/* 3. OTP CONFIRMATION */}
            <Stack.Screen
                name="OTPConfirmation"
                component={OTPConfirmationScreen} // Uses the generic component
            />
            <Stack.Screen
                name='RiderOTPConfirmationScreen'
                component={RiderOTPConfirmationScreen}
            />
            <Stack.Screen
                name='RiderPhoneInputScreen'
                component={RiderPhoneInputScreen}
            />

            {/* DRIVER FLOW */}
            <Stack.Screen
                name="DriverRoleSelection"
                component={DriverRoleSelectionScreen}
            />
            <Stack.Screen
                name="DriverLogin"
                component={DriverLoginScreen}
            />
            <Stack.Screen
                name="DriverSignUp"
                component={DriverSignUpScreen}
            />
            <Stack.Screen
                name="DriverVehicleDetails"
                component={DriverVehicleDetailsScreen}
            />
            <Stack.Screen
                name="DriverLicense"
                component={DriverLicenseScreen}
            />
            <Stack.Screen
                name="DriverReviewStatus"
                component={DriverReviewStatusScreen}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen
                name="DriverHome"
                component={DriverHomeRootScreen} // ✅ FIX: Driver Dashboard uses the root HomeScreen
            />

            {/* RIDER MAIN FLOW */}
            <Stack.Screen
                name="Home"
                component={RiderScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SearchDestination"
                component={SearchDestinationScreen}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
        </NavigationContainer>
    );
}