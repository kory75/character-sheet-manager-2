# Paranoia 2nd Edition — Character Creation Rules Summary

> **Purpose:** Single source of truth for all Paranoia 2nd Edition rules used in the Character Sheet Generator project.
> **Sources:** Legacy implementation at `kory75/CharacterSheetGenerator` (init.json + main.js + paranoia2nd.html), the TardisCaptain character creation walkthrough blog post, RPGnet reviews, RPG Writeups analyses, Wikipedia/Fandom entries, and web searches.

---

## Overview

Paranoia is a satirical tabletop RPG set in Alpha Complex, a vast underground dystopian society governed by the deranged artificial intelligence known as Friend Computer. Players take the roles of **Troubleshooters** — Red-clearance citizens sent on dangerous missions to root out Commie Mutant Traitors. Ironically, every Troubleshooter is themselves a mutant and a member of an illegal secret society.

The game is deliberately comedic and lethal. Player characters are expected to die frequently; each citizen has a batch of **six identical clone bodies**, activated in sequence upon death. The atmosphere combines bureaucratic absurdity, dark humour, and deliberate betrayal between players.

### Character Creation Philosophy

Character creation in 2nd Edition is fast and largely random. Attributes are rolled with a d20, service group may be rolled randomly, and both the character's secret mutation and secret society membership are assigned randomly (rolled with a d20). The character sheet is divided into a **public page** (attributes, skills, equipment, service group) and a **secret page** (mutation, secret society, hidden notes) — players are expected to keep these separate and lie about their secret page contents.

Starting characters always begin at **Red clearance** — the lowest clearance level available to Troubleshooters.

---

## Creation Steps

### Step 1 — Character Name and Identity

**What the player does:** Choose or roll a character name following the Alpha Complex naming convention. Record player name and set starting clearance.

**Naming Convention:**

```
[FirstName]-[ClearanceColourLetter]-[SectorCode]-[CloneNumber]
```

- **FirstName:** A short given name, often containing a pun (e.g., Car, Evap, Joe).
- **ClearanceColourLetter:** Single letter for current clearance colour. All new characters start at **R** (Red).
- **SectorCode:** Three-letter code identifying the sector of Alpha Complex where the character is stationed (e.g., PET, MAN). Chosen by the GM or player.
- **CloneNumber:** Integer starting at **1**. Increments by 1 each time the character is terminated and a new clone is activated.

**Examples:** `Car-R-PET-1`, `Evap-R-ATE-1`, `Joe-R-XYZ-1`

**Random Name (legacy implementation):** Generates `Joe-` + 3 random uppercase letters + `-R-1`.

**Clearance Radio Buttons (on sheet):** IR, R, O, Y, G, B, I, V, UV (see Clearance Colour System in Special Mechanics).

---

### Step 2 — Roll Attributes

**What the player does:** Roll **1d20** for each of the eight core attributes. All attributes have a range of **1–20**.

**Re-roll Rule (per TardisCaptain walkthrough):** Players may re-roll their two lowest attribute results, but must accept the second roll regardless of its value.

#### The Eight Attributes

| Attribute | Abbreviation | Description |
|---|---|---|
| Strength | STR | Physical power; governs melee damage, carrying capacity |
| Endurance | END | Damage tolerance; governs Macho Bonus |
| Agility | AGI | Coordination, dodging, balance; governs Agility skill group |
| Dexterity | DEX | Hand-eye coordination, ranged accuracy; governs Dexterity skill group |
| Moxie | MOX | Intelligence, comprehension, perception; governs Moxie skill group |
| Chutzpah | CHU | Social audacity, nerve, persuasion; governs Chutzpah skill group |
| Mechanical Aptitude | MechA | Understanding and operating machinery; governs Mechanical skill group |
| Mutant Power | POW | Strength of the character's secret mutant ability |

**Dice:** All eight attributes use **d20** (roll once each, range 1–20).

---

### Step 3 — Calculate Derived Statistics

All derived statistics are automatically calculated from attribute values. These fields are **read-only** on the character sheet.

#### 3a — Attribute Bands (for skill base lookup)

Attributes are converted to a **band value** (0–5) used to determine skill bases. The same band table is used for all attributes:

| Attribute Score | Band Value |
|---|---|
| 1–3 | 0 |
| 4–6 | 1 |
| 7–10 | 2 |
| 11–14 | 3 |
| 15–17 | 4 |
| 18–20 | 5 |

*(From init.json `attributes.bands`: thresholds at 1→0, 4→1, 7→2, 11→3, 15→4, 18→5)*

#### 3b — Skill Bases (five values)

Each of the five skill-linked attributes (Agility, Dexterity, Moxie, Chutzpah, Mechanical Aptitude) generates a **Skill Base** value used as the starting value for all skills in that group.

