import clsx from 'clsx';
import { FunctionComponent, useContext, useEffect, useRef } from 'react';
import { QueueObjectContainerContext } from './Container';
import { QueueAnimatableContext } from './QueueAnimation';

export interface TextProps {
  onEdit?(text: string): void;
}

export const Text: FunctionComponent<TextProps> = ({
  onEdit,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useContext(QueueAnimatableContext);
  const { object, transform, detail } = useContext(QueueObjectContainerContext);

  const verticalAlign = object.text.verticalAlign === 'middle'
    ? 'center'
    : object.text.verticalAlign === 'top'
      ? 'flex-start'
      : 'flex-end';

  const horizontalAlign = object.text.horizontalAlign === 'center'
    ? 'center'
    : object.text.horizontalAlign === 'left'
      ? 'flex-start'
      : 'flex-end';

  const textAlign = object.text.horizontalAlign === 'center'
    ? 'center'
    : object.text.horizontalAlign === 'left'
      ? 'left'
      : 'right';

  const onKeydown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (window.getSelection) {
        const selection = window.getSelection()!;
        const range = selection.getRangeAt(0);
        const br = document.createElement('br');
        const textNode = document.createTextNode('\u00a0');
        range.deleteContents();
        range.insertNode(br);
        range.collapse(false);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const onBlur = (): void => {
    onEdit?.(ref.current!.innerHTML);
  };

  useEffect(() => {
    ref.current!.innerHTML = object.text.text;
  }, [object.text.text]);

  useEffect(() => {
    if (!detail) {
      return;
    }
    if (ref.current!.innerText.length === 0) {
      ref.current!.focus();
      return;
    }
    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(ref.current!);
    newRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
  }, [detail]);

  return (
    <div
      ref={ref}
      className={clsx('object-text', 'flex', 'absolute')}
      onKeyDown={onKeydown}
      onBlur={onBlur}
      suppressContentEditableWarning={true}
      style={{
        justifyContent: horizontalAlign,
        alignItems: verticalAlign,
        fontFamily: object.text.fontFamily,
        color: object.text.fontColor,
        fontSize: object.text.fontSize,
        top: `${animation.rect.y + transform.y}px`,
        left: `${animation.rect.x + transform.x}px`,
        width: `${animation.rect.width + transform.width}px`,
        height: `${animation.rect.height + transform.height}px`,
        textAlign: textAlign,
      }}
      contentEditable={detail}
    >
    </div>
  );
};