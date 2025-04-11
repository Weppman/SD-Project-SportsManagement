// src/pages/TestPage.js (renaming from test.ui.js is optional but cleaner)
import React, { useState } from 'react';
import '../MainUIComponents/style.css';

const TestPage = () => {
  const [buttonText, setButtonText] = useState("Click me");

  const getButtonHandlers = () => {
    const handleClick = () => alert("Clicked!");
    const handleHover = () => setButtonText("Hovering");

    return { handleClick, handleHover };
  };

  const { handleClick, handleHover } = getButtonHandlers();

  return (
    <section>
      <h1>Test</h1>
      <button
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={() => setButtonText('Interact Me')}
      >
        {buttonText}
      </button>
    </section>
  );
};

export default TestPage;
