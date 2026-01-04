import React from "react";

export default function ProFXbookAccess({
  authStep,
  savedAccounts,
  selectedBroker,
  accountNumber,
  accountPassword,
  serverType,
  language,
  t,
  onSelectAccount,
  onAddNewAccount,
  onDeleteAccount,
  onBrokerSelection,
  onAccountNumberChange,
  onAccountPasswordChange,
  onServerTypeChange,
  onLogin,
  onBackToSelect,
  onBackToBroker,
  showDeleteModal,
  accountToDelete,
  onConfirmDelete,
  onCancelDelete
}) {
  // Ecran de selectare cont sau adăugare cont nou
  if (authStep === "select") {
    return (
      <div className="min-h-screen text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {t.title}
            </p>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            {language === "ro" ? "Conturile Tale" : "Your Accounts"}
          </h2>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Saved Accounts */}
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                className="group relative bg-transparent border-2 border-gray-700/50 hover:border-amber-400/60 rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => onDeleteAccount(account.id, e)}
                  className="absolute top-3 right-3 w-9 h-9 bg-transparent border border-red-500/40 hover:border-red-400/70 rounded-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 hover:scale-110 hover:rotate-90"
                  title={language === "ro" ? "Șterge cont" : "Delete account"}
                >
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="flex flex-col gap-4">
                  {/* Broker Icon & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-transparent border border-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden p-1">
                      {account.broker === "FP Markets" ? (
                        <img 
                          src="/fpmarkets-logo.png" 
                          alt="FP Markets" 
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-xl">🏦</span>';
                          }}
                        />
                      ) : (
                        <div className="text-center leading-none" style={{fontFamily: 'Arial, sans-serif'}}>
                          <div className="text-[0.65rem] font-bold tracking-tight">
                            <span className="text-cyan-400">fpm</span>
                            <span className="text-white">trading</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                        {account.broker}
                      </h3>
                      <p className="text-gray-400 text-xs font-mono">#{account.accountNumber || account.login}</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">{language === "ro" ? "Tip" : "Type"}:</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        (account.serverType || account.account_type) === "Live" || (account.serverType || account.account_type) === "live"
                          ? "bg-transparent text-emerald-400 border border-emerald-500/30"
                          : "bg-transparent text-blue-400 border border-blue-500/30"
                      }`}>
                        {account.serverType || (account.account_type === "live" ? "Live" : "Demo")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/30">
                      <span className="text-gray-400 text-xs">{language === "ro" ? "Balanță" : "Balance"}:</span>
                      <span className="text-emerald-400 font-bold">
                        ${account.data?.stats?.all?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">{language === "ro" ? "Câștig" : "Gain"}:</span>
                      <span className="text-emerald-400 font-bold">
                        +{account.data?.stats?.all?.gain || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="mt-2 px-4 py-2 bg-transparent rounded-lg border border-amber-400/30 transition-all duration-300 text-center">
                    <span className="text-amber-400 font-semibold text-sm">
                      {language === "ro" ? "Selectează" : "Select"} →
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Account Card */}
            <button
              onClick={onAddNewAccount}
              className="group bg-transparent border-2 border-dashed border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-6 transition-all duration-300 hover:scale-105 min-h-[280px] flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 bg-transparent border border-amber-500/30 rounded-full flex items-center justify-center transition-all duration-300">
                <span className="text-4xl">➕</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 mb-2">
                  {language === "ro" ? "Adaugă Cont Nou" : "Add New Account"}
                </h3>
                <p className="text-gray-400 text-sm text-center">
                  {language === "ro" ? "Conectează un cont nou" : "Connect a new account"}
                </p>
              </div>
            </button>
          </div>

          {/* Info Footer */}
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>{language === "ro" ? "Toate conturile sunt salvate local și în siguranță" : "All accounts are saved locally and securely"} 🔒</p>
          </div>
        </div>

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && accountToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gray-900/95 border-2 border-red-500/30 rounded-2xl p-8 max-w-md w-full animate-scaleIn">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center border-2 border-red-500/40 animate-pulse">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white text-center mb-3">
                {language === "ro" ? "Șterge Cont?" : "Delete Account?"}
              </h3>

              {/* Message */}
              <p className="text-gray-300 text-center mb-6">
                {language === "ro" 
                  ? "Ești sigur că vrei să ștergi acest cont? Această acțiune nu poate fi anulată."
                  : "Are you sure you want to delete this account? This action cannot be undone."}
              </p>

              {/* Account Info Preview */}
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-transparent border border-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden p-1">
                    {accountToDelete.broker === "FP Markets" ? (
                      <img 
                        src="/fpmarkets-logo.png" 
                        alt="FP Markets" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-lg">🏦</span>';
                        }}
                      />
                    ) : (
                      <div className="text-center leading-none" style={{fontFamily: 'Arial, sans-serif'}}>
                        <div className="text-[0.5rem] font-bold tracking-tight">
                          <span className="text-cyan-400">fpm</span>
                          <span className="text-white">trading</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold">{accountToDelete.broker}</p>
                    <p className="text-gray-400 text-xs font-mono">#{accountToDelete.accountNumber || accountToDelete.login}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{language === "ro" ? "Balanță" : "Balance"}:</span>
                  <span className="text-emerald-400 font-bold">
                    ${accountToDelete.data?.stats?.all?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancelDelete}
                  className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {language === "ro" ? "Anulează" : "Cancel"}
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {language === "ro" ? "Șterge" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dacă utilizatorul nu a selectat încă brokerul
  if (authStep === "broker") {
    return (
      <div className="min-h-screen text-white p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {t.title}
            </p>
          </div>

          {/* Broker Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-6">
            {/* Back Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBackToSelect}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {language === "ro" ? "Înapoi" : "Back"}
              </button>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-white">
              {language === "ro" ? "Selectează Brokerul" : "Select Your Broker"}
            </h2>
            <p className="text-gray-400 text-center mb-8">
              {language === "ro" ? "Alege brokerul tău pentru a continua" : "Choose your broker to continue"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FP Markets Card */}
              <button
                onClick={() => onBrokerSelection("FP Markets")}
                className="group bg-transparent border-2 border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-8 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-4">
                  {/* FP Markets Logo */}
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <img 
                      src="/fpmarkets-logo.png" 
                      alt="FP Markets" 
                      className="w-full h-full object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-6xl">🏦</span>';
                      }}
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    FP Markets
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                    {language === "ro" ? "Broker global de încredere" : "Trusted global broker"}
                  </p>
                  <div className="mt-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30 group-hover:bg-blue-500/30 transition-all duration-300">
                    <span className="text-blue-400 font-semibold text-sm">
                      {language === "ro" ? "Selectează" : "Select"} →
                    </span>
                  </div>
                </div>
              </button>

              {/* FPM Trading Card */}
              <button
                onClick={() => onBrokerSelection("FPM Trading")}
                className="group bg-transparent border-2 border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-8 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-4">
                  {/* FPM Trading Text Logo */}
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <div className="text-center" style={{fontFamily: 'Arial, sans-serif'}}>
                      <div className="text-3xl font-bold leading-none tracking-tight">
                        <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">fpm</span>
                        <span className="text-white group-hover:text-gray-100 transition-colors duration-300">trading</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    FPM Trading
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                    {language === "ro" ? "Broker global de încredere" : "Trusted global broker"}
                  </p>
                  <div className="mt-2 px-4 py-2 bg-cyan-500/20 rounded-lg border border-cyan-400/30 group-hover:bg-cyan-500/30 transition-all duration-300">
                    <span className="text-cyan-400 font-semibold text-sm">
                      {language === "ro" ? "Selectează" : "Select"} →
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>{language === "ro" ? "Datele tale sunt în siguranță și criptate" : "Your data is safe and encrypted"} 🔒</p>
          </div>
        </div>
      </div>
    );
  }

  // Dacă utilizatorul a selectat brokerul și trebuie să introducă datele contului
  if (authStep === "account") {
    return (
      <div className="min-h-screen text-white p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-lg">
              {selectedBroker}
            </p>
          </div>

          {/* Account Details Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {language === "ro" ? "Detalii Cont" : "Account Details"}
              </h2>
              <button
                onClick={onBackToBroker}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                ← {language === "ro" ? "Înapoi" : "Back"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Account Number */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {language === "ro" ? "Număr Cont" : "Account Number"}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => onAccountNumberChange(e.target.value)}
                  placeholder={language === "ro" ? "Introdu numărul contului" : "Enter your account number"}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {language === "ro" ? "Parolă Cont" : "Account Password"}
                </label>
                <input
                  type="password"
                  value={accountPassword}
                  onChange={(e) => onAccountPasswordChange(e.target.value)}
                  placeholder={language === "ro" ? "Introdu parola contului" : "Enter your account password"}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                />
              </div>

              {/* Server Type Dropdown */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {language === "ro" ? "Tip Server" : "Server Type"}
                </label>
                <select
                  value={serverType}
                  onChange={(e) => onServerTypeChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 cursor-pointer"
                >
                  <option value="Live">Live - {language === "ro" ? "Cont Real" : "Real Account"}</option>
                  <option value="Demo">Demo - {language === "ro" ? "Cont Demo" : "Demo Account"}</option>
                </select>
              </div>

              {/* Login Button */}
              <button
                onClick={onLogin}
                disabled={!accountNumber || !accountPassword}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  accountNumber && accountPassword
                    ? "bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 hover:scale-[1.02]"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {language === "ro" ? "Conectează-te" : "Login"} →
              </button>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h4 className="text-blue-400 font-semibold text-sm mb-1">
                    {language === "ro" ? "Conexiune Sigură" : "Secure Connection"}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {language === "ro" 
                      ? "Datele tale sunt criptate și nu sunt stocate pe serverele noastre."
                      : "Your data is encrypted and not stored on our servers."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
