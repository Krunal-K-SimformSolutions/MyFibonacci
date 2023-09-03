package com.myfibonacci.kotlin


class FibonacciSeries {
    private var num: Long? = null
    private var num1: Long? = null
    private var num2: Long? = null

    val initFibonacciNum: String
        get() = "${num1 ?: 0} ${num2 ?: 0}"

    val fibonacciNum: String
        get() = " ${num ?: 0}"

    fun generateNextFibonacciNum() {
        num = (num1 ?: 0) + (num2 ?: 0)
        num1 = num2
        num2 = num
    }

    fun resetFibonacciNum() {
        num = 0
        num1 = 0
        num2 = 1
    }

    init {
        num = 0
        num1 = 0
        num2 = 1
    }
}