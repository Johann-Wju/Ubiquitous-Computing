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
    // Clear previous model
    modelContainer.innerHTML = "";

    const model = document.createElement("a-gltf-model");
    model.setAttribute("src", modelPaths[index]);
    model.setAttribute("position", "0 0 0");
    model.setAttribute("scale", "2 2 2");
    model.setAttribute("rotation", "0 0 0");

    modelContainer.appendChild(model);
  }

  loadModel(currentIndex); // Initial model

  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");

  let cooldown = false;
  let nextSeenTime = null;
  let prevSeenTime = null;

  function switchScene(direction) {
    if (cooldown) return;

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
