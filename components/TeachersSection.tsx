import { useTranslations } from "next-intl";
import React from "react";
import { Card, CardAction, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

const TeachersSection = ({
  priorityImages = true,
}: {
  priorityImages: boolean;
}) => {
  const t = useTranslations("teachers");

  const teachers: { name: string; image: string; id: string }[] = [
    {
      name: "رضا فاروق",
      image: "/images/teacher1.svg",
      id: "teacher1",
    },
    {
      name: "أحمد محمد",
      image: "/images/teacher2.svg",
      id: "teacher2",
    },
    {
      name: "محمد صلاح",
      image: "/images/teacher3.svg",
      id: "teacher3",
    },
    {
      name: "علي حسن",
      image: "/images/teacher1.svg",
      id: "teacher4",
    },
  ];

  return (
    <section className="min-h-section flex-center flex-col p-6">
      <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
      <p className="text-gray-600">{t("description")}</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="border-0 shadow-none">
            <CardContent className="flex-col flex-center gap-2 p-4">
              <Image
                src={teacher.image}
                alt={teacher.name}
                className="size-16 rounded-full object-cover"
                width={64}
                height={64}
                priority={priorityImages}
              />
              <h3 className="font-semibold">{teacher.name}</h3>
              <CardAction className="m-auto">
                <Button>{t("viewService")}</Button>
              </CardAction>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TeachersSection;
