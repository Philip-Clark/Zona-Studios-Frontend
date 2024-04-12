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

const smoothImage = (svgString) => {
  paper.setup(new paper.Size(1600, 1600));
  paper.project.importSVG(svgString);

  const paths = paper.project.getItems({ class: paper.Path });
  return paper.project.exportSVG({ asString: true });
};

export { unitePaths, smoothImage };
