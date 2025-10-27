import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Add interfaces/types at the top of the file
interface CardTransform {
  x: number;
  y: number;
  rotate: number;
}

const images = [
  "boda1.jpg",
  "boda3.jpg",
  "boda5.webp",
  "boda4.webp",
  "boda6.webp",
];

const CARD_STACK_SIZE = 4; // Número de cartas visibles en la pila
const MAX_ROTATION = 12; 
const MAX_OFFSET = 20; 

// Generamos y almacenamos las transformaciones estáticas una sola vez
const initialCardTransforms: CardTransform[] = images.map(() => ({
  x: (Math.random() - 0.5) * MAX_OFFSET,
  y: (Math.random() - 0.5) * MAX_OFFSET,
  rotate: (Math.random() - 0.5) * MAX_ROTATION,
}));

// Funciones de utilidad (sin cambios)
const getNextIndex = (i: number, total: number): number => (i + 1) % total;
const getPrevIndex = (i: number, total: number): number =>
  (i - 1 + total) % total;

// ⚡ OPTIMIZACIÓN CLAVE: Usamos la propiedad CSS 'will-change'
// Esto le dice al navegador que esperamos animar estas propiedades,
// permitiéndole optimizar la GPU por adelantado.
const willChangeStyle = { willChange: "transform, opacity" };

export default function PhotoDeckSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right"); // Tipado explícito
  const threshold = 100;

  const changeImage = (dir: "left" | "right"): void => {
    setDirection(dir);
    setTimeout(() => {
      if (dir === "right") {
        setIndex((prev) => getNextIndex(prev, images.length));
      } else {
        setIndex((prev) => getPrevIndex(prev, images.length));
      }
    }, 300);
  };

  const cardStack = useMemo(() => {
    const stack = [];
    for (let i = 0; i < CARD_STACK_SIZE; i++) {
      const cardImageIndex = getNextIndex(index + i, images.length);
      const isTopCard = i === 0;
      const baseTransform = initialCardTransforms[cardImageIndex];
      const positionFactor = 1 - i * 0.1;

      stack.push({
        id: cardImageIndex,
        src: images[cardImageIndex],
        isTopCard: isTopCard,
        x: baseTransform.x * positionFactor,
        y: baseTransform.y * positionFactor,
        rotate: baseTransform.rotate * positionFactor,
        scale: 1 - i * 0.05,
        opacity: 1 - i * 0.05,
        zIndex: CARD_STACK_SIZE - i,
      });
    }
    return stack;
  }, [index]);

  return (
    <div className="flex justify-center items-center h-[420px] rounded-lg shadow-inner">
      <div className="relative w-64 h-64 select-none">
        <AnimatePresence initial={false}>
          {cardStack.map((card) => (
            <motion.div
              key={card.id}
              className={`
                absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden
                border-8 border-white
                ${
                  card.isTopCard
                    ? "shadow-2xl cursor-grab active:cursor-grabbing"
                    : "shadow-md pointer-events-none"
                }
              `}
                // ⚡ OPTIMIZACIÓN: Se añaden estilos de will-change
              style={{ zIndex: card.zIndex, ...willChangeStyle }} 
              initial={
                // OPTIMIZACIÓN: Usar `transform` 3D para una mejor aceleración
                card.isTopCard 
                  ? {
                      opacity: cardStack[1]?.opacity || 0.9,
                      transform: `
                        translateX(${cardStack[1]?.x || 0}px)
                        translateY(${cardStack[1]?.y || 0}px)
                        rotate(${cardStack[1]?.rotate || 0}deg)
                        scale(${cardStack[1]?.scale || 0.9})
                      `,
                    }
                  : {
                      opacity: card.opacity,
                      transform: `
                        translateX(${card.x}px)
                        translateY(${card.y}px)
                        rotate(${card.rotate}deg)
                        scale(${card.scale})
                      `,
                    }
                }
              animate={{
                // OPTIMIZACIÓN: Animamos solo `transform` y `opacity`
                opacity: card.opacity,
                transform: `
                  translateX(${card.x}px)
                  translateY(${card.y}px)
                  rotate(${card.rotate}deg)
                  scale(${card.scale})
                `,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={
                card.isTopCard
                  ? {
                        // Usamos transform 3D en el exit
                      transform: direction === "right" 
                            ? `translateX(400px) rotate(25deg) scale(0.8)` 
                            : `translateX(-400px) rotate(-25deg) scale(0.8)`,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    }
                  : undefined
              }
              drag={card.isTopCard ? "x" : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={
                // ... (sin cambios)
                (_, info) => {
                if (info.offset.x < -threshold) changeImage("left");
                else if (info.offset.x > threshold) changeImage("right");
              }
            }
              whileDrag={
                card.isTopCard
                  ? {
                      scale: 1.05,
                      rotate: (Math.random() - 0.5) * 10,
                    }
                  : undefined
              }
            >
              <img
                src={card.src}
                alt={`photo-${card.id}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}