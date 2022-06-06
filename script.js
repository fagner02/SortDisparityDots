var positions = [];
var objs = [];
var theChosenOnes = [];

var step = 10;
var length = 500;
var size = Math.ceil(length / step);
var radius = 10;

var center = radius * step + Math.round((size - radius * 2) / 2) * step;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function sleepD(ms) {
  return new Promise((resolve) => delay(ms, resolve));
}
async function drawCircle() {
  var last = [0, 0];
  var k = 0;
  for (var i = 360; i > -1; i--) {
    var y = Math.round(radius * Math.sin((i * Math.PI) / 180)) * step + center;
    var x = Math.round(radius * Math.cos((i * Math.PI) / 180)) * step + center;
    if (last[0] == x && last[1] == y) {
      continue;
    }
    last = [x, y];

    var dot = document.createElement("div");
    dot.classList.add("dot");
    dot.id = i;

    dot.style.transform = `translate(${x}px, ${y}px)`;
    dot.style.backgroundColor = `hsl(${i},50%,50%)`;
    document.querySelector(".box").appendChild(dot);
    theChosenOnes.push({ num: k, obj: dot, angle: i });
    k++;
    await sleep(10);
  }
  await sleep(1000);
  setupMap();
}

async function setupMap() {
  theChosenOnes.sort(() => {
    return Math.random() - 0.5;
  });
  await setPositions();
  // await sleep(500);
  //pigeonhole()
  bubbleSort();
}

drawCircle();
async function setPositions() {
  for (var i = 0; i < theChosenOnes.length; i++) {
    var disparity =
      1 - Math.abs(theChosenOnes[i].num - i) / theChosenOnes.length;

    var a = (theChosenOnes[i].angle * Math.PI) / 180;

    var y = coordinate(disparity, Math.sin(a));
    var x = coordinate(disparity, Math.cos(a));

    theChosenOnes[i].obj.style.transform = `translate(${x}px,${y}px)`;
    console.log("setPositions", x, y, a);
    await sleep(10);
  }
}

function coordinate(disparity, x) {
  return Math.round(radius * disparity * x) * step + center;
}

async function bubbleSort() {
  for (var i = 0; i < theChosenOnes.length; i++) {
    for (var j = i + 1; j < theChosenOnes.length; j++) {
      if (theChosenOnes[i].num > theChosenOnes[j].num) {
        var aux = theChosenOnes[i];
        theChosenOnes[i] = theChosenOnes[j];
        theChosenOnes[j] = aux;
        var index = [i, j];
        for (var k = 0; k < 2; k++) {
          // var b =
          // delay(1000000);
          // var start = window.performance.now();
          await sleep(0);
          // var end = window.performance.now();
          // console.log(`Execution time: ${end - start} ms`);
          var disparity =
            1 -
            Math.abs(theChosenOnes[index[k]].num - index[k]) /
              theChosenOnes.length;
          var a = (theChosenOnes[index[k]].angle * Math.PI) / 180;
          var y = coordinate(disparity, Math.sin(a));
          var x = coordinate(disparity, Math.cos(a));

          theChosenOnes[
            index[k]
          ].obj.style.transform = `translate(${x}px,${y}px)`;

          console.log("out");
        }
      }
    }
  }
}

async function pigeonhole() {
  var start = window.performance.now();
  var a = Array.from(
    objs.map((x) => {
      return x.index;
    })
  );

  var max = Math.max(...a);
  var min = Math.min(...a);
  var range = max - min + 1;
  var b = Array(range)
    .fill(null)
    .map(() => []);

  for (var x = 0; x < objs.length; x++) {
    if (objs[x].obj) {
      objs[x].obj.style.background = "red";
      await sleep(0);
      objs[x].obj.style.background = "white";
    }
    b[objs[x].index - min].push(objs[x]);
  }

  objs = b.reduce((x, y) => {
    return x.concat(y);
  }, []);

  for (var x = 0; x < objs.length; x++) {
    if (objs[x].obj) {
      objs[x].obj.style.background = "white";
      objs[x].obj.style.transform = `translate(${positions[x]})`;
      await sleep(0);
    }
  }
  var end = window.performance.now();
  console.log(`Execution time: ${end - start} ms`);
}

async function delay(ms, resolve) {
  var start = window.performance.now();
  while (true) {
    if (window.performance.now() - start > ms) {
      return resolve();
    }
  }
}
