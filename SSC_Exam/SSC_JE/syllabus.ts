
import { SyllabusUnit, Topic } from '../../types';

// Helper to create Topic objects
const createTopics = (unitTitle: string, topicNames: string[]): Topic[] => {
    return topicNames.map(name => ({ name, unit: unitTitle }));
};

const sscJeSyllabusText = `
# Paper-1 (200 MCQs) - 2 hours

# Section 1 : General Intelligence & Reasoning 50 No. of Questions - Max Marks : 50
1. ****Classification (Odd One Out) – (Word-based / Number-based / Letter-based / Figure-based)
2. Analogy – (Word / Number / Letter / Figure)
3. Coding–Decoding – (Letter shifting / Number coding / Substitution / Matrix / Mixed)
4. Paper Folding & Cutting – (Single fold / Double fold / Punch-hole / Mirror-symmetry)
5. Matrix – (Row–column reference / Hidden word / Element identification)
6. Word Formation – (All letters / Selective letters / Longest–Shortest)
7. Venn Diagram – (Two-set / Three-set / Classification type)
8. Direction & Distance – (Path tracking / Turns / Pythagoras)
9. Blood Relation – (Statement / Puzzle / Coded)
10. Series – (Number / Letter / Alphanumeric / Mixed)
11. Verbal Reasoning – (Syllogism / Assumption / Conclusion / Action / Cause–Effect)
12. . Non-Verbal Reasoning – (Mirror / Water / Rotation / Embedded / Figure series)
13. Seating Arrangement – (Linear / Circular / Square / Mixed)
14. High-Level Puzzles – (Floor / Box / Scheduling / Rank–Age / Mixed)

# Section : General Awareness - 50 No. of Questions - Max Marks : 50
# **unit - 1 : Static General Knowledge (Static GK)**
- Important Countries & Capitals
- Currencies
- National Symbols
- Important Days & Themes
- Rivers
- Dams
- Lakes
- National Parks & Wildlife Sanctuaries
- UNESCO Heritage Sites
- Indian States & Capitals
- State Symbols
- Superlatives (highest longest largest)
- International Organizations (UN WHO IMF World Bank)
- Indian Defence Forces (Commands ranks exercises)
- Space & Research Centres
- Famous Temples & Monuments
- First in India
- First in World
- Important Boundary Lines

# **unit - 2 : Science (General Science Basics)**
- Motion
- Force
- Work
- Energy
- Sound
- Light
- Electricity
- Magnetism & Electromagnetism
- Heat
- Temperature
- Thermodynamics
- Waves & Optics
- Modern Physics (Atom radioactivity)
- Matter, Elements, Compounds, Mixtures
- Acids
- Bases,
- Salts
- Periodic Table
- Metals & Non-Metals
- Chemical Reactions
- Everyday Chemistry (bleaching powder baking soda alloys)
- Cell & Tissues
- Human Body Systems
- Nutrition
- Diseases
- Immunity
- Plants, Reproduction
- Ecology
- Environment
- Biotechnology basics

# **unit - 3 : Current Affairs (Basics + Types)**
- National News
- International News
- Appointments / Resignations
- Government Schemes
- MoUs & Agreements
- Defence (missiles exercises appointments)
- Space & Science (ISRO/NASA)
- Economy & Banking
- Ranking & Reports (UNDP and NITI Aayog)
- Environment (Species - reserves - climate summits)
- Conferences & Summits
- Awards & Honours
- Sports
- Books & Authors
- Deaths (Obituaries)
- Budget & Economic Survey
- Five-year plans (older exams), NITI Aayog indicators
- State schemes & central flagship schemes
- New laws/policies
- Science & Defence launches
- International relations (G20 and BRICS and SCO)

# **unit - 4 : Sports**
- Cricket (World Cup and IPL)
- Football (FIFA and La Liga and Euro Cup)
- Tennis Grand Slams
- Olympics
- Commonwealth Games
- Asian Games
- Awards: Arjuna and Khel Ratna and Dronacharya
- Indian athletes & recent achievements
- Tournament venues & hosts

# **unit - 5 : Books & Authors**
- Sports-related books
- Political
- Auto-biographies
- Current affairs based books
- Award-winning literature
- Books released by important personalities (PM and President and Ministers)

# **unit - 6 : Important Schemes (Central + State)**
- PM Kisan
- PM Awas Yojana
- Ujjwala
- Ayushman Bharat
- PM SVANidhi
- PM Gram Sadak Yojana
- Beti Bachao Beti Padhao
- PM Fasal Bima Yojana
- Atmanirbhar Bharat initiatives
- DBT schemes
- Kalaignar Magalir Urimai Thogai
- Pudhumai Penn Scheme
- Chief Minister’s Breakfast Scheme
- TN Water Resources Schemes

# **unit - 7 : Portfolios (Ministers & Ministries)**
- Prime Minister → all important ministries
- Cabinet Ministers
- Ministers of State
- Governor → State
- Chief Minister → State

# **unit - 8 : People in News**
- Appointments (national/international)
- Award winners
- Sports achievers
- Authors, directors, scientists
- CEOs/MDs of big companies
- IAS/IPS who became news
- Famous personalities who passed away

# **unit - 9 : History**
- Indus Valley Civilization
- Vedic Age
- Jainism & Buddhism
- Mauryan Empire
- Gupta Age
- Delhi Sultanate
- Mughal Empire
- Vijayanagar Empire
- Advent of Europeans
- British Rule
- Social & Religious Reform Movements
- 1857 Revolt
- Indian National Congress
- Gandhian Movements
- Freedom Struggle
- Sangam Age
- Cholas
- Pandyas
- Pallavas
- Tamil Nadu Socio-political movements

# **unit - 10 : Culture (Indian + Tamil Nadu)**
- Art & Architecture
- Dance Forms (Classical & Folk)
- Music (Hindustani & Carnatic)
- Paintings
- Festivals
- Languages
- Martial Arts
- Heritage Sites
- Sangam Literature
- Temples & Architecture
- dances
- Music tradition

# **unit - 11 : Geography**
- Earth structure
- Volcanoes & earthquakes
- Rocks & minerals
- Climate
- Soil types
- Rivers of India
- States & capitals
- Resources
- Agriculture
- Transport systems
- Monsoons
- Natural vegetation
- Wildlife parks
- Continents
- Oceans
- Climatic zones
- Important physical features

# **unit - 12 : Economy**
- GDP
- GNP
- NNP
- Inflation, Deflation
- Banking System
- RBI functions
- Financial markets
- Budget & Tax
- Five-year plans (historical)
- NITI Aayog
- Poverty & unemployment
- TN Economic Development
- Government welfare schemes
- MSME growth
- Industries in Tamil Nadu

# **unit - 13 : Awards & Honours**
- Civilian Awards: Bharat Ratna
- Padma Awards
- Gallantry Awards
- National Awards: Dadasaheb Phalke,
- Shanti Swarup Bhatnagar
- International Awards
- Nobel
- Oscar
- Booker
- Sports Awards
- Arjuna
- Khel Ratna
- Literary Awards: Sahitya Akademi
- Film Awards
- Keep track of annual award winners.

# section 3 : General Mechanical Engineering - 100No. of Questions - Max Marks : 100

# **unit - 1 :** Theory of Machines (TOM) & Machine Design
- Kinematics of Machines
- Kinematics of Machines Links
- Kinematics of Machines pairs
- kinematic chains
- Mechanisms (four-bar and slider-crank)
- Velocity & acceleration diagrams
- Cams & Followers
- Gear terminology
- gear trains
- Flywheels & Governors
- Brakes & Dynamometers
- Clutches (plate, cone, centrifugal)
- Balancing of rotating & reciprocating masses
- Vibrations (free and forced and damping)
- Static & dynamic loading
- Factor of safety
- Stress concentration
- Failure theories (Maximum principal stress and strain and energy)
- Riveted joints
- Welded joints
- Cotter & knuckle joints
- Keys & couplings
- Shafts & axles
- Springs (helical and leaf)
- Bearings (sliding & rolling)
- Design of gears (strength & wear)

# **unit - 2 : IC Engines – Combustion**
- SI engine combustion (stages and detonation and flame front)
- CI engine combustion (delay period and knocking)
- Factors affecting knocking
- Ignition system
- injection system
- Combustion chambers (SI & CI types)

# **unit - 3 : Air Standard Cycles (IC Engines)**
- Otto cycle
- Diesel cycle
- Dual cycle
- PV & TS diagrams
- Comparison of efficiencies
- Compression ratio
- cut-off ratio
- heat addition

# **unit - 4 : IC Engine Performance**
- Indicated power (IP)
- brake power (BP)
- Mechanical efficiency
- Volumetric efficiency
- Specific fuel consumption (SFC)
- Heat balance sheet
- Morse test
- Emissions & control
- Performance parameters (IMEP and BMEP)

# **unit - 5 : First Law of Thermodynamics**
- Work & heat interactions
- Internal energy
- Steady flow energy equation (SFEE)
- Applications: nozzle - diffuser - turbine - compressor - boiler

# **unit - 6 : Second Law of Thermodynamics**
- Heat engines
- refrigerators
- heat pumps
- Kelvin-Planck & Clausius statements
- Carnot cycle & efficiency
- Entropy
- Irreversibility
- Clausius inequality

# **unit - 7 : Boilers**
- Fire-tube
- Water-tube
- Cochran
- Babcock-Wilcox
- Lamont
- Benson boilers
- Boiler mountings (safety valve and water gauge and fusible plug)
- Boiler accessories (economizer and superheater and feed pump)
- Draught (natural and forced and induced)

# **unit - 8 : IC Engine Cooling & Lubrication**
- Air cooling
- Water cooling
- Thermostat
- Radiator
- Pump circulation
- Types: boundary and hydrostatic and hydrodynamic
- Lubricants: mineral and synthetic
- viscosity
- flash point
- fire point
- Lubricating systems: splash
- Lubricating systems: pressure

# **unit - 9 : Mechanical Components Machines**
- Engines: SI/CI
- 2-stroke
- 4-stroke
- Turbines: impulse
- Turbines: reaction
- Pumps: reciprocating
- Pumps: centrifugal
- Compressors: reciprocating
- Compressors rotary
- Boilers: fire-tube
- Boilers: water-tube

# **unit - 10 : Rankine Cycle of Steam Power Plant**
- Simple Rankine cycle
- Reheat cycle
- Regenerative cycle
- Components: boiler
- Components: turbine
- Components: condenser
- Components: feed pump
- T-S and P-V diagrams
- Efficiency improving methods

# **unit - 11 : Specification (IC Engines / Machines)**
- Bore
- stroke
- Compression ratio
- Brake horsepower
- Firing order
- Displacement volume
- Pump head
- discharge
- Turbine head
- speed
- Compressor capacity

# **unit - 12 : Engineering Mechanics & Strength of Materials**
- Force systems
- Resultant
- equilibrium
- Friction
- Centroid
- moment of inertia
- Trusses
- Work-energy & impulse-momentum principles
- Stress and strain
- Elastic constants
- Thermal stresses
- Bending, shear stress
- Torsion
- Columns: Euler & Rankine
- Thin & thick cylinders
- SFD & BMD

# **unit - 13 : Centrifugal Pumps**
- Working principle
- Velocity triangles
- Cavitation
- NPSH (Net Positive Suction Head)
- Priming
- Pump characteristics
- Specific speed

# **unit - 14 : Basic Principles & Classification of Steels**
- Carbon steel, alloy steel
- Stainless steel
- Tool steel
- Cast iron types
- Heat treatment (annealing, normalizing, quenching, tempering)

# **unit - 15 : Hydraulic Turbines**
- Impulse Pelton
- Reaction Francis
- Reaction Kaplan
- Draft tube
- Specific speed
- Efficiency of turbine

# **unit - 16 : Dynamics of Ideal Fluids**
- Euler’s equations
- Bernoulli equation
- Application: pitot tube
- Application: venturi meter
- Free vortex
- forced vortex

# **unit - 17 : Fluid Kinematics**
- Types of flow (steady, unsteady, uniform)
- Streamlines
- pathlines
- streaklines
- Continuity equation

# **unit - 18 : Measurement of Fluid Pressure**
- Manometers (U-tube and inverted differential)
- Bourdon gauge
- Piezoelectric instruments

# **unit - 19 : Properties & Classification of Fluids**
- Density
- specific weight
- Viscosity
- Surface tension
- Compressibility
- Newtonian & non-Newtonian fluids

# **unit - 20 : Air Compressors & Their Cycles**
- Reciprocating compressor
- Rotary compressor
- Isothermal, adiabatic, polytropic compression
- Multistage compression

# **unit - 21 : Refrigeration Cycles**
- Vapour compression (VCRS)
- Vapour absorption (VARS)
- COP of refrigerator & heat pump
- Pressure-enthalpy diagram

# **unit - 22 : Measurement of Flow Rate**
- Venturimeter
- Orifice meter
- Rotameter
- Pitot tube
- Weirs & notches

# **unit - 23 : Fluid Statics**
- Pascal’s law
- Pressure variation
- Buoyancy
- Centre of pressure
- Metacentric height

# **unit - 24 : Nozzles & Steam Turbines**
- Convergent
- Convergent-divergent
- Velocity of steam
- Critical pressure ratio
- Impulse turbine
- Reaction turbine
- Compounding
- Efficiency

# **unit - 25 : Principle of Refrigeration Plant**
- Refrigeration cycle process
- Compressor function
- Evaporator
- condenser
- expansion valve
- Types of refrigerants

# **unit - 26 : Fitting & Accessories**
- Tools (hacksaw, files, chisels)
- Fitting operations (marking, cutting, filling, drilling)
- Measuring tools (vernier, micrometer, gauges)
- Welding basics (arc, gas)
- Lathe, milling, and shaping basics
`;

