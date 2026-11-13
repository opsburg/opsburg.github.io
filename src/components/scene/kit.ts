import * as THREE from "three";

/*
 * Shared pieces for the page scenes: a night sky over a sea of clouds, flat-shaded brass and stone,
 * floating islands, the automaton and the airship, text labels, and a render loop that pauses when the
 * scene is off screen or the tab is hidden. Plain three.js, no post-processing.
 */

export const COLORS = {
  notte: 0x0a1e35,
  deep: 0x071629,
  high: 0x11294a,
  brass: 0xc9952a,
  brassLight: 0xe6c06a,
  copper: 0xb4642e,
  cream: 0xf6ecd3,
  verdigris: 0x2f8a78,
  green: 0x5fc2aa,
  red: 0xff5a4a,
  amber: 0xf2a93b,
  rock: 0x4a3b2e,
  rockDark: 0x2a2119,
  grass: 0x4d6b3c,
  wall: 0x5a4636,
  window: 0xf1d27a,
  eye: 0x8fbbe2,
  off: 0x3a3026,
};

export type Cleanup = () => void;

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function createStage(container: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const fog = new THREE.FogExp2(COLORS.notte, 0.012);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };
  const mat = (params: THREE.MeshStandardMaterialParameters) =>
    track(new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.8, metalness: 0.1, ...params }));
  const basic = (color: number, params: THREE.MeshBasicMaterialParameters = {}) =>
    track(new THREE.MeshBasicMaterial({ color, ...params }));

  const m = {
    brass: mat({ color: COLORS.brass, metalness: 0.75, roughness: 0.35 }),
    copper: mat({ color: COLORS.copper, metalness: 0.6, roughness: 0.45 }),
    wall: mat({ color: COLORS.wall }),
    rock: mat({ color: COLORS.rock }),
    rockDark: mat({ color: COLORS.rockDark }),
    grass: mat({ color: COLORS.grass }),
    cream: mat({ color: COLORS.cream, roughness: 0.6 }),
    // Lit from inside: unlit materials, so night lighting never greys them out
    window: basic(COLORS.window),
    clock: basic(COLORS.cream),
    dark: mat({ color: COLORS.notte }),
  };

  // Sky: a vertical gradient on a large inverted sphere, with a warm haze near the horizon
  const sky = new THREE.Mesh(
    track(new THREE.SphereGeometry(200, 32, 16)),
    track(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color(COLORS.deep) },
          mid: { value: new THREE.Color(COLORS.high) },
          horizon: { value: new THREE.Color(0x3d3340) },
        },
        vertexShader:
          "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; varying vec3 vPos; void main(){ float h = normalize(vPos).y; vec3 c = mix(horizon, mid, smoothstep(-0.05, 0.25, h)); c = mix(c, top, smoothstep(0.25, 0.8, h)); gl_FragColor = vec4(c, 1.0); }",
      }),
    ),
  );
  scene.add(sky);

  const starCount = 1200;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 0.9 + 0.1);
    starPos[i * 3] = 180 * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = 180 * Math.cos(phi);
    starPos[i * 3 + 2] = 180 * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      track(new THREE.PointsMaterial({ color: COLORS.cream, size: 0.45, transparent: true, opacity: 0.8, fog: false })),
    ),
  );

  // Cool moon, faint sky fill
  scene.add(new THREE.HemisphereLight(0x9fb7d6, 0x3a2c20, 0.95));
  const moon = new THREE.DirectionalLight(0xd6e2f5, 1.6);
  moon.position.set(-30, 40, 20);
  scene.add(moon);

  const box = (w: number, h: number, d: number, material: THREE.Material) =>
    new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), material);

  /** A floating island: grass on top at y = 0.5, rock hanging below. */
  const island = (radius: number, depth: number) => {
    const g = new THREE.Group();
    const rock = new THREE.Mesh(track(new THREE.ConeGeometry(radius, depth, 9, 2)), m.rock);
    rock.rotation.x = Math.PI;
    rock.position.y = -depth / 2;
    const under = new THREE.Mesh(track(new THREE.ConeGeometry(radius * 0.55, depth * 0.6, 7)), m.rockDark);
    under.rotation.x = Math.PI;
    under.position.set(radius * 0.25, -depth * 0.95, 0.4);
    const top = new THREE.Mesh(track(new THREE.CylinderGeometry(radius, radius * 0.98, 0.5, 9)), m.grass);
    top.position.y = 0.25;
    g.add(rock, under, top);
    return g;
  };

  const paneGeo = track(new THREE.PlaneGeometry(0.22, 0.3));
  /** Window panes on the front face of a box centred on its origin. */
  const windowsOn = (
    target: THREE.Object3D,
    w: number,
    h: number,
    d: number,
    rows: number,
    cols: number,
    material: THREE.Material = m.window,
  ) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pane = new THREE.Mesh(paneGeo, material);
        pane.position.set(-w / 2 + (w / (cols + 1)) * (c + 1), -h / 2 + (h / (rows + 1)) * (r + 1), d / 2 + 0.01);
        target.add(pane);
      }
    }
  };

  return { renderer, scene, camera, fog, disposables, track, mat, basic, m, box, island, windowsOn };
}

