export const SwiperConfig = {
    slidesPerView: 4,
    spaceBetween: 16,
    centeredSlides: true,
    observer: true,
    observeParents: true,
    grabCursor: true,
    breakpointsBase: 'container',
    breakpoints: {
        640: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
    on: {
        init() {
            // ...
            console.log('Swiper Initialized...');
        }
    },
};;