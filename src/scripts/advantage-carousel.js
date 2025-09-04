// Simple Advantage carousel: 1 slide visible, options as anchors, next button only, no auto/infinite.
document.addEventListener('DOMContentLoaded', function () {
	const section = document.querySelector('.advantage');
	if (!section) return;

	const options = Array.from(
		section.querySelectorAll('.advantage-options .advantage-option')
	);
	const nextBtn = section.querySelector('.advantage-button-prev'); // used as "next"

	const slideEl = section.querySelector('.advantage-carousel .splide__slide');
	if (!slideEl) return;

	const imgEl = slideEl.querySelector('img');
	const titleEl = slideEl.querySelector('aside h2');
	const descEl = slideEl.querySelector('.advantage-carousel-item-description');
	const progressBar = section.querySelector(
		'.my-slider-progress .my-slider-progress-bar'
	);

	// Build data from the existing content and option labels (keeps your layout/content style)
	const defaultImage = imgEl?.getAttribute('src') || '';
	const defaultDescription = (descEl?.textContent || '').trim();
		const slides = options.map((opt) => {
			const dataImg = opt.getAttribute('data-image');
			const dataDesc = opt.getAttribute('data-description');
			return {
				title: (opt.textContent || '').trim(),
				image: dataImg || defaultImage,
				description: (dataDesc || defaultDescription).trim(),
			};
		});

			let current = 0;

	function setActiveOption(idx) {
		options.forEach((opt, i) => opt.classList.toggle('active', i === idx));
	}

	function updateProgress(idx) {
		if (!progressBar) return;
		const total = Math.max(slides.length, 1);
		const percent = ((idx + 1) / total) * 100;
		progressBar.style.width = percent + '%';
	}

	function updateNextBtn(idx) {
		if (!nextBtn) return;
		const isLast = idx >= slides.length - 1;
		nextBtn.disabled = isLast;
		nextBtn.setAttribute('aria-disabled', String(isLast));
	}

		function swapTo(idx) {
			const data = slides[idx];
			if (imgEl && data.image) imgEl.src = data.image;
			if (titleEl) titleEl.textContent = data.title;
			if (descEl) descEl.textContent = data.description;
			setActiveOption(idx);
			updateProgress(idx);
			updateNextBtn(idx);
		}

				function render(idx) {
					swapTo(idx);
				}

	// Option clicks act as anchors to a specific "slide"
	options.forEach((opt, idx) => {
				opt.addEventListener('click', () => {
			if (idx === current) return;
			current = idx;
					render(current);
		});
	});

	// Next button goes forward only (no infinite loop)
	if (nextBtn) {
				nextBtn.addEventListener('click', () => {
			if (current >= slides.length - 1) return; // stop at the last
			current += 1;
					render(current);
		});
	}

	// Init state
	if (options.length) {
		current = 0;
		render(current);
	}
});

