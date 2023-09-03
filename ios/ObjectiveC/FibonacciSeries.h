//
//  FibonacciSeries.h
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface FibonacciSeries : NSObject

@property (assign) NSNumber *num;
@property (assign) NSNumber *num1;
@property (assign) NSNumber *num2;

- (NSString*) getInitFibonacciNum;
- (NSString*) getFibonacciNum;
- (void) generateNextFibonacciNum;
- (void) resetFibonacciNum;

@end

NS_ASSUME_NONNULL_END
