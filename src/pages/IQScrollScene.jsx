import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MODEL_UID = "3040cb76b1a1466785435ab1a344cf1b";
const VIEWER_API = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";

const chapters = [
  { tag: "01 / SHIPMENT", title: "It starts with a parcel.", body: "One shipment becomes the beginning of a connected story." },
  { tag: "02 / NETWORK", title: "Every route tells a story.", body: "Follow movement, milestones and delivery signals across your network." },
  { tag: "03 / INTELLIGENCE", title: "Signals become insight.", body: "Bring analytics, tracking and exceptions into one clear view." },
  { tag: "04 / CONTROL", title: "Your shipping picture. In focus.", body: "A connected ParcelX IQ experience for the work that moves your business." }
];

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function loadSketchfabApi() {
  if (window.Sketchfab) return Promise.resolve(window.Sketchfab);

  return new Promise((resolve, reject) => {
    let script = document.querySelector("script[data-sketchfab-viewer-api]");
    if (script) {
      script.addEventListener("load", () => resolve(window.Sketchfab), { once: true });
      script.addEventListener("error", reject, { once: true });
      if (window.Sketchfab) resolve(window.Sketchfab);
      return;
    }

    script = document.createElement("script");
    script.src = VIEWER_API;
    script.async = true;
    script.dataset.sketchfabViewerApi = "true";
    script.onload = () => window.Sketchfab ? resolve(window.Sketchfab) : reject(new Error("Sketchfab API did not initialize."));
    script.onerror = () => reject(new Error("Unable to load the Sketchfab Viewer API."));
    document.head.appendChild(script);
  });
}

function cameraAt(progress, basePosition, baseTarget) {
  const dx = basePosition[0] - baseTarget[0];
  const dy = basePosition[1] - baseTarget[1];
  const dz = basePosition[2] - baseTarget[2];
  const radius = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const baseTheta = Math.atan2(dx, dz);
  const basePhi = Math.acos(clamp(dy / radius, -1, 1));

  const keys = [
    { at: 0, orbit: 0, zoom: 1.04, tilt: 0 },
    { at: 0.23, orbit: 0.42, zoom: 0.98, tilt: -0.025 },
    { at: 0.5, orbit: 1.18, zoom: 1.02, tilt: 0.035 },
    { at: 0.78, orbit: 1.96, zoom: 1.07, tilt: -0.025 },
    { at: 1, orbit: 2.48, zoom: 1.16, tilt: 0.015 }
  ];

  let start = keys[0];
  let end = keys[keys.length - 1];

  for (let i = 0; i < keys.length - 1; i += 1) {
    if (progress >= keys[i].at && progress <= keys[i + 1].at) {
      start = keys[i];
      end = keys[i + 1];
      break;
    }
  }

  const local = smooth(clamp((progress - start.at) / Math.max(0.0001, end.at - start.at)));
  const orbit = lerp(start.orbit, end.orbit, local);
  const zoom = lerp(start.zoom, end.zoom, local);
  const phi = clamp(basePhi + lerp(start.tilt, end.tilt, local), 0.18, Math.PI - 0.18);
  const distance = radius * zoom;
  const theta = baseTheta + orbit;

  return {
    position: [
      baseTarget[0] + Math.sin(phi) * Math.sin(theta) * distance,
      baseTarget[1] + Math.cos(phi) * distance,
      baseTarget[2] + Math.sin(phi) * Math.cos(theta) * distance
    ],
    target: baseTarget
  };
}