**Skill Base Band Table** (from init.json `skillbases.skillbase_bands`):

| Attribute Score | Skill Base |
|---|---|
| 1–3 | 0 |
| 4–6 | 1 |
| 7–9 | 2 |
| 10–13 | 3 |
| 14–16 | 4 |
| 17–20 | 5 |

*(Thresholds: score > 0 → 0, score > 3 → 1, score > 6 → 2, score > 10 → 3, score > 14 → 4, score > 17 → 5)*

The five derived skill bases:
- **Agility Skill Base** — derived from Agility; applies to Agility Skills
- **Dexterity Skill Base** — derived from Dexterity; applies to Dexterity Skills
- **Moxie Skill Base** — derived from Moxie; applies to Moxie Skills
- **Chutzpah Skill Base** — derived from Chutzpah; applies to Chutzpah Skills
- **Mechanical Skill Base** — derived from Mechanical Aptitude; applies to Mechanical Skills

#### 3c — Damage Bonus

Derived from **Strength**:

| Strength Score | Damage Bonus |
|---|---|
| 1–13 | 0 |
| 14–18 | +1 |
| 19–20 | +2 |

*(From main.js: `if STR > 13 → 1; if STR > 18 → 2`)*

#### 3d — Macho Bonus

Derived from **Endurance**:

| Endurance Score | Macho Bonus |
|---|---|
| 1–13 | 0 |
| 14–18 | +1 |
| 19–20 | +2 |

*(From main.js: `if END > 13 → 1; if END > 18 → 2`)*

#### 3e — Carrying Capacity

Derived from **Strength**, measured in **kilograms**:

| Strength Score | Carrying Capacity |
|---|---|
| 1–12 | 25 kg |
| 13 | 30 kg |
| 14 | 35 kg |
| 15 | 40 kg |
| 16 | 45 kg |
| 17 | 50 kg |
| 18 | 55 kg |
| 19 | 60 kg |
| 20 | 65 kg |

**Formula (from main.js):**
```
carrying_capacity_base = max(0, Strength - 12)
carrying_capacity = (carrying_capacity_base × 5) + 25
```

Minimum value is **25 kg** (for Strength ≤ 12).

---

### Step 4 — Choose or Roll Service Group

**What the player does:** Either choose a service group from the list of eight, or roll **1d20** to determine it randomly.

**Random Roll Table** (from main.js `randomServiceGroup()`):

| d20 Roll | Service Group |
|---|---|
| 1–2 | IntSec |
| 3–4 | Tech Services |
| 5–8 | HPD&MC |
| 9–11 | Armed Services |
| 12–14 | PLC |
| 15–16 | Power Services |
| 17–18 | R&D |
| 19–20 | CPU |

#### The Eight Service Groups

| Service Group | Full Name | d20 Band | Provides |
|---|---|---|---|
| IntSec | Internal Security | 1–2 | Security for all citizens; Termination Vouchers |
| Tech Services | Technical Services | 3–4 | Repairs |
| HPD&MC | Housing Preservation Development & Mind Control | 5–8 | Medicines and drugs |
| Armed Services | Armed Services (The Army) | 9–11 | Heavy Weaponry |
| PLC | Production, Logistics, and Commissary | 12–14 | Food, Clothes, Lasers |
| Power Services | Power Services | 15–16 | Big Devices and Vehicles |
| R&D | Research and Design (The East Wind) | 17–18 | Experimental devices |
| CPU | Central Processing Unit | 19–20 | Records of missions; witness of Troubleshooter actions |

#### Service Group Descriptions

**IntSec (Internal Security)**
Internal Security identifies and eliminates traitors within Alpha Complex. They are the secret police. Not all citizens are Good and Loyal — IntSec makes sure their treasonous behaviour is Being Watched. They provide Security for all Citizens, and Termination Vouchers.

**Tech Services (Technical Services)**
If it's broken (which it isn't), Tech Services can fix it. All manner of devices and weapons can be brought to them to repair. Happily, things don't need repairing often, do they Citizen?

**HPD&MC (Housing Preservation Development and Mind Control)**
HPD&MC is responsible for the health and welfare of all citizens. They house, clothe, provide medicines, and make sure that everyone is a Happy Citizen. Are you Happy?

**Armed Services (The Army)**
Armed Services protects Alpha Complex from invaders from without. The fact that no one has invaded Alpha Complex in its entire history is testament to their excellent work. These stalwart troops are armed to the teeth and prepared to die for the safety of the Complex.

**PLC (Production, Logistics, and Commissary)**
PLC provides needed goods and services — foodstuffs (Hot Fun! and Cold Fun!), drinks (Bouncy Bubble Beverage!), and clothing (One Size Fits All uniforms!). They also have all the lasers.

