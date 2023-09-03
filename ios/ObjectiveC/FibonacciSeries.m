//
//  FibonacciSeries.m
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

#import "FibonacciSeries.h"

@implementation FibonacciSeries

- (instancetype)init {
  self = [super init];
  if (self) {
    _num = @0;
    _num1 = @0;
    _num2 = @1;
  }
  return self;
}

- (NSString*) getInitFibonacciNum
{
  return [NSString stringWithFormat:@"%@ %@", self.num1, self.num2];
}

- (NSString*) getFibonacciNum
{
  return [NSString stringWithFormat:@" %@", self.num];
}

- (void) generateNextFibonacciNum
{
  self.num = [NSNumber numberWithLong:([self.num1 longValue] + [self.num2 longValue])];
  self.num1 = self.num2;
  self.num2 = self.num;
}

- (void) resetFibonacciNum
{
  _num = @0;
  _num1 = @0;
  _num2 = @1;
}
@end
