import { Input } from "@/shared/ui/Input";
import * as s from "./postEditor.css";

const BoardSelector = () => {
  return (
    <div className={s.boardSelector.container}>
      <span>게시판</span>
      <div></div>
      <span>제목</span>
      <Input id="userId" type="text" placeholder="제목을 입력하세요" />
    </div>
  );
};

export default BoardSelector;
