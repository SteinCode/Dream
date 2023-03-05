import Dashboard from "./views/Dashboard.js";
import Tasks from "./views/Tasks.js";
import Profile from "./views/Profile.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: Dashboard },
    { path: "/tasks", view: Tasks },
    { path: "/profile", view: Profile },
  ];

  //test each root for petential match

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const view = new match.route.view();

  document.querySelector("#app").innerHTML = await view.getHtml();

  // console.log(match.route.view());
};

window.addEventListener("popstate", router); //KOL KAS, NES NODE.JS SITAS NEPATINKA

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.matches("[data-link]")) {
      event.preventDefault();
      navigateTo(event.target.href);
    } else if (event.target.closest(".sidebar-nav a[data-link]")) {
      event.preventDefault();
      navigateTo(event.target.closest(".sidebar-nav a[data-link]").href);
    }
  });

  router();
});