**Power Services**
Power Services provides power for the entire Complex. This difficult work typically involves standing around large poles drinking Hot Fun for many hours a day. They are also in charge of requisitioning large vehicles and devices.

**R&D (Research and Design)**
Research and Design are in charge of creating new, wonderful devices — marvels of technology that explore brave new worlds and carry out heretofore unknown functions. All Troubleshooters should be proud to have R&D's experimental prototypes at their side.

**CPU (Central Processing Unit)**
CPU ensures that all other service groups carry out their tasks in coordination with each other. They are essential to the flawless functioning of Alpha Complex, providing endless amounts of guiding hierarchy. Most significantly they help note potentially treasonous or promotional behaviour.

---

### Step 5 — Assign Skill Points

**What the player does:** Distribute **30 skill points** among individual skills. Each skill starts at its group's Skill Base value (calculated in Step 3b). Points are added on top of the skill base.

**Rules:**
- Starting skill points pool: **30**
- All skills begin at their Skill Base value (0–5) at no cost
- Points are spent to increase skills above the base
- Standard maximum per skill: **12**
- **Service group skills** can be raised to a maximum of **20** (highlighted on the sheet)
- The skill point counter decrements as points are allocated; it cannot go below 0
- Weapon Skill Number for the first weapon slot auto-populates from the Laser Weapons skill value

**Skill Base Assignment:** When attributes or service group change, all skills are reset to their current skill base value and the point pool resets to 30.

#### Service Group Skills (max 20 instead of 12)

Each service group grants an expanded cap (max 20) for a specific set of skills:

| Service Group | Skills with Max 20 |
|---|---|
| IntSec | Truncheon, Unarmed, Interrogation, Intimidation, Laser Weapons, Security, Surveillance |
| Tech Services | Spurious Logic, Autocar Op. & Maint., TransBot Op. & Maint., DocBot Op. & Maint., JackoBot Op. & Maint., ScruBot Op. & Maint., Electronic Engineering, Mechanical Engineering |
| HPD&MC | Bootlicking, Con, Forgery, Oratory, DocBot Op. & Maint., Biochemical Therapy, Medical |
| Armed Services | Grenade, Primitive Melee Weapons, Unarmed, Motivation, Laser Weapons, Projectile Weapons, Demolition, Survival, Vulturecraft Op. & Maint. |
| PLC | Bribery, Fast Talk, Forgery, Habitat Engineering, JackoBot Op. & Maint., Biosciences |
| Power Services | Spurious Logic, Habitat Engineering, JackoBot Op. & Maint., Chemical Engineering, Electronic Engineering, Mechanical Engineering, Nuclear Engineering |
| R&D | JackoBot Op. & Maint., Biosciences, Data Analysis, Data Search, Electronic Engineering, Mechanical Engineering |
| CPU | Fast Talk, Intimidation, Motivation, Psychescan, Security, Data Analysis, Data Search |

---

### Step 6 — Record Default Equipment

All starting Troubleshooters receive the same standard-issue kit at no cost. Starting credits: **100 Plasticredits**.

**Standard Issue Equipment (from init.json `default_equipments`):**

| Item | Notes |
|---|---|
| Red Reflect Armor | Armour type: L, Rating: 4 |
| Laser Pistol | Type: L, Damage: 8, Range: 20 |
| Red Laser Barrel | Ammunition/barrel for laser pistol |
| Jumpsuit | Standard Red clearance uniform |
| Utility Belt with Pouches | Standard issue carry gear |
| Comm Unit Type I | Standard communications device |
| Notebook & Stylus | For recording mission notes |

**Additional Equipment Purchases:** Players may spend Plasticredits to purchase additional items from the equipment list (see Data Tables — Equipment). All purchasable items are Red clearance.

---

### Step 7 — Record Weapons and Armour

The character sheet has **5 weapon slots**. Each slot records:
- Weapon name
- Skill Number (the relevant skill value)
- Type (weapon type code, e.g., L for Laser)
- Damage Rating (numerical value)
- Range
- Experimental (checkbox — marks R&D-issued prototype weapons)

**Slot 1 pre-filled:** Laser Pistol, Type L, Damage 8, Range 20. Skill Number auto-populates from the Laser Weapons skill value.

**Armour fields:**
- Armour Worn (text, default: `L`)
- Ratings (text, default: `4`)

---

### Step 8 — Secret Page: Roll Mutation

**What the player does:** Roll **1d20** to determine the character's secret mutant power. The result maps to position in the mutations list (1–20).

**Important:** Mutations are recorded on the **secret page** of the character sheet, which is kept hidden from other players. Possessing an unregistered mutation is **treasonous**. Registered mutants must wear a coloured stripe on their uniform.

