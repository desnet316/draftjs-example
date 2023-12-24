import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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

  const onHighlightClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
  };

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
  const buttonStyle = {
    padding: "8px 16px",
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease-in-out",
  };

  return (
    <div
      className="App"
      style={{ marginTop: "10px", marginBottom: "10px", padding: "20px" }}
    >
      <button style={buttonStyle} onClick={onHighlightClick}>
        HIGHLIGHT
      </button>
      <button style={buttonStyle} onClick={onSave}>
        Save
      </button>
      <button style={buttonStyle} onClick={onReset}>
        Reset
      </button>
      <button style={buttonStyle} onClick={onBackup}>
        Backup
      </button>
      <Editor
        placeholder={"Start typing!"}
        customStyleMap={styleMap}
        editorState={editorState}
        onEditorStateChange={setEditorState}
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
