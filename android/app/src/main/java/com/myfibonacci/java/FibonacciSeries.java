package com.myfibonacci.java;

class FibonacciSeries {
    private long num;
    private long num1;
    private long num2;

    FibonacciSeries() {
        num = 0;
        num1 = 0;
        num2 = 1;
    }

    public String getInitFibonacciNum() {
        return num1 + " " + num2;
    }

    public String getFibonacciNum() {
        return " " + num;
    }

    public void generateNextFibonacciNum() {
        num = num1 + num2;
        num1 = num2;
        num2 = num;
    }

    public void resetFibonacciNum() {
        num = 0;
        num1 = 0;
        num2 = 1;
    }
}