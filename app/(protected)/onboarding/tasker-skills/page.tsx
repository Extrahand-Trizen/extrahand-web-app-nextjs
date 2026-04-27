'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Plus, X, Check } from 'lucide-react';
import { profilesApi } from '@/lib/api/endpoints/profiles';
import { postTaskCategories } from '@/lib/data/categories';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function TaskerSkillsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (customSkills.includes(trimmed) || selected.includes(trimmed)) {
      toast.error('Skill already added');
      return;
    }
    setCustomSkills((prev) => [...prev, trimmed]);
    setCustomInput('');
  };

  const removeCustomSkill = (skill: string) => {
    setCustomSkills((prev) => prev.filter((s) => s !== skill));
  };

  const allSelectedLabels = [
    ...selected.map((id) => {
      const cat = postTaskCategories.find((c) => c.id === id);
      return cat ? cat.label : id;
    }),
    ...customSkills,
  ];

  const handleContinue = async () => {
    if (allSelectedLabels.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    setIsSubmitting(true);
    try {
      const skillList = allSelectedLabels.map((label, i) => ({
        name: label,
        order: i,
        verified: false,
      }));

      await profilesApi.upsertProfile({
        skills: { list: skillList },
      } as any);

      toast.success('Skills saved!', {
        description: `${allSelectedLabels.length} skill${allSelectedLabels.length > 1 ? 's' : ''} added to your profile.`,
      });

      setTimeout(() => {
        router.push('/home');
      }, 600);
    } catch (err) {
      console.error('Error saving skills:', err);
      toast.error('Could not save skills. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-6 py-8">
        <div className="w-full max-w-3xl">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{ backgroundColor: `${PRIMARY_YELLOW}22` }}>
              🛠️
            </div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: DARK }}>
              What are your skills?
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Select the services you offer. You can always update this from your profile.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-amber-200">
              <div className="h-full w-full rounded-full" style={{ backgroundColor: PRIMARY_YELLOW }} />
            </div>
          </div>

          {/* Category chips grid */}
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-gray-800">
              Choose your service categories
              {selected.length > 0 && (
                <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: PRIMARY_YELLOW, color: DARK }}>
                  {selected.length} selected
                </span>
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {postTaskCategories.map((cat) => {
                const isSelected = selected.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    {isSelected && (
                      <div
                        className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                        style={{ backgroundColor: PRIMARY_YELLOW }}
                      >
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                    <span className="line-clamp-2 leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual skill entry */}
          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-gray-800">
              Or type a custom skill
            </p>
            <div className="flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                placeholder="e.g., Piano Tutor, CCTV Installation…"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addCustomSkill}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {/* Custom skill chips */}
            {customSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {customSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeCustomSkill(skill)}
                      className="ml-0.5 rounded-full hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Selected summary */}
          {allSelectedLabels.length > 0 && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">
              ✅ {allSelectedLabels.length} skill{allSelectedLabels.length > 1 ? 's' : ''} ready:{' '}
              <span className="font-medium">{allSelectedLabels.slice(0, 3).join(', ')}
                {allSelectedLabels.length > 3 && ` +${allSelectedLabels.length - 3} more`}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="h-12 w-full text-base font-semibold"
              style={{ backgroundColor: PRIMARY_YELLOW, color: DARK }}
            >
              {isSubmitting ? 'Saving…' : allSelectedLabels.length === 0 ? 'Skip for now' : 'Save & Continue'}
              {!isSubmitting && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>

            <button
              type="button"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => router.push('/home')}
            >
              Skip — I'll add skills later
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
