import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GeneratorState {
  // User-controllable values
  mode: 'OFF' | 'MAN' | 'AUTO' | 'TEST';
  mainsPowerOn: boolean;
  generatorPowerOn: boolean;
  
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
  
  // Read-only system values
  power: 0,
  frequency: 0,
  voltage: { phaseN: 240, phasePh: 415 },
  current: { l1: 62, l2: 73, l3: 59 },
  rpm: 1499,
  powerFactor: 1,
  engineState: 'hello',
  breakerState: 'IsOper',
  runningHours: 12.9,
  maintenanceTimer: 10000,
  gensetKwh: 1.8,
  gensetKvarh: 2,
  batteryVoltage: 28.3,
  
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
    gcbFeedback: true,
    fuelLeakage: false,
    notUsed1: false,
    notUsed2: false,
    notUsed3: false,
    notUsed4: false,
    notUsed5: false,
  },
  
  // Binary outputs
  binaryOutputs: {
    ecuPowerRelay: true,
    gcbCloseOpen: true,
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
    
    // System data updates (read-only, updated by simulation)
    updateSystemData: (state, action: PayloadAction<Partial<Omit<GeneratorState, 'mode' | 'mainsPowerOn' | 'generatorPowerOn' | 'analogInputs' | 'binaryInputs' | 'binaryOutputs' | 'alarms'>>>) => {
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

export const {
  setMode,
  toggleMainsPower,
  toggleGeneratorPower,
  updateSystemData,
  updateAnalogInputs,
  updateBinaryInputs,
  updateBinaryOutputs,
  updateAlarms,
} = generatorSlice.actions;

export default generatorSlice.reducer;