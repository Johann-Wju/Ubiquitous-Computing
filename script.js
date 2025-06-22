document.addEventListener("DOMContentLoaded", () => {
  const modelPaths = [
    "models/pizza_gltf/scene.gltf",
    "models/chicken_paprika_gltf/scene.gltf",
    "models/best_spring_sandwitch_gltf/scene.gltf",
    "models/french_mini_baguette_on_a_cutting_board_gltf/scene.gltf",
    "models/langos_without_topping_gltf/scene.gltf"
  ];

  let currentIndex = 0;
  const modelContainer = document.querySelector("#modelContainer");

  function loadModel(index) {
    modelContainer.innerHTML = "";

    const model = document.createElement("a-gltf-model");
    model.setAttribute("id", "activeModel");
    model.setAttribute("src", modelPaths[index]);
    model.setAttribute("position", "0 0 0");
    model.setAttribute("scale", "2 2 2");
    model.setAttribute("rotation", "0 0 0");

    modelContainer.appendChild(model);
  }

  loadModel(currentIndex);

  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");
  const musicMarker = document.querySelector("#musicMarker");
  const musicPlayer = document.querySelector("#musicPlayer");

  let cooldown = false;
  let musicCooldown = false;
  let musicPlaying = false;

  let nextSeenTime = null;
  let prevSeenTime = null;

  // 🔴🔒 Blocking state
  let blockActive = false;
  const stopMarker = document.querySelector("#stopMarker");
  const stopIndicator = document.querySelector("#stopIndicator");

  stopMarker.addEventListener("markerFound", () => {
    blockActive = true;
    stopIndicator.setAttribute("color", "red");
  });

  stopMarker.addEventListener("markerLost", () => {
    blockActive = false;
    stopIndicator.setAttribute("color", "green");
  });

  function switchScene(direction) {
    if (cooldown || blockActive) return;

    if (direction === "next") {
      currentIndex = (currentIndex + 1) % modelPaths.length;
    } else if (direction === "prev") {
      currentIndex = (currentIndex - 1 + modelPaths.length) % modelPaths.length;
    }

    loadModel(currentIndex);

    cooldown = true;
    setTimeout(() => cooldown = false, 1000);
  }

  nextMarker.addEventListener("markerFound", () => {
    if (blockActive) return;
    nextSeenTime = Date.now();
  });

  nextMarker.addEventListener("markerLost", () => {
    if (blockActive || !nextSeenTime) return;
    const heldTime = Date.now() - nextSeenTime;
    if (heldTime > 500) {
      switchScene("next");
    }
    nextSeenTime = null;
  });

  prevMarker.addEventListener("markerFound", () => {
    if (blockActive) return;
    prevSeenTime = Date.now();
  });

  prevMarker.addEventListener("markerLost", () => {
    if (blockActive || !prevSeenTime) return;
    const heldTime = Date.now() - prevSeenTime;
    if (heldTime > 500) {
      switchScene("prev");
    }
    prevSeenTime = null;
  });

  musicMarker.addEventListener("markerFound", () => {
    if (blockActive || musicCooldown) return;

    musicCooldown = true;
    setTimeout(() => musicCooldown = false, 1000);

    if (musicPlaying) {
      if (musicPlayer.components.sound) {
        musicPlayer.components.sound.stopSound();
      }
      musicPlaying = false;
    } else {
      if (musicPlayer.components.sound) {
        musicPlayer.components.sound.playSound();
      }
      musicPlaying = true;
    }
  });
});
