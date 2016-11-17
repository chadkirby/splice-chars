module.exports = spliceChars;

//
// spliceChars removes characters from an element, optionally inserting one or more replacements
// startIndex is a character-index at which to start the splice
// deleteCount is an integer counting chars to delete starting at startIndex
// insertions are elements to insert at startIndex (if any)
//
function spliceChars($, $el, startIndex, deleteCount, ...insertions) {
  let endIndex = startIndex + deleteCount;
  let textNodes = collectTextNodes($, $el);

  for (let nodeIdx = 0, charIdx = 0; nodeIdx < textNodes.length && charIdx <= endIndex; nodeIdx++) {
    let $node = textNodes[nodeIdx];
    let nodeText = $node.text();
    if (charIdx <= endIndex && startIndex < charIdx + nodeText.length) {
      // copy any text following the end of the deletion range
      let trailingText = nodeText.slice(startIndex - charIdx + deleteCount);
      if (trailingText) {
        // insert the trailing text
        $node.after(trailingText);
      }

      // insert insertions in front of the trailingText
      while (insertions.length) {
        $node.after(insertions.pop());
      }

      // copy any text preceding the beginning of the deletion range
      let leadingText = nodeText.slice(0, startIndex - charIdx);
      if (leadingText && startIndex - charIdx > 0) {
        // insert the leading range
        $node.after(leadingText);
      }

      // remove the original text node
      let $parent = $node.parent();
      $node.remove();
      // remove empty parent elements (if any)
      while (!$parent.contents().length && !$parent.is($el)) {
        let $grandparent = $parent.parent();
        $parent.remove();
        $parent = $grandparent;
      }
    }
    charIdx += nodeText.length;
  }
  return $el;
}

//
// collectTextNodes takes an element and returns an array of the text nodes contained therein
//
function collectTextNodes($, $el) {
  let textNodes = [];
  $el.contents().each((ii, node) => {
    if (isTextNode(node)) {
      let $node = $(node);
      textNodes.push($node);
    } else {
      textNodes.push(...collectTextNodes($, $(node)));
    }
  });
  return textNodes;
}

function isTextNode(el) {
  return el.nodeType === 3 || el.type === 'text';
}
