const body = document.body;
const openBtn = document.getElementsByClassName('open-btn')[0];
const settings = document.getElementsByClassName('settings')[0];
const imgList = document.getElementsByClassName('img-list')[0].children;
const credits = document.getElementsByClassName('credits')[0];

openBtn.addEventListener('click', () => {
	settings.classList.add('opened');
});

// Keep the menu open if you click inside of it
body.addEventListener('click', (elem) => {
	if (isInsideSettingsPage(elem.target)) {
	  	settings.classList.add('opened');
		return;
	}
	settings.classList.remove('opened');
});

function isInsideSettingsPage(e) {
	while (e !== body) {
		if (e.classList.contains('settings-wrapper')) {
			return true;
		}
		e = e.parentNode;
	}
	return false;
}

// Selecting images
Object.keys(imgList).forEach((key) => {
	let img = imgList[key];
	img.addEventListener('click', () => {
		if (img.children[0].classList.contains('active')) {
			deselectImg(img);
			return;
		}
		activateImage(img);
		if (img.children[1] !== undefined) {
			selectImg(img, key);
			return;
		}
		selectCustomImg(key);
	})
})

function deselectImg(img) {
	// Remove background, active class and credits
	img.children[0].classList.remove('active');
	body.style.backgroundImage = "";
	credits.classList.add('hidden');

	// Remove image from synced and local storage
	browser.storage.sync.set({image: ""});
	browser.storage.local.set({image: ""});
}

function activateImage(img) {
	// Remove every other active class
	let active = document.getElementsByClassName('active');
	for (let j = 0; j < active.length; j++) {
		active[j].classList.remove('active');
	}
	// add active class to the image
	img.children[0].classList.add('active');
}

function selectImg(img, key) {
	// Set credits
	credits.classList.remove('hidden');
	credits.children[1].children[0].textContent = img.children[1].textContent;
	credits.children[1].children[1].textContent = img.children[2].textContent;
	credits.children[1].children[0].href = img.children[1].href;
	credits.children[1].children[1].href = img.children[2].href;

	// Set image as background
	let image = img.children[0].children[0].src;
	setImageAsBackground(image, key);
}

function selectCustomImg(key) {
	// Remove credits
	credits.classList.add('hidden');

	// Choose image
	let input = document.createElement('input');
	input.accept = "image/*";
	input.type = 'file';
	input.click();

	// When image is choosen
	input.onchange = e => {
		let file = e.target.files[0];
		var reader = new FileReader();
		// Convert file to bites
		reader.onload = function(e){
			let image = e.target.result;
			setImageAsBackground(image, key);
		}
		reader.readAsDataURL(file);
	}
}

function setImageAsBackground(image, key) {
	body.style.backgroundImage = `url(${image})`;

	if (key == imgList.length-1) {
		// Local storage (for uploaded images)
		browser.storage.local.set({
			image: image,
			index: key
		});
		// Set the key in the synced storage so it knows to not activate
		browser.storage.sync.set({index: Object.keys(imgList).indexOf(key)});
		return;
	}

	// Synced storage
	browser.storage.sync.set({
		image: image,
		index: Object.keys(imgList).indexOf(key)
	});
	// Set the key in the local storage so it knows to not activate
	browser.storage.local.set({index: Object.keys(imgList).indexOf(key)});
}

// Get image from the synced storage
browser.storage.sync.get(['image', 'index'], (items) => {
	if (items.index == imgList.length-1) return;

	let image = items.image || "";
	body.style.backgroundImage = `url(${image})`;
	activateImageInSettingsMenu(items.index);
	setCredits(items.index)
});

// Get image from the local storage
browser.storage.local.get(['image', 'index'], (items) => {
	if (items.index != imgList.length-1) return;

	let image = items.image || "";
	body.style.backgroundImage = `url(${image})`;
	activateImageInSettingsMenu(items.index);
});

function activateImageInSettingsMenu(index) {
	if (index == null) return;
	imgList[index].children[0].classList.add('active');
}

function setCredits(index) {
	if (index == null) return;

	// Set credits
	credits.classList.remove('hidden');
	credits.children[1].children[0].textContent = imgList[index].children[1].textContent;
	credits.children[1].children[1].textContent = imgList[index].children[2].textContent;
	credits.children[1].children[0].href = imgList[index].children[1].href;
	credits.children[1].children[1].href = imgList[index].children[2].href;
}