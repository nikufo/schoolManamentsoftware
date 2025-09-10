import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GradingScaleManager = ({ 
  currentScale = 'standard',
  onScaleUpdate,
  userRole = 'teacher' 
}) => {
  const [activeScale, setActiveScale] = useState(currentScale);
  const [isEditing, setIsEditing] = useState(false);
  const [customScale, setCustomScale] = useState([
    { grade: 'A+', min: 97, max: 100, points: 4.0 },
    { grade: 'A', min: 93, max: 96, points: 4.0 },
    { grade: 'A-', min: 90, max: 92, points: 3.7 },
    { grade: 'B+', min: 87, max: 89, points: 3.3 },
    { grade: 'B', min: 83, max: 86, points: 3.0 },
    { grade: 'B-', min: 80, max: 82, points: 2.7 },
    { grade: 'C+', min: 77, max: 79, points: 2.3 },
    { grade: 'C', min: 73, max: 76, points: 2.0 },
    { grade: 'C-', min: 70, max: 72, points: 1.7 },
    { grade: 'D+', min: 67, max: 69, points: 1.3 },
    { grade: 'D', min: 63, max: 66, points: 1.0 },
    { grade: 'D-', min: 60, max: 62, points: 0.7 },
    { grade: 'F', min: 0, max: 59, points: 0.0 }
  ]);

  const predefinedScales = [
    {
      id: 'standard',
      name: 'Standard Scale',
      description: 'Traditional A-F grading scale',
      scale: [
        { grade: 'A', min: 90, max: 100, points: 4.0 },
        { grade: 'B', min: 80, max: 89, points: 3.0 },
        { grade: 'C', min: 70, max: 79, points: 2.0 },
        { grade: 'D', min: 60, max: 69, points: 1.0 },
        { grade: 'F', min: 0, max: 59, points: 0.0 }
      ]
    },
    {
      id: 'plus_minus',
      name: 'Plus/Minus Scale',
      description: 'Extended scale with + and - modifiers',
      scale: customScale
    },
    {
      id: 'percentage',
      name: 'Percentage Only',
      description: 'Raw percentage scores without letter grades',
      scale: [
        { grade: '100%', min: 100, max: 100, points: 4.0 },
        { grade: '90-99%', min: 90, max: 99, points: 3.5 },
        { grade: '80-89%', min: 80, max: 89, points: 3.0 },
        { grade: '70-79%', min: 70, max: 79, points: 2.5 },
        { grade: '60-69%', min: 60, max: 69, points: 2.0 },
        { grade: '0-59%', min: 0, max: 59, points: 0.0 }
      ]
    },
    {
      id: 'pass_fail',
      name: 'Pass/Fail',
      description: 'Simple pass or fail grading',
      scale: [
        { grade: 'Pass', min: 70, max: 100, points: 4.0 },
        { grade: 'Fail', min: 0, max: 69, points: 0.0 }
      ]
    }
  ];

  const scaleOptions = predefinedScales?.map(scale => ({
    value: scale?.id,
    label: scale?.name,
    description: scale?.description
  }));

  const getCurrentScaleData = () => {
    return predefinedScales?.find(scale => scale?.id === activeScale) || predefinedScales?.[0];
  };

  const handleScaleChange = (scaleId) => {
    setActiveScale(scaleId);
    if (onScaleUpdate) {
      const scaleData = predefinedScales?.find(scale => scale?.id === scaleId);
      onScaleUpdate(scaleData);
    }
  };

  const handleCustomScaleUpdate = (index, field, value) => {
    const updatedScale = [...customScale];
    updatedScale[index] = { ...updatedScale?.[index], [field]: parseFloat(value) || value };
    setCustomScale(updatedScale);
  };

  const addGradeLevel = () => {
    const newLevel = {
      grade: '',
      min: 0,
      max: 0,
      points: 0.0
    };
    setCustomScale([...customScale, newLevel]);
  };

  const removeGradeLevel = (index) => {
    const updatedScale = customScale?.filter((_, i) => i !== index);
    setCustomScale(updatedScale);
  };

  const saveCustomScale = () => {
    // Validate scale
    const sortedScale = [...customScale]?.sort((a, b) => b?.min - a?.min);
    
    // Update the plus_minus scale in predefinedScales
    const updatedScales = predefinedScales?.map(scale => 
      scale?.id === 'plus_minus' 
        ? { ...scale, scale: sortedScale }
        : scale
    );

    if (onScaleUpdate) {
      onScaleUpdate({ id: 'plus_minus', scale: sortedScale });
    }

    setIsEditing(false);
  };

  const getLetterGrade = (percentage) => {
    const currentScaleData = getCurrentScaleData();
    const grade = currentScaleData?.scale?.find(level => 
      percentage >= level?.min && percentage <= level?.max
    );
    return grade ? grade?.grade : 'N/A';
  };

  const getGradeColor = (grade) => {
    if (grade?.includes('A')) return 'text-success';
    if (grade?.includes('B')) return 'text-accent';
    if (grade?.includes('C')) return 'text-warning';
    if (grade?.includes('D')) return 'text-orange-600';
    if (grade?.includes('F') || grade?.includes('Fail')) return 'text-error';
    if (grade?.includes('Pass')) return 'text-success';
    return 'text-foreground';
  };

  const currentScaleData = getCurrentScaleData();

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Grading Scale</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Configure how grades are calculated and displayed
            </p>
          </div>
          
          {userRole === 'teacher' && activeScale === 'plus_minus' && (
            <Button
              variant={isEditing ? "outline" : "default"}
              iconName={isEditing ? "X" : "Settings"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Customize'}
            </Button>
          )}
        </div>
      </div>
      {/* Scale Selection */}
      <div className="p-6 border-b border-border">
        <Select
          label="Grading Scale"
          description="Choose the grading scale for this class"
          options={scaleOptions}
          value={activeScale}
          onChange={handleScaleChange}
          disabled={userRole !== 'teacher'}
        />
      </div>
      {/* Scale Preview */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-foreground">
            {currentScaleData?.name} Preview
          </h4>
          <span className="text-sm text-muted-foreground">
            {currentScaleData?.description}
          </span>
        </div>

        {/* Grade Scale Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                  Letter Grade
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                  Percentage Range
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                  GPA Points
                </th>
                {isEditing && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(isEditing ? customScale : currentScaleData?.scale)?.map((level, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors duration-200">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input
                        type="text"
                        value={level?.grade}
                        onChange={(e) => handleCustomScaleUpdate(index, 'grade', e?.target?.value)}
                        className="w-20"
                      />
                    ) : (
                      <span className={`font-medium ${getGradeColor(level?.grade)}`}>
                        {level?.grade}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={level?.min}
                          onChange={(e) => handleCustomScaleUpdate(index, 'min', e?.target?.value)}
                          className="w-16"
                          min="0"
                          max="100"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          value={level?.max}
                          onChange={(e) => handleCustomScaleUpdate(index, 'max', e?.target?.value)}
                          className="w-16"
                          min="0"
                          max="100"
                        />
                      </div>
                    ) : (
                      <span className="text-foreground">
                        {level?.min}% - {level?.max}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={level?.points}
                        onChange={(e) => handleCustomScaleUpdate(index, 'points', e?.target?.value)}
                        className="w-20"
                        min="0"
                        max="4"
                        step="0.1"
                      />
                    ) : (
                      <span className="text-foreground">{level?.points?.toFixed(1)}</span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        iconName="Trash2"
                        onClick={() => removeGradeLevel(index)}
                        className="text-error hover:text-error hover:bg-error/10"
                        disabled={customScale?.length <= 2}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Editing Actions */}
        {isEditing && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              iconName="Plus"
              onClick={addGradeLevel}
            >
              Add Grade Level
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={saveCustomScale}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Grade Calculator */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h5 className="text-sm font-medium text-foreground mb-3">Grade Calculator</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[85, 92, 78]?.map((percentage, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-foreground">{percentage}%</div>
                <div className={`text-sm font-medium ${getGradeColor(getLetterGrade(percentage))}`}>
                  {getLetterGrade(percentage)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingScaleManager;