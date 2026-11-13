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

document.querySelector(".play-button").addEventListener("click", () => {
  const button = document.querySelector(".play-button");
  button.textContent = button.textContent === "▶" ? "Ⅱ" : "▶";
  document.querySelector(".video-controls small").textContent = button.textContent === "Ⅱ" ? "Playing demo" : "0:18";
});