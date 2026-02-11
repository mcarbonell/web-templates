import "./index.css";

export function App() {
  // Decompose seed 709482170 for deterministic design choices
  // We'll break it into chunks: 70, 94, 82, 17, 0
  // Use these values to drive colors, positions, sizes etc.

  // Color palette derived from seed chunks (mapped to hex values without gradients)
  const primaryColor = "#FF5A5F";  // 70 maps to vibrant coral
  const secondaryColor = "#0A0A0A"; // Dark background
  const accentColor = "#FFE066";    // 94 maps to vibrant yellow accent
  const highlightColor = "#17C3B2"; // 82 maps to teal highlight

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: secondaryColor,
        color: "#FFFFFF",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Main Hero Container - Striking layout with geometric shapes */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Unique geometric background elements */}
        <div 
          className="absolute -top-20 -left-10 w-40 h-40 rounded-full opacity-20"
          style={{ backgroundColor: accentColor }}
        />
        <div 
          className="absolute -bottom-16 -right-12 w-56 h-56 rounded-3xl opacity-15"
          style={{ backgroundColor: highlightColor }}
        />
        
        {/* Novel asymmetric header container */}
        <div 
          className="relative z-10 w-full mb-8 py-6 border-b-2"
          style={{ 
            borderColor: primaryColor,
            width: "calc(100% + 4rem)",
            marginLeft: "-2rem",
          }}
        >
          <h1 
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
            style={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: "#FFFFFF",
              textShadow: `0 0 20px ${primaryColor}40`,
              letterSpacing: "-0.05em",
            }}
          >
            BOLD
            <span 
              className="block mt-2"
              style={{ color: accentColor }}
            >
              VISION
            </span>
          </h1>
        </div>

        {/* Hero description */}
        <p 
          className="relative z-10 text-xl md:text-2xl mb-12 max-w-3xl leading-relaxed font-semibold"
          style={{ 
            color: "#EEEEEE",
            lineHeight: "1.6",
          }}
        >
          Experience design redefined through intentional asymmetry and striking contrasts.
        </p>

        {/* Unique CTA button with sharp edges */}
        <button
          className="relative z-10 px-10 py-5 font-bold text-xl 
                     transition-all duration-300 transform hover:scale-105"
          style={{
            backgroundColor: primaryColor,
            color: secondaryColor,
            fontFamily: "'Montserrat', sans-serif",
            border: `3px solid ${accentColor}`,
            borderRadius: 0,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            boxShadow: `8px 8px 0 ${accentColor}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `12px 12px 0 ${highlightColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `8px 8px 0 ${accentColor}`;
          }}
        >
          Explore
        </button>

        {/* Novel geometric footer element */}
        <div 
          className="absolute -bottom-20 left-1/4 w-24 h-24 rotate-45"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute -top-10 right-1/4 w-16 h-16 rotate-12"
          style={{ backgroundColor: highlightColor }}
        />
      </div>
    </div>
  );
}