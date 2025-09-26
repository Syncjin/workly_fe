import { createCommand } from "lexical";

export const CLEAR_FORMAT_COMMAND = createCommand("CLEAR_FORMAT");
export const CODE_LANGUAGE_COMMAND = createCommand<string>();
