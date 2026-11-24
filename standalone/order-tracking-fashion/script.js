const modeConfig = {
  waybill: { placeholder: "Enter your waybill number", value: "989687675" },
  order: { placeholder: "Enter your order ID", value: "" },
  mobile: { placeholder: "Enter your mobile number", value: "" }
};
const tabs = document.querySelectorAll(".tab");
const input = document.getElementById("trackInput");
const note = document.getElementById("formNote");
let currentMode = "waybill";

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentMode = tab.dataset.mode;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    input.placeholder = modeConfig[currentMode].placeholder;
    input.value = modeConfig[currentMode].value;
    note.textContent = "Enter your " + (currentMode === "waybill" ? "waybill number" : currentMode === "order" ? "order ID" : "mobile number") + " to find your shipment.";
    input.focus();
  });
});

document.getElementById("trackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    note.textContent = "Please enter " + modeConfig[currentMode].placeholder.toLowerCase() + ".";
    input.focus();
    return;
  }
  note.textContent = "Showing the latest available tracking details for " + value + ".";
  document.getElementById("trackingDetails").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector(".play-button").addEventListener("click", () => {
  document.querySelector(".video-banner").classList.toggle("video-playing");
  const button = document.querySelector(".play-button");
  button.textContent = button.textContent === "▶" ? "Ⅱ" : "▶";
  document.querySelector(".video-caption").textContent = button.textContent === "Ⅱ" ? "Discover the collection" : "THE SOULED STORE";
});