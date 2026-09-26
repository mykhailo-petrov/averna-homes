export function setExclusiveActiveItem(curTarget, itemsRef, activeClass) {
	const activeItem = itemsRef.find((item) => item.classList.contains(activeClass));
	if (curTarget.classList.contains(activeClass)) return;
	if (!activeItem) curTarget.classList.add(activeClass);
	else {
		activeItem.classList.remove(activeClass);
		curTarget.classList.add(activeClass);
	}
}
