import { useTranslations } from "next-intl";
import Image from "next/image";
import ExploreBtns from "../common/ExploreBtns";

const Hero = () => {
  const t = useTranslations("home");
  return (
    <section className="bg-primary-darker flex-center min-h-section relative">
      <div className="relative z-20 justify-items-center">
        <div className="p-8 flex-col flex-center gap-4 w-4/5">
          <h1 className="text-3xl font-bold text-secondary-foreground">
            {t("hero.title")}
          </h1>
          <p className="text-center text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <ExploreBtns />
        </div>
        <div
          dir="rtl"
          className="grid grid-cols-4 -z-10 grid-rows-4 place-items-center absolute -top-20 left-5.5"
        >
          <div
            className="size-20 rounded-full relative"
            style={{
              gridColumn: "1 / 3",
              gridRow: "1 / 3",
            }}
          >
            <Image
              src="/images/num1Hero.svg"
              alt="Hero Image 1"
              className="rounded-full object-cover"
              priority
              fill
            />
          </div>
          <div
            className="size-28 rounded-full z-10 relative translate-y-[-25px] translate-x-[-25px]"
            style={{
              gridColumn: "2 / 4",
              gridRow: "2 / 4",
            }}
          >
            <Image
              src="/images/num2Hero.svg"
              alt="Hero Image 2"
              className="rounded-full object-cover"
              priority
              fill
            />
          </div>
          <div
            className="size-20 rounded-full relative"
            style={{
              gridColumn: "3 / 5",
              gridRow: "3 / 5",
            }}
          >
            <Image
              src="/images/num3Hero.svg"
              alt="Hero Image 3"
              className="rounded-full object-cover"
              priority
              fill
            />
          </div>
        </div>
      </div>

      <div className="size-full absolute bottom-0 overflow-hidden">
        <svg
          viewBox="0 0 1920 820"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-4/5"
          preserveAspectRatio="none"
        >
          <g className="mix-blend-luminosity">
            <path
              d="M-2.5 690C1039.82 573.854 1337.84 450.361 1718.59 159.972C1784.35 113.317 1832.49 72.6785 1865.53 44.0205C1883.21 29.747 1901.23 15.1329 1919.65 0.166016C1912.44 2.44141 1894.99 18.4689 1865.53 44.0205C1814.23 85.4364 1765.78 123.986 1718.59 159.972C1462.15 341.929 937.893 615.389 -2.49996 626.5L-2.5 690Z"
              fill="url(#paint0_linear_364_2468)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_364_2468"
              x1="478.681"
              y1="1136.98"
              x2="25.5295"
              y2="54.2996"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.230769" stopColor="#C31D00" />
              <stop offset="0.576923" stopColor="#F89B11" />
              <stop offset="0.807692" stopColor="#FF5900" />
            </linearGradient>
          </defs>
          <path
            d="M0 682.5C0 682.5 457.5 649.5 1002.5 506C1547.5 362.5 1923 0 1923 0V820H0V682.5Z"
            fill="url(#paint0_linear_364_2467)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_364_2467"
              x1="1837.49"
              y1="756.346"
              x2="1179.69"
              y2="-734.497"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C31D00" />
              <stop offset="0.447115" stopColor="#F89B11" />
              <stop offset="1" stopColor="#FF5900" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute top-0 -left-5 w-[300px] -rotate-[36deg] mix-blend-luminosity opacity-40"
          viewBox="0 0 528 336"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <rect
              x="-100"
              width="100%"
              height="100%"
              fill="url(#pattern0_364_2470)"
            />
          </g>
          <defs>
            <pattern
              id="pattern0_364_2470"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                xlinkHref="#image0_364_2470"
                transform="matrix(0.0117363 0 0 0.0114569 -1.41768 -5.77901e-05)"
              />
            </pattern>
            <image
              id="image0_364_2470"
              width="206"
              height="126"
              preserveAspectRatio="none"
              xlinkHref="/images/logo.svg"
            />
          </defs>
        </svg>
        <svg
          className="absolute top-36 left-0 w-[200px]"
          viewBox="0 0 328 336"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g className="mix-blend-luminosity">
            <rect
              width="100%"
              height="100%"
              //   x="0"
              //   y="0"
              //   width="328"
              //   height="336"
              fill="url(#pattern0_364_2470)"
            />
          </g>
          <defs>
            <pattern
              id="pattern0_364_2470"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                xlinkHref="#image0_364_2470"
                transform="matrix(0.0117363 0 0 0.0114569 -1.41768 -5.77901e-05)"
              />
            </pattern>
            <image
              id="image0_364_2470"
              width="206"
              height="126"
              preserveAspectRatio="none"
              xlinkHref="/images/logo.svg"
            />
          </defs>
        </svg>
      </div>
      <div className="h-96 w-[350px] absolute bottom-14 right-14">
        <Image src="/images/cartHome.svg" alt="Logo" fill priority />
      </div>
    </section>
  );
};

export default Hero;
