import { SyllabusUnit, Topic } from '../../types';

// Helper functions (kept internal to this module)
const createTopicsForUnit = (unitTitle: string, topicNames: string[]): Topic[] => {
    return topicNames.map(name => ({ name, unit: unitTitle }));
};

const parseTopicsWithDash = (text: string): string[] => {
    const lines = text.trim().split('\n');
    
    let contentStartIndex = lines.findIndex(line => 
        !line.trim().startsWith('Unit ') && 
        !line.trim().startsWith('Paper ') && 
        !line.trim().endsWith(')') &&
        line.trim().length > 0
    );

    if (contentStartIndex === -1) {
        contentStartIndex = lines.length > 1 ? 1 : 0;
    }

    let content = lines.slice(contentStartIndex).join(' '); 

    if (content.includes('Emergence of leaders –')) {
        content = content.replace('Emergence of leaders –', 'Emergence of leaders;');
        const leadersSegment = content.match(/B\.R\.Ambedkar,.*?, and others/);
        if (leadersSegment) {
            const individualLeaders = leadersSegment[0].replace(', and others', '').split(',').map(s => s.trim()).join('; ');
            content = content.replace(leadersSegment[0], individualLeaders);
        }
    }

    const delimiters = /\s*;\s*|\s+[-–]\s+|\s*,\s*/;
    
    return content
        .split(delimiters)
        .map(line => {
            let cleanedLine = line.trim();
            cleanedLine = cleanedLine.replace(/\[.*?\]\(.*?\)/g, '').trim();
            if (cleanedLine.toLowerCase().startsWith('and ')) {
                cleanedLine = cleanedLine.substring(4);
            }
            return cleanedLine ? cleanedLine.charAt(0).toUpperCase() + cleanedLine.slice(1) : '';
        })
        .filter(line => 
            line.length > 1 && 
            !line.toLowerCase().includes('a.d.') && 
            line.toLowerCase() !== 'others'
        );
};

const parseLiteraryTopics = (text: string): string[] => {
    const content = text.trim().split('\n').slice(1).join(' '); 
    const allTopicsText = content.replace(/Poems:/g, '').replace(/Prose:/g, '');
    return allTopicsText
        .split(';')
        .map(topic => topic.replace(/–/g, '-').trim())
        .filter(Boolean);
};

