import { writable } from "svelte/store";

export interface State {
  username?: string;
  password?: string;
}

export const state = writable<State>({});
export const connected_clients = writable<string>("not connected");
export const connected_providers = writable<string>("not connected");
