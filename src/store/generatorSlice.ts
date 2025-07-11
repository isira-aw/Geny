import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { AppDispatch } from './store';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDNEo0p5cRCo9MI-0v4fVyI8CWrewfNDM",
  authDomain: "genmonitoring-7a26e.firebaseapp.com",
  databaseURL: "https://genmonitoring-7a26e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "genmonitoring-7a26e",
  storageBucket: "genmonitoring-7a26e.firebasestorage.app",
  messagingSenderId: "708707703373",
  appId: "1:708707703373:web:d1fdf146e1d4a4f5881a04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export interface GeneratorState {
  // User-controllable values
  mode: 'OFF' | 'MAN' | 'AUTO' | 'TEST';
  mainsPowerOn: boolean;
  generatorPowerOn: boolean;

   mainVoltage: number;
  
  // Read-only system values
  power: number;
  frequency: number;
  voltage: {
    phaseN: number;
    phasePh: number;
  };
  current: {
    l1: number;
    l2: number;
    l3: number;
  };
  rpm: number;
  powerFactor: number;
  engineState: string;
  breakerState: string;
  runningHours: number;
  maintenanceTimer: number;
  gensetKwh: number;
  gensetKvarh: number;
  batteryVoltage: number;
  
  // Analog inputs (read-only)
  analogInputs: {
    coolantTemp: number | null;
    oilLevel: number | null;
    fuelLevel: number | null;
    notUsed: number | null;
  };
  
  // Binary inputs (read-only)
  binaryInputs: {
    mcbFeedback: boolean;
    gcbFeedback: boolean;
    fuelLeakage: boolean;
    notUsed1: boolean;
    notUsed2: boolean;
    notUsed3: boolean;
    notUsed4: boolean;
    notUsed5: boolean;
  };
  
  // Binary outputs (read-only)
  binaryOutputs: {
    ecuPowerRelay: boolean;
    gcbCloseOpen: boolean;
    mcbCloseOpen: boolean;
    notUsed1: boolean;
    notUsed2: boolean;
    notUsed3: boolean;
    notUsed4: boolean;
    notUsed5: boolean;
  };
  
  // System status
  alarms: {
    active: boolean;
    count: number;
    lastCheck: string;
  };
}

const initialState: GeneratorState = {
  // User-controllable
  mode: 'AUTO',
  mainsPowerOn: true,
  generatorPowerOn: true,

  mainVoltage: 0, // Add this line
  
  // Read-only system values
  power: 0,
  frequency: 0,
  voltage: { phaseN: 0, phasePh: 0 },
  current: { l1: 0, l2: 0, l3: 0 },
  rpm: 0,
  powerFactor: 0,
  engineState: '',
  breakerState: '',
  runningHours: 0,
  maintenanceTimer: 0,
  gensetKwh: 0,
  gensetKvarh: 0,
  batteryVoltage: 0,
  
  // Analog inputs
  analogInputs: {
    coolantTemp: null,
    oilLevel: null,
    fuelLevel: null,
    notUsed: null,
  },
  
  // Binary inputs
  binaryInputs: {
    mcbFeedback: false,
    gcbFeedback: false,
    fuelLeakage: false,
    notUsed1: false,
    notUsed2: false,
    notUsed3: false,
    notUsed4: false,
    notUsed5: false,
  },
  
  // Binary outputs
  binaryOutputs: {
    ecuPowerRelay: false,
    gcbCloseOpen: false,
    mcbCloseOpen: false,
    notUsed1: false,
    notUsed2: false,
    notUsed3: false,
    notUsed4: false,
    notUsed5: false,
  },
  
  // Alarms
  alarms: {
    active: false,
    count: 0,
    lastCheck: new Date().toLocaleTimeString(),
  },
};

const generatorSlice = createSlice({
  name: 'generator',
  initialState,
  reducers: {
    // User-controllable actions
    setMode: (state, action: PayloadAction<'OFF' | 'MAN' | 'AUTO' | 'TEST'>) => {
      state.mode = action.payload;
    },
    toggleMainsPower: (state) => {
      state.mainsPowerOn = !state.mainsPowerOn;
    },
    toggleGeneratorPower: (state) => {
      state.generatorPowerOn = !state.generatorPowerOn;
    },
    
    // System data updates (read-only, updated from Firebase)
    updateFromFirebase: (state, action: PayloadAction<Partial<GeneratorState>>) => {
      Object.assign(state, action.payload);
    },
    
    updateAnalogInputs: (state, action: PayloadAction<Partial<GeneratorState['analogInputs']>>) => {
      Object.assign(state.analogInputs, action.payload);
    },
    
    updateBinaryInputs: (state, action: PayloadAction<Partial<GeneratorState['binaryInputs']>>) => {
      Object.assign(state.binaryInputs, action.payload);
    },
    
    updateBinaryOutputs: (state, action: PayloadAction<Partial<GeneratorState['binaryOutputs']>>) => {
      Object.assign(state.binaryOutputs, action.payload);
    },
    
    updateAlarms: (state, action: PayloadAction<Partial<GeneratorState['alarms']>>) => {
      Object.assign(state.alarms, action.payload);
    },
  },
});

// // Firebase listener setup
// export const setupFirebaseListeners = (dispatch: any) => {
//   const dbRef = ref(database);
  
//   onValue(dbRef, (snapshot) => {
//     const data = snapshot.val();
    
//     if (data) {
//       // Update main state
//       dispatch(generatorSlice.actions.updateFromFirebase({
//         batteryVoltage: data.Sensor?.batteryVoltage || 0,
//         // Add other fields from Firebase as needed
//       }));
      
//       // You can add more specific updates here for different parts of the state
//       // For example:
//       // dispatch(generatorSlice.actions.updateAnalogInputs({
//       //   coolantTemp: data.Sensor?.coolantTemp || null
//       // }));
//     }
//   });
// };
// Firebase listener setup
export const setupFirebaseListeners = (dispatch: AppDispatch) => {
  const dbRef = ref(database);
  
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
      // Update main state
      dispatch(generatorSlice.actions.updateFromFirebase({
        batteryVoltage: data.Sensor?.batteryVoltage || 0,
        mainVoltage: data.Sensor?.mainVoltage || 0,

      }));
    }
  });
};

export const {
  setMode,
  toggleMainsPower,
  toggleGeneratorPower,
  updateFromFirebase,
  updateAnalogInputs,
  updateBinaryInputs,
  updateBinaryOutputs,
  updateAlarms,
} = generatorSlice.actions;

export default generatorSlice.reducer;