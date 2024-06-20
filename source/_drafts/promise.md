---
title: promise
tags: 
date: 2024-06-17
categories: translate
---
# Promise/A+

一个 *promise* 代表一个异步操作的最终结果。与一个 promise 交互的主要方式是通过它的 `then` 方法，`then` 方法注册回调来接收一个 promise 的终值或者 promise 不能兑现的原因。

这份规范详细说明了 `then` 方法的行为，提供了一个所有符合 Pormises/A+ 的 promise 实现都能依赖的互操作基础。这样，这份规范应该被认为是非常稳定的。虽然 Promises/A+ 组织有时可能通过较小的向后兼容修改来解决新发现的极端情况，我们只会在经过仔细考虑，讨论和测试后才会集成较大或者不向后兼容的修改。

历史上，Promises/A+ 阐明了之前的 Promises/A 提案的行为条款，拓展了它以覆盖事实行为，并忽略了未明确说明或者有问题的部分。

最终，Promises/A+ 规范的核心不是解决如何创建、完成或者拒绝 promises，而是选择专注于提供一个可用互操作的 `then` 方法。前者那些主题可能在未来配套规范的工作中会涉及。

## 1. Terminology

> Function：函数
> Object： 逻辑或数据结构的集合
> Value：值

1. “promise” 是一个有 `then` 方法并且行为符合这个规范的对象或函数。
2. “thenable” 是一个定义了 `then` 方法的对象或函数。
3. “value” 是任意一个 JavaScript 里合法的值（包括 `undefined`，一个 thenable 或者一个 promise）。
4. “exception” 是一个通过 `throw` 语句抛出的值。
5. “reason” 是一个指示为什么 promise 被拒绝的值。

## 2. Requirements

### 2.1 Promise States

> Pending: 等待；fulfilled：兑现；rejectd：拒绝。

一个 promise 必须处于以下三个状态中：pending，fulfilled 或 rejected。

1. 一个 promise 处于等待时：
    1. 可能转成 fulfiled 或者 rejected 状态。
2. 一个 promise 兑现时：
    1. 必须不能转换成任何其他状态。
    2. 必须有一个不能被改变的值。
3. 一个 promise 被拒绝时：
    1. 必须不能转换成任何其他状态。
    2. 必须有一个不能被改变的原因（reasone）。

这里的“不能被改变”指标识不可变（如：`===`），但不意味着深不可变。

### 2.2 The `then` Method

一个 promise 必须提供一个用来获取它当前或者最终值或原因的 `then` 方法。

一个 promise 的 `then` 方法接受两个参数：

```javascript
promise.then(onFulfiled, onRejected)
```

1. `onFulfiled` 和 `onRejected` 都是可选参数:
    1. 如果 `onFulfilled` 不是一个函数，那么必须忽略。
    2. 如果 `onRejected` 不是一个函数，那么必须忽略。
2. 如果 `onFulfilled` 是一个函数：
    1. 必须在 `promise` 兑现后调用，以 `promise` 的值作为第一个参数。
    2. 不能在 `promise` 兑现前调用。
    3. 不能调用超过一次。
3. 如果 `onRejected` 是一个函数：
    1. 必须在 `promise` 被拒绝后调用，以 `promise` 的原因作为第一个参数。
    2. 不能在 `promise` 被拒绝前调用。
    3. 不能调用超过一次。