export type Stage = ReturnType<typeof createStage>;

/** A sea of clouds drifting below the islands. Returns the per-frame update. */
export function seaOfClouds(stage: Stage, count = 220) {
  const geo = stage.track(new THREE.IcosahedronGeometry(1, 1));
  const material = stage.track(
    new THREE.MeshStandardMaterial({ color: 0x6f7f96, roughness: 1, flatShading: true, transparent: true, opacity: 0.55 }),
  );
  const clouds = stage.track(new THREE.InstancedMesh(geo, material, count));
  const data = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 160,
    y: -9 - Math.random() * 6,
    z: -70 + Math.random() * 90,
    s: 2 + Math.random() * 4.5,
    speed: 0.15 + Math.random() * 0.25,
  }));
  stage.scene.add(clouds);
  const dummy = new THREE.Object3D();
  const update = (t: number) => {
    data.forEach((c, i) => {
      dummy.position.set((((c.x + t * c.speed + 80) % 160) + 160) % 160 - 80, c.y, c.z);
      dummy.scale.set(c.s * 1.6, c.s * 0.6, c.s);
      dummy.updateMatrix();
      clouds.setMatrixAt(i, dummy.matrix);
    });
    clouds.instanceMatrix.needsUpdate = true;
  };
  update(0);
  return update;
}

/** The automaton, an AI agent: a brass body, a spinning copper ring, a steam-blue eye. */
export function makeAutomaton(stage: Stage) {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(stage.track(new THREE.SphereGeometry(0.34, 14, 10)), stage.m.brass));
  const ring = new THREE.Mesh(stage.track(new THREE.TorusGeometry(0.55, 0.06, 6, 20)), stage.m.copper);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const eye = new THREE.Mesh(stage.track(new THREE.SphereGeometry(0.1, 8, 6)), stage.basic(COLORS.eye));
  eye.position.set(0, 0, 0.32);
  group.add(eye);
  return { group, ring };
}

/** The airship, a deploy: cream envelope, copper gondola, brass fins, a spinning propeller. Points along +x. */
export function makeAirship(stage: Stage) {
  const group = new THREE.Group();
  const envelope = new THREE.Mesh(stage.track(new THREE.SphereGeometry(1, 20, 12)), stage.m.cream);
  envelope.scale.set(2.6, 0.95, 0.95);
  const gondola = stage.box(1.4, 0.45, 0.6, stage.m.copper);
  gondola.position.y = -1.2;
  const finGeo = stage.track(new THREE.BoxGeometry(0.8, 0.9, 0.06));
  const finV = new THREE.Mesh(finGeo, stage.m.brass);
  finV.position.set(-2.5, 0.2, 0);
  const finH = new THREE.Mesh(finGeo, stage.m.brass);
  finH.position.set(-2.5, 0, 0);
  finH.rotation.x = Math.PI / 2;
  const propeller = stage.box(0.06, 1.1, 0.12, stage.m.brass);
  propeller.position.set(-0.8, -1.2, 0);
  group.add(envelope, gondola, finV, finH, propeller);
  group.scale.setScalar(0.85);
  return { group, propeller };
}

