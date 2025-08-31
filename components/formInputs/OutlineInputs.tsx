// components/OutlineInput.tsx
import { Input } from "@/components/ui/input";
import ErrorMsg from "./ErrorMsg";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OutlineInputProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement | HTMLInputElement> {
  label: string;
  labelClassName?: string;
  id: string;
  error?: string;
  iconStart?: React.ReactNode;
  iconEnd?: { child: React.ReactNode; label?: boolean };
  rows?: number; // Allow passing rows for textarea
}

// Use forwardRef for all field components for RHF compatibility
const OutlineField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  OutlineInputProps & { inputComponent: React.ElementType }
>(function OutlineField(
  {
    label,
    id,
    error,
    className,
    labelClassName,
    iconStart,
    iconEnd,
    placeholder = "",
    inputComponent: InputComponent,
    ...rest
  },
  ref
) {
  return (
    <div className="w-full">
      <div className="flex items-center size-full relative">
        {iconStart && (
          <label
            htmlFor={id}
            className="absolute start-2 top-1/2 transform -translate-y-1/2"
          >
            {iconStart}
          </label>
        )}
        <InputComponent
          id={id}
          placeholder={placeholder}
          className={clsx(
            "peer h-12 pt-1 placeholder-transparent",
            iconStart && "ps-10",
            iconEnd && "pe-10",
            "w-full appearance-none",
            "text-sm bg-white text-muted-foreground transition-all",
            className
          )}
          ref={ref}
          {...rest}
        />
        {iconEnd?.label && (
          <label
            htmlFor={id}
            className="absolute end-2 top-1/2 transform -translate-y-1/2"
          >
            {iconEnd.child}
          </label>
        )}
        {!iconEnd?.label && iconEnd?.child}
        <label
          htmlFor={id}
          className={clsx(
            "absolute start-3 -top-2.5 text-xs bg-white text-muted-foreground px-1 transition-all",
            "peer-placeholder-shown:top-3 peer-placeholder-shown:text-clamp",
            "peer-placeholder-shown:text-muted-foreground peer-focus:-top-2.5",
            "peer-focus:text-xs peer-focus:text-primary",
            iconStart && "start-10",
            labelClassName
          )}
        >
          {label}
        </label>
      </div>
      {error && <ErrorMsg message={error} />}
    </div>
  );
});

export const OutlineInput = forwardRef<HTMLInputElement, OutlineInputProps>(
  function OutlineInput(props, ref) {
    return <OutlineField {...props} inputComponent={Input} ref={ref} />;
  }
);

export const OutlineTextArea = forwardRef<
  HTMLTextAreaElement,
  OutlineInputProps
>(function OutlineTextArea(props, ref) {
  return <OutlineField {...props} inputComponent={Textarea} ref={ref} />;
});

interface OutlineSelectProps extends React.ComponentProps<typeof Select> {
  label: string;
  id: string;
  error?: string;
  iconStart?: React.ReactNode;
  iconEnd?: { child: React.ReactNode; label?: boolean };
  placeholder?: string;
  className?: string;
  options: { value: string; label: string }[];
}

export const OutlineSelect: React.FC<OutlineSelectProps> = ({
  label,
  id,
  error,
  className,
  iconStart,
  iconEnd,
  placeholder = "",
  options,
  ...rest
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center size-full relative">
        {iconStart && (
          <div className="absolute start-2 top-1/2 transform -translate-y-1/2">
            {iconStart}
          </div>
        )}
        <Select {...rest}>
          <SelectTrigger
            id={id}
            className={clsx(
              "peer h-12 pt-1 placeholder-transparent",
              iconStart && "ps-10",
              iconEnd && "pe-10",
              "w-full appearance-none",
              "text-sm bg-white text-muted-foreground transition-all",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label
          htmlFor={id}
          className="absolute start-3 -top-2.5 text-xs bg-white text-muted-foreground px-1 transition-all
                    peer-data-[state=open]:-top-2.5 peer-data-[state=open]:text-xs peer-data-[state=open]:text-primary"
        >
          {label}
        </label>
        {iconEnd?.label && (
          <div className="absolute end-2 top-1/2 transform -translate-y-1/2 z-10">
            {iconEnd.child}
          </div>
        )}
        {!iconEnd?.label && iconEnd?.child}
      </div>
      {error && <ErrorMsg message={error} />}
    </div>
  );
};
