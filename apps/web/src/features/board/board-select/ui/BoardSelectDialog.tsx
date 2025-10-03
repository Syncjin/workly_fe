import { Board } from "@/entities/board";
import { Button, Popup } from "@workly/ui";
import { FC } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onResolve: (board: Board) => void;
  params?: {
    initialBoardId?: number;
  };
};

export const BoardSelectDialog: FC<Props> = ({ open, onClose, onResolve, params }) => {
  return (
    <Popup open={open} onClose={onClose} variant="modal" size="md" trapFocus loading={false} ariaLabel="게시판 선택">
      <Popup.Header>게시판 선택</Popup.Header>
      <Popup.Content>
        <span>게시판 선택 팝업</span>
      </Popup.Content>
      <Popup.Footer>
        <Button variant="ghost" onClick={onClose}>
          취소
        </Button>
        <Button onClick={() => {}}>선택</Button>
      </Popup.Footer>
    </Popup>
  );
};

export default BoardSelectDialog;
