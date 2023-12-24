import {
  Editor,
  EditorState,
  // KeyBindingUtil,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import "./App.css";
import { useMemo } from "react";
import extractNewIDsAndIndexes from "./helpers/extractNewIDs";
import mapIDsToContent from "./helpers/mapIDsToContent";
import modifyContentWithIdPreservation from "./helpers/modifyContent";
import extractIDsFromContent from "./helpers/extractIDsFromContent";

function App() {
  const [backup, setBackup] = useState({});
  const initialContent = useMemo(
    () => ({
      blocks: [
        {
          key: "dgu4q",
          text: "first",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
        {
          key: "1sr6",
          text: "highlighted",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [
            {
              offset: 0,
              length: 11,
              style: "HIGHLIGHT",
              id: "2c5162a8-0e83-4ce7-94ee-2d85de8e9765",
            },
          ],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    }),
    []
  );

  const [highlightIDs, setHighlightIDs] = useState(() =>
    extractIDsFromContent(initialContent)
  );

  const modifiedContent = modifyContentWithIdPreservation(
    initialContent,
    uuidv4
  );

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "#faed27",
    },
  };

  const [editorState, setEditorState] = useState(() => {
    const contentState = convertFromRaw(modifiedContent);
    return EditorState.createWithContent(contentState);
  });

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };

  const onHighlightClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
  };

  // const handleKeyCommand = (command) => {
  //   if (!editorState && command === "highlight") {
  //     editorState = RichUtils.toggleInlineStyle(
  //       this.state.editorState,
  //       "HIGHLIGHT"
  //     );
  //   }
  // };

  // const keyBindingFunction = (event) => {
  //   if (
  //     KeyBindingUtil.hasCommandModifier(event) &&
  //     event.shiftKey &&
  //     event.key === "h"
  //   ) {
  //     return "highlight";
  //   }
  // };

  const onSave = () => {
    const currentData = convertToRaw(editorState.getCurrentContent());
    //const withId = modifyContentWithIdPreservation(currentData);
    const extracted = extractNewIDsAndIndexes(
      initialContent,
      currentData,
      highlightIDs,
      uuidv4
    );
    setHighlightIDs(extracted);
    const mods = mapIDsToContent(currentData, extracted);
    setBackup(mods);
  };

  const onBackup = () => {
    setEditorState(EditorState.createWithContent(convertFromRaw(backup)));
  };

  const onReset = () => {
    setEditorState(EditorState.createEmpty());
  };

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
      <div>{JSON.stringify(backup)}</div>
    </div>
  );
}

export default App;
