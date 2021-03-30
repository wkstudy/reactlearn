let nextUnitOfWork = null

function workLoop (deadline) {
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );
    shouldYield  = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop);
}


requestIdleCallback(workLoop)
// You can think of requestIdleCallback as a setTimeout, but instead of us telling it when to run, the browser will run the callback when the main thread is idle.
// requestIdleCallback also gives us a deadline parameter. We can use it to check how much time we have until the browser needs to take control again.