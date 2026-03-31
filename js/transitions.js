const NAV_ORDER = ["index.html", "games.html", "programs.html", "about.html"];

function getPageName(path) {
    const cleaned = path.split("/").pop() || "index.html";
    return cleaned === "" ? "index.html" : cleaned;
}

function getStoredTransition() {
    return sessionStorage.getItem("pageTransition");
}

function setStoredTransition(value) {
    sessionStorage.setItem("pageTransition", value);
}

function clearStoredTransition() {
    sessionStorage.removeItem("pageTransition");
}

function applyEntryTransition() {
    const transition = getStoredTransition();

    if (transition === "from-right") {
        document.body.classList.add("page-enter-from-right");
    } else if (transition === "from-left") {
        document.body.classList.add("page-enter-from-left");
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.remove("page-enter-from-right", "page-enter-from-left");
        });
    });

    clearStoredTransition();
}

function getNavDirection(currentHref, targetHref) {
    const currentPage = getPageName(currentHref);
    const targetPage = getPageName(targetHref);

    const currentIndex = NAV_ORDER.indexOf(currentPage);
    const targetIndex = NAV_ORDER.indexOf(targetPage);

    if (currentIndex === -1 || targetIndex === -1) {
        return null;
    }

    if (targetIndex > currentIndex) {
        return "left";
    }

    if (targetIndex < currentIndex) {
        return "right";
    }

    return null;
}

function handleNavTransitions() {
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#")) return;

            event.preventDefault();

            const direction = getNavDirection(window.location.pathname, href);

            if (direction === "left") {
                setStoredTransition("from-right");
                document.body.classList.add("page-exit-to-left");
            } else if (direction === "right") {
                setStoredTransition("from-left");
                document.body.classList.add("page-exit-to-right");
            } else {
                window.location.href = href;
                return;
            }

            setTimeout(() => {
                window.location.href = href;
            }, 380);
        });
    });
}

function handleCardTransitions() {
    const cardLinks = document.querySelectorAll(".card-link");
    const overlay = document.querySelector(".page-transition");

    if (!overlay) return;

    cardLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#")) return;

            event.preventDefault();

            link.classList.add("is-clicked");
            overlay.classList.add("is-active");

            setTimeout(() => {
                window.location.href = href;
            }, 360);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyEntryTransition();
    handleNavTransitions();
    handleCardTransitions();
});