export default function IQScrollScene() {
  const storyRef = useRef(null);
  const pinRef = useRef(null);
  const iframeRef = useRef(null);
  const apiRef = useRef(null);
  const baseCameraRef = useRef(null);
  const progressRef = useRef({ value: 0 });
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerError, setViewerError] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let disposed = false;
    let scrollContext = null;
    let lastSentAt = 0;
    let lastSentProgress = -1;
    let lastStep = -1;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progressDriver = progressRef.current;

    const updateChapter = (progress) => {
      const nextStep = progress < 0.2 ? 0 : progress < 0.5 ? 1 : progress < 0.79 ? 2 : 3;
      if (nextStep !== lastStep) {
        lastStep = nextStep;
        setActiveStep(nextStep);
      }
    };

    const drawAtProgress = (rawProgress, force = false) => {
      if (disposed) return;

      const progress = clamp(rawProgress);
      if (pinRef.current) {
        pinRef.current.style.setProperty("--pxq-story-progress", progress.toFixed(4));
      }
      updateChapter(progress);

      const api = apiRef.current;
      const camera = baseCameraRef.current;
      if (!api || !camera) return;

      const now = performance.now();
      if (!force && (now - lastSentAt < 32 || Math.abs(progress - lastSentProgress) < 0.0018)) return;

      lastSentAt = now;
      lastSentProgress = progress;

      const nextCamera = cameraAt(progress, camera.position, camera.target);
      try {
        api.setCameraLookAt(nextCamera.position, nextCamera.target, 0);
      } catch (error) {
        console.warn("Unable to update the Sketchfab camera.", error);
      }
    };

    const setupScrollStory = () => {
      if (disposed || !storyRef.current || !pinRef.current) return;

      if (reduceMotion) {
        drawAtProgress(0, true);
        return;
      }

      scrollContext?.revert();
      scrollContext = gsap.context(() => {
        const routes = gsap.utils.toArray(".pxq-story-routes .route");
        const routeNodes = gsap.utils.toArray(".pxq-story-routes .route-nodes circle");
        const cards = gsap.utils.toArray(".pxq-story-fx-card");
        const orbits = gsap.utils.toArray(".pxq-story-orbit");

        const storyTimeline = gsap.timeline({
          onUpdate: () => drawAtProgress(progressDriver.value),
          scrollTrigger: {
            trigger: storyRef.current,
            start: () => {
              const stickyTop = parseFloat(window.getComputedStyle(pinRef.current).top) || 0;
              return "top top+=" + stickyTop;
            },
            end: () => "+=" + Math.max(1, storyRef.current.offsetHeight - pinRef.current.offsetHeight),
            scrub: 0.85,
            invalidateOnRefresh: true,
            snap: window.matchMedia("(min-width: 901px)").matches ? {
              snapTo: [0, 0.23, 0.5, 0.79, 1],
              duration: { min: 0.12, max: 0.38 },
              delay: 0.08,
              ease: "power2.out"
            } : false
          }
        });

        // One master playhead drives the 3D camera and every overlay in the scene.
        storyTimeline.to(progressDriver, {
          value: 1,
          duration: 1,
          ease: "none"
        }, 0);

        // Orbit rings create a slow, dimensional movement around the parcel.
        if (orbits[0]) {
          storyTimeline.fromTo(orbits[0],
            { rotation: -38, scale: 0.9, autoAlpha: 0.55 },
            { rotation: 24, scale: 1.04, autoAlpha: 1, duration: 1, ease: "none" },
            0
          );
        }
        if (orbits[1]) {
          storyTimeline.fromTo(orbits[1],
            { rotation: 54, scale: 0.94, autoAlpha: 0.28 },
            { rotation: -18, scale: 1.08, autoAlpha: 0.82, duration: 1, ease: "none" },
            0
          );
        }

        // Route paths draw into the scene as the story moves from shipment to network.
        storyTimeline.fromTo(routes,
          { strokeDashoffset: 1600, autoAlpha: 0 },
          { strokeDashoffset: 0, autoAlpha: 1, duration: 0.32, stagger: 0.035, ease: "none" },
          0.13
        );

        // Network nodes light up after the routes have appeared.
        storyTimeline.fromTo(routeNodes,
          { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" },
          { scale: 1, autoAlpha: 1, duration: 0.12, stagger: 0.018, ease: "back.out(1.7)" },
          0.38
        );

        // Operational data cards enter, hold, then leave before the final IQ reveal.
        storyTimeline.fromTo(cards,
          { autoAlpha: 0, y: 26, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.035, ease: "power2.out" },
          0.46
        );
        storyTimeline.to(cards,
          { autoAlpha: 0, y: -16, duration: 0.08, stagger: 0.018, ease: "power2.in" },
          0.88
        );

        drawAtProgress(progressDriver.value, true);
      }, storyRef);

      ScrollTrigger.refresh();
    };

    setupScrollStory();
    const refreshAfterLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshAfterLoad, { once: true });

    const initializeViewer = async () => {
      try {
        const Sketchfab = await loadSketchfabApi();
        if (disposed || !iframeRef.current) return;

        const client = new Sketchfab("1.12.1", iframeRef.current);
        client.init(MODEL_UID, {
          autostart: 1,
          camera: 0,
          autospin: 0,
          transparent: 0,
          ui_controls: 0,
          ui_infos: 0,
          ui_settings: 0,
          ui_help: 0,
          ui_hint: 0,
          ui_stop: 0,
          ui_fullscreen: 0,
          ui_vr: 0,
          ui_ar: 0,
          ui_animations: 0,
          ui_watermark: 1,
          ui_watermark_link: 1,
          success: (api) => {
            if (disposed) return;
            apiRef.current = api;
            api.start();
            api.addEventListener("viewerready", () => {
              if (disposed) return;
              api.setUserInteraction(false);
              api.setBackground({ color: [0.012, 0.018, 0.03] });
              api.setEnableCameraConstraints(false);
              api.getCameraLookAt((error, camera) => {
                if (disposed) return;
                if (error || !camera?.position || !camera?.target) {
                  setViewerError(true);
                  return;
                }
                baseCameraRef.current = {
                  position: camera.position.slice(),
                  target: camera.target.slice()
                };
                setViewerReady(true);
                drawAtProgress(progressDriver.value, true);
                ScrollTrigger.refresh();
              });
            });
          },
          error: () => {
            if (!disposed) setViewerError(true);
          }
        });
      } catch (error) {
        console.warn("Sketchfab viewer could not be initialized.", error);
        if (!disposed) setViewerError(true);
      }
    };

    initializeViewer();

    return () => {
      disposed = true;
      window.removeEventListener("load", refreshAfterLoad);
      scrollContext?.revert();
      try {
        apiRef.current?.stop();
      } catch (_) {
        // The iframe may already have been released by the browser.
      }
      apiRef.current = null;
      baseCameraRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pinRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const copy = pinRef.current.querySelector(".pxq-story-copy");
    if (!copy) return undefined;

    const copyContext = gsap.context(() => {
      gsap.fromTo(copy,
        { autoAlpha: 0, y: 18, filter: "blur(7px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.035,
          ease: "power3.out",
          clearProps: "filter"
        }
      );
    }, pinRef);

    return () => copyContext.revert();
  }, [activeStep]);

  const jumpToStep = (index) => {
    const story = storyRef.current;
    const pin = pinRef.current;
    if (!story || !pin) return;

    const distance = Math.max(0, story.offsetHeight - pin.offsetHeight);
    const stickyTop = parseFloat(window.getComputedStyle(pin).top) || 0;
    const chapterStops = [0, 0.23, 0.5, 0.79];
    const storyTop = window.scrollY + story.getBoundingClientRect().top;
    const target = storyTop - stickyTop + distance * chapterStops[index];

    window.scrollTo({
      top: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };

  const current = chapters[activeStep];

  return (
    <div className="pxq-scroll-story" ref={storyRef}>
      <div className={"pxq-scroll-pin" + (viewerReady ? " is-3d-ready" : "")} ref={pinRef}>
        <iframe
          ref={iframeRef}
          className="pxq-sketchfab-viewer"
          title="ParcelBox 3D model by Suphanee on Sketchfab"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true"
          web-share="true"
        />
        <div className="pxq-story-fx" aria-hidden="true">
          <div className="pxq-story-orbit orbit-one" />
          <div className="pxq-story-orbit orbit-two" />
          <svg className="pxq-story-routes" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="pxqRouteOrange"><stop stopColor="#ff6600" stopOpacity="0"/><stop offset=".55" stopColor="#ff8a4c"/><stop offset="1" stopColor="#ffb17e"/></linearGradient>
              <linearGradient id="pxqRouteViolet"><stop stopColor="#858aff" stopOpacity="0"/><stop offset="1" stopColor="#858aff"/></linearGradient>
            </defs>
            <path className="route route-orange" d="M120 180 C300 110 350 350 590 340 S850 120 1080 215"/>
            <path className="route route-violet" d="M110 525 C310 610 420 400 600 365 S850 580 1100 475"/>
            <path className="route route-teal" d="M250 70 C360 220 430 230 600 350 S820 440 970 630"/>
            <g className="route-nodes">
              <circle cx="120" cy="180" r="6"/><circle cx="1080" cy="215" r="6"/>
              <circle cx="110" cy="525" r="6"/><circle cx="1100" cy="475" r="6"/>
              <circle cx="250" cy="70" r="6"/><circle cx="970" cy="630" r="6"/>
            </g>
          </svg>
          <div className="pxq-story-fx-card fx-card-analytics"><small>SHIPPING ANALYTICS</small><b>12,480</b><span>Shipment volume</span></div>
          <div className="pxq-story-fx-card fx-card-tracking"><small>LIVE TRACKING</small><b>1,284</b><span>In transit</span></div>
          <div className="pxq-story-fx-card fx-card-ndr"><small>NDR ESCALATION</small><b>24</b><span>Needs attention</span></div>
        </div>
        {!viewerReady && (
          <div className="pxq-story-loading">
            {viewerError ? (
              <>
                <b>3D preview unavailable</b>
                <span>Open the original model on Sketchfab to explore it.</span>
                <a href="https://sketchfab.com/3d-models/parcelbox-3040cb76b1a1466785435ab1a344cf1b" target="_blank" rel="noreferrer">View ParcelBox on Sketchfab <span>↗</span></a>
              </>
            ) : (
              <>
                <i />
                <span>Loading the ParcelX IQ parcel model…</span>
              </>
            )}
          </div>
        )}
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
            <div className="pxq-story-credit">
              3D asset: <a href="https://sketchfab.com/3d-models/parcelbox-3040cb76b1a1466785435ab1a344cf1b" target="_blank" rel="noreferrer">ParcelBox by Suphanee on Sketchfab</a>
            </div>
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
