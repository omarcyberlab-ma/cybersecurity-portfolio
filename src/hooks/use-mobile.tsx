import { useEffect, useState } from 'react';

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(()=>{
    const m = window.matchMedia('(max-width: 768px)');
    setIsMobile(m.matches);
    const h = () => setIsMobile(m.matches);
    m.addEventListener('change', h);
    return ()=> m.removeEventListener('change', h);
  }, []);
  return isMobile;
}
