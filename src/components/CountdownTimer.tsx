import React, { useState, useEffect } from "react";

// Define la fecha y hora objetivo: 21 de noviembre de 2025 a las 13:00 (1:00 PM)
const TARGET_DATE = new Date("2025-11-21T13:00:00");

// Función de utilidad para formatear la diferencia de tiempo
const formatTime = (timeInMs) => {
  if (timeInMs <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };

  const totalSeconds = Math.floor(timeInMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return { days, hours, minutes, seconds, isFinished: false };
};

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState(
    TARGET_DATE.getTime() - new Date().getTime()
  );

  useEffect(() => {
    // 1. Configura el intervalo que se ejecuta cada 1000 ms (1 segundo)
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;

      // 2. Actualiza el estado con la diferencia de tiempo
      setTimeRemaining(difference);

      // 3. Limpia el intervalo si el tiempo ha terminado
      if (difference <= 0) {
        clearInterval(intervalId);
      }
    }, 1000); // Se actualiza cada segundo

    // 4. Función de limpieza: se ejecuta cuando el componente se desmonta o el efecto se re-ejecuta
    return () => clearInterval(intervalId);
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  const time = formatTime(timeRemaining);

  return (
    <div className="text-center py-6 bg-blue-100 rounded-xl shadow-lg ">


      {time.isFinished ? (
        <p className="text-4xl font-extrabold text-red-600">
          ¡El evento ha comenzado!
        </p>
      ) : (
        <div className="flex justify-center space-x-4">
          <TimeBox value={time.days} label="Días" />
          <TimeBox value={time.hours} label="Horas" />
          <TimeBox value={time.minutes} label="Minutos" />
          <TimeBox value={time.seconds} label="Segundos" />
        </div>
      )}


    </div>
  );
}

// Sub-componente para mostrar una unidad de tiempo
const TimeBox = ({ value, label }) => (
  <div className="">
    <div className="py-2 bg-white rounded-lg shadow-md w-[72px]">
      <p className="text-2xl font_parisienne font-medium text-gray-900">
        {String(value).padStart(2, "0")}
      </p>
    </div>
    <p className=" uppercase text-gray-500 mt-1 text-xl font_bebasneue">{label}</p>
  </div>
);
