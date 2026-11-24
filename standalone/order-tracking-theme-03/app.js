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
    const placeholders = {
      waybill: "Enter your waybill number",
      order: "Enter your order ID",
      mobile: "Enter your mobile number"
    };
    modes.forEach((button) => {
      button.addEventListener("click", () => {
        modes.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-selected", String(active));
          const icon = item.querySelector("i");
          if (icon) {
            icon.className = active ? "ph-fill ph-check-circle" : "ph ph-circle";
          }
        });
        input.placeholder = placeholders[button.dataset.mode] || placeholders.waybill;
        input.value = "";
        input.focus();
        setMessage("");
      });
    });
  }

  function setupForm() {
    const form = document.getElementById("trackingForm");
    const input = document.getElementById("trackingValue");
    if (!form || !input) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) {
        setMessage("Please enter your tracking details.", true);
        input.focus();
        return;
      }
      setMessage("Demo preview: tracking details are displayed below. Connect your tracking API to load live shipment events.");
      document.querySelector(".tracking-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function loadDesignAssets() {
    try {
      if (!window.JSZip) throw new Error("The ZIP reader library did not load.");
      const response = await fetch(bundleUrl.href, { cache: "force-cache" });
      if (!response.ok) throw new Error("Could not load the design asset bundle (" + response.status + ").");
      const archive = await window.JSZip.loadAsync(await response.arrayBuffer());
      const objectUrls = [];
      const assetRoot = "assets/images/";

      async function getAsset(path) {
        const file = archive.file(assetRoot + path);
        if (!file) throw new Error("Missing design asset: " + path);
        const blob = await file.async("blob");
        const url = URL.createObjectURL(blob);
        objectUrls.push(url);
        return url;
      }

      const assetImages = [...document.querySelectorAll("[data-asset]")];
      const backgroundImages = [...document.querySelectorAll("[data-bg]")];
      await Promise.all([
        ...assetImages.map(async (image) => {
          image.src = await getAsset(image.dataset.asset.split("/").pop());
        }),
        ...backgroundImages.map(async (element) => {
          const url = await getAsset(element.dataset.bg.split("/").pop());
          element.style.backgroundImage = "url('" + url + "')";
        })
      ]);

      if (statusEl) statusEl.textContent = "Design assets loaded";
      document.documentElement.classList.add("assets-ready");
      window.addEventListener("pagehide", () => objectUrls.forEach(URL.revokeObjectURL), { once: true });
      window.setTimeout(() => statusEl?.classList.remove("show"), 900);
    } catch (error) {
      console.error("[Theme 03] Asset loading failed:", error);
      if (statusEl) {
        statusEl.textContent = "Some design assets could not load. Check the repository ZIP path.";
        statusEl.classList.add("show");
      }
    }
  }

  setupTrackingModes();
  setupForm();
  loadDesignAssets();
})();