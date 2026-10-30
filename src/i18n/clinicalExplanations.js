/**
 * MediGuard AI - Curated Clinical Explanations & Rule Translations
 * High-accuracy translations in English, Telugu, and Hindi.
 * 
 * CRITICAL CLINICAL SAFETY PRINCIPLES:
 * 1. Medicine names (generic and brand), dosages, units (mg, mL/min),
 *    rule IDs, and clinical abbreviations (eGFR, INR) are strictly preserved.
 * 2. Only the rationale, clinical warnings, and actionable review advice are translated.
 * 3. A reliable fallback to English is always provided when a key is absent.
 */

export const CLINICAL_CATEGORY_TRANSLATIONS = {
  en: {
    "Drug-Drug Interaction": "Drug-Drug Interaction",
    "Duplicate Therapy": "Duplicate Therapy",
    "Kidney-Related Dose Concern": "Kidney-Related Dose Concern",
    "Contraindication Flag": "Contraindication Flag",
    "Uncertain Medication Identity": "Uncertain Medication Identity"
  },
  te: {
    "Drug-Drug Interaction": "ఔషధ-ఔషధ పరస్పర చర్య (Drug Interaction)",
    "Duplicate Therapy": "పునరావృత చికిత్స హెచ్చరిక (Duplicate Therapy)",
    "Kidney-Related Dose Concern": "మూత్రపిండ మోతాదు సమస్య (Renal Dose Concern)",
    "Contraindication Flag": "విరుద్ధ ఔషధ సూచిక (Contraindication)",
    "Uncertain Medication Identity": "అనిశ్చిత ఔషధ గుర్తింపు (Uncertain Identity)"
  },
  hi: {
    "Drug-Drug Interaction": "दवा-दवा परस्पर क्रिया (Drug Interaction)",
    "Duplicate Therapy": "दोहरी चिकित्सा चेतावनी (Duplicate Therapy)",
    "Kidney-Related Dose Concern": "गुर्दे संबंधित खुराक चिंता (Renal Dose Concern)",
    "Contraindication Flag": "निषिद्ध दवा चेतावनी (Contraindication)",
    "Uncertain Medication Identity": "अनिश्चित दवा पहचान (Uncertain Identity)"
  }
};

export const SEVERITY_TRANSLATIONS = {
  en: {
    "Critical": "Critical Priority",
    "High": "High Priority",
    "Moderate": "Moderate Priority",
    "Low": "Low Priority"
  },
  te: {
    "Critical": "తీవ్రమైన ప్రాధాన్యత (Critical)",
    "High": "అధిక ప్రాధాన్యత (High)",
    "Moderate": "మధ్యస్థ ప్రాధాన్యత (Moderate)",
    "Low": "తక్కువ ప్రాధాన్యత (Low)"
  },
  hi: {
    "Critical": "अति गंभीर प्राथमिकता (Critical)",
    "High": "उच्च प्राथमिकता (High)",
    "Moderate": "मध्यम प्राथमिकता (Moderate)",
    "Low": "सामान्य प्राथमिकता (Low)"
  }
};

