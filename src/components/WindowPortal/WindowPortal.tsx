import React from 'react';
import { createPortal } from 'react-dom';

type Props = {
  onClose: (friendId: number) => void;
  friendId: number;
  children: React.ReactNode;
  mainWindow: Window;
};

const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
};

const WindowPortal = ({ children, onClose, friendId, mainWindow }: Props) => {
  const newWindow: Window = React.useMemo(() => {
    return window.open(
      'about:blank',
      'newWin',
      `width=400,height=300,left=${window.screen.availWidth / 2 - 200},top=${
        window.screen.availHeight / 2 - 150
      }`
    );
  }, []);

  React.useEffect(() => {
    newWindow.addEventListener('beforeunload', () => {
      onClose(friendId);
    });

    copyStyles(mainWindow.document, newWindow.document);
  }, []);

  return createPortal(children, newWindow.document.body);
};

export default WindowPortal;
