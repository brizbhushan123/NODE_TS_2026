import MasterLanguage from "../models/masterLanguage.model";
import { utility } from "../utils/utility";

const languages = [
  {
    languageName: "English",
    languageCode: "en",
  },
  {
    languageName: "Hindi",
    languageCode: "hi",
  },
  {
    languageName: "Chinese",
    languageCode: "zh",
  },
  {
    languageName: "French",
    languageCode: "fr",
  },
  {
    languageName: "Arabic",
    languageCode: "ar",
  },
];

const seedMasterLanguages = async () => {
  try {
    for (const lang of languages) {
      await MasterLanguage.updateOne(
        { languageCode: lang.languageCode },
        { $set: lang },
        { upsert: true }
      );
    }

    utility.log("✅ MasterLanguage seeded successfully");
  } catch (error) {
    utility.error("❌ Seeder error:", error);
    throw error;
  }
};

export default seedMasterLanguages;