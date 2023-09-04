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
  NativeJavaOrObjectiveCModule,
  NativeKotlinOrSwiftModule,
  ModuleEventName,
} from './NativeModules';

type SectionProps = PropsWithChildren<{
  title: string;
  start: () => void;
  stop: () => void;
  change: () => void;
  isRunningJavaOrObjectiveCFibonacci?: boolean;
  isRunningKotlinOrSwiftFibonacci?: boolean;
}>;

function Section({
  children,
  title,
  start,
  stop,
  change,
  isRunningJavaOrObjectiveCFibonacci,
  isRunningKotlinOrSwiftFibonacci,
}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const colorStyle = {
    color: isDarkMode ? Colors.white : Colors.black,
  };
  const colorDisableStyle = {
    color: isDarkMode ? Colors.dark : Colors.light,
  };
  const disabled: boolean =
    isRunningJavaOrObjectiveCFibonacci === true ||
    isRunningKotlinOrSwiftFibonacci === true;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, colorStyle]}>{title}</Text>
      <View style={styles.sectionButtonContainer}>
        <TouchableOpacity
          style={[styles.buttonContainer, backgroundStyle]}
          disabled={disabled}
          onPress={start}>
          <Text
            style={[
              styles.sectionTitle,
              colorStyle,
              disabled && colorDisableStyle,
            ]}>
            Start
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer, backgroundStyle]}
          disabled={!disabled}
          onPress={stop}>
          <Text
            style={[
              styles.sectionTitle,
              colorStyle,
              !disabled && colorDisableStyle,
            ]}>
            Stop
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer, backgroundStyle, styles.doubleFlex]}
          disabled={disabled}
          onPress={change}>
          <Text
            style={[
              styles.sectionTitle,
              colorStyle,
              disabled && colorDisableStyle,
            ]}>
            Change Interval
          </Text>
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
  const [
    fibonacciFromJavaOrObjectiveCModule,
    setFibonacciFromJavaOrObjectiveCModule,
  ] = useState<String>('');
  const [
    fibonacciFromKotlinOrSwiftModule,
    setFibonacciFromKotlinOrSwiftModule,
  ] = useState<String>('');
  const [intervalValue, setIntervalValue] = useState('');
  const [
    isRunningJavaOrObjectiveCFibonacci,
    setRunningJavaOrObjectiveCFibonacci,
  ] = useState<boolean>(false);
  const [isRunningKotlinOrSwiftFibonacci, setRunningKotlinOrSwiftFibonacci] =
    useState<boolean>(false);
  const isDarkMode: boolean = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // Add listener for event sent from Native
    const eventEmitterForJavaOrObjectiveCModule: NativeEventEmitter =
      new NativeEventEmitter(NativeJavaOrObjectiveCModule);
    const eventEmitterForKotlinOrSwiftModule: NativeEventEmitter =
      new NativeEventEmitter(NativeKotlinOrSwiftModule);

    const subscriptionForJavaOrObjectiveCModule: EmitterSubscription =
      eventEmitterForJavaOrObjectiveCModule.addListener(
        ModuleEventName[0],
        num => {
          setFibonacciFromJavaOrObjectiveCModule(prev => `${prev}${num}`);
        },
      );
    const subscriptionForKotlinOrSwiftModule: EmitterSubscription =
      eventEmitterForKotlinOrSwiftModule.addListener(
        ModuleEventName[1],
        num => {
          setFibonacciFromKotlinOrSwiftModule(prev => `${prev}${num}`);
        },
      );

    // Remove listener for event
    return () => {
      subscriptionForJavaOrObjectiveCModule.remove();
      subscriptionForKotlinOrSwiftModule.remove();
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
            value={intervalValue}
            onChangeText={(text: string) => {
              setIntervalValue(text.replace(/\D/g, ''));
            }}
          />
          <Section
            title="Native Java/Objective-C Module"
            isRunningJavaOrObjectiveCFibonacci={
              isRunningJavaOrObjectiveCFibonacci
            }
            isRunningKotlinOrSwiftFibonacci={undefined}
            start={() => {
              setFibonacciFromJavaOrObjectiveCModule('');
              NativeJavaOrObjectiveCModule.startFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                  setRunningJavaOrObjectiveCFibonacci(true);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            stop={() => {
              NativeJavaOrObjectiveCModule.stopFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                  setRunningJavaOrObjectiveCFibonacci(false);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            change={() => {
              NativeJavaOrObjectiveCModule.setTimeInterval(
                parseInt(
                  intervalValue.trim().length <= 0
                    ? '5000'
                    : intervalValue.trim(),
                  10,
                ),
              );
              setIntervalValue('');
            }}>
            {fibonacciFromJavaOrObjectiveCModule}
          </Section>
          <Section
            title="Native Kotlin/Swift Module"
            isRunningKotlinOrSwiftFibonacci={isRunningKotlinOrSwiftFibonacci}
            isRunningJavaOrObjectiveCFibonacci={undefined}
            start={() => {
              setFibonacciFromKotlinOrSwiftModule('');
              NativeKotlinOrSwiftModule.startFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                  setRunningKotlinOrSwiftFibonacci(true);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            stop={() => {
              NativeKotlinOrSwiftModule.stopFibonacciStream()
                .then((message: string) => {
                  Alert.alert('Success', `${message}`);
                  setRunningKotlinOrSwiftFibonacci(false);
                })
                .catch((error: any) => {
                  Alert.alert('Got Error', `${error}`);
                });
            }}
            change={() => {
              NativeKotlinOrSwiftModule.setTimeInterval(
                parseInt(
                  intervalValue.trim().length <= 0
                    ? '5000'
                    : intervalValue.trim(),
                  10,
                ),
              );
              setIntervalValue('');
            }}>
            {fibonacciFromKotlinOrSwiftModule}
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