const parseSscJeSyllabus = (text: string): SyllabusUnit[] => {
    const syllabusUnits: SyllabusUnit[] = [];
    const content = text.trim().split('\n').slice(2).join('\n'); // Skip the first two header lines
    const sections = content.split(/#\s*section/i).filter(s => s.trim());

    for (const section of sections) {
        let lines = section.trim().split('\n');
        const sectionHeader = lines.shift() || '';
        const sectionTitleMatch = sectionHeader.match(/^\s*\d*\s*:\s*(.*?)(?:\s+-\s+\d+.*)?$/);
        let sectionTitle = sectionTitleMatch ? sectionTitleMatch[1].trim().replace(/\s*\d+\s*No\..*/, '').trim() : "Unknown Section";

        let sectionContent = lines.join('\n');
        const units = sectionContent.split(/#\s*\**\s*unit\s*-\s*(\d+)\s*:\**/i).filter(u => u.trim());

        if (units.length > 1) { // Section has units
            for (let i = 0; i < units.length; i += 2) {
                const unitNum = units[i].trim();
                const unitContent = units[i+1]?.trim() || '';
                let unitLines = unitContent.split('\n');
                let unitTitle = unitLines.shift()?.trim().replace(/\*+/g, '') || `Unit ${unitNum}`;
                
                const fullUnitTitle = `${sectionTitle} - ${unitTitle}`;

                const topics = unitLines
                    .flatMap(line => {
                        const trimmedLine = line.trim();
                        // If line contains balanced parentheses, treat it as a single topic
                        if (/\(.*\)/.test(trimmedLine)) {
                            return [trimmedLine];
                        }
                        // Otherwise, split by comma
                        return trimmedLine.split(/,\s*/);
                    })
                    .map(line => line.replace(/^(\d+\.?\s*|-\s*|\.\s*|\*{1,4}\s*)/, '').trim())
                    .filter(Boolean);

                syllabusUnits.push({
                    id: `ssc-je-p1-${sectionTitle.substring(0, 3).toLowerCase().replace(/[^a-z]/g, '')}-u${unitNum}`,
                    title: fullUnitTitle,
                    topics: createTopics(fullUnitTitle, topics)
                });
            }
        } else { // Section has no units
            const topics = sectionContent.split('\n')
                .map(l => l.replace(/^(\d+\.?\s*|-\s*|\.\s*|\*{1,4}\s*)/, '').trim())
                .filter(Boolean);

            syllabusUnits.push({
                id: `ssc-je-p1-${sectionTitle.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s/g, '-')}`,
                title: sectionTitle,
                topics: createTopics(sectionTitle, topics)
            });
        }
    }
    return syllabusUnits;
}

export const SSC_JE_PAPER1_SYLLABUS: SyllabusUnit[] = parseSscJeSyllabus(sscJeSyllabusText);
