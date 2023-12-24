export default function extractIDsFromContent(initialContent) {
  const ids = [];

  initialContent.blocks.forEach((block) => {
    if (block.inlineStyleRanges && block.inlineStyleRanges.length > 0) {
      block.inlineStyleRanges.forEach((styleRange) => {
        if (styleRange.style === "HIGHLIGHT" && styleRange.id) {
          ids.push({
            blockKey: block.key,
            styleOffset: styleRange.offset,
            id: styleRange.id,
          });
        }
      });
    }
  });

  return ids;
}
