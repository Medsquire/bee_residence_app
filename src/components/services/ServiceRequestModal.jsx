import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import FormActionFooter from '../common/FormActionFooter';
import ImagePreviewModal from '../common/ImagePreviewModal';
import { useAuth } from '../../context/AuthContext';
import { useHousehold } from '../../context/HouseholdContext';
import { useToast } from '../../context/ToastContext';
import { Camera, Sparkles, X, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

const SERVICE_CATEGORIES = [
  'Apartment Issues',
  'Plumbing',
  'Electrical Repairs',
  'Water Pump and Motor',
  'Cleaning',
  'Sanitation',
  'Air Conditioning',
  'Washing Machine',
  'Television',
  'Wi-Fi and Internet',
  'Carpentry',
  'Painting',
  'Pest Control',
  'Refrigerator',
  'Other Maintenance'
];

const AI_SAMPLE_DESCRIPTIONS = {
  'Apartment Issues': [
    'Dampness and paint peeling observed on living room ceiling near balcony. Seepage appears to be coming from the upper floor.',
    'Balcony sliding glass door latch is jammed and off the runner track, making it hard to close safely.'
  ],
  Plumbing: [
    'Under-sink drainage pipe in master bathroom is continuously leaking, causing water pooling on the floor.',
    'Low water pressure in kitchen faucet and mixer lever is stiff with leakage around the mounting base.',
    'Bathroom flush tank valve runs continuously without auto shut-off, causing water overflow.'
  ],
  'Electrical Repairs': [
    'Main circuit breaker tripped twice today when switching on kitchen appliances; two power sockets have no power.',
    'Flickering ceiling LED panel in hallway; switchboard plate feels noticeably warm to touch.'
  ],
  'Water Pump and Motor': [
    'Utility water booster pump is making loud grinding noise and failing to shut off automatically after use.',
    'Water pump failing to prime; water supply to overhead secondary tank is halted.'
  ],
  Cleaning: [
    'Deep balcony floor and sliding glass window track cleaning required to clear heavy dust and hard water stains.',
    'Kitchen tile degreasing and chimney surface deep cleaning requested.'
  ],
  Sanitation: [
    'Main bathroom drain is backing up slowly with unpleasant odor. Anti-bacterial sanitization and clog clearance needed.',
    'Kitchen sink grease trap sanitation and exhaust duct disinfection requested.'
  ],
  'Air Conditioning': [
    'Master bedroom split AC is blowing ambient air instead of cooling; water leakage noticed dripping inside the room.',
    'Living room AC indoor unit produces rattling fan noise at medium speed and requires seasonal filter and coil servicing.'
  ],
  'Washing Machine': [
    'Front-load washing machine vibrates excessively during high-speed spin cycle and error code E04 is flashing.',
    'Washing machine inlet solenoid valve is humming but no water enters the wash drum.'
  ],
  Television: [
    'Smart TV in living room shows horizontal flickering lines across the bottom third of display; sound is normal.',
    'Wall mount bracket anchor is slightly loose; need technician to re-secure TV safely.'
  ],
  'Wi-Fi and Internet': [
    'Fiber optic router displays red LOS indicator intermittently; Wi-Fi speed drops severely in rear bedrooms.',
    'Ethernet wall port in study room is not negotiating gigabit link; requires RJ45 re-crimping and line testing.'
  ],
  Carpentry: [
    'Modular kitchen cabinet hinge has detached from the frame and drawer soft-close slide is stuck.',
    'Main entrance wooden door has swollen at the bottom edge and scrapes against the tile flooring.'
  ],
  Painting: [
    'Touch-up painting required for dining area wall after minor plaster repair; neutral off-white shade.',
    'Watermark stain on bedroom accent wall requires primer sealant coat and single coat repaint.'
  ],
  'Pest Control': [
    'Small cockroach activity observed behind kitchen under-counter cabinets; herbal gel pest treatment requested.',
    'Ant trail along balcony skirting and bathroom threshold; eco-friendly pest control needed.'
  ],
  Refrigerator: [
    'Double-door refrigerator freezer section is freezing excess frost while the lower refrigeration compartment is barely cold.',
    'Compressor at rear is clicking every few minutes and running hot without cooling properly.'
  ],
  'Other Maintenance': [
    'Curtain rod bracket came loose from drywall ceiling in living room; needs re-anchoring with heavy-duty plugs.',
    'Door closer hydraulic cylinder on main door has lost tension and slams shut loudly.'
  ]
};

const TIME_SLOTS = [
  'Morning (09:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 03:00 PM)',
  'Evening (03:00 PM - 06:00 PM)',
  'Night (06:00 PM - 08:00 PM)'
];

const URGENCY_LEVELS = ['Normal', 'Urgent'];

export default function ServiceRequestModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { addServiceRequest } = useHousehold();
  const { addToast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    category: 'Plumbing',
    title: '',
    description: '',
    urgency: 'Normal',
    preferredDate: today,
    preferredTimeSlot: TIME_SLOTS[0],
    instructions: ''
  });

  const [photos, setPhotos] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [aiSampleIndex, setAiSampleIndex] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setAiSampleIndex(0);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) return;

    const validFiles = files.slice(0, remainingSlots);

    validFiles.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result;
        if (dataUrl) {
          setPhotos((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, dataUrl];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAIGenerate = () => {
    setIsGeneratingAI(true);
    const samples = AI_SAMPLE_DESCRIPTIONS[formData.category] || [
      `${formData.category} requires technician inspection and routine maintenance servicing.`
    ];
    const sample = samples[aiSampleIndex % samples.length];
    setAiSampleIndex((prev) => prev + 1);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        description: sample
      }));
      if (errors.description) {
        setErrors((prev) => ({ ...prev, description: null }));
      }
      setIsGeneratingAI(false);
    }, 250);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the problem in detail or use AI Auto-Fill.';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select your preferred date.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      // Synthesize clean title from description or category
      const derivedTitle = formData.description.trim()
        ? formData.description.trim().split(/[.\n]/)[0].slice(0, 50)
        : `${formData.category} Service Request`;

      const ticketPayload = {
        ...formData,
        title: derivedTitle,
        photos
      };

      const ticketId = addServiceRequest(ticketPayload, currentUser);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Fallback
      }

      addToast({
        title: 'Service Request Created!',
        message: `Ticket ${ticketId} has been submitted to estate desk.`,
        type: 'success'
      });

      // Reset form & close
      setFormData({
        category: 'Plumbing',
        title: '',
        description: '',
        urgency: 'Normal',
        preferredDate: today,
        preferredTimeSlot: TIME_SLOTS[0],
        instructions: ''
      });
      setPhotos([]);
      setErrors({});
      onClose();
    } catch (err) {
      addToast({
        title: 'Error Creating Request',
        message: 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Book a Service Request"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black dark:text-white mb-1">
                Service Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs sm:text-sm font-medium text-black dark:text-white focus:outline-none"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-black dark:text-white mb-1">
                Urgency Level <span className="text-rose-500">*</span>
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3.5 py-2 glass-input rounded-xl text-xs sm:text-sm font-medium text-black dark:text-white focus:outline-none"
              >
                {URGENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload Area - Optional, Multiple photos with Camera trigger */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-black dark:text-white">
                Photos <span className="text-black/45 dark:text-slate-400 font-normal"></span>
              </label>
              {photos.length > 0 && (
                <span className="text-[11px] font-medium text-blue-600 dark:text-sky-400">
                  {photos.length} of 5 attached
                </span>
              )}
            </div>

            {/* Hidden native file input supporting multiple images and mobile camera */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-dashed border-blue-200/80 dark:border-slate-700/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Add Photo Tile */}
                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-dashed border-blue-400/60 dark:border-sky-500/50 bg-blue-50/50 dark:bg-slate-700/40 hover:bg-blue-100/60 dark:hover:bg-slate-700/70 text-blue-600 dark:text-sky-300 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer group shrink-0"
                    title="Take or upload photo"
                  >
                    <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.8} />
                    <span className="text-[10px] font-medium leading-none">Add Photo</span>
                  </button>
                )}

                {/* Uploaded thumbnails with X delete and click-to-preview popup */}
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/80 dark:border-slate-600 shadow-xs shrink-0 cursor-pointer"
                    onClick={() => setPreviewPhoto(photo)}
                    title="Click to view full photo"
                  >
                    <img
                      src={photo}
                      alt={`Problem issue photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        View
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(idx);
                      }}
                      title="Remove photo"
                      aria-label={`Remove photo ${idx + 1}`}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                    >
                      <X className="w-3 h-3" strokeWidth={2} />
                    </button>
                  </div>
                ))}

                {photos.length === 0 && (
                  <div className="flex-1 py-1 px-1.5 text-left">
                    <p className="text-xs font-medium text-black/80 dark:text-white/90">
                      Upload photos
                    </p>
                   
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Problem Description with AI Auto-Fill button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-black dark:text-white">
                Detailed Problem Description <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGeneratingAI}
                title={`Auto-generate sample description for ${formData.category}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-500/15 via-sky-400/20 to-blue-600/15 dark:from-blue-500/25 dark:via-sky-400/25 dark:to-blue-600/25 border border-blue-300/70 dark:border-sky-400/50 text-blue-700 dark:text-sky-300 hover:bg-blue-500/25 active:scale-95 text-[11px] font-medium transition-all shadow-xs cursor-pointer"
              >
                <Sparkles
                  className={`w-3.5 h-3.5 text-blue-600 dark:text-sky-400 ${
                    isGeneratingAI ? 'animate-spin' : ''
                  }`}
                />
                <span>{isGeneratingAI ? 'Generating...' : 'AI Auto-Fill'}</span>
              </button>
            </div>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder={`Describe the ${formData.category.toLowerCase()} issue or click 'AI Auto-Fill' above...`}
              className={`w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : ''
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Preferred Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-black dark:text-white mb-1">
                Preferred Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="preferredDate"
                min={today}
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none"
              >
              </input>
              {errors.preferredDate && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.preferredDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-black dark:text-white mb-1">
                Preferred Time Slot <span className="text-rose-500">*</span>
              </label>
              <select
                name="preferredTimeSlot"
                value={formData.preferredTimeSlot}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl font-medium text-black dark:text-white focus:outline-none"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional instructions */}
          <div>
            <label className="block text-xs font-medium text-black dark:text-white mb-1">
              Entry Instructions / Notes
            </label>
            <input
              type="text"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="e.g. Please ring bell twice, dog at home"
              className="w-full px-3.5 py-2 text-xs sm:text-sm glass-input rounded-xl focus:outline-none"
            />
          </div>

          {/* Footer: Frosted Glass Icon-Only Action Cards */}
          <FormActionFooter
            onCancel={onClose}
            submitting={submitting}
            submitLabel="Submit Service Request"
          />
        </form>
      </Modal>

      {/* Lightbox Preview Modal for uploaded photos */}
      <ImagePreviewModal
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        src={previewPhoto}
        alt="Service Issue Photo"
        subtitle={`${formData.category} Service Request`}
      />
    </>
  );
}
