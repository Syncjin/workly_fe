import { createCommand } from "lexical";

export const CLEAR_FORMAT_COMMAND = createCommand("CLEAR_FORMAT");
export const CODE_LANGUAGE_COMMAND = createCommand<string>();
export const INSERT_YOUTUBE_COMMAND = createCommand<string>("INSERT_YOUTUBE_COMMAND");
