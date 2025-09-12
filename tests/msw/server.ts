import { HttpHandler } from "msw";
import { setupServer } from "msw/node";
import { commonAuthHandlers } from './handlers/common.auth.handlers';
import { boardSidebarHandlers } from './handlers/widgets.board-sidebar.handlers';

const defaultHandlers = [
    ...commonAuthHandlers,
    ...boardSidebarHandlers.success,
    // ...Handlers.success,
];

export const server = setupServer(...defaultHandlers);

export function setScenario(handlers: HttpHandler[]) {
    server.resetHandlers();       // 런타임 핸들러 초기화
    server.use(...handlers);      // 새 시나리오 적용
}