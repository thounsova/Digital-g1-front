"use client";

export default function OnboardingScreen() {
  return (
    <div className="min-h-screen bg-amber-300 flex flex-col items-center justify-between font-sans">
      
      {/* Illustration */}
      <div className="flex justify-center">
        <img
          src="https://cdn.flyscoot.com/prod/images/default-source/marvie-whatsapp-2024/marvie.png?sfvrsn=f12f7add_2/MARVIE.png"
          alt="Marvie the Mascot"
          className="w-64 h-auto animate-pulse"
        />
      </div>

      {/* Main Content */}
      <div className="bg-amber-400 text-black text-center  p-2 w-full max-w-lg  shadow-md space-y-10">
        
        {/* How to Use Section */}
        <section>
          <h1 className="text-2xl font-bold text-purple-700 mb-4">BOOLO</h1>
          <p className="text-gray-700 text-sm mb-4">
            Learn how to manage your digital identity <br /> in just 5 minutes.
          </p>
          <button className="mt-2 px-6 py-2 bg-yellow-400 border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-blue-100 hover:text-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300">
            Read Guide
          </button>
        </section>

        {/* Great Ideas Section */}
        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-3">Great Ideas</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Why Use a Digital ID Card?
            <br />• Quick and easy to use on your phone.
            <br />• Update your information anytime.
            <br />• Eco-friendly — no plastic needed.
            <br />• Fast identity verification with QR code or NFC.
          </p>
        </section>

        {/* Get Started Button */}
        <div className="w-full">
          <a href="/auth/Login">
            <button className="w-full bg-yellow-400 border-2 border-gray-200 text-black py-3 rounded-xl text-sm font-medium hover:bg-yellow-500 transition">
              Get Started!
            </button>
          </a>
        </div>
        
      </div>
    </div>
  );
}
