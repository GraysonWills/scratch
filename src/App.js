import React from 'react';
import './App.css';
import BlocklyEditor from './components/BlocklyEditor';

function App() {
  return (
    <div className="App">
      <h1>No-Code AI/ML Builder</h1>
      <BlocklyEditor />  {/* Single instance of BlocklyEditor */}
    </div>
  );
}

export default App;
