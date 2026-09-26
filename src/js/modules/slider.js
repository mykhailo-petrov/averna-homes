import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

function getClasses(block) {
	return {
		wrapperClass: `${block}__wrapper`,
		slideClass: `${block}__slide`,
		slideActiveClass: `${block}__slide--active`,
		slideNextClass: `${block}__slide--next`,
		slidePrevClass: `${block}__slide--prev`,
		slideVisibleClass: `${block}__slide--visible`,
		slideFullyVisibleClass: `${block}__slide--fully-visible`,
		slideBlankClass: `${block}__slide--blank`,
		containerModifierClass: `${block}--`,
	};
}

const defaults = {
	modules: [Autoplay, Navigation, Pagination],
	observer: true,
	observeParents: true,
	slidesPerView: 'auto',
	spaceBetween: 30,
	speed: 300,
};

const sliders = {
	slider: {
		slidesPerView: 1,
		spaceBetween: 20,
		speed: 300,
		grabCursor: true,

		loop: true,

		breakpoints: {
			320: {
				slidesPerView: 1.1,
				spaceBetween: 12,
			},
			480: {
				slidesPerView: 1.2,
				spaceBetween: 16,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
		},
	},
	available: {
		loop: true,
		grabCursor: true,
		breakpoints: {
			320: {
				slidesPerView: 1.1,
				spaceBetween: 12,
			},
			480: {
				slidesPerView: 1.2,
				spaceBetween: 16,
			},
			768: {
				slidesPerView: 'auto',
				spaceBetween: 30,
			},
		},
	},
	reviews: {
		loop: true,
		grabCursor: true,
		slidesPerView: 1,
		spaceBetween: 0,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
	},
};

function createSlider(slider) {
	if (slider.swiper) return slider.swiper;

	const name = slider.dataset.slider || 'slider';
	const block = name === 'slider' ? 'slider' : `${name}-slider`;

	return new Swiper(slider, {
		...getClasses(block),
		...defaults,
		...sliders[name],
		navigation: {
			prevEl: slider.querySelector('[data-slider-prev]'),
			nextEl: slider.querySelector('[data-slider-next]'),
			disabledClass: `${block}__arrow--disabled`,
			hiddenClass: `${block}__arrow--hidden`,
			lockClass: `${block}__arrow--lock`,
			navigationDisabledClass: `${block}--navigation-disabled`,
		},
		pagination: {
			el: slider.querySelector('[data-slider-pagination]'),
			clickable: true,
			bulletClass: `${block}-pagination__bullet`,
			bulletActiveClass: `${block}-pagination__bullet--active`,
			clickableClass: `${block}-pagination--clickable`,
			lockClass: `${block}-pagination--lock`,
			hiddenClass: `${block}-pagination--hidden`,
			modifierClass: `${block}-pagination--`,
			paginationDisabledClass: `${block}-pagination--pagination-disabled`,
		},
	});
}

export function initSlider(name) {
	return [...document.querySelectorAll(`[data-slider="${name}"]`)].map(createSlider);
}

export function initSliders() {
	return [...document.querySelectorAll('[data-slider]')].map(createSlider);
}
