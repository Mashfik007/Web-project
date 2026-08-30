import { CHECKOUT_STEPS, type CheckoutStep } from "@/types/checkout";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

const stepIndex: Record<CheckoutStep, number> = {
  details: 0,
  payment: 1,
  confirm: 2,
};

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = stepIndex[currentStep];
  const progress =
    CHECKOUT_STEPS.length > 1
      ? (currentIndex / (CHECKOUT_STEPS.length - 1)) * 100
      : 0;

  return (
    <div className="w-full">
      <div className="relative px-0">
        <div className="absolute top-5 right-5 left-5 h-0.5 bg-slate-200" />
        <div
          className="absolute top-5 left-5 h-0.5 bg-sky-500 transition-all duration-300"
          style={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
        />

        <div className="relative flex w-full justify-between">
          {CHECKOUT_STEPS.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isFirst = index === 0;
            const isLast = index === CHECKOUT_STEPS.length - 1;

            return (
              <div
                key={step.id}
                className={`flex flex-col gap-2 ${
                  isFirst
                    ? "items-start"
                    : isLast
                      ? "items-end"
                      : "items-center"
                }`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    isComplete || isCurrent
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-slate-200 bg-white text-slate-400"
                  } ${isCurrent ? "ring-4 ring-sky-100" : ""}`}
                >
                  {isComplete ? "✓" : index + 1}
                </div>

                <span
                  className={`text-xs font-medium whitespace-nowrap sm:text-sm ${
                    isComplete || isCurrent ? "text-sky-600" : "text-slate-400"
                  } ${isFirst ? "text-left" : isLast ? "text-right" : "text-center"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
