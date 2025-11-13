import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { WebsiteConfig, defaultConfig } from "@/types/config";
import { useConfig } from "@/context/ConfigContext";
import { GlassCard } from "@/components/GlassCard";
import { NeuButton } from "@/components/NeuButton";
import { ArrowRight, ArrowLeft, Check } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEFAULT_ACCENT_HEX, DEFAULT_PRIMARY_HEX, resolveHexColor } from "@/lib/colors";

interface SetupProps {
  schoolId?: string;
}

const Setup = ({ schoolId }: SetupProps) => {
  const navigate = useNavigate();
  const { updateConfig, config } = useConfig();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WebsiteConfig>(defaultConfig);
  
  useEffect(() => {
    // Load existing config if available (for completing setup)
    if (config && schoolId) {
      setFormData(config);
    }
  }, [config, schoolId]);

  const totalSteps = 7;

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

  const handleFinish = async () => {
    try {
      await updateConfig(formData, schoolId);
      toast.success('Club website created successfully!');
      navigate("/dashboard");
    } catch (error) {
      toast.error('Failed to save configuration');
      console.error(error);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-light mb-4">
            Create Your <span className="text-primary">Club Website</span>
          </h1>
          <p className="text-xl text-foreground/70">
            Answer a few questions to generate your custom website
          </p>
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i + 1 === step
                    ? "w-12 bg-primary"
                    : i + 1 < step
                    ? "w-8 bg-primary/60"
                    : "w-8 bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <div className="space-y-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">Basic Information</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>Club Name</Label>
                        <Input
                          value={formData.clubName}
                          onChange={(e) => updateField("clubName", e.target.value)}
                          placeholder="e.g., Robotics Club"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Club Tagline (for logo)</Label>
                        <Input
                          value={formData.clubTagline}
                          onChange={(e) => updateField("clubTagline", e.target.value)}
                          placeholder="e.g., RoboTech"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value={formData.primaryColor}
                            onChange={(e) => updateField("primaryColor", e.target.value)}
                            placeholder="#3b82f6"
                            className="font-mono"
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
                            className="font-mono"
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
                  </>
                )}

                {/* Step 2: Hero Section */}
                {step === 2 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">Home Page Hero</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>Hero Title</Label>
                        <Input
                          value={formData.heroTitle}
                          onChange={(e) => updateField("heroTitle", e.target.value)}
                          placeholder="Welcome to Your Club"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Hero Subtitle</Label>
                        <Input
                          value={formData.heroSubtitle}
                          onChange={(e) => updateField("heroSubtitle", e.target.value)}
                          placeholder="Building the future, one event at a time"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Primary Button Text</Label>
                        <Input
                          value={formData.heroButtonPrimary}
                          onChange={(e) => updateField("heroButtonPrimary", e.target.value)}
                          placeholder="Get Started"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Secondary Button Text</Label>
                        <Input
                          value={formData.heroButtonSecondary}
                          onChange={(e) => updateField("heroButtonSecondary", e.target.value)}
                          placeholder="Learn More"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: About Page */}
                {step === 3 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">About Your Club</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>About Description</Label>
                        <Textarea
                          value={formData.aboutDescription}
                          onChange={(e) => updateField("aboutDescription", e.target.value)}
                          placeholder="A brief description of your club"
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Mission Title</Label>
                        <Input
                          value={formData.missionTitle}
                          onChange={(e) => updateField("missionTitle", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Mission Description</Label>
                        <Textarea
                          value={formData.missionDescription}
                          onChange={(e) => updateField("missionDescription", e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Club Story (Paragraph 1)</Label>
                        <Textarea
                          value={formData.storyParagraph1}
                          onChange={(e) => updateField("storyParagraph1", e.target.value)}
                          className="mt-2"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Club Story (Paragraph 2)</Label>
                        <Textarea
                          value={formData.storyParagraph2}
                          onChange={(e) => updateField("storyParagraph2", e.target.value)}
                          className="mt-2"
                          rows={4}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Team Members */}
                {step === 4 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">Team Members</h2>
                    <div className="space-y-6">
                      {formData.teamMembers.map((member, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg space-y-3">
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
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Role</Label>
                              <Input
                                value={member.role}
                                onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                                placeholder="President"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Bio</Label>
                            <Textarea
                              value={member.bio}
                              onChange={(e) => updateTeamMember(index, "bio", e.target.value)}
                              placeholder="A brief bio"
                              className="mt-1"
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
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Twitter URL (optional)</Label>
                              <Input
                                value={member.twitter}
                                onChange={(e) => updateTeamMember(index, "twitter", e.target.value)}
                                placeholder="https://twitter.com/..."
                                className="mt-1"
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
                  </>
                )}

                {/* Step 5: Announcements & Events */}
                {step === 5 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">Announcements & Events</h2>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-light mb-4">Announcements</h3>
                        <div className="space-y-4">
                          {formData.announcements.map((ann, index) => (
                            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
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
                              />
                              <Input
                                type="date"
                                value={ann.date}
                                onChange={(e) => updateAnnouncement(index, "date", e.target.value)}
                              />
                              <Textarea
                                value={ann.content}
                                onChange={(e) => updateAnnouncement(index, "content", e.target.value)}
                                placeholder="Announcement content"
                                rows={2}
                              />
                              <select
                                value={ann.priority}
                                onChange={(e) => updateAnnouncement(index, "priority", e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md"
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
                            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
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
                              />
                              <Input
                                type="date"
                                value={event.date.split('T')[0]}
                                onChange={(e) => updateEvent(index, "date", new Date(e.target.value).toISOString())}
                              />
                              <Textarea
                                value={event.description}
                                onChange={(e) => updateEvent(index, "description", e.target.value)}
                                placeholder="Event description"
                                rows={2}
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
                  </>
                )}

                {/* Step 6: Gallery */}
                {step === 6 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">Gallery Items</h2>
                    <div className="space-y-4">
                      {formData.galleryItems.map((item, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg space-y-3">
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
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Input
                                value={item.category}
                                onChange={(e) => updateGalleryItem(index, "category", e.target.value)}
                                placeholder="Events, Social, etc."
                                className="mt-1"
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
                  </>
                )}

                {/* Step 7: FAQ */}
                {step === 7 && (
                  <>
                    <h2 className="text-3xl font-light mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {formData.faqs.map((faq, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg space-y-3">
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
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Answer</Label>
                            <Textarea
                              value={faq.answer}
                              onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                              placeholder="Answer to the question"
                              className="mt-1"
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
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-border">
                  <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      step === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted"
                    }`}
                  >
                    <ArrowLeft size={20} />
                    Previous
                  </button>

                  {step < totalSteps ? (
                    <NeuButton variant="primary" onClick={nextStep} className="flex items-center gap-2">
                      Next
                      <ArrowRight size={20} />
                    </NeuButton>
                  ) : (
                    <NeuButton variant="primary" onClick={handleFinish} className="flex items-center gap-2">
                      <Check size={20} />
                      Finish & View Website
                    </NeuButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Setup;

