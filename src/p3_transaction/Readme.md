## transaction

1. React 的 batchUpdates 就是一种 transaction 的实现。但它只处理了多个同步渲染的合并，而且被限制在通过 syntheticEvent 触发的代码中。
2. mobx 的 action 就是基于 transaction 实现的，覆盖了 React 的 batchUpdates 的功能。
3. 同时 mobx 对 glitches 的处理，也是通过 transaction 来实现的。 - 所有 reaction 都是在一个 action 中标记，然后在这个 action 结束之后，同步执行的。
4. mobx 可以同时作为【应用状态】和【视图数据】，而 hooks/props 混淆了【应用状态】和【视图数据】，导致闭包问题。
