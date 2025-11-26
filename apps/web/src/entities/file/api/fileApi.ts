/**
 * File API functions
 *
 */
import { http } from "@/shared/api/client";
import { createFileApi } from "@workly/api";

/**
 * File API functions
 */

export const fileApi = createFileApi(http);
