import { writable } from "svelte/store";

export interface State {
  api: string;
}

export const state = writable<State>({
  api: 'http://localhost:11434',
});
