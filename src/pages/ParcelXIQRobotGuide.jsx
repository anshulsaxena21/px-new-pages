import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import "../styles/parcelx-iq-robot-guide.css";

const ROBOT_MODEL_URL = `${import.meta.env.BASE_URL}mini_robot%20(1).glb`;

function RobotCanvas() {
  const hostRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let disposed = false;
    let started = false;
    let visible = false;
    let frameId = 0;
    let renderer;
    let scene;
    let camera;
    let robotGroup;
    let resizeObserver;
    let visibilityObserver;
    let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };

    const renderFrame = (time = 0) => {
      if (disposed || !renderer || !scene || !camera || !visible) return;
      if (robotGroup && !reduceMotion) {
        robotGroup.position.y = Math.sin(time * 0.00055) * 0.045;
        robotGroup.rotation.y = 0.16 + Math.sin(time * 0.00032) * 0.045 + pointer.x * 0.1;
        robotGroup.rotation.x = pointer.y * 0.055 + Math.sin(time * 0.0004) * 0.012;
        robotGroup.rotation.z = Math.sin(time * 0.0003) * 0.01;
      }
      renderer.render(scene, camera);
      if (!reduceMotion) frameId = window.requestAnimationFrame(renderFrame);
    };

    const startRendering = () => {
      if (!visible || !renderer || !scene || !camera) return;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (reduceMotion) {
        renderFrame(0);
      } else {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const stopRendering = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      pointer.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      pointer.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    };

    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    const initialize = async () => {
      if (started || disposed) return;
      started = true;

      try {
        const [THREE, loaderModule] = await Promise.all([
          import("three"),
          import("three/addons/loaders/GLTFLoader.js")
        ]);
        if (disposed) return;

        const { GLTFLoader } = loaderModule;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
        camera.position.set(0, 0.12, 5.7);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.domElement.className = "pxq-robot-canvas";
        renderer.domElement.setAttribute("aria-hidden", "true");
        host.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(0xfff7f0, 0x9a6550, 2.0));

        const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
        keyLight.position.set(3.2, 4.5, 4.5);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xffb17e, 1.65);
        fillLight.position.set(-4, 1.8, 3);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
        rimLight.position.set(0.5, 3.2, -4);
        scene.add(rimLight);

        const resize = () => {
          if (!host || !renderer || !camera) return;
          const width = Math.max(1, host.clientWidth);
          const height = Math.max(1, host.clientHeight);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          if (visible) startRendering();
        };

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        const loader = new GLTFLoader();
        loader.load(
          ROBOT_MODEL_URL,
          (gltf) => {
            if (disposed) return;
            const model = gltf.scene;
            const initialBounds = new THREE.Box3().setFromObject(model);
            const initialSize = initialBounds.getSize(new THREE.Vector3());
            const scale = 3.02 / Math.max(initialSize.y, 0.001);
            model.scale.setScalar(scale);

            const centeredBounds = new THREE.Box3().setFromObject(model);
            const center = centeredBounds.getCenter(new THREE.Vector3());
            model.position.sub(center);

            robotGroup = new THREE.Group();
            robotGroup.add(model);
            scene.add(robotGroup);
            setStatus("ready");
            setProgress(100);
            startRendering();
          },
          (event) => {
            if (!event.total) return;
            const next = Math.min(99, Math.round((event.loaded / event.total) * 100));
            setProgress(next);
          },
          (error) => {
            console.warn("ParcelX IQ robot model could not be loaded.", error);
            if (!disposed) setStatus("fallback");
          }
        );
      } catch (error) {
        console.warn("ParcelX IQ 3D preview is unavailable.", error);
        if (!disposed) setStatus("fallback");
      }
    };

    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          initialize();
          startRendering();
        } else {
          stopRendering();
        }
      },
      { threshold: 0.08 }
    );

    visibilityObserver.observe(host);
    host.addEventListener("pointermove", handlePointerMove, { passive: true });
    host.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      stopRendering();
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      host.removeEventListener("pointermove", handlePointerMove);
      host.removeEventListener("pointerleave", handlePointerLeave);

      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              Object.values(material).forEach((value) => {
                if (value && value.isTexture) value.dispose();
              });
              material.dispose();
            });
          }
        });
      }
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <div className="pxq-robot-stage" ref={hostRef} aria-label="Interactive 3D ParcelX IQ robot guide">
      <div className="pxq-robot-stage-grid" aria-hidden="true" />
      <div className="pxq-robot-stage-orbit pxq-robot-stage-orbit-one" aria-hidden="true" />
      <div className="pxq-robot-stage-orbit pxq-robot-stage-orbit-two" aria-hidden="true" />
      <div className="pxq-robot-ground" aria-hidden="true" />
      {status !== "ready" && (
        <div className="pxq-robot-loading" role="status" aria-live="polite">
          <span className="pxq-robot-loading-mark"><i /><i /><i /></span>
          <span>{status === "fallback" ? "Your guide is ready in preview mode" : "Waking up your guide…"}</span>
          {status === "loading" && <b>{progress > 0 ? progress + "%" : "3D PREVIEW"}</b>}
        </div>
      )}
      <div className="pxq-robot-speech"><span><Sparkles size={13} /> IQ GUIDE</span><b>Hey! What are we exploring today?</b></div>
    </div>
  );
}

export default function ParcelXIQRobotGuide({ capabilities, demoUrl }) {
  return (
    <section className="pxq-robot-guide" id="meet-iq" aria-labelledby="pxq-robot-guide-title">
      <div className="pxq-robot-guide-shell">
        <div className="pxq-robot-guide-panel">
          <div className="pxq-robot-visual">
            <RobotCanvas />
            <div className="pxq-robot-credit">
              3D character: <a href="https://sketchfab.com/3d-models/mini-robot-3454c84d6eff4a9dabbfadbfd1f56524" target="_blank" rel="noreferrer">Mini Robot by Onur</a>
              <span> · </span><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
            </div>
          </div>

          <div className="pxq-robot-copy">
            <div className="pxq-robot-eyebrow"><span><Sparkles size={13} /></span> YOUR PARCELX IQ COMPANION</div>
            <h2 id="pxq-robot-guide-title">Meet IQ.<br /><span>Your guide to getting things moving.</span></h2>
            <p>Need a clearer picture or a quick next step? Choose a module and jump straight to the part of your shipping workflow you want to explore.</p>

            <div className="pxq-robot-module-heading">
              <span>CHOOSE A MODULE</span>
              <i />
              <small>06 QUICK SHORTCUTS</small>
            </div>
            <div className="pxq-robot-modules">
              {capabilities.map(({ id, number, title, icon: Icon }) => (
                <a className="pxq-robot-module" href={`#capability-${id}`} key={id} aria-label={`Explore ${title}`}>
                  <span className="pxq-robot-module-icon"><Icon size={17} /></span>
                  <span className="pxq-robot-module-text"><small>{number}</small><b>{title}</b></span>
                  <ArrowUpRight className="pxq-robot-module-arrow" size={15} />
                </a>
              ))}
            </div>

            <div className="pxq-robot-bottom">
              <span><i /> Choose a module to jump to its overview</span>
              <a href={demoUrl}>Talk to the ParcelX team <ArrowRight size={14} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
