import logo from './logo.svg';
import './App.css';
import { Editor, EditorState, KeyBindingUtil, convertFromRaw, convertToRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useState } from 'react';
import { RichUtils } from 'draft-js';

function App() {
  const [backup, setBackup] = useState({})

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

  const onSave = () => {
    setBackup(convertToRaw(editorState.getCurrentContent()))
  }

  const onBackup = () => {
    setEditorState(EditorState.createWithContent(convertFromRaw(backup)))
  }

  const onReset = () => {
    setEditorState(EditorState.createEmpty())
  }

  // console.log(editorState.getCurrentContent())

  console.log(convertToRaw(editorState.getCurrentContent()))

  return (
    <div className="App">
       <button onClick={onBoldClick}>Bold</button>
       <button onClick={onItalicClick}>Italic</button>
       <button onClick={onHighlightClick}>HIGHLIGHT</button>
       <button onClick={onSave}>Save</button>
       <button onClick={onReset}>Reset</button>
       <button onClick={onBackup}>Backup</button>
      <Editor
        placeholder={"Start typing!"}
        customStyleMap={styleMap} 
        editorState={editorState} 
        onChange={setEditorState}
        // handleKeyCommand={handleKeyCommand}
        // keyBindingFn={keyBindingFunction} 
      />
      <br />
      Raw Value
      <div>
        {
          JSON.stringify(backup)
        }
      </div>
    </div>
  );
}

export default App;
