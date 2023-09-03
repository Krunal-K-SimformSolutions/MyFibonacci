//
//  FibonacciObjectiveCNativeModule.h
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

#ifndef FibonacciObjectiveCNativeModule_h
#define FibonacciObjectiveCNativeModule_h


#endif /* FibonacciObjectiveCNativeModule_h */

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "FibonacciSeries.h"

@interface FibonacciObjectiveCNativeModule: RCTEventEmitter<RCTBridgeModule>

@property (assign) NSTimer *streamTimer;
@property (assign) NSNumber *delayTimeInterval;
@property (strong) FibonacciSeries *fibonacciSeries;

@end
