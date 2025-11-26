"use client";

import { Body, Content, Footer, Header } from "./parts";
import PopupRoot from "./root";

export const Popup = Object.assign(PopupRoot, {
  Content,
  Header,
  Body,
  Footer,
});

export { usePopupRef } from "./context";
export * from "./types";
