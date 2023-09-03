//
//  FibonacciObjectiveCNativeModule.m
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

#import <Foundation/Foundation.h>
#import "FibonacciObjectiveCNativeModule.h"
#import <React/RCTLog.h>

@implementation FibonacciObjectiveCNativeModule

- (instancetype)init {
  self = [super init];
  if (self) {
    _delayTimeInterval = @5000;
    _fibonacciSeries = [[FibonacciSeries alloc] init];
  }
  return self;
}

/**
 RCT_EXPORT_MODULE macro, which exports and registers the native module class with React Native, also takes an optional argument and is not a string literal.
 
 Objective-C class name, with any "RCT" or "RK" prefixes removed.
 RCT_EXPORT_MODULE(); // NativeModule
 
 JS We can use like below:
 const { FibonacciObjectiveCNativeModule } = ReactNative.NativeModules;
 */
RCT_EXPORT_MODULE(FibonacciObjectiveCNativeModule); // FibonacciObjectiveCNativeModule

- (NSArray<NSString *> *)supportedEvents {
  return @[@"fibonacciObjectiveCEvent"];
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

/**
 * Sends a native event to the JavaScript side.
 *
 * @param eventName The string of event name.
 * @param num The fibonacci number.
 */
- (void) sendNativeEventToJS: (NSString *)eventName _:(NSString *)num
{
  [self sendEventWithName:eventName body:num];
}

/**
 * A native method that receives milliseconds from JavaScript and set time interval.
 *
 * @param milliseconds The number of milliseconds to trigger fibonacci streaming.
 */
RCT_EXPORT_METHOD(setTimeInterval: (NSNumber *)milliseconds)
{
  RCTLogInfo(@"Passing data from JS to Native: %@", milliseconds);
  self.delayTimeInterval = milliseconds;
}

/**
 * A native method that not receives a data from JavaScript and returns nothing.
 *
 * @param promise A Promise that will be resolved or rejected based on the result of the operation.
 */
RCT_EXPORT_METHOD(startFibonacciStream: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
{
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      self.streamTimer = [NSTimer scheduledTimerWithTimeInterval:[self.delayTimeInterval doubleValue] / 1000 repeats:YES block:^(NSTimer *timer) {
        [self.fibonacciSeries generateNextFibonacciNum];
        [self sendNativeEventToJS:@"fibonacciObjectiveCEvent" _:[self.fibonacciSeries getFibonacciNum]];
      }];
    });
    [self sendNativeEventToJS:@"fibonacciObjectiveCEvent" _:[self.fibonacciSeries getInitFibonacciNum]];
    resolve(@"start fibonacci stream");
  } @catch (NSError *error) {
    reject(@"event_failure", @"Failed to start fibonacci stream", error);
  }
}

/**
 * A native method that not receives a data from JavaScript and returns nothing.
 *
 * @param promise A Promise that will be resolved or rejected based on the result of the operation.
 */
RCT_EXPORT_METHOD(stopFibonacciStream: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
{
  @try {
    if(self.streamTimer != nil) {
      [self.streamTimer invalidate];
    }
    self.delayTimeInterval = @5000;
    [self.fibonacciSeries resetFibonacciNum];
    resolve(@"stop fibonacci stream");
  } @catch (NSError *error) {
    reject(@"event_failure", @"Failed to stop fibonacci stream", error);
  }
}

@end

