import { createCommand } from "lexical";
import { InsertYouTubePayload } from "./YoutubePlugin";

export const CLEAR_FORMAT_COMMAND = createCommand("CLEAR_FORMAT");
export const CODE_LANGUAGE_COMMAND = createCommand<string>();
export const INSERT_YOUTUBE_COMMAND = createCommand<InsertYouTubePayload | string>("INSERT_YOUTUBE_COMMAND");
