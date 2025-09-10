import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AssignmentManager = ({ 
  assignments = [], 
  onAssignmentCreate, 
  onAssignmentUpdate, 
  onAssignmentDelete,
  userRole = 'teacher' 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'homework',
    totalPoints: '',
    dueDate: '',
    description: ''
  });

  const categoryOptions = [
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'test', label: 'Test' },
    { value: 'project', label: 'Project' },
    { value: 'participation', label: 'Participation' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!formData?.name?.trim() || !formData?.totalPoints || !formData?.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const assignmentData = {
      ...formData,
      totalPoints: parseFloat(formData?.totalPoints),
      id: editingId || `assignment-${Date.now()}`,
      createdAt: editingId ? assignments?.find(a => a?.id === editingId)?.createdAt : new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    if (editingId) {
      onAssignmentUpdate && onAssignmentUpdate(assignmentData);
    } else {
      onAssignmentCreate && onAssignmentCreate(assignmentData);
    }

    resetForm();
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment?.id);
    setFormData({
      name: assignment?.name,
      category: assignment?.category,
      totalPoints: assignment?.totalPoints?.toString(),
      dueDate: assignment?.dueDate?.split('T')?.[0],
      description: assignment?.description || ''
    });
    setIsCreating(true);
  };

  const handleDelete = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment? This will remove all associated grades.')) {
      onAssignmentDelete && onAssignmentDelete(assignmentId);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'homework',
      totalPoints: '',
      dueDate: '',
      description: ''
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      homework: 'bg-blue-100 text-blue-700',
      quiz: 'bg-green-100 text-green-700',
      test: 'bg-red-100 text-red-700',
      project: 'bg-purple-100 text-purple-700',
      participation: 'bg-yellow-100 text-yellow-700'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-700';
  };

  const getAssignmentStats = (assignment) => {
    // Mock stats - in real app, calculate from grades
    return {
      submitted: Math.floor(Math.random() * 30) + 15,
      total: 45,
      averageScore: Math.floor(Math.random() * 30) + 70
    };
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Assignment Management</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage assignments for your classes
            </p>
          </div>
          
          {userRole === 'teacher' && (
            <Button
              variant="default"
              iconName="Plus"
              onClick={() => setIsCreating(true)}
              disabled={isCreating}
            >
              New Assignment
            </Button>
          )}
        </div>
      </div>
      {/* Assignment Form */}
      {isCreating && (
        <div className="p-6 border-b border-border bg-muted/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Assignment Name"
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                placeholder="Enter assignment name"
                required
              />
              
              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
                required
              />
              
              <Input
                label="Total Points"
                type="number"
                value={formData?.totalPoints}
                onChange={(e) => handleInputChange('totalPoints', e?.target?.value)}
                placeholder="100"
                min="1"
                step="0.1"
                required
              />
              
              <Input
                label="Due Date"
                type="date"
                value={formData?.dueDate}
                onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
                required
              />
            </div>
            
            <Input
              label="Description (Optional)"
              type="text"
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              placeholder="Assignment description or instructions"
            />
            
            <div className="flex items-center space-x-3">
              <Button type="submit" variant="default">
                {editingId ? 'Update Assignment' : 'Create Assignment'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Assignments List */}
      <div className="divide-y divide-border">
        {assignments?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Assignments Yet</h4>
            <p className="text-muted-foreground mb-4">
              Create your first assignment to start tracking student grades
            </p>
            {userRole === 'teacher' && (
              <Button variant="default" iconName="Plus" onClick={() => setIsCreating(true)}>
                Create Assignment
              </Button>
            )}
          </div>
        ) : (
          assignments?.map((assignment) => {
            const stats = getAssignmentStats(assignment);
            const isOverdue = new Date(assignment.dueDate) < new Date();
            
            return (
              <div key={assignment?.id} className="p-6 hover:bg-muted/30 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-foreground">{assignment?.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(assignment?.category)}`}>
                        {assignment?.category}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-1 text-xs rounded-full bg-error/10 text-error">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Icon name="Calendar" size={16} />
                        <span>Due: {new Date(assignment.dueDate)?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Target" size={16} />
                        <span>{assignment?.totalPoints} points</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} />
                        <span>{stats?.submitted}/{stats?.total} submitted</span>
                      </div>
                    </div>
                    
                    {assignment?.description && (
                      <p className="text-sm text-muted-foreground mt-2">{assignment?.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <span className="text-muted-foreground">
                        Class Average: <span className="font-medium text-foreground">{stats?.averageScore}%</span>
                      </span>
                      <span className="text-muted-foreground">
                        Completion: <span className="font-medium text-foreground">
                          {Math.round((stats?.submitted / stats?.total) * 100)}%
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  {userRole === 'teacher' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Edit"
                        onClick={() => handleEdit(assignment)}
                        title="Edit assignment"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Trash2"
                        onClick={() => handleDelete(assignment?.id)}
                        title="Delete assignment"
                        className="text-error hover:text-error hover:bg-error/10"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AssignmentManager;