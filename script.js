document.addEventListener("DOMContentLoaded", () => {
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

  let currentIndex = 0;
  const modelContainer = document.querySelector("#modelContainer");

  function loadModel(index) {
    modelContainer.innerHTML = "";

    const model = document.createElement("a-gltf-model");
    const modelData = modelPaths[index];
    model.setAttribute("id", "activeModel");
    model.setAttribute("src", modelData.src);
    model.setAttribute("position", modelData.position);
    model.setAttribute("scale", modelData.scale);
    model.setAttribute("rotation", modelData.rotation);

    modelContainer.appendChild(model);

    const recipeImage = document.querySelector("#recipeImage");
    if (recipeImage && modelData.recipe) {
      recipeImage.setAttribute("src", modelData.recipe);
    }

  }

  loadModel(currentIndex);

  const nextMarker = document.querySelector("#nextMarker");
  const prevMarker = document.querySelector("#prevMarker");
  const musicMarker = document.querySelector("#musicMarker");
  const musicPlayer = document.querySelector("#musicPlayer");
  const stopMarker = document.querySelector("#stopMarker");

  let cooldown = false;
  let musicCooldown = false;
  let musicPlaying = false;

  let nextSeenTime = null;
  let prevSeenTime = null;

  let frozen = false;
  let stopSeenTime = null;
  let stopValid = false;
  let stopVisibilityCheckTimeout = null;

  function switchScene(direction) {
    if (cooldown || frozen) return;

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

  musicMarker.addEventListener("markerFound", () => {
    console.log("Music marker found");
    if (musicCooldown) return;

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

  stopMarker.addEventListener("markerFound", () => {
    console.log("STOP marker found");

    stopSeenTime = Date.now();
    stopValid = false;

    // Begin timer to validate marker visibility after 1 second
    stopVisibilityCheckTimeout = setTimeout(() => {
      stopValid = true;
      console.log("STOP marker held long enough to be considered valid.");
    }, 1000); // adjust to 1500 or 2000ms if needed
  });

  stopMarker.addEventListener("markerLost", () => {
    console.log("STOP marker lost");

    // Cancel the validation timer in case it's still running
    clearTimeout(stopVisibilityCheckTimeout);

    if (!stopSeenTime || !stopValid) {
      console.log("STOP marker not held long enough. Ignoring.");
      stopSeenTime = null;
      stopValid = false;
      return;
    }

    // Marker was valid, toggle freeze
    frozen = !frozen;
    console.log(`Freeze state is now: ${frozen}`);

    // Reset
    stopSeenTime = null;
    stopValid = false;
  });
});
