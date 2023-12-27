export default function modifyContentWithIdPreservation(
  contentData,
  uuidv4,
  highlightIDs
) {
  const content = contentData;

  const modifiedContent = {
    ...content,
    blocks: content.blocks.map((block) => {
      const index = highlightIDs.findIndex((id) => id.blockKey === block.key);

      let id = null;
      if (index !== -1) {
        id = highlightIDs[index].id;
      } else {
        id = uuidv4();
        highlightIDs.push({ id, blockKey: block.key, styleOffset: -1 });
      }

      const isAllHighlighted = block.inlineStyleRanges.every(
        (styleRange) => styleRange.style === "HIGHLIGHT"
      );

      const modifiedInlineStyleRanges = block.inlineStyleRanges.map(
        (styleRange) => {
          if (isAllHighlighted && styleRange.style === "HIGHLIGHT") {
            return {
              ...styleRange,
              id: id,
            };
          } else if (styleRange.style === "HIGHLIGHT" && !styleRange.id) {
            const newId = uuidv4();
            styleRange.id = newId;
            highlightIDs.push({
              id: newId,
              blockKey: block.key,
              styleOffset: styleRange.offset,
            });
            return {
              ...styleRange,
              id: newId,
            };
          } else if (!styleRange.id && id) {
            return {
              ...styleRange,
              id: id,
            };
          } else {
            return styleRange;
          }
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
