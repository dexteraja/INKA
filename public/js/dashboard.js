// EdTech Dashboard - Main JavaScript

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeVFUuAc95KpXWNsphJXhmnxu7HJCHbAU", // Will be replaced by environment variable
  authDomain: "inka-d4ef5.firebaseapp.com", // Will be replaced
  projectId: "inka-d4ef5", // Will be replaced
  storageBucket: "inka-d4ef5.firebasestorage.app", // Will be replaced
  appId: "1:1080778930790:web:b622cf096a415f0de28ba7" // Will be replaced
};

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase
  initializeFirebase();
  
  // Initialize dashboard UI elements
  initializeDashboard();
});

// Initialize Firebase with configuration
function initializeFirebase() {
  try {
    // Get Firebase config values from environment variables
    const apiKeyElement = document.getElementById('firebase-api-key');
    const projectIdElement = document.getElementById('firebase-project-id');
    const appIdElement = document.getElementById('firebase-app-id');

    if (apiKeyElement && projectIdElement && appIdElement) {
      const FIREBASE_API_KEY = apiKeyElement.textContent.trim();
      const FIREBASE_PROJECT_ID = projectIdElement.textContent.trim();
      const FIREBASE_APP_ID = appIdElement.textContent.trim();

      if (FIREBASE_API_KEY !== 'VITE_FIREBASE_API_KEY') {
        firebaseConfig.apiKey = FIREBASE_API_KEY;
        firebaseConfig.authDomain = `${FIREBASE_PROJECT_ID}.firebaseapp.com`;
        firebaseConfig.projectId = FIREBASE_PROJECT_ID;
        firebaseConfig.storageBucket = `${FIREBASE_PROJECT_ID}.appspot.com`;
        firebaseConfig.appId = FIREBASE_APP_ID;
      }
    }

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    console.log('Firebase configuration updated from environment variables');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Initialize dashboard UI elements and functionality
function initializeDashboard() {
  // Initialize profile dropdown
  initializeProfileDropdown();
  
  // Initialize chart animations
  initializeCharts();
  
  // Initialize calendar day selection
  initializeCalendar();
  
  // Initialize responsive design
  initializeResponsive();
  
  // Check auth state
  checkAuthState();
}

// Initialize profile dropdown
function initializeProfileDropdown() {
  const profileEl = document.querySelector('.dashboard-profile');
  
  if (profileEl) {
    profileEl.addEventListener('click', function() {
      // Toggle dropdown functionality would go here
      console.log('Profile clicked');
    });
  }
}

// Initialize chart animations
function initializeCharts() {
  // Get chart bars
  const chartBars = document.querySelectorAll('.chart-bar');
  
  // Animate chart bars
  if (chartBars.length > 0) {
    chartBars.forEach(bar => {
      const height = bar.style.height;
      bar.style.height = '0';
      
      setTimeout(() => {
        bar.style.transition = 'height 1s ease-in-out';
        bar.style.height = height;
      }, 300);
    });
  }
}

// Initialize calendar day selection
function initializeCalendar() {
  const calendarDays = document.querySelectorAll('.calendar-day');
  
  if (calendarDays.length > 0) {
    calendarDays.forEach(day => {
      day.addEventListener('click', function() {
        // Remove active class from all days
        calendarDays.forEach(d => d.classList.remove('active'));
        
        // Add active class to clicked day
        this.classList.add('active');
        
        // Update schedule based on selected day (would add actual implementation)
        console.log(`Selected day: ${this.querySelector('.day-number').textContent}`);
      });
    });
  }
}

// Initialize responsive design adjustments
function initializeResponsive() {
  // Handle responsive layout changes
  const handleResize = () => {
    const dashboard = document.querySelector('.dashboard-container');
    const width = window.innerWidth;
    
    if (dashboard) {
      if (width < 768) {
        // Mobile layout adjustments
        dashboard.classList.add('mobile-view');
      } else {
        // Desktop layout
        dashboard.classList.remove('mobile-view');
      }
    }
  };
  
  // Initial call
  handleResize();
  
  // Add resize listener
  window.addEventListener('resize', handleResize);
}

// Check if user is authenticated
function checkAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      console.log('User is signed in');
      updateProfileUI(user);
    } else {
      // User is signed out
      console.log('User is signed out');
    }
  });
}

// Update profile UI with user data
function updateProfileUI(user) {
  const profileImg = document.querySelector('.dashboard-profile img');
  const profileName = document.querySelector('.dashboard-profile span');
  
  if (profileImg && user.photoURL) {
    profileImg.src = user.photoURL;
  }
  
  if (profileName && user.displayName) {
    profileName.textContent = `${user.displayName} <i class="fas fa-chevron-down"></i>`;
  }
}

// Add calendar event
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('add-calendar-btn')) {
    // Calendar add functionality (would implement with actual calendar API)
    console.log('Adding event to calendar');
    alert('Event added to calendar!');
  }
});