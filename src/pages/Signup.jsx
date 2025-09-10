import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Icon from '../components/AppIcon';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    // Validation
    if (!formData?.fullName?.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData?.email?.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp({
        email: formData?.email,
        password: formData?.password,
        userData: {
          full_name: formData?.fullName,
          role: formData?.role
        }
      });
      
      if (error) {
        setError(error);
      } else {
        // Success - redirect to login with success message
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please sign in with your credentials.' 
          }
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent/Guardian' }
  ];

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
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join SchoolSync Pro today</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData?.fullName || ''}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData?.email || ''}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                Role
              </label>
              <Select
                id="role"
                name="role"
                value={formData?.role || 'student'}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                options={roleOptions}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData?.password || ''}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData?.confirmPassword || ''}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  disabled={loading}
                >
                  <Icon 
                    name={showConfirmPassword ? "EyeOff" : "Eye"} 
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-primary hover:text-primary/80 text-sm transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date()?.getFullYear()} SchoolSync Pro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;