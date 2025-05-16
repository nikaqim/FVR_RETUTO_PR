export const SwiperConfig = {
    slidesPerView: 'auto',
    spaceBetween: 0,
    centeredSlides: false,
    observer: true,
    observeParents: true,
    grabCursor: true,
    breakpointsBase: 'container',
    breakpoints: {
        640: {
            slidesPerView: 'auto',
            spaceBetween: 16,
        },
    },
    on: {
        init() {
        }
    },
};;