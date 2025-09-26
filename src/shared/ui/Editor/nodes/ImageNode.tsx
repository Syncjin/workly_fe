"use client";

import { DecoratorNode, type DOMConversionMap, type DOMExportOutput, type EditorConfig, type LexicalEditor, type NodeKey, type SerializedLexicalNode, type Spread } from "lexical";
import { JSX } from "react";

export type ImagePayload = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
};

type SerializedImageNode = Spread<
  {
    type: "image";
    version: 1;
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt?: string;
  __width?: number;
  __height?: number;
  __caption?: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(
      {
        src: node.__src,
        alt: node.__alt,
        width: node.__width,
        height: node.__height,
        caption: node.__caption,
      },
      node.__key
    );
  }

  constructor(payload: ImagePayload, key?: NodeKey) {
    super(key);
    this.__src = payload.src;
    this.__alt = payload.alt;
    this.__width = payload.width;
    this.__height = payload.height;
    this.__caption = payload.caption;
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    const { src, alt, width, height, caption } = serialized;
    return new ImageNode({ src, alt, width, height, caption });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
      caption: this.__caption,
    };
  }

  exportDOM(_editor: LexicalEditor): DOMExportOutput {
    const img = document.createElement("img");
    img.src = this.__src;
    if (this.__alt) img.alt = this.__alt;
    if (this.__width) img.width = this.__width;
    if (this.__height) img.height = this.__height;
    return { element: img };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (domNode: Node) => {
        if (domNode instanceof HTMLImageElement) {
          return {
            conversion: () => ({
              node: new ImageNode({
                src: domNode.src,
                alt: domNode.alt,
                width: domNode.width || undefined,
                height: domNode.height || undefined,
              }),
            }),
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    return document.createElement("span");
  }
  updateDOM(): boolean {
    return false;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    const { __src: src, __alt: alt, __width: width, __height: height } = this;
    return (
      <span contentEditable={false} style={{ display: "inline-block", maxWidth: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} width={width} height={height} style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }} />
      </span>
    );
  }
}

export function $createImageNode(payload: ImagePayload) {
  return new ImageNode(payload);
}
export function $isImageNode(x: unknown): x is ImageNode {
  return x instanceof ImageNode;
}