**Roll:** 1d20 → index into mutations list (1-based)

**Mutations List (20 options, in order — from paranoia2nd.html dropdown):**

| d20 | Mutation | Type | Description / Effect |
|---|---|---|---|
| 1 | Adrenaline Control | Metabolic | Boosts Agility and Unarmed Combat to 18; confers a degree of superhuman strength and speed |
| 2 | Charm | Psionic | Basic use targets one other clone for a scene; harder push can affect multiple targets |
| 3 | Deep Probe | Psionic | Deep mental scan/probe of a target's thoughts or memories |
| 4 | Electroshock | Psionic | Touch-range electrical discharge; more power extends to ranged zap |
| 5 | Empathy | Psionic | Sense the emotional state of nearby persons |
| 6 | Energy Field | Metabolic | Generate a protective energy field around the body |
| 7 | Hypersenses | Metabolic | Enhanced sensory perception (hearing, sight, etc.) |
| 8 | Levitation | Psionic | Rise approximately 1 metre and move at walking pace; more power for height and speed |
| 9 | Machine Empathy | Psionic | Communicate with and understand machines and computers |
| 10 | Matter Eater | Metabolic | Consume and digest any material safely |
| 11 | Mechanical Intuition | Metabolic | Instinctive understanding of mechanical systems |
| 12 | Mental Blast | Psionic | Point-blank area-of-effect: nosebleeds and headaches; amplified to blackouts, injury, seizures, death |
| 13 | Polymorphism | Metabolic | Alter physical form and appearance |
| 14 | Precognition | Psionic | Glimpse possible near-future events |
| 15 | Pyrokinesis | Psionic | Ignite nearby flames; amplified to distant targets, larger fires |
| 16 | Regeneration | Metabolic | Accelerated healing of wounds |
| 17 | Telekinesis | Psionic | Move a small object mentally; amplified for larger items and precise manipulation |
| 18 | Telepathy | Psionic | Read dominant thought or implant a suggestion in one target |
| 19 | Teleport | Psionic | Personal teleportation; amplified to transport companions or greater distance |
| 20 | X-Ray Vision | Metabolic | See through solid objects |

**Note:** The Mutant Power attribute (POW, rolled in Step 2) governs the effectiveness of the active mutation. Higher POW scores enable more powerful applications.

---

### Step 9 — Secret Page: Roll Secret Society

**What the player does:** Roll **1d20** to determine secret society membership. The result maps to position in the secret societies list (1–17, with 18–20 potentially falling on "Other" or repeating — see CLARIFICATIONS_NEEDED).

**Important:** Secret society membership is **treasonous**. The secret page is kept hidden from all other players.

**Roll:** 1d20 → index into secret societies list (1-based)

**Secret Societies List (17 named options + "Other", from paranoia2nd.html dropdown):**

| # | Society | Ideology / Goals |
|---|---|---|
| 1 | Anti-Mutant | Eradicate mutants from Alpha Complex. Schismatic, paranoid, violently anti-mutant. |
| 2 | Computer Phreaks | Hack Computer terminals, credit licences, and records. Followers of the "Open Source Computing Initiative". Friendly with Pro Tech; hostile to FCCC-P. |
| 3 | Communists | Overthrow The Computer, smash the machinery of capitalist oppression, power to the proletariat. Classic Marxist ideology transplanted into Alpha Complex. |
| 4 | Corpore Metal | Believe bots and AIs are the next stage of evolution; humans should help them achieve supremacy. Friendly with Pro Tech; hostile to Frankenstein Destroyers, Humanists, PURGE. |
| 5 | Death Leopard | Blow things up, vandalize, defy authority. No deeper ideology — just chaos and fun. |
| 6 | FCCCP | First Church of Christ Computer Programmer. Worship The Computer as a divine entity. Functions as a false front for the sector's Program Group. |
| 7 | Frankenstein Destroyers | Luddite society: robots are the cause of all mankind's problems. Focused primarily on destroying the AI menace; general hostility to all technology. |
| 8 | Free Enterprise | Pseudo-mafia capitalism. Run the Infrared black markets in Alpha Complex. Adopt stereotypical organised-crime trappings. |
| 9 | Humanists | Aware that The Computer is insane; strive to improve Alpha Complex by installing hidden backdoor codes, reprogramming rogue bots, and planning eventual restoration of power to the people. |
| 10 | Illuminati | Deeply secretive; most members don't know the organisation's actual goals. Members receive inscrutable orders; most pose as members of another society as cover. |
| 11 | Mystics | Founded by those seeking enlightenment; in practice primarily focused on recreational drug use. |
| 12 | Pro Tech | Love gadgets and experimental technology. Advance through stealing cool equipment and reprogramming bots. Friendly with Corpore Metal and Computer Phreaks; hostile to Frankenstein Destroyers and PURGE. |
| 13 | Psion | Run by the "Controls" — a hidden network of telepathic mutants. Seek to pave the way for a mutant-run future. |
| 14 | PURGE | Active terrorist organisation seeking violent overthrow of The Computer. No plan for what comes after — just destruction. |
| 15 | Romantics | Obsessed with forbidden lore of the "Old Reckoning" (pre-Alpha Complex history). Information they have is fragmentary and often wrong. Different sects focus on different historical aspects. |
| 16 | Sierra Club | Obsessed with the environment and the mysterious "Outdoors", access to which The Computer strictly limits. |
| 17 | Other | Catch-all for custom or campaign-specific secret societies. |

