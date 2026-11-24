(() => {
  const bundleUrl = new URL("../../px-custom-tracking-ds-website-wq3c-aefwrds-bundle.zip", window.location.href);
  const statusEl = document.getElementById("assetStatus");

  function setMessage(message, isError = false) {
    const node = document.querySelector(".form-message");
    if (!node) return;
    node.textContent = message;
    node.style.color = isError ? "#b42318" : "#1FC16B";
  }

  function setupTrackingModes() {
    const modes = [...document.querySelectorAll(".mode")];
    const input = document.getElementById("trackingValue");
    const placeholders = { waybill: "Enter your waybill number", order: "Enter your order ID", mobile: "Enter your mobile number" };
    modes.forEach((button) => button.addEventListener("click", () => {
      modes.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
        const icon = item.querySelector("i");
        if (icon) icon.className = active ? "ph-fill ph-check-circle" : "ph ph-circle";
      });
      input.placeholder = placeholders[button.dataset.mode] || placeholders.waybill;
      input.value = "";
      input.focus();
      setMessage("");
    }));
  }

  function setupForm() {
    const form = document.getElementById("trackingForm");
    const input = document.getElementById("trackingValue");
    if (!form || !input) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input.value.trim()) {
        setMessage("Please enter your tracking details.", true);
        input.focus();
        return;
      }
      setMessage("Demo preview: tracking details are displayed below. Connect your tracking API to load live shipment events.");
      document.querySelector(".tracking-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function findZipAsset(archive, requestedPath) {
    const filename = requestedPath.split("/").pop().toLowerCase();
    const entries = Object.values(archive.files).filter((entry) => !entry.dir);
    const exact = entries.find((entry) => entry.name.toLowerCase() === requestedPath.toLowerCase());
    if (exact) return exact;
    const imageFolderMatch = entries.find((entry) => {
      const name = entry.name.toLowerCase();
      return name.endsWith("/assets/images/" + filename) || name.endsWith("/images/" + filename);
    });
    if (imageFolderMatch) return imageFolderMatch;
    return entries.find((entry) => entry.name.split("/").pop().toLowerCase() === filename) || null;
  }

  async function loadDesignAssets() {
    const missing = [];
    const objectUrls = [];
    try {
      if (!window.JSZip) throw new Error("The ZIP reader library did not load.");
      const response = await fetch(bundleUrl.href, { cache: "no-cache" });
      if (!response.ok) throw new Error("The design asset ZIP returned HTTP " + response.status + ".");
      const archive = await window.JSZip.loadAsync(await response.arrayBuffer());

      async function loadOne(element, requestedPath, isBackground) {
        try {
          const entry = findZipAsset(archive, requestedPath);
          if (!entry) throw new Error("Not found in ZIP: " + requestedPath.split("/").pop());
          const blob = await entry.async("blob");
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          if (isBackground) {
            element.style.backgroundImage = "url('" + url + "')";
          } else {
            element.src = url;
            element.removeAttribute("data-asset");
          }
          element.classList.add("asset-loaded");
        } catch (error) {
          missing.push(requestedPath.split("/").pop());
          console.warn("[Theme 03] Could not load asset:", requestedPath, error);
          if (!isBackground && element.tagName === "IMG") {
            element.classList.add("asset-missing");
            element.alt = element.alt || "Image unavailable";
          }
        }
      }

      const imageJobs = [...document.querySelectorAll("[data-asset]")].map((el) => loadOne(el, el.dataset.asset, false));
      const backgroundJobs = [...document.querySelectorAll("[data-bg]")].map((el) => loadOne(el, el.dataset.bg, true));
      await Promise.all([...imageJobs, ...backgroundJobs]);

      if (statusEl) {
        statusEl.textContent = missing.length
          ? "Loaded with " + missing.length + " missing image(s): " + missing.join(", ")
          : "All design assets loaded";
        if (missing.length) statusEl.classList.add("show");
        else statusEl.classList.remove("show");
      }
      document.documentElement.classList.add("assets-ready");
      window.addEventListener("pagehide", () => objectUrls.forEach((url) => URL.revokeObjectURL(url)), { once: true });
    } catch (error) {
      console.error("[Theme 03] Asset bundle loading failed:", error);
      if (statusEl) {
        statusEl.textContent = "Could not load design bundle: " + error.message;
        statusEl.classList.add("show");
      }
    }
  }

  setupTrackingModes();
  setupForm();
  loadDesignAssets();
})();