import { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { User, LogOut, Loader, Book, Upload, ChevronRight, FileText } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./db/FireBase.js";
import Biblia from "./Biblia.jsx";
import ArmyUpload from "./ArmyUpload.jsx";
import MaterialeArmy from "./MaterialeArmy.jsx";

// === CACHE HELPERS - Reduce Firebase reads === 
const CACHE_DURATION = 5 * 60 * 1000; // 5 minute

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.warn('Nu s-a putut cache-ui datele:', err);
  }
};

const Army = () => {
  const { language } = useLanguage();
  
  // State pentru autentificare
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('armyAuth');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const savedUser = localStorage.getItem('armyUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ nume: "", telefon: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // State pentru selecția activității
  const [activeView, setActiveView] = useState(null); // null, 'biblia', 'upload', 'materiale'

  // Listen for updates from Biblia component when user switches back
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When returning to this tab/component, check for updated user data
      if (document.visibilityState === 'visible' && authenticatedUser) {
        const savedUser = localStorage.getItem('armyUser');
        if (savedUser) {
          const updatedUser = JSON.parse(savedUser);
          // Update only if progress has changed
          if (JSON.stringify(updatedUser.progres) !== JSON.stringify(authenticatedUser.progres)) {
            setAuthenticatedUser(updatedUser);
          }
        }
      }
    };

    // Check for updates when component becomes visible or activeView changes back to null (main menu)
    const checkForUpdates = () => {
      if (authenticatedUser && activeView === null) {
        const savedUser = localStorage.getItem('armyUser');
        if (savedUser) {
          const updatedUser = JSON.parse(savedUser);
          if (JSON.stringify(updatedUser.progres) !== JSON.stringify(authenticatedUser.progres)) {
            setAuthenticatedUser(updatedUser);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check for updates when returning to main menu
    checkForUpdates();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authenticatedUser, activeView]);

  // Funcție de autentificare
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      // Normalizează datele de intrare
      const numeNormalized = loginForm.nume.trim().toLowerCase();
      const telefonNormalized = loginForm.telefon.trim().replace(/\s+/g, '');

      // Verifică cache-ul mai întâi
      let cursanti = getCachedData('army_login_cursanti');
      
      if (cursanti) {
        console.log('📦 Cursanți încărcați din cache pentru Army (economisim citiri Firebase)');
      } else {
        // Citește din Firebase doar dacă nu există în cache
        console.log('🔄 Citire cursanți din Firebase pentru Army...');
        const snapshot = await getDocs(collection(db, "Army"));
        cursanti = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Salvează în cache
        setCachedData('army_login_cursanti', cursanti);
      }

      // Caută un cursant care se potrivește
      const cursant = cursanti.find(c => {
        const numeDB = c.nume.trim().toLowerCase();
        const telefonDB = c.telefon.trim().replace(/\s+/g, '');
        return numeDB === numeNormalized && telefonDB === telefonNormalized;
      });

      if (cursant) {
        // Autentificare reușită
        const userData = {
          id: cursant.id,
          nume: cursant.nume,
          telefon: cursant.telefon,
          perecheValutara: cursant.perecheValutara,
          tipParticipant: cursant.tipParticipant || 'Cursant',
          oraLumanare: cursant.oraLumanare || '8:00 - 12:00',
          progres: cursant.progres || Array(20).fill(0),
          screenshots: cursant.screenshots || []
        };
        
        setAuthenticatedUser(userData);
        setIsAuthenticated(true);
        
        // Salvează în localStorage pentru Army
        localStorage.setItem('armyAuth', JSON.stringify(true));
        localStorage.setItem('armyUser', JSON.stringify(userData));
        
        // Salvează și pentru Biblia și ArmyUpload pentru a le sincroniza
        localStorage.setItem('bibliaAuth', JSON.stringify(true));
        localStorage.setItem('bibliaUser', JSON.stringify(userData));
        localStorage.setItem('armyUploadAuth', JSON.stringify(true));
        localStorage.setItem('armyUploadUser', JSON.stringify(userData));
        
        setLoginForm({ nume: "", telefon: "" });
      } else {
        setLoginError(language === 'ro' 
          ? "Datele introduse nu corespund cu niciun cursant înregistrat. Verifică numele și numărul de telefon."
          : "The entered data does not match any registered student. Check the name and phone number.");
      }
    } catch (err) {
      console.error("Eroare autentificare:", err);
      setLoginError(language === 'ro' 
        ? "Eroare la autentificare. Te rugăm să încerci din nou."
        : "Authentication error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Funcție de logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    setActiveView(null);
    
    // Șterge toate sesiunile
    localStorage.removeItem('armyAuth');
    localStorage.removeItem('armyUser');
    localStorage.removeItem('bibliaAuth');
    localStorage.removeItem('bibliaUser');
    localStorage.removeItem('armyUploadAuth');
    localStorage.removeItem('armyUploadUser');
    
    setLoginForm({ nume: "", telefon: "" });
  };

  // Formular de autentificare
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 mb-4">
              🎖️ ProFX Army
            </h1>
            <p className="text-gray-400">
              {language === 'ro' 
                ? 'Acces exclusiv pentru cursanții ProFX Army' 
                : 'Exclusive access for ProFX Army students'}
            </p>
          </div>

          {/* Formular Login */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8">
            <div className="mb-6 text-center">
              <User className="w-16 h-16 text-amber-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'ro' ? 'Autentificare Cursant' : 'Student Authentication'}
              </h2>
              <p className="text-sm text-gray-400">
                {language === 'ro' 
                  ? 'Introdu numele și numărul de telefon cu care te-ai înscris' 
                  : 'Enter the name and phone number you registered with'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ro' ? 'Nume Complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ro' ? "Ex: Ion Popescu" : "Ex: John Doe"}
                  value={loginForm.nume}
                  onChange={(e) => setLoginForm({ ...loginForm, nume: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ro' ? 'Număr Telefon' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder={language === 'ro' ? "Ex: 0751234567" : "Ex: +40751234567"}
                  value={loginForm.telefon}
                  onChange={(e) => setLoginForm({ ...loginForm, telefon: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading 
                  ? (language === 'ro' ? "Se verifică..." : "Verifying...") 
                  : (language === 'ro' ? "Accesează Army" : "Access Army")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                {language === 'ro' 
                  ? 'Nu ești înscris încă? Contactează administratorul pentru a fi adăugat în programul Army.' 
                  : 'Not registered yet? Contact the administrator to be added to the Army program.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dacă este selectat un view specific, afișează acea componentă
  if (activeView === 'biblia') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>
        <Biblia />
      </div>
    );
  }

  if (activeView === 'upload') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>
        <ArmyUpload />
      </div>
    );
  }

  if (activeView === 'materiale') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>
        <MaterialeArmy />
      </div>
    );
  }

  // Meniul principal după autentificare - două carduri
  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
                <User className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{authenticatedUser.nume}</h2>
                <p className="text-gray-400 text-sm">
                  {authenticatedUser.perecheValutara} • {authenticatedUser.tipParticipant}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all flex items-center gap-2 border border-gray-700/50"
            >
              <LogOut className="w-4 h-4" />
              {language === 'ro' ? 'Deconectare' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {language === 'ro' ? 'Bine ai venit în Army!' : 'Welcome to Army!'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'ro' 
              ? 'Alege activitatea pe care dorești să o accesezi' 
              : 'Choose the activity you want to access'}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Biblia */}
          <button
            onClick={() => setActiveView('biblia')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <Book className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Biblia Trading' : 'Trading Bible'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro' 
                  ? 'Cele 20 de principii fundamentale ale trading-ului' 
                  : 'The 20 fundamental principles of trading'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Biblie' : 'Access Bible'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Progress indicator */}
            {authenticatedUser.progres && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    {language === 'ro' ? 'Progres total' : 'Total progress'}
                  </span>
                  <span className="text-white font-semibold">
                    {Math.round(authenticatedUser.progres.reduce((a, b) => a + b, 0) / authenticatedUser.progres.length)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                    style={{ 
                      width: `${authenticatedUser.progres.reduce((a, b) => a + b, 0) / authenticatedUser.progres.length}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </button>

          {/* Card 2 - Upload Screenshots */}
          <button
            onClick={() => setActiveView('upload')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <Upload className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Upload Screenshots' : 'Upload Screenshots'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro' 
                  ? 'Încarcă imagini cu trade-urile tale pentru analiză' 
                  : 'Upload images of your trades for analysis'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Upload' : 'Access Upload'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Screenshots count */}
            {authenticatedUser.screenshots && authenticatedUser.screenshots.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400 text-sm">
                    {language === 'ro' ? 'Screenshots încărcate:' : 'Uploaded screenshots:'}
                  </span>
                  <span className="text-white font-semibold text-lg">
                    {authenticatedUser.screenshots.length}
                  </span>
                </div>
              </div>
            )}
          </button>

          {/* Card 3 - Materiale Army */}
          <button
            onClick={() => setActiveView('materiale')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <FileText className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Materiale Army' : 'Army Materials'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro' 
                  ? 'Resurse și materiale ajutătoare pentru toți cursanții' 
                  : 'Resources and helpful materials for all students'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Materiale' : 'Access Materials'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Info badge */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="flex items-center justify-center gap-2">
                <span className="text-amber-400 text-sm font-medium">
                  📚 {language === 'ro' ? 'Nou!' : 'New!'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 text-lg">
                {language === 'ro' ? 'Sfat ProFX' : 'ProFX Tip'}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {language === 'ro' 
                  ? 'Studiază zilnic Biblia Trading și urmărește-ți progresul. Încarcă screenshot-uri ale trade-urilor tale pentru feedback personalizat de la mentor.' 
                  : 'Study the Trading Bible daily and track your progress. Upload screenshots of your trades for personalized feedback from your mentor.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Army;
