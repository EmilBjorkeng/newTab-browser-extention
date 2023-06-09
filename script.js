const body = document.body;
const openBtn = document.getElementsByClassName('open-btn')[0];
const settings = document.getElementsByClassName('settings')[0];
const imgList = document.getElementsByClassName('img-list')[0].children;
const credits = document.getElementsByClassName('credits')[0];

openBtn.addEventListener('click', () => {
	settings.classList.add('opened');
});

// Open and close the setting menu based on where you click
body.addEventListener('click', (elem) => {
	// If you are clicking outside the settings menu then close it
	if (!isInsideSettingsPage(elem.target)) {
	  	settings.classList.remove('opened');
	}

	// If you are clicking inside the settings menu then make it stay open 
	// (important for when using the focus to make the menu open)
	// Also check if its activated on a button because then we know it was the keyboard that did it
	else {
	  	if (!elem.target.closest('.close-btn') && elem.target.tagName != "BUTTON") {
			settings.classList.add('opened');
		}
	}
});

function isInsideSettingsPage(elem) {
	let e = elem;
	while (e != body) {
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
			deselectImg(img)
		}
		else {
			selectImg(img, key)
		}
	})
})

function selectImg(img, key) {
	// Remove every other active class
	let active = document.getElementsByClassName('active');
	for (let j = 0; j < active.length; j++) {
		active[j].classList.remove('active');
	}
	// add active class to the image
	img.children[0].classList.add('active');

	// Set image as background
	let image = img.children[0].children[0].src;
	body.style.backgroundImage = `url(${image})`;

	// Set credits
	credits.classList.remove('hidden');
	credits.children[1].children[0].textContent = img.children[1].textContent;
	credits.children[1].children[1].textContent = img.children[2].textContent;
	credits.children[1].children[0].href = img.children[1].href;
	credits.children[1].children[1].href = img.children[2].href;

	// Store choosen image for next time
	browser.storage.sync.set({
		image: image,
		index: Object.keys(imgList).indexOf(key)
	});
}

function deselectImg(img) {
	img.children[0].classList.remove('active');
	body.style.backgroundImage = "";
	credits.classList.add('hidden');

	// Remove stored image
	browser.storage.sync.set({image: ""});
}

// Get image from storage
browser.storage.sync.get(['image', 'index'], (items) => {
	// Set the background image and activate the image in the settings menu
	let image = items.image || "";
	setBackgroundImage(image);
	activateImageInSettingsMenu(items.index);
	setCredits(items.index)
});

function setBackgroundImage(image) {
	body.style.backgroundImage = `url(${image})`;
}
  
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