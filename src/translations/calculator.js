export const calculatorTranslations = {
  ro: {
    calculator: {
      // Header
      title: "Calculator",
      titleHighlight: "Lot",
      subtitle: "Calculează dimensiunea optimă a lot-ului pentru fiecare tranzacție bazată pe riscul dorit",
      
      // Input Section
      inputTitle: "Parametri de intrare",
      pairLabel: "Perechea valutară / Instrumentul",
      pairPlaceholder: "Selectează instrumentul...",
      searchPlaceholder: "Caută instrumentul...",
      accountSizeLabel: "Mărimea contului ($)",
      accountSizePlaceholder: "10000",
      riskPerTradeLabel: "Risc per trade (%)",
      riskPerTradePlaceholder: "2",
      stopLossLabel: "Stop Loss (pips)",
      stopLossPlaceholder: "50",
      takeProfitLabel: "Take Profit (pips) - opțional",
      takeProfitPlaceholder: "100",
      
      // Results Section
      resultsTitle: "Rezultate",
      lotSizeLabel: "Mărimea lotului:",
      lotSizeUnit: "loturi",
      stopLossValueLabel: "Valoarea Stop Loss:",
      takeProfitValueLabel: "Valoarea Take Profit:",
      riskRewardLabel: "Raportul Risk/Reward:",
      
      // Pair Info
      pairInfoTitle: "Informații despre",
      categoryLabel: "Categoria:",
      pipValueLabel: "Valoare pip per 1 lot:",
      
      // How to Use Section
      howToUseTitle: "Cum să folosești calculatorul",
      step1Title: "Pasul 1: Completează datele",
      step1Point1Title: "Selectează instrumentul:",
      step1Point1Desc: "Alege perechea valutară sau instrumentul pe care vrei să îl tranzacționezi (EUR/USD, Gold, etc.)",
      step1Point2Title: "Mărimea contului:",
      step1Point2Desc: "Introdu valoarea totală a contului tău de trading în dolari americani",
      step1Point3Title: "Riscul per trade:",
      step1Point3Desc: "Setează procentul din cont pe care ești dispus să îl riști (recomandat: 1-1.5%)",
      step1Point4Title: "Stop Loss:",
      step1Point4Desc: "Distanța în pips până la nivelul unde vei închide poziția la pierdere",
      
      step2Title: "Pasul 2: Interpretează rezultatele",
      step2Point1Title: "Valoarea Stop Loss:",
      step2Point1Desc: "Suma exactă în dolari pe care o vei pierde dacă se atinge Stop Loss-ul",
      step2Point2Title: "Mărimea lotului:",
      step2Point2Desc: "Dimensiunea poziției calculate pentru a respecta riscul stabilit",
      step2Point3Title: "Risk/Reward:",
      step2Point3Desc: "Raportul dintre profit potențial și pierderea maximă",
      
      importantTitle: "Important de reținut:",
      importantPoint1: "Calculatorul folosește valorile pip corecte pentru fiecare instrument",
      importantPoint2: "Stop Loss-ul trebuie să fie bazat pe analiza tehnică, nu pe distanță arbitrară",
      importantPoint3: "Verifică întotdeauna calculele înainte de a deschide poziția",
      importantPoint4: "Respectă disciplina și nu modifica lotul pe baza emoțiilor",
      
      // Info Note
      infoNoteTitle: "Știai că...?",
      infoNoteText: "Mai jos găsești",
      infoNoteBold: "Calculatorul de Pip",
      infoNoteText2: "cu explicații detaliate despre ce sunt pipsii și cum se calculează valoarea lor pe XAUUSD. Scroll în jos pentru a afla mai multe! 👇",
      
      // Pip Information
      pipInfoTitle: "Ce sunt pipsii pe XAUUSD?",
      pipInfoText1: "Pipul este o unitate mică folosită pentru a măsura mișcarea prețului.",
      pipInfoText2: "Pe XAUUSD (aur), un pip reprezintă o schimbare de",
      pipInfoText2Highlight: "0.1",
      pipInfoText2End: "în prețul aurului.",
      pipInfoExample: "Exemplu:",
      pipInfoExampleText: "Dacă prețul aurului crește de la 3980.00 la 3980.10, atunci s-a mișcat 1 pip.",
      pipValueTitle: "Valoarea unui pip",
      pipValueText1: "Valoarea pipului variază în funcție de dimensiunea lotului tranzacționat.",
      pipValueText2: "Un lot standard (1 lot) = 100 uncii de aur, iar valoarea unui pip pentru 1 lot este de",
      pipValueHighlight: "10 USD",
      
      // Pip Calculator
      pipCalculatorTitle: "Calculator Pip",
      pipCalculatorLabel: "Introdu valoarea lotului:",
      pipCalculatorValue: "Valoare pip:",
      
      // Pip Table
      tableHeaderLots: "Loturi",
      tableHeaderPipValue: "Valoare pip",
      tableHeader10Pips: "10 pipsi",
    }
  },
  en: {
    calculator: {
      // Header
      title: "Lot",
      titleHighlight: "Calculator",
      subtitle: "Calculate the optimal lot size for each trade based on desired risk",
      
      // Input Section
      inputTitle: "Input Parameters",
      pairLabel: "Currency Pair / Instrument",
      pairPlaceholder: "Select instrument...",
      searchPlaceholder: "Search instrument...",
      accountSizeLabel: "Account Size ($)",
      accountSizePlaceholder: "10000",
      riskPerTradeLabel: "Risk per Trade (%)",
      riskPerTradePlaceholder: "2",
      stopLossLabel: "Stop Loss (pips)",
      stopLossPlaceholder: "50",
      takeProfitLabel: "Take Profit (pips) - optional",
      takeProfitPlaceholder: "100",
      
      // Results Section
      resultsTitle: "Results",
      lotSizeLabel: "Lot Size:",
      lotSizeUnit: "lots",
      stopLossValueLabel: "Stop Loss Value:",
      takeProfitValueLabel: "Take Profit Value:",
      riskRewardLabel: "Risk/Reward Ratio:",
      
      // Pair Info
      pairInfoTitle: "Information about",
      categoryLabel: "Category:",
      pipValueLabel: "Pip value per 1 lot:",
      
      // How to Use Section
      howToUseTitle: "How to Use the Calculator",
      step1Title: "Step 1: Fill in the Data",
      step1Point1Title: "Select the instrument:",
      step1Point1Desc: "Choose the currency pair or instrument you want to trade (EUR/USD, Gold, etc.)",
      step1Point2Title: "Account size:",
      step1Point2Desc: "Enter the total value of your trading account in US dollars",
      step1Point3Title: "Risk per trade:",
      step1Point3Desc: "Set the percentage of your account you're willing to risk (recommended: 1-1.5%)",
      step1Point4Title: "Stop Loss:",
      step1Point4Desc: "Distance in pips to the level where you'll close the position at a loss",
      
      step2Title: "Step 2: Interpret the Results",
      step2Point1Title: "Stop Loss Value:",
      step2Point1Desc: "The exact amount in dollars you'll lose if the Stop Loss is hit",
      step2Point2Title: "Lot Size:",
      step2Point2Desc: "The position size calculated to respect the established risk",
      step2Point3Title: "Risk/Reward:",
      step2Point3Desc: "The ratio between potential profit and maximum loss",
      
      importantTitle: "Important to Remember:",
      importantPoint1: "The calculator uses the correct pip values for each instrument",
      importantPoint2: "Stop Loss should be based on technical analysis, not arbitrary distance",
      importantPoint3: "Always verify calculations before opening a position",
      importantPoint4: "Maintain discipline and don't modify lot size based on emotions",
      
      // Info Note
      infoNoteTitle: "Did you know...?",
      infoNoteText: "Below you'll find the",
      infoNoteBold: "Pip Calculator",
      infoNoteText2: "with detailed explanations about what pips are and how to calculate their value on XAUUSD. Scroll down to learn more! 👇",
      
      // Pip Information
      pipInfoTitle: "What are pips on XAUUSD?",
      pipInfoText1: "A pip is a small unit used to measure price movement.",
      pipInfoText2: "On XAUUSD (gold), a pip represents a change of",
      pipInfoText2Highlight: "0.1",
      pipInfoText2End: "in the gold price.",
      pipInfoExample: "Example:",
      pipInfoExampleText: "If the gold price rises from 3980.00 to 3980.10, it has moved 1 pip.",
      pipValueTitle: "Pip Value",
      pipValueText1: "The pip value varies depending on the lot size traded.",
      pipValueText2: "One standard lot (1 lot) = 100 ounces of gold, and the pip value for 1 lot is",
      pipValueHighlight: "10 USD",
      
      // Pip Calculator
      pipCalculatorTitle: "Pip Calculator",
      pipCalculatorLabel: "Enter lot value:",
      pipCalculatorValue: "Pip value:",
      
      // Pip Table
      tableHeaderLots: "Lots",
      tableHeaderPipValue: "Pip value",
      tableHeader10Pips: "10 pips",
    }
  }
};
