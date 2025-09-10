import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const StudentTable = ({ 
  students, 
  selectedStudents, 
  onSelectStudent, 
  onSelectAll, 
  onStudentClick, 
  onQuickAction,
  sortField,
  sortDirection,
  onSort
}) => {
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedStudents?.length === students?.length && students?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span>Student Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('studentId')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span>Student ID</span>
                  <Icon name={getSortIcon('studentId')} size={14} />
                </button>
              </th>
              
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('grade')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span>Grade</span>
                  <Icon name={getSortIcon('grade')} size={14} />
                </button>
              </th>
              
              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              
              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-foreground">Parent Contact</span>
              </th>
              
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span>Last Activity</span>
                  <Icon name={getSortIcon('lastActivity')} size={14} />
                </button>
              </th>
              
              <th className="text-center px-4 py-3">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {students?.map((student) => (
              <tr
                key={student?.id}
                className="hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
                onClick={() => onStudentClick(student)}
              >
                <td className="px-4 py-3" onClick={(e) => e?.stopPropagation()}>
                  <Checkbox
                    checked={selectedStudents?.includes(student?.id)}
                    onChange={(e) => onSelectStudent(student?.id, e?.target?.checked)}
                  />
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {student?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{student?.name}</p>
                      <p className="text-xs text-muted-foreground">{student?.email}</p>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-foreground">{student?.studentId}</span>
                </td>
                
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{student?.grade}</span>
                </td>
                
                <td className="px-4 py-3">
                  {getStatusBadge(student?.status)}
                </td>
                
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-foreground">{student?.parentName}</p>
                    <p className="text-xs text-muted-foreground">{student?.parentPhone}</p>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(student?.lastActivity)}
                  </span>
                </td>
                
                <td className="px-4 py-3" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('edit', student)}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('message', student)}
                      className="w-8 h-8"
                    >
                      <Icon name="MessageCircle" size={14} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('records', student)}
                      className="w-8 h-8"
                    >
                      <Icon name="FileText" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {students?.map((student) => (
          <div
            key={student?.id}
            className="p-4 hover:bg-muted/30 transition-colors duration-200"
            onClick={() => onStudentClick(student)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedStudents?.includes(student?.id)}
                  onChange={(e) => onSelectStudent(student?.id, e?.target?.checked)}
                  onClick={(e) => e?.stopPropagation()}
                />
                
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {student?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-foreground">{student?.name}</h3>
                  <p className="text-xs text-muted-foreground">{student?.studentId}</p>
                </div>
              </div>
              
              {getStatusBadge(student?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-muted-foreground">Grade:</span>
                <span className="ml-1 text-foreground">{student?.grade}</span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Parent:</span>
                <span className="ml-1 text-foreground">{student?.parentName}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Last activity: {formatDate(student?.lastActivity)}
              </span>
              
              <div className="flex space-x-1" onClick={(e) => e?.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuickAction('edit', student)}
                  className="w-8 h-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuickAction('message', student)}
                  className="w-8 h-8"
                >
                  <Icon name="MessageCircle" size={14} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuickAction('records', student)}
                  className="w-8 h-8"
                >
                  <Icon name="FileText" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTable;