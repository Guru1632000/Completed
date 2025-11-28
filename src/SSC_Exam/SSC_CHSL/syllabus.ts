import { SyllabusUnit, Topic } from '../../types';

// Helper function to parse syllabus text from markdown-like lists
const parseSscTopics = (text: string): string[] => {
    return text
        .trim()
        .split('\n')
        .map(line => line.trim().replace(/^- /, '')) // Remove markdown list markers
        .filter(line => line && !line.endsWith(':') && line.length > 1); // Filter out empty lines and headers
};

const createTopicsForUnit = (unitTitle: string, topicNames: string[]): Topic[] => {
    return topicNames.map(name => ({ name, unit: unitTitle }));
};

const sscGeographyText = `Solar system
Longitude and latitude
Earth Atmosphere
Rock continents and Ocean
Earth – shape and size
Structure of the Earth
Plate tectonics
Earthquakes – causes and effects
Volcanoes – types and distribution
Mountains – formation and types
Plateaus – features and examples
Plains – formation and types
Rivers – origin, course, deltas, drainage systems
Lakes – types and importance
Deserts – hot and cold deserts of the world
Climate – factors affecting climate
Weather – elements and instruments
Indian Monsoon – mechanism and seasons
Global wind systems
Ocean currents
Soils of India – types, formation, distribution
Soils of the World – classification and characteristics
Natural vegetation of India
Forest types of the world
Ecosystems – components and types
Oceans – major oceans and their characteristics
Sea levels – variation and importance
Ocean floor features – ridges, trenches, basins
Agriculture – importance and types
Cropping patterns in India
Major crops of India
Irrigation methods in India
Mineral resources of India
Distribution of major minerals (iron, coal, bauxite, mica, etc.)
Energy resources – coal, petroleum, natural gas
Renewable energy – solar, wind, hydro, nuclear
Major industrial belts in India
Industrial regions of the world
Modes of transport – road, rail, air, waterways
Major trade routes (national & international)
Population – growth, distribution, and density
Urbanisation – causes and effects
Migration – types and causes
Settlements – types (rural, urban, linear, cluster, etc.)
Population problems and solutions
World geography – continents and oceans overview
Important countries and capitals
Major islands and peninsulas
Major mountains and rivers of the world
Indian states and capitals
Major languages of India
Major rivers and tributaries of India
Important mountains and ranges (Himalayas, Western & Eastern Ghats, Aravalli, etc.)
Important lakes and deserts of India
Physical geography of neighbouring countries – Pakistan, China, Nepal, Bhutan, Bangladesh, Myanmar, Sri Lanka
Political geography of neighbouring countries
India’s strategic location in world geography
Indian Ocean region – importance and trade routes
Environmental issues in India – deforestation
Soil erosion and conservation
Flood-prone and drought-prone areas in India
Biodiversity hotspots in India
Biodiversity hotspots in the world
Conservation of biodiversity
National parks and wildlife sanctuaries in India
Environmental phenomena – El Niño and La Niña
Global warming and climate change
Ozone depletion
Rising sea levels and its impact
Natural hazards – cyclones in India
Earthquakes – distribution and safety measures
Tsunamis – causes and effects
Volcanoes – global distribution and impact
Geopolitics of sea routes (Suez, Panama, Arctic route, etc.)
Arctic passage and global trade importance
Global climate agreements – Kyoto, Paris, COP summits
Major dams of India (Bhakra Nangal, Hirakud, Tehri, etc.)
Major ports of India (Mumbai, Chennai, Kolkata, etc.)
Major airports and transport hubs of India
Industrial corridors (Delhi–Mumbai, Amritsar–Kolkata, etc.)
International corridors and projects (INSTC, Belt & Road, etc.)`;
const sscHistoryOfIndiaText = `Prehistoric period – Paleolithic, Mesolithic, Neolithic ages
Indus Valley Civilization – sites, culture, decline
Vedic period – Early and Later Vedic age, society, economy, religion
Mahajanapadas – formation, major kingdoms
Mauryan Empire – Chandragupta, Ashoka, administration, economy, art, and culture
Post-Mauryan kingdoms – Shungas, Satavahanas, Kushanas, Guptas
Gupta Empire – administration, economy, art, literature, decline
Regional kingdoms – Cholas, Chalukyas, Pallavas, Rashtrakutas, Pandyas
Religious movements – Buddhism, Jainism, Bhakti and Sufi movements
Ancient Indian art & architecture – stupas, rock-cut caves, temples
Numismatics – coins and their historical importance
Early medieval period – Rajputs, Palas, Pratiharas
Delhi Sultanate – rulers, administration, society, economy
Mughal Empire – Babur, Akbar, Jahangir, Shah Jahan, Aurangzeb
Mughal administration – revenue, land systems, army, justice
Mughal culture – art, architecture, literature, music
Regional kingdoms – Vijayanagara, Bahmani, Marathas, Ahoms
Invasions – Arab, Turkish, Mongol, Afghan invasions
Bhakti & Sufi movements – saints, philosophies, influence
Decline of medieval empires – causes and impact
Advent of Europeans – Portuguese, Dutch, French, British
British East India Company – administration, policies, expansion
Battles – Plassey, Buxar, Anglo-Mysore, Anglo-Maratha, Anglo-Sikh
Revolt of 1857 – causes, course, leaders, results
British administration – revenue systems, land settlements (Zamindari, Ryotwari, Mahalwari)
Social reform movements – Raja Ram Mohan Roy, Dayananda Saraswati, Ishwar Chandra Vidyasagar
Cultural and educational developments – universities, literature, press
Economic impact of British rule – deindustrialization, famines, trade
Freedom struggle – formation of INC, partition of Bengal, Home Rule Movement
Gandhi Era – Non-Cooperation, Civil Disobedience, Quit India movements
Other leaders – Subhas Chandra Bose, Bhagat Singh, Tilak, Lajpat Rai
India’s independence – Mountbatten Plan, partition, 1947
Ancient civilizations – Mesopotamia, Egypt, Greece, Rome, China
Medieval Europe – Feudalism, Renaissance, Reformation
Age of Discovery – explorers, voyages, impact
French Revolution – causes, course, impact
Industrial Revolution – causes, inventions, effects
World Wars – World War I & II – causes, major events, consequences
Russian Revolution – 1917, causes, impact
League of Nations & United Nations – formation and objectives
Cold War – causes, major events, major players (USA, USSR)
Decolonization – Asia and Africa, independence movements
Archaeological discoveries in India – Indus Valley, Mauryan, Gupta, medieval
Important historical sites – monuments, forts, temples
Awards and recognitions related to history – Padma, Sahitya, UNESCO heritage sites
Historical anniversaries and commemorations
Recent findings in archaeology and ancient manuscripts`;
const sscCultureText = `Prehistoric art – cave paintings, rock shelters (Bhimbetka, etc.)
Mauryan art – stupas, pillars (Ashokan pillars), sculptures
Gupta art – temples, sculptures, coins, painting
Post-Gupta art – temples of south India, Chalukya, Pallava, Rashtrakuta architecture
Medieval architecture – Sultanate architecture, Mughal architecture (Taj Mahal, Red Fort)
Regional architecture – Rajput forts and palaces, Maratha architecture
Modern Indian architecture – Indo-Saracenic style, British colonial architecture
Vedic literature – Rigveda, Samaveda, Yajurveda, Atharvaveda
Epic literature – Ramayana, Mahabharata, Puranas
Classical Sanskrit literature – Kalidasa, Bana, Harsha
Medieval literature – Bhakti and Sufi poets (Kabir, Tulsidas, Mirabai, Guru Nanak)
Regional literature – Tamil Sangam literature, Kannada, Marathi, Bengali contributions
Modern Indian literature – Rabindranath Tagore, Bankim Chandra Chatterjee, Premchand
Folk literature – epics, folktales, oral traditions
Classical music – Hindustani and Carnatic systems
Important musical instruments – sitar, tabla, veena, mridangam
Famous composers – Tansen, Tyagaraja, Muthuswami Dikshitar
Indian dance forms – Bharatanatyam, Kathak, Kathakali, Odissi, Kuchipudi, Manipuri, Mohiniyattam
Folk dances – Bhangra, Garba, Chhau, Ghoomar, Lavani
Modern and fusion music
Prehistoric paintings – Bhimbetka, Ajanta and Ellora caves
Mauryan and Gupta sculpture – pillars, stupas, idols
Temple sculptures – Khajuraho, Konark, Hoysala
Mughal miniature painting – Akbar, Jahangir, Shah Jahan period
Rajput and Pahari painting styles
Folk and tribal art – Madhubani, Warli, Pattachitra, Gond
Hinduism – Vedas, Upanishads, epics, temples, rituals
Buddhism – origin, teachings, Mauryan patronage, spread
Jainism – origin, teachings, important tirthankaras
Sikhism – Gurus, teachings, important events, Golden Temple
Islam – introduction, Delhi Sultanate and Mughal influences, Sufism
Christianity – arrival, missionary activities, cultural impact
Other religions – Zoroastrianism, Judaism in India
Major national festivals – Diwali, Holi, Eid, Christmas, Gurpurab
Regional festivals – Pongal, Bihu, Onam, Navratri, Durga Puja
Folk festivals – tribal and rural celebrations
Customs and traditions – marriage, birth, death rituals in different regions
Handicrafts and traditional arts – pottery, weaving, jewelry, carpets
Important cultural institutions – Sangeet Natak Akademi, IGNCA, Archaeological Survey of India
UNESCO World Heritage Sites in India – monuments, natural sites, cultural sites
Awards related to culture – Padma Awards, Bharat Ratna in arts, Sahitya Akademi Awards
Recent developments in cultural preservation, archaeology, and arts`;
const sscAwardsAndHonorsText = `Bharat Ratna – India’s highest civilian award, notable recipients, purpose
Padma Awards – Padma Vibhushan, Padma Bhushan, Padma Shri – criteria and notable awardees
National Bravery Awards – Children’s bravery awards
Gallantry Awards – Param Vir Chakra, Ashoka Chakra, Maha Vir Chakra, Kirti Chakra, Vir Chakra, Shaurya Chakra
Sahitya Akademi Award – Literature in various Indian languages, notable awardees
Jnanpith Award – India’s highest literary honor
Rashtrapati Award for Teachers and Artists – contributions in arts and education
Sangeet Natak Akademi Award – Music, dance, drama
National Film Awards – categories, important winners
Dadasaheb Phalke Award – Lifetime contribution to Indian cinema
Shanti Swarup Bhatnagar Award – Excellence in science and technology
Homi Bhabha Award – Contributions in nuclear science
Infosys Prize / INSA Awards – Notable scientific achievements
Nobel Prize – Literature, Peace, Physics, Chemistry, Medicine, Economic Sciences
Oscar Awards – Cinema and filmmaking
Pulitzer Prize – Journalism, literature, and music
Fields Medal – Mathematics
Booker Prize – Literature
Grammy Awards – Music
Rajiv Gandhi Khel Ratna (Major Dhyan Chand Khel Ratna) – India’s highest sporting honor
Arjuna Award – Outstanding performance in sports
Dronacharya Award – Coaching excellence
Dhyan Chand Award – Lifetime contribution in sports
UNESCO Awards – Cultural and educational contributions
Oscar Awards (Indian winners) – International cinema recognition
Booker Prize Winners from India – Literature
Global Environmental Awards – UNEP Champions, Goldman Prize`;
const sscConstitutionOfIndiaText = `Salient features of the Constitution
Preamble – significance and key points
Union and State structure – federal features
Fundamental Rights – Articles 12–35, significance, limitations
Fundamental Duties – Article 51A
Directive Principles of State Policy – classification, importance
Amendment of the Constitution – procedure, important amendments
Schedules of the Constitution – classification and significance
Important Articles
President – election, powers, functions, impeachment
Vice President – role and responsibilities
Prime Minister – appointment, powers, council of ministers
Parliament – Lok Sabha, Rajya Sabha, composition, functions
Parliamentary Committees – types and functions
Legislative process – how a bill becomes a law
Ordinances – powers of the President to issue
Parliamentary privileges and dissolution
Governor – powers, functions, appointment, and removal
Chief Minister – role and powers
State Legislature – Vidhan Sabha, Vidhan Parishad, functions
High Courts – composition, jurisdiction, powers
State Public Service Commissions – functions
Supreme Court – composition, powers, jurisdiction, judicial review
High Courts – powers and functions
Subordinate courts – structure and types
Judicial activism and judicial review
PIL – Public Interest Litigation – concept and examples
Panchayati Raj – three-tier system, powers, functions
Municipalities – structure, powers, 74th Constitutional Amendment
Urban local governance – responsibilities and functions
Election Commission of India – powers and functions
Comptroller & Auditor General (CAG) – role and powers
Union Public Service Commission (UPSC) – composition and functions
Finance Commission – objectives and functions
National Commission for SC/ST/OBC – role and powers
NITI Aayog – objectives and functions
NHRC (National Human Rights Commission) – powers and role
EC of India – Election oversight
Other commissions – CVC, CBI, SEBI, RBI – brief overview
Separation of powers – executive, legislature, judiciary
Federalism – unitary vs federal features
Emergency provisions – National, State, Financial emergency
Fundamental Rights vs DPSPs – conflicts and resolutions
Recent amendments and their implications
Important Supreme Court judgments`;
const sscSportsText = `Major Dhyan Chand Khel Ratna – India’s highest sporting honor, notable recipients
Arjuna Award – Outstanding performance in sports
Dronacharya Award – Coaching excellence
Dhyan Chand Award – Lifetime contribution in sports
Rashtriya Khel Protsahan Puruskar – Promoting sports development
Laureus World Sports Awards – categories, notable winners
Olympic Awards & Medals – Summer & Winter Olympics, Indian achievements
Paralympic Awards – Indian medalists and notable performances
FIFA Ballon d’Or / FIFA Awards – global recognition in football
Olympic Games – Summer & Winter, history, host countries
Asian Games – history, India’s performance, host countries
Commonwealth Games – history, India’s performance
Asian Para Games – India’s achievements
FIFA World Cup – football, winners, India’s involvement
ICC Cricket World Cup / T20 World Cup – winners, India’s performance
Other major tournaments – Wimbledon, French Open, Ryder Cup, Tour de France
Popular sports in India – hockey, cricket, kabaddi, badminton, wrestling
Traditional games – kho-kho, gilli-danda, mallakhamb, kabaddi
Indian athletes – Olympic medalists and record holders
Sports organizations in India – Sports Authority of India (SAI), National Sports Federations
Indian athletes in Olympics – medal winners, records
India in Paralympics – achievements and notable athletes
World records held by Indian sports personalities
India in Asian Games & Commonwealth Games – medal tally and milestones
Recent awards and honors in sports
Major international tournaments hosted in India
Recent records and achievements by Indian athletes
Important appointments in sports organizations (e.g., Olympic Committee, Hockey Federation)`;
const sscEconomicsText = `Definition and scope of economics
Microeconomics vs Macroeconomics
Law of demand and supply – definitions, types, exceptions
Elasticity of demand and supply
Utility – total and marginal utility, law of diminishing marginal utility
Cost concepts – fixed, variable, total, average, marginal cost
Revenue concepts – total, average, marginal revenue
Production – factors of production, laws of production
Features of Indian economy – structure, sector-wise contribution
National income – concepts (GNP, GDP, NNP, per capita income)
Money and banking system – RBI, commercial banks, monetary policy
Fiscal policy – taxation, government expenditure, deficit financing
Inflation – types, causes, measures to control
Unemployment – types, causes, measures
Agriculture in India – cropping patterns, Green Revolution, allied sectors
Industry in India – types, major industries, industrial policy
Services sector – banking, insurance, IT, tourism
Five-year plans – objectives, achievements
NITI Aayog – objectives and role
Economic reforms – liberalization, privatization, globalization (LPG model)
Make in India, Digital India, Skill India, Atmanirbhar Bharat – objectives and impact
RBI – functions, monetary tools
Inflation control measures – quantitative and qualitative
Commercial banks – role, credit creation
Budget – components, types (Revenue, Capital, Deficit)
Financial inclusion – schemes and initiatives
Taxation – direct and indirect taxes, GST
World Trade Organization (WTO) – objectives, functions
IMF, World Bank, ADB – objectives and role
Balance of Payments – components, deficit and surplus
Exchange rate – types, determination, impact
Recent budget highlights
Recent economic surveys
Major government schemes (PM-Kisan, PMAY, Ujjwala, etc.)
Global economic events affecting India
Recent inflation, unemployment, or GDP trends`;
const sscPhysicsText = `Motion – distance, displacement, speed, velocity, acceleration
Newton’s Laws of Motion – applications, examples
Work, Power, and Energy – kinetic, potential, conservation of energy
Gravitation – universal law, acceleration due to gravity, orbital motion
Properties of Matter – elasticity, stress-strain, Hooke’s Law
Oscillations – simple harmonic motion, pendulum
Fluid Mechanics – buoyancy, Archimedes’ principle, pressure
Temperature and Heat – measurement, expansion, specific heat capacity
Laws of Thermodynamics – first, second, and third law
Heat Transfer – conduction, convection, radiation
Thermal Properties of Matter – thermal expansion, calorimetry
Heat Engines and Refrigerators – efficiency, Carnot cycle
Electrostatics – charge, Coulomb’s law, electric field, potential
Current Electricity – Ohm’s law, resistance, series & parallel circuits
Heating Effect of Current – Joule’s law
Magnetism – magnetic field, Oersted’s experiment, Lorentz force
Electromagnetic Induction – Faraday’s law, Lenz’s law, AC & DC
Capacitance and Inductance – capacitor, inductor, energy stored
Reflection and Refraction – laws, mirrors, lenses
Optical Instruments – microscope, telescope, magnification
Dispersion of Light – prism, rainbow
Interference, Diffraction, Polarization – basic concepts
Nature of Sound – properties, speed of sound in different media
Wave motion – longitudinal and transverse waves
Doppler Effect – principle and applications
Resonance and Beats
Atomic Structure – Bohr model, Rutherford model
Nuclear Physics – radioactivity, decay laws, nuclear reactions
Photoelectric Effect – Einstein’s equation
X-rays – production, properties, uses
Electronics – semiconductors, diodes, transistors, logic gates
Measurement and Units – SI units, dimensional analysis
Physical Constants – Planck’s constant, gravitational constant, speed of light
Simple Experiments – pendulum, spring, lenses, calorimeter
Recent discoveries and applications in physics`;
const sscChemistryText = `States of Matter – solid, liquid, gas, plasma
Gas Laws – Boyle’s, Charles’s, Avogadro’s, Ideal Gas Law
Thermodynamics – first law, second law, enthalpy, entropy
Chemical Kinetics – rate of reaction, factors affecting rate
Equilibrium – chemical and ionic, Le Chatelier’s principle
Solutions – types, concentration terms, colligative properties
Acids and Bases – theories (Arrhenius, Bronsted-Lowry, Lewis), pH, buffers
Electrochemistry – redox reactions, electrolysis, galvanic cells
Surface Chemistry – adsorption, catalysis, colloids
Periodic Table – groups, periods, trends (atomic radius, ionization energy, electronegativity)
Chemical Bonding – ionic, covalent, metallic, coordinate bonds
Molecular Structure – VSEPR theory, hybridization
Hydrogen – preparation, properties, uses
Alkali and Alkaline Earth Metals – properties, reactions, compounds
Boron, Carbon, Nitrogen, Oxygen Group – important compounds and uses
Halogens and Noble Gases – properties, reactions, applications
Transition Elements – general properties, common compounds
Coordination Compounds – ligands, nomenclature, bonding
Important Minerals and Ores – occurrence, extraction, uses
General Organic Chemistry – hybridization, functional groups, isomerism
Hydrocarbons – alkanes, alkenes, alkynes, aromatic hydrocarbons
Halogen Compounds – alkyl halides, aryl halides
Alcohols, Phenols, Ethers – preparation, properties, uses
Aldehydes and Ketones – reactions, applications
Carboxylic Acids and Derivatives – preparation, reactions
Amines and Amino Acids – structure, properties, uses
Polymers – natural and synthetic, examples
Biomolecules – carbohydrates, proteins, lipids, nucleic acids
Laboratory techniques – titration, filtration, distillation, chromatography
Qualitative analysis – detection of ions and gases
Industrial Chemistry – fertilizers, cement, glass, dyes, soaps, detergents
Environmental Chemistry – water and air pollution, green chemistry
Everyday Chemistry – cosmetics, food additives, medicines, fuels
Recent discoveries in chemistry
Nobel Prize winners in chemistry
Applications in pharmaceuticals, agriculture, and industry
Important chemical reactions and processes in daily life`;
const sscBiologyText = `Classification of living organisms – Five Kingdom system
Major phyla – characteristics of Plantae, Animalia, Fungi, Protista, Monera
Plant classification – Bryophytes, Pteridophytes, Gymnosperms, Angiosperms
Animal classification – Porifera to Chordata
Viruses and bacteria – structure, reproduction, diseases
Human Anatomy – major systems (digestive, respiratory, circulatory, excretory, nervous, reproductive)
Blood – composition, groups, clotting
Heart and circulation – structure, blood flow, cardiac cycle
Respiratory system – lungs, breathing mechanism
Nervous system – structure of brain, spinal cord, neurons
Endocrine system – hormones and glands
Human reproduction – male and female reproductive systems, fertilization, pregnancy
Human diseases – common viral, bacterial, parasitic, lifestyle diseases
Photosynthesis – light and dark reactions, pigments, factors affecting
Respiration – aerobic, anaerobic, glycolysis, Krebs cycle
Transpiration and water transport
Mineral nutrition – macro and microelements, deficiency symptoms
Plant hormones – auxins, gibberellins, cytokinins, ethylene, abscisic acid
Growth and development – photoperiodism, vernalization
Cell structure – plant and animal cell, organelles
Cell division – mitosis, meiosis
Genetics – Mendelian principles, inheritance, chromosomes, DNA & RNA
Molecular biology – replication, transcription, translation, protein synthesis
Biotechnology – basic techniques, applications, genetically modified organisms
Ecosystems – components, types, food chains, food webs
Biogeochemical cycles – carbon, nitrogen, water, oxygen
Biodiversity – hotspots, conservation, endangered species
Pollution – air, water, soil, noise, greenhouse effect, global warming
Environmental issues – deforestation, climate change, waste management
Microorganisms – bacteria, viruses, fungi, protozoa
Useful microbes – fermentation, antibiotics, nitrogen fixation
Immunity – innate and acquired, vaccines, antibodies
Recent discoveries in biology and biotechnology
Nobel laureates in biology
Important medical and agricultural applications
Important organisms in research – E. coli, Drosophila, Arabidopsis`;
const sscBooksText = `Classical Indian Literature – Kalidasa (Abhigyan Shakuntalam, Meghaduta)
Modern Indian Authors – R.K. Narayan, Mulk Raj Anand, Raja Rao
Contemporary Authors – Arundhati Roy (The God of Small Things), Chetan Bhagat (Five Point Someone), Jhumpa Lahiri (The Namesake)
Autobiographies by Indians – Wings of Fire (A.P.J. Abdul Kalam), Playing It My Way (Sachin Tendulkar), My Life in Full (Indra Nooyi), The Story of My Experiments with Truth (Mahatma Gandhi)
Indian Poets – Rabindranath Tagore (Gitanjali), Sarojini Naidu (The Golden Threshold), A.K. Ramanujan
William Shakespeare – Hamlet, Macbeth, Othello, Romeo and Juliet
Charles Dickens – Oliver Twist, A Tale of Two Cities, Great Expectations
George Orwell – 1984, Animal Farm
Leo Tolstoy – War and Peace, Anna Karenina
Jane Austen – Pride and Prejudice, Sense and Sensibility
Mark Twain – The Adventures of Tom Sawyer, Huckleberry Finn
Ernest Hemingway – The Old Man and the Sea
Discovery of India – Jawaharlal Nehru
India Wins Freedom – Abul Kalam Azad
My Experiments with Truth – Mahatma Gandhi
Why I Am an Atheist – Bhagat Singh
Unbreakable – Mary Kom
A Better India, A Better World – N.R. Narayana Murthy
Economic Survey of India
India Year Book
Budget Documents (Union Budget)
NITI Aayog Reports
Environmental and Economic Development Reports
Man Booker Prize-winning books – The White Tiger (Aravind Adiga), Midnight’s Children (Salman Rushdie)
Nobel Prize-winning authors – Rabindranath Tagore (Gitanjali), Orhan Pamuk (My Name is Red), Kazuo Ishiguro (The Remains of the Day)
Jnanpith Award-winning works – G. Sankara Kurup, Amitav Ghosh, etc.
Sahitya Akademi Award-winning authors – regional and national level
Exam Warriors – Narendra Modi
The Accidental Prime Minister – Sanjaya Baru
An Era of Darkness – Shashi Tharoor
Turning Points – A.P.J. Abdul Kalam
Matters of Discretion – I.K. Gujral
One Life Is Not Enough – K. Natwar Singh
Recently published bestsellers (fiction & non-fiction)
Books related to social issues, economy, and politics (e.g., The India Way, Breaking the Mould)
Books launched by government officials or during major events
Books on Science – A Brief History of Time (Stephen Hawking), The Selfish Gene (Richard Dawkins)
Books on Environment – Silent Spring (Rachel Carson)
Books on Philosophy – The Republic (Plato), Meditations (Marcus Aurelius)`;


// Tier 1 Syllabus Text
const sscChslTier1SyllabusText = {
  reasoning: `Analogy
Classification
Series (Number, Alphabet, Coding-Decoding)
Blood Relations
Direction Sense
Order & Ranking
Syllogism
Statement & Conclusions / Assumptions
Logical Venn Diagrams
Embedded Figures
Matrix
Mirror and Water Images
Paper Folding and Cutting
Word Formation
Coding-Decoding (Alphabet/Number/Symbol)
Missing Numbers
Visual/Non-verbal Reasoning`,
  maths: `Number System
Simplification
Percentage
Ratio and Proportion
Average
Time, Speed & Distance
Time & Work
Simple & Compound Interest
Profit, Loss & Discount
Mixture & Alligation
Partnership
Algebra (Basic equations)
Geometry (Lines, Angles, Triangles, Circles)
Mensuration (2D & 3D figures)
Trigonometry (Heights & Distances, Basic ratios)
Data Interpretation (Table, Bar Graph, Pie Chart)`,
  english: `Spot the Error
Fill in the Blanks
Synonyms & Antonyms
Spelling Correction
One-word Substitution
Idioms & Phrases
Cloze Test
Reading Comprehension
Sentence Improvement
Active & Passive Voice
Direct & Indirect Speech
Para Jumbles`,
};

// Tier 2 Syllabus Text (New Pattern)
const sscChslTier2SyllabusText = {
  maths: `Integers, Fractions, LCM & HCF
Simplification
Decimals and Recurring Decimals
Ratio & Proportion
Percentage
Average
Profit, Loss & Discount
Simple & Compound Interest
Time, Work & Wages
Time, Speed & Distance
Partnership
Mixture & Alligation
Basic algebraic identities
Linear equations
Quadratic equations (simple forms)
Lines and Angles
Triangles (properties, congruence, similarity)
Circles (chords, tangents, arcs, angles)
Polygons and Quadrilaterals
Perimeter and Area (Square, Rectangle, Circle, Triangle, Trapezium)
Volume and Surface Area (Cube, Cuboid, Sphere, Cylinder, Cone)
Trigonometric Ratios (sin, cos, tan)
Heights and Distances
Basic Identities
Tables, Bar Graphs, Pie Charts, Line Graphs
Data Sufficiency
Simple Data Comparison`,
  reasoning: `Analogy (Word, Number, Alphabet)
Classification
Coding-Decoding
Series (Alphabet/Number/Mixed)
Blood Relations
Direction & Distance
Ranking/Order
Syllogism
Statement & Conclusion/Assumption
Mirror and Water Images
Embedded Figures
Paper Folding & Cutting
Figure Classification
Matrix & Pattern Completion
Cause and Effect
Statement and Arguments
Decision Making
Course of Action`,
  english: `Parts of Speech
Tenses (All forms)
Active and Passive Voice
Direct and Indirect Speech
Articles, Prepositions, Conjunctions
Sentence Correction
Synonyms & Antonyms
One Word Substitution
Idioms and Phrases
Word Formation (Prefix/Suffix)
Spelling Correction
Reading Comprehension (Passage-based MCQs)
Cloze Test
Para Jumbles (Sentence Rearrangement)
Error Detection`,
  computer: `Components of a Computer System (Hardware & Software)
Input and Output Devices
Operating Systems (Windows, Linux basics)
Memory Concepts (RAM, ROM, Storage types)
Internet, Email, Web Browsers
Networking Basics (LAN, WAN, IP, DNS)
MS Word: Shortcuts, Formatting, Editing
MS Excel: Formulas, Charts, Data Handling
MS PowerPoint: Slides, Transitions, Shortcuts
Computer Viruses, Malware
Safe Internet Practices
Data Protection and Privacy`,
};

