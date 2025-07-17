// src/components/firebase/UIsettingsData.ts

export const UISettings: Record<string, number> = {
  A1: 300,
  A2: 200,
  A3: 100,
  A4: 400,
  A5: 350,
  A6: 420,
  A7: 180,
  A8: 380,
  A9: 430,
  A10: 120,
  A11: 410,
  A12: 390,
  A13: 190,
  A14: 360,
  A15: 370,
};

export function updateUISettings(newSettings: Record<string, number>) {
  Object.assign(UISettings, newSettings);
}