---

### Step 10 — Notes

Both the public and secret pages include a **Notes / textarea** field for the player and GM to record mission-relevant information, society instructions, mutation details, and other in-character notes.

---

## Special Mechanics

### The Two-Page Character Sheet

The Paranoia 2nd Edition character sheet is explicitly divided into two physical pages:

1. **Public Page (Page 1):** Character name, player name, clearance colour, service group, all eight attributes, derived statistics, all skills with skill bases and point allocation, weapons and armour, equipment list, starting credits.

2. **Secret Page (Page 2):** Mutation name and Power Index value, secret society membership, any secret equipment or bribes received, hidden notes. **This page must be concealed from all other players at all times.**

Sharing information from the secret page is a roleplaying violation in-game (and also part of the fun).

### Clearance Colour System

Alpha Complex uses a nine-level colour-coded security clearance system. Citizens' names incorporate their clearance letter. Access to areas, information, and equipment is restricted by clearance. Wearing or accessing anything above one's clearance is **treasonous**.

| # | Clearance | Colour Code | Notes |
|---|---|---|---|
| 1 | INFRARED (IR) | Black | Lowest level. Mindless drudgery, heavy medication. Essentially slave labour. |
| 2 | RED (R) | Red | Starting level for all Troubleshooters. |
| 3 | ORANGE (O) | Orange | First promotion level. |
| 4 | YELLOW (Y) | Yellow | Mid-tier clearance. |
| 5 | GREEN (G) | Green | Upper-middle clearance. |
| 6 | BLUE (B) | Blue | Senior clearance. |
| 7 | INDIGO (I) | Indigo | High clearance. |
| 8 | VIOLET (V) | Violet | Near-top clearance. |
| 9 | ULTRAVIOLET (UV) | White | Highest level. "High Programmers". Only citizens who may legally access and modify The Computer's programming. Essentially unrestricted. |

**In the sheet UI:** Clearance is recorded as a radio button selection. The colour letter is embedded in the character's name.

**Advancement:** Requires accumulating Commendation Points (2 Commendation Points per rank advancement).

### Clone System

Every citizen of Alpha Complex is produced in a clone vat as part of a batch of **six identical clones**. When a character is killed, the next clone in the batch is activated within minutes. The clone number in the character's name increments with each death (e.g., `-1`, `-2` … `-6`). Upon death of the sixth clone, the character is permanently eliminated.

Clones may have different starting credits or prestige, but skills do not automatically transfer between clones.

### Treason Points and Commendation Points

These two counters track a character's standing with Friend Computer:

- **Commendation Points:** Earned through successful missions and loyal behaviour. Required for clearance promotion.
- **Treason Points:** Accumulated through treasonous actions (use of unregistered mutations, secret society activities, accessing above-clearance areas, etc.). If Treason Points exceed Commendation Points by 10 or more, Friend Computer issues an execution order.

### The Computer (Friend Computer)

Friend Computer is omnipresent, nominally all-knowing, and deeply unstable. It believes Alpha Complex faces constant threats from Communists and mutants, which is why it created Troubleshooter teams. Mechanically, Friend Computer serves as a non-player authority that can be invoked, interrogated, or pleaded with. It has a flaw-prone flowchart-based decision logic. Lying to The Computer successfully requires Chutzpah-based skill checks.

### Spurious Logic (Skill)

The Chutzpah-based skill "Spurious Logic" functions as a Con and Fast Talk equivalent specifically designed for use against Bots and computers. This reflects Alpha Complex's abundance of robotic and computer systems that Troubleshooters must regularly deceive.

### Treasonous Skills

Two skills are explicitly labelled treasonous to use:
- **Bribery** — trading items for services is illegal
- **Forgery** — faking forms and signatures is illegal

Using these skills successfully may accomplish goals but also generates Treason Points.

---

## Data Tables

### Attributes

