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
const MAX_ROTATION = 12; // 🚀 AUMENTADO: Máxima rotación aleatoria (antes 6)
const MAX_OFFSET = 20; // 🚀 AUMENTADO: Máximo desplazamiento aleatorio en px (antes 12)

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

export default function PhotoDeckSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("right");
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

      // El factor de posición suaviza el desorden para las cartas más abajo
      const positionFactor = 1 - i * 0.1;

      stack.push({
        id: cardImageIndex,
        src: images[cardImageIndex],
        isTopCard: isTopCard,
        // Aplicamos la transformación fija y el factor de posición
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
                border-8 border-white  // 🎨 NUEVO: Borde blanco de 4px
                ${
                  card.isTopCard
                    ? "shadow-2xl cursor-grab active:cursor-grabbing"
                    : "shadow-md pointer-events-none"
                }
              `}
              style={{ zIndex: card.zIndex }}
              initial={{
                x: card.isTopCard ? cardStack[1]?.x || 0 : card.x,
                y: card.isTopCard ? cardStack[1]?.y || 0 : card.y,
                rotate: card.isTopCard
                  ? cardStack[1]?.rotate || 0
                  : card.rotate,
                scale: card.isTopCard ? cardStack[1]?.scale || 0.9 : card.scale,
                opacity: card.isTopCard
                  ? cardStack[1]?.opacity || 0.9
                  : card.opacity,
              }}
              animate={{
                x: card.x,
                y: card.y,
                rotate: card.rotate,
                scale: card.scale,
                opacity: card.opacity,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={
                card.isTopCard
                  ? {
                      x: direction === "right" ? 400 : -400,
                      rotate: direction === "right" ? 25 : -25,
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.3 },
                    }
                  : undefined
              }
              drag={card.isTopCard ? "x" : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -threshold) changeImage("left");
                else if (info.offset.x > threshold) changeImage("right");
              }}
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
