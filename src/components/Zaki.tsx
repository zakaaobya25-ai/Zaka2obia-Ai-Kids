import React from 'react';
import { IMAGES } from '@/data/content';
interface Props {
  size?: number;
  bubble?: string;
  float?: boolean;
  className?: string;
}
export const Zaka2obia: React.FC<Props> = ({
  size = 80,
  bubble,
  float = true,
  className = ''
}) => {
  return <div className={`flex items-end gap-2 ${className}`}>
      <div className={float ? 'animate-bounce-slow' : ''} style={{
      animationDuration: '3s'
    }}>
        <img src="https://d64gsuwffb70l.cloudfront.net/6a1cb2b88e5284a8095dc073_1780311684054_55cb855f.png" alt="Zaka2obia" style={{
        width: size,
        height: size
      }} className="drop-shadow-[0_8px_20px_rgba(99,102,241,0.45)] select-none" />
      </div>
      {bubble && <div className="relative max-w-[200px] rounded-2xl rounded-bl-none bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-lg">
          {bubble}
        </div>}
    </div>;
};
export default Zaka2obia;