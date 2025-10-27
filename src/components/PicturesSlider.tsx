import React, { useState } from 'react';

const images = [
  "boda1.jpg",
  "boda3.jpg",
  "boda5.webp",
  "boda4.webp",
  "boda6.webp",
];

export default function StackedCards() {
  const [cards, setCards] = useState(images);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isResetting, setIsResetting] = useState(false);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== cards.length - 1) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDraggedIndex(index);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggedIndex === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragOffset({
      x: clientX - startPos.x,
      y: clientY - startPos.y
    });
  };

  const handleDragEnd = () => {
    if (draggedIndex === null) return;
    
    const threshold = 100;
    
    if (Math.abs(dragOffset.x) > threshold) {
      // Remover la carta actual
      const newCards = cards.slice(0, -1);
      
      if (newCards.length === 0) {
        // Reiniciar todas las cartas con animación
        setTimeout(() => {
          setIsResetting(true);
          setCards(images);
          setTimeout(() => {
            setIsResetting(false);
          }, 600);
        }, 300);
      } else {
        setCards(newCards);
      }
    }
    
    setDraggedIndex(null);
    setDragOffset({ x: 0, y: 0 });
    setStartPos({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 400;

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100"
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="relative w-80 h-96">
        {cards.map((image, index) => {
          const isTop = index === cards.length - 1;
          const isDragging = draggedIndex === index;
          const scale = 1 - (cards.length - 1 - index) * 0.05;
          const yOffset = (cards.length - 1 - index) * 10;
          
          return (
            <div
              key={`${image}-${index}`}
              className={`absolute inset-0 cursor-grab active:cursor-grabbing select-none ${
                isResetting ? 'animate-[slideIn_0.5s_ease-out]' : ''
              }`}
              style={{
                transform: isDragging
                  ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`
                  : `translateY(-${yOffset}px) scale(${scale})`,
                opacity: isDragging ? opacity : 1,
                transition: isDragging ? 'none' : 'all 0.3s ease-out',
                zIndex: index,
                pointerEvents: isTop ? 'auto' : 'none',
              }}
              onMouseDown={(e) => handleDragStart(e, index)}
              onTouchStart={(e) => handleDragStart(e, index)}
            >
              <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={image}
                  alt={`Boda ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable="false"
                />
              </div>
            </div>
          );
        })}
        
        {cards.length === 0 && !isResetting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Reiniciando...</p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}