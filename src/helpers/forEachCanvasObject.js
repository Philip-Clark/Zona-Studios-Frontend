export default function getEveryCanvasObject(canvas) {
  const objects = [];

  canvas?._objects.forEach(addObjectToList);

  function addObjectToList(obj) {
    objects.push(obj);

    if (obj._objects) {
      obj._objects.forEach(addObjectToList);
    }
  }

  return objects;
}
