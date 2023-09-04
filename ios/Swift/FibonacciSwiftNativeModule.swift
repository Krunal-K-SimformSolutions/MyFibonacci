//
//  FibonacciSwiftNativeModule.swift
//  MyFibonacci
//
//  Created by Krunal Kevadiya on 03/09/23.
//

import Foundation

@objc(FibonacciSwiftNativeModule)
class FibonacciSwiftNativeModule: RCTEventEmitter  {
  /**
   * A native variable used for send native event to Javascript side.
   */
  var streamTimer: Timer? = nil
  /**
   * A native variable used that to store receives milliseconds from JavaScript side.
   */
  var delayTimeInterval: Double? = nil
  /**
   * A native variable used to generate fibonacci series.
   */
  var fibonacciSeries: FibonacciSeries? = nil
  
  override init() {
    super.init()
    streamTimer = Timer()
    delayTimeInterval = 5000
    fibonacciSeries = FibonacciSeries()
  }
  
  /**
   * Sends a native event to the JavaScript side.
   *
   * @param eventName The string of event name.
   * @param num The fibonacci number.
   */
  @objc
  override func supportedEvents() -> [String] {
    return ["fibonacciSwiftEvent"]
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  override var methodQueue: DispatchQueue {
    get {
      return DispatchQueue.main
    }
  }
  
  /**
   * Sends a native event to the JavaScript side.
   *
   * @param eventName The string of event name.
   * @param num The fibonacci number.
   */
  func sendNativeEventToJS(_ eventName: String, num: String) {
      sendEvent(withName: eventName, body: num)
  }
  
  /**
   * A native method that receives milliseconds from JavaScript and set time interval.
   *
   * @param milliseconds The number of milliseconds to trigger fibonacci streaming.
   */
  @objc
  func setTimeInterval(_ milliseconds: Double) -> Void {
    delayTimeInterval = milliseconds
  }
  
  @objc
  func sendFibonacci() -> Void {
    self.fibonacciSeries?.generateNextFibonacciNum()
    self.sendNativeEventToJS("fibonacciSwiftEvent", num: self.fibonacciSeries!.getFibonacciNum())
  }

  /**
   * A native method that not receives a data from JavaScript and returns nothing.
   *
   * @param promise A Promise that will be resolved or rejected based on the result of the operation.
   */
  @objc
  func startFibonacciStream(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      self.streamTimer = Timer.scheduledTimer(timeInterval: self.delayTimeInterval! / 1000, target: self, selector: #selector(self.sendFibonacci), userInfo: nil, repeats: true)
      sendNativeEventToJS("fibonacciSwiftEvent", num: fibonacciSeries!.getInitFibonacciNum())
      resolver("start fibonacci stream")
    } catch let error {
      rejecter("event_failure", "Failed to start fibonacci stream", error)
    }
  }
  
  /**
   * A native method that not receives a data from JavaScript and returns nothing.
   *
   * @param promise A Promise that will be resolved or rejected based on the result of the operation.
   */
  @objc
  func stopFibonacciStream(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    do {
        streamTimer?.invalidate()
        delayTimeInterval = 5000
        fibonacciSeries?.resetFibonacciNum()
        resolver("stop fibonacci stream")
    } catch let error {
      rejecter("event_failure", "Failed to stop fibonacci stream", error)
    }
  }
}
