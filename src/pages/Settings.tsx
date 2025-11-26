import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { WebsiteConfig } from "@/types/config";
import { useConfig } from "@/context/ConfigContext";
import { GlassCard } from "@/components/GlassCard";
import { NeuButton } from "@/components/NeuButton";
import { Check, ChevronDown, ChevronUp, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEFAULT_ACCENT_HEX, DEFAULT_PRIMARY_HEX, resolveHexColor } from "@/lib/colors";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";

interface SettingsProps {
  schoolId?: string;
}

// Move SectionCard outside component to prevent recreation on every render
const SectionCard = ({ 
  id, 
  title, 
  description, 
  children,
  isOpen,
  onToggle
}: { 
  id: string; 
  title: string; 
  description?: string; 
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <Collapsible
    open={isOpen}
    onOpenChange={onToggle}
    className="w-full"
  >
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CollapsibleTrigger asChild>
        <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <CardTitle className="text-xl font-semibold text-foreground/90">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-sm text-foreground/60 mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-foreground/60" />
            ) : (
              <ChevronDown className="h-5 w-5 text-foreground/60" />
            )}
          </div>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="space-y-4 pt-0">
          {children}
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
);

const Settings = ({ schoolId }: SettingsProps) => {
  const navigate = useNavigate();
  const { updateConfig, config } = useConfig();
  const [formData, setFormData] = useState<WebsiteConfig>(config);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmationStep, setDeleteConfirmationStep] = useState(0);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: false,
    hero: false,
    images: false,
    about: false,
    team: false,
    announcements: false,
    gallery: false,
    faq: false,
  });

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const primaryColorPickerValue = resolveHexColor(formData.primaryColor, DEFAULT_PRIMARY_HEX);
  const accentColorPickerValue = resolveHexColor(formData.accentColor, DEFAULT_ACCENT_HEX);

  const updateField = (field: keyof WebsiteConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { name: "", role: "", bio: "", linkedin: "", twitter: "" },
      ],
    }));
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const addAnnouncement = () => {
    setFormData((prev) => ({
      ...prev,
      announcements: [
        ...prev.announcements,
        { title: "", date: new Date().toISOString().split('T')[0], content: "", priority: "medium" },
      ],
    }));
  };

  const updateAnnouncement = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      announcements: prev.announcements.map((ann, i) =>
        i === index ? { ...ann, [field]: value } : ann
      ),
    }));
  };

  const removeAnnouncement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== index),
    }));
  };

  const addGalleryItem = () => {
    setFormData((prev) => ({
      ...prev,
      galleryItems: [...prev.galleryItems, { title: "", category: "" }],
    }));
  };

  const updateGalleryItem = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryItems: prev.galleryItems.filter((_, i) => i !== index),
    }));
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const updateFAQ = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        { title: "", date: new Date().toISOString(), description: "" },
      ],
    }));
  };

  const updateEvent = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((event, i) =>
        i === index ? { ...event, [field]: value } : event
      ),
    }));
  };

  const removeEvent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index),
    }));
  };

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(formData, schoolId);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationStep(0);
    setDeleteConfirmationText("");
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmationStep === 0) {
      // First confirmation - just move to next step
      setDeleteConfirmationStep(1);
      return;
    }

    if (deleteConfirmationStep === 1) {
      // Second confirmation - require typing club name
      if (deleteConfirmationText.toLowerCase() !== formData.clubName.toLowerCase()) {
        toast.error('Club name does not match. Please type it correctly.');
        return;
      }
      setDeleteConfirmationStep(2);
      return;
    }

    if (deleteConfirmationStep === 2) {
      // Final confirmation - actually delete
      if (deleteConfirmationText.toLowerCase() !== "delete permanently") {
        toast.error('Please type "DELETE PERMANENTLY" to confirm.');
        return;
      }
      
      setDeleting(true);
      try {
        if (!schoolId) {
          throw new Error('School ID not found');
        }

        const { error } = await supabase
          .from('schools')
          .delete()
          .eq('id', schoolId);

        if (error) throw error;

        toast.success('Club website deleted successfully');
        setShowDeleteDialog(false);
        navigate('/dashboard');
      } catch (error: any) {
        toast.error('Failed to delete club: ' + (error.message || 'Unknown error'));
        console.error(error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeleteConfirmationStep(0);
    setDeleteConfirmationText("");
  };


  return (
    <div className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-light mb-4">
            Website <span className="text-primary">Settings</span>
          </h1>
          <p className="text-xl text-foreground/70">
            Customize individual sections of your website
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Basic Information */}
          <SectionCard
            id="basic"
            title="Basic Information"
            description="Club name, tagline, and colors"
            isOpen={openSections.basic}
            onToggle={() => toggleSection("basic")}
          >
            <div className="space-y-4">
              <div>
                <Label>Club Name</Label>
                <Input
                  value={formData.clubName}
                  onChange={(e) => updateField("clubName", e.target.value)}
                  placeholder="e.g., Robotics Club"
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>Club Tagline (for logo)</Label>
                <Input
                  value={formData.clubTagline}
                  onChange={(e) => updateField("clubTagline", e.target.value)}
                  placeholder="e.g., RoboTech"
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    placeholder="#3b82f6"
                    className="font-mono bg-background/50"
                  />
                  <input
                    type="color"
                    aria-label="Select primary color"
                    title="Select primary color"
                    value={primaryColorPickerValue}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="h-10 w-12 rounded border border-border cursor-pointer bg-transparent p-0"
                  />
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={formData.accentColor}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    placeholder="#8b5cf6"
                    className="font-mono bg-background/50"
                  />
                  <input
                    type="color"
                    aria-label="Select accent color"
                    title="Select accent color"
                    value={accentColorPickerValue}
                    onChange={(e) => updateField("accentColor", e.target.value)}
                    className="h-10 w-12 rounded border border-border cursor-pointer bg-transparent p-0"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Hero Section */}
          <SectionCard
            id="hero"
            title="Hero Section"
            description="Main title and call-to-action buttons"
            isOpen={openSections.hero}
            onToggle={() => toggleSection("hero")}
          >
            <div className="space-y-4">
              <div>
                <Label>Hero Title</Label>
                <Input
                  value={formData.heroTitle}
                  onChange={(e) => updateField("heroTitle", e.target.value)}
                  placeholder="Welcome to Your Club"
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>Hero Subtitle</Label>
                <Input
                  value={formData.heroSubtitle}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                  placeholder="Building the future, one event at a time"
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>Primary Button Text</Label>
                <Input
                  value={formData.heroButtonPrimary}
                  onChange={(e) => updateField("heroButtonPrimary", e.target.value)}
                  placeholder="Get Started"
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>Secondary Button Text</Label>
                <Input
                  value={formData.heroButtonSecondary}
                  onChange={(e) => updateField("heroButtonSecondary", e.target.value)}
                  placeholder="Learn More"
                  className="mt-2 bg-background/50"
                />
              </div>
            </div>
          </SectionCard>

          {/* Images Section */}
          <SectionCard
            id="images"
            title="Images"
            description="Customize hero and robot images (leave empty to use defaults)"
            isOpen={openSections.images}
            onToggle={() => toggleSection("images")}
          >
            <div className="space-y-4">
              <div>
                <Label>Hero Background Image URL</Label>
                <Input
                  value={(formData as any).heroImage || ''}
                  onChange={(e) => updateField("heroImage" as any, e.target.value)}
                  placeholder="https://your-image-url.com/hero.jpg"
                  className="mt-2 bg-background/50 font-mono text-sm"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Leave empty to use default image. Must be a direct image URL.
                </p>
              </div>
              <div>
                <Label>Robot Image 1 URL</Label>
                <Input
                  value={(formData as any).robotImage1 || ''}
                  onChange={(e) => updateField("robotImage1" as any, e.target.value)}
                  placeholder="https://your-image-url.com/robot1.jpg"
                  className="mt-2 bg-background/50 font-mono text-sm"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  First robot showcase image
                </p>
              </div>
              <div>
                <Label>Robot Image 2 URL</Label>
                <Input
                  value={(formData as any).robotImage2 || ''}
                  onChange={(e) => updateField("robotImage2" as any, e.target.value)}
                  placeholder="https://your-image-url.com/robot2.jpg"
                  className="mt-2 bg-background/50 font-mono text-sm"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Second robot showcase image
                </p>
              </div>
              <div>
                <Label>Robot Image 3 URL</Label>
                <Input
                  value={(formData as any).robotImage3 || ''}
                  onChange={(e) => updateField("robotImage3" as any, e.target.value)}
                  placeholder="https://your-image-url.com/robot3.jpg"
                  className="mt-2 bg-background/50 font-mono text-sm"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Third robot showcase image
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground/80">
                  <strong>Tip:</strong> You can upload images to services like Imgur, Cloudinary, or your own hosting, then paste the direct image URL here. The URL should end in .jpg, .png, or .webp
                </p>
              </div>
            </div>
          </SectionCard>

          {/* About Page */}
          <SectionCard
            id="about"
            title="About Your Club"
            description="Mission, story, and club description"
            isOpen={openSections.about}
            onToggle={() => toggleSection("about")}
          >
            <div className="space-y-4">
              <div>
                <Label>About Title</Label>
                <Input
                  value={formData.aboutTitle}
                  onChange={(e) => updateField("aboutTitle", e.target.value)}
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>About Description</Label>
                <Textarea
                  value={formData.aboutDescription}
                  onChange={(e) => updateField("aboutDescription", e.target.value)}
                  placeholder="A brief description of your club"
                  className="mt-2 bg-background/50"
                  rows={3}
                />
              </div>
              <div>
                <Label>Mission Title</Label>
                <Input
                  value={formData.missionTitle}
                  onChange={(e) => updateField("missionTitle", e.target.value)}
                  className="mt-2 bg-background/50"
                />
              </div>
              <div>
                <Label>Mission Description</Label>
                <Textarea
                  value={formData.missionDescription}
                  onChange={(e) => updateField("missionDescription", e.target.value)}
                  className="mt-2 bg-background/50"
                  rows={3}
                />
              </div>
              <div>
                <Label>Club Story (Paragraph 1)</Label>
                <Textarea
                  value={formData.storyParagraph1}
                  onChange={(e) => updateField("storyParagraph1", e.target.value)}
                  className="mt-2 bg-background/50"
                  rows={4}
                />
              </div>
              <div>
                <Label>Club Story (Paragraph 2)</Label>
                <Textarea
                  value={formData.storyParagraph2}
                  onChange={(e) => updateField("storyParagraph2", e.target.value)}
                  className="mt-2 bg-background/50"
                  rows={4}
                />
              </div>
            </div>
          </SectionCard>

          {/* Team Members */}
          <SectionCard
            id="team"
            title="Team Members"
            description="Add and manage executive team members"
            isOpen={openSections.team}
            onToggle={() => toggleSection("team")}
          >
            <div className="space-y-4">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-background/30">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Member {index + 1}</h3>
                    {formData.teamMembers.length > 1 && (
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="text-destructive text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                        placeholder="John Doe"
                        className="mt-1 bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                        placeholder="President"
                        className="mt-1 bg-background/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={member.bio}
                      onChange={(e) => updateTeamMember(index, "bio", e.target.value)}
                      placeholder="A brief bio"
                      className="mt-1 bg-background/50"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>LinkedIn URL (optional)</Label>
                      <Input
                        value={member.linkedin}
                        onChange={(e) => updateTeamMember(index, "linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="mt-1 bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Twitter URL (optional)</Label>
                      <Input
                        value={member.twitter}
                        onChange={(e) => updateTeamMember(index, "twitter", e.target.value)}
                        placeholder="https://twitter.com/..."
                        className="mt-1 bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addTeamMember}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                + Add Team Member
              </button>
            </div>
          </SectionCard>

          {/* Announcements & Events */}
          <SectionCard
            id="announcements"
            title="Announcements & Events"
            description="Manage announcements and calendar events"
            isOpen={openSections.announcements}
            onToggle={() => toggleSection("announcements")}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-light mb-4">Announcements</h3>
                <div className="space-y-4">
                  {formData.announcements.map((ann, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-background/30">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Announcement {index + 1}</h4>
                        {formData.announcements.length > 1 && (
                          <button
                            onClick={() => removeAnnouncement(index)}
                            className="text-destructive text-sm hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <Input
                        value={ann.title}
                        onChange={(e) => updateAnnouncement(index, "title", e.target.value)}
                        placeholder="Announcement title"
                        className="bg-background/50"
                      />
                      <Input
                        type="date"
                        value={ann.date}
                        onChange={(e) => updateAnnouncement(index, "date", e.target.value)}
                        className="bg-background/50"
                      />
                      <Textarea
                        value={ann.content}
                        onChange={(e) => updateAnnouncement(index, "content", e.target.value)}
                        placeholder="Announcement content"
                        rows={2}
                        className="bg-background/50"
                      />
                      <select
                        value={ann.priority}
                        onChange={(e) => updateAnnouncement(index, "priority", e.target.value)}
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-md"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  ))}
                  <button
                    onClick={addAnnouncement}
                    className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
                  >
                    + Add Announcement
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-light mb-4">Calendar Events</h3>
                <div className="space-y-4">
                  {formData.events.map((event, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-background/30">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Event {index + 1}</h4>
                        {formData.events.length > 1 && (
                          <button
                            onClick={() => removeEvent(index)}
                            className="text-destructive text-sm hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <Input
                        value={event.title}
                        onChange={(e) => updateEvent(index, "title", e.target.value)}
                        placeholder="Event title"
                        className="bg-background/50"
                      />
                      <Input
                        type="date"
                        value={event.date.split('T')[0]}
                        onChange={(e) => updateEvent(index, "date", new Date(e.target.value).toISOString())}
                        className="bg-background/50"
                      />
                      <Textarea
                        value={event.description}
                        onChange={(e) => updateEvent(index, "description", e.target.value)}
                        placeholder="Event description"
                        rows={2}
                        className="bg-background/50"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addEvent}
                    className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
                  >
                    + Add Event
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Gallery */}
          <SectionCard
            id="gallery"
            title="Gallery Items"
            description="Manage gallery content"
            isOpen={openSections.gallery}
            onToggle={() => toggleSection("gallery")}
          >
            <div className="space-y-4">
              {formData.galleryItems.map((item, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-background/30">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Gallery Item {index + 1}</h3>
                    {formData.galleryItems.length > 1 && (
                      <button
                        onClick={() => removeGalleryItem(index)}
                        className="text-destructive text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => updateGalleryItem(index, "title", e.target.value)}
                        placeholder="Event name"
                        className="mt-1 bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={item.category}
                        onChange={(e) => updateGalleryItem(index, "category", e.target.value)}
                        placeholder="Events, Social, etc."
                        className="mt-1 bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addGalleryItem}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                + Add Gallery Item
              </button>
            </div>
          </SectionCard>

          {/* FAQ */}
          <SectionCard
            id="faq"
            title="Frequently Asked Questions"
            description="Add and manage FAQs"
            isOpen={openSections.faq}
            onToggle={() => toggleSection("faq")}
          >
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-background/30">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">FAQ {index + 1}</h3>
                    {formData.faqs.length > 1 && (
                      <button
                        onClick={() => removeFAQ(index)}
                        className="text-destructive text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, "question", e.target.value)}
                      placeholder="How do I join?"
                      className="mt-1 bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                      placeholder="Answer to the question"
                      className="mt-1 bg-background/50"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addFAQ}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                + Add FAQ
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-destructive">
              Danger Zone
            </CardTitle>
            <CardDescription className="text-sm text-foreground/60">
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive/30 bg-background/30 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground/90 mb-1">
                    Delete Club Website
                  </h3>
                  <p className="text-sm text-foreground/60 mb-3">
                    Once you delete this club website, there is no going back. All data will be permanently removed.
                  </p>
                  <ul className="text-sm text-foreground/60 space-y-1 list-disc list-inside">
                    <li>All configuration data will be lost</li>
                    <li>All team members, announcements, and events will be deleted</li>
                    <li>The website URL will become unavailable</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="mt-4 w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Club Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-between gap-4 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="border border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10"
          >
            Cancel
          </Button>
          <NeuButton
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Check size={20} />
                Save Changes
              </>
            )}
          </NeuButton>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
          if (!open && !deleting) {
            handleDeleteCancel();
          }
        }}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <AlertDialogTitle className="text-xl">
                  {deleteConfirmationStep === 0 && "Are you absolutely sure?"}
                  {deleteConfirmationStep === 1 && "Type your club name to confirm"}
                  {deleteConfirmationStep === 2 && "Final confirmation required"}
                </AlertDialogTitle>
              </div>
              <div className="text-left space-y-3">
                {deleteConfirmationStep === 0 && (
                  <>
                    <div className="text-base font-medium text-foreground/90">
                      This action cannot be undone. This will permanently delete the{" "}
                      <strong>{formData.clubName}</strong> club website and all of its data.
                    </div>
                    <div className="text-sm text-foreground/70">
                      You will need to confirm two more times before deletion occurs.
                    </div>
                  </>
                )}
                {deleteConfirmationStep === 1 && (
                  <>
                    <div className="text-base font-medium text-foreground/90">
                      Please type your club name <strong>{formData.clubName}</strong> to continue.
                    </div>
                    <Input
                      value={deleteConfirmationText}
                      onChange={(e) => setDeleteConfirmationText(e.target.value)}
                      placeholder={formData.clubName}
                      className="mt-2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleDeleteConfirm();
                        }
                      }}
                    />
                  </>
                )}
                {deleteConfirmationStep === 2 && (
                  <>
                    <div className="text-base font-medium text-foreground/90">
                      This is your final warning. Type{" "}
                      <strong className="text-destructive">DELETE PERMANENTLY</strong> to
                      permanently delete this club website.
                    </div>
                    <Input
                      value={deleteConfirmationText}
                      onChange={(e) => setDeleteConfirmationText(e.target.value)}
                      placeholder="DELETE PERMANENTLY"
                      className="mt-2 font-mono"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleDeleteConfirm();
                        }
                      }}
                    />
                  </>
                )}
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <AlertDialogCancel
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteConfirm();
                }}
                disabled={deleting}
                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  "Deleting..."
                ) : deleteConfirmationStep === 0 ? (
                  "Continue to next step"
                ) : deleteConfirmationStep === 1 ? (
                  "Continue"
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Permanently
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default Settings;

