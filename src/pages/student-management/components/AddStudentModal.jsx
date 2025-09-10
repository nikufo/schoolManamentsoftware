import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddStudentModal = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    studentId: '',
    grade: '',
    section: '',
    
    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Parent/Guardian Information
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    relationship: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    
    // Medical Information
    bloodType: '',
    allergies: '',
    medications: '',
    medicalConditions: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'User' },
    { id: 2, title: 'Contact Details', icon: 'MapPin' },
    { id: 3, title: 'Parent/Guardian', icon: 'Users' },
    { id: 4, title: 'Emergency & Medical', icon: 'Heart' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData?.firstName) newErrors.firstName = 'First name is required';
        if (!formData?.lastName) newErrors.lastName = 'Last name is required';
        if (!formData?.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData?.gender) newErrors.gender = 'Gender is required';
        if (!formData?.grade) newErrors.grade = 'Grade is required';
        break;
      case 2:
        if (!formData?.email) newErrors.email = 'Email is required';
        if (!formData?.address) newErrors.address = 'Address is required';
        break;
      case 3:
        if (!formData?.parentName) newErrors.parentName = 'Parent name is required';
        if (!formData?.parentPhone) newErrors.parentPhone = 'Parent phone is required';
        if (!formData?.parentEmail) newErrors.parentEmail = 'Parent email is required';
        break;
      case 4:
        if (!formData?.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData?.emergencyPhone) newErrors.emergencyPhone = 'Emergency contact phone is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const studentData = {
        id: Date.now(),
        name: `${formData?.firstName} ${formData?.lastName}`,
        studentId: formData?.studentId || `STU${Date.now()?.toString()?.slice(-6)}`,
        email: formData?.email,
        phone: formData?.phone,
        grade: formData?.grade,
        section: formData?.section,
        status: 'active',
        dateOfBirth: formData?.dateOfBirth,
        gender: formData?.gender,
        address: formData?.address,
        parentName: formData?.parentName,
        parentPhone: formData?.parentPhone,
        parentEmail: formData?.parentEmail,
        parentOccupation: formData?.parentOccupation,
        enrollmentDate: new Date()?.toISOString(),
        lastActivity: new Date()?.toISOString(),
        gpa: '0.00',
        attendanceRate: 100,
        classRank: 1,
        bloodType: formData?.bloodType,
        allergies: formData?.allergies,
        medications: formData?.medications,
        emergencyContacts: [{
          name: formData?.emergencyName,
          phone: formData?.emergencyPhone,
          relationship: formData?.emergencyRelationship,
          email: ''
        }]
      };
      
      onSave(studentData);
      onClose();
      setCurrentStep(1);
      setFormData({});
      setErrors({});
    }
  };

  const gradeOptions = [
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: 'grade-1', label: 'Grade 1' },
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-3', label: 'Grade 3' },
    { value: 'grade-4', label: 'Grade 4' },
    { value: 'grade-5', label: 'Grade 5' },
    { value: 'grade-6', label: 'Grade 6' },
    { value: 'grade-7', label: 'Grade 7' },
    { value: 'grade-8', label: 'Grade 8' },
    { value: 'grade-9', label: 'Grade 9' },
    { value: 'grade-10', label: 'Grade 10' },
    { value: 'grade-11', label: 'Grade 11' },
    { value: 'grade-12', label: 'Grade 12' }
  ];

  const sectionOptions = [
    { value: 'section-a', label: 'Section A' },
    { value: 'section-b', label: 'Section B' },
    { value: 'section-c', label: 'Section C' },
    { value: 'section-d', label: 'Section D' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const bloodTypeOptions = [
    { value: 'a+', label: 'A+' },
    { value: 'a-', label: 'A-' },
    { value: 'b+', label: 'B+' },
    { value: 'b-', label: 'B-' },
    { value: 'ab+', label: 'AB+' },
    { value: 'ab-', label: 'AB-' },
    { value: 'o+', label: 'O+' },
    { value: 'o-', label: 'O-' }
  ];

  const relationshipOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'aunt', label: 'Aunt' },
    { value: 'other', label: 'Other' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                value={formData?.firstName}
                onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                error={errors?.firstName}
              />
              
              <Input
                label="Last Name"
                required
                value={formData?.lastName}
                onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                error={errors?.lastName}
              />
              
              <Input
                label="Date of Birth"
                type="date"
                required
                value={formData?.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
                error={errors?.dateOfBirth}
              />
              
              <Select
                label="Gender"
                required
                options={genderOptions}
                value={formData?.gender}
                onChange={(value) => handleInputChange('gender', value)}
                error={errors?.gender}
              />
              
              <Input
                label="Student ID"
                description="Leave blank to auto-generate"
                value={formData?.studentId}
                onChange={(e) => handleInputChange('studentId', e?.target?.value)}
              />
              
              <Select
                label="Grade Level"
                required
                options={gradeOptions}
                value={formData?.grade}
                onChange={(value) => handleInputChange('grade', value)}
                error={errors?.grade}
              />
              
              <Select
                label="Section"
                options={sectionOptions}
                value={formData?.section}
                onChange={(value) => handleInputChange('section', value)}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
              />
              
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
              />
            </div>
            <Input
              label="Street Address"
              required
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              error={errors?.address}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={formData?.city}
                onChange={(e) => handleInputChange('city', e?.target?.value)}
              />
              
              <Input
                label="State"
                value={formData?.state}
                onChange={(e) => handleInputChange('state', e?.target?.value)}
              />
              
              <Input
                label="ZIP Code"
                value={formData?.zipCode}
                onChange={(e) => handleInputChange('zipCode', e?.target?.value)}
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Parent/Guardian Name"
                required
                value={formData?.parentName}
                onChange={(e) => handleInputChange('parentName', e?.target?.value)}
                error={errors?.parentName}
              />
              
              <Select
                label="Relationship"
                options={relationshipOptions}
                value={formData?.relationship}
                onChange={(value) => handleInputChange('relationship', value)}
              />
              
              <Input
                label="Parent Phone"
                type="tel"
                required
                value={formData?.parentPhone}
                onChange={(e) => handleInputChange('parentPhone', e?.target?.value)}
                error={errors?.parentPhone}
              />
              
              <Input
                label="Parent Email"
                type="email"
                required
                value={formData?.parentEmail}
                onChange={(e) => handleInputChange('parentEmail', e?.target?.value)}
                error={errors?.parentEmail}
              />
              
              <Input
                label="Occupation"
                value={formData?.parentOccupation}
                onChange={(e) => handleInputChange('parentOccupation', e?.target?.value)}
                className="md:col-span-2"
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Emergency Contact Name"
                  required
                  value={formData?.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e?.target?.value)}
                  error={errors?.emergencyName}
                />
                
                <Input
                  label="Emergency Phone"
                  type="tel"
                  required
                  value={formData?.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e?.target?.value)}
                  error={errors?.emergencyPhone}
                />
                
                <Select
                  label="Relationship"
                  options={relationshipOptions}
                  value={formData?.emergencyRelationship}
                  onChange={(value) => handleInputChange('emergencyRelationship', value)}
                  className="md:col-span-2"
                />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">Medical Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Blood Type"
                  options={bloodTypeOptions}
                  value={formData?.bloodType}
                  onChange={(value) => handleInputChange('bloodType', value)}
                />
                
                <Input
                  label="Known Allergies"
                  value={formData?.allergies}
                  onChange={(e) => handleInputChange('allergies', e?.target?.value)}
                />
                
                <Input
                  label="Current Medications"
                  value={formData?.medications}
                  onChange={(e) => handleInputChange('medications', e?.target?.value)}
                />
                
                <Input
                  label="Medical Conditions"
                  value={formData?.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e?.target?.value)}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-110 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-background/80 backdrop-blur-sm" onClick={onClose} />
        
        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-modal rounded-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Add New Student</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              {steps?.map((step, index) => (
                <div key={step?.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step?.id ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </p>
                  </div>
                  
                  {index < steps?.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step?.id ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps?.length}
            </div>
            
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
              
              {currentStep < steps?.length ? (
                <Button variant="default" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="default" onClick={handleSubmit}>
                  Add Student
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;