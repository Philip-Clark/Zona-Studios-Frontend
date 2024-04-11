import { paper, CompoundPath } from 'paper/dist/paper-core';

const unitePaths = (paths) => {
  return new Promise((resolve, reject) => {
    paper.setup(new paper.Size(1, 1));
    const paperPaths = paths.map((path) => new CompoundPath(path));
    const united = paperPaths.reduce((acc, path) => acc.unite(path));

    const dAttribute = united.getPathData();
    resolve(dAttribute);
  });
};

export default unitePaths;
