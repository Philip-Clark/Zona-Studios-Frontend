import { paper, CompoundPath, Path } from 'paper/dist/paper-core';

export default function removeIntersections(path) {
  return new Promise((resolve, reject) => {
    paper.setup(new paper.Size(1, 1));
    const paperPath = new CompoundPath(path);

    paperPath.reduce(1);
    const united = paperPath.unite(paperPath);

    const dAttribute = united.getPathData();
    resolve(dAttribute);
  });
}
