import logo from './logo.svg';
import './App.css';
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useState } from 'react';
import { RichUtils } from 'draft-js';

function App() {
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  )

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
  }

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
  }

  return (
    <div className="App">
       <button onClick={onBoldClick}>Bold</button>
       <button onClick={onItalicClick}>Italic</button>
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  );
}

export default App;
