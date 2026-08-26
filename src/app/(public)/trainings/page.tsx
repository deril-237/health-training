import { GraduationCap } from "lucide-react";
import { Banner } from "../_components/Banners";
import { HomeTrainingList } from "../_components/HomeTrainingList";

export default function TrainingsListPage() {
  return (
    <div>
      <div className="w-full">
        <Banner icon={GraduationCap}>
          <div className="w-full mx-auto max-w-7xl flex px-6 items-center  h-120">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-black capitalize leading-tight text-base-100 md:text-6xl">
                Présentation de Nos <br />
                <span className="text-secondary">differentes formations</span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-base-100/80">
                Decouvrez toutes nos formations specialisé
              </p>
            </div>
          </div>
        </Banner>
        <HomeTrainingList limit={15} />
      </div>
    </div>
  );
}
