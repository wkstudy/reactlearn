[关于useState的一切](https://zhuanlan.zhihu.com/p/200855720)

```
function App() {
  // hookA
  const [a, updateA] = useState(0);
  // hookB
  const [b, updateB] = useState(0);
  // hookC
  const ref = useRef(0);
  
  return <p></p>;
}

```



> 每个组件有个对应的fiber节点（可以理解为虚拟DOM），用于保存组件相关信息。

vue react的组件设计一样，其实都是vnode(但目前react的也称做fiber，我理解vnode和fiber仅是数据结构的差别)，既然是vnode，那么肯定是定义了一堆组件要用的数据

> 每次FunctionComponent render时，全局变量currentlyRenderingFiber都会被赋值为该FunctionComponent对应的fiber节点。

vue中每个组件都是个watcher,也有一个currentWatcher变量记录当前是哪个wathcer在调用（因为同一时刻应该只有一个watcher在执行）

>FunctionComponent的render本身只是函数调用。

render()一次，就是执行了一次hook，执行hook的结果就是得到了我们页面中要使用的数据( a b ref),所以 组件中用到的数据都是保存在hook里的


> currentlyRenderingFiber.memoizedState中保存一条hook对应数据的单向链表。

```
// fiberApp 就类似于vue中的 vnodeApp
fiberApp.memoizedState = hookA;
hookA.next = hookB;
hookB.next = hookC
```
这个结构导致hook执行的顺序不能变（不能放在条件语句当中）

> 
```const hook = {
  // hook保存的数据
  memoizedState: null,
  // 指向下一个hook
  next: hookForB
  // 本次更新以baseState为基础计算新的state
  baseState: null,
  // 本次更新开始时已有的update队列
  baseQueue: null,
  // 本次更新需要增加的update队列
  queue: null,
};
```

对应的
```
const [memoizedState, dispatchAction] = useState(0)
```
dispatchAction 可以是val 或者 function，
每次`setCount()`，其实都是在dispatchAction,dispatchAction的结果是返回一个update,并把update放到queue中
```
const update = {
  // 更新的数据
  action: 1,
  // 指向下一个更新
  next: null
  // ...省略其他字段
};
```
一次`setCount()`，就会把当前的queue中的东西都执行了，得到的值存到`memoizedState`里，完成更新

对于 update1.next = update2,执行过程是
```
baseState = update1.action
baseState = update2.action
// 两个update执行完毕之后 得到最终值
memoizedState = baseState 
```
这里就解释了连点5次结果为1,如果想变为5，那么就需要传action为函数,这样就可以用到前一次点击的值了
```
baseState = update1.action(baseState)
baseState = update2.action(baseState)
```
