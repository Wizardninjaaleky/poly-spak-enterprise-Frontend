'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CustomSolutionsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Product Type
    productType: '',
    productCategory: '',
    customDescription: '',
    
    // Step 2: Specifications
    capacity: '',
    capacityUnit: 'liters',
    material: '',
    color: '',
    colorType: 'standard',
    customColor: '',
    features: [],
    closureType: '',
    additionalSpecs: '',
    
    // Step 3: Volume & Timeline
    estimatedVolume: '',
    volumeFrequency: '',
    urgency: 'standard',
    projectTimeline: '',
    budgetRange: '',
    
    // Step 4: Contact & Files
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    role: '',
    industry: '',
    hearAboutUs: '',
    technicalDrawing: null,
    referenceSample: null,
    additionalFiles: [],
    specialRequirements: '',
    preferredContact: 'email'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [savedDraft, setSavedDraft] = useState(null);

  const totalSteps = 4;

  // Load saved draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('polyspack_quote_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setSavedDraft(draft);
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep > 1) {
        localStorage.setItem('polyspack_quote_draft', JSON.stringify({
          formData,
          currentStep,
          savedAt: new Date().toISOString()
        }));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const productTypes = [
    {
      id: 'jerrican',
      name: 'Jerry Cans',
      description: 'Industrial containers for liquids',
      icon: '🛢️',
      specs: ['5L - 25L capacity', 'HDPE material', 'UN certified available']
    },
    {
      id: 'bottle',
      name: 'Bottles',
      description: 'Food-grade and industrial bottles',
      icon: '🍾',
      specs: ['100ml - 5L capacity', 'PET/HDPE options', 'Custom shapes']
    },
    {
      id: 'container',
      name: 'Industrial Containers',
      description: 'Large-scale storage solutions',
      icon: '📦',
      specs: ['20L - 200L capacity', 'Stackable design', 'Heavy-duty']
    },
    {
      id: 'custom',
      name: 'Custom Product',
      description: 'Unique packaging solution',
      icon: '⚙️',
      specs: ['Any size', 'Any shape', 'Specialized features']
    }
  ];

  const materials = [
    { id: 'hdpe', name: 'HDPE (High-Density Polyethylene)', properties: 'Rigid, chemical resistant, recyclable' },
    { id: 'ldpe', name: 'LDPE (Low-Density Polyethylene)', properties: 'Flexible, squeezable' },
    { id: 'pp', name: 'PP (Polypropylene)', properties: 'Heat resistant, food-safe' },
    { id: 'pet', name: 'PET (Polyethylene Terephthalate)', properties: 'Clear, lightweight' },
    { id: 'not_sure', name: 'Not Sure - Need Recommendation', properties: 'Our experts will advise' }
  ];

  const standardColors = [
    { id: 'natural', name: 'Natural/Translucent', hex: '#F5F5F5' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'blue', name: 'Blue', hex: '#0052CC' },
    { id: 'green', name: 'Green', hex: '#00875A' },
    { id: 'red', name: 'Red', hex: '#DE350B' }
  ];

  const features = [
    { id: 'tamper_evident', name: 'Tamper-Evident Seal' },
    { id: 'child_resistant', name: 'Child-Resistant Closure' },
    { id: 'handle', name: 'Ergonomic Handle' },
    { id: 'spout', name: 'Pouring Spout' },
    { id: 'label_panel', name: 'Labeling Panel' },
    { id: 'stackable', name: 'Stackable Design' },
    { id: 'uv_protection', name: 'UV Protection' },
    { id: 'anti_static', name: 'Anti-Static' }
  ];

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.productType) {
        newErrors.productType = 'Please select a product type';
      }
      if (formData.productType === 'custom' && !formData.customDescription) {
        newErrors.customDescription = 'Please describe your custom product';
      }
    }

    if (step === 2) {
      if (!formData.capacity) {
        newErrors.capacity = 'Please specify capacity';
      }
      if (!formData.material) {
        newErrors.material = 'Please select a material';
      }
      if (formData.colorType === 'custom' && !formData.customColor) {
        newErrors.customColor = 'Please specify custom color or Pantone code';
      }
    }

    if (step === 3) {
      if (!formData.estimatedVolume) {
        newErrors.estimatedVolume = 'Please specify estimated volume';
      }
      if (!formData.urgency) {
        newErrors.urgency = 'Please select urgency level';
      }
    }

    if (step === 4) {
      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.contactName) {
        newErrors.contactName = 'Contact name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, [fieldName]: 'File size must be less than 10MB' });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/dwg', 'application/dxf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, [fieldName]: 'Only PDF, JPG, PNG, DWG, DXF files are allowed' });
      return;
    }

    setFormData({ ...formData, [fieldName]: file });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'features') {
            submitData.append(key, JSON.stringify(formData[key]));
          } else if (key === 'technicalDrawing' || key === 'referenceSample') {
            if (formData[key]) {
              submitData.append(key, formData[key]);
            }
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      submitData.append('timestamp', new Date().toISOString());
      submitData.append('source', 'custom_solutions_form');

      // Submit to backend
      const response = await fetch('/api/custom-solutions', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        // Clear draft
        localStorage.removeItem('polyspack_quote_draft');
        
        // Redirect to success page with quote ID
        router.push(`/custom-solutions/success?id=${data.quoteId}`);
      } else {
        setErrors({ submit: data.message || 'Submission failed. Please try again.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'An error occurred. Please try again or contact us directly.' });
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = () => {
    if (savedDraft) {
      setFormData(savedDraft.formData);
      setCurrentStep(savedDraft.currentStep);
      setSavedDraft(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Custom Solutions Request</h1>
          <p className="text-xl opacity-90">
            Tell us about your unique packaging needs. Our experts will design the perfect solution.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Saved Draft Banner */}
        {savedDraft && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-900">Saved Draft Found</p>
              <p className="text-sm text-blue-700">
                Last saved: {new Date(savedDraft.savedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={loadDraft}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Resume
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  <span className="text-xs mt-2 text-center font-medium">
                    {step === 1 && 'Product'}
                    {step === 2 && 'Specifications'}
                    {step === 3 && 'Volume'}
                    {step === 4 && 'Contact'}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Product Type Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2">What type of product do you need?</h2>
                <p className="text-gray-600 mb-6">
                  Select the category that best matches your requirements
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {productTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, productType: type.id })}
                      className={`p-6 border-2 rounded-lg text-left transition-all ${
                        formData.productType === type.id
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{type.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                      <div className="space-y-1">
                        {type.specs.map((spec, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700">
                            <span className="text-green-600 mr-2">•</span>
                            {spec}
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                {errors.productType && (
                  <p className="text-red-600 text-sm mb-4">{errors.productType}</p>
                )}

                {formData.productType === 'custom' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Describe Your Custom Product *
                    </label>
                    <textarea
                      value={formData.customDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, customDescription: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows="4"
                      placeholder="Tell us about the unique packaging solution you need..."
                    />
                    {errors.customDescription && (
                      <p className="text-red-600 text-sm mt-1">{errors.customDescription}</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Specifications */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2">Product Specifications</h2>
                <p className="text-gray-600 mb-6">
                  Define the technical requirements for your product
                </p>

                {/* Capacity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Capacity / Size *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 5"
                      step="0.1"
                    />
                    <select
                      value={formData.capacityUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, capacityUnit: e.target.value })
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ml">ml</option>
                      <option value="liters">Liters</option>
                      <option value="gallons">Gallons</option>
                    </select>
                  </div>
                  {errors.capacity && (
                    <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>
                  )}
                </div>

                {/* Material */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Material *</label>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <label
                        key={material.id}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.material === material.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="material"
                          value={material.id}
                          checked={formData.material === material.id}
                          onChange={(e) =>
                            setFormData({ ...formData, material: e.target.value })
                          }
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-semibold">{material.name}</div>
                          <div className="text-sm text-gray-600">{material.properties}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.material && (
                    <p className="text-red-600 text-sm mt-1">{errors.material}</p>
                  )}
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Color</label>
                  
                  <div className="mb-4">
                    <label className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="colorType"
                        value="standard"
                        checked={formData.colorType === 'standard'}
                        onChange={(e) =>
                          setFormData({ ...formData, colorType: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span>Standard Colors</span>
                    </label>
                    
                    {formData.colorType === 'standard' && (
                      <div className="grid grid-cols-3 gap-3 ml-6">
                        {standardColors.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => setFormData({ ...formData, color: color.id })}
                            className={`p-3 border-2 rounded-lg flex items-center transition-all ${
                              formData.color === color.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded border mr-2"
                              style={{
                                backgroundColor: color.hex,
                                border: color.id === 'white' ? '1px solid #ddd' : 'none'
                              }}
                            />
                            <span className="text-sm">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="colorType"
                      value="custom"
                      checked={formData.colorType === 'custom'}
                      onChange={(e) =>
                        setFormData({ ...formData, colorType: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span>Custom Color (Pantone Match)</span>
                  </label>
                  
                  {formData.colorType === 'custom' && (
                    <input
                      type="text"
                      value={formData.customColor}
                      onChange={(e) =>
                        setFormData({ ...formData, customColor: e.target.value })
                      }
                      className="w-full mt-2 ml-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Pantone 300 C or custom color description"
                    />
                  )}
                  {errors.customColor && (
                    <p className="text-red-600 text-sm mt-1">{errors.customColor}</p>
                  )}
                </div>

                {/* Special Features */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Special Features (Select all that apply)
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.id)}
                          onChange={(e) => {
                            const newFeatures = e.target.checked
                              ? [...formData.features, feature.id]
                              : formData.features.filter((f) => f !== feature.id);
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          className="mr-3"
                        />
                        <span>{feature.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Specifications */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Additional Specifications
                  </label>
                  <textarea
                    value={formData.additionalSpecs}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalSpecs: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Any other technical requirements, dimensions, or special needs..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Volume & Timeline */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2">Volume Requirements & Timeline</h2>
                <p className="text-gray-600 mb-6">
                  Help us understand your production needs
                </p>

                {/* Estimated Volume */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Estimated Order Volume *
                  </label>
                  <select
                    value={formData.estimatedVolume}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedVolume: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select volume range</option>
                    <option value="500-1000">500 - 1,000 units</option>
                    <option value="1000-5000">1,000 - 5,000 units</option>
                    <option value="5000-10000">5,000 - 10,000 units</option>
                    <option value="10000-50000">10,000 - 50,000 units</option>
                    <option value="50000+">50,000+ units</option>
                  </select>
                  {errors.estimatedVolume && (
                    <p className="text-red-600 text-sm mt-1">{errors.estimatedVolume}</p>
                  )}
                </div>

                {/* Frequency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Order Frequency
                  </label>
                  <select
                    value={formData.volumeFrequency}
                    onChange={(e) =>
                      setFormData({ ...formData, volumeFrequency: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="one-time">One-time order</option>
                    <option value="monthly">Monthly recurring</option>
                    <option value="quarterly">Quarterly recurring</option>
                    <option value="ongoing">Ongoing as needed</option>
                  </select>
                </div>

                {/* Urgency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Project Urgency *</label>
                  <div className="space-y-3">
                    {[
                      {
                        value: 'standard',
                        label: 'Standard (4-6 weeks)',
                        desc: 'Normal production timeline',
                        badge: 'Recommended'
                      },
                      {
                        value: 'expedited',
                        label: 'Expedited (2-3 weeks)',
                        desc: 'Faster turnaround (+15% cost)',
                        badge: 'Rush'
                      },
                      {
                        value: 'urgent',
                        label: 'Urgent (1-2 weeks)',
                        desc: 'Immediate attention required (+30% cost)',
                        badge: 'Priority'
                      }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.urgency === option.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="urgency"
                            value={option.value}
                            checked={formData.urgency === option.value}
                            onChange={(e) =>
                              setFormData({ ...formData, urgency: e.target.value })
                            }
                            className="mr-3"
                          />
                          <div>
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            option.value === 'standard'
                              ? 'bg-green-100 text-green-800'
                              : option.value === 'expedited'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {option.badge}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.urgency && (
                    <p className="text-red-600 text-sm mt-1">{errors.urgency}</p>
                  )}
                </div>

                {/* Project Timeline */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    When do you need this delivered?
                  </label>
                  <input
                    type="date"
                    value={formData.projectTimeline}
                    onChange={(e) =>
                      setFormData({ ...formData, projectTimeline: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Budget Range (Optional)
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetRange: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="under-50k">Under KSh 50,000</option>
                    <option value="50k-100k">KSh 50,000 - 100,000</option>
                    <option value="100k-500k">KSh 100,000 - 500,000</option>
                    <option value="500k-1m">KSh 500,000 - 1,000,000</option>
                    <option value="1m+">Over KSh 1,000,000</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-1">
                    This helps us provide more accurate recommendations
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-2">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  How should we reach you with your custom quote?
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Your Company Ltd."
                    />
                    {errors.companyName && (
                      <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({ ...formData, contactName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                    {errors.contactName && (
                      <p className="text-red-600 text-sm mt-1">{errors.contactName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="+254 742 312306"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select your role</option>
                      <option value="owner">Business Owner</option>
                      <option value="procurement">Procurement Manager</option>
                      <option value="operations">Operations Manager</option>
                      <option value="product">Product Manager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select industry</option>
                      <option value="food-beverage">Food & Beverage</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="chemicals">Chemicals</option>
                      <option value="pharmaceuticals">Pharmaceuticals</option>
                      <option value="cosmetics">Cosmetics</option>
                      <option value="industrial">Industrial</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Supporting Documents (Optional)</h3>
                  
                  {/* Technical Drawing */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Technical Drawing / CAD File
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'technicalDrawing')}
                      accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      PDF, JPG, PNG, DWG, DXF (Max 10MB)
                    </p>
                    {formData.technicalDrawing && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {formData.technicalDrawing.name}
                      </p>
                    )}
                  </div>

                  {/* Reference Sample */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Reference Sample / Inspiration Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, 'referenceSample')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      PDF, JPG, PNG (Max 10MB)
                    </p>
                    {formData.referenceSample && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {formData.referenceSample.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Special Requirements or Additional Notes
                  </label>
                  <textarea
                    value={formData.specialRequirements}
                    onChange={(e) =>
                      setFormData({ ...formData, specialRequirements: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="4"
                    placeholder="Any certifications needed, specific regulations, unique constraints, or other information that would help us serve you better..."
                  />
                </div>

                {/* Preferred Contact Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredContact: e.target.value })
                        }
                        className="mr-2"
                      />
                      Email
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredContact: e.target.value })
                        }
                        className="mr-2"
                      />
                      Phone Call
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="whatsapp"
                        checked={formData.preferredContact === 'whatsapp'}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredContact: e.target.value })
                        }
                        className="mr-2"
                      />
                      WhatsApp
                    </label>
                  </div>
                </div>

                {/* How Did You Hear About Us */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    value={formData.hearAboutUs}
                    onChange={(e) =>
                      setFormData({ ...formData, hearAboutUs: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select source</option>
                    <option value="google">Google Search</option>
                    <option value="referral">Referral from colleague</option>
                    <option value="social-media">Social Media</option>
                    <option value="trade-show">Trade Show</option>
                    <option value="existing-customer">Existing Customer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {errors.submit}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                ← Previous
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 shadow-lg transition"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 shadow-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request 🚀'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold">24-Hour Response</div>
            <div className="text-sm text-gray-600">Detailed quote within 1 business day</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-semibold">20+ Years Experience</div>
            <div className="text-sm text-gray-600">Trusted by 500+ Kenyan businesses</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="text-3xl mb-2">✓</div>
            <div className="font-semibold">No Obligation</div>
            <div className="text-sm text-gray-600">Free consultation and quote</div>
          </div>
        </div>
      </div>
    </div>
  );
}
