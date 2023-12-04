import logo from './logo.svg';
import './App.css';
import { Editor, EditorState, KeyBindingUtil } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useState } from 'react';
import { RichUtils } from 'draft-js';

function App() {
  const styleMap = {
    'HIGHLIGHT': {
      'backgroundColor': '#faed27',
    }
  };
  
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  )

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
  }

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
  }

  const onHighlightClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'))
  }

  const handleKeyCommand = (command) => {
    if (!editorState && command === 'highlight') {
      editorState = RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT');
    }
  } 

  const keyBindingFunction = (event) => {
    if (KeyBindingUtil.hasCommandModifier(event) && event.shiftKey && event.key === 'h') {
      return 'highlight';
    }
  }

  return (
    <div className="App">
       <button onClick={onBoldClick}>Bold</button>
       <button onClick={onItalicClick}>Italic</button>
       <button onClick={onHighlightClick}>HIGHLIGHT</button>
      <Editor
        placeholder={"Start typing!"}
        customStyleMap={styleMap} 
        editorState={editorState} 
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFunction} 
      />
    </div>
  );
}

export default App;
