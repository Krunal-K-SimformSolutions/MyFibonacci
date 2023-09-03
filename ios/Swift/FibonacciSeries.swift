//
//  FibonacciSeries.swift
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

import Foundation

class FibonacciSeries {
  private var num: UInt64?
  private var num1: UInt64?
  private var num2: UInt64?
  
  init() {
    num = 0
    num1 = 0
    num2 = 1
  }
  
  public func getInitFibonacciNum() -> String {
    return "\(num1 ?? 0) \(num2 ?? 0)"
  }
  
  public func getFibonacciNum() -> String {
    return " \(num ?? 0)"
  }
  
  public func generateNextFibonacciNum() -> Void {
    num = (num1 ?? 0) + (num2 ?? 0)
    num1 = num2
    num2 = num
  }
  
  public func resetFibonacciNum() -> Void {
    num = 0
    num1 = 0
    num2 = 1
  }
}
