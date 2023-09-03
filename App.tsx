/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  NativeEventEmitter,
  Alert,
  type EmitterSubscription,
  TextInput,
  Platform,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  NativeJavaModule,
  NativeKotlinModule,
  ModuleEventName,
} from './NativeModules';

type SectionProps = PropsWithChildren<{
  title: string;
  start: () => void;
  stop: () => void;
  change: () => void;
}>;

function Section({
  children,
  title,
  start,
  stop,
  change,
}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const colorStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, colorStyle]}>{title}</Text>
      <View style={styles.sectionButtonContainer}>
        <TouchableOpacity
          style={[styles.buttonContainer, backgroundStyle]}
          onPress={start}>
          <Text style={[styles.sectionTitle, colorStyle]}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer, backgroundStyle]}
          onPress={stop}>
          <Text style={[styles.sectionTitle, colorStyle]}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer, backgroundStyle, styles.doubleFlex]}
          onPress={change}>
          <Text style={[styles.sectionTitle, colorStyle]}>Change Interval</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [fibonacci1, setFibonacci1] = useState('');
  const [fibonacci2, setFibonacci2] = useState('');
  const [value, setValue] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // Add listener for event sent from Native
    const eventEmitter1: NativeEventEmitter = new NativeEventEmitter(
      NativeJavaModule,
    );
    const eventEmitter2: NativeEventEmitter = new NativeEventEmitter(
      NativeKotlinModule,
    );

    const subscription1: EmitterSubscription = eventEmitter1.addListener(
      ModuleEventName[0],
      num => {
        setFibonacci1(prev => `${prev}${num}`);
      },
    );
    const subscription2: EmitterSubscription = eventEmitter2.addListener(
      ModuleEventName[1],
      num => {
        setFibonacci2(prev => `${prev}${num}`);
      },
    );

    // Remove listener for event
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text
          style={[
            styles.sectionTitle,
            styles.header,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          Native Module
        </Text>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TextInput
            placeholder="Enter your Time Interval to milliseconds"
            keyboardType="numeric"
            style={[
              styles.input,
              backgroundStyle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
                borderColor: isDarkMode ? Colors.light : Colors.dark,
              },
            ]}
            value={value}
            onChangeText={(text: string) => {
              setValue(text.replace(/\D/g, ''));
            }}
          />
          <Section
            title="Native Java/Objective-C Module"
            start={() => {
              setFibonacci1('');
              NativeJavaModule.startFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            stop={() => {
              NativeJavaModule.stopFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            change={() => {
              NativeJavaModule.stopFibonacciStream();
              NativeJavaModule.setTimeInterval(parseInt(value ?? '5000', 10));
              setValue('');
            }}>
            {fibonacci1}
          </Section>
          <Section
            title="Native Kotlin/Swift Module"
            start={() => {
              setFibonacci2('');
              NativeKotlinModule.startFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            stop={() => {
              NativeKotlinModule.stopFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            change={() => {
              NativeKotlinModule.stopFibonacciStream();
              NativeKotlinModule.setTimeInterval(parseInt(value ?? '5000', 10));
              setValue('');
            }}>
            {fibonacci2}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 24,
    marginTop: 32,
    fontSize: 14,
    ...Platform.select({
      android: {
        paddingHorizontal: 12,
      },
      ios: {
        paddingHorizontal: 12,
        paddingVertical: 16,
      },
      default: {
        paddingHorizontal: 12,
      },
    }),
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionButtonContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 18,
    marginHorizontal: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  doubleFlex: {
    flex: 2,
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
