export const SwiperConfig = {
    slidesPerView: 'auto',
    // spaceBetween: 16,
    centeredSlides: true,
    observer: true,
    observeParents: true,
    grabCursor: true,
    breakpointsBase: 'container',
    // breakpoints: {
    //     640: {
    //         slidesPerView: 1,
    //     },
    //     1024: {
    //         slidesPerView: 3,
    //     },
    // },
    on: {
        init() {
            // ...
            console.log('Swiper Initialized...');
        }
    },
};;