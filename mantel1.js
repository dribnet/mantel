const canvasWidth = 960;
const canvasHeight = 500;

let seed = null;

const colorStrings = ["#D81D03", "#101A9D", "#1C7E4E", "#F6A402", "#EFD4BF", "#E2E0EF", "#050400"];
let colors = [];

function setup () {
  let can = createCanvas(canvasWidth, canvasHeight);
  can.parent('canvasContainer');  

  smooth(2);
  pixelDensity(2);
  strokeWeight(3);

  seed = int(random(999999));
  for(let i=0; i<colorStrings.length; i++) {
    colors.push(color(colorStrings[i]))
  }

  noLoop();
  generate();
}

function draw () {
}

function mousePressed() {
  seed = int(random(999999));
  generate();
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}

function generate() {
  let back = rcol();
  background(back);

  let points = [];

  let des = random(1000000);
  let det = random(0.004, 0.03)/(width*1./960);

  for (let i = 0; i < 3000; i++) {
    let r1 = rcol().levels;
    let r2 = rcol().levels;
    stroke(r1[0], r1[1], r1[2], 80);
    fill(r1[0], r1[1], r1[2], 240);
    let x = random(width);
    let y = random(height);
    beginShape();
    let dis = width/9.6;
    for (let j = 0; j < dis; j++) {
      let ang = noise(des+x*det, des+y*det)*TWO_PI;
      x += cos(ang);
      y += sin(ang);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  noiseDetail(1);
  for (let i = 0; i < 80000; i++) {
    let x = random(width);
    let y = random(height);
    let dis = dist(x, y, width/2, height/2);
    dis = dis/(width*1.41);
    dis = map(dis, 0, 1, 2, 1);
    let s = width*random(0.1)*random(0.5, 1)*dis;
    s = width*noise(des+x*det, des+y*det)*dis*random(0.05, 0.2);

    let add = true;
    for (let j = 0; j < points.length; j++) {
      let o = points[j];
      if (dist(x, y, o.x, o.y) < (s+o.z)*0.6) {
        add = false;
        break;
      }
    }

    if (add) points.push(createVector(x, y, s));
  }

  noStroke();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let lc = lerpColor(back, color(0), random(0.05, 0.15)).levels;
    fill(lc[0], lc[1], lc[2], 80);
    let r = p.z*0.5;
    let res = max(8, int(PI*r));
    let da = TWO_PI/res;
    beginShape();
    for (let j = 0; j < res; j++) {
      let ang = da*j;
      let sa = (ang+PI*1.75)%TWO_PI;
      sa = abs(sa-PI);
      if (sa < HALF_PI) sa = HALF_PI;
      let rr = r*(1.2-pow(abs(sin(sa)), 1.5)*0.2);
      let x = p.x+cos(ang)*rr;
      let y = p.y+sin(ang)*rr;
      vertex(x, y);
    }
    endShape(CLOSE);
    // arc2(p.x, p.y, p.z, p.z*1.5, 0, TAU, 0, 20, 0);
    arc3(p.x, p.y, p.z, p.z*1.5, 0, 20, 0);
  }
  // return;

  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let col = rcol();
    fill(col);
    ellipse(p.x, p.y, p.z, p.z);

    arc3(p.x, p.y, p.z, p.z*0.0, 0, 5, 0);
    arc3(p.x, p.y, p.z, p.z*0.5, 0, 20, 0);
    arc3(p.x+p.z*0.125, p.y-p.z*0.125, p.z*0.0, p.z*0.5, 255, 20, 0);

/*
    arc2(p.x, p.y, p.z, p.z*0.0, 0, TAU, 0, 5, 0);
    arc2(p.x, p.y, p.z, p.z*0.5, 0, TAU, 0, 20, 0);
    arc2(p.x+p.z*0.125, p.y-p.z*0.125, p.z*0.0, p.z*0.5, 0, TAU, 255, 20, 0);
*/

    //noiseCircle(p.x, p.y, p.z, p.z*1.2, 255, 70, 0);
    //noiseCircle(p.x, p.y, p.z, p.z*1.2, 255, 70, 0);

    let r = p.z*0.5;
    let pp = [];
    for (let j = 0; j < 800; j++) {
      let ang = random(TWO_PI);
      let dis = acos(random(PI));
      let x =  cos(ang)*dis*(r*0.6);
      let y =  sin(ang)*dis*(r*0.6);
      let ss = r*random(0.04, 0.1);

      let add = true;
      for (let k = 0; k < pp.length; k++) {
        let o = pp[k];
        if (dist(x, y, o.x, o.y) < (ss+o.z)*0.5) {
          add = false;
          break;
        }
      }

      if (add) {
        pp.push(createVector(x, y, ss));

        fill(0, 120);
        arc(p.x+x, p.y+y, ss, ss*1.6, 0, PI);

        fill(rcol());
        ellipse(p.x+x, p.y+y, ss, ss);
      }
    }
  }
}

// arc3 is like arc2 but only handles full circles - @dribnet
function arc3(x, y, s1, s2, col, shd1, shd2) {
  noFill();
  strokeWeight(1);
  let s1i = int(s1);
  let s2i = int(s2);
  for(let i=s1i; i<s2i; i++) {
    let shade = int(0.6 * map(i, s1i, s2i-1, shd1, shd2));
    // print(shade);
    stroke(col, shade);
    ellipse(x, y, i);
  }
  noStroke();
}

// not fully implmented or tested in this version - @dribnet
function arc2(x, y, s1, s2, a1, a2, col, shd1, shd2) {
  let r1 = s1*0.5;
  let r2 = s2*0.5;
  let amp = (a2-a1);
  let ma = map(amp, 0, TWO_PI, 0, 1);
  let cc = max(1, int(max(r1, r2)*PI*ma));
  let da = amp/cc;
  for (let i = 0; i < cc; i++) {
    let ang = a1+da*i;
    beginShape();
    fill(col, shd1);
    // fill(0);
    fill(255, 0, 0);
    vertex(x+cos(ang)*r1, y+sin(ang)*r1);
    vertex(x+cos(ang+da)*r1, y+sin(ang+da)*r1);
    fill(col, shd2);
    // fill(0, 100);
    // fill(0);
    fill(0, 255, 0);
    vertex(x+cos(ang+da)*r2, y+sin(ang+da)*r2);
    vertex(x+cos(ang)*r2, y+sin(ang)*r2);
    endShape(CLOSE);
  }
}

function rcol() {
  return colors[int(random(colors.length))];
}
function getColor() {
  return getColor(random(colors.length));
}
function getColor(v) {
  v = abs(v);
  v = v%(colors.length); 
  let c1 = colors[int(v%colors.length)]; 
  let c2 = colors[int((v+1)%colors.length)]; 
  return lerpColor(c1, c2, v%1);
}