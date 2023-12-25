import { writable } from "svelte/store";

export interface State {
  username?: string;
  password?: string;
}

export const state = writable<State>({});
export const connected = writable<string>("not connected");
