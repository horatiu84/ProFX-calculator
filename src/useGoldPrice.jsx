import { useEffect, useState, useCallback } from "react";

const useGoldPrice = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGoldPrice = useCallback(async () => {
    setLoading(true);
    try {
      const proxyUrl =
        "https://corsproxy.io/?" +
        encodeURIComponent(
          "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD"
        );

      const res = await fetch(proxyUrl);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const prices = data[0].spreadProfilePrices;
        const standard = prices.find((p) => p.spreadProfile === "standard");

        if (standard) {
          const bid = standard.bid;
          const ask = standard.ask;
          const avg = ((bid + ask) / 2).toFixed(2);
          setGoldPrice(avg);
        }
      }
    } catch (err) {
      console.error("Eroare la preluarea prețului XAU:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoldPrice(); // doar la prima încărcare
  }, [fetchGoldPrice]);

  return { goldPrice, fetchGoldPrice, loading };
};

export default useGoldPrice;
