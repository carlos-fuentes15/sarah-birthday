// 3D terrace + starry night + cake scene using global THREE and THREE.OrbitControls (r128)

const container = document.getElementById("scene-container");

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- Scene ---
const scene = new THREE.Scene();
// darker, night-ish fog
scene.fog = new THREE.FogExp2(0x050816, 0.03);

// --- Camera ---
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(7, 4.5, 8);

// --- Controls ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
controls.target.set(0, 1.4, 0);

// --- Lights ---

// cool-ish sky, warm ground for cozy night
const hemiLight = new THREE.HemisphereLight(0x90caf9, 0x4e342e, 0.6);
hemiLight.position.set(0, 10, 0);
scene.add(hemiLight);

// main “moon” / soft sun
const dirLight = new THREE.DirectionalLight(0xfff8e1, 0.7);
dirLight.position.set(6, 10, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

// subtle cake glow light (fake bloom)
const cakeGlowLight = new THREE.PointLight(0xfff2b3, 0.55, 7);
cakeGlowLight.position.set(0, 2.5, 0);
scene.add(cakeGlowLight);

// --- Background: night sky & sea ---

// Sky dome (dark night color)
const skyGeo = new THREE.SphereGeometry(60, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
  color: 0x050b1a, // deep navy
  side: THREE.BackSide
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

// Star field (big & bright, ignores fog)
const starGeo = new THREE.BufferGeometry();
const starCount = 1200;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  const radius = 55 + Math.random() * 10;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  starPositions[i * 3] = x;
  starPositions[i * 3 + 1] = y;
  starPositions[i * 3 + 2] = z;
}

starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

const starMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.38,         // bigger
  sizeAttenuation: true,
  transparent: true,
  opacity: 1.0,
  fog: false          // do NOT fade with fog
});

const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Sea plane on the horizon – darker, moonlit
const seaGeo = new THREE.PlaneGeometry(80, 40);
const seaMat = new THREE.MeshPhongMaterial({
  color: 0x0b2948,
  shininess: 40,
  specular: 0x4fc3f7
});
const sea = new THREE.Mesh(seaGeo, seaMat);
sea.rotation.x = -Math.PI / 2;
sea.position.set(-10, -4, -30);
sea.receiveShadow = true;
scene.add(sea);

// --- Smooth terrace ground ---
const groundGeo = new THREE.PlaneGeometry(40, 30);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x7b5e3b, // slightly darker warm terrace
  roughness: 0.95
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// --- Table ---
const tableGroup = new THREE.Group();

// Table top (round)
const tableTopGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.25, 64);
const tableTopMat = new THREE.MeshStandardMaterial({
  color: 0xd7ccc8,
  metalness: 0.1,
  roughness: 0.6
});
const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
tableTop.position.set(0, 1.2, 0);
tableTop.castShadow = true;
tableTop.receiveShadow = true;
tableGroup.add(tableTop);

// Table edge ring
const tableEdgeGeo = new THREE.CylinderGeometry(1.75, 1.8, 0.1, 64);
const tableEdgeMat = new THREE.MeshStandardMaterial({
  color: 0x8d6e63,
  metalness: 0.2,
  roughness: 0.5
});
const tableEdge = new THREE.Mesh(tableEdgeGeo, tableEdgeMat);
tableEdge.position.set(0, 1.1, 0);
tableEdge.castShadow = true;
tableGroup.add(tableEdge);

// Table leg
const tableLegGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.4, 32);
const tableLegMat = new THREE.MeshStandardMaterial({
  color: 0x5d4037,
  metalness: 0.1,
  roughness: 0.8
});
const tableLeg = new THREE.Mesh(tableLegGeo, tableLegMat);
tableLeg.position.set(0, 0.45, 0);
tableLeg.castShadow = true;
tableGroup.add(tableLeg);

// Table base
const tableBaseGeo = new THREE.CylinderGeometry(0.8, 1.1, 0.2, 32);
const tableBaseMat = new THREE.MeshStandardMaterial({
  color: 0x4e342e,
  metalness: 0.1,
  roughness: 0.8
});
const tableBase = new THREE.Mesh(tableBaseGeo, tableBaseMat);
tableBase.position.set(0, 0.1, 0);
tableBase.castShadow = true;
tableBase.receiveShadow = true;
tableGroup.add(tableBase);

scene.add(tableGroup);

// --- Cake ---
const cakeGroup = new THREE.Group();

// Plate
const plateGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.12, 48);
const plateMat2 = new THREE.MeshStandardMaterial({
  color: 0xeceff1,
  metalness: 0.3,
  roughness: 0.4
});
const plate = new THREE.Mesh(plateGeo, plateMat2);
plate.position.set(0, 1.4, 0);
plate.castShadow = true;
plate.receiveShadow = true;
cakeGroup.add(plate);

// Bottom layer
const bottomGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 48);
const bottomMat = new THREE.MeshStandardMaterial({
  color: 0xffe0b2,
  metalness: 0.15,
  roughness: 0.7
});
const bottomLayer = new THREE.Mesh(bottomGeo, bottomMat);
bottomLayer.position.set(0, 1.7, 0);
bottomLayer.castShadow = true;
bottomLayer.receiveShadow = true;
cakeGroup.add(bottomLayer);

// Top layer
const topGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.35, 48);
const topMat = new THREE.MeshStandardMaterial({
  color: 0xffcc80,
  metalness: 0.15,
  roughness: 0.7
});
const topLayer = new THREE.Mesh(topGeo, topMat);
topLayer.position.set(0, 2.0, 0);
topLayer.castShadow = true;
topLayer.receiveShadow = true;
cakeGroup.add(topLayer);

