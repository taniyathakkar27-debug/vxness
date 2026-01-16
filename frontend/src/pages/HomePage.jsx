import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiChevronRight,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiUsers,
  FiCheck,
  FiBarChart2,
  FiGlobe,
  FiLock,
} from "react-icons/fi";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section based on scroll position
      const sections = ["home", "features", "markets", "security", "faq"];
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar height
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
    navigate("/user/login");
  };

  const handleSignUp = () => {
    setIsMenuOpen(false);

    navigate("/user/signup");
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
                src="/favicon.png"
                alt="Vxness Logo"
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-contain"
              />
              <div className="hidden md:block">
                <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Vxness
                </div>
              </div>
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
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium">
                      Spot
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium hover:bg-gray-700">
                      Futures
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-sm font-medium hover:bg-gray-700">
                      Earn
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
                    <span className="font-medium">BTC/USDT</span>
                    <span className="text-green-400 font-medium">+5.2%</span>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="h-48 bg-gray-950 rounded-xl mb-6 relative overflow-hidden">
                  {/* Simulated Chart Lines */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse"></div>
                    <div
                      className="absolute top-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="absolute top-3/4 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse"
                      style={{ animationDelay: "2s" }}
                    ></div>
                  </div>
                </div>

                {/* Order Book */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">
                      Buy Orders
                    </h4>
                    {[42.85, 42.84, 42.83].map((price, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-gray-800"
                      >
                        <span className="text-green-400">
                          ${price.toFixed(2)}
                        </span>
                        <span className="text-gray-400">{1.2 + i * 0.5}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-red-400 font-medium mb-2">
                      Sell Orders
                    </h4>
                    {[42.86, 42.87, 42.88].map((price, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-gray-800"
                      >
                        <span className="text-red-400">
                          ${price.toFixed(2)}
                        </span>
                        <span className="text-gray-400">{0.8 + i * 0.4}</span>
                      </div>
                    ))}
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
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-gray-900 border-b border-gray-800">
              <div className="font-medium text-gray-400">Pair</div>
              <div className="font-medium text-gray-400">Price</div>
              <div className="font-medium text-gray-400">24h Change</div>
              <div className="font-medium text-gray-400">24h Volume</div>
            </div>

            {/* Table Rows */}
            {markets.map((market, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/30 transition-colors"
              >
                <div className="font-medium flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                    {market.symbol.split("/")[0].charAt(0)}
                  </div>
                  <span>{market.symbol}</span>
                </div>
                <div className="font-medium">{market.price}</div>
                <div
                  className={`font-medium ${market.changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                >
                  {market.change}
                </div>
                <div className="text-gray-400">{market.volume}</div>
              </div>
            ))}
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
                  src="/favicon.png"
                  alt="Vxness Logo"
                  className="w-16 h-16 rounded-lg object-contain"
                />
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Vxness
                  </div>
                  <div className="text-gray-400 text-sm">Advanced Trading Platform</div>
                </div>
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
                    Careers
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Blog
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
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    API Docs
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
