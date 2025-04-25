export const SwiperConfig = {
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    observer: true,
    observeParents: true,
    grabCursor: true,
    breakpointsBase: 'container',
    breakpoints: {
        640: {
            slidesPerView: 'auto',
            spaceBetween: 16,
        }
    },
    on: {
        init() {
        }
    },
};;