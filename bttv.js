/*
  Based on https://github.com/mdn/webextensions-examples/tree/master/emoji-substitution
*/

let emoteMap = tmpEmotes;

function replaceText (node) {
  
  if (node.nodeName === 'SPAN' && node.classList.contains('copyable-text')) {
    
    // Skip textarea nodes due to the potential for accidental submission
    // of substituted emoji where none was intended.
    if (node.parentNode &&
      node.parentNode.nodeName === 'TEXTAREA') {
        return;
    }

    let content = node.innerHTML;
    
    // Use the emoteMap for replacements.
    for (let [word, emote] of emoteMap) {
      content = content.replace(word, `<img src='${emote}'/>`);
    }

    // Now that all the replacements are done, perform the DOM manipulation.
    node.innerHTML = content;
  }
  else {
    // This node contains more than just text, call replaceText() on each
    // of its children.
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i]);
    }    
  }
}

// Start the recursion from the body tag.
replaceText(document.body);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // This DOM change was new nodes being added. Run our substitution
      // algorithm on each newly added node.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        replaceText(newNode);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
