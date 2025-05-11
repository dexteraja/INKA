// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Common Elements
  const body = document.body;
  const preloader = document.getElementById('preloader');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIndicator = document.getElementById('darkModeIndicator');
  const darkModeIcon = document.getElementById('darkModeIcon');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const notification = document.getElementById('notification');
  const closeNotification = document.getElementById('closeNotification');
  
  // Registration Form Elements
  const registrationForm = document.getElementById('registrationForm');
  const formProgress = document.getElementById('formProgress');
  const fileInput = document.getElementById('cv');
  const selectedFileName = document.getElementById('selectedFileName');
  
  // Jobs Filter Elements
  const jobFilterBtns = document.querySelectorAll('.job-filter-btn');
  const jobCards = document.querySelectorAll('.job-card');
  const jobSearch = document.getElementById('jobSearch');
  
  // Job Details Modal Elements
  const viewJobBtns = document.querySelectorAll('.view-job-btn');
  const jobDetailModal = document.getElementById('jobDetailModal');
  const closeJobModal = document.getElementById('closeJobModal');
  const jobTitle = document.getElementById('jobTitle');
  const jobDepartmentBadge = document.getElementById('jobDepartmentBadge');
  const jobLocation = document.getElementById('jobLocation');
  const jobType = document.getElementById('jobType');
  const jobSalary = document.getElementById('jobSalary');
  const jobDescription = document.getElementById('jobDescription');
  const jobRequirements = document.getElementById('jobRequirements');
  const jobBenefits = document.getElementById('jobBenefits');
  const applyNowBtn = document.getElementById('applyNowBtn');
  
  // Success Modal Elements
  const successModal = document.getElementById('successModal');
  const successMessage = document.getElementById('successMessage');
  const successModalCloseBtn = document.getElementById('successModalCloseBtn');
  
  // Dashboard Section Elements
  const loginBtn = document.getElementById('loginBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  const dashboard = document.getElementById('dashboard');
  
  // Chatbot Elements
  const takeInterviewBtn = document.getElementById('takeInterviewBtn');
  const chatbot = document.getElementById('chatbot');
  const chatForm = document.getElementById('chatForm');
  const userMessage = document.getElementById('userMessage');
  const chatMessages = document.getElementById('chatMessages');
  const resetInterview = document.getElementById('resetInterview');
  const technicalScore = document.getElementById('technicalScore');
  const communicationScore = document.getElementById('communicationScore');
  const problemSolvingScore = document.getElementById('problemSolvingScore');
  const culturalFitScore = document.getElementById('culturalFitScore');
  const overallScore = document.getElementById('overallScore');
  const technicalBar = document.getElementById('technicalBar');
  const communicationBar = document.getElementById('communicationBar');
  const problemSolvingBar = document.getElementById('problemSolvingBar');
  const culturalFitBar = document.getElementById('culturalFitBar');
  const overallBar = document.getElementById('overallBar');
  const currentStep = document.getElementById('currentStep');
  
  // Timeline Elements
  const timelineStations = document.querySelectorAll('.timeline-station');
  const timelineContent = document.getElementById('timelineContent');
  
  // Testimonial Slider Elements
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const prevTestimonial = document.getElementById('prevTestimonial');
  const nextTestimonial = document.getElementById('nextTestimonial');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  
  // Virtual Queue Elements
  const exploreJobsBtn = document.getElementById('exploreJobsBtn');
  const queue = document.getElementById('queue');
  const trainPosition = document.getElementById('trainPosition');
  
  // Page Navigation Elements
  const navLinks = document.querySelectorAll('nav a');
  
  // ================================
  // INITIALIZATION
  // ================================
  
  // Hide preloader after content is loaded
  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.style.opacity = '0';
      setTimeout(function() {
        preloader.style.display = 'none';
      }, 500);
    }, 1500);
  });
  
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    body.classList.add('dark');
    darkModeIndicator.style.transform = 'translateX(24px)';
    darkModeIcon.classList.remove('fa-sun');
    darkModeIcon.classList.add('fa-moon');
  }
  
  // Show notification after a delay
  setTimeout(function() {
    if (notification) {
      notification.classList.remove('hidden');
    }
  }, 5000);
  
  // Set active navigation link based on current scroll position
  setActiveNavOnScroll();
  
  // Initialize testimonial slider
  let currentTestimonial = 0;
  
  // Initialize timeline (show first step by default)
  if (timelineStations.length > 0) {
    timelineStations[0].classList.add('active');
  }
  
  // Initialize chatbot scores
  initializeChatbotScores();
  
  // ================================
  // EVENT LISTENERS
  // ================================
  
  // Dark Mode Toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      body.classList.toggle('dark');
      
      if (body.classList.contains('dark')) {
        darkModeIndicator.style.transform = 'translateX(24px)';
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'true');
      } else {
        darkModeIndicator.style.transform = 'translateX(0)';
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'false');
      }
    });
  }
  
  // Mobile Menu Toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Close Notification
  if (closeNotification && notification) {
    closeNotification.addEventListener('click', function() {
      notification.classList.add('hidden');
    });
  }
  
  // Registration Form Events
  if (registrationForm) {
    // File input change
    if (fileInput && selectedFileName) {
      fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
          selectedFileName.textContent = fileInput.files[0].name;
        } else {
          selectedFileName.textContent = '';
        }
      });
    }
    
    // Form validation and progress
    const formFields = registrationForm.querySelectorAll('[data-validation]');
    
    formFields.forEach(function(field) {
      field.addEventListener('input', function() {
        validateField(field);
        updateFormProgress();
      });
      
      field.addEventListener('change', function() {
        validateField(field);
        updateFormProgress();
      });
    });
    
    // Form submission
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      formFields.forEach(function(field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Simulate form submission
        if (successModal) {
          successMessage.textContent = "Your application has been submitted successfully. We'll review it and get back to you soon!";
          successModal.classList.remove('hidden');
        }
        
        // Reset form
        registrationForm.reset();
        if (selectedFileName) {
          selectedFileName.textContent = '';
        }
        formProgress.style.width = '0%';
      }
    });
  }
  
  // Job Filter Buttons
  if (jobFilterBtns.length > 0) {
    jobFilterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        jobFilterBtns.forEach(function(b) {
          b.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        
        // Filter job cards
        filterJobs(filter, jobSearch ? jobSearch.value : '');
      });
    });
  }
  
  // Job Search
  if (jobSearch) {
    jobSearch.addEventListener('input', function() {
      const activeFilter = document.querySelector('.job-filter-btn.active');
      const filter = activeFilter ? activeFilter.dataset.filter : 'all';
      
      filterJobs(filter, this.value);
    });
  }
  
  // View Job Buttons
  if (viewJobBtns.length > 0 && jobDetailModal) {
    viewJobBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const jobId = this.dataset.jobId;
        
        // Simulate fetching job details based on ID
        const jobDetails = getJobDetails(jobId);
        
        // Populate modal with job details
        jobTitle.textContent = jobDetails.title;
        jobDepartmentBadge.textContent = jobDetails.department;
        jobDepartmentBadge.className = `department-badge ${jobDetails.badgeClass}`;
        jobLocation.textContent = jobDetails.location;
        jobType.textContent = jobDetails.type;
        jobSalary.textContent = jobDetails.salary;
        jobDescription.textContent = jobDetails.description;
        
        // Show modal
        jobDetailModal.classList.remove('hidden');
      });
    });
  }
  
  // Close Job Modal
  if (closeJobModal && jobDetailModal) {
    closeJobModal.addEventListener('click', function() {
      jobDetailModal.classList.add('hidden');
    });
  }
  
  // Apply Now Button in Job Modal
  if (applyNowBtn && jobDetailModal) {
    applyNowBtn.addEventListener('click', function() {
      jobDetailModal.classList.add('hidden');
      
      // Scroll to registration form
      const registrationSection = document.getElementById('registration');
      if (registrationSection) {
        registrationSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Success Modal Close Button
  if (successModalCloseBtn && successModal) {
    successModalCloseBtn.addEventListener('click', function() {
      successModal.classList.add('hidden');
    });
  }
  
  // Login Button (Show Dashboard)
  if ((loginBtn || mobileLoginBtn) && dashboard) {
    const loginButtons = [loginBtn, mobileLoginBtn].filter(btn => btn !== null);
    
    loginButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Hide all sections
        const sections = document.querySelectorAll('main > section');
        sections.forEach(function(section) {
          section.classList.add('hidden');
        });
        
        // Show dashboard
        dashboard.classList.remove('hidden');
        
        // Hide mobile menu if it's open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
      });
    });
  }
  
  // Take Interview Button (Show Chatbot)
  if (takeInterviewBtn && chatbot) {
    takeInterviewBtn.addEventListener('click', function() {
      // Hide all sections
      const sections = document.querySelectorAll('main > section');
      sections.forEach(function(section) {
        section.classList.add('hidden');
      });
      
      // Show chatbot
      chatbot.classList.remove('hidden');
      
      // Scroll to top
      window.scrollTo(0, 0);
    });
  }
  
  // Chatbot Form
  if (chatForm && userMessage && chatMessages) {
    const chatbotQuestions = [
      "What experience do you have with railway systems or similar technologies?",
      "Tell me about a challenging project you've worked on and how you overcame obstacles.",
      "How do you stay updated with the latest technologies in your field?",
      "What interests you about working with our railway company specifically?",
      "Where do you see yourself in 5 years?"
    ];
    
    let questionIndex = 0;
    
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const message = userMessage.value.trim();
      
      if (message === '') {
        return;
      }
      
      // Add user message to chat
      addChatMessage('user', message);
      
      // Clear input
      userMessage.value = '';
      
      // Simulate typing delay
      setTimeout(function() {
        if (questionIndex < chatbotQuestions.length) {
          // Add bot message
          addChatMessage('bot', chatbotQuestions[questionIndex]);
          
          // Update interview progress
          currentStep.textContent = questionIndex + 4; // +4 because we start at 3
          
          if (questionIndex === chatbotQuestions.length - 1) {
            // Last question, update all scores
            updateChatbotScores();
          }
          
          questionIndex++;
        } else {
          // Interview completed
          addChatMessage('bot', "Thank you for completing the interview! Based on your responses, I've calculated your scores. You can view them in the panel on the right. Feel free to reset the interview if you'd like to try again.");
          
          // Update final scores
          updateChatbotScores(true);
        }
      }, 1000);
    });
  }
  
  // Reset Interview Button
  if (resetInterview) {
    resetInterview.addEventListener('click', function() {
      // Clear chat messages except the first one (greeting)
      while (chatMessages.children.length > 1) {
        chatMessages.removeChild(chatMessages.lastChild);
      }
      
      // Reset progress
      currentStep.textContent = '3';
      
      // Reset question index
      questionIndex = 0;
      
      // Reset scores
      initializeChatbotScores();
      
      // Add initial bot message
      addChatMessage('bot', "Interview reset! Let's start over. What experience do you have with railway systems or similar technologies?");
    });
  }
  
  // Timeline Stations
  if (timelineStations.length > 0 && timelineContent) {
    timelineStations.forEach(function(station) {
      station.addEventListener('click', function() {
        const step = this.dataset.step;
        
        // Remove active class from all stations
        timelineStations.forEach(function(s) {
          s.classList.remove('active');
        });
        
        // Add active class to clicked station
        this.classList.add('active');
        
        // Update timeline content
        updateTimelineContent(step);
      });
    });
  }
  
  // Testimonial Navigation
  if (testimonialsTrack && prevTestimonial && nextTestimonial && testimonialDots.length > 0) {
    prevTestimonial.addEventListener('click', function() {
      navigateTestimonials('prev');
    });
    
    nextTestimonial.addEventListener('click', function() {
      navigateTestimonials('next');
    });
    
    testimonialDots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        currentTestimonial = index;
        updateTestimonialSlider();
      });
    });
    
    // Auto-rotate testimonials
    setInterval(function() {
      navigateTestimonials('next');
    }, 5000);
  }
  
  // Explore Jobs Button
  if (exploreJobsBtn) {
    exploreJobsBtn.addEventListener('click', function() {
      const jobsSection = document.getElementById('jobs');
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Page Scroll Event for Navigation Highlighting
  window.addEventListener('scroll', function() {
    setActiveNavOnScroll();
  });
  
  // ================================
  // FUNCTIONS
  // ================================
  
  // Validate Form Field
  function validateField(field) {
    const validationType = field.getAttribute('data-validation');
    const errorId = field.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    let isValid = true;
    let errorMessage = '';
    
    if (validationType === 'required') {
      isValid = field.value.trim() !== '';
      errorMessage = 'This field is required';
    } else if (validationType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(field.value);
      errorMessage = 'Please enter a valid email address';
    } else if (validationType === 'file') {
      if (field.getAttribute('data-mock') === 'true') {
        // For mock file input, just check if a file was selected
        isValid = field.files && field.files.length > 0;
      } else {
        isValid = field.value.trim() !== '';
      }
      errorMessage = 'Please upload a file';
    }
    
    // Set field validity UI
    if (!isValid && field.value.trim() !== '') {
      field.classList.add('invalid');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden');
      }
    } else {
      field.classList.remove('invalid');
      if (errorElement) {
        errorElement.classList.add('hidden');
      }
    }
    
    return isValid;
  }
  
  // Update Form Progress Bar
  function updateFormProgress() {
    if (!formProgress) return;
    
    const formFields = document.querySelectorAll('[data-validation]');
    let validFields = 0;
    
    formFields.forEach(function(field) {
      const validationType = field.getAttribute('data-validation');
      
      if (validationType === 'required' && field.value.trim() !== '') {
        validFields++;
      } else if (validationType === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        validFields++;
      } else if (validationType === 'file' && field.files && field.files.length > 0) {
        validFields++;
      }
    });
    
    const progress = (validFields / formFields.length) * 100;
    formProgress.style.width = progress + '%';
  }
  
  // Filter Jobs
  function filterJobs(filter, searchTerm) {
    if (!jobCards) return;
    
    jobCards.forEach(function(card) {
      const department = card.getAttribute('data-department');
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('.job-description').textContent.toLowerCase();
      
      const matchesDepartment = filter === 'all' || department === filter;
      const matchesSearch = !searchTerm || title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
      
      if (matchesDepartment && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Get Job Details (Mock Data)
  function getJobDetails(jobId) {
    const jobs = [
      {
        id: 1,
        title: 'Train System Engineer',
        department: 'Engineering',
        badgeClass: 'bg-industrial-red',
        location: 'Remote / Tokyo, Japan',
        type: 'Full-time',
        salary: '$80K - $110K',
        description: 'Design and develop next-generation train control systems using advanced technologies. You will be responsible for creating innovative solutions that enhance train operation efficiency and safety.',
        requirements: [
          'Bachelor\'s degree in Electrical Engineering or similar field',
          '3+ years of experience in railway systems engineering',
          'Knowledge of control systems and automation',
          'Experience with embedded systems programming',
          'Strong problem-solving abilities'
        ],
        benefits: [
          'Competitive salary and performance bonuses',
          'Flexible working hours and remote options',
          'Comprehensive health insurance',
          'Professional development budget',
          'Modern office in central Tokyo',
          'Relocation assistance available'
        ]
      },
      {
        id: 2,
        title: 'Railway AI Specialist',
        department: 'Software',
        badgeClass: 'bg-neon-blue',
        location: 'Berlin, Germany',
        type: 'Full-time',
        salary: '$90K - $120K',
        description: 'Develop AI solutions for predictive maintenance and smart scheduling systems. You will be working with cutting-edge machine learning technologies to optimize railway operations.',
        requirements: [
          'MSc/PhD in Computer Science, Machine Learning, or related field',
          '4+ years of experience in developing ML/AI solutions',
          'Strong knowledge of Python, TensorFlow, PyTorch',
          'Experience with real-time predictive systems',
          'Familiarity with IoT sensors and data processing',
          'Background in transportation systems is a plus'
        ],
        benefits: [
          'Competitive salary and performance bonuses',
          'Flexible working hours and remote options',
          'Comprehensive health insurance',
          'Professional development budget',
          'Modern office in the heart of Berlin',
          'Free rail travel across partner networks'
        ]
      },
      {
        id: 3,
        title: 'UI/UX Train Interface Designer',
        department: 'Design',
        badgeClass: 'bg-success',
        location: 'London, UK',
        type: 'Contract',
        salary: '£70K - £90K',
        description: 'Create intuitive interfaces for next-generation train control and passenger systems. Your designs will shape the user experience of both operators and passengers.',
        requirements: [
          'Bachelor\'s degree in Design, Human-Computer Interaction, or similar field',
          '5+ years of experience in UI/UX design for complex systems',
          'Strong portfolio showing interface design for technical applications',
          'Experience with design tools (Figma, Adobe XD, Sketch)',
          'Knowledge of human factors engineering',
          'Experience designing for diverse user groups'
        ],
        benefits: [
          'Competitive daily/hourly rate',
          'Flexible working hours',
          'Work-from-home options available',
          'Modern office in central London',
          'Potential for long-term contract extension',
          'Opportunity to shape the future of train interfaces'
        ]
      },
      {
        id: 4,
        title: 'Railway Cybersecurity Expert',
        department: 'Security',
        badgeClass: 'bg-warning',
        location: 'Singapore',
        type: 'Full-time',
        salary: 'S$110K - S$150K',
        description: 'Secure critical infrastructure and develop protocols for railway cybersecurity systems. You will be responsible for protecting vital railway systems from cyber threats.',
        requirements: [
          'Bachelor\'s degree in Computer Science, Cybersecurity, or related field',
          '5+ years of experience in infrastructure security',
          'Knowledge of OT/IT security in industrial environments',
          'Experience with security assessment and penetration testing',
          'Certifications such as CISSP, CEH, or OSCP preferred',
          'Understanding of railway operations is a plus'
        ],
        benefits: [
          'Competitive salary package',
          'Annual performance bonus',
          'Comprehensive health and dental insurance',
          'Retirement savings plan',
          'Professional development opportunities',
          'Relocation assistance'
        ]
      },
      {
        id: 5,
        title: 'Full Stack Developer',
        department: 'Software',
        badgeClass: 'bg-neon-blue',
        location: 'Remote / New York, USA',
        type: 'Full-time',
        salary: '$100K - $130K',
        description: 'Develop applications for operational management and customer-facing railway services. You will build web and mobile applications that enhance the railway experience.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '4+ years of experience in full stack development',
          'Proficiency in JavaScript/TypeScript, React, Node.js',
          'Experience with databases (SQL and NoSQL)',
          'Knowledge of RESTful API design',
          'Experience with cloud platforms (AWS, Azure, GCP)'
        ],
        benefits: [
          'Competitive salary',
          'Stock options',
          'Comprehensive health, dental, and vision insurance',
          '401(k) matching',
          'Remote work policy',
          'Professional development budget',
          'Flexible working hours'
        ]
      },
      {
        id: 6,
        title: 'Signal Systems Architect',
        department: 'Engineering',
        badgeClass: 'bg-industrial-red',
        location: 'Paris, France',
        type: 'Full-time',
        salary: '€75K - €100K',
        description: 'Design and implement next-gen railway signaling systems with redundant safety features. You will be at the forefront of creating safer and more efficient rail networks.',
        requirements: [
          'Master\'s degree in Electrical Engineering, Computer Engineering, or related field',
          '7+ years of experience in railway signaling systems',
          'Knowledge of ERTMS/ETCS signaling standards',
          'Experience with safety-critical systems',
          'Understanding of railway operations and regulations',
          'Certification in functional safety (e.g., TÜV) is a plus'
        ],
        benefits: [
          'Competitive salary package',
          'Performance bonuses',
          'Comprehensive health insurance',
          'Retirement plan',
          'Relocation assistance',
          'Professional development opportunities',
          '5 weeks of paid vacation'
        ]
      }
    ];
    
    return jobs.find(job => job.id === parseInt(jobId)) || jobs[0];
  }
  
  // Add Chat Message
  function addChatMessage(type, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${type}-message`;
    messageElement.innerHTML = `<p>${message}</p>`;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Initialize Chatbot Scores
  function initializeChatbotScores() {
    if (!technicalScore) return;
    
    technicalScore.textContent = 'N/A';
    communicationScore.textContent = 'N/A';
    problemSolvingScore.textContent = 'N/A';
    culturalFitScore.textContent = 'N/A';
    overallScore.textContent = 'N/A';
    
    technicalBar.style.width = '0%';
    communicationBar.style.width = '0%';
    problemSolvingBar.style.width = '0%';
    culturalFitBar.style.width = '0%';
    overallBar.style.width = '0%';
  }
  
  // Update Chatbot Scores
  function updateChatbotScores(isFinal = false) {
    if (!technicalScore) return;
    
    const scores = {
      technical: Math.floor(Math.random() * 30) + 70, // 70-99
      communication: Math.floor(Math.random() * 30) + 70, // 70-99
      problemSolving: Math.floor(Math.random() * 30) + 70, // 70-99
      culturalFit: Math.floor(Math.random() * 30) + 70 // 70-99
    };
    
    if (isFinal) {
      // Show final scores
      technicalScore.textContent = scores.technical + '%';
      communicationScore.textContent = scores.communication + '%';
      problemSolvingScore.textContent = scores.problemSolving + '%';
      culturalFitScore.textContent = scores.culturalFit + '%';
      
      const overall = Math.floor((scores.technical + scores.communication + scores.problemSolving + scores.culturalFit) / 4);
      overallScore.textContent = overall + '%';
      
      // Update progress bars
      technicalBar.style.width = scores.technical + '%';
      communicationBar.style.width = scores.communication + '%';
      problemSolvingBar.style.width = scores.problemSolving + '%';
      culturalFitBar.style.width = scores.culturalFit + '%';
      overallBar.style.width = overall + '%';
    } else {
      // Show partial scores based on question progress
      const progress = questionIndex / chatbotQuestions.length;
      
      if (progress > 0.2) {
        technicalScore.textContent = scores.technical + '%';
        technicalBar.style.width = scores.technical + '%';
      }
      
      if (progress > 0.4) {
        communicationScore.textContent = scores.communication + '%';
        communicationBar.style.width = scores.communication + '%';
      }
      
      if (progress > 0.6) {
        problemSolvingScore.textContent = scores.problemSolving + '%';
        problemSolvingBar.style.width = scores.problemSolving + '%';
      }
      
      if (progress > 0.8) {
        culturalFitScore.textContent = scores.culturalFit + '%';
        culturalFitBar.style.width = scores.culturalFit + '%';
        
        const overall = Math.floor((scores.technical + scores.communication + scores.problemSolving + scores.culturalFit) / 4);
        overallScore.textContent = overall + '%';
        overallBar.style.width = overall + '%';
      }
    }
  }
  
  // Update Timeline Content
  function updateTimelineContent(step) {
    // Timeline content data
    const timelineSteps = [
      {
        step: 1,
        title: 'Application Submission',
        description: 'The journey begins when you submit your application through our online portal. Our system analyzes your resume for key qualifications and skills.',
        checklist: [
          'Complete application form with personal details',
          'Upload your CV/resume in PDF or DOC format',
          'Select your preferred department and role',
          'Receive confirmation email within 24 hours'
        ],
        image: 'https://pixabay.com/get/g52aa9c09c40b1cd58f7b0ad76d3cb47b6aa6d304dabb3baed54bfbc0b8c39aadb4d3bf55ffe9d7d1b26c2b9ea3b84ce5_1280.jpg'
      },
      {
        step: 2,
        title: 'Initial Screening',
        description: 'Our recruitment team reviews your application to assess your qualifications and experience against the job requirements. This is the first step in determining if there\'s a potential match.',
        checklist: [
          'Application reviewed by recruitment specialists',
          'Qualifications matched against job requirements',
          'Professional experience evaluated',
          'Decision made within 3-5 business days'
        ],
        image: 'https://pixabay.com/get/g62fe5607b42ae5dff44fcbca41bb9db24aa33d5dd8dc9f33dd29aa4a1cbecf8d05702a2bc97c1e85dc9cd08bba39c22b_1280.jpg'
      },
      {
        step: 3,
        title: 'Technical Assessment',
        description: 'Qualified candidates proceed to a technical assessment to evaluate specific skills related to the position. This may include coding challenges, design exercises, or technical questionnaires.',
        checklist: [
          'Receive assessment instructions via email',
          'Complete role-specific technical challenges',
          'Submit your work within the specified timeframe',
          'Receive feedback within one week'
        ],
        image: 'https://pixabay.com/get/g9c01fc6a42aa4a4a64214a1e60b6d56d1f2fd2d9a9f7a5a6ad8f82b4ab40ac9ff80b7d6444dff7a5c2e8621fcdb21cdf_1280.jpg'
      },
      {
        step: 4,
        title: 'Interview Process',
        description: 'Successful candidates are invited to interview with hiring managers and team members. This may involve multiple rounds to assess both technical skills and cultural fit.',
        checklist: [
          'Schedule interview at your convenience',
          'Meet with hiring managers and potential team members',
          'Discuss your experience and showcase your skills',
          'Learn more about our company and the role'
        ],
        image: 'https://pixabay.com/get/g11edba5cb6aba76d34d1aa2c3d24c0a9af2ebbbfe1d5d1d27a9b4a73acce79a56cd064e3bea6a3c3e99bd22e1e9b28ec_1280.jpg'
      },
      {
        step: 5,
        title: 'Final Decision & Onboarding',
        description: 'After all interviews are completed, a final decision is made. Successful candidates receive an offer and begin the onboarding process to join our innovative team.',
        checklist: [
          'Receive job offer with detailed compensation package',
          'Complete pre-employment requirements',
          'Attend orientation and meet your new team',
          'Begin your exciting journey with Virtual Railway'
        ],
        image: 'https://pixabay.com/get/g9f6b19714d5fd5ddf3ab3d01af5f37a4b5a27a80f3bd2a1f5f3b3cd097c42bd0b5e0bb9d05dd7b87be56f7bf2ad90a5a_1280.jpg'
      }
    ];
    
    // Find the step data
    const stepData = timelineSteps.find(data => data.step === parseInt(step));
    
    if (!stepData) return;
    
    // Create HTML for timeline content
    let html = `
      <h3>${stepData.title}</h3>
      <div class="timeline-step-grid">
        <div class="timeline-step-description">
          <p>${stepData.description}</p>
          <ul class="timeline-checklist">
    `;
    
    // Add checklist items
    stepData.checklist.forEach(item => {
      html += `<li><i class="fas fa-check-circle"></i> ${item}</li>`;
    });
    
    html += `
          </ul>
        </div>
        <div class="timeline-step-image">
          <img src="${stepData.image}" alt="${stepData.title}" class="rounded-image">
        </div>
      </div>
    `;
    
    // Update content
    timelineContent.innerHTML = html;
  }
  
  // Navigate Testimonials
  function navigateTestimonials(direction) {
    const totalTestimonials = testimonialDots.length;
    
    if (direction === 'prev') {
      currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    } else {
      currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    }
    
    updateTestimonialSlider();
  }
  
  // Update Testimonial Slider
  function updateTestimonialSlider() {
    // Update slider position
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
      if (index === currentTestimonial) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Set Active Navigation Link on Scroll
  function setActiveNavOnScroll() {
    // Get all sections
    const sections = document.querySelectorAll('main > section:not(.hidden)');
    
    // Get current scroll position
    const scrollPosition = window.scrollY;
    
    // Find the current section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
  
  // Simulate Queue Movement
  if (trainPosition) {
    let position = 10;
    const interval = setInterval(() => {
      position += 10;
      if (position > 90) {
        position = 10;
      }
      trainPosition.style.left = position + '%';
    }, 3000);
  }
  
  // Close Modals When Clicking Outside
  window.addEventListener('click', function(e) {
    if (jobDetailModal && e.target === jobDetailModal) {
      jobDetailModal.classList.add('hidden');
    }
    
    if (successModal && e.target === successModal) {
      successModal.classList.add('hidden');
    }
  });
});
