import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'AmnestyScript': require('../assets/fonts/Amnesty-Script.ttf'),
  });
};

export const fonts = {
  brush: 'AmnestyScript',
}; 