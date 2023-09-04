package com.myfibonacci.java;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Timer;
import java.util.TimerTask;

public class FibonacciJavaNativeModule extends ReactContextBaseJavaModule {
    /**
     * A native variable used for send native event to Javascript side.
     */
    private Timer streamTimer;
    /**
     * A native variable used that to store receives milliseconds from JavaScript side.
     */
    private double delayTimeInterval;
    /**
     * A native variable used to generate fibonacci series.
     */
    private FibonacciSeries fibonacciSeries;

    FibonacciJavaNativeModule(ReactApplicationContext context) {
        super(context);
        streamTimer = new Timer();
        delayTimeInterval = 5000;
        fibonacciSeries = new FibonacciSeries();
    }

    @NonNull
    @Override
    public String getName() {
        return "FibonacciJavaNativeModule";
    }

    /**
     * Sends a native event to the JavaScript side.
     *
     * @param eventName The string of event name.
     * @param num The fibonacci number.
     */
    private void sendNativeEventToJS(@NonNull String eventName, String num) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, num);
    }

    /**
     * A native method that receives milliseconds from JavaScript and set time interval.
     *
     * @param milliseconds The number of milliseconds to trigger fibonacci streaming.
     */
    @ReactMethod
    public void setTimeInterval(double milliseconds) {
        delayTimeInterval = milliseconds;
    }

    /**
     * A native method that not receives a data from JavaScript and returns nothing.
     *
     * @param promise A Promise that will be resolved or rejected based on the result of the operation.
     */
    @ReactMethod
    public void startFibonacciStream(Promise promise) {
        try {
            streamTimer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    fibonacciSeries.generateNextFibonacciNum();
                    sendNativeEventToJS("fibonacciJavaEvent", fibonacciSeries.getFibonacciNum());
                }
            }, 0, (long) delayTimeInterval);
            sendNativeEventToJS("fibonacciJavaEvent", fibonacciSeries.getInitFibonacciNum());
            promise.resolve("start fibonacci stream");
        } catch (Exception e) {
            promise.reject("Failed to start fibonacci stream", e.getMessage());
        }
    }

    /**
     * A native method that not receives a data from JavaScript and returns nothing.
     *
     * @param promise A Promise that will be resolved or rejected based on the result of the operation.
     */
    @ReactMethod
    public void stopFibonacciStream(Promise promise) {
        try {
            if(streamTimer != null) {
                streamTimer.cancel();
            }
            delayTimeInterval = 5000;
            streamTimer = new Timer();
            delayTimeInterval = 5000;
            fibonacciSeries = new FibonacciSeries();
            fibonacciSeries.resetFibonacciNum();
            promise.resolve("stop fibonacci stream");
        } catch (Exception e) {
            promise.reject("Failed to stop fibonacci stream", e.getMessage());
        }
    }
}