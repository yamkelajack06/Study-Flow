import { useNavigate } from 'react-router-dom';
import { Calendar, Cloud, Lock, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/landingpage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { googleSignIn } = useAuth();

  const handleContinueWithoutLogin = () => {
    navigate('/app');
  };

  const handleLoginWithGoogle = async () => {
    try {
      await googleSignIn();
      navigate('/app');
    } catch (err) {
      console.error('Google sign-in failed:', err);
      // Fall back to signup page on error
      navigate('/signup');
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <Calendar size={40} strokeWidth={2} />
            </div>
            <h1 className={styles.appName}>Study Timetable</h1>
          </div>

          <h2 className={styles.headline}>
            Organize your study schedule
            <br />
            with intelligent planning
          </h2>

          <p className={styles.subheadline}>
            A smart timetable app powered by AI to help you manage classes,
            study sessions, and deadlines effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaContainer}>
            <button
              className={`${styles.ctaButton} ${styles.primary}`}
              //This should navigate to the signin page
              onClick={() => navigate('/signup')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={styles.googleIcon}
              >
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <button
              className={`${styles.ctaButton} ${styles.secondary}`}
              onClick={handleContinueWithoutLogin}
            >
              Continue without login
            </button>
          </div>

          <p className={styles.privacyNote}>
            <Lock size={14} />
            Your data is private and secure
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className={styles.previewCards}>
          <div className={styles.previewCard}>
            <div className={styles.cardIcon}>
              <Calendar size={24} />
            </div>
            <h3>Smart Scheduling</h3>
            <p>Weekly, monthly, and daily views of your timetable</p>
          </div>

          <div className={styles.previewCard}>
            <div className={styles.cardIcon}>
              <Sparkles size={24} />
            </div>
            <h3>AI Assistant</h3>
            <p>Natural language commands to manage your schedule</p>
          </div>

          <div className={styles.previewCard}>
            <div className={styles.cardIcon}>
              <Cloud size={24} />
            </div>
            <h3>Cloud Sync</h3>
            <p>Access your timetable across all your devices</p>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className={styles.comparisonSection}>
        <h3 className={styles.comparisonTitle}>Choose your experience</h3>

        <div className={styles.comparisonGrid}>
          {/* Local Storage Option */}
          <div className={styles.comparisonCard}>
            <div className={styles.comparisonHeader}>
              <h4>Continue without login</h4>
              <span className={styles.badge}>Quick Start</span>
            </div>
            <ul className={styles.featureList}>
              <li><Check size={18} /><span>No account needed</span></li>
              <li><Check size={18} /><span>All core features available</span></li>
              <li><Check size={18} /><span>Data stored locally on device</span></li>
              <li><Check size={18} /><span>Complete privacy</span></li>
            </ul>
            <p className={styles.limitation}>
              Note: Your data stays on this device only
            </p>
          </div>

          {/* Cloud Sync Option */}
          <div className={`${styles.comparisonCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>Recommended</div>
            <div className={styles.comparisonHeader}>
              <h4>Sign in with Google</h4>
              <span className={styles.badge}>Full Access</span>
            </div>
            <ul className={styles.featureList}>
              <li><Check size={18} /><span>All features without login</span></li>
              <li><Check size={18} /><span>Sync across all devices</span></li>
              <li><Check size={18} /><span>Automatic cloud backup</span></li>
              <li><Check size={18} /><span>Access from anywhere</span></li>
            </ul>
            <p className={styles.benefit}>
              Your timetable, available on every device
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Made with care for students everywhere</p>
      </footer>
    </div>
  );
};

export default LandingPage;