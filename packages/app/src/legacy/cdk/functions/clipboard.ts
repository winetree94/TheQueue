import { QueueObjectClipboardModel } from '@legacy/model/clipboard/base';
import { QUEUE_CLIPBOARD_UNIQUE_ID } from '@legacy/model/clipboard/constants';
import { QueueEffectType } from '@legacy/model/effect';
import { QueueObjectType } from '@legacy/model/object';

export const copy = (text: string): void => {
  const el = document.createElement('textarea'); // Create a <textarea> element
  el.value = text; // Set its value to the string that you want copied
  el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
  el.style.position = 'absolute';
  el.style.left = '-9999px'; // Move outside the screen to make it invisible
  document.body.appendChild(el); // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
  el.select(); // Select the <textarea> content
  document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
    document.getSelection().addRange(selected); // Restore the original selection
  }
};

export const copyObjects = (
  data: {
    object: QueueObjectType;
    effects: QueueEffectType[];
  }[],
): void => {
  const model: QueueObjectClipboardModel = {
    identity: QUEUE_CLIPBOARD_UNIQUE_ID,
    type: 'objects',
    data: data,
  };
  copy(JSON.stringify(model));
};