4. `onFulfilled` 或 `onRejected` 不能被调用，直到[执行上下文](https://es5.github.io/#x10.3)栈只包含平台代码。平台代码指引擎、环境和 promise 实现代码。实际上，这要求保证 `onFulfilled` 和 `onRejected` 在被调用的 `then` 的事件循环（event loop）后异步执行，并且用一个新鲜的栈。这可用通过例如 `setTimeout` 或者 `setImmediate` 这种 “macro-task” 机制来实现，或者用 `MutationObserver` 或者 `process.nextTick` 这种 “micro-task” 机制实现。因为 promise 实现被视为平台代码，可能其内部包含一个调用处理程序的任务调度队列或者 “trampoline” 。
5. `onFulfilled` 和 `onRejected` 必须作为函数调用（例如没有 `this` 值）。因为在严格模式中，在它们内部 `this` 会是 `undefined`；在松散模式，它会是一个全局对象。
6. 同一个 promise 的 `then` 可能被调用多次。
    1. 如果 `promise` 兑现了，所有 `onFulfilled` 回调必须以各自属于的调用 `then` 的顺序执行。
    2. 如果 `promise` 被拒绝，`onRejected` 回调执行的顺序同上。
7. `then` 必须返回一个 promise。
    ``` javascript
     promise2 = promise1.then(onFulfilled, onRejected);
    ```
    1. 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x`，执行 Promise 解决程序 `[[Resolve]](promise2, x)`  [2.3 The Promise Resolution Procedure](#2.3%20The%20Promise%20Resolution%20Procedure) 。
    2. 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，`promise2` 必须以 `e` 为原因被拒绝。
    3. 如果 `onFulfilled` 不是一个函数并且 `promise1` 被兑现，`promise2` 必须以和 `promise1` 同样的值被兑现。
    4. 如果 `onRejected` 不是一个函数并且 `promise1` 被拒绝，`promise2` 必须以和 `promise1` 同样的原因被拒绝。

### 2.3 The Promise Resolution Procedure

**Promise Resolutin Procedure** 是一个抽象操作，以一个 promise 和一个值作为输入，用 `[[Resolve]](promise, x)` 表示。如果 `x` 是一个 thenable，它会让 `promise` 采用 `x` 的状态，在 `x` 的行为多少会像一个 promise 的假设下。否则，它以 `x` 为值兑现 `promise` 。

这种 thenables 的处理允许 promise 的实现们可用互操作，只要它们暴露一个 Promises/A+-合规的 `then` 方法。它也允许 Promises/A+ 实现同化不一致的实现，只要它有合理的 `then` 方法。

执行以下步骤来运行 `[[Resolve]](promise, x)`：

1. 如果 `promise` 和 `x` 指向同一个对象，以 `TypeError` 为原因拒绝 `promise`。
2. 如果 `x` 是一个 promise，采用它的状态：
    1. 如果 `x` 在等待，`promise` 必须保持等待直到 `x` 兑现或拒绝。
    2. 当 `x` 已兑现，以同样的值兑现 `promise`。
    3. 当 `x` 被拒绝，以同样的原因拒绝 `promise` 。
3. 否则，如果 `x` 是一个对象或者函数，
    1. 让 `then` 成为 `x.then`。
    2. 如果检索属性 `x.then` 导致抛出异常 `e`，以 `e` 为原因拒绝 `promise`。
    3. 如果 `x` 的 `then` 属性是一个函数，以 `x` 为 `this` 调用它，第一个参数为 `resolvePromise`， 第二个参数为 `rejectPromise`，其中：
        1. 如果 `resolvePromise` 调用时传入值 `y` ，运行 `[[Resolve]](promise, y)`。
        2. 如果 `rejectPromise` 调用时传入原因 `r`，以 `r` 拒绝 `promise`。
        3. 如果 `resolvePromise` 和 `rejectPromise` 都被调用，或者多次调用同一个参数，只执行第一次调用，任何其他的调用都被忽略。
        4. 如果调用 `then` 抛出异常 `e`，
            1. 如果 `resolvePromise` 或者 `rejectPromise` 已被调用，忽略掉。
            2. 否则以 `e` 为原因拒绝 `promise`。
    4. 如果 `x` 的 `then` 属性不是一个函数，以 `x` 兑现 `promise`。
4. 如果 `x` 不是一个对象或者函数，以 `x` 兑现 `promise`。

如果一个 promise


# We have a problem with promise