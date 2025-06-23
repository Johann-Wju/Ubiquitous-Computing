// Wait for DOM content to be fully loaded before running script
document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------
  // Model Data Definitions
  // ------------------------------
  const modelPaths = [
    {
      src: "models/pizza_gltf/scene.gltf",
      scale: "3 3 3",
      position: "0.3 0 -2",
      rotation: "0 0 0",
      recipe: "recipes/Recipe_Pizza.jpg"
    },
    {
      src: "models/chicken_paprika_gltf/scene.gltf",
      scale: "3.5 3.5 3.5",
      position: "0 0 0",
      rotation: "0 0 0",
      recipe: "recipes/Recipe_Paprikahuhn.jpg"
    },
    {
      src: "models/best_spring_sandwitch_gltf/scene.gltf",
      scale: "8 8 8",
      position: "0 0 0",
      rotation: "0 0 0",
      recipe: "recipes/Recipe_Sandwich.jpg"
    },
    {
      src: "models/french_mini_baguette_on_a_cutting_board_gltf/scene.gltf",
      scale: "1.75 1.75 1.75",
      position: "0 -2 1",
      rotation: "0 0 0",
      recipe: "recipes/Recipe_Baguette.jpg"
    },
    {
      src: "models/langos_without_topping_gltf/scene.gltf",
      scale: "1.5 1.5 1.5",
      position: "0 0 0",
      rotation: "0 0 0",
      recipe: "recipes/Recipe_Langos.jpg"
    }
  ];

  // ------------------------------
  // DOM & State Setup
  // ------------------------------
  let currentIndex = 0;
  let cooldown = false;
  let musicCooldown = false;
  let musicPlaying = false;
  let frozen = false;

  let nextSeenTime = null;
  let prevSeenTime = null;
  let stopSeenTime = null;
  let stopValid = false;
  let stopVisibilityCheckTimeout = null;

  const modelContainer = document.querySelector("#modelContainer");
  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");
  const musicMarker = document.querySelector("#musicMarker");
  const musicPlayer = document.querySelector("#musicPlayer");
  const stopMarker = document.querySelector("#stopMarker");

  // ------------------------------
  // Model Loader
  // ------------------------------
  function loadModel(index) {
    modelContainer.innerHTML = ""; // Clear previous model

    const model = document.createElement("a-gltf-model");
    const modelData = modelPaths[index];

    model.setAttribute("id", "activeModel");
    model.setAttribute("src", modelData.src);
    model.setAttribute("position", modelData.position);
    model.setAttribute("scale", modelData.scale);
    model.setAttribute("rotation", modelData.rotation);

    modelContainer.appendChild(model);

    // Update recipe image
    const recipeImage = document.querySelector("#recipeImage");
    if (recipeImage && modelData.recipe) {
      recipeImage.setAttribute("src", modelData.recipe);
    }
  }

  // Load initial model
  loadModel(currentIndex);

  // ------------------------------
  // Scene Switch Logic
  // ------------------------------
  function switchScene(direction) {
    if (cooldown || frozen) return;

    if (direction === "next") {
      currentIndex = (currentIndex + 1) % modelPaths.length;
    } else if (direction === "prev") {
      currentIndex = (currentIndex - 1 + modelPaths.length) % modelPaths.length;
    }

    loadModel(currentIndex);

    cooldown = true;
    setTimeout(() => cooldown = false, 1000); // Prevent rapid switching
  }

  // ------------------------------
  // Next Marker Events
  // ------------------------------
  nextMarker.addEventListener("markerFound", () => {
    console.log("Next marker found");
    nextSeenTime = Date.now();
  });

  nextMarker.addEventListener("markerLost", () => {
    console.log("Next marker lost");
    if (!nextSeenTime) return;
    const heldTime = Date.now() - nextSeenTime;
    if (heldTime > 500) {
      switchScene("next");
    }
    nextSeenTime = null;
  });

  // ------------------------------
  // Previous Marker Events
  // ------------------------------
  prevMarker.addEventListener("markerFound", () => {
    console.log("Prev marker found");
    prevSeenTime = Date.now();
  });

  prevMarker.addEventListener("markerLost", () => {
    console.log("Prev marker lost");
    if (!prevSeenTime) return;
    const heldTime = Date.now() - prevSeenTime;
    if (heldTime > 500) {
      switchScene("prev");
    }
    prevSeenTime = null;
  });

  // ------------------------------
  // Music Marker Events
  // ------------------------------
  musicMarker.addEventListener("markerFound", () => {
    console.log("Music marker found");
    if (musicCooldown) return;

    musicCooldown = true;
    setTimeout(() => musicCooldown = false, 1000); // Prevent spamming

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

  // ------------------------------
  // STOP Marker (Freeze State)
  // ------------------------------
  stopMarker.addEventListener("markerFound", () => {
    console.log("STOP marker found");

    stopSeenTime = Date.now();
    stopValid = false;

    // Begin validation timer (hold >1s)
    stopVisibilityCheckTimeout = setTimeout(() => {
      stopValid = true;
      console.log("STOP marker held long enough to be considered valid.");
    }, 1000); // You can tweak this to 1500–2000ms
  });

  stopMarker.addEventListener("markerLost", () => {
    console.log("STOP marker lost");

    clearTimeout(stopVisibilityCheckTimeout); // Cancel validation timer if early

    if (!stopSeenTime || !stopValid) {
      console.log("STOP marker not held long enough. Ignoring.");
      stopSeenTime = null;
      stopValid = false;
      return;
    }

    // Marker held long enough — toggle frozen state
    frozen = !frozen;
    console.log(`Freeze state is now: ${frozen}`);

    // Reset state
    stopSeenTime = null;
    stopValid = false;
  });

});
