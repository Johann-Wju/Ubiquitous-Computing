document.addEventListener("DOMContentLoaded", () => {
  const scene1 = document.querySelector("#scene1");
  const scene2 = document.querySelector("#scene2");

  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");

  let currentScene = 1;
  let cooldown = false;

  let nextSeenTime = null;
  let prevSeenTime = null;

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

    // Add cooldown to prevent rapid switching
    cooldown = true;
    setTimeout(() => cooldown = false, 1000);
  }

  nextMarker.addEventListener("markerFound", () => {
    nextSeenTime = Date.now();
  });

  nextMarker.addEventListener("markerLost", () => {
    const heldTime = Date.now() - nextSeenTime;
    if (heldTime > 500) {  // Only switch if held at least 500ms
      switchScene("next");
    }
  });

  prevMarker.addEventListener("markerFound", () => {
    prevSeenTime = Date.now();
  });

  prevMarker.addEventListener("markerLost", () => {
    const heldTime = Date.now() - prevSeenTime;
    if (heldTime > 500) {
      switchScene("prev");
    }
  });
});