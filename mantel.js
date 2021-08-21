const canvasWidth = 960;
const canvasHeight = 960;

let seed = null;

const colorStrings = ["#f30000", "#021ead", "#017E42", "#ffb504", "#FBEDEC", "#F9F2FC", "#050400"];
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

	generate_setup();
}

let gen_back = null;
let gen_points = [];
let gen_des = null;
let gen_det = null;
let gen_curpoints = null;
let gen_curstep1 = null;
let gen_curstep2 = null;
let gen_curstep3 = null;
let gen_pointstepsize = 500;
let gen_backstepsize = 200;
let gen_stepsize = 8;

const num_background_steps = 3000;
const num_gen_points = 80000;

function generate_setup() {
  randomSeed(seed);
  noiseSeed(seed);

	gen_back = rcol();
	background(gen_back);

	gen_points = [];
	gen_des = random(1000000);
	gen_det = random(0.004, 0.01)/(width*1./960);

	gen_curpoints = 0;
	gen_curstep1 = 0;
	gen_curstep2 = 0;
	gen_curstep3 = 0;

  loop();
}

function distance_to_center(p) {
	let dx = Math.abs(p.x - width/2);
	let dy = Math.abs(p.y - height/2);
	return dx + dy;
}

function generate_step() {

	noiseDetail(4);
	if(gen_curstep1 < num_background_steps) {
		for (let i = gen_curstep1; i < gen_curstep1+gen_backstepsize && i < num_background_steps; i++) {
			let r1 = rcol().levels;
			let r2 = rcol().levels;
			strokeWeight(1);
			stroke(r1[0], r1[1], r1[2]);
			fill(r2[0], r2[1], r2[2], 240);
			let x = random(width);
			let y = random(height);
			beginShape();
			let dis = width/9.6;
			for (let j = 0; j < dis; j++) {
				let ang = noise(gen_des+x*gen_det, gen_des+y*gen_det)*TWO_PI-HALF_PI;
				x += cos(ang);
				y += sin(ang);
				vertex(x, y);
			}
			endShape(CLOSE);
		}
		gen_curstep1 = gen_curstep1 + gen_backstepsize;
		return;
	}

	noiseDetail(1);
	if(gen_curpoints < num_gen_points) {
		for (let i = gen_curpoints; i < gen_curpoints+gen_pointstepsize && i < num_gen_points; i++) {
			let x = random(width);
			let y = random(height);
			let dis = dist(x, y, width/2, height/2);
			dis = dis/(width*1.41);
			dis = map(dis, 0, 1, 2, 1);
			let s = width*random(0.1)*random(0.5, 1)*dis;
			s = width*noise(gen_des+x*gen_det, gen_des+y*gen_det)*dis*random(0.05, 0.2);

			let add = true;
			for (let j = 0; j < gen_points.length; j++) {
				let o = gen_points[j];
				if (dist(x, y, o.x, o.y) < (s+o.z)*0.6) {
					add = false;
					break;
				}
			}

			if (add) {
				let p = createVector(x, y, s);
				gen_points.push(p);

				let lc = lerpColor(gen_back, color(0), random(0.05, 0.15)).levels;
				fill(lc[0], lc[1], lc[2], 80);
				noStroke();
				let r = p.z*0.5;
				let res = max(8, int(PI*r)*0.4);
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

        let col = rcol();
        fill(col);
        ellipse(p.x, p.y, p.z, p.z);

        arc3(p.x, p.y, p.z, p.z*0.0, 0, 5, 0);
      	arc3(p.x, p.y, p.z, p.z*0.5, 0, 20, 0);
      	arc3(p.x+p.z*0.125, p.y-p.z*0.125, p.z*0.0, p.z*0.5, 255, 20, 0);
      }
    }
    gen_curpoints = gen_curpoints + gen_pointstepsize;
    if(gen_curpoints >= num_gen_points) {
    	gen_points.sort((a, b) => distance_to_center(a) - distance_to_center(b));
    }
    return;
  }

  if(gen_curstep2 < gen_points.length) {
  	noStroke();
  	for (let i = gen_curstep2; i < gen_points.length; i++) {
  	}
  	gen_curstep2 = gen_curstep2 + gen_points.length;
  	return;
  }

  if(gen_curstep3 < gen_points.length) {
  	for (let i = gen_curstep3; i<gen_curstep3+gen_stepsize && i < gen_points.length; i++) {
  		let p = gen_points[i];

      	let r = p.z*0.5;
      	//let pp = [];

      	let n = 200;
      	let angle = PI*(3.0-sqrt(5.0)); //137.5 in radians
		for (let i = 0; i < n; i++) {
			let d = (r*0.94)*sqrt((i*1.0+random(-0.5, 0.5))/n);
			let theta = i*angle+random(-0.02, 0.02);
			let x = p.x + d * cos(theta);
			let y = p.y + d * sin(theta);

			if(random(1) < 0.7){
	      		let ss = r*random(0.04, 0.1);


	      		if(ss > 2){
	      			fill(0, 120);
	      			arc(x, y, ss, ss*1.6, 0, PI);
	      		}

				fill(rcol());
				ellipse(x, y, ss, ss);
			}
		}
      	/*
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
	      		if(ss > 2){
	      			fill(0, 120);
	      			arc(p.x+x, p.y+y, ss, ss*1.6, 0, PI);
	      		}
	      		fill(rcol());
	      		ellipse(p.x+x, p.y+y, ss, ss);
	     	}
     	}
     	*/
    }
    gen_curstep3 = gen_curstep3 + gen_stepsize;
    return;
  }
  noLoop();
  print("drawing complete :-) [seed was " + seed + ']');
}

function draw () {
	generate_step();
}

function mousePressed() {
  seed = int(random(999999));
  generate_setup();
}

function keyTyped() {
	if (key == '!') {
		saveBlocksImages();
	}
	else if (key == '1') {
    // tom's seed
		seed = 989710;
    generate_setup();
	}
}

function arc3(x, y, s1, s2, col, shd1, shd2) {
	noFill();
	strokeWeight(1);
	let s1i = int(s1);
	let s2i = int(s2);
	for(let i=s1i; i<s2i; i++) {
		let shade = int(map(i, s1i, s2i-1, shd1, shd2));
    // print(shade);
    stroke(col, shade);
    ellipse(x, y, i);
  }
  noStroke();
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