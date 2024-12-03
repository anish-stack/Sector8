import React from 'react'
import { SearchBar } from './Seacrch'
import { ImageSlider } from './ImageSlider'
import Marquee from './Marquee'

const Hero = () => {
    return (
        <>
            <div className="relative min-h-[500px] lg:min-h-[400px] w-full overflow-hidden">
                {/* Background Image */}
                <ImageSlider />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full">
                    <div className="flex flex-col items-center justify-center h-[500px] text-center gap-8 py-20">



                        <SearchBar />


                    </div>
                </div>
            </div>
            <Marquee />
        </>
    )
}

export default Hero
