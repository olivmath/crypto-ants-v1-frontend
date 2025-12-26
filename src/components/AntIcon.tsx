export function AntIcon({ color }: { color: string }) {
    return (
      <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 150" 
        style={{ width: "100%", height: "100%" }}
      >
        {/* Background for accessibility (contrast with pastel colors) */}
        <circle cx="50" cy="75" r="70" fill="#2c3e50" />
        
        <g id="ant-whole">
          {/* Limbs: stroke=color, fill=none */}
          <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M48,65 C40,55 25,50 15,55"/> 
              <path d="M48,75 C35,75 20,80 10,85"/> 
              <path d="M48,85 C40,100 25,115 15,120"/> 
              <path d="M52,65 C60,55 75,50 85,55"/>
              <path d="M52,75 C65,75 80,80 90,85"/>
              <path d="M52,85 C60,100 75,115 85,120"/>
          </g>
  
          {/* Antenna: stroke=color, fill=none */}
          <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
              <path d="M43,30 Q30,10 20,18"/>
              <path d="M57,30 Q70,10 80,18"/>
          </g>
  
          {/* Body: fill=color, stroke=none */}
          <g fill={color} stroke="none">
              <circle cx="50" cy="35" r="15"/>
              <ellipse cx="50" cy="72" rx="12" ry="18"/>
              <ellipse cx="50" cy="115" rx="20" ry="28"/>
          </g>
        </g>
      </svg>
    );
  }
  
  export function getPastelColor(id: bigint): string {
      // Deterministic random color based on ID
      const numId = Number(id);
      // Use a prime number to scramble hues
      const hue = (numId * 137) % 360; 
      // Pastel: High Lightness (70-90%), Medium-High Saturation (60-90%)
      const saturation = 70 + (numId % 20); // 70-90%
      const lightness = 75 + (numId % 15);  // 75-90%
      
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }