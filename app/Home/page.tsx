"use client";

import {
  ArrowRight,
  CreditCard,
  Share2,
  Shield,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  "Never lose your business cards again",
  "Update your information anytime",
  "Eco-friendly paperless solution",
  "Professional and memorable impression",
  "Works on any device, anywhere",
  "Cost-effective for businesses",
];

const features = [
  {
    icon: <CreditCard className="w-8 h-8 text-white" />,
    title: "Easy Creation",
    desc: "Create professional digital ID cards in minutes with our intuitive, step-by-step interface.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Share2 className="w-8 h-8 text-white" />,
    title: "Instant Sharing",
    desc: "Share your digital card via QR code, link, or direct message instantly with anyone, anywhere.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Secure & Reliable",
    desc: "Your data is protected with enterprise-grade security and complete privacy controls.",
    color: "from-green-500 to-green-600",
  },
];

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-16 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse" />
        <div className="absolute top-48 right-16 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse delay-1000" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-24">
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Digital ID Cards for the
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern World
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create, manage, and share your professional identity cards.
            Eco-friendly, secure, and always accessible.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/create-card"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transition"
            >
              Create Your Card Now
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Digital ID Cards?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform the way you network and manage your identity
              professionally
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon, title, desc, color }, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`bg-gradient-to-br ${color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform`}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Perfect for Modern Professionals
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                <p className="text-gray-700 text-base">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/create-card"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
