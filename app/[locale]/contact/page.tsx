import ContactForm from "@/components/contact-us/ContactForm";
import ContactInfo from "@/components/contact-us/ContactInfo";
import Hero from "@/components/home/Hero";
import React from "react";


const page = () => {
  return (
    <>
      <Hero />
      <section className="p-container min-h-section grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactInfo />
        <ContactForm />
      </section>

      <section className="h-[400px] w-full">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.0468957716287!2d46.6888465!3d24.7136358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1625136234"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  );
};

export default page;
