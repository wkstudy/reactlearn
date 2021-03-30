#
[build-your-own-react](https://pomb.us/build-your-own-react/)

## 总结
### Step I: The createElement Function
所以createElement就是把babel把jsx转化后的结果再次进行转化？

### Step II: The render Function
render  了解了


### Step III: Concurrent Mode
* 背景： render的内容太多的话会占据主线程太多时间，阻塞用户输入/动画等时间等事件
* 方案：　拆分work为小的units,每次有units要执行的时候就interrupt rendering
> So we are going to break the work into small units, and after we finish each unit we’ll let the browser interrupt the rendering if there’s anything else that needs to be done.
