package com.myfibonacci.kotlin

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.Timer
import java.util.TimerTask

class FibonacciKotlinNativeModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    /**
     * A native variable used for send native event to Javascript side.
     */
    private var streamTimer: Timer?
    /**
     * A native variable used that to store receives milliseconds from JavaScript side.
     */
    private var delayTimeInterval: Double?
    /**
     * A native variable used to generate fibonacci series.
     */
    private var fibonacciSeries: FibonacciSeries?

    init {
        streamTimer = Timer()
        delayTimeInterval = 5000.0
        fibonacciSeries = FibonacciSeries()
    }

    override fun getName(): String {
        return "FibonacciKotlinNativeModule"
    }

    /**
     * Sends a native event to the JavaScript side.
     *
     * @param eventName The string of event name.
     * @param num The fibonacci number.
     */
    private fun sendNativeEventToJS(eventName: String, num: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, num)
    }

    /**
     * A native method that receives milliseconds from JavaScript and set time interval.
     *
     * @param milliseconds The number of milliseconds to trigger fibonacci streaming.
     */
    @ReactMethod
    fun setTimeInterval(milliseconds: Double) {
        delayTimeInterval = milliseconds
    }

    /**
     * A native method that not receives a data from JavaScript and returns nothing.
     *
     * @param promise A Promise that will be resolved or rejected based on the result of the operation.
     */
    @ReactMethod
    fun startFibonacciStream(promise: Promise) {
        try {
            streamTimer?.scheduleAtFixedRate(object : TimerTask() {
                override fun run() {
                    fibonacciSeries?.generateNextFibonacciNum()
                    sendNativeEventToJS("fibonacciKotlinEvent", fibonacciSeries!!.fibonacciNum)
                }
            }, 0, delayTimeInterval!!.toLong())
            sendNativeEventToJS("fibonacciKotlinEvent", fibonacciSeries!!.initFibonacciNum)
            promise.resolve("start fibonacci stream")
        } catch (e: Exception) {
            promise.reject("Failed to start fibonacci stream", e.message)
        }
    }

    /**
     * A native method that not receives a data from JavaScript and returns nothing.
     *
     * @param promise A Promise that will be resolved or rejected based on the result of the operation.
     */
    @ReactMethod
    fun stopFibonacciStream(promise: Promise) {
        try {
            streamTimer?.cancel()
            delayTimeInterval = 5000.0
            streamTimer = Timer()
            delayTimeInterval = 5000.0
            fibonacciSeries = FibonacciSeries()
            fibonacciSeries?.resetFibonacciNum();
            promise.resolve("stop fibonacci stream")
        } catch (e: Exception) {
            promise.reject("Failed to stop fibonacci stream", e.message)
        }
    }
}