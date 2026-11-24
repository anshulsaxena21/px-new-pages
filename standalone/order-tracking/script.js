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


/* Merchant-specific Instagram feed.
   ParcelX injects PARCELX_TRACKING_CONFIG for the current merchant at render time.
   No Instagram access token is ever sent to the browser. */
(() => {
  const section = document.querySelector("#communityInstagram");
  const grid = document.querySelector("#instagramPostGrid");
  const message = document.querySelector("#instagramFeedMessage");
  const handleLink = document.querySelector("#instagramHandleLink");
  const followLink = document.querySelector("#instagramFollowLink");
  if (!section || !grid || !message || !followLink) return;

  const config = window.PARCELX_TRACKING_CONFIG || {};
  const storeKey = String(config.instagramStoreKey || "").trim();
  const feedEndpoint = String(config.instagramFeedEndpoint || "").trim();

  const setMessage = (text, state = "idle") => {
    grid.replaceChildren();
    const note = document.createElement("p");
    note.className = "instagram-feed-message";
    note.dataset.state = state;
    note.textContent = text;
    grid.append(note);
    grid.setAttribute("aria-busy", "false");
  };

  const safeUsername = (value) => {
    const username = String(value || "").trim().replace(/^@/, "");
    return /^[A-Za-z0-9._]{1,30}$/.test(username) ? username : "";
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date);
  };

  const renderPosts = (posts, username) => {
    grid.replaceChildren();
    const validPosts = Array.isArray(posts) ? posts.slice(0, 4) : [];
    validPosts.forEach((post) => {
      const permalink = typeof post.permalink === "string" && post.permalink.startsWith("https://www.instagram.com/")
        ? post.permalink
        : `https://www.instagram.com/${encodeURIComponent(username)}/`;

      const card = document.createElement("article");
      card.className = "instagram-post-card";
      const link = document.createElement("a");
      link.className = "instagram-post-media";
      link.href = permalink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Open Instagram post from @${username}`);

      const imageUrl = typeof post.mediaUrl === "string" && /^https:\/\//i.test(post.mediaUrl)
        ? post.mediaUrl : "";
      if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = post.caption ? String(post.caption).slice(0, 140) : `Instagram post from @${username}`;
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

      const meta = document.createElement("div");
      meta.className = "instagram-post-meta";
      const date = formatDate(post.timestamp);
      if (date) {
        const dateLabel = document.createElement("span");
        dateLabel.textContent = date;
        meta.append(dateLabel);
      }
      if (post.mediaType) {
        const typeLabel = document.createElement("span");
        typeLabel.textContent = post.mediaType === "VIDEO" ? "Reel / video" : post.mediaType === "CAROUSEL_ALBUM" ? "Carousel" : "Post";
        meta.append(typeLabel);
      }
      card.append(meta);
      grid.append(card);
    });

    if (!validPosts.length) {
      setMessage("This account's posts aren't available for automatic display. You can still visit its Instagram profile.", "fallback");
    } else {
      grid.setAttribute("aria-busy", "false");
    }
  };

  const loadFeed = async () => {
    if (!storeKey || !feedEndpoint) {
      setMessage("Instagram posts will appear here once this store's account is configured.");
      return;
    }

    let endpoint;
    try {
      endpoint = new URL(feedEndpoint, window.location.href);
      endpoint.searchParams.set("storeKey", storeKey);
    } catch {
      setMessage("Instagram feed is not configured correctly.", "error");
      return;
    }

    grid.setAttribute("aria-busy", "true");
    setMessage("Loading the latest Instagram posts…", "loading");
    grid.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "omit"
      });
      if (!response.ok) throw new Error("Instagram feed request failed");
      const result = await response.json();
      const username = safeUsername(result.username);

      if (username) {
        const profileUrl = `https://www.instagram.com/${encodeURIComponent(username)}/`;
        handleLink.textContent = `@${username}`;
        handleLink.href = profileUrl;
        handleLink.hidden = false;
        followLink.href = profileUrl;
        followLink.hidden = false;
      }

      if (!result.ok || !username) {
        setMessage("Instagram posts will appear here once this store's account is configured.", "fallback");
        return;
      }
      renderPosts(result.posts, username);
    } catch {
      setMessage("We couldn't load Instagram posts right now. Please try again later.", "error");
    }
  };

  loadFeed();
})();
