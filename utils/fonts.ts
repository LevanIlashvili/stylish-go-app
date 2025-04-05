import * as Font from 'expo-font';
import { 
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
  Orbitron_900Black 
} from '@expo-google-fonts/orbitron';

export const loadFonts = async () => {
  await Font.loadAsync({
    'AmnestyScript': require('../assets/fonts/Amnesty-Script.ttf'),
    'Orbitron_400': Orbitron_400Regular,
    'Orbitron_500': Orbitron_500Medium,
    'Orbitron_600': Orbitron_600SemiBold,
    'Orbitron_700': Orbitron_700Bold,
    'Orbitron_800': Orbitron_800ExtraBold,
    'Orbitron_900': Orbitron_900Black,
  });
};

export const fonts = {
  brush: 'AmnestyScript',
  orbitron: {
    regular: 'Orbitron_400',
    medium: 'Orbitron_500',
    semiBold: 'Orbitron_600',
    bold: 'Orbitron_700',
    extraBold: 'Orbitron_800',
    black: 'Orbitron_900',
  }
}; 