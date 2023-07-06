import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/saira-extra-condensed/600.css";
import "tiny-editor";
import "../assets/scss/admin.scss";
import "./auth";
import "./gameForm";
import "./gamesList";
import "./loginForm";
import "./wordForm";
import "./words-list";

(() => {
  document.querySelectorAll("a").forEach((link) => {
    const url = new URL(link.href);
    if (url.pathname.startsWith("/admin")) {
      const newUrl =
        url.origin + import.meta.env.BASE_URL + url.pathname.slice(1);
      link.href = newUrl;
    }
  });
})();