// Raw syllabus text
const syllabusText = {
  // ... [All raw syllabus text strings from old syllabus.ts file] ...
  generalStudies1: `
Unit I: General Science
Scientific knowledge and scientific temper - Power of reasoning - Rote learning vs conceptual learning - Science as a tool to understand the past present and future and Nature of universe - General scientific laws – Mechanics - Properties of matter - force - motion - and energy - Everyday application of the basic principles of mechanics - electricity and magnetism - light - sound - heat, nuclear physics - laser - electronics, and communications - Elements and compounds - acids, bases, salts, petroleum products, fertilizers,pesticides - Main concepts of life science, classification of living organisms, evolution, genetics, physiology, nutrition, health and hygiene, human diseases; Environment and ecology; Latest invention in science and technology; Current affairs.
`,
  generalStudies2: `
Unit II: Geography of India
Location - Physical features - Monsoon, rainfall, weather and climate - Water resources - Rivers in India - Soil, Minerals and Natural Resources - Forest and Wildlife - Agricultural pattern; Transport –Communication; Social Geography – Population density and distribution - Racial, linguistic groups and major tribes; Natural calamity - Disaster management; Environmental pollution - Reasons and preventive measures - Climate change - Green energy; Geographical landmarks; Current affairs.
`,
  generalStudies3: `
Unit III: History, Culture of India, and Indian National Movement
Indus Valley Civilization - Guptas - Delhi Sultans - Mughals - Marathas - Age of Vijayanagaram and
Bahmani Kingdoms - South Indian History; National Renaissance - Early uprising against British rule -
Indian National Congress - Emergence of leaders – B.R.Ambedkar, Bhagat Singh, Bharathiar,
V.O.Chidambaranar, Jawaharlal Nehru, Kamarajar, Mahatma Gandhi, Maulana Abul Kalam Azad,
Thanthai Periyar, Rajaji, Subash Chandra Bose, Rabindranath Tagore, and others; Different modes of
agitation: Growth of Satyagraha and Militant Movements; Communalism and Partition; Change and
continuity in the socio-cultural history of India; Characteristics of Indian Culture; Unity in Diversity covering Race Language Custom as well as India as a secular state promoting social harmony and Prominent personalities in Arts Science Literature and Philosophy.
`,
  generalStudies4: `
Unit IV: Indian Polity
History of the Indian Constitution - Making of the Indian Constitution - Constitution of India - Preamble to the Constitution - Salient features of the Constitution - Union, State and Union Territory - Citizenship, Fundamental Rights, Fundamental Duties, Directive Principles of State Policy - Union Executive, Union Legislature - State Executive, State Legislature - Local Governments, Panchayat Raj - Spirit of federalism: Centre - State relationships - Election - Judiciary in India – Rule of Law - Corruption in public life – Anti-corruption measures - Lokpal and Lok Ayukta - Right to Information - Empowerment of Women - Consumer Protection Forums, Human Rights Charter; Political parties and political system in India; Current affairs.
`,
  generalStudies5: `
Unit V: Indian Economy and Development Administration in Tamil Nadu
Nature of Indian Economy – Five-year plan models (an assessment) - Planning Commission and Niti
Aayog; Sources of revenue - Reserve Bank of India - Fiscal Policy and Monetary Policy - Finance
Commission - Resource sharing between Union and State Governments - Goods and Services Tax;
Structure of Indian Economy and Employment Generation, Land Reforms and Agriculture - Application of Science and Technology in Agriculture - Industrial growth - Rural welfare oriented programmes - Social problems - Population, Education, Health, Employment, Poverty; Human Development Indicators in Tamil Nadu and a comparative assessment across the Country – Impact of social reform movements in the socio-economic development of Tamil Nadu - Political parties, and welfare schemes for various sections of people - Rationale behind the reservation policy, and access to the social resources - Economic trends in Tamil Nadu - Role and impact of social welfare schemes in the socio-economic development of Tamil Nadu - Social Justice and social harmony as the cornerstones of socio-economic development; Education and health systems in Tamil Nadu; Geography of Tamil Nadu and its impact on economic growth; Achievements of Tamil Nadu in various fields; e-Governance in Tamil Nadu; Public awareness and General administration - Welfare oriented Government schemes and their utility, Problems in public delivery systems; Current socio-economic issues; Current affairs.
`,
  generalStudies6: `
Unit VI: History, Culture, Heritage, and Socio-Political Movements in Tamil Nadu
History of Tamil Society, related archaeological discoveries, Tamil literature from Sangam age till
contemporary times - Thirukkural - Significance as a secular literature - Relevance to everyday life,
Impact of Thirukkural on humanity, Thirukkural and universal values - Relevance to Socio-politico
economic affairs, Philosophical content in Thirukkural; Role of Tamil Nadu in freedom struggle - Early
agitations against British Rule - Role of women in freedom struggle; Evolution of 19th and 20th century socio-political movements in Tamil Nadu - Justice Party, Growth of Rationalism - Self Respect Movement, Dravidian Movement, and principles underlying both these movements; Contributions of Thanthai Periyar and Perarignar Anna.
`,
  aptitude: `
Unit I: Aptitude
Simplification - Percentage - Highest Common Factor (HCF) - Lowest Common Multiple (LCM) - Ratio and Proportion - Simple interest - Compound interest - Area - Volume - Time and Work.
`,
  reasoning: `
Unit II: Reasoning
Logical reasoning - Puzzles - Dice - Visual reasoning - Alpha numeric reasoning - Number series.
`,
  englishGrammar: `
Unit I: Grammar
Noun - Pronoun - Verb - Adjective - Adverb - Preposition - Conjunction - Interjection - Concord - Tense + Active voice and passive voice - Types of sentences - Statement -Interrogative Imperative, Exclamatory, Transformation of statements into imperatives, Interrogatives into statements, Assertives into negatives - Exclamatory sentences into Statement, Imperatives into Inquisitive Interrogatives, Imperatives into Appreciative Statements, Verbs, Main Verbs and Auxiliary Verbs , Regular and Irregular Verbs, Infinitives, Gerunds, Participles, Question tags, Sentence patterns, Types of sentences, Simple, Compound and Complex, Phrases and clauses, Degrees of comparison, Positive, Comparative and Superlative, Direct into Indirect and Indirect to Direct, Synthesis of sentences, Punctuations.
`,
  englishVocab: `
Unit II: Vocabulary
Synonyms - Antonyms - Homonyms - Homophones - Collocations - Idioms & Phrases - Phrasal verbs - Spelling of words - Correct usage of words - One word substitution - Word creation, Singular and plural (including Zero plural) - Derivatives - Abbreviations - British and American English - Compound words and Figures of speech.
`,
  englishWriting: `
Unit III: Writing Skills
Letter writing (formal and informal) – Types of Letters (Multiple Choice Question), Jumbled sentences, Finding out the right order of sentences, Making queries (Multiple Choice Question), Inferences, Blanks, Substitutions.
`,
  englishTech: `
Unit IV: Technical Terms
Administrative Terms - Department related - General and Official terms - Official Correspondence (only basics).
`,
  englishReading: `
Unit V: Reading Comprehension
Unseen passages (News Paper, Headlines, Editorials, Government related News), Question Types -
Strong question, Weak question, Match the following, Sentence Completion, Ascertainment of facts
(Multiple Choice Question) - Choose the best response.
`,
  englishTranslation: `
Unit VI: Translation
Word Translation - Sentence Translation - Tense related translation tasks - Tense / Voice related tasks.
`,
  englishLit: `
Unit VII: Literary Works
Figures of Speech; Appreciation and Analysis of Poetry; Lines of Significance
Poems: I Dream of Spices – Raj Arumugam; The Crocodile – Lewis Carroll; Teamwork – Edger Albert
Guest; From a Railway Carriage – Robert Louis Balfour Stevenson; A Tragic Story – William Makepeace
Thackeray; Sea Fever – John Masefield; Courage – Edger Albert Guest; The Age of Chivalry – George
Krokos; Wandering Singers – Sarojini Naidu; The Listeners – Walter de la mere; Your Space – David
Bates; Special Hero – Christine M. Kerschan; Stopping by Woods on a Snowy Evening – Robert Frost;
Leisure – William Henry Davies; A Poison Tree – William Blake; The Power of a Smile – Tupac Shakur;
On Killing a Tree – Gieve Patel; Advice from a Tree – Ilan Shamir; The Spider and The Fly – Mary Howitt;
Never Trust a Mirror – Erin Hanson; The River – Ilan Shamir; Nature the Gentlest Mother – Emily
Dickinson; The Comet – Norman Littleford; The Star – Jane Taylor; The Stick-Together Families – Edgar
Albert Guest; Memories of My Dad – Rebecca D. cook; Life – Henry Van Dyke; The Grumble Family -
L.M. Montgomery; The Secret of the Machines – Rudyard Kipling; The House on Elm Street – Naida
Bush.
Prose: His First Flight – Liam O’ Flaherty; The Night the Ghost Got In – James Grover Thurber;
Empowered Women Navigating the World; The Attic – Satyajit Ray; Tech Bloomers; The Last Lesson –
Alphonse Daudet; The Dying Detective - Arthur Canon Doyle; Learning The Game - Sachin Ramesh
Tendulkar; I Can’t Climb Trees Anymore – Ruskin Bond; Old Man River – Dorothy Deming (Drama);
Seventeen Oranges – Bill Naughton; Water – The Elixir of Life – Sir C.V. Raman; From Zero to Infinity –
Biography of Srinivasa Ramanujan; A Birthday Letter – Jawaharlal Nehru; The Nose Jewel –
C.Rajagopalachari; Hobby – Turns A Successful Career; Sir Isaac Newton – The Ingenious Scientist –
Nathaniel Hawthorne; My Reminiscence – Rabindranath Tagore; Sea Turtles – Sheker Dattatri; When
the Trees Walked – Ruskin Bond; A Visitor from Distant Lands; Sports Stars – Mithali Dorai Raj; The Last
Stone Carver – Sigrun Srivastav; Eidgah – Munshi Premchand; The Wind on Haunted Hill – Ruskin Bond;
A Prayer to the Teacher – Subroto Bagchi; The Tempest – Tales From Shakespeare; A Hunter Turned
Naturalist – Jim Corbett; The Cat and the Painkiller (An Extract from the Adventures of Tom Sawyer) –
Mark Twain
`,
  // Mains
  mainsPaper2Unit1: `
Paper II - General Studies I
Unit I: Modern History of India and Indian Culture (100 marks)
Advent of Europeans – Colonialism and imperialism – Establishment of British Rule (expansion and consolidation) – Early uprising against British Rule – South Indian rebellion 1799 to 1801 A.D. – Vellore rebellion 1806 A.D. – Sepoy mutiny of 1857 A.D. –   Indian National Movements – The role of Moderation Extremism and Terrorism within the Movements of Indian Patriotism – Significant Indian National Leaders – Rabindranath Tagore, Maulana Abulkalam Azad, Mohandas Karamchand Gandhi, Jawaharlal Nehru, Subhas Chandra Bose, B.R.Ambedkar and Vallabhai Patel – Constitutional developments in India from 1773 to 1950 – Second World War and final phase of independence struggle – Partition of India – Role of Tamil Nadu in freedom struggle – Subramanya Siva – Subramania Bharathiyar, V.O.Chidambaranar, C.Rajagopalachariyar, Thanthai Periyar, Kamarajar and  others; Impact of British rule on socio-economic affairs – National Renaissance Movement – Socio-religious reform movements – Social reform and educational reform acts; Emergence of “Social Justice” Ideology in Tamil Nadu – Origin, Growth, Decay and achievements of Justice Party – Socio-political movements and its achievements after Justice Party; India since Independence – Salient features of Indian culture – Unity in diversity – Race, Language, Custom; India, a Secular State; Organizations for Fine Arts, Dance, Drama and Music; Cultural Panorama – National Symbols – Eminent personalities in cultural field – Latest historical research developments in Tamil Nadu.
`,
  mainsPaper2Unit2: `
Unit II: Social Issues in India and Tamil Nadu (100 marks)
Population Explosion – Fertility, Mortality – Population Control Programmes – Migration - Poverty – Illiteracy – Dropouts – Right to Education – Women Education – Skill based education and programmes – E-Learning; Child labour and Child abuse - Child Education – Child school dropouts – Child abuse -Laws to protect Child abuse – Child protection and welfare schemes; Sanitation: Rural and Urban Sanitation –Role of Panchayat Raj and Urban development agencies in sanitation schemes and programmes; Women Empowerment: Social justice to women – Schemes and programmes - Domestic violence – Dowry menace – Sexual assault – Laws and awareness programmes - Prevention of violence against women – Role of Government and NGOs in women empowerment – Schemes and Programmes; Social Changes: Urbanization – Policy, Planning and Programmes in India and Tamil Nadu – Comparative study on social and economic indicators – Impact of violence on society – Religious violence – Terrorism and Communal violence – Causes – Steps to control and awareness; Problems of minorities; Human rights issues; Regional disparities in India – Causes and remedies; Social development: Approaches – Models – Policies and programmes – Linkage  between education and social development - Community development programmes – Self-employment and entrepreneurship development – Role of NGOs in a social development; Education - Health and human development – Health care problems in India – Children, Adolescents, Women and Aged - Health Policy in India – Schemes – Health Care Programmes in India; Vulnerable sections of the population: Problems – laws and punishments – Various welfare programmes to vulnerable sections by State, Central Government and NGOs; Current Affairs.
`,
  mainsPaper2Unit3: `
Unit III: Ethics and Integrity (50 marks)
Ethics and Human Interface: Definition and scope of ethics – Ethics of Indian Schools of Philosophy - Ethics of Thirukkural; Kinds of ethics: Intuitionism – Existentialism – Duties and responsibility – Moral judgements – Moral Absolutism – Moral Obligation; Attitude: Its influence and relation with thought and behaviour – Moral and political attitudes; Ethics in public administration: Philosophical basis of governance and probity in Governance – Codes of ethics and conduct: Primary responsibilities of public service professionals – Transparency of information sharing and service delivery – Professional and non professional interaction – Potentially beneficial interaction – Maintenance of confidentiality of records – Disclosure of Information – Boundaries of competence – Consultation on ethical obligation – Ethics and Non-discrimination – Citizen’s Charters - Challenges of corruption - Ethics of public polity determination.
`,
  mainsPaper3Unit1: `
Paper III – General Studies II
Unit I: Indian Polity and Emerging Political Trends across the World affecting India (100 marks)
Constitution of India - Historical background - Making of the Indian Constitution - Preamble - Salient features of Indian Constitution - Parts, Articles and Schedules – Amendments; Citizenship; Fundamental
Rights and Fundamental Duties; Directive Principles of State Policy; Structure, Power and Functions of Governments: Union Government - Legislature: Parliament – Lok Sabha and Rajya Sabha; Executive: President, Vice-President - Prime Minister and Council of Ministers – Constitutional Authorities; Judiciary: Supreme Court - Judicial Review - Judicial activism - Latest Verdicts; State Government - Legislature: State Legislative Assembly - State Legislative Council; Executive: Governor - Chief Minister - Council of Ministers; Judiciary: High Court - District Courts - Subordinate Courts – Tribunals; Local Government:
Rural and Urban Local Governments - Historical background - 73rd and 74th Constitutional Amendment Acts; Union Territories: Evolution – Administration; Federalism: Indian Federal System – Differentiating from other forms of federalism; Union - State Relations: Legislative, Administrative and Financial relations; Indian Administration: Civil Services in India - Historical background - Classification of Civil
Services - Central and State Services –Recruitment and Training; Political Parties: National and Regional - Pressure groups - Public opinion - Mass Media - Social Media - Non - Governmental Organizations
(NGOs); Administrative Reforms: Central Vigilance Commission - Anti-Corruption measures – Lokadalat – Lokayukta – Lokpal – Ombudsman in India - RTI Act - Citizen's Grievances and Administrative Reform
Commission - Administrative Tribunals; Profile of Indian States: Demography - State Language - Developmental Programmes - e-governance; India and World: India's foreign policy - India's relationship
with world countries - Defence and National Security – Nuclear Policy – Terrorism - Human Rights and Environmental issues - International Organisations – Pacts and Summits; Current Affairs.
`,
  mainsPaper3Unit2: `
Unit II: Role and Impact of Science and Technology in the Development of India (100 marks)
Science and Technology – Role, Achievements and Developments - their applications and impacts; Elements and Compounds, Acids, Bases and Salts – Oxidation and reduction - Carbon, Nitrogen and their compounds – Chemistry of Ores and Metals – Fertilizers, Pesticides, Insecticides – Polymer and Plastics - Corrosion – Chemistry in everyday life; Energy – Renewable and Non-Renewable – Self sufficiency – Oils and Minerals exploration; Space Research - Nano Science and Technology – Application of Nano-materials; Advancements in the fields of Information Technology - Robotics and
Automation - Artificial Intelligence – Mobile Communication; Computer System Architecture, Operating System, Computer Networks, Cryptography and Network security, Relational Database Management System, Software Engineering, Image Processing, Machine Learning; Cropping pattern in India – Organic farming – Agriculture Biotechnology – Commercially available Genetically Modified Crops – Eco, Social impact of Genetically Modified Crops – Intellectual Property Rights, Bio Safety; Floriculture, Olericulture, Pomology and Medicinal Plants, Conventional and Modern Propagation Technique, Glass House – Hydroponics – Bonsai – Garden features and operations – methods to preserve fruits and vegetables; Genetic Engineering and its importance in Agriculture - Integrated farming – Vermiculture; Main concepts
of Life Science – the cell – the basic unit of life – classification of living organism – Nutrition and Dietetics – Respiration – Blood and blood circulation – Endocrine system – Excretion of metabolic wastes –
Reproductive system – Animals and human-bio communication - Pheromones and allelochemicals – Genetics – Science of heredity – Health and hygiene – Human diseases – Communicable and non communicable diseases – Preventions and remedies – Alcoholism and drug abuse – Genetic engineering – Organ transplantation – Stem Cell Technology – Forensic science – Sewage treatment; Government
policy – Organisations in Science and Technology – Role and Functions – Defence Research and Development Organisation (DRDO) – Ocean Research and Development – Medical Tourism -
Achievements of Indians in the fields of Science and Technology - Latest inventions in Science and Technology; Current Affairs.
`,
  mainsPaper3Unit3: `
Unit III: Tamil Society – Culture and Heritage (50 marks)
Origin and Development of Tamilian – Palmleaf Manuscript – Document – Archaeological excavation in Tamil Nadu – Adhichanallur, Arikkamedu, Keeladi, Konthakai, Manalur, Sivakalai; Arts, Science and Culture: Literature, Music, Drama and other arts – Science – Culture (Internal and External); Tamil Society and the condition of business – Sangam age – Medieval age – Modern age; Growth of Rationalist – Origin and Development of Dravidian Movements in Tamil Nadu – Their contribution in Socio and economic development; Socio and cultural life of the modern Tamilian: Caste, Religion, Women, Polity, Education,
Economics, Commerce and Relationship with other countries – Tamil Diaspora; Development of modern Tamils: Print – Edition – Translation – Film Industries – Computer and Media.
`,
  mainsPaper4Unit1: `
Paper IV – General Studies III (Degree Standard – 250 Marks)
Unit I: General Geography and Geography of India with Special Reference to Tamil Nadu (75 marks)
Earth and Universe: Solar System – Atmosphere, Lithosphere, Hydrosphere and Biosphere; India and Tamil Nadu: Location - Physical Divisions - Drainage - Weather and Climate: Monsoon, Rainfall - Natural
Resources: Soil, Natural Vegetation, Wildlife – Irrigation and Multipurpose Projects - Mineral Resources - Energy Resources – Agriculture: Crops, Livestock, Fisheries, Agricultural Revolutions – Industries -
Population: Growth, Distribution and Density – Migration - Races, Tribes, Linguistics and Religions – Trade – Geo Politics: Border Disputes; Ocean and Sea: Bottom relief features of Indian Ocean, Arabian
Sea and Bay of Bengal; Geospatial Technology: Remote Sensing, Geographical Information System (GIS) and Global Navigation Satellite System (GNSS); Map: Locating features and Places; Current Affairs.
`,
  mainsPaper4Unit2: `
Unit II: Environment, Biodiversity and Disaster Management (75 marks)
Ecology: Structure and function of ecosystem – Ecological succession – Ecosystem services - Biodiversity conservation - Biodiversity Types – Biodiversity Hot Spots in India; Biodiversity : Significance and Threats – In-situ and Ex-situ conservation measures – Roles of Convention on International Trade in Endangered Species of Wild Fauna and Flora (CITES), International Union for Conservation of Nature
(IUCN) and Convention on Biological Diversity (CBD) – Biodiversity Act; Environmental Pollution and Management: Air, Water, Soil, Thermal and Noise pollution – Pollution Prevention and control strategies – Solid and hazardous waste management – Environmental Standards and Environmental Monitoring - Environmental Impact Assessment (EIA): Steps in EIA process – Environmental Clearance –
Environmental Auditing; Sustainable Development: Global Environmental Issues and Management – Sustainable Development Goals (SDGs) and Targets – Climate Change – Changes in monsoon pattern
in Tamil Nadu, India and Global scenario - Environmental consequences of climate change and mitigation measures – Clean and Green Energy – Paris Agreement – Nationally Determined Contributions (NDCs);
Environmental Laws, Policies and Treaties in India and Global scenario - Natural calamities, Manmade Disasters - Disaster Management and National Disaster Management Authority - Sendai framework for
Disaster Risk Reduction – Environmental Health and Sanitation; Current Affairs.
`,
  mainsPaper4Unit3: `
Paper IV – General Studies III (Degree Standard – 250 Marks)
Unit III: Indian Economy – Current Economic Trends and Impact of Global Economy on India (100 marks)
Features of Indian Economy – National Income – Capital formation - NEP (New Economic Policy) – NITI Aayog (National Institution for Transforming India); Agriculture – Role of Agriculture – Land Reforms –
New Agricultural Strategy – Green Revolution – Contract Farming – Minimum Support Price - Price Policy, Public Distribution System (PDS), Subsidy, Food Security – Agricultural Marketing, Crop Insurance,
Labour – Rural Credit and Indebtedness – World Trade Organization and Agriculture; Industry - Growth ‐ Policy – Role of Public Sector and Disinvestment – Privatisation and Liberalization – Public Private
Partnership (PPP) – SEZs (Special Economic Zones) – MSMEs (Micro, Small and Medium Enterprises) – Make in India; Infrastructure in India – Transport System – Power – Communication – Social
Infrastructure – Research and Development; Banking and Finance: Banking, Money and Finance – Central Bank – Commercial Bank – Non Banking Financial Institutions – Stock Market – Financial
Reforms – Financial Stability – Monetary Policy – Reserve Bank of India and Autonomy; Public Finance – Sources of Revenue – Tax and Non-Tax Revenue – Canons of Taxation – Goods and Service Tax –
Public Expenditure – Fiscal Policy – Public Debt – Finance Commission – Fiscal Federalism; Issues in Indian Economy – Poverty and Inequality – Poverty alleviation programmes – Mahatma Gandhi National
Rural Employment Guarantee Act – New Welfare Programmes for Rural Poverty – Unemployment – Gender inequality; Inflation - inflation targeting – Deflation – Sustainable Economic Growth; India’s
Foreign Trade – Balance of Payment, Export-Import Policy, Foreign Exchange Market, Foreign Direct Investment; Globalization – Global Economic Crisis - Impact on Indian economy; International Institutions – IMF (International Monetary Fund) - World Bank – BRICS (Brazil, Russia, India, China and South Africa) – SAARC (South Asian Association for Regional co-operation) – ASEAN (Association of South East
Asian Nations). Tamil Nadu Economy and Issues – Gross State Domestic Product – Trends in State’s Economic Growth – Demographic Profile of Tamil Nadu – Agriculture – Contract Farming; Tamil Nadu State Policy on Promotion of Organic Farming – Industry and Entrepreneurship Development in Tamil Nadu – Infrastructure – Power, Transportation systems - Tourism – Health – eco-tourism – Social Infrastructure – Self Help Groups and Rural women empowerment – Rural Poverty and Unemployment – Regional economic disparities – Local Government - Recent Government welfare programmes; Current Affairs.
`
};

