export default function mapIDsToContent(initialContent, highlightIDs) {
  const mappedContent = { ...initialContent };

  highlightIDs.forEach((id) => {
    const block = mappedContent.blocks.find((b) => b.key === id.blockKey);
    if (block) {
      const styleRange = block.inlineStyleRanges.find(
        (s) => s.offset === id.styleOffset
      );
      if (styleRange) {
        styleRange.id = id.id;
      }
    }
  });

  return mappedContent;
}
