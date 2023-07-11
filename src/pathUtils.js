import { PaperOffset } from 'paperjs-offset';
import { Path, paper } from 'paper';

// Global canvas for paper functions
paper.setup(new paper.Size(1, 1));
paper.view.autoUpdate = false;

export const inflatePath = (pathData) => {
  const paperPath = new Path(pathData);
  const inflatedPath = PaperOffset.offset(paperPath, 10, 'round');
  return inflatedPath.pathData;
};
