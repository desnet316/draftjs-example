export default function modifyContentWithIdPreservation(contentData, uuidv4) {
  // Get the initial content
  const content = contentData;
  const id = uuidv4();
  // Modify the content while preserving inline style IDs
  const modifiedContent = {
    ...content,
    blocks: content.blocks.map((block) => {
      const modifiedInlineStyleRanges = block.inlineStyleRanges.map(
        (styleRange) => {
          // Here, you can preserve and use the ID associated with the 'HIGHLIGHT' style
          if (styleRange.style === "HIGHLIGHT" /*&& styleRange.id*/) {
            // Your logic to use the ID when modifying the style
            // For example, update the text or offset
            return {
              ...styleRange,
              id: id, // Modify the offset as an example
            };
          }
          return styleRange;
        }
      );

      return {
        ...block,
        inlineStyleRanges: modifiedInlineStyleRanges,
      };
    }),
  };

  return modifiedContent;
}
