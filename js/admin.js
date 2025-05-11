// Admin panel JS
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase and check authentication
  initializeFirebase();
  
  // Initialize admin UI elements
  initializeAdminUI();
});

// Firebase Configuration
let firebaseConfig = null;
let auth = null;
let isLoggedIn = false;
let currentUser = null;
let adminEmails = ['robloxstudios33567@gmail.com', 'alexander@virtualrail.com'];

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

// Initialize admin UI elements
function initializeAdminUI() {
  initializeSidebar();
  initializeBackToTop();
  initializeThemeToggle();
  initializeHeaderDropdowns();
  initializeContentTabs();
  initializeModals();
  
  // Initialize form handlers
  initializeJobForm();
  initializeUserForm();
  initializeApplicationForm();
  initializeSettingsForm();
}

// Initialize sidebar functionality
function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const adminSidebar = document.querySelector('.admin-sidebar');
  
  if (sidebarToggle && adminSidebar) {
    sidebarToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('collapsed');
      
      // Save state to localStorage
      if (adminSidebar.classList.contains('collapsed')) {
        localStorage.setItem('sidebarCollapsed', 'true');
      } else {
        localStorage.setItem('sidebarCollapsed', 'false');
      }
    });
    
    // Check localStorage for saved state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      adminSidebar.classList.add('collapsed');
    }
  }
  
  // Handle sidebar navigation
  const navLinks = document.querySelectorAll('.admin-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      navLinks.forEach(item => {
        item.parentElement.classList.remove('active');
      });
      link.parentElement.classList.add('active');
      
      // Show corresponding section
      const targetId = link.getAttribute('href').substring(1);
      const sectionId = `${targetId}-section`;
      
      document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
      });
      
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // Update page title and breadcrumb
        const pageTitle = document.getElementById('page-title');
        const breadcrumbActive = document.querySelector('.admin-breadcrumb .active');
        
        if (pageTitle) {
          pageTitle.textContent = link.querySelector('span').textContent;
        }
        
        if (breadcrumbActive) {
          breadcrumbActive.textContent = link.querySelector('span').textContent;
        }
      }
    });
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
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
}

// Initialize header dropdowns
function initializeHeaderDropdowns() {
  // User menu
  const userMenuBtn = document.querySelector('.user-menu-btn');
  const userMenuDropdown = document.querySelector('.user-menu-dropdown');
  
  if (userMenuBtn && userMenuDropdown) {
    document.addEventListener('click', (event) => {
      if (userMenuBtn.contains(event.target)) {
        userMenuDropdown.style.display = userMenuDropdown.style.display === 'block' ? 'none' : 'block';
      } else if (!userMenuDropdown.contains(event.target)) {
        userMenuDropdown.style.display = 'none';
      }
    });
  }
  
  // Notification dropdown
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationDropdown = document.querySelector('.notification-dropdown');
  
  if (notificationBtn && notificationDropdown) {
    document.addEventListener('click', (event) => {
      if (notificationBtn.contains(event.target)) {
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
      } else if (!notificationDropdown.contains(event.target)) {
        notificationDropdown.style.display = 'none';
      }
    });
  }
  
  // Logout buttons
  const logoutBtn = document.getElementById('admin-logout');
  const headerLogoutBtn = document.getElementById('header-logout');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', handleLogout);
  }
}

// Initialize content tabs
function initializeContentTabs() {
  // Application tabs
  const applicationTabs = document.querySelectorAll('.application-tab');
  if (applicationTabs.length > 0) {
    applicationTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        applicationTabs.forEach(item => {
          item.classList.remove('active');
        });
        tab.classList.add('active');
        
        // Show corresponding section
        const targetSection = document.getElementById(tab.getAttribute('data-target'));
        if (targetSection) {
          document.querySelectorAll('.application-section').forEach(section => {
            section.classList.remove('active');
          });
          targetSection.classList.add('active');
        }
      });
    });
  }
  
  // Settings tabs
  const settingsTabs = document.querySelectorAll('.settings-tab');
  if (settingsTabs.length > 0) {
    settingsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        settingsTabs.forEach(item => {
          item.classList.remove('active');
        });
        tab.classList.add('active');
        
        // Show corresponding section
        const targetSection = document.getElementById(tab.getAttribute('data-target'));
        if (targetSection) {
          document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
          });
          targetSection.classList.add('active');
        }
      });
    });
  }
}

