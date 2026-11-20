import { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Three-Figure Bearings',
    prompt: 'A boat sails directly North-East (halfway between North and East). What is its three-figure bearing?',
    options: ['45°', '045°', '135°', '315°'],
    correctIndex: 1,
    explanation: 'Bearings are always measured clockwise from North (000°) and written with three digits: 045°.',
  },
  {
    id: 2,
    topic: 'Back-Bearings',
    prompt: 'The bearing of Palm Atoll from a Boat is 110°. What is the bearing of the Boat from Palm Atoll?',
    options: ['070°', '250°', '290°', '310°'],
    correctIndex: 2,
    explanation: 'Because 110° is less than 180°, add 180°: 110° + 180° = 290°.',
  },
  {
    id: 3,
    topic: 'SOH CAH TOA',
    prompt: 'A boat sails 40 NM on a bearing of 030°. Which expression gives how far North it travelled?',
    options: ['40 × sin(30°)', '40 × cos(30°)', '40 × tan(30°)', '40 / cos(30°)'],
    correctIndex: 1,
    explanation: 'The North leg is Adjacent to the 30° angle from North, so Adjacent = Hypotenuse × cos(30°) = 34.6 NM.',
  },
  {
    id: 4,
    topic: 'Sine Rule',
    prompt: 'In triangle ABC, you know ∠A = 40°, ∠B = 75°, and side a = 24 NM. Which rule finds side b?',
    options: [
      'b = (24 × sin 75°) / sin 40°',
      'b = (24 × sin 40°) / sin 75°',
      'b² = 24² + 75²',
      'b = 24 × cos 75°',
    ],
    correctIndex: 0,
    explanation: 'By the Sine Rule, b / sin B = a / sin A, so b = (24 × sin 75°) / sin 40° ≈ 36.1 NM.',
  },
  {
    id: 5,
    topic: 'Cosine Rule',
    prompt: 'When do you choose the Cosine Rule instead of the Sine Rule?',
    options: [
      'When you know two angles and one side (ASA)',
      'When the triangle has a 90° angle and you want tan θ',
      'When you know two sides and the included angle (SAS), or all three sides (SSS)',
      'Only when all three sides are equal',
    ],
    correctIndex: 2,
    explanation: 'Use the Cosine Rule for SAS (two sides and the angle between them) or SSS (all three sides).',
  },
];

export default function NavigatorQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = QUESTIONS.reduce(
    (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
    0
  );

  return (
    <section id="challenge" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-sky-700">
              Quick Check · Booth Challenge
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Test Your Navigation Skills
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Try these five quick questions to check your grasp of bearings, SOH CAH TOA, and triangle rules.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-mono tabular-nums text-slate-700">
              Score: <strong className="text-slate-900">{correctCount}</strong> / {QUESTIONS.length}
            </div>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[40px]"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Quiz</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUESTIONS.map((q) => {
            const selected = answers[q.id];
            const hasAnswered = selected !== undefined;
            const isCorrect = selected === q.correctIndex;

            return (
              <article
                key={q.id}
                className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-sky-700">
                    Question 0{q.id} · {q.topic}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 leading-snug">
                    {q.prompt}
                  </h3>

                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, idx) => {
                      const isThisSelected = selected === idx;
                      const isThisCorrect = idx === q.correctIndex;

                      let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-sky-400';
                      if (hasAnswered) {
                        if (isThisCorrect) {
                          btnStyle = 'bg-teal-50 border-teal-400 text-teal-900 font-semibold';
                        } else if (isThisSelected) {
                          btnStyle = 'bg-red-50 border-red-300 text-red-900';
                        } else {
                          btnStyle = 'bg-white/70 border-slate-200 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                          className={`w-full text-left px-3.5 py-2.5 text-sm rounded-lg border transition-colors min-h-[44px] flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
                          )}
                          {hasAnswered && isThisSelected && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {hasAnswered && (
                  <div
                    className={`mt-4 pt-3 border-t text-xs leading-relaxed ${
                      isCorrect ? 'border-teal-200 text-teal-900' : 'border-red-200 text-slate-700'
                    }`}
                  >
                    <strong className="font-semibold">
                      {isCorrect ? 'Correct: ' : 'Explanation: '}
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
