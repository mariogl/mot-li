import type { OpenMenu } from "../types";

const openMenu = () => {
  const toggleMenu = document.querySelector(".menu__toggle");

  toggleMenu.addEventListener("click", (event) => {
    toggleMenu.classList.toggle("open");
    document.querySelector(".menu__navigation").classList.toggle("opened");
  });
};

export default openMenu;
