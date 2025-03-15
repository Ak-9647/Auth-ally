import React from 'react';
import { Link } from 'react-router-dom';

const Developer: React.FC = () => {
  // Skills array for the developer
  const skills = [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Frontend Development', level: 90 },
    { name: 'UI/UX Design', level: 75 },
    { name: 'Responsive Design', level: 85 },
    { name: 'Tailwind CSS', level: 90 },
  ];

  // Portfolio projects
  const projects = [
    {
      id: 1,
      title: 'Author Ally',
      description: 'A comprehensive writing assistant application that helps authors manage their documents, track goals, collaborate with others, and export content in various formats.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Clerk Auth'],
      url: 'https://author-ally.netlify.app'
    },
    {
      id: 2,
      title: 'Task Management Dashboard',
      description: 'An intuitive task management system with drag-and-drop functionality, notification system, and team collaboration features.',
      technologies: ['React', 'Redux', 'MongoDB', 'Express'],
      url: '#'
    },
    {
      id: 3,
      title: 'E-commerce Platform',
      description: 'A fully responsive e-commerce solution with product management, cart system, payment integration, and order tracking.',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
      url: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold">Akshay Ramesh Nair</h1>
            <p className="text-lg opacity-90">Full Stack Developer | React Specialist</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left Column - Profile */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                {/* Profile Image Placeholder */}
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  AN
                </div>
                
                {/* Contact Information */}
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Contact Information</h3>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <a 
                      href="https://github.com/Ak-9647" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label="GitHub"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com/in/akshay-ramesh-nair" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label="LinkedIn"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a 
                      href="https://twitter.com/akshayramesh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label="Twitter"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span> 
                      <a href="mailto:akshayramesh.nair.informa@gmail.com" className="ml-1 text-blue-600 dark:text-blue-400 hover:underline">
                        akshayramesh.nair.informa@gmail.com
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Location:</span> <span className="ml-1">Bangalore, India</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Skills & Expertise</h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - About & Projects */}
            <div className="md:col-span-2">
              {/* About Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  I'm Akshay Ramesh Nair, a passionate full-stack developer with extensive experience in building modern web applications. I specialize in React, TypeScript, and Node.js, creating responsive and user-friendly interfaces that solve real-world problems.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  With over 5 years of experience in software development, I've worked with various technologies and frameworks to deliver high-quality applications. I'm particularly interested in creating tools that enhance productivity and streamline workflows, as demonstrated by the Author Ally project.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  I'm always eager to learn new technologies and stay up-to-date with the latest developments in the web development ecosystem. I'm passionate about clean code, performance optimization, and creating exceptional user experiences.
                </p>
              </div>
              
              {/* Projects Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Projects</h2>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Akshay Ramesh Nair. All rights reserved.</p>
          <p className="mt-1">Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </div>
  );
};

export default Developer; 