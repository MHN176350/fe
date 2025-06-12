import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/LD.jpg'; // Add a beautiful warehouse image to your assets
import logo from '../../assets/react.svg';

const features = [
  {
    title:  'Inventory Manage',
    desc: 'Track your stock in real-time and never run out of essentials.',
    icon: '📦',
  },
  {
    title: 'Easy Import/Export',
    desc: 'Seamless import and export management with just a few clicks.',
    icon: '🚚',
  },
  {
    title: 'Insightful Analytics',
    desc: 'Visualize your warehouse performance with beautiful charts.',
    icon: '📊',
  },
  {
    title: 'User Friendly',
    desc: 'Modern, clean, and responsive interface for everyone.',
    icon: '✨',
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-300 flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full flex flex-col items-center pt-16 pb-10">
        <img src={logo} alt="Logo" className="w-16 h-16 mb-4 animate-spin-slow" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center drop-shadow-lg">
          Welcome to <span className="text-blue-500">Simple Warehouse</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl">
          Effortlessly manage your inventory, track warehouse operations, and gain insights with our modern warehouse management platform.
        </p>
        <Link
          to="/warehouses"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-gray-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-gray-800 transition text-lg"
        >
          Get Started
        </Link>
      </header>

      {/* Hero Image */}
      <div className="w-full flex justify-center mb-12">
        <img
          src={heroImg}
          alt="Warehouse"
          className="rounded-3xl shadow-2xl w-full max-w-3xl object-cover border-4 border-gray-300"
          style={{ maxHeight: 350 }}
        />
      </div>

      {/* Features Section */}
      <section className="w-full max-w-5xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, idx) => (
          <div
            key={f.title}
            className="bg-gradient-to-br from-white to-gray-200 rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform border border-gray-200"
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold text-blue-500 mb-2">{f.title}</h3>
            <p className="text-gray-700 text-center">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <footer className="w-full flex flex-col items-center py-12 mt-8 bg-gradient-to-t from-gray-200 via-gray-100 to-transparent">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to optimize your warehouse?</h2>
        <Link
          to="/warehouses"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-gray-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-gray-800 transition text-lg"
        >
          Start Now
        </Link>
      </footer>
    </div>
  );
};

export default Dashboard;