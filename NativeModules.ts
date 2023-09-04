import {NativeModules, Platform, type NativeModule} from 'react-native';

declare module 'react-native' {
  interface NativeModulesStatic {
    FibonacciJavaNativeModule: NativeModuleType & NativeModule;
    FibonacciKotlinNativeModule: NativeModuleType & NativeModule;
    FibonacciObjectiveCNativeModule: NativeModuleType & NativeModule;
    FibonacciSwiftNativeModule: NativeModuleType & NativeModule;
    NativeJavaOrObjectiveCModule: NativeModuleType & NativeModule;
    NativeKotlinOrSwiftModule: NativeModuleType & NativeModule;
  }
}

/* The `export interface NativeModuleType` is defining the shape of the `NativeModule` object that is
  exported from the module. It specifies the available methods and their signatures that can be called
  on the `NativeJavaModule` or `NativeKotlinModule`. */
export interface NativeModuleType {
  /**
   * Calls a native method from JavaScript and set time interval to trigger to get fibonacci number.
   * @param {number} milliseconds - The milliseconds to be passed from JavaScript to the native code.
   * @returns {void} The nothing, or null if an error occurs.
   * @throws {Error} If there is an issue when set time interval.
   * @memberof NativeJavaModule,NativeKotlinModule
   * @name setTimeInterval
   * @example
   *
   * // Calling the native method and handling the Promise
   * <NativeJavaModule|NativeKotlinModule>.setTimeInterval(5000);
   */
  setTimeInterval: (milliseconds: number) => void;

  /**
   * Native module method that not receives a data from JavaScript and returns the fibonacci number
   * as a Promise. This method is intended to be called from React Native JavaScript code.
   *
   * @param {Promise} promise - A Promise that will be resolved or rejected based on the result of the operation.
   * @returns {string|null} The fibonacci number, or null if an error occurs.
   * @throws {Error} If there is an issue fetching the fibonacci number.
   * @memberof NativeJavaModule,NativeKotlinModule
   * @name startFibonacciStream
   * @example
   *
   * // Calling the native method and handling the Promise
   * <NativeJavaModule|NativeKotlinModule>.startFibonacciStream()
   *   .then(fibonacciNum => {
   *     console.log('Fibonacci Number:', fibonacciNum);
   *   })
   *   .catch(error => {
   *     console.error('Error:', error);
   *   });
   */
  startFibonacciStream: () => Promise<string>;

  /**
   * Native module method that not receives a data from JavaScript and returns the 'stop fibonacci stream' string
   * as a Promise. This method is intended to be called from React Native JavaScript code.
   *
   * @param {Promise} promise - A Promise that will be resolved or rejected based on the result of the operation.
   * @returns {string|null} The stop fibonacci stream, or null if an error occurs.
   * @throws {Error} If there is an issue when stop.
   * @memberof NativeJavaModule,NativeKotlinModule
   * @name stopFibonacciStream
   * @example
   *
   * // Calling the native method and handling the Promise
   * <NativeJavaModule|NativeKotlinModule>.stopFibonacciStream()
   *   .then(message => {
   *     console.log('Fibonacci Message:', message);
   *   })
   *   .catch(error => {
   *     console.error('Error:', error);
   *   });
   */
  stopFibonacciStream: () => Promise<string>;
}

const ModuleName = Platform.select({
  android: ['FibonacciJavaNativeModule', 'FibonacciKotlinNativeModule'],
  ios: ['FibonacciObjectiveCNativeModule', 'FibonacciSwiftNativeModule'],
  default: [],
});

const ModuleEventName = Platform.select({
  android: ['fibonacciJavaEvent', 'fibonacciKotlinEvent'],
  ios: ['fibonacciObjectiveCEvent', 'fibonacciSwiftEvent'],
  default: [],
});

const {
  [ModuleName[0]]: NativeJavaOrObjectiveCModule,
  [ModuleName[1]]: NativeKotlinOrSwiftModule,
} = NativeModules;
export {
  NativeJavaOrObjectiveCModule,
  NativeKotlinOrSwiftModule,
  ModuleEventName,
};
