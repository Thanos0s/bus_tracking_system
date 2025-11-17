import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportIssueModal = ({ isOpen, onClose, stopData }) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [contactInfo, setContactInfo] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueTypes = [
    { id: 'cleanliness', label: 'Cleanliness Issues', icon: 'Trash2', description: 'Dirty seats, litter, poor maintenance' },
    { id: 'safety', label: 'Safety Concerns', icon: 'Shield', description: 'Broken glass, poor lighting, security issues' },
    { id: 'accessibility', label: 'Accessibility Problems', icon: 'Accessibility', description: 'Wheelchair access, ramp issues' },
    { id: 'infrastructure', label: 'Infrastructure Damage', icon: 'Wrench', description: 'Broken shelter, damaged signage' },
    { id: 'information', label: 'Information Issues', icon: 'Info', description: 'Incorrect timetables, missing route info' },
    { id: 'other', label: 'Other Issues', icon: 'HelpCircle', description: 'Any other concerns not listed above' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-muted-foreground', description: 'Minor issues, non-urgent' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning', description: 'Moderate issues affecting comfort' },
    { value: 'high', label: 'High Priority', color: 'text-error', description: 'Safety concerns, urgent repairs needed' }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful submission
    alert(`Issue reported successfully!\n\nReference ID: RPT-${Date.now()}\nExpected response: 24-48 hours`);
    
    // Reset form
    setIssueType('');
    setDescription('');
    setPriority('medium');
    setContactInfo('');
    setIsAnonymous(false);
    setAttachments([]);
    setIsSubmitting(false);
    onClose();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newAttachments = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev?.filter(att => att?.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-nav-strong max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-error/10 rounded-lg">
                <Icon name="Flag" size={24} className="text-error" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Report Issue</h2>
                <p className="text-sm text-muted-foreground">
                  {stopData?.name} • Stop #{stopData?.code}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                What type of issue are you reporting? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {issueTypes?.map((type) => (
                  <button
                    key={type?.id}
                    type="button"
                    onClick={() => setIssueType(type?.id)}
                    className={`p-4 border rounded-lg text-left transition-all hover:bg-muted/50 ${
                      issueType === type?.id 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20' :'border-border'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon 
                        name={type?.icon} 
                        size={20} 
                        className={issueType === type?.id ? 'text-primary' : 'text-muted-foreground'} 
                      />
                      <div>
                        <div className="font-medium text-foreground text-sm">{type?.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{type?.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Priority Level *
              </label>
              <div className="space-y-2">
                {priorityLevels?.map((level) => (
                  <label
                    key={level?.value}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                      priority === level?.value 
                        ? 'border-primary bg-primary/10' :'border-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={level?.value}
                      checked={priority === level?.value}
                      onChange={(e) => setPriority(e?.target?.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      priority === level?.value ? 'border-primary' : 'border-muted-foreground'
                    }`}>
                      {priority === level?.value && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${level?.color}`}>{level?.label}</div>
                      <div className="text-xs text-muted-foreground">{level?.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Detailed Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e?.target?.value)}
                placeholder="Please provide specific details about the issue, including location within the stop area, time observed, and any other relevant information..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {description?.length}/500 characters
              </div>
            </div>

            {/* Photo Attachments */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Photo Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Icon name="Camera" size={32} className="text-muted-foreground" />
                  <div className="text-sm text-foreground">Click to upload photos</div>
                  <div className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</div>
                </label>
              </div>

              {/* Attachment List */}
              {attachments?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments?.map((attachment) => (
                    <div
                      key={attachment?.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name="Image" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{attachment?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(attachment?.size)})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment?.id)}
                        iconName="X"
                        iconSize={14}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground">
                  Contact Information
                </label>
                <Checkbox
                  label="Submit anonymously"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e?.target?.checked)}
                />
              </div>
              
              {!isAnonymous && (
                <Input
                  type="email"
                  placeholder="your.email@example.com (optional)"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e?.target?.value)}
                  description="We'll use this to update you on the resolution status"
                />
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    Your report will be forwarded to the appropriate maintenance team. 
                    Response time varies based on priority level:
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• High Priority: 2-4 hours</li>
                    <li>• Medium Priority: 24-48 hours</li>
                    <li>• Low Priority: 3-7 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!issueType || !description?.trim() || isSubmitting}
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
              iconSize={16}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;