// Tier 1 - Create individual GA units
const sscChsl1Geography: SyllabusUnit = { id: 'ssc-chsl1-geo', title: 'Tier 1 - Geography', topics: createTopicsForUnit('Tier 1 - Geography', parseSscTopics(sscGeographyText)) };
const sscChsl1History: SyllabusUnit = { id: 'ssc-chsl1-hist', title: 'Tier 1 - History of India', topics: createTopicsForUnit('Tier 1 - History of India', parseSscTopics(sscHistoryOfIndiaText)) };
const sscChsl1Culture: SyllabusUnit = { id: 'ssc-chsl1-culture', title: 'Tier 1 - Culture', topics: createTopicsForUnit('Tier 1 - Culture', parseSscTopics(sscCultureText)) };
const sscChsl1Awards: SyllabusUnit = { id: 'ssc-chsl1-awards', title: 'Tier 1 - Awards and Honors', topics: createTopicsForUnit('Tier 1 - Awards and Honors', parseSscTopics(sscAwardsAndHonorsText)) };
const sscChsl1Constitution: SyllabusUnit = { id: 'ssc-chsl1-const', title: 'Tier 1 - Constitution of India', topics: createTopicsForUnit('Tier 1 - Constitution of India', parseSscTopics(sscConstitutionOfIndiaText)) };
const sscChsl1Sports: SyllabusUnit = { id: 'ssc-chsl1-sports', title: 'Tier 1 - Sports', topics: createTopicsForUnit('Tier 1 - Sports', parseSscTopics(sscSportsText)) };
const sscChsl1Economics: SyllabusUnit = { id: 'ssc-chsl1-econ', title: 'Tier 1 - Economics', topics: createTopicsForUnit('Tier 1 - Economics', parseSscTopics(sscEconomicsText)) };
const sscChsl1Physics: SyllabusUnit = { id: 'ssc-chsl1-phy', title: 'Tier 1 - Physics', topics: createTopicsForUnit('Tier 1 - Physics', parseSscTopics(sscPhysicsText)) };
const sscChsl1Chemistry: SyllabusUnit = { id: 'ssc-chsl1-chem', title: 'Tier 1 - Chemistry', topics: createTopicsForUnit('Tier 1 - Chemistry', parseSscTopics(sscChemistryText)) };
const sscChsl1Biology: SyllabusUnit = { id: 'ssc-chsl1-bio', title: 'Tier 1 - Biology', topics: createTopicsForUnit('Tier 1 - Biology', parseSscTopics(sscBiologyText)) };
const sscChsl1Books: SyllabusUnit = { id: 'ssc-chsl1-books', title: 'Tier 1 - Books', topics: createTopicsForUnit('Tier 1 - Books', parseSscTopics(sscBooksText)) };

