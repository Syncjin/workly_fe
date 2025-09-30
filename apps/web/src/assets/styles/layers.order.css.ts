import { globalStyle } from "@vanilla-extract/css";
import * as layers from "./layers.css";

// @layer reset, components; 의 순서를 한 번 선언해두면
// 이후 각 파일에서 같은 레이어 이름을 사용해도 이 순서가 유지됨.
globalStyle(":root", {
  "@layer": {
    [layers.reset]: {},
    [layers.components]: {},
  },
});
