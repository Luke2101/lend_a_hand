import {TestUserBuilder} from "../tests/util/TestUserBuilder.js";
import TestRequestBuilder from "../tests/util/TestRequestBuilder.js";
import RequestCategory from "./util/RequestCategory.js";


export default async function main() {
    const userA = await new TestUserBuilder(true).withPlz(74889).withBalance(500).build();
    const userB = await new TestUserBuilder(true).withPlz(74856).withBalance(500).build();
    const userC = await new TestUserBuilder(true).withPlz(74833).withBalance(500).build();

    await new TestRequestBuilder(true)
        .withTitle("Brauche Hilfe beim Hausbau")
        .withCategory(RequestCategory.HELP)
        .withDescription("Ich baue gerade eine Gartenhütte und brauche Unterstützung beim Dachaufbau am Wochenende.")
        .withCredits(120)
        .create(userA.token)


    await new TestRequestBuilder(true)
        .withTitle("Kann mir jemand beim Möbeltragen helfen?")
        .withCategory(RequestCategory.HELP)
        .withDescription("Ziehe am Samstag um und brauche Hilfe beim Tragen von Sofa und Waschmaschine.")
        .withCredits(50)
        .create(userB.token)

    await new TestRequestBuilder(true)
        .withTitle("Suche Unterstützung beim Renovieren der Wohnung")
        .withCategory(RequestCategory.HELP)
        .withDescription("Wände müssen gestrichen werden, Material ist vorhanden. Für Pizza und Getränke ist gesorgt!")
        .withCredits(80)
        .create(userA.token)

    await new TestRequestBuilder(true)
        .withTitle("Hilfe beim Zusammenbau eines IKEA-Schranks")
        .withCategory(RequestCategory.HELP)
        .withDescription("Habe den Schrank fast fertig, aber komme bei den Türen nicht weiter. Werkzeug vorhanden.")
        .withCredits(30)
        .create(userA.token)

    await new TestRequestBuilder(true)
        .withTitle("Wer kann bei Gartenarbeit helfen?")
        .withCategory(RequestCategory.HELP)
        .withDescription("Suche Hilfe beim Hecken schneiden und Rasenmähen. Dauer ca. 2 Stunden.")
        .withCredits(40)
        .create(userC.token)


    await new TestRequestBuilder(true)
        .withTitle("Kann mir jemand eine Bohrmaschine ausleihen?")
        .withCategory(RequestCategory.RENT)
        .withDescription("Brauche eine Bohrmaschine für zwei Tage, um Regale zu montieren.")
        .withCredits(20)
        .create(userB.token)

    await new TestRequestBuilder(true)
        .withTitle("Suche Leiter zum Ausleihen")
        .withCategory(RequestCategory.RENT)
        .withDescription("Muss Regenrinne reinigen, bräuchte eine lange Leiter für einen Tag.")
        .withCredits(15)
        .create(userC.token)

    await new TestRequestBuilder(true)
        .withTitle("Kann mir jemand eine Kamera leihen?")
        .withCategory(RequestCategory.RENT)
        .withDescription("Brauche DSLR oder Systemkamera für Hochzeitsfotos am Samstag.")
        .withCredits(60)
        .create(userB.token)

    process.exit()
}

await main()