export const RULE_EXPLANATION_TRANSLATIONS = {
  // 1. Drug-Drug Interactions (DDI)
  "RULE-DDI-001": {
    te: {
      title: "తీవ్రమైన రక్తస్రావ ప్రమాదం: Warfarin + Aspirin",
      whyFlagged: "Warfarin మరియు Aspirin కలిసి తీసుకోవడం వల్ల అంతర్గత మరియు గ్యాస్ట్రోఇంటెస్టినల్ రక్తస్రావం (GI Bleeding) జరిగే ప్రమాదం 2.4 నుండి 3.8 రెట్లు పెరుగుతుంది.",
      suggestedAction: "ఈ కలయిక యొక్క క్లినికల్ సూచనను సమీక్షించండి. రెండూ అవసరమైతే, గ్యాస్ట్రోప్రొటెక్షన్ (PPI) అందించండి మరియు INR నిరంతరం పర్యవేక్షించండి."
    },
    hi: {
      title: "गंभीर रक्तस्राव का जोखिम: Warfarin + Aspirin",
      whyFlagged: "Warfarin और Aspirin का एक साथ उपयोग आंतरिक और जठరాंत्र संबंधी रक्तस्राव (GI Bleeding) के जोखिम को 2.4 से 3.8 गुना बढ़ा देता है।",
      suggestedAction: "संयोजन के नैदानिक संकेत की समीक्षा करें। यदि दोनों आवश्यक हैं, तो गैस्ट्रोप्रोटेक्शन (PPI) सुनिश्चित करें और INR की कड़ी निगरानी रखें।"
    }
  },
  "RULE-DDI-002": {
    te: {
      title: "తీవ్రమైన రక్తస్రావం & మూత్రపిండాల ప్రమాదం: Warfarin + Ibuprofen",
      whyFlagged: "NSAID మందులు ప్లేట్‌లెట్ పనితీరును అణిచివేస్తాయి మరియు మూత్రపిండాల ప్రోస్టాగ్లాండిన్ సంశ్లేషణను బలహీనపరుస్తాయి, రక్తస్రావ ప్రమాదాన్ని 3 నుండి 6 రెట్లు పెంచుతాయి.",
      suggestedAction: "ఈ కలయికను నివారించండి. సురక్షితమైన ప్రత్యామ్నాయంగా వైద్య పర్యవేక్షణలో Acetaminophen (Paracetamol) ను పరిగణించండి."
    },
    hi: {
      title: "गंभीर रक्तस्राव और गुर्दे का जोखिम: Warfarin + Ibuprofen",
      whyFlagged: "NSAID प्लेटलेट के कार्य को बाधित करते हैं और गुर्दे के रक्त प्रवाह को प्रभावित करते हैं, जिससे रक्तस्राव का खतरा 3 से 6 गुना बढ़ जाता है।",
      suggestedAction: "एक साथ उपयोग से बचें। सुरक्षित दैनिक खुराक में Acetaminophen (Paracetamol) जैसे सुरक्षित दर्द निवारक विकल्प पर विचार करें।"
    }
  },
  "RULE-DDI-003": {
    te: {
      title: "తీవ్రమైన రక్తస్రావ ప్రమాదం: Warfarin + Naproxen",
      whyFlagged: "Naproxen మరియు సిస్టమిక్ యాంటీకోయాగ్యులేషన్ కలయిక వల్ల పై జీర్ణాశయ రక్తస్రావం మరియు మూత్రపిండాల సమస్యలు తలెత్తుతాయి.",
      suggestedAction: "Naproxen ను నిలిపివేయండి లేదా తక్కువ ప్రమాదం ఉన్న ప్రత్యామ్నాయ అనాల్జేసిక్ మందును సూచించండి."
    },
    hi: {
      title: "गंभीर रक्तस्राव जोखिम: Warfarin + Naproxen",
      whyFlagged: "Naproxen और एंटीकोआगुलेंट का संयोजन ऊपरी जीआई रक्तस्राव को काफी बढ़ा देता है और गुर्दे के हेमोडायनामिक्स को प्रभावित करता है।",
      suggestedAction: "NSAID को बंद करें या चिकित्सकीय देखरेख में कम जोखिम वाले दर्द निवारक विकल्प पर स्विच करें।"
    }
  },
  "RULE-DDI-004": {
    te: {
      title: "యాంటీప్లేట్‌లెట్ ప్రభావం క్షీణత: Clopidogrel + Omeprazole",
      whyFlagged: "Omeprazole కాలేయ ఎంజైమ్ CYP2C19 ను నిరోధించడం వల్ల Clopidogrel క్రియాశీలత తగ్గి, కార్డియోవాస్కులర్ మరియు స్టెంట్ థ్రాంబోసిస్ ప్రమాదం పెరుగుతుంది.",
      suggestedAction: "Omeprazole బదులుగా CYP2C19 పై తక్కువ ప్రభావం చూపే Pantoprazole కు మారండి."
    },
    hi: {
      title: "एंटीप्लेटलेट प्रभाव में कमी: Clopidogrel + Omeprazole",
      whyFlagged: "Omeprazole यकृत एंजाइम CYP2C19 को बाधित करता है, जिससे Clopidogrel का सक्रियण कम हो जाता है और हृदय संबंधी जोखिम बढ़ जाता है।",
      suggestedAction: "Omeprazole के स्थान पर CYP2C19 पर न्यूनतम प्रभाव डालने वाले Pantoprazole का उपयोग करें।"
    }
  },
  "RULE-DDI-005": {
    te: {
      title: "మయోపతి & ర్యాబ్డోమయోలిసిస్ ప్రమాదం: Simvastatin + Amlodipine",
      whyFlagged: "Amlodipine వల్ల Simvastatin సాంద్రత శరీరంలో గణనీయంగా పెరిగి కండరాల బలహీనత మరియు మూత్రపిండాల నష్టానికి దారితీసే ప్రమాదం ఉంది.",
      suggestedAction: "Amlodipine తో కలిపి వాడినప్పుడు Simvastatin మోతాదును గరిష్టంగా 20 mg కు పరిమితం చేయండి లేదా Atorvastatin కు మారండి."
    },
    hi: {
      title: "मायोपैथी और मांसपेशियों की क्षति का जोखिम: Simvastatin + Amlodipine",
      whyFlagged: "Amlodipine, Simvastatin के रक्त स्तर को काफी बढ़ा देता है, जिससे मांसपेशियों की क्षति और रबडोमायोलिसिस का खतरा बढ़ जाता है।",
      suggestedAction: "Amlodipine के साथ Simvastatin की खुराक को अधिकतम 20 mg तक सीमित करें या Atorvastatin पर स्विच करें।"
    }
  },
  "RULE-DDI-006": {
    te: {
      title: "మెథోట్రెక్సేట్ విషతుల్యత ప్రమాదం: Methotrexate + Ibuprofen",
      whyFlagged: "NSAID మందులు మూత్రపిండాల ద్వారా Methotrexate విసర్జనను అడ్డుకుంటాయి, దీనివల్ల ఎముక మజ్జ అణిచివేత మరియు కాలేయ విషపూరితం సంభవించవచ్చు.",
      suggestedAction: "Methotrexate మోతాదు తీసుకునే సమయంలో NSAID ల వాడకాన్ని ఆపండి లేదా ప్రత్యామ్నాయ నొప్పి నివారిణిని ఎంచుకోండి."
    },
    hi: {
      title: "मेथोट्रेक्सेट विषाक्तता का गंभीर जोखिम: Methotrexate + Ibuprofen",
      whyFlagged: "NSAID गुर्दे से Methotrexate के उत्सर्जन को कम करते हैं, जिससे गंभीर अस्थि मज्जा दमन और हेमेटोलॉजिकल विषाक्तता हो सकती है।",
      suggestedAction: "Methotrexate के उपयोग के दौरान NSAID से बचें और सुरक्षित एनाल्जेसिक विकल्पों पर विचार करें।"
    }
  },
  "RULE-DDI-007": {
    te: {
      title: "హైపర్‌కలేమియా మరియు అరిథ్మియా ప్రమాదం: Lisinopril + Spironolactone",
      whyFlagged: "రెండు మందులు కూడా పొటాషియం స్థాయిలను పెంచుతాయి, దీనివల్ల ప్రమాదకరమైన హైపర్‌కలేమియా మరియు గుండె లయ తప్పడం (Cardiac Arrhythmia) జరగవచ్చు.",
      suggestedAction: "సీరమ్ పొటాషియం మరియు మూత్రపిండాల పనితీరును తరచుగా పర్యవేక్షించండి. పొటాషియం సప్లిమెంట్లను నివారించండి."
    },
    hi: {
      title: "हाइपरकेलेमिया और अतालता का जोखिम: Lisinopril + Spironolactone",
      whyFlagged: "दोनों दवाएं सीरम पोटेशियम को बनाए रखती हैं, जिससे गंभीर हाइपरकेलेमिया और जानलेवा कार्डियक अतालता का खतरा होता है।",
      suggestedAction: "सीरम पोटेशियम और गुर्दे के कार्य की नियमित निगरानी करें। पोटेशियम सप्लीमेंट्स से बचें।"
    }
  },
  "RULE-DDI-008": {
    te: {
      title: "తీవ్రమైన సిఎన్‌ఎస్ మరియు శ్వాసకోశ మాంద్యం: Diazepam + Lorazepam",
      whyFlagged: "రెండు బెంజోడియాజిపైన్లు కలపడం వల్ల శ్వాస మందగించడం, తీవ్ర మగత మరియు సమన్వయ లోపం ఏర్పడుతుంది.",
      suggestedAction: "బహుళ బెంజోడియాజిపైన్ల వాడకాన్ని నివారించండి. ఒకే మందుతో చికిత్సను క్రమబద్ధీకరించండి."
    },
    hi: {
      title: "गंभीर श्वसन और सीएनएस अवसाद: Diazepam + Lorazepam",
      whyFlagged: "दो बेंजोडायजेपाइन का सह-प्रशासन अत्यधिक बेहोशी, श्वसन अवसाद और गिरने के जोखिम को बहुत बढ़ा देता है।",
      suggestedAction: "अनावश्यक दोहरे बेंजोडायजेपाइन को बंद करें और एक एकल एजेंट पर खुराक को युक्तिसंगत बनाएं।"
    }
  },
  "RULE-DDI-009": {
    te: {
      title: "డిగోక్సిన్ విషపూరితం ప్రమాదం: Digoxin + Amiodarone",
      whyFlagged: "Amiodarone మూత్రపిండాల ద్వారా Digoxin తొలగింపును నిరోధిస్తుంది, సీరమ్ డిగోక్సిన్ స్థాయిలను దాదాపు 70-100% పెంచుతుంది.",
      suggestedAction: "Amiodarone ప్రారంభించినప్పుడు Digoxin మోతాదును 50% తగ్గించండి మరియు సీరమ్ గాఢతను పర్యవేక్షించండి."
    },
    hi: {
      title: "डिगोक्सिन विषाक्तता का उच्च जोखिम: Digoxin + Amiodarone",
      whyFlagged: "Amiodarone डिगोक्सिन की निकासी को रोकता है, जिससे सीरम डिगोक्सिन का स्तर लगभग दोगुना हो सकता है और हृदय विषाक्तता हो सकती है।",
      suggestedAction: "Amiodarone शुरू करते समय Digoxin की खुराक को 50% कम करें और सीरम स्तर की जांच करें।"
    }
  },
  "RULE-DDI-010": {
    te: {
      title: "రక్తస్రావ ప్రమాదం: Apixaban + Aspirin",
      whyFlagged: "ప్రత్యక్ష నోటి ప్రతిస్కందకం (DOAC) తో యాంటీప్లేట్‌లెట్ కలపడం వల్ల అధిక రక్తస్రావం జరుగుతుంది.",
      suggestedAction: "కలిపి వాడవలసిన నిర్దిష్ట కార్డియాక్ సూచన లేకపోతే Aspirin ను నిలిపివేయండి."
    },
    hi: {
      title: "प्रमुख रक्तस्राव जोखिम: Apixaban + Aspirin",
      whyFlagged: "DOAC और एंटीप्लेटलेट का दोहरा संयोजन बड़े रक्तस्राव के खतरे को काफी बढ़ा देता है।",
      suggestedAction: "जब तक स्पष्ट तीव्र कोरोनरी संकेत न हो, Aspirin की निरंतर आवश्यकता का पुनर्मूल्यांकन करें।"
    }
  },

  // 2. Duplicate Therapy Rules (DUP)
  "RULE-DUP-001": {
    te: {
      title: "పునరావృత RAAS నిరోధక చికిత్స: ACE ఇన్‌హిబిటర్ + ARB",
      whyFlagged: "Lisinopril (ACEi) మరియు Losartan (ARB) లను కలిసి వాడటం నిషిద్ధ పునరావృత చికిత్స. ఇది అదనపు ప్రయోజనం లేకుండా తీవ్ర రక్తపోటు పడిపోవడం మరియు మూత్రపిండాల వైఫల్యానికి దారితీస్తుంది.",
      suggestedAction: "రెండు మందులలో ఒకదానిని తక్షణమే నిలిపివేయండి. రక్తపోటు నియంత్రణకు విభిన్న తరగతి ఔషధాన్ని (ఉదా. CCB లేదా థయాజైడ్) ఎంచుకోండి."
    },
    hi: {
      title: "दोहरी RAAS नाकाबंदी डुप्लिकेट थेरेपी: ACE Inhibitor + ARB",
      whyFlagged: "Lisinopril और Losartan का एक साथ उपयोग डुप्लिकेट थेरेपी है। यह बिना किसी लाभ के तीव्र गुर्दे की विफलता और हाइपरकेलेमिया के जोखिम को बढ़ाता है।",
      suggestedAction: "तुरंत किसी एक एजेंट को बंद करें। यदि अतिरिक्त रक्तचाप नियंत्रण की आवश्यकता है तो अन्य दवा वर्ग (जैसे CCB) का उपयोग करें।"
    }
  },
  "RULE-DUP-002": {
    te: {
      title: "పునరావృత NSAID చికిత్స హెచ్చరిక",
      whyFlagged: "ఒకటి కంటే ఎక్కువ సిస్టమిక్ NSAID మందులను ఏకకాలంలో వాడటం వల్ల జీర్ణకోశ అల్సర్లు మరియు తీవ్ర మూత్రపిండాల నష్టం జరుగుతుంది.",
      suggestedAction: "ఒక NSAID ను మాత్రమే కొనసాగించండి లేదా సురక్షితమైన ప్రత్యామ్నాయ మందును అందించండి."
    },
    hi: {
      title: "डुप्लिकेट NSAID थेरेपी चेतावनी",
      whyFlagged: "एक साथ कई NSAID का उपयोग चिकित्सीय लाभ बढ़ाए बिना गैस्ट्रिक अल्सरेशन और गुर्दे की क्षति के जोखिम को अत्यधिक बढ़ाता है।",
      suggestedAction: "अनावश्यक NSAID को बंद करें और सबसे कम प्रभावी एकल खुराक का उपयोग करें।"
    }
  },
  "RULE-DUP-003": {
    te: {
      title: "పునరావృత బెటా-బ్లాకర్ చికిత్స",
      whyFlagged: "రెండు బెటా-బ్లాకర్ మందులను ఏకకాలంలో తీసుకోవడం వల్ల ప్రమాదకరమైన బ్రాడీకార్డియా (గుండె మందగించడం) మరియు రక్తపోటు పడిపోవడం జరుగుతుంది.",
      suggestedAction: "చికిత్సను ఒకే బెటా-బ్లాకర్ ఏజెంట్‌కు పరిమితం చేయండి."
    },
    hi: {
      title: "डुप्लिकेट बीटा-ब्लॉकर थेरेपी",
      whyFlagged: "दोहरे बीटा-ब्लॉकर से गंभीर ब्रैडीकार्डिया, हार्ट ब्लॉक और अत्यधिक हाइपोटेंशन हो सकता है।",
      suggestedAction: "बीटा-ब्लॉकर व्यवस्था को एकल एजेंट पर तर्कसंगत बनाएं।"
    }
  },
  "RULE-DUP-004": {
    te: {
      title: "పునరావృత బెంజోడియాజిపైన్ చికిత్స",
      whyFlagged: "ఒకటి కంటే ఎక్కువ బెంజోడియాజిపైన్లు కలపడం వలన అనవసర మగత మరియు శ్వాస వైఫల్యం సంభవించవచ్చు.",
      suggestedAction: "ఒకే బెంజోడియాజిపైన్ ఏజెంట్‌తో చికిత్సను కొనసాగించండి."
    },
    hi: {
      title: "डुप्लिकेट बेंजोडायजेपाइन थेरेपी",
      whyFlagged: "एकाधिक बेंजोडायजेपाइन का एक साथ उपयोग अत्यधिक शामक प्रभाव और निर्भरता को बढ़ाता है।",
      suggestedAction: "रोगी को एकल एजेंट पर स्थिर करें और अनावश्यक दूसरी दवा बंद करें।"
    }
  },
  "RULE-DUP-005": {
    te: {
      title: "పునరావృత స్టాటిన్ లిపిడ్ చికిత్స",
      whyFlagged: "రెండు స్టాటిన్ మందులను కలపడం వల్ల కాలేయ ఎంజైమ్‌లు పెరగడం మరియు కండరాల క్షీణత (ర్యాబ్డోమయోలిసిస్) జరుగుతుంది.",
      suggestedAction: "ఒక స్టాటిన్ మందును మాత్రమే సరిపడా మోతాదులో కొనసాగించండి."
    },
    hi: {
      title: "डुप्लिकेट स्टैटिन लिपिड थेरेपी",
      whyFlagged: "दोहरे स्टैटिन से बिना किसी अतिरिक्त लाभ के मायोपैथी और यकृत एंजाइम वृद्धि का गंभीर खतरा होता है।",
      suggestedAction: "डुप्लिकेट स्टैटिन को बंद करें और एक एकल एजेंट पर खुराक को अनुकूलित करें।"
    }
  },

  // 3. Kidney / Renal Safety Rules (REN)
  "RULE-REN-001": {
    te: {
      title: "తీవ్రమైన మూత్రపిండ లోపంలో Metformin విరుద్ధం",
      whyFlagged: "eGFR < 30 mL/min ఉన్న రోగులలో Metformin ఔషధ విసర్జన తగ్గి శరీరంలో పేరుకుపోతుంది. ఇది ప్రాణాంతక లాక్టిక్ అసిడోసిస్ (MALA) కు దారితీస్తుంది.",
      suggestedAction: "Metformin ను తక్షణమే నిలిపివేయండి. నెఫ్రోలాజిస్ట్ సలహాతో మూత్రపిండాలకు సురక్షితమైన ఇన్సులిన్ లేదా DPP-4 ఇన్హిబిటర్ (Linagliptin) కు మారండి."
    },
    hi: {
      title: "गंभीर गुर्दे की विफलता में Metformin निषिद्ध",
      whyFlagged: "eGFR < 30 mL/min वाले रोगियों में Metformin का संचय हो सकता है, जिससे जानलेवा लैक्टिक एसिडोसिस (MALA) का अत्यधिक खतरा होता है।",
      suggestedAction: "Metformin को तुरंत बंद करें और गुर्दे के लिए सुरक्षित मधुमेह उपचार (जैसे इंसुलिन या Linagliptin) पर स्विच करें।"
    }
  },
  "RULE-REN-002": {
    te: {
      title: "మధ్యస్థ మూత్రపిండ క్షీణతలో Metformin మోతాదు సర్దుబాటు అవసరం",
      whyFlagged: "eGFR 30-44 mL/min ఉన్న రోగులలో లాక్టిక్ అసిడోసిస్ నివారణకు Metformin గరిష్ట మోతాదును రోజుకు 1000 mg కు పరిమితం చేయాలి.",
      suggestedAction: "Metformin మోతాదు రోజుకు గరిష్టంగా 1000 mg దాటకుండా చూసుకోండి మరియు మూత్రపిండాల పనితీరును తరచుగా తనిఖీ చేయండి."
    },
    hi: {
      title: "मध्यम गुर्दे की दुर्बलता में Metformin खुराक समायोजन आवश्यक",
      whyFlagged: "eGFR 30-44 mL/min पर, लैक्टिक एसिडोसिस से बचने के लिए Metformin की अधिकतम खुराक 1000 mg प्रतिदिन तक सीमित होनी चाहिए।",
      suggestedAction: "खुराक को अधिकतम 1000 mg/दिन तक कम करें और हर 3-6 महीने में रीनल फंक्शन की निगरानी करें।"
    }
  },
  "RULE-REN-003": {
    te: {
      title: "తీవ్రమైన మూత్రపిండ వైఫల్యంలో Gabapentin మోతాదు సర్దుబాటు అవసరం",
      whyFlagged: "Gabapentin పూర్తిగా మూత్రపిండాల ద్వారా విసర్జించబడుతుంది. తీవ్ర మూత్రపిండ వైఫల్యంలో మోతాదు తగ్గించకపోతే తీవ్ర మగత మరియు మూర్ఛలు సంభవించవచ్చు.",
      suggestedAction: "రోగి eGFR స్థాయికి అనుగుణంగా Gabapentin మోతాదును రోజుకు 300 mg లేదా తక్కువకు తగ్గించండి."
    },
    hi: {
      title: "गंभीर रीनल फेलियर में Gabapentin खुराक समायोजन आवश्यक",
      whyFlagged: "Gabapentin पूरी तरह से गुर्दे द्वारा निकाला जाता है। कम eGFR पर यह शरीर में जमा होकर गंभीर न्यूरोटॉक्सिसिटी और कोमा का कारण बन सकता है।",
      suggestedAction: "eGFR के आधार पर Gabapentin की खुराक को 300 mg/दिन या वैकल्पिक दिनों में कम करें।"
    }
  },
  "RULE-REN-004": {
    te: {
      title: "మూత్రపిండ క్షీణతలో Spironolactone హెచ్చరిక",
      whyFlagged: "తగ్గిన eGFR ఉన్న రోగులలో Spironolactone తీవ్రమైన మరియు ప్రాణాంతక హైపర్‌కలేమియాకు దారితీస్తుంది.",
      suggestedAction: "eGFR < 30 mL/min ఉన్నప్పుడు ఈ మందును నివారించండి లేదా అత్యంత జాగ్రత్తతో పొటాషియం స్థాయిలను పర్యవేక్షించండి."
    },
    hi: {
      title: "गुर्दे की दुर्बलता में Spironolactone चेतावनी",
      whyFlagged: "कमजोर गुर्दे वाले रोगियों में Spironolactone से जानलेवा हाइपरकेलेमिया का उच्च जोखिम होता है।",
      suggestedAction: "यदि eGFR < 30 mL/min है तो बंद करें। पोटेशियम स्तर की लगातार निगरानी करें।"
    }
  },
  "RULE-REN-005": {
    te: {
      title: "తీవ్రమైన మూత్రపిండ వైఫల్యంలో Ibuprofen నిషిద్ధం",
      whyFlagged: "eGFR < 30 mL/min ఉన్నప్పుడు NSAID మందులు మూత్రపిండాల రక్త ప్రసరణను నిరోధించి తీవ్ర శాశ్వత మూత్రపిండ వైఫల్యానికి దారితీస్తాయి.",
      suggestedAction: "NSAID మందులను ఆపండి. సురక్షితమైన ప్రత్యామ్నాయ నొప్పి నివారిణులను ఉపయోగించండి."
    },
    hi: {
      title: "गंभीर रीनल फेलियर में Ibuprofen निषिद्ध",
      whyFlagged: "eGFR < 30 mL/min पर NSAID का उपयोग गुर्दे के रक्त प्रवाह को बाधित करके तीव्र गुर्दे की विफलता को तेज करता है।",
      suggestedAction: "Ibuprofen तुरंत बंद करें और गैर-नेफ्रोटॉक्सिक दर्द प्रबंधन अपनाएं।"
    }
  },
  "RULE-REN-006": {
    te: {
      title: "తీవ్ర మూత్రపిండ క్షీణతలో Ciprofloxacin మోతాదు సర్దుబాటు",
      whyFlagged: "తగ్గిన మూత్రపిండ పనితీరులో Ciprofloxacin మోతాదు తగ్గించకపోతే కేంద్ర నాడీ వ్యవస్థ విషపూరితం మరియు మూర్ఛలు సంభవించవచ్చు.",
      suggestedAction: "eGFR < 30 mL/min ఉన్నప్పుడు Ciprofloxacin మోతాదును 50% తగ్గించండి."
    },
    hi: {
      title: "गंभीर गुर्दे की दुर्बलता में Ciprofloxacin खुराक समायोजन",
      whyFlagged: "गुर्दे की दुर्बलता में Ciprofloxacin सीएनएस विषाक्तता और दौरे के जोखिम को बढ़ाता है।",
      suggestedAction: "eGFR < 30 mL/min पर खुराक को 50% तक कम करें।"
    }
  },
  "RULE-REN-007": {
    te: {
      title: "మూత్రపిండ క్షీణతలో Methotrexate విషపూరిత హెచ్చరిక",
      whyFlagged: "మూత్రపిండాల ద్వారా Methotrexate తొలగింపు మందగించడం వల్ల ఎముక మజ్జ మరియు ఊపిరితిత్తుల నష్టం జరుగుతుంది.",
      suggestedAction: "eGFR < 30 mL/min ఉన్నప్పుడు Methotrexate ను వాడకండి."
    },
    hi: {
      title: "गुर्दे की दुर्बलता में Methotrexate विषाक्तता चेतावनी",
      whyFlagged: "कमजोर गुर्दे से Methotrexate की निकासी गंभीर रूप से बाधित होती है, जिससे घातक मायलोस्पप्रेशन हो सकता है।",
      suggestedAction: "eGFR < 30 mL/min पर Methotrexate का उपयोग न करें।"
    }
  },

  // 4. Clinical Condition & Pregnancy Contraindications (CTX)
  "RULE-CTX-001": {
    te: {
      title: "గర్భధారణ సమయంలో ACE ఇన్‌హిబిటర్ నిషిద్ధం: Lisinopril",
      whyFlagged: "గర్భధారణలో Lisinopril (ACE ఇన్‌హిబిటర్) వాడకం పిండం మూత్రపిండ వైఫల్యం, పుర్రె వైకల్యాలు మరియు గర్భస్రావానికి దారితీస్తుంది.",
      suggestedAction: "Lisinopril ను తక్షణమే నిలిపివేయండి. గర్భధారణలో సురక్షితమైన Labetalol, Nifedipine లేదా Methyldopa కు మారండి."
    },
    hi: {
      title: "गर्भावस्था में ACE Inhibitor निषिद्ध: Lisinopril",
      whyFlagged: "गर्भावस्था में Lisinopril का उपयोग भ्रूण के गुर्दे की विफलता, खोपड़ी विकृति और भ्रूण मृत्यु का कारण बनता है।",
      suggestedAction: "Lisinopril को तुरंत बंद करें और गर्भावस्था में सुरक्षित एंटीहाइपरटेंसिव (जैसे Labetalol या Methyldopa) पर स्विच करें।"
    }
  },
  "RULE-CTX-002": {
    te: {
      title: "గర్భధారణ సమయంలో ARB నిషిద్ధం: Losartan",
      whyFlagged: "Losartan పిండం పెరుగుదల లోపాలు మరియు అమ్నియోటిక్ ద్రవం క్షీణతకు కారణమవుతుంది.",
      suggestedAction: "Losartan ను వెంటనే నిలిపివేసి గర్భధారణకు అనుకూలమైన రక్తపోటు మందును ఎంచుకోండి."
    },
    hi: {
      title: "गर्भावस्था में ARB निषिद्ध: Losartan",
      whyFlagged: "गर्भावस्था के दौरान Losartan भ्रूण की विषाक्तता और विकास संबंधी असामान्यताओं का कारण बनता है।",
      suggestedAction: "Losartan को तुरंत बंद करें और सुरक्षित वैकल्पिक दवा शुरू करें।"
    }
  },
  "RULE-CTX-003": {
    te: {
      title: "గర్భధారణ సమయంలో స్టాటిన్ నిషిద్ధం: Atorvastatin",
      whyFlagged: "స్టాటిన్ మందులు పిండం కొలెస్ట్రాల్ సంశ్లేషణను నిరోధించి పుట్టుకతో వచ్చే అవయవ లోపాలకు కారణం కావచ్చు.",
      suggestedAction: "గర్భధారణ మరియు పాలిచ్చే సమయంలో Atorvastatin ను వెంటనే నిలిపివేయండి."
    },
    hi: {
      title: "गर्भावस्था में स्टैटिन निषिद्ध: Atorvastatin",
      whyFlagged: "कोलेस्ट्रॉल संश्लेषण भ्रूण के विकास के लिए आवश्यक है; स्टैटिन जन्मजात विसंगतियों का कारण बन सकते हैं।",
      suggestedAction: "गर्भावस्था और स्तनपान के दौरान Atorvastatin को तुरंत बंद करें।"
    }
  },
  "RULE-CTX-004": {
    te: {
      title: "ఆస్తమా రోగులలో నాన్-సెలెక్టివ్ బెటా-బ్లాకర్ నిషిద్ధం: Propranolol",
      whyFlagged: "Propranolol ఊపిరితిత్తుల బ్రోంకియల్ బీటా-2 రిసెప్టర్లను అడ్డుకోవడం వల్ల తీవ్రమైన శ్వాసకోశ బ్రోంకోస్పాసమ్ మరియు ఆస్తమా అటాక్ సంభవిస్తుంది.",
      suggestedAction: "Propranolol ను నిలిపివేయండి. అవసరమైతే కార్డియోసెలెక్టివ్ బెటా-బ్లాకర్ (Metoprolol) లేదా ప్రత్యామ్నాయ మందును వాడండి."
    },
    hi: {
      title: "अस्थमा में गैर-चयनात्मक बीटा-ब्लॉकर निषिद्ध: Propranolol",
      whyFlagged: "Propranolol ब्रोन्कियल बीटा-2 रिसेप्टर्स को ब्लॉक करता है, जिससे जानलेवा ब्रोन्कोस्पास्म और गंभीर अस्थमा का दौरा पड़ सकता है।",
      suggestedAction: "Propranolol बंद करें। यदि बीटा-ब्लॉकर आवश्यक है, तो कार्डियोसेलेक्टिव एजेंट पर विचार करें।"
    }
  },
  "RULE-CTX-005": {
    te: {
      title: "అల్సర్ లేదా జీర్ణకోశ రక్తస్రావంలో NSAID నిషిద్ధం: Ibuprofen",
      whyFlagged: "జీర్ణకోశ పుండ్లు (PUD) ఉన్న రోగులలో Ibuprofen రక్తస్రావాన్ని మరియు అల్సర్ పగిలిపోవడాన్ని వేగవంతం చేస్తుంది.",
      suggestedAction: "Ibuprofen ను తక్షణమే నిలిపివేయండి. నొప్పి నివారణకు Acetaminophen లేదా ఇతర పద్ధతులను పాటించండి."
    },
    hi: {
      title: "पेप्टिक अल्सर या जीआई ब्लीड में NSAID निषिद्ध: Ibuprofen",
      whyFlagged: "Ibuprofen गैस्ट्रिक म्यूकोसा को नुकसान पहुंचाता है और सक्रिय अल्सर वाले रोगियों में घातक जीआई रक्तस్రాव का कारण बन सकता है।",
      suggestedAction: "Ibuprofen को तुरंत बंद करें और गैर-अल्स्रोजेनिक दर्द निवारक का उपयोग करें।"
    }
  },
  "RULE-CTX-006": {
    te: {
      title: "గర్భధారణ సమయంలో Methotrexate నిషిద్ధం",
      whyFlagged: "Methotrexate తీవ్రమైన టెరాటోజెనిక్ మరియు గర్భస్రావ కారకం. ఇది పిండం మరణానికి లేదా తీవ్ర శారీరక వైకల్యాలకు కారణమవుతుంది.",
      suggestedAction: "Methotrexate ను వెంటనే నిలిపివేయండి మరియు గైనకాలజిస్ట్‌ను సంప్రదించండి."
    },
    hi: {
      title: "गर्भावस्था में Methotrexate अत्यंत निषिद्ध",
      whyFlagged: "Methotrexate एक शक्तिशाली टेराटोजेन और गर्भपात एजेंट है जो भ्रूण की मृत्यु या गंभीर विकृति का कारण बनता है।",
      suggestedAction: "Methotrexate को तुरंत बंद करें और तत्काल प्रसूति विशेषज्ञ से परामर्श लें।"
    }
  },
  "RULE-CTX-007": {
    te: {
      title: "గర్భధారణ సమయంలో Warfarin నిషిద్ధం",
      whyFlagged: "గర్భధారణలో Warfarin వాడకం వల్ల పిండం వార్ఫరిన్ సిండ్రోమ్ (Fetal Warfarin Syndrome), ఎముకల లోపాలు మరియు కేంద్ర నాడీ వ్యవస్థ రక్తస్రావం జరుగుతుంది.",
      suggestedAction: "Warfarin నిలిపివేసి గర్భధారణలో సురక్షితమైన Low Molecular Weight Heparin (LMWH) కు మారండి."
    },
    hi: {
      title: "गर्भावस्था में Warfarin निषिद्ध",
      whyFlagged: "Warfarin प्लेसेंटा को पार करता है और भ्रूण में गंभीर विकृति और घातक रक्तस्राव का कारण बन सकता है।",
      suggestedAction: "Warfarin को तुरंत बंद करें और चिकित्सक की निगरानी में LMWH (हेपरिन) पर स्विच करें।"
    }
  },

  // 5. Uncertain Drug Identity / Phonetic Misspelling
  "ALERT-HUMAN-CONFIRM-REQ": {
    te: {
      title: "అనిశ్చిత ఔషధ గుర్తింపు హెచ్చరిక",
      whyFlagged: "నమోదు చేసిన మందు పేరు ప్రామాణిక ఔషధ కేటలాగ్‌తో స్పష్టంగా సరిపోలలేదు. రోగి భద్రత దృష్ట్యా ఆటోమేటెడ్ మ్యాపింగ్ చేయకుండా వైద్య నిపుణుడి నిర్ధారణ అవసరం.",
      suggestedAction: "ఈ మందును ఆటోమేటెడ్ తనిఖీలకు పంపే ముందు అసలైన ప్రిస్క్రిప్షన్ చూసి ఖచ్చితమైన మందు పేరును నిర్ధారించండి."
    },
    hi: {
      title: "अनिश्चित दवा पहचान चेतावनी",
      whyFlagged: "दर्ज की गई दवा का नाम संदर्भ कैटलॉग के साथ पूर्ण निश्चितता से मेल नहीं खाता है। रोगी सुरक्षा के लिए डॉक्टर की पुष्टि आवश्यक है।",
      suggestedAction: "स्वचालित सुरक्षा जांच पर निर्भर होने से पहले मूल पर्चे से सही दवा की पुष्टि करें।"
    }
  }
};

