const HomeSimple = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#030014', color: 'white' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          <span style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Hello World
          </span>
        </h1>
        <p className="text-xl text-gray-400">Your portfolio is working!</p>
        <div className="mt-8">
          <button className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSimple;