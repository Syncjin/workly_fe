import { DecoratorNode, LexicalEditor, type EditorConfig, type LexicalNode, type NodeKey } from "lexical";
import { JSX } from "react";
import { ImageView } from "./ImageView";

export type InsertImagePayload = {
  src: string;              // blob:... or https://...
  altText?: string;
  width?: number;
  height?: number;
  // 지연 업로드용 메타
  tempId?: string | null;   // blob 이미지면 식별자(예: uuid), 서버 업로드 후 null
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width?: number;
  __height?: number;
  __tempId: string | null;

  static getType() { return "image"; }
  static clone(n: ImageNode) {
    const node = new ImageNode(
      { src: n.__src, altText: n.__altText, width: n.__width, height: n.__height, tempId: n.__tempId },
      n.__key
    );
    return node;
  }

  constructor({ src, altText = "", width, height, tempId }: InsertImagePayload, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__tempId = tempId !== undefined ? tempId : null;
  }

  // 직렬화/역직렬화
  static importJSON(json: any): ImageNode {
    return new ImageNode({
      src: json.src,
      altText: json.altText || "",
      width: json.width > 0 ? json.width : undefined,
      height: json.height > 0 ? json.height : undefined,
      tempId: json.tempId ?? null
    });
  }
  
  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      tempId: this.__tempId,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const className = config.theme?.image; // 있으면 클래스 부여
    if (className) span.className = className;
    return span;
  }
  updateDOM(): false { return false; }

  decorate(editor: LexicalEditor): JSX.Element {
    // 에디터의 편집 가능 상태 확인
    const isEditable = editor?.isEditable() ?? true;
    
    return (
      <ImageView
        src={this.__src}
        alt={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
        isEditable={isEditable}
      />
    );
  }

  // 리사이즈용 API
  setSize(width?: number, height?: number) {
    const writable = this.getWritable() as ImageNode;
    const oldWidth = writable.__width;
    const oldHeight = writable.__height;
    
    // 최소 크기 40x40 적용
    const newWidth = width && width >= 40 ? width : undefined;
    const newHeight = height && height >= 40 ? height : undefined;
    
    // 실제로 변경된 경우에만 업데이트
    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      writable.__width = newWidth;
      writable.__height = newHeight;
      console.log(`ImageNode 크기 업데이트: ${oldWidth}x${oldHeight} → ${newWidth}x${newHeight}`);
    }
  }
  
  setSrc(src: string) {
    const writable = this.getWritable() as ImageNode;
    writable.__src = src;
  }
  
  setTempId(tempId: string | null) {
    const writable = this.getWritable() as ImageNode;
    writable.__tempId = tempId;
  }
  
  setAltText(altText: string) {
    const writable = this.getWritable() as ImageNode;
    writable.__altText = altText;
  }
  
  getSrc(): string {
    return this.__src;
  }
  
  getAltText(): string {
    return this.__altText;
  }
  
  getWidth(): number | undefined {
    return this.__width;
  }
  
  getHeight(): number | undefined {
    return this.__height;
  }
  
  getTempId(): string | null {
    return this.__tempId;
  }
}

export function $createImageNode(p: InsertImagePayload) { return new ImageNode(p); }
export function $isImageNode(n: LexicalNode | null | undefined): n is ImageNode { return n instanceof ImageNode; }
