
export async function getModels() {
  const models = await fetch('http://localhost:11434/api/tags');
  const json = await models.json();
  return json;
}