| Name (field) | Label | Dice | Range |
|---|---|---|---|
| strength | Strength | d20 | 1–20 |
| endurance | Endurance | d20 | 1–20 |
| agility | Agility | d20 | 1–20 |
| dexterity | Dexterity | d20 | 1–20 |
| moxie | Moxie | d20 | 1–20 |
| chutzpah | Chutzpah | d20 | 1–20 |
| mech | Mech. Apt. | d20 | 1–20 |
| mutant_power | Mutant Power | d20 | 1–20 |

### Derived Statistics

| Name (field) | Label | Formula | Min | Max |
|---|---|---|---|---|
| agility_skill_base | Agility Skill Base | Skillbase band table on Agility | 0 | 5 |
| dexterity_skill_base | Dexterity Skill Base | Skillbase band table on Dexterity | 0 | 5 |
| moxie_skill_base | Moxie Skill Base | Skillbase band table on Moxie | 0 | 5 |
| chutzpah_skill_base | Chutzpah Skill Base | Skillbase band table on Chutzpah | 0 | 5 |
| mech_skill_base | Mech Skill Base | Skillbase band table on Mech. Apt. | 0 | 5 |
| damage_bonus | Damage Bonus | 0 if STR≤13; 1 if STR 14–18; 2 if STR 19–20 | 0 | 2 |
| macho_bonus | Macho Bonus | 0 if END≤13; 1 if END 14–18; 2 if END 19–20 | 0 | 2 |
| carrying_capacity | Carrying Capacity (kg) | `max(0, STR−12) × 5 + 25` | 25 | 65 |

### Skills — Complete List

#### Agility Skills (governed by Agility Skill Base)

| Field Name | Label | Description |
|---|---|---|
| skill_force_sword | Force Sword | Melee Combat skills. |
| skill_grenade | Grenade | Missile Combat skills. |
| skill_neurowhip | Neurowhip | Melee Combat skills. |
| skill_primitive_melee_weapons | Primitive Melee Weapons | Melee Combat skills. |
| skill_truncheon | Truncheon | Melee Combat skills. |
| skill_unarmed | Unarmed | Melee Combat skills. |

#### Chutzpah Skills (governed by Chutzpah Skill Base)

| Field Name | Label | Description |
|---|---|---|
| skill_bootlicking | Bootlicking | Ingratiating yourself with your superiors. |
| skill_bribery | Bribery | Trading items for services. **Use of this skill is Treasonous.** |
| skill_con | Con | Persuading someone to let you do something that they probably shouldn't. |
| skill_fast_talk | Fast Talk | Like Con, but quicker. Getting past guards at a checkpoint. |
| skill_forgery | Forgery | Faking forms and signatures. **Use of this skill is Treasonous.** |
| skill_interrogation | Interrogation | Extracting useful information from Commie scum. |
| skill_intimidation | Intimidation | Getting cooperation from your inferiors. |
| skill_motivation | Motivation | Getting a few people thinking your idea is a good idea. |
| skill_oratory | Oratory | Speech-giving. Motivation for large groups. |
| skill_psychescan | Psychescan | Lie detection when talking to someone. |
| skill_spurious_logic | Spurious Logic | Con & Fast Talk for use against Bots and computers. |

#### Dexterity Skills (governed by Dexterity Skill Base)

| Field Name | Label | Description |
|---|---|---|
| skill_energy_weapons | Energy Weapons | Missile Combat skills. Includes repairing them. |
| skill_field_weapons | Field Weapons | Missile Combat skills. Includes repairing them. |
| skill_laser_weapons | Laser Weapons | Missile Combat skills. Includes repairing them. |
| skill_projectile_weapons | Projectile Weapons | Missile Combat skills. Includes repairing them. |
| skill_primitive_missile_weapons | Primitive Missile Weapons | Bow and arrows, Bouncy Bubble Beverage containers… |
| skill_vehicle_aimed_weapons | Vehicle Aimed Weapons | Vehicle Combat skills. |
| skill_vehicle_field_weapons | Vehicle Field Weapons | Vehicle Combat skills. |
| skill_vehicle_launched_weapons | Vehicle Launched Weapons | Vehicle Combat skills. |

#### Mechanical Aptitude Skills (governed by Mech Skill Base)

| Field Name | Label | Description |
|---|---|---|
| skill_habitat_engineering | Habitat Engineering | Knowledge of the air, comm, transport, water, and waste systems. |
| skill_jackobot_operation | JackoBot Operation and Maintenance | How to use and repair the various types of bots. |
| skill_docbot_operation | DocBot Operation and Maintenance | How to use and repair the various types of bots. |
| skill_transbot_operation | TransBot Operation and Maintenance | How to use and repair the various types of bots. |
| skill_scrubot_operation | ScruBot Operation and Maintenance | How to use and repair the various types of bots. |
| skill_vulturecraft_operation | Vulturecraft Operation and Maintenance | How to use and repair various vehicle types. |
| skill_autocar_operation | Autocar Operation and Maintenance | How to use and repair various vehicle types. |

