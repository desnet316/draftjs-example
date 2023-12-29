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
import { useRef } from "react";
import { useEffect } from "react";

function App() {
  const [backup, setBackup] = useState({});
  const currentContentRef = useRef({
    blocks: [
      {
        key: "dgu4q",
        text: "first",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          // {
          //   offset: 1,
          //   length: 4,
          //   style: 'HIGHLIGHT',
          //   id: "2c5162a8-0e83-4ce7-94ee-2d85de8e9765",
          // }
        ],
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
  });

  const initialContent = useMemo(
    () => ({
      blocks: [
        {
          key: "dgu4q",
          text: "first",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          inlineStyleRanges: [
            // {
            //   offset: 1,
            //   length: 4,
            //   style: 'HIGHLIGHT',
            //   id: "2c5162a8-0e83-4ce7-94ee-2d85de8e9765",
            // }
          ],
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
    uuidv4,
    highlightIDs
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
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const endOffset = selection.getEndOffset();
    const block = currentContent.getBlockForKey(startKey);

    let modifiedEditorState = editorState;

    if (startOffset !== endOffset) {
      // Text is selected
      modifiedEditorState = RichUtils.toggleInlineStyle(
        editorState,
        "HIGHLIGHT"
      );
    } else if (block.getType() === "unstyled") {
      // No text is selected
      const updatedEditorState = EditorState.set(editorState, {
        currentContent: currentContent,
      });

      modifiedEditorState = RichUtils.toggleInlineStyle(
        updatedEditorState,
        "HIGHLIGHT"
      );
    }

    setEditorState(modifiedEditorState);
  };

  useEffect(() => {
    const currentData = convertToRaw(editorState.getCurrentContent());
    const previousData = currentContentRef.current;

    const trackSections = [];

    function processedSections(sections) {
      const resultSections = [];

      for (let i = 0; i < sections.length; ) {
        const higlightedContext = [ sections[i] ];
  
        let j = i;
        while (
          sections[j].offset + sections[j].length === sections[j].text.length &&
          j < sections.length - 1 &&
          sections[j + 1].i === sections[j].i + 1 &&
          sections[j + 1].offset === 0
        ) {
          higlightedContext.push(sections[j + 1])
          j++; 
        }
  
        resultSections.push(higlightedContext);
        i = j + 1;
      }

      return resultSections;
    }

    function testIfModified(prevSections, currentSections) {
      const prevKeyMap = {};

      for (let i = 0; i < prevSections.length; ++ i) {
        prevKeyMap[prevSections[i].key] = i;
      }

      for (let i = 0; i < currentSections.length; ++ i) {
        const prevIndex = prevKeyMap[currentSections[i].key];
        if (
          prevIndex !== undefined && (
            prevSections[prevIndex].offset >= currentSections[i].offset && prevSections[prevIndex].offset < currentSections[i].offset + currentSections[i].length ||
            currentSections[i].offset >= prevSections[prevIndex].offset && currentSections[i].offset < prevSections[prevIndex].offset + prevSections[prevIndex].length
          )
        )  {
          return true;
        }
      }

      return false;
    }

    for (let i = 0; i < previousData.blocks.length; ++ i) {
      for (let j = 0; j < previousData.blocks[i].inlineStyleRanges.length; ++ j) {
        if (previousData.blocks[i].inlineStyleRanges[j].style === 'HIGHLIGHT' && previousData.blocks[i].inlineStyleRanges[j].id) {
          trackSections.push({
            ...previousData.blocks[i].inlineStyleRanges[j],
            key: previousData.blocks[i].key,
            text: previousData.blocks[i].text,
            i,
            j
          })
        }
        
      }
    }

    const previousHighlightSections = processedSections(trackSections);

    const currentSections = [];

    for (let i = 0; i < currentData.blocks.length; ++ i) {
      for (let j = 0; j < currentData.blocks[i].inlineStyleRanges.length; ++ j) {
        if (currentData.blocks[i].inlineStyleRanges[j].style === 'HIGHLIGHT') {
          currentSections.push({
            ...currentData.blocks[i].inlineStyleRanges[j],
            key: currentData.blocks[i].key,
            text: currentData.blocks[i].text,
            i,
            j,
          })
        }
      }
    }

    const currentHightlightSections = processedSections(currentSections);

    console.log(previousHighlightSections);
    console.log(currentHightlightSections);

    for (let j = 0; j < previousHighlightSections.length; ++ j) {
      for (let i = 0; i < currentHightlightSections.length; ++ i) {
        if (testIfModified(previousHighlightSections[j], currentHightlightSections[i])) {
          for (let k = 0; k < currentHightlightSections[i].length; ++ k) {
            currentData.blocks[currentHightlightSections[i][k].i].inlineStyleRanges[currentHightlightSections[i][k].j].id = previousHighlightSections[j][0].id;
          }
          break;
        }
      }
    }

    // const contentState = convertFromRaw(currentData);
    // const newState = EditorState.createWithContent(contentState);

    currentContentRef.current = currentData;
    // console.log(currentData);
  }, [editorState])

  const onSave = () => {
    const currentData = convertToRaw(editorState.getCurrentContent());
    const extracted = extractNewIDsAndIndexes(
      initialContent,
      currentData,
      highlightIDs,
      uuidv4
    );
    setHighlightIDs(extracted);
    const mods = mapIDsToContent(currentData, extracted, uuidv4);
    // setBackup(mods);
    setBackup(currentContentRef.current)
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
      />
      <br />
      Raw Value
      <div>{JSON.stringify(backup, null, 2)}</div>
    </div>
  );
}

export default App;
