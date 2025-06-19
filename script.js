document.addEventListener("DOMContentLoaded", () => {
  // Collect all scenes by ID pattern "scene" + number (e.g. scene1, scene2, ...)
  const scenes = [];
  let i = 1;
  while (true) {
    const scene = document.querySelector(`#scene${i}`);
    if (!scene) break;
    scenes.push(scene);
    i++;
  }

  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");

  let currentScene = 1;
  let cooldown = false;

  let nextSeenTime = null;
  let prevSeenTime = null;

  function switchScene(direction) {
    if (cooldown) return;

    // Hide current scene
    scenes[currentScene - 1].setAttribute("visible", false);

    if (direction === "next") {
      currentScene = currentScene === scenes.length ? 1 : currentScene + 1;
    } else if (direction === "prev") {
      currentScene = currentScene === 1 ? scenes.length : currentScene - 1;
    }

    // Show new scene
    scenes[currentScene - 1].setAttribute("visible", true);

    // Cooldown to prevent rapid switching
    cooldown = true;
    setTimeout(() => cooldown = false, 1000);
  }

  nextMarker.addEventListener("markerFound", () => {
    nextSeenTime = Date.now();
  });

  nextMarker.addEventListener("markerLost", () => {
    const heldTime = Date.now() - nextSeenTime;
    if (heldTime > 500) {
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