// Initialize modals
function initializeModals() {
  const modals = document.querySelectorAll('.admin-modal');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-dismiss="modal"]');
  
  // Open modal when trigger is clicked
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.add('visible');
      }
    });
  });
  
  // Close modal when close button is clicked
  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      const modal = close.closest('.admin-modal');
      
      if (modal) {
        modal.classList.remove('visible');
      }
    });
  });
  
  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('visible');
      }
    });
  });
}

// Initialize job form
function initializeJobForm() {
  const createJobForm = document.getElementById('create-job-form');
  if (!createJobForm) return;
  
  // Handle form submission
  createJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(createJobForm);
    const jobData = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this data to your backend API
    console.log('Job data:', jobData);
    
    // Close modal
    const modal = createJobForm.closest('.admin-modal');
    if (modal) {
      modal.classList.remove('visible');
    }
    
    // Reset form
    createJobForm.reset();
    
    // Show success message
    alert('Job created successfully!');
  });
}

// Initialize user form
function initializeUserForm() {
  const createUserForm = document.getElementById('create-user-form');
  if (!createUserForm) return;
  
  // Handle form submission
  createUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(createUserForm);
    const userData = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this data to your backend API
    console.log('User data:', userData);
    
    // Close modal
    const modal = createUserForm.closest('.admin-modal');
    if (modal) {
      modal.classList.remove('visible');
    }
    
    // Reset form
    createUserForm.reset();
    
    // Show success message
    alert('User created successfully!');
  });
  
  // Handle role selection
  const roleOptions = document.querySelectorAll('.role-option');
  if (roleOptions.length > 0) {
    roleOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Update active state
        roleOptions.forEach(item => {
          item.classList.remove('active');
        });
        option.classList.add('active');
        
        // Update hidden input
        const roleInput = document.getElementById('role');
        if (roleInput) {
          roleInput.value = option.getAttribute('data-role');
        }
      });
    });
  }
}

// Initialize application form
function initializeApplicationForm() {
  const applicationStatusSelect = document.getElementById('application-status');
  if (!applicationStatusSelect) return;
  
  // Handle status change
  applicationStatusSelect.addEventListener('change', () => {
    const status = applicationStatusSelect.value;
    
    // In a real application, you would send this data to your backend API
    console.log('Application status changed to:', status);
    
    // Show success message
    alert(`Application status updated to: ${status}`);
  });
}

// Initialize settings form
function initializeSettingsForm() {
  const settingsForms = document.querySelectorAll('.settings-form');
  if (settingsForms.length === 0) return;
  
  settingsForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const settingsData = Object.fromEntries(formData.entries());
      
      // In a real application, you would send this data to your backend API
      console.log('Settings data:', settingsData);
      
      // Show success message
      alert('Settings updated successfully!');
    });
  });
}

// Check authentication state
function checkAuthState() {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User is signed in');
      isLoggedIn = true;
      currentUser = user;
      
      // Check if user is admin
      if (!adminEmails.includes(user.email)) {
        // Show access denied modal
        const accessDeniedModal = document.getElementById('access-denied-modal');
        if (accessDeniedModal) {
          accessDeniedModal.classList.add('visible');
        }
      } else {
        // Update admin profile
        updateAdminProfile(user);
      }
    } else {
      console.log('User is signed out');
      isLoggedIn = false;
      currentUser = null;
      
      // Redirect to login page
      window.location.href = 'login.html';
    }
  });
}

// Update admin profile
function updateAdminProfile(user) {
  const adminName = document.getElementById('admin-name');
  const profileImage = document.querySelector('.admin-avatar');
  const userMenuImg = document.querySelector('.user-menu-btn img');
  const userMenuName = document.querySelector('.user-menu-btn span');
  
  if (adminName) {
    adminName.textContent = user.displayName || user.email.split('@')[0];
  }
  
  if (profileImage && user.photoURL) {
    profileImage.src = user.photoURL;
  }
  
  if (userMenuImg && user.photoURL) {
    userMenuImg.src = user.photoURL;
  }
  
  if (userMenuName) {
    userMenuName.textContent = (user.displayName || user.email.split('@')[0]).split(' ')[0];
  }
}

// Handle logout
function handleLogout(e) {
  if (e) e.preventDefault();
  
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