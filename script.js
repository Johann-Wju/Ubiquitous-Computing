document.addEventListener("DOMContentLoaded", () => {
  const scene1 = document.querySelector("#scene1");
  const scene2 = document.querySelector("#scene2");

  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");

  let currentScene = 1;
  let cooldown = false;

  function switchScene(direction) {
    if (cooldown) return;

    if (direction === "next" && currentScene === 1) {
      scene1.setAttribute("visible", false);
      scene2.setAttribute("visible", true);
      currentScene = 2;
    } else if (direction === "prev" && currentScene === 2) {
      scene2.setAttribute("visible", false);
      scene1.setAttribute("visible", true);
      currentScene = 1;
    }

    // Prevent rapid switching
    cooldown = true;
    setTimeout(() => cooldown = false, 1000);
  }

  nextMarker.addEventListener("markerLost", () => {
    switchScene("next");
  });

  prevMarker.addEventListener("markerLost", () => {
    switchScene("prev");
  });
});