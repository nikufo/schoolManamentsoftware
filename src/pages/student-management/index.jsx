import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import StudentTableHeader from './components/StudentTableHeader';
import StudentTable from './components/StudentTable';
import StudentProfileModal from './components/StudentProfileModal';
import AddStudentModal from './components/AddStudentModal';

import Button from '../../components/ui/Button';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // State management
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Table states
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock student data
  const mockStudents = [
    {
      id: 1,
      name: "Emma Johnson",
      studentId: "STU001",
      email: "emma.johnson@email.com",
      phone: "(555) 123-4567",
      grade: "grade-10",
      section: "section-a",
      status: "active",
      dateOfBirth: "2008-03-15",
      gender: "female",
      address: "123 Oak Street, Springfield, IL 62701",
      parentName: "Michael Johnson",
      parentPhone: "(555) 123-4568",
      parentEmail: "michael.johnson@email.com",
      parentOccupation: "Software Engineer",
      enrollmentDate: "2023-08-15",
      lastActivity: "2024-01-08",
      gpa: "3.85",
      attendanceRate: 95,
      classRank: 5,
      bloodType: "o+",
      allergies: "Peanuts",
      medications: "None",
      emergencyContacts: [
        { name: "Sarah Johnson", phone: "(555) 123-4569", relationship: "mother", email: "sarah.johnson@email.com" }
      ],
      recentGrades: [
        { subject: "Mathematics", assignment: "Algebra Test", score: 92, date: "2024-01-05" },
        { subject: "English", assignment: "Essay Writing", score: 88, date: "2024-01-03" },
        { subject: "Science", assignment: "Chemistry Lab", score: 95, date: "2024-01-02" }
      ],
      healthRecords: [
        { type: "Annual Checkup", description: "Regular health examination", date: "2023-09-15" },
        { type: "Vaccination", description: "Flu shot administered", date: "2023-10-20" }
      ],
      recentActivity: [
        { icon: "BookOpen", title: "Grade Updated", description: "Mathematics test score: 92%", date: "2024-01-05" },
        { icon: "CheckSquare", title: "Attendance Marked", description: "Present for all classes", date: "2024-01-08" },
        { icon: "MessageCircle", title: "Parent Contact", description: "Meeting scheduled with parents", date: "2024-01-07" }
      ]
    },
    {
      id: 2,
      name: "Liam Rodriguez",
      studentId: "STU002",
      email: "liam.rodriguez@email.com",
      phone: "(555) 234-5678",
      grade: "grade-9",
      section: "section-b",
      status: "active",
      dateOfBirth: "2009-07-22",
      gender: "male",
      address: "456 Pine Avenue, Springfield, IL 62702",
      parentName: "Carlos Rodriguez",
      parentPhone: "(555) 234-5679",
      parentEmail: "carlos.rodriguez@email.com",
      parentOccupation: "Teacher",
      enrollmentDate: "2023-08-15",
      lastActivity: "2024-01-08",
      gpa: "3.92",
      attendanceRate: 98,
      classRank: 2,
      bloodType: "a+",
      allergies: "None",
      medications: "Inhaler for asthma",
      emergencyContacts: [
        { name: "Maria Rodriguez", phone: "(555) 234-5680", relationship: "mother", email: "maria.rodriguez@email.com" }
      ],
      recentGrades: [
        { subject: "History", assignment: "World War II Essay", score: 96, date: "2024-01-06" },
        { subject: "Mathematics", assignment: "Geometry Quiz", score: 89, date: "2024-01-04" },
        { subject: "English", assignment: "Poetry Analysis", score: 94, date: "2024-01-03" }
      ],
      healthRecords: [
        { type: "Asthma Checkup", description: "Respiratory function assessment", date: "2023-11-10" }
      ],
      recentActivity: [
        { icon: "Award", title: "Achievement", description: "Honor roll for semester", date: "2024-01-06" },
        { icon: "BookOpen", title: "Grade Updated", description: "History essay score: 96%", date: "2024-01-06" }
      ]
    },
    {
      id: 3,
      name: "Sophia Chen",
      studentId: "STU003",
      email: "sophia.chen@email.com",
      phone: "(555) 345-6789",
      grade: "grade-11",
      section: "section-a",
      status: "active",
      dateOfBirth: "2007-11-08",
      gender: "female",
      address: "789 Maple Drive, Springfield, IL 62703",
      parentName: "David Chen",
      parentPhone: "(555) 345-6790",
      parentEmail: "david.chen@email.com",
      parentOccupation: "Doctor",
      enrollmentDate: "2022-08-20",
      lastActivity: "2024-01-07",
      gpa: "4.00",
      attendanceRate: 100,
      classRank: 1,
      bloodType: "b+",
      allergies: "Shellfish",
      medications: "None",
      emergencyContacts: [
        { name: "Linda Chen", phone: "(555) 345-6791", relationship: "mother", email: "linda.chen@email.com" }
      ],
      recentGrades: [
        { subject: "Physics", assignment: "Quantum Mechanics", score: 98, date: "2024-01-07" },
        { subject: "Calculus", assignment: "Integration Test", score: 100, date: "2024-01-05" },
        { subject: "Chemistry", assignment: "Organic Compounds", score: 97, date: "2024-01-04" }
      ],
      healthRecords: [
        { type: "Annual Physical", description: "Complete health examination", date: "2023-08-15" }
      ],
      recentActivity: [
        { icon: "Trophy", title: "Academic Excellence", description: "Perfect GPA maintained", date: "2024-01-07" },
        { icon: "BookOpen", title: "Grade Updated", description: "Physics assignment: 98%", date: "2024-01-07" }
      ]
    },
    {
      id: 4,
      name: "Noah Williams",
      studentId: "STU004",
      email: "noah.williams@email.com",
      phone: "(555) 456-7890",
      grade: "grade-8",
      section: "section-c",
      status: "inactive",
      dateOfBirth: "2010-01-30",
      gender: "male",
      address: "321 Elm Street, Springfield, IL 62704",
      parentName: "Jennifer Williams",
      parentPhone: "(555) 456-7891",
      parentEmail: "jennifer.williams@email.com",
      parentOccupation: "Nurse",
      enrollmentDate: "2023-08-15",
      lastActivity: "2023-12-15",
      gpa: "3.45",
      attendanceRate: 85,
      classRank: 12,
      bloodType: "ab+",
      allergies: "Dust mites",
      medications: "Allergy medication",
      emergencyContacts: [
        { name: "Robert Williams", phone: "(555) 456-7892", relationship: "father", email: "robert.williams@email.com" }
      ],
      recentGrades: [
        { subject: "English", assignment: "Book Report", score: 78, date: "2023-12-10" },
        { subject: "Mathematics", assignment: "Algebra Quiz", score: 82, date: "2023-12-08" }
      ],
      healthRecords: [
        { type: "Allergy Treatment", description: "Prescribed antihistamines", date: "2023-10-05" }
      ],
      recentActivity: [
        { icon: "AlertCircle", title: "Attendance Alert", description: "Multiple absences noted", date: "2023-12-15" }
      ]
    },
    {
      id: 5,
      name: "Ava Thompson",
      studentId: "STU005",
      email: "ava.thompson@email.com",
      phone: "(555) 567-8901",
      grade: "grade-12",
      section: "section-a",
      status: "active",
      dateOfBirth: "2006-05-12",
      gender: "female",
      address: "654 Cedar Lane, Springfield, IL 62705",
      parentName: "Mark Thompson",
      parentPhone: "(555) 567-8902",
      parentEmail: "mark.thompson@email.com",
      parentOccupation: "Lawyer",
      enrollmentDate: "2021-08-25",
      lastActivity: "2024-01-08",
      gpa: "3.78",
      attendanceRate: 92,
      classRank: 8,
      bloodType: "o-",
      allergies: "None",
      medications: "Birth control",
      emergencyContacts: [
        { name: "Susan Thompson", phone: "(555) 567-8903", relationship: "mother", email: "susan.thompson@email.com" }
      ],
      recentGrades: [
        { subject: "Government", assignment: "Constitutional Law", score: 91, date: "2024-01-08" },
        { subject: "Literature", assignment: "Shakespeare Analysis", score: 87, date: "2024-01-06" }
      ],
      healthRecords: [
        { type: "Senior Physical", description: "College preparation health check", date: "2023-09-01" }
      ],
      recentActivity: [
        { icon: "GraduationCap", title: "College Prep", description: "SAT scores submitted", date: "2024-01-08" },
        { icon: "BookOpen", title: "Grade Updated", description: "Government assignment: 91%", date: "2024-01-08" }
      ]
    }
  ];

  // Initialize data
  useEffect(() => {
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
    
    // Check for search parameter from URL
    const searchParam = searchParams?.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    // Check for add action
    const actionParam = searchParams?.get('action');
    if (actionParam === 'add') {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(student =>
        student?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        student?.studentId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        student?.parentName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        student?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply grade filter
    if (selectedGrade !== 'all') {
      filtered = filtered?.filter(student => student?.grade === selectedGrade);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered?.filter(student => student?.status === selectedStatus);
    }

    // Apply class filter
    if (selectedClass !== 'all') {
      filtered = filtered?.filter(student => student?.section === selectedClass);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      if (sortField === 'lastActivity') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [students, searchQuery, selectedGrade, selectedStatus, selectedClass, sortField, sortDirection]);

  // Event handlers
  const handleStudentSelect = (studentId, isSelected) => {
    if (isSelected) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev?.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedStudents(filteredStudents?.map(student => student?.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const handleQuickAction = (action, student) => {
    switch (action) {
      case 'edit':
        setSelectedStudent(student);
        setIsProfileModalOpen(true);
        break;
      case 'message':
        // Navigate to communication system
        console.log('Send message to:', student?.name);
        break;
      case 'records':
        // Navigate to academic records
        navigate('/grade-management', { state: { studentId: student?.id } });
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, 'for students:', selectedStudents);
    // Implement bulk actions here
    setSelectedStudents([]);
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (studentData) => {
    if (selectedStudent) {
      // Update existing student
      setStudents(prev => prev?.map(student => 
        student?.id === selectedStudent?.id ? { ...student, ...studentData } : student
      ));
    } else {
      // Add new student
      setStudents(prev => [...prev, studentData]);
    }
    setIsProfileModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="admin" 
        userName="John Doe" 
        onLogout={handleLogout}
      />
      <RoleSidebar 
        userRole="admin"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-72'
      } pb-20 md:pb-6`}>
        <div className="p-6">
          <NavigationBreadcrumb />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            <div className="xl:col-span-3">
              <StudentTableHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedClass={selectedClass}
                onClassChange={setSelectedClass}
                onAddStudent={handleAddStudent}
                onBulkAction={handleBulkAction}
                selectedCount={selectedStudents?.length}
                totalCount={filteredStudents?.length}
                showAdvancedSearch={showAdvancedSearch}
                onToggleAdvancedSearch={() => setShowAdvancedSearch(!showAdvancedSearch)}
              />
            </div>
            
            <div className="xl:col-span-1">
              <QuickActionPanel 
                userRole="admin"
                onQuickAction={(action, data) => {
                  if (action === 'search') {
                    setSearchQuery(data);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <StudentTable
              students={paginatedStudents}
              selectedStudents={selectedStudents}
              onSelectStudent={handleStudentSelect}
              onSelectAll={handleSelectAll}
              onStudentClick={handleStudentClick}
              onQuickAction={handleQuickAction}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents?.length)} of {filteredStudents?.length} students
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Modals */}
      <StudentProfileModal
        student={selectedStudent}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveStudent}
      />
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default StudentManagement;