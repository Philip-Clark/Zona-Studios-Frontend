import svgPathOutline from 'svg-path-outline';

export default function pathExpand(path, distance) {
  return svgPathOutline(path, distance, { bezierAccuracy: 100 });
}
