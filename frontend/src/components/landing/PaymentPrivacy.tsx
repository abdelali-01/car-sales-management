import { Lock, HandCoins, CheckCircle2 } from 'lucide-react';

const features = [

  {
    icon: <Lock className="w-8 h-8 text-blue-500" />,
    title: 'Your Privacy is Protected',
    desc: 'Your data is safe and never shared with third parties.',
    bg: 'bg-blue-50 dark:bg-blue-900',
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
    title: 'Peace of Mind',
    desc: 'No payment required until you are 100% satisfied with your order.',
    bg: 'bg-green-50 dark:bg-green-900',
  },
];

export default function PaymentPrivacy() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-gray-200 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 transition hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-800"
            >
              <div className={`mb-4 p-4 rounded-full ${f.bg} shadow-sm`}>{f.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{f.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 