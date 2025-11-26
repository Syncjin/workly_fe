import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { DecoratorBlockNode, SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { JSX } from "react";

import { YouTubeView } from "./YouTubeView";

import type { DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, ElementFormatType, LexicalEditor, LexicalNode, NodeKey, Spread } from "lexical";

export type SerializedYouTubeNode = Spread<
  {
    videoID: string;
    width?: number;
    height?: number;
  },
  SerializedDecoratorBlockNode
>;

function convertYoutubeElement(domNode: HTMLElement): null | DOMConversionOutput {
  const videoID = domNode.getAttribute("data-lexical-youtube");
  if (videoID) {
    const node = $createYouTubeNode(videoID);
    return { node };
  }
  return null;
}

export class YouTubeNode extends DecoratorBlockNode {
  __id: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return "youtube";
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__width, node.__height, node.__format, node.__key);
  }

  constructor(id: string, width?: number, height?: number, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__id = id;
    this.__width = width;
    this.__height = height;
  }

  static __containerMaxWidth?: number;
  static setContainerMaxWidth(v?: number) {
    YouTubeNode.__containerMaxWidth = v;
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    const node = $createYouTubeNode(serializedNode.videoID, serializedNode.width, serializedNode.height);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      type: "youtube",
      version: 1,
      format: "left",
      videoID: this.__id,
      width: this.__width,
      height: this.__height,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe");
    element.setAttribute("data-lexical-youtube", this.__id);
    element.setAttribute("width", String(this.__width || 560));
    element.setAttribute("height", String(this.__height || 315));
    element.setAttribute("src", `https://www.youtube-nocookie.com/embed/${this.__id}`);
    element.setAttribute("frameborder", "0");
    element.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    element.setAttribute("allowfullscreen", "true");
    element.setAttribute("title", "YouTube video");
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-youtube")) {
          return null;
        }
        return {
          conversion: convertYoutubeElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__id;
  }

  setSize(width?: number, height?: number): void {
    const writable = this.getWritable();
    const oldWidth = writable.__width;
    const oldHeight = writable.__height;

    // 최소 크기 200x200 적용
    const newWidth = width && width >= 200 ? width : undefined;
    const newHeight = height && height >= 200 ? height : undefined;

    // 실제로 변경된 경우에만 업데이트
    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      writable.__width = newWidth;
      writable.__height = newHeight;

      // 노드 변경 사항을 에디터에 알림
      writable.markDirty();
    }
  }

  getWidth(): number | undefined {
    return this.__width;
  }

  getHeight(): number | undefined {
    return this.__height;
  }

  getTextContent(): string {
    return `https://www.youtube.com/watch?v=${this.__id}`;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    // 에디터의 편집 가능 상태 확인 ImageNode와 동일
    const isEditable = editor?.isEditable() ?? true;
    const maxW = YouTubeNode.__containerMaxWidth;
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };
    return (
      <BlockWithAlignableContents className={className} format={this.__format} nodeKey={this.getKey()}>
        <YouTubeView videoID={this.__id} width={this.__width} height={this.__height} nodeKey={this.getKey()} isEditable={isEditable} minSize={200} maxSize={maxW} />
      </BlockWithAlignableContents>
    );
  }

  isInline(): false {
    return false;
  }
}

export function $createYouTubeNode(videoID: string, width?: number, height?: number): YouTubeNode {
  return new YouTubeNode(videoID, width, height);
}

export function $isYouTubeNode(node: YouTubeNode | LexicalNode | null | undefined): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
