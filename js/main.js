// Firebase Configuration
let firebaseConfig = null;
let auth = null;
let isLoggedIn = false;
let currentUser = null;
let adminEmails = ['admin@virtualrail.com', 'alexander@virtualrail.com'];

// Initialize Firebase when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFirebase();
  initializeUI();
});

// Initialize Firebase
function initializeFirebase() {
  try {
    // Get Firebase configuration from the DOM
    const apiKey = document.getElementById('firebase-api-key').textContent;
    const projectId = document.getElementById('firebase-project-id').textContent;
    const appId = document.getElementById('firebase-app-id').textContent;

    firebaseConfig = {
      apiKey: apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: "000000000000", // This is a placeholder, replace with actual value if needed
      appId: appId
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();

    // Set persistence to local
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        console.log('Firebase initialized successfully');
        
        // Update Firebase configuration from environment variables
        updateFirebaseConfig();
        
        // Check the authentication state
        checkAuthState();
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Update Firebase configuration from environment variables
function updateFirebaseConfig() {
  if (!firebase.apps.length) {
    console.error('Firebase app not initialized');
    return;
  }
  console.log('Firebase configuration updated from environment variables');
}

// Initialize UI elements
function initializeUI() {
  initializeThemeToggle();
  initializeMobileMenu();
  initializeBackToTop();
  initializeProfileDropdown();
  initializeAuthForms();
  initializeJobFilter();
  initializeAnimations();
  
  // Show welcome message for first-time visitors
  if (!localStorage.getItem('welcomeMessageShown')) {
    setTimeout(() => {
      const welcomeMessage = document.getElementById('welcome-message');
      if (welcomeMessage) {
        welcomeMessage.classList.add('visible');
        
        // Close welcome message when the button is clicked
        const welcomeClose = document.getElementById('welcome-close');
        if (welcomeClose) {
          welcomeClose.addEventListener('click', () => {
            welcomeMessage.classList.remove('visible');
            localStorage.setItem('welcomeMessageShown', 'true');
          });
        }
      }
    }, 1000);
  }
}

// Initialize theme toggle functionality
function initializeThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Check if user has a preferred theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  
  // Toggle theme on click
  themeToggle.addEventListener('click', toggleTheme);
}

// Toggle between light and dark theme
function toggleTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

// Initialize back to top button functionality
function initializeBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;
  
  // Show button when user scrolls down
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize profile dropdown functionality
function initializeProfileDropdown() {
  const profileDropdown = document.querySelector('.dashboard-profile span');
  const profileMenu = document.querySelector('.profile-menu');
  
  if (!profileDropdown || !profileMenu) return;
  
  profileDropdown.addEventListener('click', () => {
    profileMenu.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.dashboard-profile') && !event.target.closest('.profile-menu')) {
      profileMenu.classList.remove('active');
    }
  });
}

// Initialize authentication forms
function initializeAuthForms() {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginForm);
  }
  
  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterForm);
  }
  
  // Profile update form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Google sign-in button
  const googleSignInBtn = document.getElementById('google-signin');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', signInWithGoogle);
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Application form submission
  const applyNowBtn = document.getElementById('apply-now');
  const applyNowBottomBtn = document.getElementById('apply-now-bottom');
  const applicationFormSection = document.getElementById('application-form-section');
  const closeApplicationBtn = document.getElementById('close-application');
  
  if (applyNowBtn && applicationFormSection) {
    applyNowBtn.addEventListener('click', () => {
      applicationFormSection.classList.add('visible');
    });
  }
  
  if (applyNowBottomBtn && applicationFormSection) {
    applyNowBottomBtn.addEventListener('click', () => {
      applicationFormSection.classList.add('visible');
    });
  }
  
  if (closeApplicationBtn && applicationFormSection) {
    closeApplicationBtn.addEventListener('click', () => {
      applicationFormSection.classList.remove('visible');
    });
  }
}

// Initialize job filter functionality
function initializeJobFilter() {
  const filterJobsBtn = document.getElementById('filter-jobs');
  const resetFiltersBtn = document.getElementById('reset-filters');
  
  if (filterJobsBtn) {
    filterJobsBtn.addEventListener('click', filterJobs);
  }
  
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      // Reset filter inputs
      const searchInput = document.getElementById('search');
      const departmentSelect = document.getElementById('department');
      const jobTypeSelect = document.getElementById('job-type');
      const locationSelect = document.getElementById('location');
      
      if (searchInput) searchInput.value = '';
      if (departmentSelect) departmentSelect.value = '';
      if (jobTypeSelect) jobTypeSelect.value = '';
      if (locationSelect) locationSelect.value = '';
      
      // Show all jobs
      filterJobs();
    });
  }
}

// Initialize animations
function initializeAnimations() {
  // Add animation classes to elements when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length > 0) {
    // Initial check on page load
    checkInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkInView);
    
    function checkInView() {
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animated');
        }
      });
    }
  }
}

// Check authentication state
function checkAuthState() {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User is signed in');
      isLoggedIn = true;
      currentUser = user;
      
      // Check if the current page is admin.html and if the user is an admin
      if (window.location.pathname.includes('admin.html')) {
        if (!adminEmails.includes(user.email)) {
          // Show access denied modal
          const accessDeniedModal = document.getElementById('access-denied-modal');
          if (accessDeniedModal) {
            accessDeniedModal.classList.add('visible');
            
            // Close modal when the close button is clicked
            const modalClose = accessDeniedModal.querySelector('.modal-close');
            if (modalClose) {
              modalClose.addEventListener('click', () => {
                window.location.href = 'index.html';
              });
            }
          }
        }
      }
      
      // Update UI for authenticated user
      handleAuthenticatedUser(user);
      
      // If this is a new user, show welcome message
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        showWelcomeMessage(user);
      }
    } else {
      console.log('User is signed out');
      isLoggedIn = false;
      currentUser = null;
      
      // Update UI for unauthenticated user
      handleUnauthenticatedUser();
      
      // Redirect from admin panel if not logged in
      if (window.location.pathname.includes('admin.html')) {
        window.location.href = 'login.html';
      }
    }
  });
}

