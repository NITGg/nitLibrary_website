"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { OutlineInput, OutlineTextArea } from "../formInputs/OutlineInputs";
import { clientApiFetch } from "@/lib/clientApiFetch";
import { toast } from "sonner";
import { LoadingIcon, UserIcon } from "../ui/icons";
import { Mail, MessageSquare } from "lucide-react";
import { isApiError } from "@/lib/isApiError";

// Form validation schema
const createContactSchema = (t: (str: string) => string) =>
  z.object({
    name: z.string().min(1, { message: t("validation.name_required") }),
    email: z.email({ message: t("validation.invalid_email") }),
    message: z.string().min(1, { message: t("validation.message_required") }),
  });

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

const ContactForm = () => {
  const t = useTranslations("contact");
  const contactSchema = createContactSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await clientApiFetch("/api/contact-us", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast.success(t("form.success"));
      reset(); // Clear form after successful submission
    } catch (error: unknown) {
      console.error("Contact form error:", error);
      toast.error(
        isApiError(error)
          ? error.response.data.message
          : (error as Error).message ?? t("form.error")
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0px_0px_23.8px_1px_#00000040] w-3/4 mx-auto">
      <h3 className="text-xl font-semibold">{t("form.heading")}</h3>
      <p className="mb-4">{t("form.subheading")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <OutlineInput
          id="name"
          label={t("form.name")}
          {...register("name")}
          error={errors.name?.message}
          iconStart={<UserIcon className="w-5 h-5 text-muted-foreground" />}
        />

        <OutlineInput
          id="email"
          type="email"
          label={t("form.email")}
          {...register("email")}
          error={errors.email?.message}
          iconStart={<Mail className="w-5 h-5 text-muted-foreground" />}
        />

        <OutlineTextArea
          id="message"
          rows={4}
          label={t("form.message")}
          {...register("message")}
          error={errors.message?.message}
          iconStart={
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
          }
        />

        <Button type="submit" disabled={isSubmitting} className="w-full py-6">
          {isSubmitting ? (
            <>
              <LoadingIcon className="w-5 h-5 animate-spin mr-2" />
              {t("form.submitting")}
            </>
          ) : (
            t("form.submit")
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
