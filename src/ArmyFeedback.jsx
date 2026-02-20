import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./db/FireBase.js";
import { MessageSquare, Send, CheckCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";

const CATEGORIES_RO = [
  { value: "predare", label: "📚 Modul de predare" },
  { value: "platforma", label: "💻 Funcționalități platformă" },
  { value: "continut", label: "📝 Conținut & materiale" },
  { value: "altele", label: "💬 Altele" },
];

const CATEGORIES_EN = [
  { value: "predare", label: "📚 Teaching methods" },
  { value: "platforma", label: "💻 Platform features" },
  { value: "continut", label: "📝 Content & materials" },
  { value: "altele", label: "💬 Other" },
];

const RATINGS = [1, 2, 3, 4, 5];

const ArmyFeedback = () => {
  const { language } = useLanguage();

  const categories = language === "ro" ? CATEGORIES_RO : CATEGORIES_EN;

  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError(
        language === "ro"
          ? "Selectează o categorie pentru feedback."
          : "Please select a feedback category."
      );
      return;
    }

    const trimmed = feedback.trim();
    if (trimmed.length < 10) {
      setError(
        language === "ro"
          ? "Feedback-ul trebuie să aibă cel puțin 10 caractere."
          : "Feedback must be at least 10 characters long."
      );
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, "ArmyFeedback"), {
        category,
        rating: rating || null,
        feedback: trimmed,
        createdAt: Timestamp.now(),
        // Complet anonim – nu salvăm niciun identificator de utilizator
      });

      setSuccess(true);
      setCategory("");
      setRating(0);
      setFeedback("");
    } catch (err) {
      console.error("Eroare trimitere feedback:", err);
      setError(
        language === "ro"
          ? "A apărut o eroare. Te rugăm să încerci din nou."
          : "An error occurred. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError("");
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            {language === "ro" ? "Feedback Army" : "Army Feedback"}
          </h3>
          <p className="text-sm text-gray-400">
            {language === "ro"
              ? "Ajută-ne să îmbunătățim platforma – feedback-ul este 100% anonim"
              : "Help us improve the platform – feedback is 100% anonymous"}
          </p>
        </div>
      </div>

      {/* Success state */}
      {success ? (
        <div className="flex flex-col items-center py-10 gap-4">
          <CheckCircle className="w-16 h-16 text-green-400" />
          <h4 className="text-xl font-bold text-white">
            {language === "ro" ? "Mulțumim pentru feedback!" : "Thank you for your feedback!"}
          </h4>
          <p className="text-gray-400 text-center text-sm max-w-xs">
            {language === "ro"
              ? "Opinia ta ne ajută să creștem și să îmbunătățim constant platforma Army."
              : "Your opinion helps us continuously grow and improve the Army platform."}
          </p>
          <button
            onClick={handleReset}
            className="mt-2 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {language === "ro" ? "Trimite alt feedback" : "Send another feedback"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Anonym badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg w-fit">
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
              🔒 {language === "ro" ? "Complet anonim" : "Fully anonymous"}
            </span>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === "ro" ? "Categorie *" : "Category *"}
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none p-3 pr-10 rounded-lg border border-gray-600 bg-gray-800 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all cursor-pointer"
              >
                <option value="" disabled>
                  {language === "ro" ? "Alege categoria..." : "Select category..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === "ro"
                ? "Evaluare generală (opțional)"
                : "Overall rating (optional)"}
            </label>
            <div className="flex items-center gap-1">
              {RATINGS.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star === rating ? 0 : star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} stele`}
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? "text-amber-400"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-400">
                  {["", "😞", "😐", "🙂", "😊", "🤩"][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Feedback text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === "ro"
                ? "Feedback-ul tău *"
                : "Your feedback *"}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              placeholder={
                language === "ro"
                  ? "Scrie sugestiile sau observațiile tale... (minim 10 caractere)"
                  : "Write your suggestions or observations... (minimum 10 characters)"
              }
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  feedback.trim().length > 0 && feedback.trim().length < 10
                    ? "text-red-400"
                    : "text-gray-500"
                }`}
              >
                {feedback.trim().length}{" "}
                {language === "ro" ? "caractere" : "characters"}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {language === "ro" ? "Se trimite..." : "Sending..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {language === "ro" ? "Trimite feedback anonim" : "Send anonymous feedback"}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ArmyFeedback;
