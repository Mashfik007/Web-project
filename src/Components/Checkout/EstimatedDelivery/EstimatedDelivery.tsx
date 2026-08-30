import Image from "next/image";
import truckIcon from "@svg/truck.svg";
interface EstimatedDeliveryProps {
  message: string;
}

export default function EstimatedDelivery({ message }: EstimatedDeliveryProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
        <Image
          src={truckIcon}
          alt="Delivery"
          width={16}
          height={16}
          className="size-4"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-sky-700">Estimated Delivery</p>
        <p className="mt-0.5 text-xs text-sky-600">{message}</p>
      </div>
    </div>
  );
}
