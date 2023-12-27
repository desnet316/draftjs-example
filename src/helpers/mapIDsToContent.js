export default function mapIDsToContent(initialContent, highlightIDs, uuidv4) {
  const mappedContent = { ...initialContent };

  mappedContent.blocks.forEach((block) => {
    const isAllHighlighted = block.text.split(/\s+/).every((word) => {
      const styleRange = block.inlineStyleRanges.find(
        (s) =>
          s.offset === 0 && s.length === word.length && s.style === "HIGHLIGHT"
      );
      return !!styleRange;
    });

    if (isAllHighlighted) {
      const existingId = highlightIDs.find((id) => id.id);
      const idToAssign = existingId ? existingId.id : uuidv4();
      console.log(existingId);
      block.inlineStyleRanges.forEach((styleRange) => {
        if (styleRange.style === "HIGHLIGHT") {
          styleRange.id = idToAssign;
        }
      });
    } else {
      block.inlineStyleRanges.forEach((styleRange) => {
        if (styleRange.style === "HIGHLIGHT") {
          const id = highlightIDs.find(
            (id) =>
              id.blockKey === block.key && id.styleOffset === styleRange.offset
          );
          if (!id || !id.id) {
            styleRange.id = uuidv4();
            highlightIDs.push({
              id: styleRange.id,
              blockKey: block.key,
              styleOffset: styleRange.offset,
            });
          } else {
            styleRange.id = uuidv4();
            highlightIDs.push({
              id: styleRange.id,
              blockKey: block.key,
              styleOffset: styleRange.offset,
            });
          }
        }
      });
    }
  });

  return mappedContent;
}
