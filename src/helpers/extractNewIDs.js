export default function extractNewIDsAndIndexes(
  initialContent,
  modifiedContent,
  prevHighlightIDs,
  uuidv4
) {
  const newHighlightIDs = [...prevHighlightIDs];

  modifiedContent.blocks.forEach((block) => {
    const initialBlock = initialContent.blocks.find((b) => b.key === block.key);

    if (!initialBlock) {
      // New block, generate new IDs for all the new highlights
      block.inlineStyleRanges.forEach((styleRange, index) => {
        if (
          styleRange.style &&
          styleRange.style === "HIGHLIGHT" &&
          !styleRange.id
        ) {
          const newId = uuidv4();
          styleRange.id = newId;
          newHighlightIDs.push({
            id: newId,
            blockKey: block.key,
            styleOffset: index,
          });
        }
      });
    } else {
      // Existing block, preserve existing IDs and update indexes for modified highlights
      block.inlineStyleRanges.forEach((styleRange, index) => {
        const existingHighlight = initialBlock.inlineStyleRanges[index];
        if (
          styleRange.style &&
          styleRange.style === "HIGHLIGHT" &&
          existingHighlight &&
          existingHighlight.id
        ) {
          styleRange.id = existingHighlight.id;
          const idIndex = newHighlightIDs.findIndex(
            (id) => id.blockKey === block.key && id.styleOffset === index
          );

          if (idIndex !== -1) {
            newHighlightIDs[idIndex].id = existingHighlight.id;
          }
        }
      });
    }
  });

  return newHighlightIDs;
}
