export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 680 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="155" y="50" width="370" height="295" rx="18" fill="var(--cd, #111)"/>
      <rect x="170" y="65" width="340" height="265" rx="10" fill="var(--bg, #3a3a3a)"/>
      <g transform="translate(340,197)">
        <path d="M18,0 L17.8,10.3 L11.6,20.1 L0,25.7 L-14.2,24.5 L-26.8,15.5 L-33.5,0 L-31.3,-18 L-19.3,-33.5 L0,-41.3 L21.9,-38 L40.2,-23.2 L49,0 L44.7,25.8 L27.1,46.9 L0,56.7 L-29.7,51.4 L-53.6,31 L-64.5,0 L-58.1,-33.5 L-34.8,-60.3 L0,-72.3 L37.4,-64.8 L67.1,-38.7 L80,0 L66.5,-38.4 L36.8,-63.7 L0,-70.3 L-33.5,-58 L-55.2,-31.9 L-60.5,0 L-49.6,28.6 L-27,46.8 L0,50.7 L23.7,41.1 L38.3,22.1 L41,0 L32.7,-18.9 L17.3,-29.9 L0,-31.3 L-14,-24.2 L-21.5,-12.4 L-21.5,0 L-15.8,9.1 L-7.5,13 L0,11.7 L4.2,7.3 L4.6,2.6 L2,0Z" fill="var(--gold, #D4AF37)"/>
        <circle cx="0" cy="0" r="4" fill="var(--gold, #D4AF37)"/>
      </g>
    </svg>
  );
}
