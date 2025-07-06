import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Media imports
import video1 from "../assets/video.mp4";
import video2 from "../assets/video (2).mp4";
import video3 from "../assets/video (3).mp4";

import image1 from "../assets/hero/image (1).jpg";
import image2 from "../assets/hero/image (2).jpg";
import image3 from "../assets/hero/image (3).jpg";
import image4 from "../assets/hero/image (4).jpg";
import image5 from "../assets/hero/image (5).jpg";
import image6 from "../assets/hero/image (6).jpg";
import image7 from "../assets/hero/image (7).jpg";
import image8 from "../assets/hero/image (8).jpg";
import image9 from "../assets/hero/image (9).jpg";
import image10 from "../assets/hero/image (10).jpg";

const heroData = [
    { id: 1, title: "spring edit", subtitle: "our best sellers", cta: "Shop now", image: image8, type: "image" },
    { id: 2, title: "influencer picks", subtitle: "trending now", cta: "Explore", image: video1, type: "video" },
    { id: 3, title: "earth conscious", subtitle: "eco-friendly fits", cta: "Shop green", image: image10, type: "image" },
    { id: 4, title: "limited drop", subtitle: "48 hours only", cta: "Grab Fast", image: video2, type: "video" },
    { id: 5, title: "festival edit", subtitle: "vibrant & bold", cta: "Discover now", image: image3, type: "image" },
    { id: 6, title: "summer Trends", subtitle: "up to 60% off", cta: "Don't Miss", image: video3, type: "video" },
    { id: 7, title: "Classic Wear", subtitle: "minimalist classics", cta: "View Collection", image: image6, type: "image" },
    { id: 8, title: "Techwear drop", subtitle: "function meets fashion", cta: "Gear Up", image: video1, type: "video" },
    { id: 9, title: "vintage vibes", subtitle: "retro-inspired fits", cta: "Shop Vintage", image: image5, type: "image" },
    { id: 10, title: "back to campus", subtitle: "new arrivals for you", cta: "Get Ready", image: video2, type: "video" },
];

const Hero = () => {
    const subtitleRefs = useRef([]);
    const titleRefs = useRef([]);
    const ctaRefs = useRef([]);

    useEffect(() => {
        animateLines(0);
    }, []);

    const animateLines = (index) => {
        gsap.fromTo(
            [subtitleRefs.current[index], titleRefs.current[index], ctaRefs.current[index]],
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.2,
            }
        );
    };

    const handleSlideChange = (swiper) => {
        animateLines(swiper.realIndex);
    };

    return (
        <Swiper
            loop={true}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            onSlideChange={handleSlideChange}
            modules={[Autoplay]}
            className="w-full"
        >
            {heroData.map((item, index) => (
                <SwiperSlide key={item.id}>
                    <div className={`flex flex-col sm:flex-row ${index % 2 !== 0 ? "sm:flex-row-reverse" : ""}`}>
                        {/* Text Section */}
                        <div
                            className={`w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 
             ${index === 0
                                    ? "bg-gradient-to-r from-[#fff4e6] to-[#ffe8cc]"
                                    : index === 1
                                        ? "bg-gradient-to-r from-[#e6f7ff] to-[#ccf2ff]"
                                        : index === 2
                                            ? "bg-gradient-to-r from-[#f0f9eb] to-[#d9f2d9]"
                                            : index === 3
                                                ? "bg-gradient-to-r from-[#fff0f6] to-[#ffe0ec]"
                                                : index === 4
                                                    ? "bg-gradient-to-r from-[#e6ffe6] to-[#ccffcc]"
                                                    : index === 5
                                                        ? "bg-gradient-to-r from-[#f0f0ff] to-[#d9d9ff]"
                                                        : index === 6
                                                            ? "bg-gradient-to-r from-[#fff5e6] to-[#ffebcc]"
                                                            : index === 7
                                                                ? "bg-gradient-to-r from-[#e6e6ff] to-[#ccccff]"
                                                                : index === 8
                                                                    ? "bg-gradient-to-r from-[#fff0f6] to-[#ffd6e8]"
                                                                    : "bg-gradient-to-r from-[#f5f9f2] to-[#e0f2e9]"}
`}
                        >
                            <div className="text-[#414141] px-6 sm:px-12 space-y-4">
                                {/* Subtitle */}
                                <div
                                    ref={(el) => (subtitleRefs.current[index] = el)}
                                    className="flex items-center gap-2"
                                >
                                    <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                                    <p className="font-medium text-sm md:text-base uppercase">{item.subtitle}</p>
                                </div>

                                {/* Title */}
                                <h1
                                    ref={(el) => (titleRefs.current[index] = el)}
                                    className="uppercase text-3xl lg:text-5xl leading-relaxed prata-regular"
                                >
                                    {item.title}
                                </h1>

                                {/* CTA */}
                                <div
                                    ref={(el) => (ctaRefs.current[index] = el)}
                                    className="flex items-center gap-2"
                                >
                                    <p className="font-semibold text-sm md:text-base uppercase">{item.cta}</p>
                                    <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                                </div>
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="w-full sm:w-1/2 h-[300px] sm:h-[400px] md:h-[700px] lg:h-[600px] xl:h-[530px]">
                            {item.type === "image" ? (
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover"
                                    alt={item.title}
                                />
                            ) : (
                                <video
                                    src={item.image}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            )}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Hero;
