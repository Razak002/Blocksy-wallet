"use client"

import { BsGlobeAmericas, BsGraphUpArrow, BsLightning, BsLock, BsArrowUp, BsArrowDown } from "react-icons/bs"
import { useEffect, useState } from "react"

const Market = () => {
  const [prices, setPrices] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,dogecoin,cardano,ripple,polkadot,polygon,avalanche-2,shiba-inu&vs_currencies=usd&include_24hr_change=true",
        )

        if (!res.ok) throw new Error("Failed to fetch data")

        const data = await res.json()
        setPreviousPrices(prices)
        setPrices(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load market data")
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading)
    return (
      <section className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6  text-white">
        <div className="animate-pulse space-y-8">
          <div className="h-32 rounded-lg w-96"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )

  const coinData = {
    bitcoin: { name: "Bitcoin", symbol: "BTC", color: "text-orange-400" },
    ethereum: { name: "Ethereum", symbol: "ETH", color: "text-blue-400" },
    solana: { name: "Solana", symbol: "SOL", color: "text-purple-400" },
    binancecoin: { name: "BNB", symbol: "BNB", color: "text-yellow-400" },
    dogecoin: { name: "Dogecoin", symbol: "DOGE", color: "text-yellow-300" },
    cardano: { name: "Cardano", symbol: "ADA", color: "text-blue-300" },
    ripple: { name: "XRP", symbol: "XRP", color: "text-gray-300" },
    polkadot: { name: "Polkadot", symbol: "DOT", color: "text-pink-400" },
    polygon: { name: "Polygon", symbol: "MATIC", color: "text-purple-300" },
    "avalanche-2": { name: "Avalanche", symbol: "AVAX", color: "text-red-400" },
    "shiba-inu": { name: "Shiba Inu", symbol: "SHIB", color: "text-orange-300" },
  }

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6  text-white">
      <div className="text-center mb-12">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            A Global Crypto Market,
            <br />
            <span className="text-[#2952e3] animate-pulse">Open to Everyone</span>
          </h2>

          <p className="text-center text-[20px] sm:text-xl lg:text-2xl max-w-4xl mx-auto mb-8 text-slate-200 leading-relaxed">
            Trade, send, and grow your crypto portfolio with ease. Whether you&#39;re buying Bitcoin, swapping Ethereum, or
            sending USDT across borders
            <span className="font-semibold text-[#2952e3] bg-blue-500/20 px-2 py-1 rounded-lg mx-2 border border-blue-500/30">
              {" "}
              Blocksy
            </span>{" "}
            makes it fast, secure, and accessible worldwide.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm cursor-pointer">
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl font-bold text-white group-hover:text-[#2952e3] transition-colors">$2.4B+</div>
            <div className="text-slate-300">Trading Volume</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl font-bold text-white group-hover:text-[#2952e3] transition-colors">150+</div>
            <div className="text-slate-300">Countries</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl font-bold text-white group-hover:text-[#2952e3] transition-colors">1M+</div>
            <div className="text-slate-300">Active Users</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mb-12">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl border border-slate-600/50 text-center hover:scale-105 hover:border-[#2952e3]/50 transition-all duration-300 group">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-[#2952e3]/20 rounded-full group-hover:bg-[#2952e3]/30 transition-colors">
              <BsGlobeAmericas size={32} className="text-[#2952e3]" />
            </div>
          </div>
          <h3 className="mt-2 font-semibold text-xl mb-2 text-white">Global Reach</h3>
          <p className="text-sm text-slate-300">Buy & sell crypto in 150+ countries</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl border border-slate-600/50 text-center hover:scale-105 hover:border-[#2952e3]/50 transition-all duration-300 group">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-[#2952e3]/20 rounded-full group-hover:bg-[#2952e3]/30 transition-colors">
              <BsLightning size={32} className="text-[#2952e3]" />
            </div>
          </div>
          <h3 className="mt-2 font-semibold text-xl mb-2 text-white">Instant Transactions</h3>
          <p className="text-sm text-slate-300">Lightning-fast settlements with low fees</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl border border-slate-600/50 text-center hover:scale-105 hover:border-[#2952e3]/50 transition-all duration-300 group">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-[#2952e3]/20 rounded-full group-hover:bg-[#2952e3]/30 transition-colors">
              <BsLock size={32} className="text-[#2952e3]" />
            </div>
          </div>
          <h3 className="mt-2 font-semibold text-xl mb-2 text-white">Secure & Transparent</h3>
          <p className="text-sm text-slate-300">Backed by blockchain technology</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl border border-slate-600/50 text-center hover:scale-105 hover:border-[#2952e3]/50 transition-all duration-300 group">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-[#2952e3]/20 rounded-full group-hover:bg-[#2952e3]/30 transition-colors">
              <BsGraphUpArrow size={32} className="text-[#2952e3]" />
            </div>
          </div>
          <h3 className="mt-2 font-semibold text-xl mb-2 text-white">Growing Adoption</h3>
          <p className="text-sm text-slate-300">Trusted by thousands of crypto users</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <button className="bg-gradient-to-r from-[#2952e3] to-[#1e3a8a] text-white font-semibold px-8 py-4 rounded-xl hover:from-[#1e3a8a] hover:to-[#2952e3] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Start Trading
        </button>
        <button className="border-2 border-[#2952e3] text-[#2952e3] font-semibold px-8 py-4 rounded-xl hover:bg-[#2952e3] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Connect Wallet
        </button>
      </div>

      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Live Crypto Market Trends
          </h2>
          <p className="text-slate-300">Real-time prices updated every 30 seconds</p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">{error}</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(prices).map((coin) => {
            const data = coinData[coin]
            const price = prices[coin]?.usd
            const change24h = prices[coin]?.usd_24h_change
            const isPositive = change24h > 0

            return (
              <div
                key={coin}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-600/50 hover:border-[#2952e3]/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${data?.color || "bg-slate-400"} animate-pulse`}></div>
                    <div>
                      <h3 className="font-semibold text-white">{data?.name || coin}</h3>
                      <p className="text-sm text-slate-300">{data?.symbol || coin.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${isPositive ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    {isPositive ? (
                      <BsArrowUp className="text-green-400" size={16} />
                    ) : (
                      <BsArrowDown className="text-red-400" size={16} />
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-white mb-1">
                    ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  {change24h && (
                    <div className={`text-sm font-medium ${isPositive ? "text-green-300" : "text-red-300"}`}>
                      {isPositive ? "+" : ""}
                      {change24h.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Market