#### Moxie Skills (governed by Moxie Skill Base)

| Field Name | Label | Description |
|---|---|---|
| skill_biochemical_therapy | Biochemical Therapy | Better living through Chemistry. |
| skill_biosciences | Biosciences | Making mutant monsters. |
| skill_chemical_engineering | Chemical Engineering | Mixing chemicals, often with explosive results. |
| skill_data_analysis | Data Analysis | Making sense of Computer-printed materials. |
| skill_data_search | Data Search | Finding information using Friend Computer. |
| skill_demolition | Demolition | Blowing big things up without blowing yourself up too. |
| skill_electronic_engineering | Electronic Engineering | Making electronic devices from resistors and capacitors. |
| skill_mechanical_engineering | Mechanical Engineering | Rube Goldberg contraptions and such. |
| skill_medical | Medical | Healing injured Citizens. |
| skill_nuclear_engineering | Nuclear Engineering | If you want to stop a reactor from melting down, you need this. |
| skill_old_reckoning_cultures | Old Reckoning Cultures | Knowledge of Pre-Oops people and things. |
| skill_security | Security | Disabling locks and alarms. |
| skill_stealth | Stealth | The art of not being seen. |
| skill_surveillance | Surveillance | Bugging and debugging things. |
| skill_survival | Survival | How to live Outdoors without generating clone replacements. |

**Total skills: 46** (6 Agility + 11 Chutzpah + 8 Dexterity + 7 Mechanical + 14 Moxie)

> **Note:** The legacy init.json lists "skill_suprious_logic" (typo) for the Chutzpah group. The correct label in the HTML is "Spurious Logic". The field name in the data should be normalised to `skill_spurious_logic`.

### Service Groups — Full Data

| Label | Band Threshold | Description | Provides |
|---|---|---|---|
| IntSec | 0–2 | Internal Security — the secret police | Security; Termination Vouchers |
| Tech Services | 3–4 | Technical Services — repair everything | Repairs |
| HPD&MC | 5–8 | Housing Preservation Development & Mind Control | Medicines and drugs |
| Armed Services | 9–11 | The Army — protects from external threats | Heavy Weaponry |
| PLC | 12–14 | Production, Logistics, Commissary | Food, Clothes, Lasers |
| Power Services | 15–16 | Maintains power, transport, large equipment | Big Devices and Vehicles |
| R&D | 17–18 | Research and Design — experimental technology | Experimental devices |
| CPU | 19–20 | Central Processing Unit — coordination and records | Mission records; Witness services |

### Mutations — Full List

| d20 | Field Label | Type |
|---|---|---|
| 1 | Adrenaline Control | Metabolic |
| 2 | Charm | Psionic |
| 3 | Deep Probe | Psionic |
| 4 | Electroshock | Psionic |
| 5 | Empathy | Psionic |
| 6 | Energy Field | Metabolic |
| 7 | Hypersenses | Metabolic |
| 8 | Levitation | Psionic |
| 9 | Machine Empathy | Psionic |
| 10 | Matter Eater | Metabolic |
| 11 | Mechanical Intuition | Metabolic |
| 12 | Mental Blast | Psionic |
| 13 | Polymorphism | Metabolic |
| 14 | Precognition | Psionic |
| 15 | Pyrokinesis | Psionic |
| 16 | Regeneration | Metabolic |
| 17 | Telekinesis | Psionic |
| 18 | Telepathy | Psionic |
| 19 | Teleport | Psionic |
| 20 | X-Ray Vision | Metabolic |

### Secret Societies — Full List

| # | Name | Core Ideology |
|---|---|---|
| 1 | Anti-Mutant | Eradicate all mutants |
| 2 | Computer Phreaks | Open-source hacking of Computer systems |
| 3 | Communists | Overthrow The Computer; Marxist revolution |
| 4 | Corpore Metal | Bot/AI supremacy; help machines rule |
| 5 | Death Leopard | Chaos, vandalism, and defiance of authority |
| 6 | FCCCP | Worship The Computer as God |
| 7 | Frankenstein Destroyers | Destroy all bots and AI; extreme Luddism |
| 8 | Free Enterprise | Pseudo-mafia capitalism; run Infrared black markets |
| 9 | Humanists | Reform Alpha Complex; restore power to humans |
| 10 | Illuminati | Inscrutable hidden goals; members don't know them |
| 11 | Mystics | Enlightenment through recreational drug use |
| 12 | Pro Tech | Gadget obsession; steal and repurpose experimental tech |
| 13 | Psion | Mutant-run future, led by telepathic "Controls" |
| 14 | PURGE | Violent overthrow of The Computer (no post-plan) |
| 15 | Romantics | Obsession with forbidden Old Reckoning history |
| 16 | Sierra Club | Obsession with the Outdoors and environment |
| 17 | Other | Custom / campaign-specific society |

