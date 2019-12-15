const canvas = document.getElementById('canvas');
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const context = canvas.getContext('2d');

// Node type
const kX = 0;
const kNumber = 1;
const kLerp = 2;
const kAdd = 3;
const kSubtract = 4;
const kMultiply = 5;
const kDivide = 6;
const kExponent = 7;
const kFunc = 8;

// Func type
const kCos = 0;
const kSin = 1;
const kTan = 2;
const kExp = 3;

function evaluate(expr, x, t) {
  switch (expr.type) {
  case kX:
    return x;
  case kNumber:
    return expr.value;
  case kLerp:
    return (1 - t) * evaluate(expr.left, x, t) + t * evaluate(expr.right, x, t);
  case kAdd:
    let sum = 0;
    for (const child of expr.children) {
      sum += evaluate(child, x, t);
    }
    return sum;
  case kMultiply:
    let product = 1;
    for (const child of expr.children) {
      product *= evaluate(child, x, t);
    }
    return product;
  case kDivide:
    return evaluate(expr.left, x, t) / evaluate(expr.right, x, t);
  case kExponent:
    return evaluate(expr.left, x, t) ** evaluate(expr.right, x, t);
  case kFunc:
    const value = evaluate(expr.param, x, t);
    switch (expr.func) {
    case kCos:
      return Math.cos(value);
    case kSin:
      return Math.sin(value);
    case kTan:
      return Math.tan(value);
    case kExp:
      return Math.exp(value);
    }
    throw expr.func;
  }
  throw expr.type;
}

const panst = {
  type: kX,
};

function graph(expr, t, xMin, xMax, yMin, yMax) {
  context.clearRect(0, 0, width, height);
  context.strokeStyle = 'lime';
  context.beginPath();
  for (let i = 0; i < width; ++i) {
    const x = xMin + (xMax - xMin) * (i / width);
    const y = evaluate(expr, x, t);
    const j = height * (1 - (y - yMin) / (yMax - yMin));
    if (i == 0) {
      context.moveTo(i, j);
    } else {
      context.lineTo(i, j);
    }
  }
  context.stroke();
}

const sin1To10 = {
  type: kFunc,
  func: kSin,
  param: {
    type: kMultiply,
    children: [{
      type: kLerp,
      left: {
        type: kNumber,
        value: 1,
      },
      right: {
        type: kNumber,
        value: 10,
      },
    }, {
      type: kX,
    }],
  },
};

const sinToCos = {
  type: kLerp,
  left: {
    type: kFunc,
    func: kSin,
    param: {
      type: kX,
    },
  },
  right: {
    type: kFunc,
    func: kCos,
    param: {
      type: kX,
    },
  },
};

function frame(time) {
  let fraction = (time / 2000) % 2;
  fraction = fraction > 1 ? 2 - fraction : fraction;
  graph(sinToCos, fraction,
    -10, 10,
    -10, 10);
  requestAnimationFrame(frame);
}
frame(0);

output.textContent = 'All good.';