import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/vxness.png";
import {
  Menu as FiMenu,
  X as FiX,
  ChevronRight as FiChevronRight,
  TrendingUp as FiTrendingUp,
  Shield as FiShield,
  Zap as FiZap,
  Users as FiUsers,
  Check as FiCheck,
  BarChart2 as FiBarChart2,
  Globe as FiGlobe,
  Lock as FiLock,
  ChevronLeft as FiChevronLeft,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollY, setScrollY] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [currentMarketIndex, setCurrentMarketIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Trading tools carousel data
  const tradingTools = [
    {
      id: 1,
      title: "Advanced Charting",
      description: "Professional trading charts with 100+ technical indicators and drawing tools.",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Analysis"
    },
    {
      id: 2,
      title: "Algorithmic Trading",
      description: "Build and deploy automated trading bots with our visual strategy builder.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Automation"
    },
    {
      id: 3,
      title: "Risk Management",
      description: "Set stop-loss, take-profit, and trailing stops with advanced order types.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Protection"
    },
    {
      id: 4,
      title: "Portfolio Tracker",
      description: "Monitor all your investments in one dashboard with real-time P&L calculations.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Tracking"
    },
    {
      id: 5,
      title: "Market Scanner",
      description: "Real-time scanner for finding trading opportunities across all markets.",
      image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Discovery"
    },
    {
      id: 6,
      title: "Backtesting Suite",
      description: "Test your trading strategies against historical data with detailed analytics.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Testing"
    },
    {
      id: 7,
      title: "Trading Journal",
      description: "Log and analyze every trade to improve your trading performance.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Analytics"
    },
    {
      id: 8,
      title: "Mobile Trading",
      description: "Full-featured trading app for iOS and Android with push notifications.",
      image: "https://images.unsplash.com/photo-1546054451-aa739e5c4b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Mobile"
    }
  ];

  // Carousel autoplay
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % tradingTools.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, tradingTools.length]);

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % tradingTools.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => prev === 0 ? tradingTools.length - 1 : prev - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section based on scroll position
      const sections = ["home", "features", "tools", "markets", "security", "faq"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Generate animated chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const basePrice = markets[currentMarketIndex].price.replace(/[$,]/g, '');
      const numPrice = parseFloat(basePrice);
      const changePercent = parseFloat(markets[currentMarketIndex].change.replace(/[%+]/g, ''));
      const isPositive = markets[currentMarketIndex].changeType === "positive";
      
      for (let i = 0; i < 20; i++) {
        // Increased volatility for more up-down movement
        const randomVariation = (Math.random() - 0.5) * 0.06;
        const trend = isPositive ? 0.002 * i : -0.002 * i;
        const wavePattern = Math.sin(i * 0.5) * 0.03;
        
        const price = numPrice * (1 + trend + randomVariation + wavePattern + (changePercent / 100) * (i / 20));
        
        data.push({
          time: `${i}:00`,
          price: price,
          volume: Math.random() * 1000000000 + 500000000,
        });
      }
      return data;
    };

    setChartData(generateChartData());

    // Auto-rotate through markets every 5 seconds
    const interval = setInterval(() => {
      setCurrentMarketIndex((prev) => (prev + 1) % markets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentMarketIndex]);

  // Dashboard preview chart data and order book
  const [dashboardChartData, setDashboardChartData] = useState([]);
  const [buyOrders, setBuyOrders] = useState([
    { price: 42.85, amount: 1.2 },
    { price: 42.84, amount: 1.7 },
    { price: 42.83, amount: 2.2 }
  ]);
  const [sellOrders, setSellOrders] = useState([
    { price: 42.86, amount: 0.8 },
    { price: 42.87, amount: 1.2 },
    { price: 42.88, amount: 1.6 }
  ]);
  const [currentPrice, setCurrentPrice] = useState(42.855);
  const [orderBookSpread, setOrderBookSpread] = useState({ bid: 42.85, ask: 42.86 });
  const [priceTrend, setPriceTrend] = useState('up');
  const [volatility, setVolatility] = useState(0.5);

  useEffect(() => {
    const generateDashboardData = () => {
      const data = [];
      let price = currentPrice;
      
      for (let i = 0; i < 15; i++) {
        const wavePattern = Math.sin(i * 0.8) * 0.02;
        const randomStep = (Math.random() - 0.5) * 0.08;
        
        const trendMultiplier = priceTrend === 'up' ? 0.0008 : -0.0008;
        const trend = trendMultiplier * i;
        
        price = price * (1 + randomStep + wavePattern + trend);
        
        data.push({
          time: i,
          price: price,
        });
      }
      return data;
    };

    const updateOrderBook = () => {
      if (Math.random() > 0.7) {
        setPriceTrend(prev => prev === 'up' ? 'down' : 'up');
      }
      
      if (Math.random() > 0.8) {
        setVolatility(prev => Math.min(prev + 0.1, 0.9));
      } else if (Math.random() > 0.9) {
        setVolatility(prev => Math.max(prev - 0.1, 0.2));
      }

      const priceChange = (Math.random() - 0.5) * 0.4 * volatility;
      const newCurrentPrice = currentPrice * (1 + priceChange / 100);
      setCurrentPrice(newCurrentPrice);

      const newBuyOrders = [];
      let buyPrice = newCurrentPrice * (0.99 - volatility * 0.01);
      let totalBuyAmount = 0;
      
      for (let i = 0; i < 3; i++) {
        const priceStep = 0.02 + Math.random() * 0.03;
        const price = buyPrice - (i * priceStep);
        
        const amount = (0.8 + i * 0.4) + Math.random() * 0.8;
        totalBuyAmount += amount;
        
        newBuyOrders.push({ 
          price: parseFloat(price.toFixed(3)), 
          amount: parseFloat(amount.toFixed(2)) 
        });
      }

      const newSellOrders = [];
      let sellPrice = newCurrentPrice * (1.01 + volatility * 0.01);
      let totalSellAmount = 0;
      
      for (let i = 0; i < 3; i++) {
        const priceStep = 0.02 + Math.random() * 0.03;
        const price = sellPrice + (i * priceStep);
        
        const amount = (0.5 + i * 0.3) + Math.random() * 0.6;
        totalSellAmount += amount;
        
        newSellOrders.push({ 
          price: parseFloat(price.toFixed(3)), 
          amount: parseFloat(amount.toFixed(2)) 
        });
      }

      setOrderBookSpread({
        bid: newBuyOrders[0].price,
        ask: newSellOrders[0].price
      });

      return { buyOrders: newBuyOrders, sellOrders: newSellOrders };
    };

    setDashboardChartData(generateDashboardData());

    const interval = setInterval(() => {
      const { buyOrders: newBuyOrders, sellOrders: newSellOrders } = updateOrderBook();
      setBuyOrders(newBuyOrders);
      setSellOrders(newSellOrders);
      setDashboardChartData(generateDashboardData());
    }, 1200);

    return () => clearInterval(interval);
  }, [currentPrice, priceTrend, volatility]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
    setActiveSection(sectionId);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    // window.location.href = "http://localhost:5173/login";
    navigate("/login");
  };

  const handleSignUp = () => {
    setIsMenuOpen(false);
    // window.location.href = "http://localhost:5173/signup";
    navigate("/signup");
  };

  const features = [
    {
      icon: <FiTrendingUp />,
      title: "Real-time Trading",
      desc: "Live market data with instant execution for all your trades.",
    },
    {
      icon: <FiShield />,
      title: "Secure Platform",
      desc: "Bank-level security with multi-signature wallets and cold storage.",
    },
    {
      icon: <FiZap />,
      title: "Lightning Fast",
      desc: "High-speed trading engine capable of processing thousands of transactions per second.",
    },
    {
      icon: <FiUsers />,
      title: "Social Trading",
      desc: "Follow expert traders and copy their strategies automatically.",
    },
    {
      icon: <FiBarChart2 />,
      title: "Advanced Charts",
      desc: "Professional trading tools with multiple chart types and indicators.",
    },
    {
      icon: <FiGlobe />,
      title: "Global Access",
      desc: "Trade from anywhere in the world with multi-language support.",
    },
  ];

  const stats = [
    { value: "500K+", label: "Active Users" },
    { value: "$2.5B+", label: "Trade Volume" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Markets" },
  ];

  const markets = [
    {
      symbol: "BTC/USDT",
      price: "$42,856.32",
      change: "+5.2%",
      volume: "$18.4B",
      changeType: "positive",
    },
    {
      symbol: "ETH/USDT",
      price: "$2,345.67",
      change: "+3.8%",
      volume: "$8.2B",
      changeType: "positive",
    },
    {
      symbol: "SOL/USDT",
      price: "$102.45",
      change: "-2.1%",
      volume: "$1.5B",
      changeType: "negative",
    },
    {
      symbol: "XRP/USDT",
      price: "$0.6234",
      change: "+1.5%",
      volume: "$850M",
      changeType: "positive",
    },
    {
      symbol: "ADA/USDT",
      price: "$0.5123",
      change: "+0.8%",
      volume: "$450M",
      changeType: "positive",
    },
    {
      symbol: "DOT/USDT",
      price: "$7.89",
      change: "-1.2%",
      volume: "$320M",
      changeType: "negative",
    },
  ];

  const faqs = [
    {
      question: "Is Vxness available worldwide?",
      answer:
        "Yes, Vxness is available in over 150 countries with localized support for major regions.",
    },
    {
      question: "What are the trading fees?",
      answer:
        "We offer competitive fees starting from 0.1% for makers and 0.2% for takers, with discounts for high-volume traders.",
    },
    {
      question: "How secure is my funds?",
      answer:
        "We use industry-leading security measures including cold storage, 2FA, and insurance on digital assets.",
    },
    {
      question: "Can I trade on mobile?",
      answer:
        "Yes, Vxness offers fully-featured iOS and Android apps with all desktop functionality.",
    },
    {
      question: "What cryptocurrencies are supported?",
      answer:
        "We support over 150 cryptocurrencies including Bitcoin, Ethereum, Solana, and many more.",
    },
    {
      question: "How do I deposit funds?",
      answer:
        "You can deposit via bank transfer, credit card, or cryptocurrency transfer from external wallets.",
    },
  ];

  const securityFeatures = [
    "Multi-signature wallets",
    "Cold storage for 98% of assets",
    "Two-factor authentication (2FA)",
    "Real-time monitoring & alerts",
    "Insurance on digital assets",
    "Regular security audits",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50
            ? "bg-gray-900/95 backdrop-blur-md py-3"
            : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="Vxness Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className={`font-medium transition-colors ${activeSection === "home"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`font-medium transition-colors ${activeSection === "features"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("tools")}
                className={`font-medium transition-colors ${activeSection === "tools"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                Trading Tools
              </button>
              <button
                onClick={() => scrollToSection("markets")}
                className={`font-medium transition-colors ${activeSection === "markets"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                Markets
              </button>
              <button
                onClick={() => scrollToSection("security")}
                className={`font-medium transition-colors ${activeSection === "security"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                Security
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className={`font-medium transition-colors ${activeSection === "faq"
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-white"
                  }`}
              >
                FAQ
              </button>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="px-6 py-2 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors font-medium"
              >
                Log In
              </button>
              <button
                onClick={handleSignUp}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-cyan-500/20"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
            }`}>
            <div className="py-4 border-t border-gray-800 bg-gray-900 rounded-lg mt-2">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className={`font-medium py-3 px-4 text-left rounded-lg transition-colors ${activeSection === "home"
                      ? "text-cyan-400 bg-gray-800"
                      : "text-white hover:bg-gray-800"
                    }`}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className={`font-medium py-3 px-4 text-left rounded-lg transition-colors ${activeSection === "features"
                      ? "text-cyan-400 bg-gray-800"
                      : "text-white hover:bg-gray-800"
                    }`}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("tools")}
                  className={`font-medium py-3 px-4 text-left rounded-lg transition-colors ${activeSection === "tools"
                      ? "text-cyan-400 bg-gray-800"
                      : "text-white hover:bg-gray-800"
                    }`}
                >
                  Trading Tools
                </button>
                <button
                  onClick={() => scrollToSection("markets")}
                  className={`font-medium py-3 px-4 text-left rounded-lg transition-colors ${activeSection === "markets"
                      ? "text-cyan-400 bg-gray-800"
                      : "text-white hover:bg-gray-800"
                    }`}
                >
                  Markets
                </button>
                <button
                  onClick={() => scrollToSection("security")}
                  className={`font-medium py-3 px-4 text-left rounded-lg transition-colors ${activeSection === "security"
                      ? "text-cyan-400 bg-gray-800"
                      : "text-white hover:bg-gray-800"
                    }`}
                >
                  Security
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className={`font-medium py-3 px-4 text-left rounded-lg transition-colors ${activeSection === "faq"
                      ? "text-cyan-400 bg-gray-800"
                      : "text-white hover:bg-gray-800"
                    }`}
                >
                  FAQ
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800 px-4">
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Trade Smarter with{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Vxness
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Advanced trading platform with institutional-grade tools, built
                for everyone.
              </p>
              <p className="text-gray-400 mb-8 max-w-lg">
                Join over 500,000 traders on the most secure and fastest
                decentralized trading platform. Access deep liquidity across
                150+ markets with competitive fees.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleSignUp}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
                >
                  <span>Start Trading Now</span>
                  <FiChevronRight className="text-xl" />
                </button>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                    <span className="font-medium">BTC/USDT</span>
                    <span className={`font-medium ${priceTrend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      ${currentPrice.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Spread</div>
                    <div className="text-cyan-400 font-medium">
                      ${(orderBookSpread.ask - orderBookSpread.bid).toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="h-48 bg-gray-950 rounded-xl mb-6 relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        hide={true}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        domain={['dataMin - 200', 'dataMax + 200']}
                        hide={true}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: '#9ca3af' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`$${value.toFixed(3)}`, 'BTC/USDT']}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={priceTrend === 'up' ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  {/* Price trend indicator */}
                  <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${priceTrend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {priceTrend === 'up' ? '▲ BULLISH' : '▼ BEARISH'}
                  </div>
                </div>

                {/* Order Book */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-green-400 font-medium mb-2 flex justify-between">
                      <span>Buy Orders</span>
                      <span className="text-xs text-gray-400 font-normal">
                        Total: {buyOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                      </span>
                    </h4>
                    {buyOrders.map((order, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-gray-800 transition-all duration-500 hover:bg-gray-800/30 rounded px-2 group"
                      >
                        <span className="text-green-400 group-hover:text-green-300 transition-colors">
                          ${order.price.toFixed(3)}
                        </span>
                        <span className="text-gray-400 group-hover:text-white transition-colors">
                          {order.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-red-400 font-medium mb-2 flex justify-between">
                      <span>Sell Orders</span>
                      <span className="text-xs text-gray-400 font-normal">
                        Total: {sellOrders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                      </span>
                    </h4>
                    {sellOrders.map((order, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-gray-800 transition-all duration-500 hover:bg-gray-800/30 rounded px-2 group"
                      >
                        <span className="text-red-400 group-hover:text-red-300 transition-colors">
                          ${order.price.toFixed(3)}
                        </span>
                        <span className="text-gray-400 group-hover:text-white transition-colors">
                          {order.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Price Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">Current Price</div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-lg font-bold ${priceTrend === 'up' ? 'text-green-400 animate-pulse' : 'text-red-400 animate-pulse'}`}>
                        ${currentPrice.toFixed(3)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${priceTrend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {volatility > 0.7 ? 'HIGH VOL' : volatility > 0.4 ? 'MED VOL' : 'LOW VOL'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl blur-xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-gray-900 to-black border-y border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition-colors"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Vxness
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Professional tools and features designed for traders of all levels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 transition-all hover:scale-[1.02]"
              >
                <div className="text-3xl text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Tools Carousel Section */}
      <section id="tools" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Trading Tools
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Professional tools used by institutional traders, now available to everyone
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Carousel Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-12 h-12 rounded-full bg-gray-900/90 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 hover:border-cyan-500/50 group"
              aria-label="Previous tool"
            >
              <FiChevronLeft className="text-2xl text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-12 h-12 rounded-full bg-gray-900/90 border border-gray-800 flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 hover:border-cyan-500/50 group"
              aria-label="Next tool"
            >
              <FiChevronRight className="text-2xl text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            {/* Main Carousel */}
            <div className="overflow-hidden rounded-2xl">
              <div 
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
              >
                {tradingTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className="min-w-full flex-shrink-0 px-2"
                  >
                    <div className="grid lg:grid-cols-2 gap-8 items-center bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02] group">
                      {/* Image Side */}
                      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                        <img
                          src={tool.image}
                          alt={tool.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent lg:bg-gradient-to-r lg:from-gray-900/80 lg:via-gray-900/40 lg:to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium backdrop-blur-sm">
                            {tool.category}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 lg:hidden">
                          <h3 className="text-2xl font-bold text-white">{tool.title}</h3>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="p-6 md:p-8 lg:p-12">
                        <div className="mb-4">
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">
                            {tool.category}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">{tool.title}</h3>
                        <p className="text-gray-300 mb-6 text-lg">{tool.description}</p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <span className="text-gray-300">Real-time data streaming</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <span className="text-gray-300">Customizable interface</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                            <span className="text-gray-300">Multi-timeframe analysis</span>
                          </div>
                        </div>

                        <button className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all flex items-center space-x-2 group/btn">
                          <span>Explore Tool</span>
                          <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {tradingTools.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCarouselIndex(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentCarouselIndex
                      ? "w-8 bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Tool Cards Grid (Visible on larger screens) */}
            <div className="hidden lg:grid grid-cols-4 gap-4 mt-8">
              {tradingTools.slice(0, 4).map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setCurrentCarouselIndex(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                  className={`p-4 rounded-xl border transition-all ${
                    index === currentCarouselIndex
                      ? "border-cyan-500 bg-cyan-500/10 scale-105"
                      : "border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      index === currentCarouselIndex
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-gray-800 text-gray-400"
                    }`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="text-left">
                      <div className={`font-medium truncate ${
                        index === currentCarouselIndex ? "text-cyan-400" : "text-gray-300"
                      }`}>
                        {tool.title}
                      </div>
                      <div className="text-xs text-gray-500">{tool.category}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section
        id="markets"
        className="py-20 bg-gradient-to-b from-gray-900/50 to-black"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trade{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                150+ Markets
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Access a wide range of cryptocurrency pairs with deep liquidity
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
            {/* Chart Header */}
            <div className="p-6 bg-gray-900 border-b border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                    {markets[currentMarketIndex].symbol.split("/")[0].charAt(0)}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{markets[currentMarketIndex].symbol}</div>
                    <div className="text-gray-400 text-sm">24h Trading Chart</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{markets[currentMarketIndex].price}</div>
                  <div className={`font-medium ${markets[currentMarketIndex].changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                  >
                    {markets[currentMarketIndex].change}
                  </div>
                </div>
              </div>
              
              {/* Market Indicators */}
              <div className="flex space-x-6 text-sm">
                <div>
                  <span className="text-gray-400">Volume: </span>
                  <span className="text-white font-medium">{markets[currentMarketIndex].volume}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status: </span>
                  <span className="text-green-400 font-medium">Live</span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={markets[currentMarketIndex].changeType === "positive" ? "#10b981" : "#ef4444"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={markets[currentMarketIndex].changeType === "positive" ? "#10b981" : "#ef4444"} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={markets[currentMarketIndex].changeType === "positive" ? "#10b981" : "#ef4444"}
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Market Selector */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="flex space-x-2 overflow-x-auto">
                {markets.map((market, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMarketIndex(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      index === currentMarketIndex
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {market.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bank-Level{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Security
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Your assets are protected with the highest security standards in
                the industry
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                  >
                    <FiCheck className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <FiLock className="text-cyan-400 text-2xl" />
                <div>
                  <div className="font-bold">Funds Protection</div>
                  <div className="text-gray-400 text-sm">
                    98% of assets in cold storage
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Security Visualization */}
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                {/* Outer Shield */}
                <div className="absolute inset-0 rounded-full border-8 border-cyan-500/20 animate-pulse"></div>

                {/* Middle Shield */}
                <div
                  className="absolute inset-8 rounded-full border-4 border-cyan-400/30 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>

                {/* Inner Shield */}
                <div
                  className="absolute inset-16 rounded-full border-2 border-cyan-300/40 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <FiShield className="text-4xl" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 animate-bounce"></div>
                <div
                  className="absolute -bottom-4 right-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 bg-gradient-to-b from-black to-gray-900/50"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Find answers to common questions about Vxness
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/30 transition-colors"
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-gray-400 text-xl mb-8">
              Join thousands of traders who have already chosen Vxness
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSignUp}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all font-medium text-lg flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
              >
                <span>Create Free Account</span>
                <FiChevronRight className="text-xl" />
              </button>
              <button className="px-8 py-4 rounded-lg border border-gray-700 hover:border-cyan-500 hover:text-cyan-400 transition-colors font-medium text-lg">
                Contact Sales
              </button>
            </div>

            <div className="mt-8 flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">0.1%</div>
                <div className="text-gray-400 text-sm">Trading Fees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">10ms</div>
                <div className="text-gray-400 text-sm">Order Execution</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={logoImage}
                  alt="Vxness Logo"
                  className="w-16 h-16 rounded-lg object-contain"
                />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Advanced trading platform for everyone. Secure, fast, and
                reliable. Trade cryptocurrencies with confidence.
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Legal
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <button   onClick={() => scrollToSection("home")}className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("home")} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Vxness. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <button className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;