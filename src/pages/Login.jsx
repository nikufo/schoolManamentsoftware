import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Icon from '../components/AppIcon';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn({ email, password });
      
      if (error) {
        setError(error);
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn({ email: demoEmail, password: demoPassword });
      
      if (error) {
        setError(error);
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={24} className="text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-foreground">SchoolSync Pro</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your SchoolSync Pro account</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e?.target?.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  disabled={loading}
                >
                  <Icon 
                    name={showPassword ? "EyeOff" : "Eye"} 
                    size={16} 
                    className="text-muted-foreground hover:text-foreground"
                  />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3 text-center">Demo Credentials</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin('admin@schoolsync.edu', 'admin123')}
                className="w-full text-left p-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Administrator</p>
                    <p className="text-xs text-muted-foreground">admin@schoolsync.edu</p>
                  </div>
                  <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    Admin
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDemoLogin('sarah.johnson@schoolsync.edu', 'teacher123')}
                className="w-full text-left p-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Teacher</p>
                    <p className="text-xs text-muted-foreground">sarah.johnson@schoolsync.edu</p>
                  </div>
                  <div className="px-2 py-1 bg-success/10 text-success text-xs rounded">
                    Teacher
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleDemoLogin('emma.wilson@student.schoolsync.edu', 'student123')}
                className="w-full text-left p-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Student</p>
                    <p className="text-xs text-muted-foreground">emma.wilson@student.schoolsync.edu</p>
                  </div>
                  <div className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                    Student
                  </div>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Click any demo account to sign in automatically
            </p>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link 
              to="/signup" 
              className="text-primary hover:text-primary/80 text-sm transition-colors"
            >
              Don&rsquo;t have an account? Sign up
            </Link>
            <br />
            <Link 
              to="/forgot-password" 
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} SchoolSync Pro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;