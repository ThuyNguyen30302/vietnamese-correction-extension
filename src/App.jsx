import { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import './App.css';
import UserTypings from './components/UserTypings';
import * as ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { Popover } from 'antd';

function App() {
  // Model loading
  
  const [input, setInput] = useState('Xin chao Viet Nam');
  const [output, setOutput] = useState('Xin chào Việt Nam');
  const [position, setPosition] = useState(0);


  // Create a reference to the worker object.
  const worker = useRef(null);

  // Use the useEffect hook with an empty dependency array for one-time setup.
  useEffect(() => {
    const contentEditableElement = document.querySelector('[contentEditable="true"]');
    // Define a debounced input handler.
    const handleInput = _.debounce((e) => {
      // if (window.getSelection()) {
      //   setPosition(window.getSelection().anchorOffset)
      //   console.log(window.getSelection());
      // }
      console.log('e.target.textContent', e.target.textContent);
      setInput(e.target.textContent);
      worker.current.postMessage({ text: e.target.textContent });
    }, 1000);

    // Attach the input event listener to the contentEditable element.
    contentEditableElement.addEventListener('input', handleInput);

    // Define a cleanup function for when the component is unmounted.
    return () => {
      contentEditableElement.removeEventListener('input', handleInput);
    };
  }, []);

  useEffect(() => {
    
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived =  _.debounce((e) => {
      // const userTypingsElement = (
      //   <UserTypings input={input} output={e.data.output[0].generated_text.replace('<s> ', '')} />
      // );

      // const contentEditableElement = document.querySelector('[contentEditable="true"]');
      // if (!contentEditableElement) return; 
      // const pElement = contentEditableElement.querySelector('p');
      // if (!pElement) return; 

      // pElement.innerHTML = renderToString(userTypingsElement)
      // const childNodes = pElement.childNodes;
      // let startLenght = 0;
      // let endLenght = childNodes[0].length;
      // let index = 0;
      // let indexItem = 0;
      // _.forEach(childNodes, (item, i) => {
      //   if (i !== 0) {
      //     switch(item.nodeType) {
      //       case Node.ELEMENT_NODE: 
      //         startLenght += item.innerHTML.length;
      //         endLenght += item.innerHTML.length;
      //         break;
      //       case Node.TEXT_NODE:  
      //         startLenght += item?.length;
      //         endLenght += item?.length;
      //         break;
      //       default:
      //         break;
      //     }
      //   }

      //   if (position<=endLenght && position>=startLenght) {
      //     indexItem = i;
      //     index = position - startLenght;
      //   }
      // }) 

      // const range = document.createRange()
      // switch(childNodes[indexItem].nodeType) {
      //   case Node.ELEMENT_NODE: 
      //     range.setStart(childNodes[indexItem].firstChild, index)
      //     break;
      //   case Node.TEXT_NODE:  
      //     range.setStart(childNodes[indexItem], index)
      //     break;
      //   default:
      //     break;
      // }

      // range.collapse(true);
      // const selection = window.getSelection(); 
      // // range.setEnd(contentEditableElement.firstChild, wordIndex+4)
      // if (range) {
      //   selection.removeAllRanges();
      //   selection.addRange(range);
      // }




      // while (contentEditableElement.firstChild) {
      //   contentEditableElement.removeChild(contentEditableElement.firstChild);
      // }
      
      // const paragraphElement = document.createElement('p');
      // ReactDOM.render(userTypingsElement, paragraphElement);
      // contentEditableElement.appendChild(paragraphElement);
      console.log('e.data.output[0]', e.data.output[0].generated_text.replace('<s> ', ''));
      setOutput(e.data.output[0].generated_text.replace('<s> ', ''));
    }, 1000);

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    return () => {
      worker.current.removeEventListener('message', onMessageReceived);
    };

  }, [input]);

  

  useEffect(() => {
    const contentEditableElement = document.querySelector('[contentEditable="true"]');
    // Define a debounced input handler.
    const handleClick = (e) => {
      if (!input || !output) return;
      let positionPointer = {};
      const selection = window.getSelection(); 
      if (selection) {
        positionPointer = setPosition(window.getSelection().anchorOffset)
        setPosition(positionPointer);
        console.log('window.getSelection()', window.getSelection());
      }
      const userTypingsElement = (
        <UserTypings input={input} output={output} />
      );

      const contentEditableElement = document.querySelector('[contentEditable="true"]');
      

      while (contentEditableElement.firstChild) {
        contentEditableElement.removeChild(contentEditableElement.firstChild);
      }
      
      const paragraphElement = document.createElement('p');
      ReactDOM.render(userTypingsElement, paragraphElement);
      contentEditableElement.appendChild(paragraphElement);
    //   pElement.innerHTML = renderToString(userTypingsElement)
    //   const childNodes = pElement.childNodes;
    //   let startLenght = 0;
    //   let endLenght = childNodes[0].length;
    //   let index = 0;
    //   let indexItem = 0;
    //   _.forEach(childNodes, (item, i) => {
    //     if (i !== 0) {
    //       switch(item.nodeType) {
    //         case Node.ELEMENT_NODE: 
    //           startLenght += item.innerHTML.length;
    //           endLenght += item.innerHTML.length;
    //           break;
    //         case Node.TEXT_NODE:  
    //           startLenght += item?.length;
    //           endLenght += item?.length;
    //           break;
    //         default:
    //           break;
    //       }
    //     }

    //     if (positionPointer<=endLenght && positionPointer>=startLenght) {
    //       indexItem = i;
    //       index = positionPointer - startLenght;
    //     }
    //   }) 

    //   const range = document.createRange()
    //   switch(childNodes[indexItem].nodeType) {
    //     case Node.ELEMENT_NODE: 
    //       range.setStart(childNodes[indexItem].firstChild, index)
    //       break;
    //     case Node.TEXT_NODE:  
    //       range.setStart(childNodes[indexItem], index)
    //       break;
    //     default:
    //       break;
    //   }

    //   range.collapse(true);
    //   // range.setEnd(contentEditableElement.firstChild, wordIndex+4)
    //   if (range) {
    //     selection.removeAllRanges();
    //     selection.addRange(range);
    //   }
    //   // console.log('input', input);
    //   // console.log('output', output);
    };

    // Attach the input event listener to the contentEditable element.
    contentEditableElement.addEventListener('click', handleClick);

    // Define a cleanup function for when the component is unmounted.
    return () => {
      contentEditableElement.removeEventListener('click', handleClick);
    };
  }, [output]);
  // useEffect(() => {
  //   const incorrectWords = document.querySelectorAll('[data-incorrect-word]');
  
  //   // Define a debounced input handler.
  //   const handleClick = (e) => {
  //     console.log(e, 'event');
  //     incorrectWords.forEach(wordElement => {
  //       const correctWord = "đúng";
  //       ReactDOM.createPortal(
  //         <Popover content={`Đúng: ${correctWord}`}> 
  //           {wordElement.textContent} 
  //         </Popover>,
  //         wordElement
  //       );
  //     });
  //   }

  //   // Attach the input event listener to the contentEditable element.
  //   incorrectWords.addEventListener('click', handleClick);

  //   // Define a cleanup function for when the component is unmounted.
  //   return () => {
  //     incorrectWords.removeEventListener('click', handleClick);
  //   };
  // });

  return (
    <div>
      <div
        contentEditable={true}
        aria-label="Tin nhắn"
        style={{
          width: 500,
          userSelect: 'text',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          border: '1px solid black'
        }}
      >
        <p><br /></p>
      </div>
    </div>
  );
}

export default App;
