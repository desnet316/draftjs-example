export default function mapIDsToContent(initialContent, highlightIDs, uuidv4) {
  const mappedContent = { ...initialContent };
  const highlightedBlocks = mappedContent.blocks.filter((block) =>
    block.inlineStyleRanges.some((s) => s.style === "HIGHLIGHT")
  );

  if (highlightedBlocks.length === mappedContent.blocks.length) {
    const existingId = highlightIDs.find((id) => id.id);
    const idToAssign = existingId ? existingId.id : uuidv4();

    mappedContent.blocks.forEach((block) => {
      block.inlineStyleRanges.forEach((styleRange) => {
        if (styleRange.style === "HIGHLIGHT") {
          styleRange.id = idToAssign;
        }
      });
    });
  } else {
    highlightIDs.forEach((id) => {
      const block = mappedContent.blocks.find((b) => b.key === id.blockKey);
      if (block) {
        const styleRangeIndex = block.inlineStyleRanges.findIndex(
          (s) => s.offset === id.styleOffset && s.style === "HIGHLIGHT"
        );
        if (styleRangeIndex !== -1) {
          const styleRange = block.inlineStyleRanges[styleRangeIndex];
          styleRange.id = id.id;
        } else {
          const styleRange = block.inlineStyleRanges.find(
            (s) => s.offset === id.styleOffset
          );
          if (styleRange && styleRange.id) {
            styleRange.id = null;
          }
        }
      }
    });
  }

  return mappedContent;
}
