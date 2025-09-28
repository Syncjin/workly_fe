import { Button } from "@/shared/ui/Button";
import { toolbar } from "./postEditor.css";

export default function ArticleWriteActions() {
  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <Button>등록</Button>
        <Button variant="border" color="gray-900">
          필독/공지
        </Button>
      </div>
    </div>
  );
}
