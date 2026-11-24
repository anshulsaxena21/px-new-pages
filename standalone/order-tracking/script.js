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


/* ParcelX Instagram gallery — fetch the four latest public posts and render square cards. */
(() => {
  const section = document.querySelector('[data-section="communityInstagram"]');
  const grid = document.querySelector("#instagramPostGrid");
  const handleLink = document.querySelector("#instagramHandleLink");
  if (!section || !grid) return;

  const username = "parcelx.in";
  const supabaseUrl = "https://ovdxipfxychotaspfccl.supabase.co";
  const supabasePublishableKey = "sb_publishable_VQdW48kuUKdUigExZZnwDA_SuEa5Qce";
  const feedEndpoint = supabaseUrl + "/functions/v1/instagram-feed";

  if (handleLink) {
    handleLink.textContent = "@parcelX";
    handleLink.href = "https://www.instagram.com/" + username + "/";
    handleLink.hidden = false;
  }

  const setMessage = (message, state = "idle") => {
    grid.replaceChildren();
    const note = document.createElement("p");
    note.className = "instagram-feed-message";
    note.dataset.state = state;
    note.textContent = message;
    grid.append(note);
    grid.setAttribute("aria-busy", "false");
  };

  const renderPosts = (posts) => {
    grid.replaceChildren();
    grid.classList.remove("instagram-profile-mode");

    const items = Array.isArray(posts) ? posts.slice(0, 4) : [];
    items.forEach((post) => {
      const permalink = typeof post.permalink === "string" &&
        post.permalink.startsWith("https://www.instagram.com/")
        ? post.permalink
        : "https://www.instagram.com/" + username + "/";

      const card = document.createElement("article");
      card.className = "instagram-post-card";

      const link = document.createElement("a");
      link.className = "instagram-post-media";
      link.href = permalink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Open Instagram post from @parcelX");

      const imageUrl = typeof post.mediaUrl === "string" && /^https:\/\//i.test(post.mediaUrl)
        ? post.mediaUrl
        : "";

      if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = post.caption ? String(post.caption).slice(0, 140) : "Instagram post from @parcelX";
        image.loading = "lazy";
        image.decoding = "async";
        link.append(image);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "instagram-post-fallback";
        fallback.textContent = "View post on Instagram";
        link.append(fallback);
      }

      const openIcon = document.createElement("span");
      openIcon.className = "instagram-post-open";
      openIcon.setAttribute("aria-hidden", "true");
      openIcon.textContent = "↗";
      link.append(openIcon);
      card.append(link);
      grid.append(card);
    });

    if (!items.length) {
      setMessage("Instagram posts are temporarily unavailable. Visit @parcelX on Instagram.", "fallback");
    } else {
      grid.setAttribute("aria-busy", "false");
    }
  };

  const loadFeed = async () => {
    grid.setAttribute("aria-busy", "true");
    setMessage("Loading Instagram posts…", "loading");

    try {
      const endpoint = new URL(feedEndpoint);
      endpoint.searchParams.set("username", username);

      const response = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json", apikey: supabasePublishableKey },
        credentials: "omit"
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        setMessage(result.message || "Instagram posts could not be loaded. Please try again later.", "error");
        return;
      }

      renderPosts(result.posts);
    } catch {
      setMessage("We couldn't connect to Instagram right now. Please try again later.", "error");
    }
  };

  loadFeed();
})();
