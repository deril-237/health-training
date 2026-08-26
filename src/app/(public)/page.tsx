import { HomeBanner } from "./_components/HomeBanner";
import { Missions } from "./_components/Mission";
import { StatisticsSection } from "./_components/StatisticsSection";
import { HomeTrainingList } from "./_components/HomeTrainingList";
import Link from "next/link";
import { CallToAction } from "./_components/CallToAction";

export default function Page() {
  return (
    <>
      <div className="">
        <HomeBanner />
      </div>
      <Missions />
      <StatisticsSection />
      <HomeTrainingList displayTitle={true} />
      <div className="my-16">
        <CallToActionHome />
      </div>
    </>
  );
}

export function CallToActionHome() {
  return (
    <CallToAction>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
        Votre avenir commence ici
      </span>

      <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        Développez vos compétences et préparez votre avenir professionnel.
      </h2>

      <p className="mt-4 text-base leading-7 text-white/65">
        Découvrez nos formations et trouvez le parcours adapté à vos objectifs.
      </p>

      <Link
        href="/trainings"
        className="btn btn-secondary mt-8 rounded-xl border-none px-7 font-bold text-primary"
      >
        Découvrir nos formations
      </Link>
    </CallToAction>
  );
}
