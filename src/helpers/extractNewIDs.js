export default function extractNewIDsAndIndexes(
  initialContent,
  modifiedContent,
  prevHighlightIDs,
  uuidv4
) {
  const newHighlightIDs = [...prevHighlightIDs];

  modifiedContent.blocks.forEach((block) => {
    const initialBlock = initialContent.blocks.find((b) => b.key === block.key);

    if (initialBlock) {
      block.inlineStyleRanges.forEach((styleRange, index) => {
        if (styleRange.style === "HIGHLIGHT") {
          const initialStyleRange = initialBlock.inlineStyleRanges[index];
          if (initialStyleRange && initialStyleRange.id && styleRange.id) {
            newHighlightIDs.push({
              id: styleRange.id,
              blockKey: block.key,
              styleOffset: index,
            });
          }
        }
      });
    } else {
      // New block, generate new IDs for all the new highlights
      block.inlineStyleRanges.forEach((styleRange, index) => {
        if (styleRange.style === "HIGHLIGHT" && !styleRange.id) {
          const newId = uuidv4();
          styleRange.id = newId;
          newHighlightIDs.push({
            id: newId,
            blockKey: block.key,
            styleOffset: index,
          });
        }
      });
    }
  });

  return newHighlightIDs;
}