// Icing ring
const icingGeo = new THREE.TorusGeometry(0.75, 0.07, 12, 32);
const icingMat = new THREE.MeshStandardMaterial({
  color: 0xff8a65,
  metalness: 0.1,
  roughness: 0.5
});
const icing = new THREE.Mesh(icingGeo, icingMat);
icing.rotation.x = Math.PI / 2;
icing.position.set(0, 1.9, 0);
icing.castShadow = true;
cakeGroup.add(icing);

// Candles + animated flames
const candleFlames = [];

function addCandle(angleDeg, radius) {
  const angle = (angleDeg * Math.PI) / 180;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12);
  const candleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff
  });
  const candle = new THREE.Mesh(candleGeo, candleMat);
  candle.position.set(x, 2.3, z);
  candle.castShadow = true;
  cakeGroup.add(candle);

  const flameGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xfff176
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(x, 2.6, z);
  flame.userData.baseY = flame.position.y;
  flame.userData.phase = Math.random() * Math.PI * 2;
  candleFlames.push(flame);
  cakeGroup.add(flame);
}

addCandle(-20, 0.25);
addCandle(20, 0.25);
addCandle(0, 0.05);

scene.add(cakeGroup);

// --- Lantern lights ---
const lanternGroup = new THREE.Group();
scene.add(lanternGroup);

const lanternPositions = [
  new THREE.Vector3(-3.5, 3.0, -2.0),
  new THREE.Vector3(-1.5, 3.2, -3.5),
  new THREE.Vector3(1.5, 3.1, -3.5),
  new THREE.Vector3(3.5, 3.0, -2.0)
];

const lanternMeshes = [];

lanternPositions.forEach((pos) => {
  const lanternGeo = new THREE.SphereGeometry(0.16, 12, 12);
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xfff3e0,
    emissive: 0xffc107,
    emissiveIntensity: 1.3,
    roughness: 0.4
  });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.copy(pos);
  lantern.castShadow = true;
  lantern.userData.baseY = pos.y;
  lantern.userData.phase = Math.random() * Math.PI * 2;
  lanternGroup.add(lantern);
  lanternMeshes.push(lantern);

  const light = new THREE.PointLight(0xfff3b0, 0.7, 6);
  light.position.copy(pos);
  lanternGroup.add(light);
});

// --- Floating sparkles around the cake ---
const sparkleGroup = new THREE.Group();
scene.add(sparkleGroup);

const sparkleCount = 80;
const sparkles = [];

for (let i = 0; i < sparkleCount; i++) {
  const sparkleGeo = new THREE.SphereGeometry(0.04, 6, 6);
  const sparkleMat = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const s = new THREE.Mesh(sparkleGeo, sparkleMat);

  const angle = Math.random() * Math.PI * 2;
  const radius = 0.4 + Math.random() * 1.5;
  s.position.set(
    Math.cos(angle) * radius,
    0.7 + Math.random() * 1.8,
    Math.sin(angle) * radius
  );

  s.userData.speed = 0.15 + Math.random() * 0.25;
  s.userData.maxY = 2.8 + Math.random() * 0.7;
  s.userData.minY = s.position.y;
  s.userData.offset = Math.random() * Math.PI * 2;

  sparkles.push(s);
  sparkleGroup.add(s);
}

// --- Resize handling ---
function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
window.addEventListener("resize", onWindowResize);

// --- Animation loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  controls.update();

  // Animate candle flames (flicker and slight bob)
  candleFlames.forEach((flame) => {
    const phase = flame.userData.phase;
    const flicker = 0.9 + Math.sin(t * 12 + phase) * 0.15;
    flame.scale.set(1, flicker, 1);
    flame.position.y = flame.userData.baseY + Math.sin(t * 6 + phase) * 0.03;
  });

  // Animate lanterns gently bobbing
  lanternMeshes.forEach((lantern) => {
    const baseY = lantern.userData.baseY;
    const phase = lantern.userData.phase;
    lantern.position.y = baseY + Math.sin(t * 1.2 + phase) * 0.08;
  });

  // Animate sparkles rising & looping
  sparkles.forEach((s) => {
    s.position.y += s.userData.speed * 0.016;
    s.position.x += Math.sin(t * 1.5 + s.userData.offset) * 0.0008;
    s.position.z += Math.cos(t * 1.3 + s.userData.offset) * 0.0008;

    if (s.position.y > s.userData.maxY) {
      s.position.y = s.userData.minY;
    }
  });

  // very slow rotation of stars for subtle motion
  stars.rotation.y = t * 0.01;

  renderer.render(scene, camera);
}
animate();

// --- Confetti overlay ---
(function createConfetti() {
  const colors = [
    "#ff5252",
    "#ffeb3b",
    "#69f0ae",
    "#40c4ff",
    "#ff80ab",
    "#ffb74d"
  ];
  const pieces = 120;

  for (let i = 0; i < pieces; i++) {
    const confetto = document.createElement("div");
    confetto.classList.add("confetti-piece");

    const size = Math.random() * 7 + 6; // 6–13px height
    confetto.style.width = size * 0.6 + "px";
    confetto.style.height = size + "px";

    confetto.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetto.style.left = Math.random() * 100 + "vw";
    confetto.style.animationDuration = 5 + Math.random() * 4 + "s";
    confetto.style.animationDelay = Math.random() * 5 + "s";
    confetto.style.opacity = 0.6 + Math.random() * 0.4;
    confetto.style.transform = "rotateZ(" + Math.random() * 360 + "deg)";

    document.body.appendChild(confetto);
  }
})();
