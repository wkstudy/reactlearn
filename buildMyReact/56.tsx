

let nextUnitOfWork = null;
let wipRoot = null;


function commitRoot () {
  commitWork(wipRoot.child);
  wipRoot = null;
}
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function workLoop (deadline) {
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );
    shouldYield  = deadline.timeRemaining() < 1
  }
  if(!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop);
}


requestIdleCallback(workLoop)
// You can think of requestIdleCallback as a setTimeout, but instead of us telling it when to run, the browser will run the callback when the main thread is idle.
// requestIdleCallback also gives us a deadline parameter. We can use it to check how much time we have until the browser needs to take control again.


function performUnitOfWork (fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber);
  }
  // if (fiber.parent) {
  //   fiber.parent.appendChild(fiber.dom);
  // }

  // create new fibers
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while(index < elements.length) {
    const element = elements[index];
    const newFiber = {
      dom: null,
      parent: fiber,
      props: element.props,
      type: element.type
    }
    
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while(nextFiber) {
    if (fiber.sibling) {
      return fiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function createDOM (fiber) {

}

function render (element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
  }
  nextUnitOfWork = wipRoot;
}
