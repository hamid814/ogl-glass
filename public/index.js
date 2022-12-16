import gsap from 'gsap';
import {
  Renderer,
  Geometry,
  Program,
  Mesh,
  Vec3,
  Vec2,
  Orbit,
  Camera,
} from 'ogl';
import vertex from './vert.glsl';
import fragment from './frag.glsl';

const rotateBtn = document.querySelector('#rotate-btn');
const refractBtn = document.querySelector('#refract-btn');

const values = {
  boxSize: new Vec3(1, 1, 1),
  refractionPower: 0,
};

const state = {
  isRotating: true,
  isRefracting: true,
  time: 0,
  timeStep: 0,
};

const renderer = new Renderer({
  width: window.innerWidth,
  height: window.innerHeight,
});

const gl = renderer.gl;

const camera = new Camera(gl);
camera.position.set(1.8, 2.2, 3.8);

const controls = new Orbit(camera, {
  target: new Vec3(0, 0.7, 0),
});

document.body.appendChild(gl.canvas);

const geometry = new Geometry(gl, {
  position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
  uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
});

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    uTime: { value: 0 },
    refractionPower: { value: 0 },
    camPos: { value: new Vec3(0, 0, 5) },
    resolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
    boxSize: { value: values.boxSize },
  },
});

const mesh = new Mesh(gl, { geometry, program });

function update() {
  requestAnimationFrame(update);

  program.uniforms.uTime.value = state.time;
  program.uniforms.refractionPower.value = values.refractionPower;
  program.uniforms.camPos.value = camera.position;
  program.uniforms.boxSize.value = values.boxSize;
  controls.update();

  // Don't need a camera if camera uniforms aren't required
  state.time += state.timeStep;

  renderer.render({ scene: mesh });
}

rotateBtn.addEventListener('click', () => {
  if (state.isRotating) {
    gsap.to(state, {
      duration: 0.5,
      ease: 'power3.in',
      timeStep: 0.025,
    });

    state.isRotating = false;
  } else {
    gsap.to(state, {
      duration: 0.5,
      ease: 'power3.out',
      timeStep: 0,
    });

    state.isRotating = true;
  }
});

refractBtn.addEventListener('click', () => {
  if (state.isRefracting) {
    gsap.to(values, {
      duration: 1,
      refractionPower: 1,
      ease: 'power3.out',
    });

    state.isRefracting = false;
  } else {
    gsap.to(values, {
      duration: 1,
      refractionPower: 0,
      ease: 'power3.out',
    });

    state.isRefracting = true;
  }
});

requestAnimationFrame(update);
