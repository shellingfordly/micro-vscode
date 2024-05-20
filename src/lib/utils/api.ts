import { invoke } from "@tauri-apps/api/core";
import { Response } from "~/types";

export async function createInvoke<T = any>(api: string, params?: any): Promise<Response<T>> {
  const data: Response<T> = await invoke(api, params);

  if (data) {
    return data;
  } else {
    return {
      status: "err",
      data: null,
      err: "data is undefined",
    } as Response<T>;
  }
}
