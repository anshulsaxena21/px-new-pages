(() => {
  const ASSETS = {
    "fire-1f525-1-2802-9904.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/11016fae-7d90-40f3-b2ae-aba6db56756a",
    "image-2760-21028.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/384691f1-d93b-41c3-874a-d8358d9c2b76",
    "blue-dart-logo-transparent-1-2802-10094.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0c93cf9f-9fd4-4a92-a919-b72b08af1806",
    "image-4-2802-10054.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/90643590-e0e9-4eb3-94e8-211d372196c5",
    "pngtree-3d-shopping-bag-empty-18739972-1-2802-10109.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/83b7c5bb-a4c2-4d8c-806e-63b87a521b3a",
    "image-2802-10114.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/45d0d681-1495-4d85-9eb8-5438304b4cb0",
    "image-2802-10141.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3865ed56-4a3b-4735-a439-7c7049c828e2",
    "image-2802-10147.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e9992b34-b312-47b4-9dd7-7a40a824307f",
    "image-2802-10155.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/01170749-d3fc-4c2f-81dc-8a0b388d5c40",
    "image-2802-10161.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e663eeb6-a9a5-4958-94d0-264208b84fff",
    "bg-2802-10189.png": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/be907326-07b9-4e7f-a308-77d66acf9a1f"
  };

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

  function loadDesignAssets() {
    const missing = [];
    const status = document.getElementById("assetStatus");
    const jobs = [];
    document.querySelectorAll("[data-asset]").forEach((element) => {
      const filename = element.dataset.asset.split("/").pop();
      const url = ASSETS[filename];
      if (!url) {
        missing.push(filename);
        return;
      }
      element.src = url;
      element.addEventListener("error", () => {
        missing.push(filename);
        element.classList.add("asset-missing");
        if (status) {
          status.textContent = "Could not load: " + [...new Set(missing)].join(", ");
          status.classList.add("show");
        }
      }, { once: true });
      element.addEventListener("load", () => element.classList.add("asset-loaded"), { once: true });
    });
    document.querySelectorAll("[data-bg]").forEach((element) => {
      const filename = element.dataset.bg.split("/").pop();
      const url = ASSETS[filename];
      if (!url) {
        missing.push(filename);
        return;
      }
      const probe = new Image();
      probe.onload = () => {
        element.style.backgroundImage = "url('" + url + "')";
        element.classList.add("asset-loaded");
      };
      probe.onerror = () => {
        missing.push(filename);
        if (status) {
          status.textContent = "Could not load: " + [...new Set(missing)].join(", ");
          status.classList.add("show");
        }
      };
      probe.src = url;
    });
    if (status && missing.length) {
      status.textContent = "Missing asset mapping: " + [...new Set(missing)].join(", ");
      status.classList.add("show");
    }
  }

  setupTrackingModes();
  setupForm();
  loadDesignAssets();
})();