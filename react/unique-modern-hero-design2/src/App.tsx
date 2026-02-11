import { cn } from './utils/cn';

function App() {
  return (
    <div className={cn(
      "min-h-screen bg-black text-white flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 lg:p-16 gap-12 lg:gap-24 max-w-7xl mx-auto"
    )}>
      <div className={cn(
        "w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem]",
        "flex-shrink-0 mx-auto lg:mx-0 relative"
      )}>
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="175" stroke="currentColor" strokeWidth="1" 
            className="opacity-30 animate-slow-spin drop-shadow-[0_0_12px_currentColor] origin-center" 
          />
          <circle cx="215" cy="190" r="155" stroke="currentColor" strokeWidth="1.5" 
            className="opacity-50 animate-slow-spin-reverse drop-shadow-[0_0_16px_currentColor] origin-center" 
          />
          <circle cx="185" cy="210" r="130" stroke="currentColor" strokeWidth="2" 
            className="opacity-70 animate-slow-spin drop-shadow-[0_0_20px_currentColor] origin-center" 
          />
          <circle cx="225" cy="185" r="100" stroke="currentColor" strokeWidth="2.5" 
            className="opacity-85 animate-slow-spin-reverse animate-float drop-shadow-[0_0_24px_currentColor] origin-center" 
          />
          <circle cx="170" cy="220" r="85" stroke="currentColor" strokeWidth="3" 
            className="animate-slow-spin drop-shadow-[0_0_28px_currentColor] origin-center" 
          />
        </svg>
      </div>
      <div className={cn(
        "max-w-lg lg:max-w-xl space-y-6 lg:space-y-8 text-center lg:text-left px-4 lg:px-0 flex-1"
      )}>
        <div className="space-y-4 lg:space-y-6">
          <h1 className="font-black uppercase leading-[0.85] drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] text-[clamp(4rem,15vw,9rem)] tracking-[-0.075em]">
            <span className="inline-block -mr-[0.12em] animate-float [animation-delay:0s] drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">N</span>
            <span className="inline-block -mr-[0.12em] animate-float [animation-delay:0.25s] drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">O</span>
            <span className="inline-block -mr-[0.12em] animate-float [animation-delay:0.5s] drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]">V</span>
            <span className="inline-block animate-float [animation-delay:0.75s] drop-shadow-[0_0_35px_rgba(6,182,212,1)]">A</span>
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide opacity-90">
            Redefine <span className="font-semibold drop-shadow-[0_0_15px_rgba(6,182,212,0.7)]">Tomorrow</span>
          </p>
          <p className="text-lg md:text-xl opacity-70 leading-relaxed">
            Experience a novel, striking design like no other. Modern, unique, mobile-first impact.
          </p>
        </div>
        <button className="bg-white text-black px-8 py-6 md:px-12 md:py-7 text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider rounded-none shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-0 inline-block hover:scale-[1.02] active:scale-[0.98]">
          Launch Now
        </button>
      </div>
    </div>
  );
}

export { App };
