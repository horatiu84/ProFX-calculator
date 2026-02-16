import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Filter, Calendar, MapPin, Video, Image } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";

function ModalOverlay({ selectedMedia, onClose, categories }) {
  const { translations, language } = useLanguage();
  const t = translations.galerie;
  
  if (!selectedMedia) return null;

  const isVideo = selectedMedia.type === 'video';

  // Helper function pentru a obține textul în limba corectă
  const getLocalizedField = (field) => {
    if (typeof field === 'object' && field !== null && (field.ro || field.en)) {
      return field[language] || field.ro;
    }
    return field;
  };

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
        className="relative w-full max-w-5xl p-4 sm:p-8"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-yellow-400 transition-colors duration-200 z-50"
          aria-label={t.close}
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

{isVideo ? (
          // Layout pentru video - fără overlay peste controale
          <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
            <video
              src={selectedMedia.src}
              className="w-full max-h-[70vh] object-contain rounded-t-xl"
              controls
              controlsList="nodownload"
              autoPlay
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.setAttribute("style", "display:flex");
              }}
            />
            
            <div className="min-h-[300px] w-full hidden items-center justify-center text-gray-400 text-center p-8">
              <div>
                <Video size={48} className="text-yellow-500 mx-auto mb-4" />
                <p className="text-xl font-medium">{selectedMedia.src}</p>
                <p className="text-gray-500 mt-2">
                  {t.videoLoadError}
                </p>
              </div>
            </div>

            {/* Informații sub video pentru a nu interfere cu controalele */}
            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Video size={20} className="text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">
                  {getLocalizedField(selectedMedia.title)}
                </h3>
              </div>
              <p className="text-gray-300 mb-3">{getLocalizedField(selectedMedia.alt)}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedMedia.category === "birou"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : selectedMedia.category === "herculane"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : selectedMedia.category === "cluj"
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {
                  categories.find((cat) => cat.id === selectedMedia.category)
                    ?.name
                }
              </span>
            </div>
          </div>
        ) : (
          // Layout pentru imagini - cu overlay ca înainte
          <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            <img
              src={selectedMedia.src}
              alt={selectedMedia.alt}
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
                <p className="text-xl font-medium">{selectedMedia.src}</p>
                <p className="text-gray-500 mt-2">
                  {t.imageLoadError}
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center gap-2 mb-2">
                <Image size={20} className="text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">
                  {getLocalizedField(selectedMedia.title)}
                </h3>
              </div>
              <p className="text-gray-300 mb-3">{getLocalizedField(selectedMedia.alt)}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedMedia.category === "birou"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : selectedMedia.category === "herculane"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : selectedMedia.category === "cluj"
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {
                  categories.find((cat) => cat.id === selectedMedia.category)
                    ?.name
                }
              </span>
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            {t.closeHint} {isVideo ? t.video : t.image} {t.closeAction}
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

const EventPhotoGallery = () => {
  const { language, translations } = useLanguage();
  const t = translations.galerie;
  
  const [activeCategory, setActiveCategory] = useState("toate");
  const [mediaType, setMediaType] = useState("toate"); // "toate", "photos", "videos"
  const [selectedMedia, setSelectedMedia] = useState(null);

  // ESC + body lock + clasă pentru a evita transform pe strămoși
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setSelectedMedia(null);
      }
    };

    if (selectedMedia) {
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
  }, [selectedMedia]);

  const photos = [
    {
      id: 1,
      src: "/Galerie/Birou1.jpg",
      alt: { ro: "Birou ProFX - Echipa la lucru", en: "ProFX Office - Team at work" },
      category: "birou",
      title: { ro: "Fondatorii ProFX", en: "ProFX Founders" },
      type: "photo"
    },
    {
      id: 2,
      src: "/Galerie/Birou2.jpg",
      alt: { ro: "Birou ProFX - Spațiul de lucru", en: "ProFX Office - Workspace" },
      category: "birou",
      title: { ro: "Spațiul nostru de lucru", en: "Our workspace" },
      type: "photo"
    },
      {
      id: 3,
      src: "/Galerie/Birou3.jpg",
      alt: { ro: "Birou ProFX - Sesiune live", en: "ProFX Office - Live session" },
      category: "birou",
      title: { ro: "Sesiune live", en: "Live session" },
      type: "photo"
    },
      {
      id: 4,
      src: "/Galerie/Birou4.jpg",
      alt: { ro: "Birou ProFX - Sesiune live", en: "ProFX Office - Live session" },
      category: "birou",
      title: { ro: "Sesiune live", en: "Live session" },
      type: "photo"
    },
    {
      id: 5,
      src: "/Galerie/BootcampHerculane1.jpg",
      alt: { ro: "Bootcamp Herculane - Prima zi", en: "Herculane Bootcamp - First day" },
      category: "herculane",
      title: { ro: "Prima zi la Herculane", en: "First day at Herculane" },
      type: "photo"
    },
    {
      id: 6,
      src: "/Galerie/BootcampHerculane2.jpg",
      alt: { ro: "Bootcamp Herculane - In natura", en: "Herculane Bootcamp - In nature" },
      category: "herculane",
      title: { ro: "Workshop intensiv", en: "Intensive workshop" },
      type: "photo"
    },
    {
      id: 7,
      src: "/Galerie/BootcampEforie1.jpg",
      alt: { ro: "Bootcamp Eforie - La cina", en: "Eforie Bootcamp - At dinner" },
      category: "eforie",
      title: { ro: "Evolutie", en: "Evolution" },
      type: "photo"
    },
    {
      id: 8,
      src: "/Galerie/BootcampEforie2.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Pe terasa", en: "On the terrace" },
      type: "photo"
    },
    {
      id: 9,
      src: "/Galerie/BootcampEforie3.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 10,
      src: "/Galerie/BootcampEforie4.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 11,
      src: "/Galerie/BootcampEforie5.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 12,
      src: "/Galerie/BootcampEforie6.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 13,
      src: "/Galerie/BootcampEforie7.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 14,
      src: "/Galerie/BootcampEforie8.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 15,
      src: "/Galerie/BootcampEforie9.jpg",
      alt: "",
      category: "eforie",
      title: { ro: "Eforie Nord 2025", en: "Eforie Nord 2025" },
      type: "photo"
    },
    {
      id: 16,
      src: "/Galerie/Brasov.jpg",
      alt: { ro: "CityBreak Brașov - Mastermind ProFX", en: "CityBreak Brasov - ProFX Mastermind" },
      category: "citybreak",
      title: { ro: "Mastermind Brașov", en: "Brasov Mastermind" },
      type: "photo"
    },
    {
      id: 17,
      src: "/Galerie/Brasov1.jpg",
      alt: { ro: "CityBreak Brașov - Eveniment ProFX", en: "CityBreak Brasov - ProFX Event" },
      category: "citybreak",
      title: { ro: "Eveniment Brașov", en: "Brasov Event" },
      type: "photo"
    },
    {
      id: 22,
      src: "/Galerie/Cluj1.jpg",
      alt: { ro: "Mastermind ProFX Cluj 2026", en: "ProFX Mastermind Cluj 2026" },
      category: "cluj",
      title: { ro: "Mastermind Cluj 2026", en: "Mastermind Cluj 2026" },
      type: "photo"
    },
    {
      id: 23,
      src: "/Galerie/Cluj2.jpg",
      alt: { ro: "Mastermind ProFX Cluj 2026", en: "ProFX Mastermind Cluj 2026" },
      category: "cluj",
      title: { ro: "Mastermind Cluj 2026", en: "Cluj Mastermind 2026" },
      type: "photo"
    },
    {
      id: 24,
      src: "/Galerie/Cluj3.jpg",
      alt: { ro: "Mastermind ProFX Cluj 2026", en: "ProFX Mastermind Cluj 2026" },
      category: "cluj",
      title: { ro: "Mastermind Cluj 2026", en: "Cluj Mastermind 2026" },
      type: "photo"
    },
    {
      id: 25,
      src: "/Galerie/Cluj4.jpg",
      alt: { ro: "Mastermind ProFX Cluj 2026", en: "ProFX Mastermind Cluj 2026" },
      category: "cluj",
      title: { ro: "Mastermind Cluj 2026", en: "Cluj Mastermind 2026" },
      type: "photo"
    },
    {
      id: 26,
      src: "/Galerie/Cluj5.jpg",
      alt: { ro: "Mastermind ProFX Cluj 2026", en: "ProFX Mastermind Cluj 2026" },
      category: "cluj",
      title: { ro: "Mastermind Cluj", en: "Cluj Mastermind" },
      type: "photo"
    },
  ];

  const videos = [
    {
      id: 18,
      src: "/Galerie/bootcamp-eforie-1.mp4",
      alt: "",
      category: "eforie",
      title: { ro: "Ziua 1", en: "Day 1" },
      type: "video"
    },
    {
      id: 19,
      src: "/Galerie/bootcamp-eforie-2.mp4",
      alt: "",
      category: "eforie",
      title: { ro: "Ziua 2", en: "Day 2" },
      type: "video"
    },
    {
      id: 20,
      src: "/Galerie/Bootcamp-eforie-3.mp4",
      alt: "",
      category: "eforie",
      title: { ro: "Ziua 3", en: "Day 3" },
      type: "video"
    },
    {
      id: 21,
      src: "/Galerie/Bootcamp-eforie-4.mp4",
      alt: "",
      category: "eforie",
      title: { ro: "Ziua 4", en: "Day 4" },
      type: "video"
    },
  ];

  const allMedia = [...photos, ...videos];

  // Helper function pentru a obține textul în limba corectă
  const getLocalizedField = (field) => {
    if (typeof field === 'object' && field !== null && (field.ro || field.en)) {
      return field[language] || field.ro;
    }
    return field;
  };

  const categories = [
    { id: "toate", name: t.allAlbums, icon: Filter },
    { id: "birou", name: t.office, icon: MapPin },
    { id: "herculane", name: t.herculane, icon: Calendar },
    { id: "eforie", name: t.eforieNord, icon: Calendar },
    { id: "citybreak", name: t.citybreak, icon: MapPin },
    { id: "cluj", name: t.cluj, icon: Calendar },
  ];

  const mediaTypes = [
    { id: "toate", name: t.allCategories, icon: Filter },
    { id: "photos", name: t.photos, icon: Image },
    { id: "videos", name: t.videos, icon: Video },
  ];

  // Filtrare complexă
  const getFilteredMedia = () => {
    let filtered = allMedia;

    // Filtrează după tip de media
    if (mediaType === "photos") {
      filtered = filtered.filter(item => item.type === "photo");
    } else if (mediaType === "videos") {
      filtered = filtered.filter(item => item.type === "video");
    }

    // Filtrează după categorie
    if (activeCategory !== "toate") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    return filtered;
  };

  const filteredMedia = getFilteredMedia();

  return (
    <div key={language} className="py-12 px-4 animate-language-change">
      <div className="max-w-7xl mx-auto">
        {/* Header card - glassmorphism */}
        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12 hover:border-blue-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-3">{t.pageTitle}</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t.pageSubtitle}
            </p>
          </div>
        </div>

        {/* Media Type Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {mediaTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setMediaType(type.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] focus:outline-none ${
                  mediaType === type.id
                    ? "bg-blue-600/30 text-white border border-blue-400/50 shadow-md"
                    : "bg-gray-800/50 text-white border border-gray-600/50 hover:bg-gray-700/50 hover:border-blue-400/50 focus:ring-2 focus:ring-blue-400/40"
                }`}
              >
                <IconComponent size={20} />
                {type.name}
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full ml-1">
                  {type.id === "toate" ? allMedia.length : 
                   type.id === "photos" ? photos.length : videos.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const categoryCount = allMedia.filter(item => 
              category.id === "toate" ? true : item.category === category.id
            ).length;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] focus:outline-none ${
                  activeCategory === category.id
                    ? "bg-amber-600/30 text-white border border-amber-400/50 shadow-md"
                    : "bg-gray-800/50 text-white border border-gray-600/50 hover:bg-gray-700/50 hover:border-amber-400/50 focus:ring-2 focus:ring-amber-400/40"
                }`}
              >
                <IconComponent size={20} />
                {category.name}
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full ml-1">
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => {
            const isVideo = item.type === 'video';
            return (
              <div
                key={item.id}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 aspect-[4/3] bg-gray-800/40 flex items-center justify-center overflow-hidden border-b border-gray-700/50">
                  {isVideo ? (
                    <>
                      <video
                        src={item.src}
                        className="w-full h-full object-cover"
                        muted
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback)
                            fallback.setAttribute("style", "display:flex");
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                          <Video size={24} className="text-black ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={getLocalizedField(item.alt)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback)
                          fallback.setAttribute("style", "display:flex");
                      }}
                    />
                  )}

                  <div className="absolute inset-0 hidden bg-gray-800/60 items-center justify-center text-gray-300 text-center p-4">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
                        {isVideo ? (
                          <Video size={24} className="text-amber-400" />
                        ) : (
                          <Calendar size={24} className="text-amber-400" />
                        )}
                      </div>
                      <p className="font-medium text-gray-300">{item.src}</p>
                      <p className="text-sm mt-1 text-gray-400">
                        {isVideo ? t.videoLoadError : t.imageLoadError}
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="text-amber-400 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-lg font-semibold">
                        {isVideo ? t.clickToPlay : t.clickToView}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {isVideo ? (
                      <Video size={16} className="text-amber-400" />
                    ) : (
                      <Image size={16} className="text-gray-400" />
                    )}
                    <h3 className="text-xl font-semibold text-white">
                      {getLocalizedField(item.title)}
                    </h3>
                  </div>
                  <p className="text-gray-400">{getLocalizedField(item.alt)}</p>
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        item.category === "birou"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : item.category === "herculane"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : item.category === "cluj"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {categories.find((cat) => cat.id === item.category)?.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <Filter size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t.noContent}
            </h3>
            <p className="text-gray-400">
              {t.tryOtherFilters}
            </p>
          </div>
        )}

        {/* Modal via Portal */}
        <ModalOverlay
          selectedMedia={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          categories={categories}
        />

        <div className="text-center mt-16 pt-8 border-t border-gray-700/50">
          <p className="text-gray-400">
            {t.galleryFooter} • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventPhotoGallery;