"use client";

import { useRef } from "react";
import * as THREE from "three";
import SceneMount from "./scene/SceneMount";
import { COLORS, clamp01, createStage, ease, makeAirship, makeBurst, run, seaOfClouds } from "./scene/kit";

/*
 * Why a game: the city grows with the streak. A clocktower stands alone on its island. Every day the cloud
 * stays up a lamp on the rim turns green and a new building rises in a puff of steam: boiler house,
 * factory, vault, houses, telegraph, observatory, and on the seventh day an airship dock. An airship
 * lands, fireworks go up, the airship sails off with the next release. Twelve seconds, then a new week.
 */

const CYCLE = 12;
const DAYS = 7;
const dayAt = (i: number) => 0.8 + i * 1.05;
const RISE = 0.7;

function build(container: HTMLDivElement, reducedMotion: boolean, counter: HTMLElement | null) {
  const stage = createStage(container);
  const { scene, m, box, island, windowsOn, track, basic, mat } = stage;
  const clouds = seaOfClouds(stage);

  const city = new THREE.Group();
  scene.add(city);
  const glow = new THREE.PointLight(COLORS.window, 16, 30, 1.6);
  glow.position.set(0, 4, 3);
  city.add(glow);
  city.add(island(6.6, 9));

  // The clocktower: the control plane, there from day zero
  const tower = box(1.4, 5, 1.4, m.wall);
  tower.position.set(0, 3, -1.2);
  windowsOn(tower, 1.4, 5, 1.4, 3, 2);
  const roof = new THREE.Mesh(track(new THREE.ConeGeometry(1.15, 1.6, 4)), m.brass);
  roof.position.set(0, 6.3, -1.2);
  roof.rotation.y = Math.PI / 4;
  const clock = new THREE.Mesh(track(new THREE.CircleGeometry(0.5, 24)), m.clock);
  clock.position.set(0, 4.7, -0.49);
  const hand = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, 0.4, 0.02).translate(0, 0.2, 0)), m.dark);
  hand.position.set(0, 4.7, -0.47);
  city.add(tower, roof, clock, hand);

  // ---------- one building per day ----------
  const boilerHouse = () => {
    const g = new THREE.Group();
    const house = box(2, 1.6, 1.6, m.wall);
    house.position.y = 0.8;
    windowsOn(house, 2, 1.6, 1.6, 1, 3);
    const tank = new THREE.Mesh(track(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 12)), m.brass);
    tank.rotation.z = Math.PI / 2;
    tank.position.y = 1.95;
    g.add(house, tank);
    for (const dx of [-0.55, 0.5]) {
      const chimney = new THREE.Mesh(track(new THREE.CylinderGeometry(0.15, 0.19, 1.5, 8)), m.copper);
      chimney.position.set(dx, 2.4, -0.4);
      g.add(chimney);
    }
    return g;
  };
  const factory = () => {
    const g = new THREE.Group();
    const hall = box(2.4, 1.3, 1.5, m.wall);
    hall.position.y = 0.65;
    windowsOn(hall, 2.4, 1.3, 1.5, 1, 4);
    g.add(hall);
    for (let i = 0; i < 3; i++) {
      const tooth = new THREE.Mesh(track(new THREE.CylinderGeometry(0, 0.45, 0.75, 3)), m.copper);
      tooth.rotation.z = Math.PI / 2;
      tooth.position.set(-0.8 + i * 0.8, 1.6, 0);
      g.add(tooth);
    }
    return g;
  };
  const vault = () => {
    const g = new THREE.Group();
    const base = new THREE.Mesh(track(new THREE.CylinderGeometry(1.1, 1.1, 0.6, 12)), m.wall);
    base.position.y = 0.3;
    const dome = new THREE.Mesh(track(new THREE.SphereGeometry(1.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), m.brass);
    dome.position.y = 0.6;
    g.add(base, dome);
    return g;
  };
  const houses = () => {
    const g = new THREE.Group();
    [-0.9, 0, 0.9].forEach((x, i) => {
      const h = 0.9 + (i % 2) * 0.35;
      const body = box(0.8, h, 0.8, m.wall);
      body.position.set(x, h / 2, 0);
      windowsOn(body, 0.8, h, 0.8, 1, 1);
      const top = new THREE.Mesh(track(new THREE.ConeGeometry(0.66, 0.6, 4)), i === 1 ? m.brass : m.copper);
      top.position.set(x, h + 0.3, 0);
      top.rotation.y = Math.PI / 4;
      g.add(body, top);
    });
    return g;
  };
  const telegraph = () => {
    const g = new THREE.Group();
    const hut = box(1, 0.8, 0.8, m.wall);
    hut.position.y = 0.4;
    windowsOn(hut, 1, 0.8, 0.8, 1, 1);
    const mast = new THREE.Mesh(track(new THREE.CylinderGeometry(0.07, 0.1, 3.2, 6)), m.brass);
    mast.position.set(0.2, 1.6, -0.2);
    const bar = box(1.3, 0.08, 0.08, m.brass);
    bar.position.set(0.2, 2.9, -0.2);
    const bar2 = box(0.9, 0.08, 0.08, m.brass);
    bar2.position.set(0.2, 2.5, -0.2);
    g.add(hut, mast, bar, bar2);
    return g;
  };
  const observatory = () => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(track(new THREE.CylinderGeometry(0.75, 0.85, 1.1, 10)), m.wall);
    body.position.y = 0.55;
    const dome = new THREE.Mesh(track(new THREE.SphereGeometry(0.8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), m.brass);
    dome.position.y = 1.1;
    const scope = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.16, 1.3, 8)), m.cream);
    scope.position.set(0.35, 1.7, 0);
    scope.rotation.z = -0.8;
    g.add(body, dome, scope);
    return g;
  };
  const dock = () => {
    const g = new THREE.Group();
    for (const [x, z] of [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0, 0.5],
    ]) {
      const leg = new THREE.Mesh(track(new THREE.CylinderGeometry(0.08, 0.12, 2.6, 6)), m.copper);
      leg.position.set(x, 1.3, z);
      g.add(leg);
    }
    const deck = new THREE.Mesh(track(new THREE.CylinderGeometry(1, 1, 0.18, 12)), m.brass);
    deck.position.y = 2.65;
    g.add(deck);
    return g;
  };

  const plots: { group: THREE.Group; at: THREE.Vector3 }[] = [];
  const place = (group: THREE.Group, x: number, z: number, rotY = 0) => {
    group.position.set(x, 0.5, z);
    group.rotation.y = rotY;
    city.add(group);
    plots.push({ group, at: new THREE.Vector3(x, 1.2, z) });
  };
  place(boilerHouse(), -3.3, 1.4, 0.15);
  place(factory(), -2.7, -2.9, 0.1);
  place(vault(), 2.9, -2.6);
  place(houses(), -0.2, 2.5);
  place(telegraph(), 4.1, 0.9, -0.3);
  place(observatory(), -5, -0.4);
  const dockPlot = dock();
  place(dockPlot, 2.6, 3.4);
  const DOCK_TOP = new THREE.Vector3(2.6, 3.3, 3.4);

  // Steam puffs as each building rises
  const puffGeo = track(new THREE.SphereGeometry(0.3, 6, 4));
  const puffs = plots.map(({ at }) => {
    const material = track(new THREE.MeshStandardMaterial({ color: 0xd9d2c3, transparent: true, opacity: 0, flatShading: true }));
    const meshes = Array.from({ length: 8 }, (_, i) => {
      const mesh = new THREE.Mesh(puffGeo, material);
      const a = (i / 8) * Math.PI * 2;
      city.add(mesh);
      return { mesh, dir: new THREE.Vector3(Math.cos(a), 0.25, Math.sin(a)) };
    });
    return { material, meshes, at };
  });

  // The streak: seven lamps on the island's rim, one per day
  const lampGeo = track(new THREE.SphereGeometry(0.2, 10, 8));
  const postGeo = track(new THREE.CylinderGeometry(0.06, 0.09, 1.1, 6));
  const lamps = Array.from({ length: DAYS }, (_, i) => {
    const a = -0.85 + (i / (DAYS - 1)) * 1.7;
    const x = Math.sin(a) * 6;
    const z = Math.cos(a) * 6;
    const post = new THREE.Mesh(postGeo, m.brass);
    post.position.set(x, 1.05, z);
    const material = basic(COLORS.off);
    const lamp = new THREE.Mesh(lampGeo, material);
    lamp.position.set(x, 1.75, z);
    city.add(post, lamp);
    return material;
  });

  // The big gear on the island's face turns faster as the streak grows
  const gear = new THREE.Group();
  gear.add(new THREE.Mesh(track(new THREE.TorusGeometry(1.3, 0.3, 8, 24)), m.brass));
  const toothGeo = track(new THREE.BoxGeometry(0.4, 0.5, 0.42));
  for (let i = 0; i < 12; i++) {
    const tooth = new THREE.Mesh(toothGeo, m.brass);
    const a = (i / 12) * Math.PI * 2;
    tooth.position.set(Math.cos(a) * 1.72, Math.sin(a) * 1.72, 0);
    tooth.rotation.z = a;
    gear.add(tooth);
  }
  gear.add(new THREE.Mesh(track(new THREE.CylinderGeometry(0.42, 0.42, 0.5, 12)).rotateX(Math.PI / 2), m.copper));
  gear.position.set(-1.4, -2.3, 5.2);
  city.add(gear);

  // The airship lands on the new dock, then sails off with the next release
  const airship = makeAirship(stage);
  city.add(airship.group);

  // Fireworks for a full week
  const bursts = [
    { at: new THREE.Vector3(-3, 9.5, -1), start: 8.7, update: makeBurst(stage, city, 46, COLORS.brassLight, 0.2) },
    { at: new THREE.Vector3(1.5, 11, -2), start: 9.1, update: makeBurst(stage, city, 46, COLORS.green, 0.2) },
    { at: new THREE.Vector3(4.5, 9, 0), start: 9.5, update: makeBurst(stage, city, 46, COLORS.cream, 0.18) },
  ];

  // Warm windows brighten as the city grows
  const engineMat = mat({ color: COLORS.brass, emissive: COLORS.copper, emissiveIntensity: 0.3, metalness: 0.7, roughness: 0.35 });
  const engine = new THREE.Mesh(track(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 10)), engineMat);
  engine.rotation.z = Math.PI / 2;
  engine.position.set(0, 1.1, -0.3);
  city.add(engine);

  let wide = true;
  let gearAngle = 0;
  let lastT = 0;
  let shown = -1;

  const frame = (t: number) => {
    const p = t % CYCLE;
    const week = Math.floor(t / CYCLE);
    const reset = ease((p - 11.2) / 0.7);
    let day = 0;

    plots.forEach(({ group }, i) => {
      const u = clamp01((p - dayAt(i)) / RISE);
      if (u > 0) day = i + 1;
      // A little overshoot as it settles, then everything sinks back for the new week
      const grow = u < 1 ? ease(u) * (1 + Math.sin(u * Math.PI) * 0.12) : 1;
      const s = grow * (1 - reset);
      group.visible = s > 0.02;
      group.scale.set(1, Math.max(s, 0.001), 1);

      const age = p - dayAt(i);
      const puff = puffs[i];
      puff.material.opacity = age > 0 && age < 1.2 ? 0.6 * (1 - age / 1.2) : 0;
      if (puff.material.opacity > 0) {
        puff.meshes.forEach(({ mesh, dir }) => {
          mesh.position.copy(puff.at).addScaledVector(dir, 0.6 + age * 1.6);
          mesh.scale.setScalar(0.6 + age * 1.4);
        });
      }
    });
    if (p >= 11.2) day = DAYS;

    lamps.forEach((material, i) => {
      const lit = p >= dayAt(i) && p < 11.2;
      const justLit = p - dayAt(i) < 0.35;
      material.color.setHex(lit ? (justLit ? COLORS.cream : COLORS.green) : COLORS.off);
    });

    const total = week * DAYS + day;
    if (counter && total !== shown) {
      shown = total;
      counter.textContent = `${total} ${total === 1 ? "day" : "days"} up`;
    }

    // The airship: arrives over the dock once it is built, then leaves with the fireworks
    const dockReady = dayAt(DAYS - 1) + RISE;
    const parked = DOCK_TOP.clone().add(new THREE.Vector3(0, 2.3, 0));
    if (p < dockReady) {
      airship.group.visible = false;
    } else if (p < dockReady + 1) {
      const u = ease(p - dockReady);
      airship.group.visible = true;
      airship.group.position.set(parked.x - (1 - u) * 10, parked.y + (1 - u) * 5, parked.z - (1 - u) * 6);
      airship.group.rotation.y = 0.5;
    } else if (p < 9.6) {
      airship.group.position.set(parked.x, parked.y + Math.sin(t * 2) * 0.08, parked.z);
    } else {
      const u = ease((p - 9.6) / 2);
      airship.group.position.set(parked.x + u * 14, parked.y + u * 7, parked.z - u * 12);
      airship.group.visible = u < 0.98;
    }
    airship.propeller.rotation.x = t * 18;

    bursts.forEach((b) => b.update(b.at, p - b.start));

    // Everything turns faster as the streak grows
    const dt = Math.min(0.1, Math.max(0, t - lastT));
    lastT = t;
    gearAngle += dt * (0.25 + day * 0.18);
    gear.rotation.z = gearAngle;
    hand.rotation.z = -t * 0.8;
    engineMat.emissiveIntensity = 0.25 + day * 0.08;
    glow.intensity = 12 + day * 1.4;

    city.position.y = (wide ? 0 : 2.5) + Math.sin(t * 0.6) * 0.3;
    city.rotation.y = -0.18 + Math.sin(t * 0.15) * 0.07;
    clouds(t);
  };

  return run(stage, container, {
    reducedMotion,
    still: 9.4,
    frame,
    layout: (aspect) => {
      wide = aspect > 1.1;
      city.position.x = wide ? 12 : 0;
      return wide
        ? { base: new THREE.Vector3(2, 8, 40), target: new THREE.Vector3(7.5, 3, 0) }
        : // Narrow screens: the city sits above the headline, the rock behind the text
          { base: new THREE.Vector3(0, 6, 62), target: new THREE.Vector3(0, -8, 0), fog: 0.008 };
    },
  });
}

export default function StreakScene() {
  const counter = useRef<HTMLParagraphElement>(null);
  return (
    <>
      <SceneMount build={(container, reducedMotion) => build(container, reducedMotion, counter.current)} />
      {/* The streak plaque follows the scene; it is decoration, the story is told in the page text */}
      <p
        ref={counter}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-4 z-10 rounded-md brass-border bg-sky-deep/70 px-3 py-1.5 font-display text-sm text-cream tabular-nums empty:hidden md:bottom-auto md:right-8 md:top-24"
      />
    </>
  );
}