/** A brass plaque with text, always facing the camera. Height in world units; width follows the text. */
export function makeLabel(stage: Stage, text: string, height = 0.8) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const texture = stage.track(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = stage.track(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, fog: false }));
  const sprite = new THREE.Sprite(material);
  const draw = () => {
    if (!ctx) return;
    const font = "700 88px Cinzel, Georgia, serif";
    ctx.font = font;
    const textWidth = Math.ceil(ctx.measureText(text).width);
    canvas.width = textWidth + 96;
    canvas.height = 144;
    ctx.font = font;
    ctx.fillStyle = "rgba(7, 22, 41, 0.82)";
    ctx.strokeStyle = "#c9952a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(3, 3, canvas.width - 6, canvas.height - 6, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f6ecd3";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 3);
    texture.needsUpdate = true;
    sprite.scale.set((height * canvas.width) / canvas.height, height, 1);
  };
  draw();
  // Cinzel may not be loaded yet: ask for it, then draw again
  document.fonts?.load("700 88px Cinzel").then(draw).catch(() => undefined);
  return { sprite, material };
}

/** Sparks that burst from a point and fall back. Returns the trigger and the per-frame update. */
export function makeBurst(stage: Stage, parent: THREE.Object3D, count: number, color: number, size = 0.16) {
  const pos = new Float32Array(count * 3);
  const vel = Array.from({ length: count }, () => {
    const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5).normalize();
    return v.multiplyScalar(2.5 + Math.random() * 2);
  });
  const geo = stage.track(new THREE.BufferGeometry());
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const material = stage.track(new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0, depthWrite: false }));
  parent.add(new THREE.Points(geo, material));
  const origin = new THREE.Vector3();
  /** age: seconds since the burst started, at the given origin. */
  const update = (at: THREE.Vector3, age: number, life = 1.4) => {
    if (age < 0 || age > life) {
      material.opacity = 0;
      return;
    }
    origin.copy(at);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = origin.x + vel[i].x * age;
      pos[i * 3 + 1] = origin.y + vel[i].y * age - 1.6 * age * age;
      pos[i * 3 + 2] = origin.z + vel[i].z * age;
    }
    geo.attributes.position.needsUpdate = true;
    material.opacity = 1 - age / life;
  };
  return update;
}

type View = { base: THREE.Vector3; target: THREE.Vector3; fog?: number };

/**
 * Runs the scene: resize, a camera that leans toward the pointer, a loop that pauses off screen, and a
 * single still frame under reduced motion. Returns the cleanup.
 */
export function run(
  stage: Stage,
  container: HTMLDivElement,
  options: { reducedMotion: boolean; still: number; layout: (aspect: number) => View; frame: (t: number) => void },
): Cleanup {
  const { renderer, camera, scene, fog } = stage;
  let view: View = options.layout(1);

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const render = (t: number) => {
    options.frame(t);
    camera.position.x += (view.base.x + pointer.x * 2 - camera.position.x) * 0.04;
    camera.position.y += (view.base.y - pointer.y * 1.1 - camera.position.y) * 0.04;
    camera.position.z = view.base.z;
    camera.lookAt(view.target);
    renderer.render(scene, camera);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    view = options.layout(camera.aspect);
    fog.density = view.fog ?? 0.012;
    camera.position.copy(view.base);
    if (options.reducedMotion) render(options.still);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(container);

  const start = performance.now();
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (visible && !document.hidden) render((performance.now() - start) / 1000);
  };
  if (options.reducedMotion) render(options.still);
  else loop();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    stage.disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
