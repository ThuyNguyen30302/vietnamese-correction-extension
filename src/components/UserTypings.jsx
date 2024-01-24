import _ from "lodash";
import  { useEffect } from 'react';
import { Popover } from 'antd';
import { renderToString } from 'react-dom/server';
import * as ReactDOM from 'react-dom';

const UserTypings = ({ input, output }) => {

  const listTypedWords = _.split(input, " ");
  const listOutput = _.split(output, " ");

  if (listOutput.length !== listTypedWords.length) return null;

  useEffect(() => {
    const incorrectWords = document.querySelectorAll('[data-incorrect-word-content]');
    console.log('incorrectWords', incorrectWords);

    const handleClick = (event) => {
      console.log('event', event);
      const wordElement = event.target;
      const correctWord = "đúng"; // Thay thế với logic để lấy từ đúng

      // Tạo popover ở đây
      const popoverElement = document.createElement('div');
      ReactDOM.render(
        <Popover content={`Đúng: ${correctWord}`} visible={true}>
          <span>{wordElement.textContent}</span>
        </Popover>,
        popoverElement
      );

      // Hiển thị popover gần phần tử được click
      wordElement.appendChild(popoverElement);
    };

    incorrectWords.forEach(wordElement => {
      wordElement.addEventListener('click', handleClick);
    });

    // Dọn dẹp event listeners khi component unmount
    return () => {
      incorrectWords.forEach(wordElement => {
        wordElement.removeEventListener('click', handleClick);
      });
    };
  });



  const renderedWords = listTypedWords.map((word, index) => (
    word !== listOutput[index] ? renderToString(<IncorrectWord typedWord={word} correctWord={listOutput[index]} index={index} />) : word
  ));

  return (
    <p dangerouslySetInnerHTML={{__html: renderedWords.join(" ")}}></p>
  );
};

const IncorrectWord = ({ typedWord, correctWord, index }) => {
  return (
    <span style={{textDecoration: "underline", textDecorationColor: 'red'}} data-incorrect-word-content={correctWord} key={index}>{typedWord}</span>
  );
};

export default UserTypings;
