import { get } from "svelte/store";
import { state } from "$lib/state";

export async function getModels() {
  const { api } = get(state);
  const models = await fetch(`${api}/api/tags`);
  const json = await models.json();
  return json;
}
