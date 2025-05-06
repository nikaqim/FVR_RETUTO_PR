export const SwiperConfig = {
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: false,
    observer: true,
    observeParents: true,
    grabCursor: true,
    breakpointsBase: 'window',
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