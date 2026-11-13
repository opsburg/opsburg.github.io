"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SkyCity from "./SkyCity";

/*
 * The hero: Opsburg at night, floating over a sea of clouds.
 * Every ten seconds a storm rolls in and lightning strikes a boiler house: its windows go dark and a red
 * lamp blinks. A brass automaton flies out of the clocktower, repairs it with a shower of sparks, the
 * lights come back and the lamp turns green. The city keeps flying. Plain three.js, no post-processing.
 */

const COLORS = {
  notte: 0x0a1e35,
  deep: 0x071629,
  high: 0x11294a,
  brass: 0xc9952a,
  brassLight: 0xe6c06a,
  copper: 0xb4642e,
  cream: 0xf6ecd3,
  verdigris: 0x2f8a78,
  rock: 0x4a3b2e,
  rockDark: 0x2a2119,
  grass: 0x4d6b3c,
  wall: 0x5a4636,
  window: 0xf1d27a,
  foreign: 0x8fbbe2,
  plant: 0x5e6b7a,
};

type Cleanup = () => void;

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function buildScene(container: HTMLDivElement, reducedMotion: boolean): Cleanup {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.notte, 0.012);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };
  const mat = (params: THREE.MeshStandardMaterialParameters) =>
    track(new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.8, metalness: 0.1, ...params }));
  const brassMat = mat({ color: COLORS.brass, metalness: 0.75, roughness: 0.35 });
  const copperMat = mat({ color: COLORS.copper, metalness: 0.6, roughness: 0.45 });
  const wallMat = mat({ color: COLORS.wall });
  const rockMat = mat({ color: COLORS.rock });
  const rockDarkMat = mat({ color: COLORS.rockDark });
  const grassMat = mat({ color: COLORS.grass });
  // Lit from inside: unlit materials, so night lighting never greys them out
  const windowMat = track(new THREE.MeshBasicMaterial({ color: COLORS.window }));
  const clockMat = track(new THREE.MeshBasicMaterial({ color: COLORS.cream }));
  const creamMat = mat({ color: COLORS.cream, roughness: 0.6 });

  // Sky: a vertical gradient on a large inverted sphere, with a warm haze near the horizon
  const skyGeo = track(new THREE.SphereGeometry(200, 32, 16));
  const skyMat = track(
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(COLORS.deep) },
        mid: { value: new THREE.Color(COLORS.high) },
        horizon: { value: new THREE.Color(0x3d3340) },
      },
      vertexShader: "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; varying vec3 vPos; void main(){ float h = normalize(vPos).y; vec3 c = mix(horizon, mid, smoothstep(-0.05, 0.25, h)); c = mix(c, top, smoothstep(0.25, 0.8, h)); gl_FragColor = vec4(c, 1.0); }",
    }),
  );
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  // Stars
  const starCount = 1400;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 0.9 + 0.1);
    const r = 180;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi);
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = track(new THREE.PointsMaterial({ color: COLORS.cream, size: 0.45, sizeAttenuation: true, transparent: true, opacity: 0.8, fog: false }));
  scene.add(new THREE.Points(starGeo, starMat));

  // Lights: cool moon, faint sky fill, warm city glow
  scene.add(new THREE.HemisphereLight(0x9fb7d6, 0x3a2c20, 0.95));
  const moon = new THREE.DirectionalLight(0xd6e2f5, 1.6);
  moon.position.set(-30, 40, 20);
  scene.add(moon);
  const cityGlow = new THREE.PointLight(COLORS.window, 18, 30, 1.6);
  cityGlow.position.set(0, 4, 3);
  scene.add(cityGlow);

  // Sea of clouds below the city
  const cloudGeo = track(new THREE.IcosahedronGeometry(1, 1));
  const cloudMat = track(new THREE.MeshStandardMaterial({ color: 0x6f7f96, roughness: 1, flatShading: true, transparent: true, opacity: 0.55 }));
  const cloudCount = 260;
  const clouds = new THREE.InstancedMesh(cloudGeo, cloudMat, cloudCount);
  const cloudData: { x: number; y: number; z: number; s: number; speed: number }[] = [];
  const dummy = new THREE.Object3D();
  for (let i = 0; i < cloudCount; i++) {
    const c = { x: (Math.random() - 0.5) * 160, y: -9 - Math.random() * 6, z: -70 + Math.random() * 90, s: 2 + Math.random() * 4.5, speed: 0.15 + Math.random() * 0.25 };
    cloudData.push(c);
  }
  scene.add(clouds);
  const placeClouds = (t: number) => {
    cloudData.forEach((c, i) => {
      const x = ((c.x + t * c.speed + 80) % 160) - 80;
      dummy.position.set(x, c.y, c.z);
      dummy.scale.set(c.s * 1.6, c.s * 0.6, c.s);
      dummy.updateMatrix();
      clouds.setMatrixAt(i, dummy.matrix);
    });
    clouds.instanceMatrix.needsUpdate = true;
  };
  placeClouds(0);

  // ---------- the city ----------
  const city = new THREE.Group();
  scene.add(city);

  const island = (radius: number, depth: number) => {
    const g = new THREE.Group();
    const rock = new THREE.Mesh(track(new THREE.ConeGeometry(radius, depth, 9, 2)), rockMat);
    rock.rotation.x = Math.PI;
    rock.position.y = -depth / 2;
    const under = new THREE.Mesh(track(new THREE.ConeGeometry(radius * 0.55, depth * 0.6, 7)), rockDarkMat);
    under.rotation.x = Math.PI;
    under.position.set(radius * 0.25, -depth * 0.95, 0.4);
    const top = new THREE.Mesh(track(new THREE.CylinderGeometry(radius, radius * 0.98, 0.5, 9)), grassMat);
    top.position.y = 0.25;
    g.add(rock, under, top);
    return g;
  };

  const box = (w: number, h: number, d: number, material: THREE.Material) => new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), material);
  const windowsOn = (target: THREE.Object3D, w: number, h: number, d: number, rows: number, cols: number, material: THREE.Material = windowMat) => {
    const geo = track(new THREE.PlaneGeometry(0.22, 0.3));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pane = new THREE.Mesh(geo, material);
        pane.position.set(-w / 2 + (w / (cols + 1)) * (c + 1), -h / 2 + (h / (rows + 1)) * (r + 1), d / 2 + 0.01);
        target.add(pane);
      }
    }
  };

  const main = island(6.2, 9);
  city.add(main);

  // Clocktower: the control plane
  const tower = box(1.5, 6, 1.5, wallMat);
  tower.position.set(0, 3.5, 0);
  windowsOn(tower, 1.5, 6, 1.5, 4, 2);
  const roof = new THREE.Mesh(track(new THREE.ConeGeometry(1.25, 1.8, 4)), brassMat);
  roof.position.set(0, 7.4, 0);
  roof.rotation.y = Math.PI / 4;
  const clockFace = new THREE.Mesh(track(new THREE.CircleGeometry(0.55, 24)), clockMat);
  clockFace.position.set(0, 5.6, 0.77);
  const handGeo = track(new THREE.BoxGeometry(0.05, 0.42, 0.02));
  const handMat = mat({ color: COLORS.notte });
  const hourHand = new THREE.Mesh(handGeo, handMat);
  hourHand.geometry.translate(0, 0.21, 0);
  hourHand.position.set(0, 5.6, 0.79);
  const minuteHand = new THREE.Mesh(handGeo, handMat);
  minuteHand.position.set(0, 5.6, 0.8);
  minuteHand.scale.set(0.8, 1.3, 1);
  city.add(tower, roof, clockFace, hourHand, minuteHand);

  // Boiler houses: the city's own engines, with chimneys and steam
  const engines: THREE.MeshStandardMaterial[] = [];
  const chimneyTops: THREE.Vector3[] = [];
  // The second boiler is the one the storm strikes: its windows and engine can go dark
  const struckWindowMat = track(new THREE.MeshBasicMaterial({ color: COLORS.window }));
  const boiler = (x: number, z: number, struck = false) => {
    const house = box(2.2, 1.8, 1.8, wallMat);
    house.position.set(x, 1.4, z);
    windowsOn(house, 2.2, 1.8, 1.8, 1, 3, struck ? struckWindowMat : windowMat);
    const engineMat = mat({ color: COLORS.brass, emissive: COLORS.copper, emissiveIntensity: 0.4, metalness: 0.7, roughness: 0.35 });
    engines.push(engineMat);
    const tank = new THREE.Mesh(track(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 12)), engineMat);
    tank.rotation.z = Math.PI / 2;
    tank.position.set(x, 2.6, z);
    city.add(house, tank);
    for (const dx of [-0.6, 0.5]) {
      const chimney = new THREE.Mesh(track(new THREE.CylinderGeometry(0.16, 0.2, 1.6, 8)), copperMat);
      chimney.position.set(x + dx, 3.1, z - 0.4);
      city.add(chimney);
      chimneyTops.push(new THREE.Vector3(x + dx, 3.95, z - 0.4));
    }
  };
  boiler(-3.2, 1.2);
  boiler(3.1, 1.6, true);
  const struckEngine = engines[1];

  // Factory with a sawtooth roof, and a brass vault dome
  const factory = box(2.6, 1.5, 1.6, wallMat);
  factory.position.set(-2.6, 1.25, -2.4);
  windowsOn(factory, 2.6, 1.5, 1.6, 1, 4);
  city.add(factory);
  for (let i = 0; i < 3; i++) {
    const tooth = new THREE.Mesh(track(new THREE.CylinderGeometry(0, 0.5, 0.8, 3)), copperMat);
    tooth.rotation.z = Math.PI / 2;
    tooth.position.set(-3.5 + i * 0.85, 2.3, -2.4);
    city.add(tooth);
  }
  const vault = new THREE.Mesh(track(new THREE.SphereGeometry(1.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), brassMat);
  vault.position.set(2.6, 0.5, -2.2);
  const vaultBase = new THREE.Mesh(track(new THREE.CylinderGeometry(1.15, 1.15, 0.6, 12)), wallMat);
  vaultBase.position.set(2.6, 0.5, -2.2);
  city.add(vaultBase, vault);

  // The big brass gear on the island's face
  const gear = new THREE.Group();
  gear.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.4, 0.32, 8, 24)), brassMat));
  const toothGeo = track(new THREE.BoxGeometry(0.42, 0.55, 0.45));
  for (let i = 0; i < 12; i++) {
    const t = new THREE.Mesh(toothGeo, brassMat);
    const a = (i / 12) * Math.PI * 2;
    t.position.set(Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0);
    t.rotation.z = a;
    gear.add(t);
  }
  gear.add(new THREE.Mesh(track(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12)).rotateX(Math.PI / 2), copperMat));
  gear.position.set(1.6, -2.4, 5.1);
  city.add(gear);

  // Satellite islands: observatory and lightning spire
  const satellites: { group: THREE.Group; base: THREE.Vector3; phase: number }[] = [];
  const obs = island(2.2, 3.4);
  const obsBody = new THREE.Mesh(track(new THREE.CylinderGeometry(0.8, 0.9, 1.2, 10)), wallMat);
  obsBody.position.y = 1.1;
  const obsDome = new THREE.Mesh(track(new THREE.SphereGeometry(0.85, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), brassMat);
  obsDome.position.y = 1.7;
  const scope = new THREE.Mesh(track(new THREE.CylinderGeometry(0.12, 0.18, 1.4, 8)), creamMat);
  scope.position.set(0.4, 2.3, 0);
  scope.rotation.z = -0.8;
  obs.add(obsBody, obsDome, scope);
  scene.add(obs);
  satellites.push({ group: obs, base: new THREE.Vector3(-11, 2.5, -3), phase: 1.3 });

  const spireIsland = island(1.8, 3);
  const spire = new THREE.Mesh(track(new THREE.ConeGeometry(0.35, 4.5, 6)), brassMat);
  spire.position.y = 2.6;
  spireIsland.add(spire);
  scene.add(spireIsland);
  satellites.push({ group: spireIsland, base: new THREE.Vector3(10.5, 4, -6), phase: 2.6 });

  // Airship: a cream envelope, a copper gondola, brass fins and a spinning propeller
  const airship = new THREE.Group();
  const envelope = new THREE.Mesh(track(new THREE.SphereGeometry(1, 20, 12)), creamMat);
  envelope.scale.set(2.6, 0.95, 0.95);
  const gondola = box(1.4, 0.45, 0.6, copperMat);
  gondola.position.y = -1.2;
  const finGeo = track(new THREE.BoxGeometry(0.8, 0.9, 0.06));
  const finV = new THREE.Mesh(finGeo, brassMat);
  finV.position.set(-2.5, 0.2, 0);
  const finH = new THREE.Mesh(finGeo, brassMat);
  finH.position.set(-2.5, 0, 0);
  finH.rotation.x = Math.PI / 2;
  const propeller = box(0.06, 1.1, 0.12, brassMat);
  propeller.position.set(-0.8, -1.2, 0);
  airship.add(envelope, gondola, finV, finH, propeller);
  airship.scale.setScalar(0.85);
  scene.add(airship);

  // ---------- the storm and the automaton ----------
  const STRIKE = new THREE.Vector3(3.1, 3.2, 1.6); // the struck boiler's roof, in city coordinates
  const HOME = new THREE.Vector3(0, 8.6, 0.8); // above the clocktower

  // A dark cloud that drifts in over the boiler
  const storm = new THREE.Group();
  const stormMat = track(new THREE.MeshStandardMaterial({ color: 0x2b3445, roughness: 1, flatShading: true, transparent: true, opacity: 0.95 }));
  const puffGeo = track(new THREE.IcosahedronGeometry(1, 1));
  [
    [0, 0, 0, 1.8],
    [1.8, -0.3, 0.4, 1.4],
    [-1.7, -0.2, -0.3, 1.5],
    [0.6, 0.8, -0.5, 1.3],
    [-0.8, 0.6, 0.6, 1.2],
    [2.9, -0.5, -0.2, 1],
    [-2.8, -0.4, 0.3, 1],
  ].forEach(([x, y, z, s]) => {
    const puff = new THREE.Mesh(puffGeo, stormMat);
    puff.position.set(x, y, z);
    puff.scale.set(s * 1.3, s * 0.8, s);
    storm.add(puff);
  });
  city.add(storm);

  // The bolt: a zigzag from the cloud to the roof
  const boltPath = new THREE.CurvePath<THREE.Vector3>();
  const boltPoints = [
    new THREE.Vector3(3.4, 10, 1.6),
    new THREE.Vector3(2.6, 8.3, 1.7),
    new THREE.Vector3(3.7, 6.9, 1.5),
    new THREE.Vector3(2.8, 5.2, 1.7),
    new THREE.Vector3(3.3, 4.2, 1.6),
    STRIKE.clone(),
  ];
  for (let i = 0; i < boltPoints.length - 1; i++) boltPath.add(new THREE.LineCurve3(boltPoints[i], boltPoints[i + 1]));
  const boltMat = track(new THREE.MeshBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: 0 }));
  const bolt = new THREE.Mesh(track(new THREE.TubeGeometry(boltPath, 40, 0.09, 5, false)), boltMat);
  city.add(bolt);
  const flash = new THREE.PointLight(0xcfe3ff, 0, 40, 1.5);
  flash.position.set(3.1, 6, 3);
  city.add(flash);

  // The alarm lamp on the struck boiler: red while broken, green once repaired
  const lampMat = track(new THREE.MeshBasicMaterial({ color: 0xff5a4a }));
  const lamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.2, 10, 8)), lampMat);
  lamp.position.set(4.05, 2.55, 2.4);
  city.add(lamp);

  // The automaton: a brass body, a spinning copper ring, a steam-blue eye
  const automaton = new THREE.Group();
  automaton.add(new THREE.Mesh(track(new THREE.SphereGeometry(0.34, 14, 10)), brassMat));
  const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.55, 0.06, 6, 20)), copperMat);
  ring.rotation.x = Math.PI / 2;
  automaton.add(ring);
  const eye = new THREE.Mesh(track(new THREE.SphereGeometry(0.1, 8, 6)), track(new THREE.MeshBasicMaterial({ color: COLORS.foreign })));
  eye.position.set(0, 0, 0.32);
  automaton.add(eye);
  automaton.position.copy(HOME);
  city.add(automaton);

  // Sparks while it repairs
  const sparkCount = 28;
  const sparkPos = new Float32Array(sparkCount * 3);
  const sparkGeo = track(new THREE.BufferGeometry());
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = track(new THREE.PointsMaterial({ color: COLORS.brassLight, size: 0.14, transparent: true, opacity: 0 }));
  city.add(new THREE.Points(sparkGeo, sparkMat));

  // Steam from the chimneys
  const steamGeo = track(new THREE.SphereGeometry(0.22, 6, 4));
  const steamMat = track(new THREE.MeshStandardMaterial({ color: 0xd9d2c3, transparent: true, opacity: 0.5, flatShading: true }));
  const steam = Array.from({ length: 36 }, (_, i) => {
    const m = new THREE.Mesh(steamGeo, steamMat);
    city.add(m);
    return { mesh: m, source: chimneyTops[i % chimneyTops.length], offset: Math.random() };
  });

  // ---------- layout, input, loop ----------
  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const base = new THREE.Vector3();
  const target = new THREE.Vector3();
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Wide screens: the city sits right of the headline. Narrow ones: centred, further back.
    const wide = camera.aspect > 1.1;
    city.position.set(wide ? 12.5 : 0, wide ? 0 : 3, 0);
    base.set(wide ? 1 : 0, wide ? 7 : 8, wide ? 40 : 52);
    target.set(wide ? 7 : 0, wide ? 2.5 : 3.5, 0);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Storm cycle, 10 s: the storm comes in (0–2), lightning (2), broken (2.2–7), the automaton flies out
  // (2.6–4.2), repairs (4.2–6.8), lights back and a green lamp (7–8.2), the automaton flies home (7–8.6)
  const CYCLE = 10;
  const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const flyPoint = new THREE.Vector3();
  const fly = (from: THREE.Vector3, to: THREE.Vector3, u: number, out: THREE.Vector3) => {
    const k = ease(u);
    out.lerpVectors(from, to, k);
    out.y += Math.sin(k * Math.PI) * 1.6;
    return out;
  };
  const REPAIR = STRIKE.clone().add(new THREE.Vector3(0.2, 1.1, 0.9));

  const start = performance.now();
  let raf = 0;
  let visible = true;

  const frame = (t: number) => {
    const p = t % CYCLE;

    // The storm drifts in from the right, then leaves to the left and fades
    const arrive = ease(p / 2);
    const leave = ease((p - 6) / 3.5);
    storm.position.set(STRIKE.x + (1 - arrive) * 14 - leave * 16, 11 + leave * 2, STRIKE.z);
    stormMat.opacity = 0.95 * arrive * (1 - leave);
    storm.visible = stormMat.opacity > 0.02;

    // Lightning
    const strike = p >= 2 && p < 2.35;
    boltMat.opacity = strike ? (Math.sin(p * 90) > -0.3 ? 1 : 0.2) : 0;
    flash.intensity = strike ? 70 : 0;

    // Broken, then repaired
    const broken = p >= 2.2 && p < 7;
    struckWindowMat.color.setHex(broken ? COLORS.rockDark : COLORS.window);
    struckEngine.emissiveIntensity = broken ? 0 : 0.4;
    if (broken) {
      lamp.visible = Math.sin(p * 9) > 0;
      lampMat.color.setHex(0xff5a4a);
    } else if (p >= 7 && p < 8.2) {
      lamp.visible = true;
      lampMat.color.setHex(0x5fc2aa);
    } else {
      lamp.visible = false;
    }
    cityGlow.intensity = broken ? 14 : 18;

    // The automaton: out, repair, home
    if (p >= 2.6 && p < 4.2) {
      automaton.position.copy(fly(HOME, REPAIR, (p - 2.6) / 1.6, flyPoint));
    } else if (p >= 4.2 && p < 7) {
      automaton.position.set(REPAIR.x + Math.sin(p * 6) * 0.08, REPAIR.y + Math.sin(p * 4) * 0.12, REPAIR.z);
    } else if (p >= 7 && p < 8.6) {
      automaton.position.copy(fly(REPAIR, HOME, (p - 7) / 1.6, flyPoint));
    } else {
      automaton.position.set(HOME.x, HOME.y + Math.sin(t * 2) * 0.1, HOME.z);
    }
    ring.rotation.z = t * 6;
    automaton.lookAt(camera.position);

    const repairing = p >= 4.4 && p < 6.8;
    sparkMat.opacity = repairing ? 0.9 : 0;
    if (repairing) {
      for (let i = 0; i < sparkCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.7;
        sparkPos[i * 3] = STRIKE.x + Math.cos(a) * r;
        sparkPos[i * 3 + 1] = STRIKE.y + 0.3 + Math.random() * 0.6;
        sparkPos[i * 3 + 2] = STRIKE.z + 0.6 + Math.sin(a) * r * 0.5;
      }
      sparkGeo.attributes.position.needsUpdate = true;
    }

    // Everything keeps flying
    city.position.y = (camera.aspect > 1.1 ? 0 : 3) + Math.sin(t * 0.6) * 0.35;
    city.rotation.y = Math.sin(t * 0.15) * 0.08;
    gear.rotation.z = t * 0.5;
    hourHand.rotation.z = -t * 0.05;
    minuteHand.rotation.z = -t * 0.6;
    satellites.forEach((s) => {
      s.group.position.set(s.base.x + city.position.x * 0.6, s.base.y + Math.sin(t * 0.7 + s.phase) * 0.5, s.base.z);
    });
    const a = t * 0.12;
    airship.position.set(city.position.x + Math.cos(a) * 14, 9 + Math.sin(t * 0.5) * 0.6, Math.sin(a) * 9 - 2);
    airship.rotation.y = -a + Math.PI / 2;
    propeller.rotation.x = t * 18;
    steam.forEach((s) => {
      const u = (s.offset + t * 0.25) % 1;
      s.mesh.position.set(s.source.x + Math.sin(u * 6 + s.offset * 10) * 0.25, s.source.y + u * 2.6, s.source.z - u * 0.6);
      s.mesh.scale.setScalar(0.6 + u * 1.6);
    });
    placeClouds(t);

    // A slow camera that leans toward the pointer
    camera.position.x += (base.x + pointer.x * 2.2 - camera.position.x) * 0.04;
    camera.position.y += (base.y - pointer.y * 1.2 - camera.position.y) * 0.04;
    camera.position.z = base.z;
    camera.lookAt(target);

    renderer.render(scene, camera);
  };

  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (visible && !document.hidden) frame((performance.now() - start) / 1000);
  };

  camera.position.copy(base);
  if (reducedMotion) {
    // One still frame, mid-repair, so the story is still told
    frame(5);
  } else {
    loop();
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(container);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    disposables.forEach((d) => d.dispose());
    clouds.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (!supportsWebGL()) {
      setFallback(true);
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup: Cleanup | undefined;
    try {
      cleanup = buildScene(container, reducedMotion);
      setReady(true);
    } catch {
      setFallback(true);
    }
    return () => cleanup?.();
  }, []);

  if (fallback) {
    return (
      <div className="absolute inset-0 flex items-center justify-end pr-[6vw]">
        <div className="w-full max-w-xl opacity-90">
          <SkyCity />
        </div>
      </div>
    );
  }

  return <div ref={ref} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />;
}
