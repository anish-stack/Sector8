import { Globe } from 'lucide-react';

export function AboutHero() {
  return (
    <div
      className="relative h-full md:h-[500px] bg-cover bg-center rounded-xl overflow-hidden mb-16"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069")'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90" />
      <div className="relative h-full md:flex mx-auto  justify-between px-8 sm:px-16 md:max-w-7xl">
        <div className='flex flex-col justify-center'>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 font-semibold tracking-wider">NAIDEAL.COM</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Empowering Businesses Across India
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            India's leading online platform helping businesses grow, connect, and thrive in the digital world.
            Founded by <span className="font-semibold">Mr. Rajeev Dhingra</span>, we're committed to bridging
            the gap between businesses and their customers.
          </p>
        </div>

        <div className='flex flex-col justify-center'>
          <img className='w-full h-full object-cover object-bottom' src="https://i.ibb.co/gy8JMWG/sir-pic-2-removebg-preview.png" alt="" />
        </div>
      </div>

    </div>
  );
}