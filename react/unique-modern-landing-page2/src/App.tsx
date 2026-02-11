export function App() {
  // Seed digits: 7,0,9,4,8,2,1,7,0
  const seedDigits = [7, 0, 9, 4, 8, 2, 1, 7, 0];
  
  // Derived design values
  const rotationAngle = seedDigits[0] * 10; // 70deg
  const shapeSize = seedDigits[1] === 0 ? 200 : seedDigits[1] * 30; // 200px
  const primaryColor = `hsl(${seedDigits[2] * 36}, 85%, 55%)`; // 9*36=324
  const secondaryColor = `hsl(${seedDigits[3] * 36}, 75%, 50%)`; // 4*36=144
  const accentColor = `hsl(${seedDigits[4] * 36}, 80%, 60%)`; // 8*36=288
  const bgColor = `hsl(${seedDigits[5] * 36}, 20%, 98%)`; // 2*36=72
  
  // Use derived colors throughout
  const dotColor = `hsl(220, 20%, 90%)`;
  
  return (
          <div 
        className="relative min-h-screen overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
      {/* Background geometric shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Large rotated square */}
        <div 
          className="absolute top-1/4 -left-24 border-4 opacity-20 hidden md:block"
          style={{ 
            transform: `rotate(${rotationAngle}deg)`,
            borderColor: primaryColor,
            width: `${shapeSize}px`,
            height: `${shapeSize}px`
          }}
        ></div>
        {/* Circle */}
        <div 
          className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 opacity-15"
          style={{ borderColor: accentColor }}
        ></div>
        {/* Triangle */}
        <div 
          className="absolute bottom-1/4 left-1/3 w-0 h-0 border-l-[100px] border-r-[100px] border-b-[173px] border-l-transparent border-r-transparent opacity-10 hidden md:block"
          style={{ borderBottomColor: secondaryColor }}
        ></div>
        {/* Small dots grid */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: dotColor,
              left: `${(i * 15) % 100}%`,
              top: `${(i * 7 + seedDigits[i % seedDigits.length] * 10) % 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-16 md:mb-24">
            <div className="text-2xl font-black tracking-tighter text-gray-900">
              NEXUS<span style={{ color: primaryColor }}>.</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              {['Product', 'Features', 'Pricing', 'About'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="font-medium text-gray-700 hover:transition-colors"
                  style={{ 
                    '--hover-color': primaryColor,
                  } as React.CSSProperties}
                >
                  {item}
                </a>
              ))}
            </nav>
            <button 
              className="px-4 py-2 md:px-6 md:py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
            </button>
          </header>

          {/* Hero section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div 
                className="inline-block px-4 py-2 rounded-full font-semibold text-sm"
                style={{ 
                  backgroundColor: `${accentColor}20`,
                  color: accentColor
                }}
              >
                ✨ VERSION 2.0 LAUNCHED
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-tight">
                Build <span style={{ color: primaryColor }}>striking</span> digital experiences
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                A modern platform for creating unique, bold, and visually captivating web interfaces. No gradients, just pure impact.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  className="px-6 py-3 md:px-8 md:py-4 text-white font-bold rounded-xl transition-colors shadow-lg"
                  style={{ 
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 15px -3px ${primaryColor}30`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `hsl(${seedDigits[2] * 36}, 85%, 45%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  Start Free Trial
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:border-gray-400 transition-colors">
                  <span className="flex items-center gap-2">
                    <i className="fas fa-play-circle"></i>
                    Watch Demo
                  </span>
                </button>
              </div>
              <div className="pt-8 flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Free 14-day trial</span>
                </div>
              </div>
            </div>
            
            {/* Hero visual */}
            <div className="relative">
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                {/* Mockup browser window */}
                <div className="mb-6 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 text-center font-medium text-gray-500">demo.nexus.dev</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map((i) => (
                    <div 
                      key={i}
                      className="h-16 md:h-24 rounded-xl"
                      style={{ 
                        backgroundColor: i % 3 === 0 ? primaryColor : i % 3 === 1 ? accentColor : secondaryColor,
                        opacity: 0.7 + (i * 0.05)
                      }}
                    ></div>
                  ))}
                </div>
                <div className="mt-6 h-4 w-3/4 rounded-full bg-gray-200"></div>
                <div className="mt-2 h-4 w-1/2 rounded-full bg-gray-200"></div>
              </div>
              
              {/* Floating elements */}
              <div 
                className="absolute -top-6 -right-6 w-20 h-20 md:w-32 md:h-32 rounded-full opacity-20 animate-pulse-slow"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div 
                className="absolute -bottom-6 -left-6 w-24 h-24 md:w-40 md:h-40 border-4 opacity-10 rounded-3xl"
                style={{ borderColor: primaryColor }}
              ></div>
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Users', color: primaryColor },
              { value: '99.9%', label: 'Uptime', color: accentColor },
              { value: '256', label: 'Components', color: secondaryColor },
              { value: '24/7', label: 'Support', color: `hsl(40,80%,50%)` },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="mt-2 text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="mt-32">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">
              Designed for <span style={{ color: primaryColor }}>impact</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '✨', title: 'Bold Visuals', desc: 'Striking color palettes and geometric shapes that capture attention.' },
                { icon: '📱', title: 'Mobile First', desc: 'Optimized for all screen sizes with responsive layouts.' },
                { icon: '⚡', title: 'Lightning Fast', desc: 'Built with performance in mind, zero bloat.' },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="p-8 bg-white rounded-2xl border border-gray-100 hover:transition-all hover:shadow-lg"
                  style={{ 
                    '--hover-border-color': `${primaryColor}30`,
                  } as React.CSSProperties}
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-32 text-center bg-gradient-to-r from-white to-gray-50 rounded-3xl p-12 border border-gray-200">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to create something unique?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">Join thousands of designers and developers building cutting-edge interfaces with Nexus.</p>
            <button className="px-10 py-5 bg-gray-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-colors shadow-2xl">
              Get Started For Free
            </button>
            <p className="mt-6 text-gray-500">No setup • 14-day free trial • Cancel anytime</p>
          </div>

          {/* Footer */}
          <footer className="mt-24 pt-8 border-t border-gray-200 text-gray-500 text-center">
            <p>© 2025 Nexus. All rights reserved. | <a href="#" className="underline">Privacy Policy</a> • <a href="#" className="underline">Terms</a></p>
            <div className="mt-4 flex justify-center gap-6 text-2xl">
              <i className="fab fa-twitter hover:cursor-pointer" style={{ '--hover-color': primaryColor } as React.CSSProperties}></i>
              <i className="fab fa-github hover:cursor-pointer" style={{ '--hover-color': primaryColor } as React.CSSProperties}></i>
              <i className="fab fa-dribbble hover:cursor-pointer" style={{ '--hover-color': primaryColor } as React.CSSProperties}></i>
              <i className="fab fa-figma hover:cursor-pointer" style={{ '--hover-color': primaryColor } as React.CSSProperties}></i>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}