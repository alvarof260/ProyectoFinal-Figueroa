export function scrollPalace() {
    let target = 0;
    let current = 0;
    let ease = 0.075;

    const slider = document.querySelector(".slider");
    const sliderWrapper = document.querySelector(".slider__wrapper");
    const slides = document.querySelectorAll(".slider__slide");

    let maxScroll = sliderWrapper.offsetWidth - window.innerHeight;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function updateScaleAndPosition() {
        slides.forEach((slide) => {
            const rect = slide.getBoundingClientRect();
            const centerPosition = (rect.left + rect.right) / 2;
            const distanceFromCenter = centerPosition - window.innerWidth / 2;

            let scale, offsetX;
            if (distanceFromCenter > 0) {
                scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
                offsetX = (scale - 1) * 300;
            } else {
                scale = Math.max(
                    0.5,
                    1 - Math.abs(distanceFromCenter) / window.innerWidth
                );
                offsetX = 0;
            }
            gsap.set(slide, { scale: scale, x: offsetX });
        });
    }

    function update() {
        current = lerp(current, target, ease);
        gsap.set(".slider__wrapper", {
            x: -current,
        });
        updateScaleAndPosition();
        requestAnimationFrame(update);
    }
    window.addEventListener("resize", () => {
        maxScroll = sliderWrapper.offsetWidth - window.innerWidth;
    });

    sliderWrapper.addEventListener("wheel", (e) => {
        if (target > 0) {
            e.preventDefault()
        }
        target += e.deltaY;
        target = Math.max(0, target);
        target = Math.min(maxScroll, target);
    });

    update();
}