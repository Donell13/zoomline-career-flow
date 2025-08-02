import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Shield, CheckCircle } from "lucide-react";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
  jobTitle: string;
}

const JobApplicationModal = ({ isOpen, onClose, jobId, jobTitle }: JobApplicationModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    resume: null as File | null,
    governmentId: null as File | null,
    consent: false,
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    handleInputChange(field, file);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.resume || !formData.governmentId) {
        toast({
          title: "Missing Documents",
          description: "Please upload both your resume and government ID.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the background check and identity verification.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Application Submitted!",
      description: "Thank you for your application. You'll receive an email shortly with next steps.",
    });
    
    setStep(4); // Success step
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      resume: null,
      governmentId: null,
      consent: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            Apply for {jobTitle}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <p className="text-muted-foreground">Let's start with your basic details</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="role">Role Applying For</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote-driver">Remote Driver</SelectItem>
                    <SelectItem value="dispatch-assistant">Dispatch Assistant</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleNextStep} className="w-full" size="lg">
              Next Step
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">Document Upload</h3>
              <p className="text-muted-foreground">Please upload your resume and government ID</p>
            </div>

            <div className="space-y-6">
              {/* Resume Upload */}
              <div>
                <Label>Resume/CV *</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    {formData.resume ? formData.resume.name : "Click to upload your resume"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload("resume", e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
              </div>

              {/* Government ID Upload */}
              <div>
                <Label>Government ID *</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-2">
                    {formData.governmentId ? formData.governmentId.name : "Upload driver's license or passport"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload("governmentId", e.target.files?.[0] || null)}
                    className="hidden"
                    id="id-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="id-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNextStep} className="flex-1">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold">Final Consent</h3>
              <p className="text-muted-foreground">Review and confirm your application</p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h4 className="font-semibold flex items-center space-x-2">
                <Shield className="h-5 w-5 text-accent" />
                <span>Application Summary</span>
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Role:</strong> {formData.role || "Not specified"}</p>
                <p><strong>Resume:</strong> {formData.resume?.name || "Not uploaded"}</p>
                <p><strong>Government ID:</strong> {formData.governmentId?.name || "Not uploaded"}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => handleInputChange("consent", checked)}
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed">
                I agree to background check and identity verification. I understand that this information 
                will be used to verify my identity and eligibility for employment.
              </Label>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1" variant="cta">
                Submit Application
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-primary">Application Submitted!</h3>
            <p className="text-lg text-muted-foreground">
              Thank you for your application. We've received your information and will be in touch soon.
            </p>
            <div className="bg-accent/5 p-6 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-primary mb-2">Next Steps:</h4>
              <ol className="text-left space-y-2 text-muted-foreground">
                <li>1. You'll receive a confirmation email shortly</li>
                <li>2. Our team will review your application</li>
                <li>3. If selected, you'll be contacted for identity verification</li>
                <li>4. Complete the verification process to proceed</li>
              </ol>
            </div>
            <Button onClick={resetForm} size="lg" className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;