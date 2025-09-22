import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Filter, Calendar, MapPin } from "lucide-react";

function ModalOverlay({ selectedPhoto, onClose, categories }) {
  if (!selectedPhoto) return null;

  const content = (
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/90
        flex items-center justify-center
      "
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        isolation: "isolate",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-4xl p-4 sm:p-8"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-yellow-400 transition-colors duration-200 z-50"
          aria-label="Închide"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
          <img
            src={selectedPhoto.src}
            alt={selectedPhoto.alt}
            className="max-w-full max-h-[70vh] object-contain rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.setAttribute("style", "display:flex");
            }}
          />
          <div className="min-h-[300px] w-full hidden items-center justify-center text-gray-400 text-center">
            <div>
              <Calendar size={48} className="text-yellow-500 mx-auto mb-4" />
              <p className="text-xl font-medium">{selectedPhoto.src}</p>
              <p className="text-gray-500 mt-2">
                Imaginea nu s-a putut încărca
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {selectedPhoto.title}
            </h3>
            <p className="text-gray-300 mb-3">{selectedPhoto.alt}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                selectedPhoto.category === "birou"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : selectedPhoto.category === "herculane"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {
                categories.find((cat) => cat.id === selectedPhoto.category)
                  ?.name
              }
            </span>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Apasă ESC sau click în afara imaginii pentru a închide
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

const EventPhotoGallery = () => {
  const [activeCategory, setActiveCategory] = useState("toate");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // ESC + body lock + clasă pentru a evita transform pe strămoși
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setSelectedPhoto(null);
      }
    };

    if (selectedPhoto) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, [selectedPhoto]);

  const photos = [
    {
      id: 1,
      src: "/Galerie/Birou1.jpg",
      alt: "Birou ProFX - Echipa la lucru",
      category: "birou",
      title: "Fondatorii ProFX",
    },
    {
      id: 2,
      src: "/Galerie/Birou2.jpg",
      alt: "Birou ProFX - Spațiul de lucru",
      category: "birou",
      title: "Spațiul nostru de lucru",
    },
    // {
    //   id: 3,
    //   src: "Birou3.jpg",
    //   alt: "Birou ProFX - Meeting room",
    //   category: "birou",
    //   title: "Sala de ședințe",
    // },
    {
      id: 4,
      src: "/Galerie/BootcampHerculane1.jpg",
      alt: "Bootcamp Herculane - Prima zi",
      category: "herculane",
      title: "Prima zi la Herculane",
    },
    {
      id: 5,
      src: "/Galerie/BootcampHerculane2.jpg",
      alt: "Bootcamp Herculane - In natura",
      category: "herculane",
      title: "Workshop intensiv",
    },
    // {
    //   id: 6,
    //   src: "/Galerie/BootcampHerculane3.jpg",
    //   alt: "Bootcamp Herculane - Team building",
    //   category: "herculane",
    //   title: "Activități team building",
    // },
    {
      id: 7,
      src: "/Galerie/BootcampEforie1.jpg",
      alt: "Bootcamp Eforie - La cina",
      category: "eforie",
      title: "Evolutie",
    },
    {
      id: 8,
      src: "/Galerie/BootcampEforie2.jpg",
      alt: "",
      category: "eforie",
      title: "Pe terasa",
    },
    {
      id: 9,
      src: "/Galerie/BootcampEforie3.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
    {
      id: 10,
      src: "/Galerie/BootcampEforie4.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
    {
      id: 11,
      src: "/Galerie/BootcampEforie5.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
    {
      id: 12,
      src: "/Galerie/BootcampEforie6.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
    {
      id: 13,
      src: "/Galerie/BootcampEforie7.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
    {
      id: 14,
      src: "/Galerie/BootcampEforie8.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
    {
      id: 15,
      src: "/Galerie/BootcampEforie9.jpg",
      alt: "",
      category: "eforie",
      title: "Eforie Nord 2025",
    },
  ];

  const categories = [
    { id: "toate", name: "Toate pozele", icon: Filter },
    { id: "birou", name: "Birou ProFX", icon: MapPin },
    { id: "herculane", name: "Bootcamp Herculane", icon: Calendar },
    { id: "eforie", name: "Bootcamp Eforie Nord", icon: Calendar },
  ];

  const filteredPhotos =
    activeCategory === "toate"
      ? photos
      : photos.filter((photo) => photo.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Galeria Noastră de Evenimente
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Descoperă momentele speciale din biroul nostru și de la
            bootcamp-urile organizate în Herculane și Eforie Nord
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/25"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700 shadow-md border border-slate-700"
                }`}
              >
                <IconComponent size={20} />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-slate-900 rounded-xl overflow-hidden shadow-lg shadow-black/50 hover:shadow-2xl hover:shadow-yellow-500/10 transform hover:scale-105 transition-all duration-300 border border-slate-800 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center relative overflow-hidden border-b border-slate-800">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback)
                      fallback.setAttribute("style", "display:flex");
                  }}
                />

                <div className="absolute inset-0 hidden bg-gradient-to-br from-slate-800 to-slate-700 items-center justify-center text-gray-400 text-center p-4">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-3 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
                      <Calendar size={24} className="text-yellow-500" />
                    </div>
                    <p className="font-medium text-gray-300">{photo.src}</p>
                    <p className="text-sm mt-1 text-gray-400">
                      Imaginea nu s-a putut încărca
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="text-yellow-400 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-lg font-semibold">
                      Click pentru a vedea
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {photo.title}
                </h3>
                <p className="text-gray-400">{photo.alt}</p>
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      photo.category === "birou"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : photo.category === "herculane"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {categories.find((cat) => cat.id === photo.category)?.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <Filter size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nu există poze în această categorie
            </h3>
            <p className="text-gray-400">
              Încearcă să selectezi o altă categorie sau adaugă poze noi.
            </p>
          </div>
        )}

        {/* Modal via Portal */}
        <ModalOverlay
          selectedPhoto={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          categories={categories}
        />

        <div className="text-center mt-16 pt-8 border-t border-slate-800">
          <p className="text-gray-400">
            Galerie foto ProFX • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventPhotoGallery;
