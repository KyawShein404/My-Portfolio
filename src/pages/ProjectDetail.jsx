import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { ArrowLeft, Github, Code, Layers, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Auto-scroll main carousel
  useEffect(() => {
    if (!project) return;
    const images = parseImages(project);
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [project]);

  // Auto-scroll fullscreen carousel
  useEffect(() => {
    if (!isFullScreen || !project) return;
    const images = parseImages(project);
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setFullScreenIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFullScreen, project]);

  // Helper function to parse tech stack
  const parseTechStack = (techStack) => {
    if (!techStack) return [];
    try {
      return typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
    } catch (e) {
      return techStack.split(',').map(t => t.trim());
    }
  };

  // Helper function to parse features
  const parseFeatures = (features) => {
    if (!features) return [];
    try {
      return typeof features === 'string' ? JSON.parse(features) : features;
    } catch (e) {
      return features.split(',').map(f => f.trim());
    }
  };

  // Helper function to parse images (could be single Img or Images array)
  const parseImages = (project) => {
    const images = [];
    
    // Check if there's an Images field (array of images)
    if (project.Images) {
      try {
        const parsed = typeof project.Images === 'string' ? JSON.parse(project.Images) : project.Images;
        images.push(...parsed);
      } catch (e) {
        // If parsing fails, try splitting by comma
        const split = project.Images.split(',').map(img => img.trim()).filter(img => img);
        images.push(...split);
      }
    }
    
    // If no Images array but has Img field, use that
    if (images.length === 0 && project.Img) {
      images.push(project.Img);
    }
    
    return images;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="aurora-bg" />
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700" style={{ borderTopColor: '#8B5CF6' }}></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="aurora-bg" />
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
          <Link to="/" className="hover:underline" style={{ color: '#8B5CF6' }}>
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const techStack = parseTechStack(project.TechStack);
  const features = parseFeatures(project.Features);
  const images = parseImages(project);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const openFullScreen = (index) => {
    setFullScreenIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const nextFullScreenImage = () => {
    setFullScreenIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevFullScreenImage = () => {
    setFullScreenIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <div className="aurora-bg" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          to="/#portfolio"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          data-aos="fade-right"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-aos="fade-up">
            {project.Title}
          </h1>
          <p className="text-gray-400 text-lg" data-aos="fade-up" data-aos-delay="100">
            {project.Description}
          </p>
        </div>

        {/* Project Image Carousel */}
        {images.length > 0 && (
          <div className="mb-12" data-aos="zoom-in" data-aos-delay="200">
            <div className="relative rounded-2xl overflow-hidden group">
              {/* Main Image Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-video"
                  style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(16, 185, 129, 0.1))' }}
                  onClick={() => openFullScreen(currentImageIndex)}
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={`${project.Title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                  
                  {/* Click to enlarge hint */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-black/50 px-4 py-2 rounded-lg">
                      Click to enlarge
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows - Only show if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass rounded-full hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass rounded-full hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 glass rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation - Only show if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all`}
                    style={{
                      borderColor: index === currentImageIndex ? '#8B5CF6' : 'transparent',
                      transform: index === currentImageIndex ? 'scale(1.05)' : 'scale(1)',
                      opacity: index === currentImageIndex ? 1 : 0.6
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            className="glass-enhanced p-6 rounded-xl transition-all card-hover"
            style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{techStack.length}</div>
                <div className="text-sm text-gray-400">Total Technology</div>
              </div>
            </div>
          </div>

          <div 
            className="glass-enhanced p-6 rounded-xl transition-all card-hover"
            style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{features.length}</div>
                <div className="text-sm text-gray-400">Key Features</div>
              </div>
            </div>
          </div>

          <div 
            className="glass-enhanced p-6 rounded-xl transition-all card-hover"
            style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <Star className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{images.length}</div>
                <div className="text-sm text-gray-400">Project Images</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12" data-aos="fade-up">
          {project.Github && (
            <a
              href={project.Github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all flex items-center gap-2 text-white"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #10B981)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Github className="w-5 h-5" />
              View on Github
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Features */}
          {features.length > 0 && (
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Key Features</h3>
              </div>
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="glass-enhanced p-4 rounded-xl transition-all"
                    style={{ border: '1px solid rgba(139, 92, 246, 0.1)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                           style={{ background: 'linear-gradient(135deg, #8B5CF6, #10B981)' }}>
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Used */}
          {techStack.length > 0 && (
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Technologies Used</h3>
              </div>
              <div className="glass-enhanced p-6 rounded-xl" style={{ border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(16, 185, 129, 0.1))',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                      }}
                    >
                      <Code className="w-4 h-4 inline mr-2" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeFullScreen}
          >
            {/* Close Button */}
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 p-3 glass rounded-full hover:bg-white/20 transition-all z-50"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevFullScreenImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 glass rounded-full hover:bg-white/20 transition-all z-50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextFullScreenImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 glass rounded-full hover:bg-white/20 transition-all z-50"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 glass rounded-full text-white">
                {fullScreenIndex + 1} / {images.length}
              </div>
            )}

            {/* Main Image - Smaller Size */}
            <motion.div
              key={fullScreenIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl max-h-[70vh] w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[fullScreenIndex]}
                alt={`${project.Title} - Fullscreen ${fullScreenIndex + 1}`}
                className="w-full h-full object-contain rounded-xl"
              />
            </motion.div>

            {/* Thumbnail Strip at bottom */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 glass rounded-xl max-w-xl overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setFullScreenIndex(index); }}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
                    style={{
                      borderColor: index === fullScreenIndex ? '#8B5CF6' : 'transparent',
                      transform: index === fullScreenIndex ? 'scale(1.1)' : 'scale(1)',
                      opacity: index === fullScreenIndex ? 1 : 0.5
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
