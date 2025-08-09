
import { StyleSheet, View } from 'react-native';
import DentistTreatmentPlanner from "./DentistTreatmentPlanner";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {TreatmentOverview} from "./TreatmentOverview";
import {useState} from "react";
import {Stage} from "./interfaces/Stage";
import PriceManagement from "./PriceManagement";
import {ServiceProvider} from "./servicesContext";
import {Doctor, Patient} from "./interfaces/People";


const Stack =createNativeStackNavigator();

export default function App() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [patient, setPatient] = useState<Patient>({
        familyName: 'M',
        firstName: 'Arkadii',
    });
    const [doctor, setDoctor] = useState<Doctor>({
        name: 'Dr Yevnin Dmitry DMD',
        additionalInfo: 'Tel Aviv University',
        license: 'Dental license 8931'
    });

    return (
      <ServiceProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="DentistTreatmentPlanner">
            <Stack.Screen name="DentistTreatmentPlanner"
                          children={(props) => (<DentistTreatmentPlanner
                              {...props}
                              stages={stages}
                              setStages={setStages}
                              patient={patient}
                              setPatient={setPatient}
                              doctor={doctor}
                              setDoctor={setDoctor}
                          />)}/>
            <Stack.Screen name="TreatmentOverview"
                          children={(props) => (<TreatmentOverview
                              {...props}
                              stages={stages}
                              patientInfo={patient}
                              doctorInfo={doctor}
                          />)}/>
            <Stack.Screen name="PriceManagement"
                          component={PriceManagement}
                          options={{ title: 'Manage Prices' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ServiceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
