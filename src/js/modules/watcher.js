function parseParams(value) {
	const [rawThreshold = '', rawRootMargin = '', rawOnce = ''] = value
		.split(',')
		.map((part) => part.trim());
	const threshold = rawThreshold === '' ? 0 : Number(rawThreshold);

	if (Number.isNaN(threshold) || threshold < 0 || threshold > 1) {
		throw new Error(`threshold должен быть числом от 0 до 1, получено "${rawThreshold}"`);
	}

	return {
		threshold,
		rootMargin: rawRootMargin || '0px',
		once: rawOnce === 'once',
	};
}

export function initWatcher() {
	const observers = new Map();

	document.querySelectorAll('[data-watcher]').forEach((element) => {
		try {
			const { threshold, rootMargin, once } = parseParams(element.dataset.watcher);
			const key = `${threshold}|${rootMargin}|${once}`;

			if (!observers.has(key)) {
				const observer = new IntersectionObserver(
					(records) => {
						records.forEach((record) => {
							record.target.classList.toggle('_watcher', record.isIntersecting);

							if (record.isIntersecting)
								record.target.dispatchEvent(new CustomEvent('watcher:enter'));

							if (once && record.isIntersecting) observer.unobserve(record.target);
						});
					},
					{ threshold, rootMargin }
				);

				observers.set(key, observer);
			}

			observers.get(key).observe(element);
		} catch (error) {
			console.warn('[watcher] Неверный data-watcher:', element, error.message);
		}
	});
}
