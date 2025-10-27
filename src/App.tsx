
import TinderCardSlider from "./components/PicturesSlider";
import CountdownTimer from "./components/CountdownTimer";

const arrayUbications = [
  {
    icon: <span className="material-symbols-outlined">church</span>,
    title: "Misa",
    time: "1:00 PM",
  },
  {
    icon: <span className="material-symbols-outlined">fork_spoon</span>,
    title: "Comida",
    time: "3:00 PM",
  },
  {
    icon: <span className="material-symbols-outlined">photo_camera</span>,
    title: "Fotos Con Los Novios",
    time: "6:00 PM",
  },
  {
    icon: <span className="material-symbols-outlined">favorite</span>,
    title: "Baile y Fiesta",
    time: "8:00 PM",
  },
];

export default function App() {
  return (
    <div className="text-[#c07272]">
      {/* <div className="h-screen fondo_boda_1"></div> */}
      <div className="h-screen fondo_boda_2 flex flex-col justify-center items-center text-white  font_parisienne">
        <p className="pb-10 w-1/2 text-center text-6xl text-white">
          Alondra & Javier
        </p>
        <p className="font_bebasneue font-[400] text-2xl">
          21 de noviembre de 2025
        </p>
        <p className="font_bebasneue font-[400] text-2xl">1:00 PM</p>
      </div>
      <TinderCardSlider></TinderCardSlider>
      <p className="text-center">
        <span className="material-symbols-outlined scale-[2] mb-5">swipe</span>
      </p>

      <div className=" font-[400] text-center px-4 py-10">
        <CountdownTimer></CountdownTimer>
      </div>
      <div>
        <div className="flex flex-col justify-center mt-4">
          <p className="text-center ">
            <span className="material-symbols-outlined scale-[3] mb-5">
              location_on
            </span>
          </p>
          <p className="font_parisienne text-center text-4xl">
            Ubicacion iglesia
          </p>
          <p className="my-4 font_bebasneue text-center w-3/4 mx-auto text-lg font-thin">
            Simon Sarlat Nava 707, Chihuahua 2000 I Etapa, Chihuahua 2000, 31136
            Chihuahua, Chih.
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6997.411857697112!2d-106.13178938627243!3d28.72833314080727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ea418555ce6cf3%3A0x5f3968d0303bdb3c!2sParroquia%20San%20Pablo%20Ap%C3%B3stol!5e0!3m2!1ses!2smx!4v1761535142112!5m2!1ses!2smx"
            
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="mt-16 flex flex-col justify-center mt-4">
          <p className="text-center ">
            <span className="material-symbols-outlined scale-[3] mb-5">
              location_on
            </span>
          </p>
          <p className="font_parisienne text-center text-4xl">
            Ubicacion Salon
          </p>
          <p className="my-4 font_bebasneue text-center w-3/4 mx-auto text-lg font-thin">
            Vialidad Los Nogales 1505, Rodolfo Fierro, 31137 Chihuahua, Chih.
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6997.410611152356!2d-106.13178938728518!3d28.72835176218534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ea4190504ab50f%3A0xa007c6f2d9b842d4!2sHacienda%20El%20Mestizo!5e0!3m2!1ses!2smx!4v1761535514625!5m2!1ses!2smx"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="flex flex-col justify-center text-center gap-2 mt-16">
        {arrayUbications.map((ubication) => (
          <div className="flex flex-col justify-center ">
            {ubication.icon}
            <p className="font_parisienne text-xl">{ubication.title}</p>
            <p className="font_bebasneue text-lg">{ubication.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
