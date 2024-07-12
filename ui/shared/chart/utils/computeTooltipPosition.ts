import { clamp } from 'es-toolkit';

interface Params {
  pointX: number;
  pointY: number;
  offset: number;
  nodeWidth: number;
  nodeHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

export default function computeTooltipPosition({ pointX, pointY, canvasWidth, canvasHeight, nodeWidth, nodeHeight, offset }: Params): [ number, number ] {
  // right
  if (pointX + offset + nodeWidth <= canvasWidth) {
    const x = pointX + offset;
    const y = clamp(pointY - nodeHeight / 2, 0, canvasHeight - nodeHeight);
    return [ x, y ];
  }

  // left
  if (nodeWidth + offset <= pointX) {
    const x = pointX - offset - nodeWidth;
    const y = clamp(pointY - nodeHeight / 2, 0, canvasHeight - nodeHeight);
    return [ x, y ];
  }

  // top
  if (nodeHeight + offset <= pointY) {
    const x = clamp(pointX - nodeWidth / 2, 0, canvasWidth - nodeWidth);
    const y = pointY - offset - nodeHeight;
    return [ x, y ];
  }

  // bottom
  if (pointY + offset + nodeHeight <= canvasHeight) {
    const x = clamp(pointX - nodeWidth / 2, 0, canvasWidth - nodeWidth);
    const y = pointY + offset;
    return [ x, y ];
  }

  const x = clamp(pointX / 2, 0, canvasWidth - nodeWidth);
  const y = clamp(pointY / 2, 0, canvasHeight - nodeHeight);

  return [ x, y ];
}
