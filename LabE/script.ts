
type StylesDictionary = { [key: string]: string };

const styles: StylesDictionary = {
    "Styl 1": "Styles/Styl1.css",
    "Styl 2": "Styles/Styl2.css",
    "Styl 3": "Styles/Styl3.css",
};


let currentStyle: string | null = null;

/**
 * @param styleName .
 */
function changeStyle(styleName: string): void {
    const head = document.head;
    const currentLink = document.querySelector("link[rel='stylesheet']");


    if (currentLink) {
        head.removeChild(currentLink);
    }

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = styles[styleName];
    head.appendChild(newLink);

    currentStyle = styleName;
    console.log(`Zmieniono styl na: ${styleName}`);
}


function initializeStyleList(): void {
    const styleLinkContainer = document.querySelector(".style-link");

    if (!styleLinkContainer) {
        console.error("Nie znaleziono kontenera linków stylów!");
        return;
    }

    const ul = document.createElement("ul");

    Object.keys(styles).forEach(styleName => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = styleName;
        link.href = "#";

        link.addEventListener("click", (event) => {
            event.preventDefault();
            changeStyle(styleName);
        });

        li.appendChild(link);
        ul.appendChild(li);
    });

    styleLinkContainer.innerHTML = "";
    styleLinkContainer.appendChild(ul);
}


document.addEventListener("DOMContentLoaded", () => {
    initializeStyleList();
    changeStyle("Styl 1");
});
