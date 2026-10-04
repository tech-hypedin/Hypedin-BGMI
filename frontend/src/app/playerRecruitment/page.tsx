'use client';

import React, { useState } from 'react';
import { Loader2, Upload, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { BackButton } from '@/components/application/backButton';

interface FormData {
  name: string;
  email: string;
  phoneNo: string;
  UID: string;
  MVPUID: string;
  idCardImage: File[];
  cohort: 'Cohort-1' | 'Cohort-2' | 'Cohort-3' | 'Cohort-4' | 'Cohort-5' | '';
}

export default function MvpEnrollmentForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNo: '',
    UID: '',
    MVPUID: '',
    idCardImage: [],
    cohort: 'Cohort-1'
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phoneNo" ? value.replace(/[^0-9]/g, "") : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (formData.idCardImage.length + files.length > 2) {
      setStatusMessage({
        type: 'error',
        text: 'YOU CAN ONLY UPLOAD A MAXIMUM OF 2 IMAGES.',
      });
      return;
    }

    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setStatusMessage({
          type: 'error',
          text: 'INVALID FILE FORMAT. PLEASE UPLOAD IMAGES ONLY.',
        });
      } else {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        idCardImage: [...prev.idCardImage, ...validFiles],
      }));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      setStatusMessage({ type: null, text: '' });
    }

    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      idCardImage: prev.idCardImage.filter((_, index) => index !== indexToRemove),
    }));
    setPreviewUrls((prev) => {
      const updatedUrls = [...prev];
      URL.revokeObjectURL(updatedUrls[indexToRemove]);
      updatedUrls.splice(indexToRemove, 1);
      return updatedUrls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: null, text: '' });

    // Enforce minimum 2 images requirement
    if (formData.idCardImage.length > 2) {
      setStatusMessage({
        type: 'error',
        text: 'ONLY TWO IMAGES ARE ALLOWED FOR VERIFICATION.',
      });
      setLoading(false);
      return;
    } else if (formData.idCardImage.length < 2) {
      setStatusMessage({
        type: 'error',
        text: 'TWO IMAGES ARE REQUIRED FOR VERIFICATION.',
      });
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phoneNo', formData.phoneNo);
      payload.append('UID', formData.UID);
      payload.append('MVPUID', formData.MVPUID);
      payload.append('cohort', formData.cohort);
      
      formData.idCardImage.forEach((file) => {
        payload.append('idCardImage', file);
      });

      const res = await api.post('/api/ambassador/recruitPlayer', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success || res.status === 200 || res.status === 201) {
        setStatusMessage({
          type: 'success',
          text: 'RECRUITMENT PAYLOAD DEPLOYED SUCCESSFULLY!',
        });

        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        
        setFormData({
          name: '',
          email: '',
          phoneNo: '',
          UID: '',
          MVPUID: '',
          idCardImage: [],
          cohort: ''
        });
        setPreviewUrls([]);
      } else {
        throw new Error(res.data?.message || 'Recruitment dispatch failed.');
      }
    } catch (err: any) {
      console.error('Error deploying recruit payload:', err);
      const errorMessage =
        err.response?.data?.message || 'TRANSMISSION FAILED. PLEASE TRY AGAIN.';

      setStatusMessage({
        type: 'error',
        text: errorMessage.toUpperCase(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-3 sm:p-4 font-['Teko','Oswald',sans-serif] tracking-wider selection:bg-[#ffb60e] selection:text-black mt-2.5">
      <div className="w-full max-w-xl bg-black border border-[#232a35]/80 p-5 sm:p-7 relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className='mb-6 md:mb-8'>
          <BackButton />
        </div>
        
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#ffb60e]" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#ffb60e]" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#ffb60e]" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#ffb60e]" />

        <div className="mb-5 border-l-4 border-[#ffb60e] pl-3 flex flex-col justify-between items-start sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold uppercase text-white leading-none">
              REGISTER YOUR <span className="text-[#ffb60e] drop-shadow-[0_0_10px_rgba(255,182,14,0.4)]">BGMI SQUAD</span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="name" className="text-base uppercase text-[#ffb60e] leading-none">
                SQUAD PLAYER'S FULL NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.G. Your Name"
                required
                className="w-full bg-black/40 border border-[#1e2630] text-white px-3 py-1.5 text-lg focus:outline-none focus:border-[#ffb60e] focus:ring-1 focus:ring-[#ffb60e] placeholder:text-gray-500 transition-all backdrop-blur-md"
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label htmlFor="email" className="text-base uppercase text-[#ffb60e] leading-none">
                SQUAD PLAYER'S COLLEGE EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                className="w-full bg-black/40 border border-[#1e2630] text-white px-3 py-1.5 text-lg focus:outline-none focus:border-[#ffb60e] focus:ring-1 focus:ring-[#ffb60e] placeholder:text-gray-500 transition-all backdrop-blur-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="phoneNo" className="text-base uppercase text-[#ffb60e] leading-none">
                SQUAD PLAYER'S PHONE NUMBER
              </label>
              <input
                type="tel"
                id="phoneNo"
                inputMode='numeric'
                maxLength={10}
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="E.G. 9876543210"
                required
                className="w-full bg-black/40 border border-[#1e2630] text-white px-3 py-1.5 text-lg uppercase focus:outline-none focus:border-[#ffb60e] focus:ring-1 focus:ring-[#ffb60e] placeholder:text-gray-500 transition-all backdrop-blur-md"
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <label htmlFor="UID" className="text-base uppercase text-[#ffb60e] leading-none">
                SQUAD PLAYER'S IN-GAME UID (BGMI)
              </label>
              <input
                type="number"
                id="UID"
                name="UID"
                value={formData.UID}
                onChange={handleChange}
                placeholder="E.G. 5123456789"
                required
                className="w-full bg-black/40 border border-[#1e2630] text-white px-3 py-1.5 text-lg uppercase focus:outline-none focus:border-[#ffb60e] focus:ring-1 focus:ring-[#ffb60e] placeholder:text-gray-500 transition-all backdrop-blur-md"
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <label htmlFor="MVPUID" className="text-base uppercase text-[#ffb60e] leading-none">
              MVP UID (IN GAME UID)
            </label>
            <input
              type="number"
              id="MVPUID"
              name="MVPUID"
              value={formData.MVPUID}
              onChange={handleChange}
              placeholder="E.G. MVP-88210"
              required
              className="w-full bg-black/40 border border-[#1e2630] text-white px-3 py-1.5 text-lg uppercase focus:outline-none focus:border-[#ffb60e] focus:ring-1 focus:ring-[#ffb60e] placeholder:text-gray-500 transition-all backdrop-blur-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base uppercase text-[#ffb60e] leading-none mb-1">
              STUDENT ID CARD (OR ANY VALID GOVT. ID) & PROFILE SCREENSHOT (MIN 2)
            </label>
            
            {previewUrls.length > 0 && (
              <div className="flex flex-col gap-2 mb-2">
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative w-full bg-black/40 border border-[#ffb60e]/50 p-1.5 flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-12 h-12 object-cover border border-[#1e2630]"
                      />
                      <div>
                        <p className="text-base text-white leading-none line-clamp-1 break-all">
                          {formData.idCardImage[index]?.name}
                        </p>
                        <p className="text-xs text-[#ffb60e]">
                          {formData.idCardImage[index]?.size
                            ? (formData.idCardImage[index].size / (1024 * 1024)).toFixed(2) + ' MB'
                            : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1.5 hover:bg-red-950/50 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.idCardImage.length < 2 && (
              <label
                htmlFor="idCardImage"
                className="flex flex-col items-center justify-center w-full h-24 bg-black/40 border-2 border-dashed border-[#1e2630] hover:border-[#ffb60e] transition-colors cursor-pointer group backdrop-blur-md"
              >
                <div className="flex flex-col items-center justify-center py-3">
                  <Upload className="w-6 h-6 text-gray-500 group-hover:text-[#ffb60e] transition-colors mb-1" />
                  <p className="text-base text-gray-300 group-hover:text-white leading-none">
                    CLICK OR DRAG IMAGE TO UPLOAD
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase">
                    PNG, JPG OR WEBP (MAX 5MB)
                  </p>
                </div>
                <input
                  id="idCardImage"
                  name="idCardImage"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {statusMessage.text && (
            <div
              className={`p-2 text-base flex items-center gap-2 border uppercase backdrop-blur-md ${
                statusMessage.type === 'success'
                  ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-400'
                  : 'border-rose-500/80 bg-rose-950/40 text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-2 bg-[#ffb60e] hover:bg-[#e0a00c] disabled:bg-gray-800/80 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-black text-xl tracking-widest transition-all duration-150 [clip-path:polygon(0_0,_100%_0,_95%_100%,_0%_100%)] active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,182,14,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>TRANSMITTING DATA...</span>
                </>
              ) : (
                'DEPLOY APPLICATION'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}