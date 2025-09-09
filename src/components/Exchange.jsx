
"use client"

import { useEffect, useState } from "react"
import {
  BsArrowUpRight,
  BsArrowDownRight,
  BsGraphUp,
  BsClock,
  BsLightning,
  BsGlobe,
  BsSearch,
  BsStar,
  BsStarFill,
} from "react-icons/bs"

const mockPrices = {
  BTC: { price: 67000, volume: "2.4B", change: 1.5 },
  ETH: { price: 3000, volume: "1.2B", change: -0.5 },
}

const orderBookData = {
  asks: [
    { price: 67500, amount: 0.5, total: 33750 },
    { price: 68000, amount: 1.0, total: 68000 },
    { price: 68500, amount: 1.5, total: 102750 },
  ],
  bids: [
    { price: 66500, amount: 0.5, total: 33250 },
    { price: 66000, amount: 1.0, total: 66000 },
    { price: 65500, amount: 1.5, total: 98250 },
  ],
}

const recentTrades = [
  { price: 67200, amount: 0.25, time: "10:00 AM", type: "buy" },
  { price: 66900, amount: 0.5, time: "10:05 AM", type: "sell" },
  { price: 67100, amount: 0.75, time: "10:10 AM", type: "buy" },
]

const Exchange = () => {
  const [selectedPair, setSelectedPair] = useState("BTC/USD")
  const [orderType, setOrderType] = useState("market")
  const [tradeType, setTradeType] = useState("buy")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")
  const [watchlist, setWatchlist] = useState(["BTC", "ETH"])
  const [balance, setBalance] = useState({ USD: 10000, BTC: 0.5, ETH: 2 })
  const [orders, setOrders] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleWatchlist = (symbol) => {
    setWatchlist((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]))
  }

  // Get current market price
  const getCurrentPrice = () => {
    const symbol = selectedPair.split("/")[0]
    return mockPrices[symbol]?.price || 0
  }

  // Calculate order total
  const calculateTotal = () => {
    const amountNum = Number.parseFloat(amount) || 0
    const currentPrice = getCurrentPrice()
    const orderPrice = orderType === "market" ? currentPrice : Number.parseFloat(price) || currentPrice
    return amountNum * orderPrice
  }

  // Set percentage of available balance
  const setPercentage = (percentage) => {
    const symbol = selectedPair.split("/")[0]
    const currentPrice = getCurrentPrice()
    const orderPrice = orderType === "market" ? currentPrice : Number.parseFloat(price) || currentPrice

    if (tradeType === "buy") {
      const availableUSD = balance.USD * (percentage / 100)
      const maxAmount = availableUSD / orderPrice
      setAmount(maxAmount.toFixed(8))
    } else {
      const availableToken = balance[symbol] || 0
      const sellAmount = availableToken * (percentage / 100)
      setAmount(sellAmount.toFixed(8))
    }
  }

  // Validate order
  const validateOrder = () => {
    const amountNum = Number.parseFloat(amount)
    const priceNum = Number.parseFloat(price)
    const symbol = selectedPair.split("/")[0]
    const currentPrice = getCurrentPrice()
    const orderPrice = orderType === "market" ? currentPrice : priceNum
    const total = calculateTotal()

    if (!amountNum || amountNum <= 0) {
      return "Please enter a valid amount"
    }

    if (orderType === "limit" && (!priceNum || priceNum <= 0)) {
      return "Please enter a valid price"
    }

    if (tradeType === "buy") {
      if (total > balance.USD) {
        return `Insufficient USD balance. Available: $${balance.USD.toFixed(2)}`
      }
    } else {
      const availableToken = balance[symbol] || 0
      if (amountNum > availableToken) {
        return `Insufficient ${symbol} balance. Available: ${availableToken.toFixed(8)}`
      }
    }

    return null
  }

  // Submit order
  const handleSubmitOrder = async () => {
    const error = validateOrder()
    if (error) {
      alert(error)
      return
    }

    setIsSubmitting(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const amountNum = Number.parseFloat(amount)
    const symbol = selectedPair.split("/")[0]
    const currentPrice = getCurrentPrice()
    const orderPrice = orderType === "market" ? currentPrice : Number.parseFloat(price)
    const total = amountNum * orderPrice

    const newOrder = {
      id: Date.now(),
      pair: selectedPair,
      type: orderType,
      side: tradeType,
      amount: amountNum,
      price: orderPrice,
      total: total,
      status: orderType === "market" ? "filled" : "pending",
      timestamp: new Date().toLocaleString(),
    }

    if (orderType === "market") {
      if (tradeType === "buy") {
        setBalance((prev) => ({
          ...prev,
          USD: prev.USD - total,
          [symbol]: (prev[symbol] || 0) + amountNum,
        }))
      } else {
        setBalance((prev) => ({
          ...prev,
          USD: prev.USD + total,
          [symbol]: (prev[symbol] || 0) - amountNum,
        }))
      }
      setOrderHistory((prev) => [newOrder, ...prev])
    } else {
      setOrders((prev) => [newOrder, ...prev])
    }
    setAmount("")
    setPrice("")
    setIsSubmitting(false)

    alert(`${orderType === "market" ? "Order executed" : "Order placed"} successfully!`)
  }

  const cancelOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      new window.TradingView.widget({
        container_id: "tradingview_chart",
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "15",
        theme: "dark",
        style: "1",
        locale: "en",
      })
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-3 xl:order-1">
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BsGraphUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Account Balance
                </h3>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">USD:</span>
                    <span className="font-mono">${balance.USD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BTC:</span>
                    <span className="font-mono">{balance.BTC.toFixed(8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ETH:</span>
                    <span className="font-mono">{balance.ETH.toFixed(8)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BsGraphUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Market Overview
                </h3>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">24h Volume</div>
                    <div className="font-semibold text-primary">$2.4B</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Active Pairs</div>
                    <div className="font-semibold">247</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Market Cap</div>
                    <div className="font-semibold text-accent">$1.2T</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Fear & Greed</div>
                    <div className="font-semibold text-yellow-500">72</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BsStar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Watchlist
                  </span>
                  <div className="relative">
                    <BsSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      placeholder="Search..."
                      className="pl-10 h-8 w-24 sm:w-32 text-xs bg-background/50 border border-border rounded-md px-3 py-1 text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </h3>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                {Object.entries(mockPrices).map(([symbol, data]) => (
                  <div
                    key={symbol}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-accent/10 cursor-pointer transition-colors group"
                    onClick={() => setSelectedPair(`${symbol}/USD`)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWatchlist(symbol)
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {watchlist.includes(symbol) ? (
                          <BsStarFill className="w-4 h-4 text-primary" />
                        ) : (
                          <BsStar className="w-4 h-4" />
                        )}
                      </button>
                      <div>
                        <div className="font-semibold text-sm">{symbol}/USD</div>
                        <div className="text-xs text-muted-foreground">Vol: {data.volume}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">${data.price.toLocaleString()}</div>
                      <div
                        className={`text-xs flex items-center gap-1 ${
                          data.change >= 0 ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {data.change >= 0 ? (
                          <BsArrowUpRight className="w-3 h-3" />
                        ) : (
                          <BsArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(data.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-4 sm:space-y-6 order-1 xl:order-2">
            {/* Price Header */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedPair}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-mono">${mockPrices.BTC.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-primary">
                        <BsArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">+{mockPrices.BTC.change}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div>
                      24h High: <span className="text-white">$68,245</span>
                    </div>
                    <div>
                      24h Low: <span className="text-white">$66,890</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      24h Vol: <span className="text-white">{mockPrices.BTC.volume}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold">Price Chart</h3>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-md hover:bg-accent/10">
                      1m
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-md hover:bg-accent/10">
                      5m
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-md hover:bg-accent/10">
                      1h
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors">
                      1d
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-white transition-colors rounded-md hover:bg-accent/10">
                      1w
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 h-60 sm:h-80">
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center border border-border/50">
                  <div className="flex flex-col justify-center items-center w-full h-full">
                    <div id="tradingview_chart" className="w-full h-full min-h-[200px]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Form */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BsLightning className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Place Order
                </h3>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Buy Form */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTradeType("buy")}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          tradeType === "buy"
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-border hover:bg-accent/10"
                        }`}
                      >
                        Buy {selectedPair.split("/")[0]}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setOrderType("market")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          orderType === "market"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-white hover:bg-accent/10"
                        }`}
                      >
                        Market
                      </button>
                      <button
                        onClick={() => setOrderType("limit")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          orderType === "limit"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-white hover:bg-accent/10"
                        }`}
                      >
                        Limit
                      </button>
                    </div>

                    <div className="space-y-3">
                      {orderType === "limit" && (
                        <div>
                          <label className="text-sm text-muted-foreground">Price (USD)</label>
                          <input
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full font-mono bg-background/50 border border-border rounded-md px-3 py-2 text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-foreground">Amount (BTC)</label>
                        <input
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full font-mono bg-background/50 border border-border rounded-md px-3 py-2 text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setPercentage(25)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          25%
                        </button>
                        <button
                          onClick={() => setPercentage(50)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          50%
                        </button>
                        <button
                          onClick={() => setPercentage(75)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          75%
                        </button>
                        <button
                          onClick={() => setPercentage(100)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          100%
                        </button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Total: <span className="text-white font-mono">${calculateTotal().toFixed(2)}</span>
                      </div>

                      <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : `Buy ${selectedPair.split("/")[0]}`}
                      </button>
                    </div>
                  </div>

                  {/* Sell Form */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTradeType("sell")}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          tradeType === "sell"
                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            : "border border-border hover:bg-accent/10"
                        }`}
                      >
                        Sell {selectedPair.split("/")[0]}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setOrderType("market")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          orderType === "market"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-white hover:bg-accent/10"
                        }`}
                      >
                        Market
                      </button>
                      <button
                        onClick={() => setOrderType("limit")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          orderType === "limit"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-white hover:bg-accent/10"
                        }`}
                      >
                        Limit
                      </button>
                    </div>

                    <div className="space-y-3">
                      {orderType === "limit" && (
                        <div>
                          <label className="text-sm text-muted-foreground">Price (USD)</label>
                          <input
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full font-mono bg-background/50 border border-border rounded-md px-3 py-2 text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-foreground">Amount (BTC)</label>
                        <input
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full font-mono bg-background/50 border border-border rounded-md px-3 py-2 text-black placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setPercentage(25)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          25%
                        </button>
                        <button
                          onClick={() => setPercentage(50)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          50%
                        </button>
                        <button
                          onClick={() => setPercentage(75)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          75%
                        </button>
                        <button
                          onClick={() => setPercentage(100)}
                          className="flex-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium border border-border rounded-md hover:bg-accent/10 transition-colors bg-transparent"
                        >
                          100%
                        </button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Total: <span className="text-white font-mono">${calculateTotal().toFixed(2)}</span>
                      </div>

                      <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : `Sell ${selectedPair.split("/")[0]}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6 order-2 xl:order-3">
            {/* Order Book */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BsClock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Order Book
                </h3>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4">
                {/* Asks */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2 px-2">
                    <span>Price (USD)</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Total</span>
                  </div>
                  {orderBookData.asks.reverse().map((ask, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono grid grid-cols-3 gap-2 p-2 hover:bg-destructive/10 rounded cursor-pointer"
                    >
                      <span className="text-destructive">{ask.price.toLocaleString()}</span>
                      <span className="text-right">{ask.amount}</span>
                      <span className="text-right text-muted-foreground">{ask.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Spread */}
                <div className="text-center py-2 border-y border-border">
                  <div className="text-lg font-mono font-bold">${mockPrices.BTC.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Spread: $10.25</div>
                </div>

                {/* Bids */}
                <div className="space-y-1">
                  {orderBookData.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="text-xs font-mono grid grid-cols-3 gap-2 p-2 hover:bg-primary/10 rounded cursor-pointer"
                    >
                      <span className="text-primary">{bid.price.toLocaleString()}</span>
                      <span className="text-right">{bid.amount}</span>
                      <span className="text-right text-muted-foreground">{bid.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Trades / Open Orders */}
            <div className="bg-card/50 backdrop-blur-sm border border-[#2952e3] rounded-lg">
              <div className="p-3 sm:p-4 pb-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <BsGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {orders.length > 0 ? "Open Orders" : "Recent Trades"}
                </h3>
              </div>
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                {orders.length > 0 ? (
                  <>
                    <div className="text-xs text-muted-foreground grid grid-cols-4 gap-2 px-2">
                      <span>Pair</span>
                      <span>Type</span>
                      <span>Price</span>
                      <span>Action</span>
                    </div>
                    {orders.map((order) => (
                      <div key={order.id} className="text-xs grid grid-cols-4 gap-2 p-2 hover:bg-accent/10 rounded">
                        <span className="font-mono">{order.pair}</span>
                        <span className={order.side === "buy" ? "text-primary" : "text-destructive"}>
                          {order.side.toUpperCase()}
                        </span>
                        <span className="font-mono">${order.price.toFixed(2)}</span>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-destructive hover:text-destructive/80 text-left"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2 px-2">
                      <span>Price (USD)</span>
                      <span className="text-right">Amount</span>
                      <span className="text-right">Time</span>
                    </div>
                    {recentTrades.map((trade, index) => (
                      <div
                        key={index}
                        className="text-xs font-mono grid grid-cols-3 gap-2 p-2 hover:bg-accent/10 rounded"
                      >
                        <span className={trade.type === "buy" ? "text-primary" : "text-destructive"}>
                          {trade.price.toLocaleString()}
                        </span>
                        <span className="text-right">{trade.amount}</span>
                        <span className="text-right text-muted-foreground">{trade.time}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exchange