// Handle authenticated user
function handleAuthenticatedUser(user) {
  // Update profile image and name in header
  const profileImage = document.querySelector('.profile-img');
  const profileName = document.querySelector('.dashboard-profile span');
  
  if (profileImage) {
    if (user.photoURL) {
      profileImage.src = user.photoURL;
    }
  }
  
  if (profileName) {
    if (user.displayName) {
      profileName.textContent = user.displayName.split(' ')[0];
    } else {
      profileName.textContent = user.email.split('@')[0];
    }
  }
  
  // Show user-only elements
  const authOnlyElements = document.querySelectorAll('.auth-only');
  const guestOnlyElements = document.querySelectorAll('.guest-only');
  
  authOnlyElements.forEach(element => {
    element.style.display = 'block';
  });
  
  guestOnlyElements.forEach(element => {
    element.style.display = 'none';
  });
  
  // Show admin elements if the user is an admin
  if (adminEmails.includes(user.email)) {
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    adminOnlyElements.forEach(element => {
      element.style.display = 'block';
    });
  }
}

// Handle unauthenticated user
function handleUnauthenticatedUser() {
  // Hide user-only elements
  const authOnlyElements = document.querySelectorAll('.auth-only');
  const guestOnlyElements = document.querySelectorAll('.guest-only');
  const adminOnlyElements = document.querySelectorAll('.admin-only');
  
  authOnlyElements.forEach(element => {
    element.style.display = 'none';
  });
  
  guestOnlyElements.forEach(element => {
    element.style.display = 'block';
  });
  
  adminOnlyElements.forEach(element => {
    element.style.display = 'none';
  });
}

// Handle login form submission
function handleLoginForm(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Redirect to dashboard
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    });
}

// Handle register form submission
function handleRegisterForm(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Redirect to profile completion page
      window.location.href = 'complete-profile.html';
    })
    .catch((error) => {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    });
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then((result) => {
      // Redirect to dashboard
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Google sign-in error:', error);
      alert(`Google sign-in failed: ${error.message}`);
    });
}

// Handle logout
function handleLogout() {
  auth.signOut()
    .then(() => {
      // Redirect to login page
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error('Logout error:', error);
      alert(`Logout failed: ${error.message}`);
    });
}

// Handle profile update
function handleProfileUpdate(e) {
  e.preventDefault();
  
  const displayName = document.getElementById('display-name').value;
  const photoURL = document.getElementById('photo-url').value;
  
  const user = auth.currentUser;
  
  user.updateProfile({
    displayName: displayName,
    photoURL: photoURL
  })
    .then(() => {
      alert('Profile updated successfully');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Profile update error:', error);
      alert(`Profile update failed: ${error.message}`);
    });
}

// Filter jobs
function filterJobs() {
  const searchTerm = document.getElementById('search')?.value.toLowerCase() || '';
  const department = document.getElementById('department')?.value || '';
  const jobType = document.getElementById('job-type')?.value || '';
  const location = document.getElementById('location')?.value || '';
  
  const jobCards = document.querySelectorAll('.job-card');
  let visibleCount = 0;
  
  jobCards.forEach(card => {
    const jobTitle = card.querySelector('.job-card-title h3')?.textContent.toLowerCase() || '';
    const jobDescription = card.querySelector('.job-card-description')?.textContent.toLowerCase() || '';
    const jobSkills = card.querySelector('.job-card-skills')?.textContent.toLowerCase() || '';
    const jobDepartment = card.getAttribute('data-department') || '';
    const jobTypeValue = card.getAttribute('data-type') || '';
    const jobLocation = card.getAttribute('data-location') || '';
    
    const searchMatch = jobTitle.includes(searchTerm) || 
                       jobDescription.includes(searchTerm) || 
                       jobSkills.includes(searchTerm);
    
    const departmentMatch = department === '' || jobDepartment === department;
    const typeMatch = jobType === '' || jobTypeValue === jobType;
    const locationMatch = location === '' || jobLocation === location;
    
    if (searchMatch && departmentMatch && typeMatch && locationMatch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Update job count
  const jobCount = document.getElementById('job-count');
  if (jobCount) {
    jobCount.textContent = visibleCount;
  }
}

// Show welcome message for new users
function showWelcomeMessage(user) {
  // Create welcome message element if it doesn't exist
  let welcomeMessage = document.getElementById('welcome-message');
  if (!welcomeMessage) {
    welcomeMessage = document.createElement('div');
    welcomeMessage.id = 'welcome-message';
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.innerHTML = `
      <div class="welcome-content">
        <i class="fas fa-train welcome-icon"></i>
        <h2>Welcome to VirtualRail Recruitment!</h2>
        <p>Hello ${user.displayName || user.email.split('@')[0]}, we're excited to have you on board!</p>
        <button id="welcome-close" class="btn btn-primary">Get Started</button>
      </div>
    `;
    document.body.appendChild(welcomeMessage);
    
    // Close welcome message when the button is clicked
    const welcomeClose = document.getElementById('welcome-close');
    if (welcomeClose) {
      welcomeClose.addEventListener('click', () => {
        welcomeMessage.classList.remove('visible');
      });
    }
  }
  
  // Show welcome message
  setTimeout(() => {
    welcomeMessage.classList.add('visible');
  }, 1000);
}