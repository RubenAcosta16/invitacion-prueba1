import { useState } from 'react';

export default function ImageStackSlider() {
  const images = [
    "boda1.jpg",
    "boda3.jpg",
    "boda5.webp",
    "boda4.webp",
    "boda6.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY });
    setDragCurrent({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (dragStart) {
      setDragCurrent({ x: clientX, y: clientY });
    }
  };

  const handleEnd = () => {
    if (dragStart && dragCurrent) {
      const diffX = dragCurrent.x - dragStart.x;
      const threshold = 80;

      if (Math.abs(diffX) > threshold) {
        // Cualquier dirección = avanzar a la siguiente (la de abajo)
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }
    
    setDragStart(null);
    setDragCurrent(null);
    setIsDragging(false);
  };

  const getDragTransform = () => {
    if (!dragStart || !dragCurrent) return { x: 0, y: 0 };
    return {
      x: dragCurrent.x - dragStart.x,
      y: dragCurrent.y - dragStart.y
    };
  };

  const getRotation = () => {
    const { x } = getDragTransform();
    return x * 0.05;
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % images.length;
      visible.push({ src: images[index], offset: i });
    }
    return visible;
  };

  const getRandomOffset = (offset: number, seed: number) => {
    // Genera desplazamientos "aleatorios" pero consistentes
    const x = (seed * 7 + offset * 13) % 9 - 4;
    const rotation = (seed * 5 + offset * 11) % 7 - 3;
    return { x: x * 3, rotation: rotation * 1.5 };
  };

  return (
    <div className="pt-20 pb-16 bg-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-[3/4]">
        {getVisibleImages().map(({ src, offset }) => {
          const isTop = offset === 0;
          const translateY = offset * 12;
          const scale = 1 - offset * 0.05;
          const opacity = 1 - offset * 0.3;
          const drag = isTop && isDragging ? getDragTransform() : { x: 0, y: 0 };
          const baseRotation = isTop && isDragging ? getRotation() : 0;
          
          // Agregar desplazamiento "aleatorio" para cartas de abajo
          const randomOffset = !isTop ? getRandomOffset(offset, currentIndex) : { x: 0, rotation: 0 };
          const rotation = baseRotation + randomOffset.rotation;

          return (
            <div
              key={`${src}-${offset}`}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{
                transform: `
                  translateX(${drag.x + randomOffset.x}px) 
                  translateY(${translateY + drag.y}px) 
                  scale(${scale}) 
                  rotate(${rotation}deg)
                `,
                zIndex: 10 - offset,
                opacity: opacity,
                transition: isDragging && isTop ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: isTop ? 'auto' : 'none'
              }}
              onMouseDown={(e) => isTop && handleStart(e.clientX, e.clientY)}
              onMouseMove={(e) => isTop && handleMove(e.clientX, e.clientY)}
              onMouseUp={() => isTop && handleEnd()}
              onMouseLeave={() => isTop && handleEnd()}
              onTouchStart={(e) => isTop && handleStart(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => isTop && handleMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={() => isTop && handleEnd()}
            >
              <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-white border-[12px] border-white">
                <img 
                  src={src} 
                  alt={`Imagen ${offset + 1}`}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>
            </div>
          );
        })}

        {/* Indicadores */}
        {/* <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-gray-800 w-8' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}