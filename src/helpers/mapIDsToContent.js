export default function mapIDsToContent(initialContent, highlightIDs, uuidv4) {
  const mappedContent = { ...initialContent };

  mappedContent.blocks.forEach((block) => {
    const blockTextLength = block.text.length;

    const allTextHighlighted = block.inlineStyleRanges.every((styleRange) => {
      return (
        styleRange.style === "HIGHLIGHT" &&
        styleRange.length === blockTextLength
      );
    });

    if (allTextHighlighted) {
      const existingId = highlightIDs.find((id) => id.id);
      const idToAssign = existingId ? existingId.id : uuidv4();

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
            if (block.inlineStyleRanges.some((s) => s.style === "HIGHLIGHT")) {
              const existingId = highlightIDs.find(
                (id) =>
                  id.blockKey === block.key &&
                  id.styleOffset === styleRange.offset
              );

              styleRange.id = existingId ? existingId.id : uuidv4();
            } else {
              styleRange.id = uuidv4();
              highlightIDs.push({
                id: styleRange.id,
                blockKey: block.key,
                styleOffset: styleRange.offset,
              });
            }
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
