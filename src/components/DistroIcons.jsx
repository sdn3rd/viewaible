// Simplified distro logo SVGs — small colored icons

export function DebianIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#A80030"/>
      <path d="M13.5 4.5c-.8 0-1.2.6-1.1 1.2.3-.3.7-.4 1-.3.4.1.5.5.3.9-.2.3-.6.5-1 .4-.5-.1-.9-.6-.9-1.2 0-.7.5-1.4 1.3-1.4.9 0 1.8.6 2.2 1.4.5 1 .5 2.2 0 3.3-.4.9-1.2 1.7-2 2.1.6-.5 1-1.2 1.1-2 .2-1 0-2.1-.6-2.9-.3-.5-.8-.9-1.3-1.1-.4-.2-.8-.3-1-.4z" fill="white"/>
      <path d="M12.5 7.5c.4.3.6.8.6 1.3 0 .6-.3 1.1-.7 1.4-.5.3-1.1.3-1.5.1-.5-.3-.8-.8-.8-1.4 0-.4.1-.8.4-1.1.3-.3.6-.4 1-.4.4 0 .7.1 1 .1z" fill="white"/>
    </svg>
  );
}

export function RHELIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#EE0000"/>
      <path d="M7 8h4l1.5 3H14l2-3h2l-3 4.5L18 17h-2l-2-3h-1.5L11 17H7l3-4.5z" fill="white"/>
    </svg>
  );
}

export function ArchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#1793D1"/>
      <path d="M12 4L6 20c1.5-1.5 3-2.2 4.5-2.5-.8-1.5-1.5-3.5-1.5-5.5 0-2.5 1-5 3-8 2 3 3 5.5 3 8 0 2-.7 4-1.5 5.5 1.5.3 3 1 4.5 2.5z" fill="white"/>
    </svg>
  );
}

export function AlpineIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#0D597F"/>
      <path d="M12 6l6 10H6z" fill="white"/>
      <path d="M8 10l3 6H5z" fill="white" opacity="0.7"/>
    </svg>
  );
}

export function SUSEIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#73BA25"/>
      <circle cx="10" cy="10" r="2" fill="white"/>
      <circle cx="14" cy="10" r="2" fill="white"/>
      <circle cx="10" cy="10" r="1" fill="#333"/>
      <circle cx="14" cy="10" r="1" fill="#333"/>
      <path d="M9 14c0 0 1.5 2 3 2s3-2 3-2" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function RockyIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#10B981"/>
      <path d="M6 16l6-10 6 10z" fill="white" opacity="0.9"/>
      <path d="M9 16l3-5 3 5z" fill="#10B981"/>
    </svg>
  );
}

export const distroIconMap = {
  debian: DebianIcon,
  rhel: RHELIcon,
  arch: ArchIcon,
  alpine: AlpineIcon,
  suse: SUSEIcon,
};
