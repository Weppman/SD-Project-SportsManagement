import React, { useState } from 'react';
import './style.css';


function App() {
  
  const [buttonText, setButtonText] = useState("Click me");
  
  const getButtonHandlers = () => {
    const handleClick = () => alert("Clicked!");
    const handleHover = () => setButtonText("Hovering");
  
    return { handleClick, handleHover  };
  };


  // 2. Destructure what you need
  const { handleClick, handleHover } = getButtonHandlers();
  
  return (
    
    <section>
      <h1>Test</h1>
      <button onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={() => setButtonText('Interact Me')}
        >
      {buttonText} 
    </button>
    </section>
  );
}

export default App;