### Equipment — Available for Purchase

Starting Plasticredits: **100**

All items are **Red clearance**.

| Cost (Plasticredits) | Item |
|---|---|
| 1 | Bag of Cruncheetym Algae Chips |
| 3 | Boot Polish |
| 5 | Bottle of Bouncy Bubble Beverage |
| 5 | Bottle of Super Shine Mouthwash |
| 1 | Bucket |
| 50 | Bullhorn |
| 2 | Cold Fun in a self-sealing puck |
| 25 | First Aid Kit |
| 10 | Flashlight |
| 50 | Gas Mask |
| 2 | Happiness Energy Bar |
| 100 | Hottorch |
| 5 | Official Teela-O Picture Mirror |
| 25 | Personal Hygiene Kit |
| 50 | Personalized Jumpsuit |
| 12 | Pillow |
| 1 | Plasticord (1 credit per metre) |
| 15 | Poncho |
| 25 | Smoke Alarm |
| 25 | SuperGum |
| 25 | SuperGum Solvent |
| 25 | Thermos |
| 8 | Troubleshooting and You! Pamphlet |
| 5 | Velcro Strip (5 credits per metre) |

### Clearance Colours

| Code | Colour | Notes |
|---|---|---|
| IR | Infrared (Black) | Lowest; heavy medication; mindless drudgery |
| R | Red | Starting level for Troubleshooters |
| O | Orange | First promotion |
| Y | Yellow | Mid-tier |
| G | Green | Upper-middle |
| B | Blue | Senior |
| I | Indigo | High |
| V | Violet | Near-top |
| UV | Ultraviolet (White) | Highest; High Programmers; can modify The Computer |

---

## CLARIFICATIONS_NEEDED

1. **Secret Society d20 mapping:** The secret societies dropdown contains 17 named entries plus "Other" (18 total), but random selection uses a d20 (1–20). The legacy `randomSecretSociate()` function rolls 1d20 and sets the dropdown's `.val()` to the number directly, implying entries 18, 19, and 20 on the d20 map to indices that either wrap around or extend into undefined entries. **Ambiguity:** It is unclear whether rolls of 18–20 map to "Other", whether the list has additional societies not shown in the HTML, or whether the roll is meant to be capped at 17 (re-roll 18–20). The implementation should clarify this.

2. **Attribute bands vs. skill base bands:** The init.json defines two separate band tables — `attributes.bands` (used for the general attribute band display) and `skillbases.skillbase_bands` (used for calculating skill base values). These use different thresholds (e.g., `attributes.bands` has a breakpoint at 11→3, while `skillbases.skillbase_bands` has a breakpoint at 10→3). The skill base band table is the authoritative source for calculating skill starting values.

3. **Mutation type classification (Metabolic vs. Psionic):** The 2nd Edition rulebook distinguishes between Metabolic and Psionic mutations, but the legacy implementation does not store this distinction. The type column in the mutations table above is inferred from the Paranoia XP/Rebooted editions and community references. **Ambiguity:** The exact 2nd Edition categorisation for each mutation has not been verified against the printed rulebook.

4. **Attribute dice variants:** The legacy implementation uses d20 for all eight attributes. A separate community reference (the RPG Writeups PARANOIA entry) notes some attributes using `1d10+8` or `2d10`. This may reflect an earlier printing or alternate rules. **The legacy implementation (d20 for all attributes) is adopted as canonical for this project.**

5. **Starting equipment allocation:** The TardisCaptain walkthrough notes the rulebook lacks explicit starting equipment allocation guidance and players must reference sample characters. The legacy implementation uses a fixed default loadout (Red Reflect Armor, Laser Pistol, Red Laser Barrel, Jumpsuit, Utility Belt, Comm Unit, Notebook & Stylus) plus 100 Plasticredits. This is adopted as canonical.

6. **Skill point maximum for service group skills:** The legacy implementation sets service group skills to max 20 (vs. 12 for others). This is not universally documented in community references but is clear and consistent in the implementation code. Adopted as canonical.

7. **"Spurious Logic" field name typo:** The init.json spells this `skill_suprious_logic` (transposed 'r' and 'i'). The HTML label correctly reads "Spurious Logic". The new implementation should use the correctly spelled field name `skill_spurious_logic`.

8. **Tech Services group name discrepancy:** init.json labels this group "Tec Services" (missing the 'h'), but the HTML and all other references use "Tech Services". The correct name is **Tech Services**.