// TNPSC Prelims Units
export const gsUnit1: SyllabusUnit = { id: 'gs1', title: 'Unit I: General Science', topics: createTopicsForUnit('Unit I: General Science', parseTopicsWithDash(syllabusText.generalStudies1)) };
export const gsUnit2: SyllabusUnit = { id: 'gs2', title: 'Unit II: Geography of India', topics: createTopicsForUnit('Unit II: Geography of India', parseTopicsWithDash(syllabusText.generalStudies2)) };
export const gsUnit3: SyllabusUnit = { id: 'gs3', title: 'Unit III: History, Culture of India, and Indian National Movement', topics: createTopicsForUnit('Unit III: History, Culture of India, and Indian National Movement', parseTopicsWithDash(syllabusText.generalStudies3)) };
export const gsUnit4: SyllabusUnit = { id: 'gs4', title: 'Unit IV: Indian Polity', topics: createTopicsForUnit('Unit IV: Indian Polity', parseTopicsWithDash(syllabusText.generalStudies4)) };
export const gsUnit5: SyllabusUnit = { id: 'gs5', title: 'Unit V: Indian Economy and Development Administration in Tamil Nadu', topics: createTopicsForUnit('Unit V: Indian Economy and Development Administration in Tamil Nadu', parseTopicsWithDash(syllabusText.generalStudies5)) };
export const gsUnit6: SyllabusUnit = { id: 'gs6', title: 'Unit VI: History, Culture, Heritage, and Socio-Political Movements in Tamil Nadu', topics: createTopicsForUnit('Unit VI: History, Culture, Heritage, and Socio-Political Movements in Tamil Nadu', parseTopicsWithDash(syllabusText.generalStudies6)) };
export const aptitudeUnit: SyllabusUnit = { id: 'aptitude', title: 'Unit I: Aptitude', topics: createTopicsForUnit('Unit I: Aptitude', parseTopicsWithDash(syllabusText.aptitude)) };
export const reasoningUnit: SyllabusUnit = { id: 'reasoning', title: 'Unit II: Reasoning', topics: createTopicsForUnit('Unit II: Reasoning', parseTopicsWithDash(syllabusText.reasoning)) };

