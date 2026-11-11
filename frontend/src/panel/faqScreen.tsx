import { ChevronDown } from "lucide-react";
import { FAQ_GROUPS } from "./faqContent";
import { useTranslation } from "../i18n";

export default function FaqScreen() {
  const { t } = useTranslation();

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Preguntas frecuentes")}</h3>
      </header>

      <section className="principalSection sectionFlexible">
        <div className="faqLayout">
          <p className="faqIntro">
            {t("Las dudas más habituales sobre el funcionamiento del inventario.")}
          </p>

          {FAQ_GROUPS.map((group) => (
            <section className="faqGroup" key={group.id}>
              <h2 className="faqGroupTitle">{t(group.title)}</h2>

              <div className="faqList">
                {group.entries.map((entry) => (
                  <details className="faqItem" key={entry.question}>
                    <summary className="faqQuestion">
                      <span className="faqQuestionText">
                        {t(entry.question)}
                      </span>
                      <ChevronDown size={18} className="faqChevron" aria-hidden="true" />
                    </summary>
                    <p className="faqAnswer">{t(entry.answer)}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
