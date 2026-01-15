import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  X,
  Mail,
  ChevronDown,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { signup } from "../api/auth";
import { API_URL } from "../config/api";
import logo from "../assets/vxness.png";

const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [activeTab, setActiveTab] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[3]);
  const dropdownRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    password: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.includes(countrySearch)
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData({ ...formData, countryCode: country.code });
    setShowCountryDropdown(false);
    setCountrySearch("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  useEffect(() => {
    const checkOtpSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/otp-settings`);
        const data = await res.json();
        if (data.success) setOtpRequired(data.otpEnabled);
      } catch {}
    };
    checkOtpSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await signup({
        ...formData,
        referralCode: referralCode || undefined,
        otpVerified,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate(isMobile ? "/mobile" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-orange-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl" />

      <div className="relative bg-dark-700 rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <button className="absolute top-4 right-4 w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center">
          <X size={16} className="text-gray-400" />
        </button>

        {/* Tabs */}
        <div className="flex bg-dark-600 rounded-full p-1 w-fit mb-6">
          <button className="px-6 py-2 rounded-full bg-dark-500 text-white text-sm">
            Sign up
          </button>
          <Link to="/user/login" className="px-6 py-2 text-gray-400 text-sm">
            Sign in
          </Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="App Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-white mb-6">
          Create an account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            placeholder="Enter your name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-dark-600 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />

          <input
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-dark-600 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-dark-600 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg"
          >
            {loading ? "Creating account..." : "Create an account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