export const englishGrammarUnit: SyllabusUnit = { id: 'englishGrammar', title: 'General English - Unit I: Grammar', topics: createTopicsForUnit('General English - Unit I: Grammar', parseTopicsWithDash(syllabusText.englishGrammar)) };
export const englishVocabUnit: SyllabusUnit = { id: 'englishVocab', title: 'General English - Unit II: Vocabulary', topics: createTopicsForUnit('General English - Unit II: Vocabulary', parseTopicsWithDash(syllabusText.englishVocab)) };
export const englishWritingUnit: SyllabusUnit = { id: 'englishWriting', title: 'General English - Unit III: Writing Skills', topics: createTopicsForUnit('General English - Unit III: Writing Skills', parseTopicsWithDash(syllabusText.englishWriting)) };
export const englishTechUnit: SyllabusUnit = { id: 'englishTech', title: 'General English - Unit IV: Technical Terms', topics: createTopicsForUnit('General English - Unit IV: Technical Terms', parseTopicsWithDash(syllabusText.englishTech)) };
export const englishReadingUnit: SyllabusUnit = { id: 'englishReading', title: 'General English - Unit V: Reading Comprehension', topics: createTopicsForUnit('General English - Unit V: Reading Comprehension', parseTopicsWithDash(syllabusText.englishReading)) };
export const englishTranslationUnit: SyllabusUnit = { id: 'englishTranslation', title: 'General English - Unit VI: Translation', topics: createTopicsForUnit('General English - Unit VI: Translation', parseTopicsWithDash(syllabusText.englishTranslation)) };
export const englishLitUnit: SyllabusUnit = { id: 'englishLit', title: 'General English - Unit VII: Literary Works', topics: createTopicsForUnit('General English - Unit VII: Literary Works', parseLiteraryTopics(syllabusText.englishLit)) };


// TNPSC Mains Units
export const mainsPaper2Unit1: SyllabusUnit = { id: 'mains-p2u1', title: 'Mains Paper II - Unit I: Modern History of India and Indian Culture', topics: createTopicsForUnit('Mains Paper II - Unit I: Modern History of India and Indian Culture', parseTopicsWithDash(syllabusText.mainsPaper2Unit1)) };
export const mainsPaper2Unit2: SyllabusUnit = { id: 'mains-p2u2', title: 'Mains Paper II - Unit II: Social Issues in India and Tamil Nadu', topics: createTopicsForUnit('Mains Paper II - Unit II: Social Issues in India and Tamil Nadu', parseTopicsWithDash(syllabusText.mainsPaper2Unit2)) };
export const mainsPaper2Unit3: SyllabusUnit = { id: 'mains-p2u3', title: 'Mains Paper II - Unit III: Ethics and Integrity', topics: createTopicsForUnit('Mains Paper II - Unit III: Ethics and Integrity', parseTopicsWithDash(syllabusText.mainsPaper2Unit3)) };
export const mainsPaper3Unit1: SyllabusUnit = { id: 'mains-p3u1', title: 'Mains Paper III - Unit I: Indian Polity and Emerging Political Trends', topics: createTopicsForUnit('Mains Paper III - Unit I: Indian Polity and Emerging Political Trends', parseTopicsWithDash(syllabusText.mainsPaper3Unit1)) };
export const mainsPaper3Unit2: SyllabusUnit = { id: 'mains-p3u2', title: 'Mains Paper III - Unit II: Role and Impact of Science and Technology', topics: createTopicsForUnit('Mains Paper III - Unit II: Role and Impact of Science and Technology', parseTopicsWithDash(syllabusText.mainsPaper3Unit2)) };
export const mainsPaper3Unit3: SyllabusUnit = { id: 'mains-p3u3', title: 'Mains Paper III - Unit III: Tamil Society – Culture and Heritage', topics: createTopicsForUnit('Mains Paper III - Unit III: Tamil Society – Culture and Heritage', parseTopicsWithDash(syllabusText.mainsPaper3Unit3)) };
export const mainsPaper4Unit1: SyllabusUnit = { id: 'mains-p4u1', title: 'Mains Paper IV - Unit I: General Geography and Geography of India', topics: createTopicsForUnit('Mains Paper IV - Unit I: General Geography and Geography of India', parseTopicsWithDash(syllabusText.mainsPaper4Unit1)) };
export const mainsPaper4Unit2: SyllabusUnit = { id: 'mains-p4u2', title: 'Mains Paper IV - Unit II: Environment, Biodiversity and Disaster Management', topics: createTopicsForUnit('Mains Paper IV - Unit II: Environment, Biodiversity and Disaster Management', parseTopicsWithDash(syllabusText.mainsPaper4Unit2)) };
export const mainsPaper4Unit3: SyllabusUnit = { id: 'mains-p4u3', title: 'Mains Paper IV - Unit III: Indian Economy', topics: createTopicsForUnit('Mains Paper IV - Unit III: Indian Economy', parseTopicsWithDash(syllabusText.mainsPaper4Unit3)) };