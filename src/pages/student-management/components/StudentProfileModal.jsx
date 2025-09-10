import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentProfileModal = ({ student, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student || {});

  if (!isOpen || !student) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'academic', label: 'Academic', icon: 'BookOpen' },
    { id: 'family', label: 'Family', icon: 'Users' },
    { id: 'health', label: 'Health', icon: 'Heart' },
    { id: 'activity', label: 'Activity', icon: 'Activity' }
  ];

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
      suspended: { color: 'bg-warning text-warning-foreground', label: 'Suspended' },
      graduated: { color: 'bg-primary text-primary-foreground', label: 'Graduated' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">
            {student?.name?.split(' ')?.map(n => n?.[0])?.join('')}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h2 className="text-2xl font-bold text-foreground">{student?.name}</h2>
            {getStatusBadge(student?.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Student ID:</span>
              <span className="ml-2 font-mono text-foreground">{student?.studentId}</span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Grade:</span>
              <span className="ml-2 text-foreground">{student?.grade}</span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Date of Birth:</span>
              <span className="ml-2 text-foreground">{formatDate(student?.dateOfBirth)}</span>
            </div>
            
            <div>
              <span className="text-muted-foreground">Gender:</span>
              <span className="ml-2 text-foreground capitalize">{student?.gender}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData?.name || ''}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone || ''}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
          />
          
          <Select
            label="Grade Level"
            options={[
              { value: 'kindergarten', label: 'Kindergarten' },
              { value: 'grade-1', label: 'Grade 1' },
              { value: 'grade-2', label: 'Grade 2' },
              { value: 'grade-3', label: 'Grade 3' },
              { value: 'grade-4', label: 'Grade 4' },
              { value: 'grade-5', label: 'Grade 5' }
            ]}
            value={formData?.grade || ''}
            onChange={(value) => handleInputChange('grade', value)}
          />
          
          <Input
            label="Address"
            value={formData?.address || ''}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            className="md:col-span-2"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{student?.email}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{student?.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{student?.address}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Academic Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Enrollment Date:</span>
                  <span className="text-sm text-foreground">{formatDate(student?.enrollmentDate)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current GPA:</span>
                  <span className="text-sm text-foreground">{student?.gpa}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Attendance Rate:</span>
                  <span className="text-sm text-foreground">{student?.attendanceRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAcademicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <h4 className="font-medium text-foreground">Current GPA</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">{student?.gpa}</p>
          <p className="text-sm text-muted-foreground">Out of 4.0</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            <h4 className="font-medium text-foreground">Attendance</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">{student?.attendanceRate}%</p>
          <p className="text-sm text-muted-foreground">This semester</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={20} className="text-accent" />
            <h4 className="font-medium text-foreground">Rank</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">#{student?.classRank}</p>
          <p className="text-sm text-muted-foreground">In class</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-foreground mb-4">Recent Grades</h4>
        <div className="space-y-3">
          {student?.recentGrades?.map((grade, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{grade?.subject}</p>
                <p className="text-sm text-muted-foreground">{grade?.assignment}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-foreground">{grade?.score}%</p>
                <p className="text-sm text-muted-foreground">{formatDate(grade?.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFamilyTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-foreground mb-4">Primary Contact</h4>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-secondary-foreground" />
            </div>
            
            <div>
              <h5 className="font-medium text-foreground">{student?.parentName}</h5>
              <p className="text-sm text-muted-foreground">Primary Guardian</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="Phone" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{student?.parentPhone}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{student?.parentEmail}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Briefcase" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{student?.parentOccupation}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{student?.address}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-foreground mb-4">Emergency Contacts</h4>
        <div className="space-y-3">
          {student?.emergencyContacts?.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{contact?.name}</p>
                <p className="text-sm text-muted-foreground">{contact?.relationship}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-foreground">{contact?.phone}</p>
                <p className="text-xs text-muted-foreground">{contact?.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHealthTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium text-foreground mb-4">Medical Information</h4>
          <div className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">Blood Type</p>
              <p className="text-sm text-muted-foreground">{student?.bloodType || 'Not specified'}</p>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">Allergies</p>
              <p className="text-sm text-muted-foreground">{student?.allergies || 'None reported'}</p>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">Medications</p>
              <p className="text-sm text-muted-foreground">{student?.medications || 'None'}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-foreground mb-4">Health Records</h4>
          <div className="space-y-3">
            {student?.healthRecords?.map((record, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-foreground">{record?.type}</p>
                    <p className="text-sm text-muted-foreground">{record?.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(record?.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-foreground mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {student?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={activity?.icon} size={16} className="text-primary-foreground" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                <p className="text-sm text-muted-foreground">{activity?.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(activity?.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'academic':
        return renderAcademicTab();
      case 'family':
        return renderFamilyTab();
      case 'health':
        return renderHealthTab();
      case 'activity':
        return renderActivityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="fixed inset-0 z-110 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-background/80 backdrop-blur-sm" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-modal rounded-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-foreground">Student Profile</h3>
              <span className="text-sm text-muted-foreground">ID: {student?.studentId}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" iconName="Edit" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
              
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;