// Tier 2 - Create individual GA units
const sscChsl2Geography: SyllabusUnit = { id: 'ssc-chsl2-geo', title: 'Tier 2 - Geography', topics: createTopicsForUnit('Tier 2 - Geography', parseSscTopics(sscGeographyText)) };
const sscChsl2History: SyllabusUnit = { id: 'ssc-chsl2-hist', title: 'Tier 2 - History of India', topics: createTopicsForUnit('Tier 2 - History of India', parseSscTopics(sscHistoryOfIndiaText)) };
const sscChsl2Culture: SyllabusUnit = { id: 'ssc-chsl2-culture', title: 'Tier 2 - Culture', topics: createTopicsForUnit('Tier 2 - Culture', parseSscTopics(sscCultureText)) };
const sscChsl2Awards: SyllabusUnit = { id: 'ssc-chsl2-awards', title: 'Tier 2 - Awards and Honors', topics: createTopicsForUnit('Tier 2 - Awards and Honors', parseSscTopics(sscAwardsAndHonorsText)) };
const sscChsl2Constitution: SyllabusUnit = { id: 'ssc-chsl2-const', title: 'Tier 2 - Constitution of India', topics: createTopicsForUnit('Tier 2 - Constitution of India', parseSscTopics(sscConstitutionOfIndiaText)) };
const sscChsl2Sports: SyllabusUnit = { id: 'ssc-chsl2-sports', title: 'Tier 2 - Sports', topics: createTopicsForUnit('Tier 2 - Sports', parseSscTopics(sscSportsText)) };
const sscChsl2Economics: SyllabusUnit = { id: 'ssc-chsl2-econ', title: 'Tier 2 - Economics', topics: createTopicsForUnit('Tier 2 - Economics', parseSscTopics(sscEconomicsText)) };
const sscChsl2Physics: SyllabusUnit = { id: 'ssc-chsl2-phy', title: 'Tier 2 - Physics', topics: createTopicsForUnit('Tier 2 - Physics', parseSscTopics(sscPhysicsText)) };
const sscChsl2Chemistry: SyllabusUnit = { id: 'ssc-chsl2-chem', title: 'Tier 2 - Chemistry', topics: createTopicsForUnit('Tier 2 - Chemistry', parseSscTopics(sscChemistryText)) };
const sscChsl2Biology: SyllabusUnit = { id: 'ssc-chsl2-bio', title: 'Tier 2 - Biology', topics: createTopicsForUnit('Tier 2 - Biology', parseSscTopics(sscBiologyText)) };
const sscChsl2Books: SyllabusUnit = { id: 'ssc-chsl2-books', title: 'Tier 2 - Books', topics: createTopicsForUnit('Tier 2 - Books', parseSscTopics(sscBooksText)) };


