//
//  FibonacciSwiftNativeModule.m
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "FibonacciSeries.h"

@interface RCT_EXTERN_MODULE(FibonacciSwiftNativeModule, RCTEventEmitter)

RCT_EXTERN_METHOD(setTimeInterval: (nonnull NSNumber *)milliseconds);
RCT_EXTERN_METHOD(startFibonacciStream: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject);
RCT_EXTERN_METHOD(stopFibonacciStream: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject);

@end
