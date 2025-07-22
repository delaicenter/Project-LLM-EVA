import { NavigationContainer } from '@react-navigation/native'  
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IndexApp from '../screens';

const Stack = createNativeStackNavigator();

export default function AppRouter() {
     return (
          <NavigationContainer>
               <Stack.Navigator initialRouteName='Hello'>
                    <Stack.Screen name='Hello' component={IndexApp} />
               </Stack.Navigator>
          </NavigationContainer>
     )
}