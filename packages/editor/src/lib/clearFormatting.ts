import { $isCodeNode } from "@lexical/code";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, REMOVE_LIST_COMMAND } from "@lexical/list";
import { $isHeadingNode } from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection, $isElementNode, $isRangeSelection, $isTextNode } from "lexical";

export function clearFormatting(editor: any) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    // 링크 제거 (unwrap)
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);

    // 텍스트 노드 포맷/스타일 제거
    const nodes = selection.getNodes();
    for (const n of nodes) {
      if ($isTextNode(n)) {
        n.setFormat(0); // bold/italic/underline/strike/code/sub/sup 등 전부 제거
        n.setStyle(""); // color, background-color, font-size, font-family 등 제거
      }
    }

    // 선택 구간에 남아있을 수 있는 인라인 스타일 스팬 제거 보강
    $patchStyleText(selection, {
      color: "",
      "background-color": "",
      "font-size": "",
      "font-family": "",
      "letter-spacing": "",
      "text-transform": "",
      "font-weight": "",
      "font-style": "",
      "text-decoration": "",
      "line-height": "",
    });

    // 블록 초기화: 리스트 해제 + 헤딩/코드블록 → 문단
    const topBlocks = new Set(
      nodes
        .map((n) => ($isElementNode(n) ? n : n.getParent()))
        .filter(Boolean)
        .map((el) => el!.getTopLevelElement())
        .filter(Boolean)
    );

    let needsParagraphReset = false;

    topBlocks.forEach((el) => {
      if ($isListNode(el)) editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      if ($isHeadingNode(el) || $isCodeNode(el)) {
        needsParagraphReset = true;
      }
    });

    if (needsParagraphReset) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
}
