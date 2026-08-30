import { ORDER_STEPS, type OrderStep } from "@/types/myOrders";

interface OrderStepperProps {
  currentStep: OrderStep;
}

const stepIndex: Record<OrderStep, number> = {
  "order-placed": 0,
  processing: 1,
  "in-transit": 2,
  delivered: 3,
};

export default function OrderStepper({ currentStep }: OrderStepperProps) {
  const currentIndex = stepIndex[currentStep];

  return (
    <ul className="steps steps-horizontal w-full text-xs">
      {ORDER_STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step.id}
            className={`step ${isComplete || isCurrent ? "step-primary" : ""}`}
            data-content={isComplete ? "✓" : index + 1}
          >
            {step.label}
          </li>
        );
      })}
    </ul>
  );
}
