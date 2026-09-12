const body = document.body;
const openBtn = document.getElementsByClassName("open-btn")[0];
const settings = document.getElementsByClassName("settings")[0];
const imgList = document.getElementsByClassName("img-list")[0].children;
const credits = document.getElementsByClassName("credits")[0];
const logo = document.getElementsByClassName("logo")[0];

openBtn.addEventListener("click", (e) => {
	settings.classList.add("opened");
	e.stopPropagation();
});

// Keep the menu open if you click inside of it
body.addEventListener("click", (elem) => {
	if (!isInsideSettingsPage(elem.target)) {
	  	settings.classList.remove("opened");
		return;
	}
});

function isInsideSettingsPage(e) {
    while (e && e !== body && e !== document) {
        if (e.classList && e.classList.contains("settings-wrapper")) {
            return true;
        }
        e = e.parentNode;
    }
    return false;
}

Object.keys(imgList).forEach((key) => {
	let img = imgList[key];
	img.addEventListener("click", () => {
		if (img.children[0].classList.contains("active")) {
			deselectImg(img);
			return;
		}
		activateImage(img);
		setImageAsBackground(img.children[0].children[0].src, key);
		if (img.children[1] !== undefined) {
			setCreditsFromImg(img);
		} else {
    		credits.classList.add("hidden");
		}
	})
})

function deselectImg(img) {
	img.children[0].classList.remove("active");
	body.style.backgroundImage = "";
	credits.classList.add("hidden");

	browser.storage.sync.set({index: -1});
}

function activateImage(img) {
    let active = Array.from(document.getElementsByClassName("active"));
    active.forEach((el) => el.classList.remove("active"));

    img.children[0].classList.add("active");
}

function setCreditsFromImg(img) {
	credits.classList.remove("hidden");
	credits.children[1].children[0].textContent = img.children[1].textContent;
	credits.children[1].children[1].textContent = img.children[2].textContent;
	credits.children[1].children[0].href = img.children[1].href;
	credits.children[1].children[1].href = img.children[2].href;
}

function setImageAsBackground(image, key) {
	body.style.backgroundImage = `url(${image})`;

	browser.storage.sync.set({
		index: Number(key)
	});
}

browser.storage.sync.get(["logo", "index"]).then((items) => {
    if (items.logo) {
        logo.classList.add(`logo-${items.logo}`);
    } else {
        logo.classList.add("logo-firefox");
    }

    if (items.index == -1 || items.index == null || !imgList[items.index]) return;

    body.style.backgroundImage = `url(${imgList[items.index].children[0].children[0].src})`;

    activateImageInSettingsMenu(items.index);

	if (imgList[items.index].children[1] !== undefined) {
    	setCredits(items.index);
	}
}).catch((err) => console.error("Failed to load settings:", err));

function activateImageInSettingsMenu(index) {
	if (index == null) return;
	imgList[index].children[0].classList.add("active");
}

function setCredits(index) {
	if (index == null) return;

	credits.classList.remove("hidden");
	credits.children[1].children[0].textContent = imgList[index].children[1].textContent;
	credits.children[1].children[1].textContent = imgList[index].children[2].textContent;
	credits.children[1].children[0].href = imgList[index].children[1].href;
	credits.children[1].children[1].href = imgList[index].children[2].href;
}

let logos = ["firefox", "nightly", "developer"];

function logoSwitch(name) {
	if (!logos.includes(name)) return;

	logos.forEach(e => {
		logo.classList.remove(`logo-${e}`);
	});
	logo.classList.add(`logo-${name}`);
	browser.storage.sync.set({logo: name});
}