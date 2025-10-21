import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const NewsCard = ({ news, onSelect, getCategoryColor, getImportanceBadge, getLocalizedField }) => {
  const { translations } = useLanguage();
  const t = translations.stiri;
  
  return (
    <div
      onClick={() => onSelect(news)}
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.image}
          alt={getLocalizedField(news.title)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(news.category)} text-white text-xs font-bold rounded-full shadow-lg`}>
            {t.categories[news.category] || news.category}
          </span>
        </div>

        {/* Importance badge */}
        {news.importance === "high" && (
          <div className="absolute top-4 right-4">
            {getImportanceBadge(news.importance)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6 z-10">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>📅 {getLocalizedField(news.date)}</span>
          <span>•</span>
          <span>✍️ {getLocalizedField(news.author)}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
          {getLocalizedField(news.title)}
        </h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {getLocalizedField(news.excerpt)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 text-xs rounded-lg hover:border-amber-400/50 transition-colors duration-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-amber-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
            {t.readMore} →
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
