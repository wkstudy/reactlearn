
const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: Text,
      children: []
    }
    
  }
}
//  React.createElement()
const createElement = (type, children, ...props) => {
  // The children array could also contain primitive values like strings or numbers. So we’ll wrap everything that isn’t an object inside its own element and create a special type for them: TEXT_ELEMENT.
  
  // React doesn’t wrap primitive values or create empty arrays when there aren’t children, but we do it because it will simplify our code, and for our library we prefer simple code than performant code.
  
  // 如果children不是object, 而是一些基本类型数据，则这里把他们处理成一个type=TEXT_ELEMTNT的节点
  // react并不会这么做，这里只是为了简化我们的代码
  return {
    type,
    props: {
      ...props,
      children: children.map(item => {
        return typeof item === 'object' ? item : createTextElement(item);
      })
    },
  }
}

const render = (element , container) => {
  const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode(element.children) :  document.createElement(element);

  //  子元素重复着一操作
  element.props.children.map(item => {
    render(item, dom);
  })
  //  把属性加到dom上
  const isProperty = key => key !== 'children';
  Object.keys(element.props).filter(isProperty).forEach(item => dom[item] = element.props[item])

  container.appendChild(dom);
}

const MyReact = {
  createElement,
  render,
}

// If we have a comment like this one, when babel transpiles the JSX it will use the function we define.
//  我也不知道为啥babel就会使用我们定义的createElement()
/** @jsx MyReact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const container = document.getElementById('root');
MyReact.render(element, container);