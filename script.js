document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector("#toggleBtn");
  const box = document.querySelector("#box1");
  const sphere = document.querySelector("#sphere1");

  btn.addEventListener("click", () => {
    const isBoxVisible = box.getAttribute("visible");
    box.setAttribute("visible", !isBoxVisible);
    sphere.setAttribute("visible", isBoxVisible);
  });
});