// --- Tier 1 Syllabus Units ---
export const SSC_CHSL_TIER1_SYLLABUS: SyllabusUnit[] = [
    { id: 'ssc-chsl1-reason', title: 'Tier 1 - General Intelligence (Reasoning)', topics: createTopicsForUnit('Tier 1 - General Intelligence (Reasoning)', parseSscTopics(sscChslTier1SyllabusText.reasoning)) },
    sscChsl1Geography,
    sscChsl1History,
    sscChsl1Culture,
    sscChsl1Awards,
    sscChsl1Constitution,
    sscChsl1Sports,
    sscChsl1Economics,
    sscChsl1Physics,
    sscChsl1Chemistry,
    sscChsl1Biology,
    sscChsl1Books,
    { id: 'ssc-chsl1-maths', title: 'Tier 1 - Quantitative Aptitude (Maths)', topics: createTopicsForUnit('Tier 1 - Quantitative Aptitude (Maths)', parseSscTopics(sscChslTier1SyllabusText.maths)) },
    { id: 'ssc-chsl1-eng', title: 'Tier 1 - English Language', topics: createTopicsForUnit('Tier 1 - English Language', parseSscTopics(sscChslTier1SyllabusText.english)) },
];

// --- Tier 2 Syllabus Units ---
export const SSC_CHSL_TIER2_SYLLABUS: SyllabusUnit[] = [
    { id: 'ssc-chsl2-maths', title: 'Tier 2 - Mathematical Abilities', topics: createTopicsForUnit('Tier 2 - Mathematical Abilities', parseSscTopics(sscChslTier2SyllabusText.maths)) },
    { id: 'ssc-chsl2-reason', title: 'Tier 2 - Reasoning and General Intelligence', topics: createTopicsForUnit('Tier 2 - Reasoning and General Intelligence', parseSscTopics(sscChslTier2SyllabusText.reasoning)) },
    { id: 'ssc-chsl2-eng', title: 'Tier 2 - English Language and Comprehension', topics: createTopicsForUnit('Tier 2 - English Language and Comprehension', parseSscTopics(sscChslTier2SyllabusText.english)) },
    sscChsl2Geography,
    sscChsl2History,
    sscChsl2Culture,
    sscChsl2Awards,
    sscChsl2Constitution,
    sscChsl2Sports,
    sscChsl2Economics,
    sscChsl2Physics,
    sscChsl2Chemistry,
    sscChsl2Biology,
    sscChsl2Books,
    { id: 'ssc-chsl2-comp', title: 'Tier 2 - Computer Knowledge Test', topics: createTopicsForUnit('Tier 2 - Computer Knowledge Test', parseSscTopics(sscChslTier2SyllabusText.computer)) },
];