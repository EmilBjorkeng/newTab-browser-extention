openBtn = document.getElementsByClassName("open-btn")[0];
closeBtn = document.getElementsByClassName("close-btn")[0];
settings = document.getElementsByClassName("settings")[0];

openBtn.addEventListener("click", () => {
	settings.classList.add("opened");
});

closeBtn.addEventListener("click", () => {
	settings.classList.remove("opened");
});

imgList = document.getElementsByClassName("img-list")[0].children;

// Loop over all elements (images) in the list and add a even lisener
for (let i = 0; i < imgList.length; i++) {
	imgList[i].addEventListener("click", () => {
		// Deselect image
		if (imgList[i].classList.contains("active")) {
			imgList[i].classList.remove("active");
			document.body.style.backgroundImage = "";
			// Remove stored image
			browser.storage.sync.set({image: ""});
		}
		// Select new image
		else {		// Remove every other active class
			let active = document.getElementsByClassName("active");
			for (let j = 0; j < active.length; j++) {
				active[j].classList.remove("active");
			}
			// add active class to the image
			imgList[i].classList.add("active");
			// Set image as background
			let image = imgList[i].firstChild.src;
			document.body.style.backgroundImage = `url(${image})`;
			// Store choosen image for next time
			browser.storage.sync.set({
				image: image,
				index: i
			});
		}
	})
}

browser.storage.sync.get(["image", "index"], (items) => {
	// Change image to the stored one
	let image = items.image;
	if (image === undefined) image = "";
	document.body.style.backgroundImage = `url(${image})`;
	// Set image in settings menu to active
	let index = items.index;
	if (image != "") {
		imgList[index].classList.add("active");
	}
})