import React, { useEffect, useRef, useState } from "react";

const chapters = [
  { tag: "01 / SHIPMENT", title: "It starts with a parcel.", body: "One shipment becomes the beginning of a connected story." },
  { tag: "02 / NETWORK", title: "Every route tells a story.", body: "Follow movement, milestones and delivery signals across your network." },
  { tag: "03 / INTELLIGENCE", title: "Signals become insight.", body: "Bring analytics, tracking and exceptions into one clear view." },
  { tag: "04 / CONTROL", title: "Your shipping picture. In focus.", body: "A connected ParcelX IQ experience for the work that moves your business." }
];

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const ease = (a, b, n) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function makeCardTexture(THREE, eyebrow, title, metric, accent) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(14,20,30,.96)";
  ctx.beginPath();
  ctx.roundRect(8, 8, 624, 324, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.17)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(42, 48, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "700 22px Arial, sans-serif";
  ctx.fillStyle = "rgba(230,235,244,.72)";
  ctx.fillText(eyebrow, 64, 55);
  ctx.font = "700 34px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 34, 118);
  ctx.font = "800 76px Arial, sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText(metric, 34, 226);
  ctx.font = "600 20px Arial, sans-serif";
  ctx.fillStyle = "rgba(211,220,232,.58)";
  ctx.fillText("ILLUSTRATIVE IQ VIEW", 36, 284);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeParcelLabel(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff5ec";
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 304, 18);
  ctx.fill();
  ctx.fillStyle = "#1b2533";
  ctx.font = "800 42px Arial, sans-serif";
  ctx.fillText("PARCELX", 34, 88);
  ctx.fillStyle = "#ff6600";
  ctx.font = "800 30px Arial, sans-serif";
  ctx.fillText("IQ", 36, 130);
  ctx.strokeStyle = "rgba(27,37,51,.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(34, 162);
  ctx.lineTo(476, 162);
  ctx.stroke();
  ctx.fillStyle = "#536174";
  ctx.font = "600 20px Arial, sans-serif";
  ctx.fillText("SHIPPING INTELLIGENCE", 34, 204);
  ctx.fillStyle = "#1b2533";
  ctx.font = "700 22px monospace";
  ctx.fillText("PX  08  24  06", 34, 260);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function IQScrollScene() {
  const storyRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const [webglReady, setWebglReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let disposed = false;
    let raf = 0;
    let renderer = null;
    let scene = null;
    let camera = null;
    let parcelGroup = null;
    let orbitGroup = null;
    let routeItems = [];
    let cards = [];
    let dust = null;
    let resizeObserver = null;
    let cleanupListeners = null;
    let lastStep = -1;
    let pointerX = 0;
    let pointerY = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drawAtScroll = () => {
      if (disposed || !renderer || !storyRef.current || !pinRef.current) return;
      const story = storyRef.current;
      const pinElement = pinRef.current;
      const distance = Math.max(1, story.offsetHeight - pinElement.offsetHeight);
      const rect = story.getBoundingClientRect();
      const progress = reduceMotion ? 1 : clamp(-rect.top / distance);
      const step = progress < .2 ? 0 : progress < .5 ? 1 : progress < .79 ? 2 : 3;
      if (step !== lastStep) {
        lastStep = step;
        setActiveStep(step);
      }

      const parcelIn = ease(.015, .2, progress);
      const routesIn = ease(.17, .56, progress);
      const insightIn = ease(.48, .84, progress);
      const finalOut = ease(.79, 1, progress);

      parcelGroup.position.set(-.34 * finalOut, -.95 + parcelIn * 1.02, 0);
      parcelGroup.scale.setScalar(.76 + parcelIn * .25 - finalOut * .12);
      parcelGroup.rotation.set(.13 + progress * .08, -.72 + progress * 1.38, .05 + Math.sin(progress * Math.PI * 2) * .035);

      orbitGroup.rotation.set(.84 + progress * .14, .15 + progress * .18, -.2 + progress * .8);
      orbitGroup.children.forEach((ring, i) => {
        ring.material.opacity = .06 + routesIn * (i === 0 ? .22 : .13);
        ring.scale.setScalar(.84 + parcelIn * .16 + finalOut * .07);
      });

      routeItems.forEach((item, i) => {
        item.line.material.opacity = .76 * routesIn;
        item.line.geometry.setDrawRange(0, Math.floor(item.vertexCount * routesIn));
        item.node.material.opacity = routesIn;
        item.node.scale.setScalar(.5 + routesIn * .5);
        const point = clamp(progress * 1.38 + i * .17);
        item.dot.position.copy(item.curve.getPoint(point));
        item.dot.material.opacity = routesIn * (progress > .2 ? .96 : 0);
      });

      cards.forEach((item, i) => {
        item.sprite.material.opacity = insightIn;
        item.sprite.position.x = item.startX + (item.endX - item.startX) * insightIn;
        item.sprite.position.y = item.startY + (item.endY - item.startY) * insightIn;
        item.sprite.scale.set(item.width * (.78 + insightIn * .22), item.height * (.78 + insightIn * .22), 1);
        item.sprite.material.rotation = (i - 1) * .025 * (1 - insightIn);
      });

      if (dust) dust.rotation.z = progress * .11;
      camera.position.x = pointerX * .12 - .05 * finalOut;
      camera.position.y = pointerY * .1;
      camera.position.z = (window.innerWidth < 600 ? 12.5 : 9.7) + finalOut * .8;
      camera.lookAt(0, 0, 0);
      pinElement.style.setProperty("--pxq-story-progress", progress.toFixed(4));
      renderer.render(scene, camera);
    };

    const requestDraw = () => {
      if (raf || disposed) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        drawAtScroll();
      });
    };

    const onPointerMove = (event) => {
      if (event.pointerType !== "mouse" || !pinRef.current) return;
      const rect = pinRef.current.getBoundingClientRect();
      pointerX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      pointerY = clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1);
      requestDraw();
    };

    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      requestDraw();
    };

    const init = async () => {
      try {
        const THREE = await import("three");
        if (disposed || !canvasRef.current) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
        camera.position.set(0, 0, 9.7);
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: (window.devicePixelRatio || 1) <= 1.5,
          powerPreference: "low-power"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.15 : 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        scene.add(new THREE.AmbientLight(0xffffff, 1.3));
        const key = new THREE.DirectionalLight(0xffd4b8, 3);
        key.position.set(-4, 6, 7);
        scene.add(key);
        const orangeLight = new THREE.PointLight(0xff6600, 30, 18);
        orangeLight.position.set(4, 1, 3);
        scene.add(orangeLight);
        const violetLight = new THREE.PointLight(0x747bff, 16, 15);
        violetLight.position.set(-4, -2, -1);
        scene.add(violetLight);

        parcelGroup = new THREE.Group();
        const parcelGeometry = new THREE.BoxGeometry(2.25, 1.62, 1.58);
        parcelGroup.add(new THREE.Mesh(parcelGeometry, new THREE.MeshStandardMaterial({ color: 0xc88855, roughness: .76 })));
        const tape = new THREE.Mesh(new THREE.BoxGeometry(.28, 1.64, .025), new THREE.MeshStandardMaterial({ color: 0xff762b, roughness: .5 }));
        tape.position.set(.12, 0, .8);
        parcelGroup.add(tape);
        const topTape = new THREE.Mesh(new THREE.BoxGeometry(.28, .025, 1.59), new THREE.MeshStandardMaterial({ color: 0xff762b, roughness: .5 }));
        topTape.position.set(.12, .82, 0);
        parcelGroup.add(topTape);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(parcelGeometry), new THREE.LineBasicMaterial({ color: 0xffd0ae, transparent: true, opacity: .4 }));
        parcelGroup.add(edges);
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(.84, .53),
          new THREE.MeshBasicMaterial({ map: makeParcelLabel(THREE), transparent: true, side: THREE.DoubleSide })
        );
        label.position.set(-.42, -.18, .807);
        parcelGroup.add(label);
        scene.add(parcelGroup);

        orbitGroup = new THREE.Group();
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.5, .012, 6, 160), new THREE.MeshBasicMaterial({ color: 0xff813e, transparent: true, opacity: .08, depthWrite: false }));
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.95, .008, 6, 160), new THREE.MeshBasicMaterial({ color: 0x8588ff, transparent: true, opacity: .06, depthWrite: false }));
        ringA.rotation.x = .9;
        ringB.rotation.set(1, .7, 0);
        orbitGroup.add(ringA, ringB);
        scene.add(orbitGroup);

        const routeNodes = [
          [-3.55, 1.55, -1.15], [-2.95, -1.6, -.95], [-.3, 2.25, -1.35],
          [2.8, 1.65, -1.3], [3.45, -.85, -1.15], [1.25, -2.05, -1.2]
        ];
        const routeColors = [0xff873d, 0x8c8aff, 0xffa15e, 0x69b8db, 0xff873d, 0x8f91ff];
        routeNodes.forEach((coords, i) => {
          const end = new THREE.Vector3(coords[0], coords[1], coords[2]);
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-.15, .03, -.78),
            new THREE.Vector3(end.x * .35, end.y * .28 + (i % 2 ? -.35 : .35), -1.05),
            new THREE.Vector3(end.x * .72, end.y * .78, -1.25),
            end
          ]);
          const geometry = new THREE.TubeGeometry(curve, 84, .012, 5, false);
          geometry.setDrawRange(0, 0);
          const line = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: routeColors[i], transparent: true, opacity: 0, depthWrite: false }));
          scene.add(line);
          const node = new THREE.Mesh(new THREE.SphereGeometry(.075, 14, 14), new THREE.MeshBasicMaterial({ color: routeColors[i], transparent: true, opacity: 0 }));
          node.position.copy(end);
          scene.add(node);
          const dot = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffc19a, transparent: true, opacity: 0, depthWrite: false }));
          scene.add(dot);
          routeItems.push({ curve, line, node, dot, vertexCount: geometry.attributes.position.count });
        });

        const cardSpecs = [
          { eyebrow: "SHIPPING ANALYTICS", title: "Shipping volume", metric: "12,480", accent: "#ff955c", startX: -4.4, startY: 1.05, endX: -3.05, endY: 1.1, width: 2.1, height: 1.12 },
          { eyebrow: "LIVE TRACKING", title: "In transit", metric: "1,284", accent: "#9c9aff", startX: 4.2, startY: .65, endX: 3.05, endY: .8, width: 2.05, height: 1.09 },
          { eyebrow: "NDR ESCALATION", title: "Needs attention", metric: "24", accent: "#ffb56b", startX: 3.7, startY: -1.5, endX: 2.65, endY: -1.3, width: 1.9, height: 1.02 }
        ];
        cards = cardSpecs.map((spec) => {
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: makeCardTexture(THREE, spec.eyebrow, spec.title, spec.metric, spec.accent),
            transparent: true,
            opacity: 0,
            depthWrite: false
          }));
          sprite.position.set(spec.startX, spec.startY, .5);
          sprite.scale.set(spec.width * .78, spec.height * .78, 1);
          scene.add(sprite);
          return { ...spec, sprite };
        });

        const particlePositions = new Float32Array(150 * 3);
        for (let i = 0; i < 150; i += 1) {
          particlePositions[i * 3] = (Math.random() - .5) * 10;
          particlePositions[i * 3 + 1] = (Math.random() - .5) * 6;
          particlePositions[i * 3 + 2] = -2 - Math.random() * 4;
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
        dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xb8b6ff, size: .025, transparent: true, opacity: .36, sizeAttenuation: true }));
        scene.add(dust);

        const resize = () => {
          if (!pinRef.current || !renderer) return;
          const rect = pinRef.current.getBoundingClientRect();
          renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
          camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
          camera.fov = window.innerWidth < 600 ? 55 : 38;
          camera.updateProjectionMatrix();
          requestDraw();
        };

        resizeObserver = new ResizeObserver(resize);
        if (pinRef.current) resizeObserver.observe(pinRef.current);
        window.addEventListener("resize", resize);
        window.addEventListener("scroll", requestDraw, { passive: true });
        pinRef.current?.addEventListener("pointermove", onPointerMove, { passive: true });
        pinRef.current?.addEventListener("pointerleave", onPointerLeave);
        cleanupListeners = () => {
          window.removeEventListener("resize", resize);
          window.removeEventListener("scroll", requestDraw);
          pinRef.current?.removeEventListener("pointermove", onPointerMove);
          pinRef.current?.removeEventListener("pointerleave", onPointerLeave);
        };

        setWebglReady(true);
        drawAtScroll();
      } catch (error) {
        if (!disposed) {
          console.warn("ParcelX IQ 3D scene could not be initialized; using the visual fallback.", error);
          setWebglReady(false);
        }
      }
    };

    init();
    return () => {
      disposed = true;
      if (raf) window.cancelAnimationFrame(raf);
      cleanupListeners?.();
      resizeObserver?.disconnect();
      if (scene) {
        scene.traverse((object) => {
          object.geometry?.dispose?.();
          const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
          materials.forEach((material) => {
            material.map?.dispose?.();
            material.dispose?.();
          });
        });
      }
      renderer?.dispose();
    };
  }, []);

  const jumpToStep = (index) => {
    const story = storyRef.current;
    const pin = pinRef.current;
    if (!story || !pin) return;
    const distance = Math.max(0, story.offsetHeight - pin.offsetHeight);
    const target = window.scrollY + story.getBoundingClientRect().top + distance * (index / 3);
    window.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const current = chapters[activeStep];

  return (
    <div className="pxq-scroll-story" ref={storyRef}>
      <div className={"pxq-scroll-pin" + (webglReady ? " is-3d-ready" : "")} ref={pinRef}>
        <div className="pxq-story-fallback" aria-hidden="true">
          <div className="pxq-fallback-orbit orbit-one" />
          <div className="pxq-fallback-orbit orbit-two" />
          <div className="pxq-fallback-package"><span>PX</span><b>IQ</b></div>
          <div className="pxq-fallback-card card-one"><small>SHIPPING ANALYTICS</small><b>12,480</b></div>
          <div className="pxq-fallback-card card-two"><small>LIVE TRACKING</small><b>1,284</b></div>
          <div className="pxq-fallback-card card-three"><small>NDR ESCALATION</small><b>24</b></div>
        </div>
        <canvas ref={canvasRef} className="pxq-story-canvas" aria-label="Interactive 3D ParcelX IQ shipping network, controlled by scrolling" />
        <div className="pxq-story-vignette" aria-hidden="true" />
        <div className="pxq-story-topline">
          <span><i /> PARCELX IQ / SHIPPING ECOSYSTEM</span>
          <span className="pxq-story-scroll-hint">SCROLL TO EXPLORE <b>↓</b></span>
        </div>
        <div className="pxq-story-bottom">
          <div className="pxq-story-copy" aria-live="polite">
            <small>{current.tag}</small>
            <h3>{current.title}</h3>
            <p>{current.body}</p>
          </div>
          <div className="pxq-story-controls" aria-label="Scroll animation chapters">
            <span>SCENE</span>
            <div>
              {chapters.map((chapter, index) => (
                <button key={chapter.tag} type="button" className={activeStep === index ? "active" : ""}
                  aria-label={"Go to scene " + (index + 1) + ": " + chapter.title}
                  aria-pressed={activeStep === index} onClick={() => jumpToStep(index)}>
                  <i />
                </button>
              ))}
            </div>
            <b>0{activeStep + 1}<em> / 04</em></b>
          </div>
        </div>
        <div className="pxq-story-progress" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