/**
 * Localizes an alert object based on the selected language while safeguarding
 * medicine names, dosage values, rule IDs, and numerical laboratory measurements.
 */
export function translateAlert(alert, language = 'en') {
  if (!alert) return alert;
  if (language === 'en' || (language !== 'te' && language !== 'hi')) {
    return alert;
  }

  const ruleKey = alert.matchedRule || alert.ruleCode;
  const translationEntry = RULE_EXPLANATION_TRANSLATIONS[ruleKey] || 
                           RULE_EXPLANATION_TRANSLATIONS[alert.ruleCode] || 
                           RULE_EXPLANATION_TRANSLATIONS[alert.matchedRule];

  const categoryMap = CLINICAL_CATEGORY_TRANSLATIONS[language] || CLINICAL_CATEGORY_TRANSLATIONS.en;
  const severityMap = SEVERITY_TRANSLATIONS[language] || SEVERITY_TRANSLATIONS.en;

  const localizedCategory = categoryMap[alert.category] || alert.category;
  const localizedSeverity = severityMap[alert.severity] || alert.severity;

  if (translationEntry && translationEntry[language]) {
    const langData = translationEntry[language];
    return {
      ...alert,
      title: langData.title || alert.title,
      whyFlagged: langData.whyFlagged || alert.whyFlagged,
      suggestedAction: langData.suggestedAction || alert.suggestedAction,
      categoryLocalized: localizedCategory,
      severityLocalized: localizedSeverity
    };
  }

  // Fallback: return alert with translated category and severity, preserving English explanation safely
  return {
    ...alert,
    categoryLocalized: localizedCategory,
    severityLocalized: localizedSeverity
  };
}

