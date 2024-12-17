import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      // Map specific tokens to their correct exchange and pair
      const getSymbolPair = (tokenSymbol: string) => {
        const symbolMap: { [key: string]: string } = {
          'WIF': 'BINANCE:WIFUSDT',
          'BONK': 'RAYDIUM:BONKUSDT',
          'MYRO': 'RAYDIUM:MYROUSDT',
          'POPCAT': 'RAYDIUM:POPCATUSDT',
          'SLERF': 'RAYDIUM:SLERFUSDT',
          // Add more mappings as needed
        };
        return symbolMap[tokenSymbol] || `RAYDIUM:${tokenSymbol}USDT`;
      };

      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: getSymbolPair(symbol),
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        calendar: false,
        support_host: "https://www.tradingview.com",
        backgroundColor: "rgba(19, 20, 31, 1)",
        gridColor: "rgba(42, 47, 60, 0.1)",
        hide_side_toolbar: false,
      });
      container.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="text-blue-500">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);