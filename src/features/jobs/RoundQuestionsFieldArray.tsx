import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import { Button, Select, Textarea } from '@/components/ui';
import type { JobFormValues } from '@/lib/validation/job.schemas';

const QUESTION_TYPES = ['technical', 'behavioral', 'situational', 'experience', 'culture'] as const;

export function RoundQuestionsFieldArray({
  control,
  register,
  roundIndex,
}: {
  control: Control<JobFormValues>;
  register: UseFormRegister<JobFormValues>;
  roundIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `rounds.${roundIndex}.questions`,
  });

  return (
    <div className="space-y-2 mt-3">
      {fields.map((field, qi) => (
        <div key={field.id} className="flex items-start gap-2 rounded-lg border border-ink-200 p-2.5">
          <div className="flex-1 min-w-0 space-y-1.5">
            <Textarea
              rows={2}
              className="text-[13px]"
              placeholder="Enter question…"
              {...register(`rounds.${roundIndex}.questions.${qi}.questionText`)}
            />
            <div className="w-40">
              <Select
                className="!h-8 text-[12px]"
                {...register(`rounds.${roundIndex}.questions.${qi}.questionType`)}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => remove(qi)}
            className="w-7 h-7 grid place-items-center rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-500 shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => append({ questionText: '', questionType: 'technical' })}
      >
        + Add question
      </Button>
    </div>
  );
}
