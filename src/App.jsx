import { useEffect, useRef, useState } from 'react'
// import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';
import _ from 'lodash';
import './App.css'

function App() {

  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  // Create a reference to the worker object.
  const worker = useRef(null);
  let capturedText = "";
  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    

    // document.addEventListener('keydown', function(event) {
    //   // Kiểm tra xem sự kiện có phải là nhập chữ không
    //   if (event.key.length === 1) {
    //     capturedText += event.key;
    //   } else if (event.key === 'Backspace') {
    //     // Xóa ký tự cuối cùng nếu phím Backspace được nhấn
    //     capturedText = capturedText.slice(0, -1);
    //   }

    //   console.log('Captured Text: ', capturedText);
    // });
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      console.log(e);
      // switch (e.data.status) {
      //   case 'update':
          // Generation update: update the output text.
          setOutput(e.data.output[0].generated_text.replace('<s> ', ''));
          // break;
      // }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });


  return (
    <>
      <div className='container'>
        <div className='textbox-container'>
          {/* <input type='text' id='1'/>
          <input type='text' id='2' />
          <input type='text' id='3'/> */}
          <label>Input</label>
          <textarea rows={3} onChange={_.debounce(e => {
            worker.current.postMessage({
              text: e.target.value,
            });
          }, 500)}></textarea>
          <label>Output</label>
          <textarea value={output} rows={3}></textarea>
        </div>
      </div>

      {/* <button disabled={disabled} onClick={translate}>Translate</button> */}

      {/* <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div> */}
    </>
  )
}

export default App
