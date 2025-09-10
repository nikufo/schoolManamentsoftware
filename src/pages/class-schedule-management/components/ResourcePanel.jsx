import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourcePanel = ({ 
  isCollapsed, 
  onToggle, 
  selectedDate = new Date(),
  onResourceSelect 
}) => {
  const [activeTab, setActiveTab] = useState('teachers');

  const teacherAvailability = [
    {
      id: 'sarah-johnson',
      name: 'Sarah Johnson',
      subject: 'Mathematics',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      status: 'available',
      currentClass: null,
      nextClass: '10:00 AM - Grade 5 Math',
      totalHours: 6,
      scheduledHours: 4
    },
    {
      id: 'michael-brown',
      name: 'Michael Brown',
      subject: 'English',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      status: 'busy',
      currentClass: '09:00 AM - Grade 3 English',
      nextClass: '11:00 AM - Grade 4 English',
      totalHours: 7,
      scheduledHours: 6
    },
    {
      id: 'emily-davis',
      name: 'Emily Davis',
      subject: 'Science',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      status: 'available',
      currentClass: null,
      nextClass: '02:00 PM - Grade 6 Science',
      totalHours: 5,
      scheduledHours: 3
    },
    {
      id: 'david-wilson',
      name: 'David Wilson',
      subject: 'History',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      status: 'break',
      currentClass: 'Lunch Break',
      nextClass: '01:00 PM - Grade 7 History',
      totalHours: 6,
      scheduledHours: 5
    }
  ];

  const roomAvailability = [
    {
      id: 'room-101',
      name: 'Room 101',
      type: 'Classroom',
      capacity: 30,
      status: 'available',
      currentClass: null,
      nextClass: '10:00 AM - Grade 5 Math',
      equipment: ['Projector', 'Whiteboard', 'AC'],
      utilization: 75
    },
    {
      id: 'room-102',
      name: 'Room 102',
      type: 'Classroom',
      capacity: 25,
      status: 'occupied',
      currentClass: '09:00 AM - Grade 3 English',
      nextClass: '11:00 AM - Grade 4 English',
      equipment: ['Smart Board', 'AC'],
      utilization: 90
    },
    {
      id: 'lab-1',
      name: 'Science Lab 1',
      type: 'Laboratory',
      capacity: 20,
      status: 'maintenance',
      currentClass: 'Under Maintenance',
      nextClass: '02:00 PM - Grade 8 Chemistry',
      equipment: ['Lab Equipment', 'Fume Hood', 'Safety Shower'],
      utilization: 60
    },
    {
      id: 'gym',
      name: 'Gymnasium',
      type: 'Sports Facility',
      capacity: 50,
      status: 'available',
      currentClass: null,
      nextClass: '03:00 PM - Grade 6 PE',
      equipment: ['Sports Equipment', 'Sound System'],
      utilization: 45
    }
  ];

  const equipmentAvailability = [
    {
      id: 'projector-1',
      name: 'Projector #1',
      type: 'AV Equipment',
      status: 'available',
      location: 'Storage Room A',
      assignedTo: null,
      nextBooking: '02:00 PM - Room 103'
    },
    {
      id: 'laptop-cart-1',
      name: 'Laptop Cart #1',
      type: 'Technology',
      status: 'in-use',
      location: 'Room 201',
      assignedTo: 'Computer Science - Grade 9',
      nextBooking: '03:00 PM - Room 105'
    },
    {
      id: 'microscope-set',
      name: 'Microscope Set',
      type: 'Lab Equipment',
      status: 'available',
      location: 'Science Lab 2',
      assignedTo: null,
      nextBooking: '01:00 PM - Science Lab 1'
    },
    {
      id: 'sound-system-1',
      name: 'Portable Sound System',
      type: 'AV Equipment',
      status: 'maintenance',
      location: 'AV Storage',
      assignedTo: null,
      nextBooking: 'Under Repair'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10 border-success/20';
      case 'busy': case'occupied': case'in-use':
        return 'text-error bg-error/10 border-error/20';
      case 'break':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'maintenance':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return 'CheckCircle';
      case 'busy': case'occupied': case'in-use':
        return 'Clock';
      case 'break':
        return 'Coffee';
      case 'maintenance':
        return 'Wrench';
      default:
        return 'Circle';
    }
  };

  const tabs = [
    { id: 'teachers', label: 'Teachers', icon: 'Users', count: teacherAvailability?.length },
    { id: 'rooms', label: 'Rooms', icon: 'Building', count: roomAvailability?.length },
    { id: 'equipment', label: 'Equipment', icon: 'Monitor', count: equipmentAvailability?.length }
  ];

  const renderTeachers = () => (
    <div className="space-y-3">
      {teacherAvailability?.map(teacher => (
        <div
          key={teacher?.id}
          className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
          onClick={() => onResourceSelect('teacher', teacher)}
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={teacher?.avatar}
                alt={teacher?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {teacher?.name}
                </h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(teacher?.status)}`}>
                  <Icon name={getStatusIcon(teacher?.status)} size={10} className="mr-1" />
                  {teacher?.status}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{teacher?.subject}</p>
              <div className="mt-2 space-y-1">
                {teacher?.currentClass && (
                  <p className="text-xs text-foreground">
                    <Icon name="Clock" size={10} className="mr-1" />
                    {teacher?.currentClass}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  <Icon name="Calendar" size={10} className="mr-1" />
                  Next: {teacher?.nextClass}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {teacher?.scheduledHours}/{teacher?.totalHours} hours
                  </span>
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(teacher?.scheduledHours / teacher?.totalHours) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRooms = () => (
    <div className="space-y-3">
      {roomAvailability?.map(room => (
        <div
          key={room?.id}
          className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
          onClick={() => onResourceSelect('room', room)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">{room?.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room?.status)}`}>
                  <Icon name={getStatusIcon(room?.status)} size={10} className="mr-1" />
                  {room?.status}
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-muted-foreground">{room?.type}</span>
                <span className="text-xs text-muted-foreground">
                  <Icon name="Users" size={10} className="mr-1" />
                  {room?.capacity} seats
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {room?.currentClass && (
                  <p className="text-xs text-foreground">
                    <Icon name="Clock" size={10} className="mr-1" />
                    {room?.currentClass}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  <Icon name="Calendar" size={10} className="mr-1" />
                  Next: {room?.nextClass}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Utilization: {room?.utilization}%
                  </span>
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${room?.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {room?.equipment?.map(item => (
                  <span
                    key={item}
                    className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-3">
      {equipmentAvailability?.map(equipment => (
        <div
          key={equipment?.id}
          className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
          onClick={() => onResourceSelect('equipment', equipment)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">{equipment?.name}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(equipment?.status)}`}>
                  <Icon name={getStatusIcon(equipment?.status)} size={10} className="mr-1" />
                  {equipment?.status}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{equipment?.type}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  <Icon name="MapPin" size={10} className="mr-1" />
                  Location: {equipment?.location}
                </p>
                {equipment?.assignedTo && (
                  <p className="text-xs text-foreground">
                    <Icon name="User" size={10} className="mr-1" />
                    Assigned: {equipment?.assignedTo}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  <Icon name="Calendar" size={10} className="mr-1" />
                  Next: {equipment?.nextBooking}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-16 bottom-0 w-12 bg-card border-l border-border z-90">
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-card border-l border-border z-90 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Resources</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
              <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
                {tab?.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'teachers' && renderTeachers()}
          {activeTab === 'rooms' && renderRooms()}
          {activeTab === 'equipment' && renderEquipment()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date()?.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePanel;