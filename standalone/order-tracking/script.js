const tabs = document.querySelectorAll(".tracking-tab");
const input = document.querySelector("#trackingInput");
const form = document.querySelector("#trackingForm");
const message = document.querySelector("#formMessage");
const placeholders = {
  waybill: "Enter your waybill number",
  order: "Enter your order ID",
  mobile: "Enter your mobile number"
};
let activeMode = "waybill";

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeMode = tab.dataset.mode;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    input.placeholder = placeholders[activeMode];
    input.value = "";
    input.inputMode = activeMode === "mobile" ? "tel" : "text";
    input.focus();
    message.textContent = "";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    message.textContent = "Please enter your " + (activeMode === "waybill" ? "waybill number." : activeMode === "order" ? "order ID." : "mobile number.");
    input.focus();
    return;
  }
  if (activeMode === "mobile" && !/^[+()\-\s\d]{8,16}$/.test(value)) {
    message.textContent = "Please enter a valid mobile number.";
    input.focus();
    return;
  }
  message.textContent = "Demo preview: tracking details for " + value + " are shown below. Connect your ParcelX tracking API to load live shipment data.";
  document.querySelector(".tracking-details").scrollIntoView({ behavior: "smooth", block: "start" });
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

/* Clean interactive map — attribution retained as required by OpenStreetMap */
const mapElement = document.querySelector("#shipmentMap");
if (mapElement && window.L) {
  const shipmentMap = L.map(mapElement, {
    center: [9.967, 76.295],
    zoom: 13,
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(shipmentMap);
  L.control.zoom({ position: "topright" }).addTo(shipmentMap);
  L.circleMarker([9.967, 76.295], {
    radius: 8,
    color: "#ffffff",
    weight: 3,
    fillColor: "#ff6600",
    fillOpacity: 1
  }).addTo(shipmentMap);
  setTimeout(() => shipmentMap.invalidateSize(), 150);
}


/* Public Instagram profile preview using Instagram's native embed.
   This route does not call Business Discovery or require a Meta access token. */
(() => {
  const section = document.querySelector('[data-section="communityInstagram"]');
  const form = document.querySelector("#instagramPreviewForm");
  const input = document.querySelector("#instagramUsernameInput");
  const loadButton = document.querySelector("#instagramLoadButton");
  const grid = document.querySelector("#instagramPostGrid");
  const handleLink = document.querySelector("#instagramHandleLink");
  const followLink = document.querySelector("#instagramFollowLink");

  if (!section || !form || !input || !loadButton || !grid) return;

  let embedScriptPromise = null;
  let activeRequest = 0;

  const setMessage = (text, state = "idle") => {
    grid.replaceChildren();
    grid.classList.remove("instagram-profile-mode");
    const note = document.createElement("p");
    note.className = "instagram-feed-message";
    note.dataset.state = state;
    note.textContent = text;
    grid.append(note);
    grid.setAttribute("aria-busy", "false");
  };

  const normalizeUsername = (value) => {
    let username = String(value || "").trim();
    if (/^https?:\/\//i.test(username)) {
      try {
        const url = new URL(username);
        if (!/(^|\.)instagram\.com$/i.test(url.hostname)) return "";
        username = url.pathname.split("/").filter(Boolean)[0] || "";
      } catch {
        return "";
      }
    }
    username = username.replace(/^@/, "").replace(/\/$/, "");
    return /^[A-Za-z0-9._]{1,30}$/.test(username) ? username : "";
  };

  const updateProfileLinks = (username) => {
    const profileUrl = "https://www.instagram.com/" + encodeURIComponent(username) + "/";
    if (handleLink) {
      handleLink.textContent = "@" + username;
      handleLink.href = profileUrl;
      handleLink.hidden = false;
    }
    if (followLink) {
      followLink.href = profileUrl;
      followLink.hidden = false;
    }
    return profileUrl;
  };

  const loadInstagramEmbedScript = () => {
    if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
      return Promise.resolve();
    }
    if (embedScriptPromise) return embedScriptPromise;

    embedScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = resolve;
      script.onerror = () => {
        embedScriptPromise = null;
        reject(new Error("INSTAGRAM_EMBED_SCRIPT_FAILED"));
      };
      document.body.append(script);
    });
    return embedScriptPromise;
  };

  const renderProfileEmbed = (username, profileUrl) => {
    grid.replaceChildren();
    grid.classList.add("instagram-profile-mode");

    const wrapper = document.createElement("div");
    wrapper.className = "instagram-profile-card";

    const blockquote = document.createElement("blockquote");
    blockquote.className = "instagram-media";
    blockquote.setAttribute("data-instgrm-permalink", profileUrl);
    blockquote.setAttribute("data-instgrm-version", "14");

    const link = document.createElement("a");
    link.href = profileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View @" + username + " on Instagram";
    blockquote.append(link);

    wrapper.append(blockquote);
    grid.append(wrapper);
    grid.setAttribute("aria-busy", "true");
  };

  const loadProfile = async (rawUsername) => {
    const username = normalizeUsername(rawUsername);
    if (!username) {
      setMessage("Enter a valid Instagram username, such as parcelx.in.", "error");
      input.focus();
      return;
    }

    input.value = username;
    const requestId = ++activeRequest;
    const profileUrl = updateProfileLinks(username);

    loadButton.disabled = true;
    loadButton.textContent = "Loading…";
    grid.setAttribute("aria-busy", "true");
    renderProfileEmbed(username, profileUrl);

    try {
      await loadInstagramEmbedScript();
      if (requestId !== activeRequest) return;
      if (!window.instgrm || !window.instgrm.Embeds || typeof window.instgrm.Embeds.process !== "function") {
        throw new Error("INSTAGRAM_EMBED_UNAVAILABLE");
      }
      window.instgrm.Embeds.process();
      grid.setAttribute("aria-busy", "false");
    } catch {
      if (requestId === activeRequest) {
        setMessage("Instagram's profile embed could not be loaded. Check that the account is public and allows embeds, or open it directly on Instagram.", "error");
      }
    } finally {
      if (requestId === activeRequest) {
        loadButton.disabled = false;
        loadButton.textContent = "Preview profile";
        grid.setAttribute("aria-busy", "false");
      }
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    loadProfile(input.value);
  });

  loadProfile(input.value);
})();
