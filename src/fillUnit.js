/* eslint-disable consistent-return */
// const defineStartX = require('./defineStartX');
// const defineStartY = require('./defineStartY');

export default function fillUnit(x, y, ctx) { // color part matrix
  // const startX = (x - 1) * matrix;
//  const startY = (y - 1) * matrix;
  // eslint-disable-next-line no-console
  ctx.beginPath();
  ctx.fillRect(x, y, 1, 1);
  ctx.fill();
}
