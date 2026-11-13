"use client";

import * as THREE from "three";
import SceneMount from "./scene/SceneMount";
import { COLORS, clamp01, createStage, ease, makeAirship, makeAutomaton, makeBurst, makeLabel, run, seaOfClouds } from "./scene/kit";

/*
 * Vibe coding, governed. On the left, a workshop island fenced in brass: anyone can build there, on a
 * glowing blueprint (an approved template). An automaton (an AI agent) builds the app floor by floor. An
 * airship lifts it and carries it toward the city, through three brass gates: tests, security (scans and
 * policies) and a human approval that holds it until the lamp turns green. Then it lands in the city, on your cloud,
 * and its windows light up. Fifteen seconds, then the next idea.
 */

const CYCLE = 15;
const WORKSHOP = new THREE.Vector3(-12.5, 0, 0);
const CITY = new THREE.Vector3(12.5, -0.5, 0);
const SLOT = new THREE.Vector3(CITY.x - 0.6, CITY.y + 0.5, 0.6);
const GATES = [-5.5, 0, 5.5];
const CRUISE = 7.2;
const HANG = 4.85; // from the airship's centre down to the base of the building it carries
const REST = new THREE.Vector3(0, 12, -8);
const FLOORS = 4;
const floorAt = (i: number) => 0.8 + i * 0.75;
const ROOF_AT = floorAt(FLOORS);

function blueprintTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0c2c45";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgba(95, 194, 170, 0.45)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 256; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
    ctx.strokeStyle = "#8fe0cc";
    ctx.lineWidth = 4;
    ctx.strokeRect(64, 64, 128, 128);
    ctx.strokeRect(12, 12, 232, 232);
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(64, 128);
    ctx.lineTo(192, 128);
    ctx.moveTo(128, 64);
    ctx.lineTo(128, 192);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function build(container: HTMLDivElement, reducedMotion: boolean) {
  const stage = createStage(container);
  const { scene, m, box, island, windowsOn, track, basic, mat } = stage;
  const clouds = seaOfClouds(stage);

  const world = new THREE.Group();
  scene.add(world);

  // ---------- the workshop: anyone builds here, inside the brass fence ----------
  const workshop = island(3.8, 6);
  workshop.position.copy(WORKSHOP);
  world.add(workshop);
  const workshopGlow = new THREE.PointLight(0x8fe0cc, 10, 12, 1.6);
  workshopGlow.position.set(WORKSHOP.x, 3, WORKSHOP.z + 2);
  world.add(workshopGlow);

  const blueprintMat = track(new THREE.MeshBasicMaterial({ map: track(blueprintTexture()), transparent: true, opacity: 0.9 }));
  const blueprint = new THREE.Mesh(track(new THREE.PlaneGeometry(2.8, 2.8)), blueprintMat);
  blueprint.rotation.x = -Math.PI / 2;
  blueprint.position.set(WORKSHOP.x, 0.52, WORKSHOP.z);
  world.add(blueprint);

  // The fence: the guardrails the platform team draws
  const fenceRail = new THREE.Mesh(track(new THREE.TorusGeometry(3.45, 0.06, 6, 40)), m.brass);
  fenceRail.rotation.x = Math.PI / 2;
  fenceRail.position.set(WORKSHOP.x, 1.25, WORKSHOP.z);
  world.add(fenceRail);
  const fencePost = track(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 6));
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const post = new THREE.Mesh(fencePost, m.brass);
    post.position.set(WORKSHOP.x + Math.cos(a) * 3.45, 0.9, WORKSHOP.z + Math.sin(a) * 3.45);
    world.add(post);
  }

  // The automaton's mast at the back of the workshop
  const mast = new THREE.Mesh(track(new THREE.CylinderGeometry(0.08, 0.12, 3.4, 6)), m.copper);
  mast.position.set(WORKSHOP.x - 2.2, 2.2, WORKSHOP.z - 1.6);
  world.add(mast);
  const MAST_TOP = new THREE.Vector3(WORKSHOP.x - 2.2, 4.3, WORKSHOP.z - 1.6);
  const automaton = makeAutomaton(stage);
  world.add(automaton.group);
  const sparks = makeBurst(stage, world, 30, COLORS.brassLight, 0.13);

  // ---------- the app being built: four floors and a roof ----------
  const app = new THREE.Group();
  world.add(app);
  const appWindowMat = basic(0x6b5a35);
  const floorMats = [m.wall, mat({ color: 0x6b5340 }), m.wall, mat({ color: 0x6b5340 })];
  const floors = floorMats.map((material, i) => {
    const floor = box(1.5, 0.6, 1.5, material);
    floor.position.y = 0.3 + i * 0.6;
    windowsOn(floor, 1.5, 0.6, 1.5, 1, 3, appWindowMat);
    app.add(floor);
    return floor;
  });
  const roof = new THREE.Group();
  const dome = new THREE.Mesh(track(new THREE.SphereGeometry(0.75, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), m.brass);
  const spire = new THREE.Mesh(track(new THREE.ConeGeometry(0.08, 0.7, 6)), m.copper);
  spire.position.y = 0.95;
  roof.add(dome, spire);
  roof.position.y = FLOORS * 0.6;
  app.add(roof);
  const appLamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.12, 8, 6)), basic(COLORS.green));
  appLamp.position.set(0, FLOORS * 0.6 + 1.35, 0);
  app.add(appLamp);

  // ---------- the gates: the checks every change passes ----------
  const gateLabels = ["Tests", "Security", "Approval"];
  const gates = GATES.map((x, i) => {
    const material = mat({ color: COLORS.brass, metalness: 0.75, roughness: 0.35, emissive: COLORS.green, emissiveIntensity: 0 });
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(3.3, 0.18, 8, 40)), material);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(x, CRUISE - 2, 0);
    const lampMat = basic(COLORS.off);
    const lamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.28, 10, 8)), lampMat);
    lamp.position.set(x, CRUISE + 1.55, 0);
    const label = makeLabel(stage, gateLabels[i], 0.85);
    label.sprite.position.set(x, CRUISE + 2.45, 0);
    world.add(ring, lamp, label.sprite);
    return { material, lampMat };
  });

  // ---------- the city: your cloud ----------
  const city = island(5.2, 8);
  city.position.copy(CITY);
  world.add(city);
  const cityGlow = new THREE.PointLight(COLORS.window, 14, 20, 1.6);
  cityGlow.position.set(CITY.x, 4, 3);
  world.add(cityGlow);
  const tower = box(1.3, 4.6, 1.3, m.wall);
  tower.position.set(CITY.x + 1.6, CITY.y + 2.8, -1.6);
  windowsOn(tower, 1.3, 4.6, 1.3, 3, 2);
  const towerRoof = new THREE.Mesh(track(new THREE.ConeGeometry(1.05, 1.5, 4)), m.brass);
  towerRoof.position.set(CITY.x + 1.6, CITY.y + 5.85, -1.6);
  towerRoof.rotation.y = Math.PI / 4;
  const clock = new THREE.Mesh(track(new THREE.CircleGeometry(0.45, 24)), m.clock);
  clock.position.set(CITY.x + 1.6, CITY.y + 4.3, -0.94);
  const boiler = box(1.9, 1.5, 1.4, m.wall);
  boiler.position.set(CITY.x + 2.6, CITY.y + 1.25, 1.4);
  windowsOn(boiler, 1.9, 1.5, 1.4, 1, 3);
  const vaultBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.95, 0.95, 0.5, 12)), m.wall);
  vaultBase.position.set(CITY.x - 2.4, CITY.y + 0.75, -1.8);
  const vaultDome = new THREE.Mesh(track(new THREE.SphereGeometry(0.9, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)), m.brass);
  vaultDome.position.set(CITY.x - 2.4, CITY.y + 1, -1.8);
  world.add(tower, towerRoof, clock, boiler, vaultBase, vaultDome);

  const workshopLabel = makeLabel(stage, "Anyone builds", 0.85);
  workshopLabel.sprite.position.set(WORKSHOP.x, -1.4, WORKSHOP.z + 3.6);
  const cityLabel = makeLabel(stage, "Your cloud", 0.85);
  cityLabel.sprite.position.set(CITY.x + 3.6, CITY.y + 4.4, CITY.z + 1.2);
  world.add(workshopLabel.sprite, cityLabel.sprite);

  // ---------- the airship and its cables ----------
  const airship = makeAirship(stage);
  world.add(airship.group);
  const cableGeo = track(new THREE.CylinderGeometry(0.025, 0.025, 1, 4));
  const cables = [-0.45, 0.45].map((dx) => {
    const cable = new THREE.Mesh(cableGeo, m.copper);
    cable.userData.dx = dx;
    world.add(cable);
    return cable;
  });
  const landed = makeBurst(stage, world, 40, COLORS.green, 0.16);

  const ship = new THREE.Vector3();
  const lerp = (a: THREE.Vector3, b: THREE.Vector3, u: number) => ship.lerpVectors(a, b, ease(u));
  const ABOVE_WORKSHOP = new THREE.Vector3(WORKSHOP.x, 10, WORKSHOP.z);
  const GRAB = new THREE.Vector3(WORKSHOP.x, 0.5 + HANG, WORKSHOP.z);
  const LIFTED = new THREE.Vector3(WORKSHOP.x, CRUISE, WORKSHOP.z);
  const WAIT = new THREE.Vector3(GATES[2] - 3.2, CRUISE, 0);
  const OVER_CITY = new THREE.Vector3(SLOT.x, CRUISE, SLOT.z);
  const LAND = new THREE.Vector3(SLOT.x, SLOT.y + HANG, SLOT.z);

  const frame = (t: number) => {
    const p = t % CYCLE;

    // Build: the blueprint glows, floors drop in one by one, the automaton welds them
    blueprintMat.opacity = 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3));
    floors.forEach((floor, i) => {
      const u = clamp01((p - floorAt(i)) / 0.35);
      floor.visible = u > 0;
      floor.position.y = 0.3 + i * 0.6 + (1 - ease(u)) * 1.4;
    });
    const roofU = clamp01((p - ROOF_AT) / 0.35);
    roof.visible = roofU > 0;
    roof.position.y = FLOORS * 0.6 + (1 - ease(roofU)) * 1.4;
    appLamp.visible = p >= 12.9;

    const building = p >= floorAt(0) && p < ROOF_AT + 0.5;
    if (building) {
      const level = Math.min(FLOORS, Math.floor((p - floorAt(0)) / 0.75) + 1);
      const a = t * 2.4;
      automaton.group.position.set(WORKSHOP.x + Math.cos(a) * 1.4, 0.5 + level * 0.6 + 0.9, WORKSHOP.z + Math.sin(a) * 1.4);
      const weld = new THREE.Vector3(WORKSHOP.x, 0.5 + level * 0.6, WORKSHOP.z + 0.8);
      sparks(weld, ((p - floorAt(0)) % 0.75) * 1.4, 1);
    } else {
      const back = clamp01((p - ROOF_AT - 0.5) / 0.8);
      const from = new THREE.Vector3(WORKSHOP.x, 0.5 + FLOORS * 0.6 + 0.9, WORKSHOP.z);
      automaton.group.position.copy(p < floorAt(0) ? MAST_TOP : from.lerp(MAST_TOP, ease(back)));
      automaton.group.position.y += Math.sin(t * 2) * 0.08;
      sparks(automaton.group.position, -1);
    }
    automaton.ring.rotation.z = t * 6;
    automaton.group.lookAt(stage.camera.position);

    // The airship: from rest to the workshop, grab, through the gates, wait for approval, land, leave
    let carrying = false;
    if (p < 3.4) ship.copy(REST);
    else if (p < 5) lerp(REST, ABOVE_WORKSHOP, (p - 3.4) / 1.6);
    else if (p < 5.8) lerp(ABOVE_WORKSHOP, GRAB, (p - 5) / 0.8);
    else if (p < 6.6) {
      lerp(GRAB, LIFTED, (p - 5.8) / 0.8);
      carrying = true;
    } else if (p < 9.4) {
      lerp(LIFTED, WAIT, (p - 6.6) / 2.8);
      carrying = true;
    } else if (p < 10.8) {
      ship.copy(WAIT);
      ship.y += Math.sin(t * 3) * 0.06;
      carrying = true;
    } else if (p < 12.1) {
      lerp(WAIT, OVER_CITY, (p - 10.8) / 1.3);
      carrying = true;
    } else if (p < 12.9) {
      lerp(OVER_CITY, LAND, (p - 12.1) / 0.8);
      carrying = true;
    } else if (p < 14.4) lerp(LAND, REST, (p - 12.9) / 1.5);
    else ship.copy(REST);
    airship.group.position.copy(ship);
    airship.group.rotation.y = p > 12.9 || p < 5 ? 0.35 : 0;
    airship.propeller.rotation.x = t * 18;

    // Where the app is: on the blueprint, under the airship, or in the city
    if (carrying) app.position.set(ship.x, ship.y - HANG, ship.z);
    else if (p >= 12.9) app.position.copy(SLOT);
    else app.position.set(WORKSHOP.x, 0.5, WORKSHOP.z);
    const fade = ease((p - 14.5) / 0.5);
    app.scale.setScalar(Math.max(0.001, 1 - fade));
    appWindowMat.color.setHex(p >= 12.9 ? COLORS.window : 0x6b5a35);

    cables.forEach((cable) => {
      cable.visible = carrying;
      const top = ship.y - 1.2;
      const bottom = ship.y - HANG + FLOORS * 0.6 + 0.4;
      cable.scale.y = Math.max(0.01, top - bottom);
      cable.position.set(ship.x + cable.userData.dx, (top + bottom) / 2, ship.z);
    });

    // Gates: brass until the app passes, then green. The last one waits for a person.
    gates.forEach((gate, i) => {
      const passedAt = i < 2 ? 6.6 + ((GATES[i] - LIFTED.x) / (WAIT.x - LIFTED.x)) * 2.8 : 10.4;
      const passed = p >= passedAt && p < 14.6;
      const waiting = i === 2 && p >= 9.4 && p < 10.4;
      gate.material.emissiveIntensity = passed ? 0.9 : 0;
      gate.material.color.setHex(passed ? COLORS.verdigris : COLORS.brass);
      gate.lampMat.color.setHex(passed ? COLORS.green : waiting ? (Math.sin(t * 10) > 0 ? COLORS.amber : COLORS.off) : COLORS.off);
    });

    landed(new THREE.Vector3(SLOT.x, SLOT.y + 2.6, SLOT.z), p - 12.9, 1.3);

    // Three quarters on, so the gates read as rings and the city comes toward you
    world.position.y = Math.sin(t * 0.6) * 0.25;
    world.rotation.y = -0.45 + Math.sin(t * 0.12) * 0.04;
    clouds(t);
  };

  return run(stage, container, {
    reducedMotion,
    still: 10,
    frame,
    layout: (aspect) => {
      // Fit the whole flow, workshop to city, across the width and from the island labels to the gate labels
      const tan = Math.tan(THREE.MathUtils.degToRad(19));
      const distance = Math.max(16 / (tan * aspect), 18 / (2 * tan), 24);
      return {
        base: new THREE.Vector3(0, 4.2 + distance * 0.16, distance),
        target: new THREE.Vector3(1.2, 3.6, 0),
        fog: 0.012 * Math.min(1, 30 / distance),
      };
    },
  });
}

export default function WorkshopScene() {
  return <SceneMount build={build} fallbackClassName="absolute inset-0 flex justify-center opacity-70" />;
}
