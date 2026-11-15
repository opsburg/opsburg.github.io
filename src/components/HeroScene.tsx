"use client";

import * as THREE from "three";
import SceneMount from "./scene/SceneMount";
import { COLORS, createStage, ease, makeAirship, makeAutomaton, run, seaOfClouds } from "./scene/kit";

/*
 * The hero: Opsburg floating over a sea of clouds, at night or by day with the theme.
 * Every ten seconds a storm rolls in and lightning strikes a boiler house: its windows go dark and a red
 * lamp blinks. A brass automaton flies out of the clocktower, repairs it with a shower of sparks, the
 * lights come back and the lamp turns green. The city keeps flying. Plain three.js, no post-processing.
 */

function build(container: HTMLDivElement, reducedMotion: boolean) {
  const stage = createStage(container);
  const { scene, camera, m, box, island, windowsOn, track, basic, mat } = stage;
  const clouds = seaOfClouds(stage, 260);

  // Warm glow from the windows: strong at night, a hint by day
  const cityGlow = new THREE.PointLight(COLORS.window, 18, 30, 1.6);
  cityGlow.position.set(0, 4, 3);
  scene.add(cityGlow);

  // ---------- the city ----------
  const city = new THREE.Group();
  scene.add(city);
  city.add(island(6.2, 9));

  // Clocktower: the control plane
  const tower = box(1.5, 6, 1.5, m.wall);
  tower.position.set(0, 3.5, 0);
  windowsOn(tower, 1.5, 6, 1.5, 4, 2);
  const roof = new THREE.Mesh(track(new THREE.ConeGeometry(1.25, 1.8, 4)), m.brass);
  roof.position.set(0, 7.4, 0);
  roof.rotation.y = Math.PI / 4;
  const clockFace = new THREE.Mesh(track(new THREE.CircleGeometry(0.55, 24)), m.clock);
  clockFace.position.set(0, 5.6, 0.77);
  const handGeo = track(new THREE.BoxGeometry(0.05, 0.42, 0.02));
  const hourHand = new THREE.Mesh(handGeo, m.dark);
  hourHand.geometry.translate(0, 0.21, 0);
  hourHand.position.set(0, 5.6, 0.79);
  const minuteHand = new THREE.Mesh(handGeo, m.dark);
  minuteHand.position.set(0, 5.6, 0.8);
  minuteHand.scale.set(0.8, 1.3, 1);
  city.add(tower, roof, clockFace, hourHand, minuteHand);

  // Boiler houses: the city's own engines, with chimneys and steam
  const engines: THREE.MeshStandardMaterial[] = [];
  const chimneyTops: THREE.Vector3[] = [];
  // The second boiler is the one the storm strikes: its windows and engine can go dark
  const struckWindowMat = basic(COLORS.window);
  const boiler = (x: number, z: number, struck = false) => {
    const house = box(2.2, 1.8, 1.8, m.wall);
    house.position.set(x, 1.4, z);
    windowsOn(house, 2.2, 1.8, 1.8, 1, 3, struck ? struckWindowMat : m.window);
    const engineMat = mat({ color: COLORS.brass, emissive: COLORS.copper, emissiveIntensity: 0.4, metalness: 0.7, roughness: 0.35 });
    engines.push(engineMat);
    const tank = new THREE.Mesh(track(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 12)), engineMat);
    tank.rotation.z = Math.PI / 2;
    tank.position.set(x, 2.6, z);
    city.add(house, tank);
    for (const dx of [-0.6, 0.5]) {
      const chimney = new THREE.Mesh(track(new THREE.CylinderGeometry(0.16, 0.2, 1.6, 8)), m.copper);
      chimney.position.set(x + dx, 3.1, z - 0.4);
      city.add(chimney);
      chimneyTops.push(new THREE.Vector3(x + dx, 3.95, z - 0.4));
    }
  };
  boiler(-3.2, 1.2);
  boiler(3.1, 1.6, true);
  const struckEngine = engines[1];

  // Factory with a sawtooth roof, and a brass vault dome
  const factory = box(2.6, 1.5, 1.6, m.wall);
  factory.position.set(-2.6, 1.25, -2.4);
  windowsOn(factory, 2.6, 1.5, 1.6, 1, 4);
  city.add(factory);
  for (let i = 0; i < 3; i++) {
    const tooth = new THREE.Mesh(track(new THREE.CylinderGeometry(0, 0.5, 0.8, 3)), m.copper);
    tooth.rotation.z = Math.PI / 2;
    tooth.position.set(-3.5 + i * 0.85, 2.3, -2.4);
    city.add(tooth);
  }
  const vault = new THREE.Mesh(track(new THREE.SphereGeometry(1.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), m.brass);
  vault.position.set(2.6, 0.5, -2.2);
  const vaultBase = new THREE.Mesh(track(new THREE.CylinderGeometry(1.15, 1.15, 0.6, 12)), m.wall);
  vaultBase.position.set(2.6, 0.5, -2.2);
  city.add(vaultBase, vault);

  // The big brass gear on the island's face
  const gear = new THREE.Group();
  gear.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.4, 0.32, 8, 24)), m.brass));
  const toothGeo = track(new THREE.BoxGeometry(0.42, 0.55, 0.45));
  for (let i = 0; i < 12; i++) {
    const t = new THREE.Mesh(toothGeo, m.brass);
    const a = (i / 12) * Math.PI * 2;
    t.position.set(Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0);
    t.rotation.z = a;
    gear.add(t);
  }
  gear.add(new THREE.Mesh(track(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12)).rotateX(Math.PI / 2), m.copper));
  gear.position.set(1.6, -2.4, 5.1);
  city.add(gear);

  // Satellite islands: observatory and lightning spire
  const satellites: { group: THREE.Group; base: THREE.Vector3; phase: number }[] = [];
  const obs = island(2.2, 3.4);
  const obsBody = new THREE.Mesh(track(new THREE.CylinderGeometry(0.8, 0.9, 1.2, 10)), m.wall);
  obsBody.position.y = 1.1;
  const obsDome = new THREE.Mesh(track(new THREE.SphereGeometry(0.85, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), m.brass);
  obsDome.position.y = 1.7;
  const scope = new THREE.Mesh(track(new THREE.CylinderGeometry(0.12, 0.18, 1.4, 8)), m.cream);
  scope.position.set(0.4, 2.3, 0);
  scope.rotation.z = -0.8;
  obs.add(obsBody, obsDome, scope);
  scene.add(obs);
  // High and far back, so it stays clear of the headline
  satellites.push({ group: obs, base: new THREE.Vector3(-8.5, 9, -14), phase: 1.3 });

  const spireIsland = island(1.8, 3);
  const spire = new THREE.Mesh(track(new THREE.ConeGeometry(0.35, 4.5, 6)), m.brass);
  spire.position.y = 2.6;
  spireIsland.add(spire);
  scene.add(spireIsland);
  satellites.push({ group: spireIsland, base: new THREE.Vector3(10.5, 4, -6), phase: 2.6 });

  const { group: airship, propeller } = makeAirship(stage);
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
  const boltMat = basic(0xe8f4ff, { transparent: true, opacity: 0 });
  const bolt = new THREE.Mesh(track(new THREE.TubeGeometry(boltPath, 40, 0.09, 5, false)), boltMat);
  city.add(bolt);
  const flash = new THREE.PointLight(0xcfe3ff, 0, 40, 1.5);
  flash.position.set(3.1, 6, 3);
  city.add(flash);

  // The alarm lamp on the struck boiler: red while broken, green once repaired
  const lampMat = basic(COLORS.red);
  const lamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.2, 10, 8)), lampMat);
  lamp.position.set(4.05, 2.55, 2.4);
  city.add(lamp);

  const { group: automaton, ring } = makeAutomaton(stage);
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
    const mesh = new THREE.Mesh(steamGeo, steamMat);
    city.add(mesh);
    return { mesh, source: chimneyTops[i % chimneyTops.length], offset: Math.random() };
  });

  // Storm cycle, 10 s: the storm comes in (0–2), lightning (2), broken (2.2–7), the automaton flies out
  // (2.6–4.2), repairs (4.2–6.8), lights back and a green lamp (7–8.2), the automaton flies home (7–8.6)
  const CYCLE = 10;
  const flyPoint = new THREE.Vector3();
  const fly = (from: THREE.Vector3, to: THREE.Vector3, u: number, out: THREE.Vector3) => {
    const k = ease(u);
    out.lerpVectors(from, to, k);
    out.y += Math.sin(k * Math.PI) * 1.6;
    return out;
  };
  const REPAIR = STRIKE.clone().add(new THREE.Vector3(0.2, 1.1, 0.9));

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
      lampMat.color.setHex(COLORS.red);
    } else if (p >= 7 && p < 8.2) {
      lamp.visible = true;
      lampMat.color.setHex(COLORS.green);
    } else {
      lamp.visible = false;
    }
    cityGlow.intensity = (broken ? 14 : 18) * stage.env.glow;

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
    city.position.y = Math.sin(t * 0.6) * 0.35;
    city.rotation.y = Math.sin(t * 0.15) * 0.08;
    gear.rotation.z = t * 0.5;
    hourHand.rotation.z = -t * 0.05;
    minuteHand.rotation.z = -t * 0.6;
    satellites.forEach((s) => {
      s.group.position.set(s.base.x, s.base.y + Math.sin(t * 0.7 + s.phase) * 0.5, s.base.z);
    });
    const a = t * 0.12;
    airship.position.set(Math.cos(a) * 14, 9 + Math.sin(t * 0.5) * 0.6, Math.sin(a) * 9 - 2);
    airship.rotation.y = -a + Math.PI / 2;
    propeller.rotation.x = t * 18;
    steam.forEach((s) => {
      const u = (s.offset + t * 0.25) % 1;
      s.mesh.position.set(s.source.x + Math.sin(u * 6 + s.offset * 10) * 0.25, s.source.y + u * 2.6, s.source.z - u * 0.6);
      s.mesh.scale.setScalar(0.6 + u * 1.6);
    });
    clouds(t);
  };

  // The city is the protagonist: close up and filling the frame's height. Wide screens frame it on the
  // right, past the headline; narrow ones put it across the top, with the rock running down behind the text.
  const tan = Math.tan(THREE.MathUtils.degToRad(19));
  return run(stage, container, {
    reducedMotion,
    // One still frame, mid-repair, so the story is still told
    still: 5,
    frame,
    layout: (aspect) => {
      if (aspect > 1.1) {
        const distance = 32;
        // Shift the view left so the city sits about two thirds of the way across
        const shift = 0.34 * tan * distance * aspect;
        return { base: new THREE.Vector3(-shift + 1, 6.5, distance), target: new THREE.Vector3(-shift, 1.2, 0) };
      }
      // Fit the main island across the width
      const distance = Math.max(7.6 / (tan * aspect), 26);
      return { base: new THREE.Vector3(0, 4, distance), target: new THREE.Vector3(0, -0.6, 0) };
    },
  });
}

export default function HeroScene() {
  return <SceneMount build={build} />;
}
