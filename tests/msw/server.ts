import { setupServer } from "msw/node";
import { commonHandlers } from './handlers/common.handlers';
import { boardSidebarHandlers } from './handlers/widgets.board-sidebar.handlers';

const defaultHandlers = [
    ...commonHandlers,
    ...boardSidebarHandlers.success,
    // ...Handlers.success,
];

export const server = setupServer(...defaultHandlers);

export const scenarios = {
    boardSidebar: boardSidebarHandlers,
    // filterAction: filterActionHandlers,
};