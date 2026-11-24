import {
  useState,
  useEffect,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Map,
  Sprout,
  CloudSun,
  Leaf,
  MessageSquare,
  Settings,
  Search,
  Bell,
  ChevronDown,
  MapPin,
  CloudRain,
  Sun,
  Wind,
  ArrowUpRight,
  Plus,
  Menu,
  Languages,
  Wheat,
  ClipboardList,
  Info,
  Phone,
  Eye,
  X,
  UserPlus,
  CheckCircle,
  Droplets,
  Thermometer,
  Activity,
  Bot,
  Send,
  Save,
  AlertTriangle,
  Database,
  CalendarDays,
  ShieldCheck,
  FileText,
  RefreshCw,
  Trash2,
  BarChart3,
  Cloud,
  Sprout as SproutIcon,
} from "lucide-react";

import "./App.css";

const translations = {
  en: {
    dashboard: "Dashboard",

    farmers: "Farmers",

    parcels: "Farm Parcels",

    soil: "Soil Intelligence",

    weather: "Weather & Climate",

    open: "Open Crop Recommendation",

    received: "Received Crop Advisory",

    assistant: "AI Assistant",

    settings: "Settings",

    mainMenu: "MAIN MENU",

    growing: "Growing a smarter future",

    support: "Technology supporting Rwanda's farmers.",

    admin: "Project Administrator",

    search: "Search farmers, parcels...",

    platform: "SMART AGRICULTURE PLATFORM",

    greeting: "Good morning, AgriNova!",

    welcome:
      "Helping farmers make better decisions through parcel-specific agricultural intelligence.",

    addFarmer: "Add New Farmer",

    heroTag: "AGRICULTURE MEETS TECHNOLOGY",

    heroTitle: "Empowering Rwanda's farmers with smarter decisions.",

    heroText:
      "Bringing together soil intelligence, weather insights and agricultural knowledge to support every farm.",

    exploreParcels: "Explore Farm Parcels",

    overview: "Platform Overview",

    demoInfo: "A quick look at the platform's demo information.",

    demo: "DEMO DATA",

    sample: "Sample",

    farmersRegistered: "Registered Farmers",

    farmParcels: "Farm Parcels",

    assessments: "Crop Assessments",

    weatherChecks: "Weather Checks",

    illustrative: "Illustrative demo figure",

    weatherOverview: "Weather Overview",

    illustrativeWeather: "Illustrative weather display",

    sampleLocation: "Sample location",

    partlyCloudy: "Partly cloudy",

    wind: "Wind",

    rainChance: "Rain chance",

    insights: "Smart Agricultural Insights",

    aims: "What AgriNova aims to provide",

    soilInsight: "Soil intelligence",

    soilText: "Understand soil conditions for individual parcels.",

    climate: "Climate awareness",

    climateText: "Use weather information to understand possible risks.",

    suitability: "Crop suitability",

    suitabilityText: "Assess crops using parcel conditions and crop needs.",

    exploreAgriculture: "Explore Agriculture",

    glimpse: "A glimpse of the agricultural environment we support.",

    exploreCrops: "Explore crops",

    land: "FARM LAND",

    landscapes: "Healthy agricultural landscapes",

    production: "CROP PRODUCTION",

    decisions: "Supporting better crop decisions",

    farmersLabel: "FARMERS",

    centre: "Putting farmers at the centre",

    footer: "Innovating Agriculture, Empowering Farmers.",

    built: "Built for Smart Farmer Rwanda",

    openTitle: "Open Crop Recommendation",

    openIntro:
      "For farmers who can choose what to plant. AgriNova assesses the parcel and identifies crops that may suit its conditions.",

    parcel: "Select farm parcel",

    parcelPlaceholder: "Choose a parcel",

    season: "Growing season",

    seasonPlaceholder: "Choose a season",

    currentSeason: "Current season",

    nextSeason: "Next season",

    assess: "Assess suitable crops",

    demoNotice:
      "Prototype preview: this screen does not yet calculate real crop suitability. It will use parcel soil data, weather information and verified crop requirements after those services are connected.",

    receivedTitle: "Received Crop Advisory",

    receivedIntro:
      "For farmers who have already received seeds or have a crop they are expected to cultivate.",

    cropReceived: "Which crop did the farmer receive?",

    provider: "Who provided the seeds?",

    providerPlaceholder: "Select provider",

    organisation: "Agricultural organisation",

    cooperative: "Cooperative",

    government: "Government programme",

    other: "Other",

    variety: "Seed variety (if known)",

    varietyPlaceholder: "Enter variety, or leave blank",

    required: "Is the farmer expected to plant this crop?",

    yes: "Yes, expected to plant it",

    optional: "No, the farmer can choose",

    unsure: "Not sure",

    assessReceived: "Assess this received crop",

    advisoryNotice:
      "The advisory will compare the received crop with the parcel's soil and weather conditions. If important risks or missing information are found, AgriNova should explain them and recommend speaking with an agricultural extension officer or the supplying organisation.",

    advisoryResult: "Advisory preview",

    resultText:
      "After the farmer submits the information, AgriNova will show the crop suitability assessment, possible risks, practical guidance and any reasons to seek expert advice.",

    selectCrop: "Select a crop",

    maize: "Maize",

    beans: "Beans",

    rice: "Rice",

    potatoes: "Irish potatoes",

    sorghum: "Sorghum",

    submitRequired: "Please select a parcel and complete the required fields.",
  },

  rw: {
    dashboard: "Ahabanza",

    farmers: "Abahinzi",

    parcels: "Imirima",

    soil: "Amakuru ku butaka",

    weather: "Ikirere n'imihindagurikire yacyo",

    open: "Guhitamo igihingwa",

    received: "Inama ku mbuto bahawe",

    assistant: "Umufasha wa AI",

    settings: "Igenamiterere",

    mainMenu: "IBIKUBIYE MURI POROGARAMU",

    growing: "Duteze imbere ubuhinzi",

    support: "Ikoranabuhanga rifasha abahinzi b'u Rwanda.",

    admin: "Ushinzwe umushinga",

    search: "Shakisha abahinzi cyangwa imirima...",

    platform: "URUBUGA RW'UBUHINZI BW'UBWENGE",

    greeting: "Mwaramutse, AgriNova!",

    welcome:
      "Dufasha abahinzi gufata ibyemezo byiza dukoresheje amakuru yihariye ya buri murima.",

    addFarmer: "Ongeramo umuhinzi",

    heroTag: "UBUHINZI BUHUYE N'IKORANABUHANGA",

    heroTitle: "Dufasha abahinzi b'u Rwanda gufata ibyemezo byiza.",

    heroText:
      "Duhuza amakuru y'ubutaka, ikirere n'ubumenyi ku buhinzi kugira ngo dufashe buri murima.",

    exploreParcels: "Reba imirima",

    overview: "Incamake y'urubuga",

    demoInfo: "Reba amakuru y'icyitegererezo ari muri porogaramu.",

    demo: "AMAKURU Y'ICYITEGEREREZO",

    sample: "Icyitegererezo",

    farmersRegistered: "Abahinzi biyandikishije",

    farmParcels: "Imirima",

    assessments: "Isuzuma ry'ibihingwa",

    weatherChecks: "Igenzura ry'ikirere",

    illustrative: "Umubare w'icyitegererezo",

    weatherOverview: "Incamake y'ikirere",

    illustrativeWeather: "Ikirere cy'icyitegererezo",

    sampleLocation: "Ahantu h'icyitegererezo",

    partlyCloudy: "Ibicu bike",

    wind: "Umuyaga",

    rainChance: "Amahirwe y'imvura",

    insights: "Amakuru y'ubuhinzi",

    aims: "Ibyo AgriNova izafasha gukora",

    soilInsight: "Amakuru ku butaka",

    soilText: "Kumenya uko ubutaka bw'umurima buri.",

    climate: "Imihindagurikire y'ikirere",

    climateText:
      "Gukoresha amakuru y'ikirere kugira ngo hamenyekane ibyago bishoboka.",

    suitability: "Ibihingwa bikwiriye umurima",

    suitabilityText:
      "Gusuzuma ibihingwa hashingiwe ku butaka n'ibyo igihingwa gikeneye.",

    exploreAgriculture: "Menya iby'ubuhinzi",

    glimpse: "Urugero rw'ubuhinzi dushyigikira.",

    exploreCrops: "Reba ibihingwa",

    land: "UBUTAKA",

    landscapes: "Imirima iteye neza",

    production: "UMUSARURO",

    decisions: "Gufasha gufata ibyemezo ku bihingwa",

    farmersLabel: "ABAHINZI",

    centre: "Umuhinzi ni we uza ku isonga",

    footer: "Duteza imbere ubuhinzi, tugafasha abahinzi.",

    built: "Byakorewe Smart Farmer Rwanda",

    openTitle: "Guhitamo igihingwa gikwiriye umurima",

    openIntro:
      "Ku bahinzi bashobora guhitamo icyo bahinga. AgriNova isuzuma umurima ikanagaragaza ibihingwa bishobora kuwukwiriye.",

    parcel: "Hitamo umurima",

    parcelPlaceholder: "Hitamo umurima",

    season: "Igihe cy'ihinga",

    seasonPlaceholder: "Hitamo igihe",

    currentSeason: "Igihembwe kiriho",

    nextSeason: "Igihembwe gitaha",

    assess: "Suzuma ibihingwa bikwiriye",

    demoNotice:
      "Icyitegererezo: iyi paji ntirakora isuzuma nyakuri. Izakoresha amakuru y'ubutaka, ikirere n'ibisabwa n'ibihingwa nitumara kuyihuza n'izo serivisi.",

    receivedTitle: "Inama ku gihingwa bahawe",

    receivedIntro:
      "Ku bahinzi bahawe imbuto cyangwa basabwa guhinga igihingwa runaka.",

    cropReceived: "Umuhinzi yahawe imbuto z'ikihe gihingwa?",

    provider: "Ni nde watanze imbuto?",

    providerPlaceholder: "Hitamo uwazitanze",

    organisation: "Ikigo gifasha abahinzi",

    cooperative: "Koperative",

    government: "Gahunda ya Leta",

    other: "Abandi",

    variety: "Ubwoko bw'imbuto (niba buzwi)",

    varietyPlaceholder: "Andika ubwoko, cyangwa usige ubusa",

    required: "Ese umuhinzi asabwa guhinga iki gihingwa?",

    yes: "Yego, asabwa kukihinga",

    optional: "Oya, ashobora guhitamo",

    unsure: "Ntibizwi neza",

    assessReceived: "Suzuma iki gihingwa bahawe",

    advisoryNotice:
      "Inama izagereranya igihingwa bahawe n'imiterere y'ubutaka n'ikirere. Iyo hari ibyago cyangwa amakuru abura, AgriNova izabisobanura inagire inama yo kugisha inama umukozi ushinzwe ubuhinzi cyangwa ikigo cyatanze imbuto.",

    advisoryResult: "Urugero rw'inama",

    resultText:
      "Nyuma yo kohereza amakuru, AgriNova izerekana uko igihingwa gihuye n'umurima, ibyago bishoboka, inama z'ubuhinzi n'igihe cyo kugisha inama inzobere.",

    selectCrop: "Hitamo igihingwa",

    maize: "Ibigori",

    beans: "Ibishyimbo",

    rice: "Umuceri",

    potatoes: "Ibirayi",

    sorghum: "Amasaka",

    submitRequired: "Hitamo umurima kandi wuzuze ibisabwa.",
  },
};

const cropOptions = [
  { value: "Maize", en: "Maize", rw: "Ibigori" },

  { value: "Beans", en: "Beans", rw: "Ibishyimbo" },

  { value: "Rice", en: "Rice", rw: "Umuceri" },

  { value: "Irish potatoes", en: "Irish potatoes", rw: "Ibirayi" },

  { value: "Sorghum", en: "Sorghum", rw: "Amasaka" },
];

const initialFarmers = [
  {
    id: "F001",
    name: "Jean Claude",
    phone: "+250 788 123 456",
    district: "Kicukiro",
    language: "Kinyarwanda",
    parcels: 2,
    status: "Active",
    joined: "12 Oct 2026",
  },
  {
    id: "F002",
    name: "Marie Claire",
    phone: "+250 783 234 567",
    district: "Gasabo",
    language: "Kinyarwanda",
    parcels: 1,
    status: "Active",
    joined: "18 Oct 2026",
  },
  {
    id: "F003",
    name: "Emmanuel Niyonzima",
    phone: "+250 790 345 678",
    district: "Huye",
    language: "English",
    parcels: 3,
    status: "Active",
    joined: "21 Oct 2026",
  },
  {
    id: "F004",
    name: "Aline Mukamana",
    phone: "+250 788 456 789",
    district: "Muhanga",
    language: "Kinyarwanda",
    parcels: 1,
    status: "Pending",
    joined: "02 Nov 2026",
  },
  {
    id: "F005",
    name: "Patrick Habimana",
    phone: "+250 782 567 890",
    district: "Musanze",
    language: "Kinyarwanda",
    parcels: 2,
    status: "Active",
    joined: "05 Nov 2026",
  },
];

const interfaceTranslationsRw = {
  "Account status": "Imiterere ya konti",
  "All demo records": "Amakuru yose y'icyitegererezo",
  "Open recommendation": "Inama yo guhitamo igihingwa",
  "Received crop advisory": "Inama ku gihingwa umuhinzi yahawe",
  "Farmer / District": "Umuhinzi / Akarere",
  "Send message": "Ohereza ubutumwa",
  "Pending verification": "Itegereje kwemezwa",
  Kigali: "Kigali",
  Huye: "Huye",
  Musanze: "Musanze",
  Muhanga: "Muhanga",
  Rubavu: "Rubavu",
  Nyagatare: "Nyagatare",
  Pages: "Amapaji",
  Dashboard: "Ahabanza",
  Farmers: "Abahinzi",
  "Farm Parcels": "Imirima",
  "Soil Intelligence": "Amakuru ku butaka",
  "Weather & Climate": "Ikirere n'imihindagurikire yacyo",
  "Open Crop Recommendation": "Guhitamo igihingwa",
  "Received Crop Advisory": "Inama ku gihingwa bahawe",
  "Crop Suitability": "Isuzuma ry'ibihingwa",
  "AI Assistant": "Umufasha wa AI",
  Settings: "Igenamiterere",
  "Farm parcel registry": "Igitabo cy'ibibanza by'ubuhinzi",
  "Manage parcel identifiers, farmer ownership and basic land information.":
    "Cunga nimero ziranga imirima, abayifite n'amakuru y'ibanze yayo.",
  "Add parcel": "Ongeramo umurima",
  UPI: "UPI",
  "Enter parcel UPI": "Andika UPI y'umurima",
  Farmer: "Umuhinzi",
  District: "Akarere",
  "e.g. Gasabo": "Urugero: Gasabo",
  Sector: "Umurenge",
  Area: "Ubuso",
  "e.g. 0.8 ha": "Urugero: hegitari 0.8",
  "Current land use": "Icyo ubutaka buhingwaho ubu",
  "e.g. Beans": "Urugero: ibishyimbo",
  "Save parcel": "Bika umurima",
  Cancel: "Hagarika",
  "New records are saved in this page's temporary state only.":
    "Amakuru mashya abikwa muri iyi paji by'agateganyo gusa.",
  "Search UPI, farmer, district...":
    "Shakisha UPI, umuhinzi cyangwa akarere...",
  All: "Byose",
  Verified: "Byemejwe",
  Pending: "Birategereje",
  "Needs review": "Bisaba gusuzumwa",
  "Parcel ID / UPI": "Nimero y'umurima / UPI",
  "District / Sector": "Akarere / Umurenge",
  "Land use": "Icyo ubutaka buhingwaho",
  Status: "Imiterere",
  View: "Reba",
  "No parcels match your search.": "Nta mirima ihuye n'ibyo washakishije.",
  "Parcel details": "Amakuru y'umurima",
  "Registered farmer": "Umuhinzi wanditswe",
  Verification: "Icyemezo cy'uko umurima wagenzuwe",
  "Not provided": "Ntabwo byatanzwe",
  "Registered parcels": "Imirima yanditswe",
  "Verified parcels": "Imirima yemejwe",
  "Pending verification": "Imirima itegereje kwemezwa",
  "Total registered area": "Ubuso bw'imirima yose yanditswe",
  "Demonstration records only": "Amakuru y'icyitegererezo gusa",
  "Soil records": "Amakuru y'ubutaka",
  "Estimated records": "Amakuru yagereranijwe",
  "Average pH": "Impuzandengo ya pH",
  "Data requiring validation": "Amakuru agomba kugenzurwa",
  "Illustrative information, not lab results":
    "Amakuru y'icyitegererezo, si ibisubizo bya laboratwari",
  "Soil intelligence records": "Amakuru y'ubutaka bw'imirima",
  "Review parcel-level soil information and its source or measurement status.":
    "Reba amakuru y'ubutaka kuri buri murima, inkomoko yayo n'uko yapimwe.",
  "All values below are demonstration data. Estimated soil information must not be treated as laboratory measurements or definitive parcel facts.":
    "Imibare yose iri hano ni iy'icyitegererezo. Amakuru y'ubutaka yagereranijwe ntakwiye gufatwa nk'ibipimo bya laboratwari cyangwa amakuru yemejwe y'umurima.",
  "Search parcel, farmer, district or texture...":
    "Shakisha umurima, umuhinzi, akarere cyangwa ubwoko bw'ubutaka...",
  Texture: "Ubwoko bw'ubutaka",
  Drainage: "Uko amazi anyura mu butaka",
  "Organic matter": "Ibigize ubutaka bikomoka ku binyabuzima",
  "Source / status": "Inkomoko / uko amakuru ahagaze",
  Updated: "Igihe byavuguruwe",
  Estimated: "Byagereranijwe",
  "No matching soil records.":
    "Nta makuru y'ubutaka ahuye n'ibyo washakishije.",
  "Data quality checklist": "Ibyo kugenzura kugira ngo amakuru abe meza",
  "Record the data source for every soil value":
    "Andika inkomoko ya buri makuru y'ubutaka",
  "Distinguish measured results from model estimates":
    "Tandukanya ibipimo byafashwe n'ibigereranyo bya mudasobwa",
  "Store the date and geographic resolution":
    "Bika itariki n'aho amakuru areba",
  "Request field or laboratory validation when needed":
    "Saba igenzura mu murima cyangwa muri laboratwari igihe bikenewe",
  "Weather & climate monitoring":
    "Gukurikirana ikirere n'imihindagurikire yacyo",
  "Prototype overview of weather information used to support parcel-level advice.":
    "Urugero rw'amakuru y'ikirere azakoreshwa mu gutanga inama kuri buri murima.",
  "These weather figures are illustrative placeholders. No live weather API is connected yet. Do not use them for planting decisions.":
    "Iyi mibare y'ikirere ni iy'icyitegererezo gusa. Nta serivisi y'ikirere ihujwe na porogaramu kugeza ubu. Ntuyikoreshe mu gufata ibyemezo byo guhinga.",
  "Current temperature": "Ubushyuhe buriho",
  "Rain probability": "Amahirwe yo kugwa kw'imvura",
  "Wind speed": "Umuvuduko w'umuyaga",
  Humidity: "Ububobere bwo mu kirere",
  "Forecast monitoring checklist": "Ibyo gukurikirana mu iteganyagihe",
  "Information the platform should capture when a trusted weather source is connected.":
    "Amakuru urubuga ruzajya rufata niruhuzwa n'inkomoko yizewe y'iteganyagihe.",
  "Rainfall forecast and accumulation": "Iteganyagihe ry'imvura n'ingano yayo",
  "Minimum and maximum temperature": "Ubushyuhe bwo hasi n'ubwo hejuru",
  "Wind and humidity": "Umuyaga n'ububobere",
  "Forecast issue time and valid period":
    "Igihe iteganyagihe ryatangiwe n'igihe rimara",
  "Weather provider and data resolution":
    "Utanga amakuru y'ikirere n'ubusobanuro bwayo",
  "Risk alerts reviewed by an agricultural specialist":
    "Imiburo y'ibyago yasuzumwe n'inzobere mu buhinzi",
  "Total assessments": "Isuzuma ryose",
  "Open recommendations": "Inama zo guhitamo igihingwa",
  "Received crop advisories": "Inama ku bihingwa abahinzi bahawe",
  "Require review": "Bisaba gusuzumwa",
  "Crop assessment registry": "Urutonde rw'isuzuma ry'ibihingwa",
  "Review open crop recommendations separately from crops already received by farmers.":
    "Suzuma ukwazo ibihingwa byasabwe n'ibihingwa abahinzi bamaze guhabwa.",
  "These are example records, not validated agronomic recommendations. Suitability decisions require reliable parcel data, crop requirements and local expert validation.":
    "Aya ni amakuru y'icyitegererezo, si inama z'ubuhinzi zemejwe. Icyemezo cy'igihingwa gikwiriye gisaba amakuru yizewe y'umurima, ibyo igihingwa gikeneye n'isuzuma ry'inzobere zo mu karere.",
  "Assessment ID": "Nimero y'isuzuma",
  Parcel: "Umurima",
  Crop: "Igihingwa",
  Season: "Igihembwe",
  "Assessment type": "Ubwoko bw'isuzuma",
  Date: "Itariki",
  "Season A": "Igihembwe A",
  "Review required": "Bisaba gusuzumwa",
  "Information captured": "Amakuru yakusanyijwe",
  "Pending assessment": "Isuzuma rirategereje",
  "How AgriNova should assess suitability":
    "Uko AgriNova igomba gusuzuma igihingwa gikwiriye",
  "Parcel context": "Amakuru y'umurima",
  "Soil, slope, location, drainage and land conditions.":
    "Ubutaka, imiterere y'ubuso, ahantu umurima uherereye, uko amazi anyura n'imiterere y'ubutaka.",
  "Weather context": "Amakuru y'ikirere",
  "Seasonal rainfall, temperature and forecast uncertainty.":
    "Imvura y'igihembwe, ubushyuhe n'ibitagize icyizere mu iteganyagihe.",
  "Crop requirements": "Ibyo igihingwa gikeneye",
  "Verified crop and variety requirements from trusted sources.":
    "Ibyo igihingwa n'ubwoko bwacyo bikenera, byemejwe n'inkomoko zizewe.",
  "Review and explain": "Suzuma kandi usobanure",
  "Show reasons, limitations, confidence and expert referral where needed.":
    "Erekana impamvu, imbogamizi, urwego rw'icyizere no kohereza ikibazo ku nzobere igihe bikenewe.",
  "AgriNova AI Assistant": "Umufasha wa AI wa AgriNova",
  "Admin demonstration workspace for AI and knowledge-support interactions.":
    "Ahantu h'icyitegererezo h'umuyobozi ho kugerageza AI n'ubufasha bushingiye ku bumenyi.",
  "Prototype only: this chat is not connected to an LLM, RAG pipeline, live database or external services. Do not enter private farmer information.":
    "Ni icyitegererezo gusa: iki kiganiro ntigihujwe na LLM, uburyo bwa RAG, ububiko nyakuri bw'amakuru cyangwa izindi serivisi. Ntushyiremo amakuru bwite y'abahinzi.",
  "Hello! I am the AgriNova admin assistant. I can help explain platform sections and demonstrate how agricultural questions may be reviewed. This prototype is not connected to live AI or farmer records.":
    "Muraho! Ndi umufasha w'abayobozi ba AgriNova. Nshobora gusobanura ibice by'urubuga no kugaragaza uko ibibazo by'ubuhinzi byasuzumwa. Iki cyitegererezo ntigihujwe na AI nyakuri cyangwa amakuru y'abahinzi.",
  You: "Wowe",
  "AgriNova Assistant": "Umufasha wa AgriNova",
  "Ask about the AgriNova platform...":
    "Baza ibijyanye n'urubuga rwa AgriNova...",
  "This is a demonstration response. In the connected system, AgriNova will retrieve relevant verified agricultural documents and platform records before generating an answer. For crop-specific decisions, the system must show its sources and refer uncertain cases to an agricultural extension officer.":
    "Iki ni igisubizo cy'icyitegererezo. Muri sisitemu izaba ihujwe, AgriNova izabanza gushaka inyandiko z'ubuhinzi zemejwe n'amakuru ajyanye n'ikibazo mbere yo gutanga igisubizo. Ku byemezo birebana n'igihingwa, sisitemu igomba kwerekana inkomoko y'amakuru no kohereza ibibazo bidafite igisubizo gihamye ku mukozi w'ubujyanama mu buhinzi.",
  "AI system components": "Ibice bigize sisitemu ya AI",
  "Farmer and parcel context": "Amakuru y'umuhinzi n'umurima",
  "Trusted agricultural documents": "Inyandiko z'ubuhinzi zizewe",
  "Retrieval and source citations":
    "Gushakisha amakuru no kwerekana inkomoko yayo",
  "LLM explanation layer": "Igice cya LLM gisobanura amakuru",
  "Safety and expert referral": "Umutekano no kohereza ikibazo ku nzobere",
  "Cases needing review": "Ibibazo bisaba gusuzumwa",
  "A future monitoring queue for questions where retrieved evidence is insufficient, conflicting or requires a human specialist.":
    "Urutonde ruzajya rugaragaza ibibazo aho amakuru yabonetse adahagije, avuguruzanya cyangwa bisaba inzobere muntu.",
  "Demo queue: not connected": "Urutonde rw'icyitegererezo: ntirurahuzwa",
  "Platform settings": "Igenamiterere ry'urubuga",
  "Configure basic preferences for this admin prototype.":
    "Hindura igenamiterere ry'ibanze ry'icyitegererezo cy'umuyobozi.",
  "Platform name": "Izina ry'urubuga",
  "Administrator contact email": "Imeyili y'umuyobozi",
  "Default language": "Ururimi rukoreshwa mbere",
  "Enable admin notifications": "Emera imenyesha ry'umuyobozi",
  "Require expert review for uncertain agricultural advice":
    "Saba isuzuma ry'inzobere ku nama z'ubuhinzi zidafite icyizere gihagije",
  "Save preferences": "Bika igenamiterere",
  "Preferences saved in this session.":
    "Igenamiterere ryabitswe muri iki gihe cyo gukoresha porogaramu.",
  "Security reminders": "Ibyibutsa by'umutekano",
  "Use role-based access for admins, farmers and officers":
    "Koresha uburenganzira butandukanye ku bayobozi, abahinzi n'abakozi b'ubuhinzi",
  "Never store passwords in frontend code or local storage":
    "Ntukabike amagambo banga muri kode ya frontend cyangwa muri local storage",
  "Restrict farmers to their own records":
    "Abahinzi bagomba kubona amakuru yabo gusa",
  "Keep audit logs for important administrative actions":
    "Bika inyandiko z'ibikorwa by'ingenzi by'abayobozi",
  "Platform connection status": "Uko urubuga ruhujwe n'izindi serivisi",
  "Frontend prototype": "Icyitegererezo cya frontend",
  "Backend not connected": "Backend ntirarahuzwa",
  "Farmer records, settings, soil data, weather and AI conversations will become persistent after API and database integration.":
    "Amakuru y'abahinzi, igenamiterere, ubutaka, ikirere n'ibiganiro bya AI bizajya bibikwa burundu nyuma yo guhuza API na database.",
  "Total farmers": "Abahinzi bose",
  "Active accounts": "Konti zikora",
  "Pending accounts": "Konti zitegereje",
  "Total parcels": "Imirima yose",
  "Demonstration records": "Amakuru y'icyitegererezo",
  "Registered farmers": "Abahinzi biyandikishije",
  "Search, review and manage farmer records.":
    "Shakisha, suzuma kandi ucunge amakuru y'abahinzi.",
  "Add farmer": "Ongeramo umuhinzi",
  "Full name": "Amazina yose",
  "Farmer name": "Izina ry'umuhinzi",
  "Phone number": "Nimero ya telefoni",
  "Preferred language": "Ururimi akunda",
  "Save farmer": "Bika umuhinzi",
  "All statuses": "Imiterere yose",
  Active: "Irakora",
  "No farmers match your search.": "Nta muhinzi uhuye n'ibyo washakishije.",
  "Farmer profile": "Umwirondoro w'umuhinzi",
  "Farmer details": "Amakuru y'umuhinzi",
  "Registration date": "Itariki yo kwiyandikisha",
  "These are demonstration records. Real farmer profiles will load from the database after backend integration.":
    "Aya ni amakuru y'icyitegererezo. Imyirondoro nyayo y'abahinzi izajya iva muri database nyuma yo guhuza backend.",
  "Farmer information captured (prototype)":
    "Amakuru y'umuhinzi yakusanyijwe (icyitegererezo)",
  "Selected:": "Byatoranyijwe:",
  Maize: "Ibigori",
  Beans: "Ibishyimbo",
  Rice: "Umuceri",
  "Irish potatoes": "Ibirayi",
  Sorghum: "Amasaka",
  "Agricultural organisation": "Ikigo cy'ubuhinzi",
  Cooperative: "Koperative",
  "Government programme": "Gahunda ya Leta",
  Other: "Ibindi",
  "Yes, expected to plant it": "Yego, ateganya kukihinga",
  "No, the farmer can choose": "Oya, umuhinzi ashobora guhitamo",
  "Not sure": "Ntibizwi neza",
  "Current season": "Igihembwe kiriho",
  "Next season": "Igihembwe gitaha",
  "Kigali, Rwanda": "Kigali, u Rwanda",
  DEMO: "ICYITEGEREREZO",
  "Pages /": "Amapaji /",
  "Search farmers, parcels...": "Shakisha abahinzi cyangwa imirima...",
};

const initialParcels = [
  {
    id: "P001",
    upi: "1/03/08/01/1234",
    farmerId: "F001",
    farmer: "Jean Claude",
    district: "Kicukiro",
    sector: "Kigarama",
    area: "1.2 ha",
    landUse: "Maize and beans",
    status: "Verified",
  },
  {
    id: "P002",
    upi: "1/03/08/02/2345",
    farmerId: "F002",
    farmer: "Marie Claire",
    district: "Gasabo",
    sector: "Kimironko",
    area: "0.8 ha",
    landUse: "Beans",
    status: "Verified",
  },
  {
    id: "P003",
    upi: "1/01/04/03/3456",
    farmerId: "F003",
    farmer: "Emmanuel Niyonzima",
    district: "Huye",
    sector: "Ngoma",
    area: "2.1 ha",
    landUse: "Maize",
    status: "Pending",
  },
  {
    id: "P004",
    upi: "1/02/06/04/4567",
    farmerId: "F004",
    farmer: "Aline Mukamana",
    district: "Muhanga",
    sector: "Nyamabuye",
    area: "0.6 ha",
    landUse: "Irish potatoes",
    status: "Verified",
  },
  {
    id: "P005",
    upi: "1/04/02/05/5678",
    farmerId: "F005",
    farmer: "Patrick Habimana",
    district: "Musanze",
    sector: "Muhoza",
    area: "1.5 ha",
    landUse: "Sorghum",
    status: "Needs review",
  },
];

const initialSoilRecords = [
  {
    parcelId: "P001",
    farmer: "Jean Claude",
    district: "Kicukiro",
    ph: "5.8",
    texture: "Clay loam",
    drainage: "Moderate",
    organicMatter: "3.1%",
    source: "Demonstration record",
    updated: "08 Nov 2026",
    quality: "Estimated",
  },
  {
    parcelId: "P002",
    farmer: "Marie Claire",
    district: "Gasabo",
    ph: "6.2",
    texture: "Loam",
    drainage: "Good",
    organicMatter: "2.8%",
    source: "Demonstration record",
    updated: "06 Nov 2026",
    quality: "Estimated",
  },
  {
    parcelId: "P003",
    farmer: "Emmanuel Niyonzima",
    district: "Huye",
    ph: "5.4",
    texture: "Sandy clay",
    drainage: "Moderate",
    organicMatter: "2.4%",
    source: "Demonstration record",
    updated: "03 Nov 2026",
    quality: "Estimated",
  },
  {
    parcelId: "P004",
    farmer: "Aline Mukamana",
    district: "Muhanga",
    ph: "6.0",
    texture: "Clay loam",
    drainage: "Good",
    organicMatter: "3.4%",
    source: "Demonstration record",
    updated: "01 Nov 2026",
    quality: "Estimated",
  },
];

const initialAssessments = [
  {
    id: "CA001",
    farmer: "Jean Claude",
    parcelId: "P001",
    crop: "Maize",
    season: "Season A",
    type: "Open recommendation",
    result: "Review required",
    date: "10 Nov 2026",
  },
  {
    id: "CA002",
    farmer: "Marie Claire",
    parcelId: "P002",
    crop: "Beans",
    season: "Season A",
    type: "Received crop advisory",
    result: "Information captured",
    date: "11 Nov 2026",
  },
  {
    id: "CA003",
    farmer: "Emmanuel Niyonzima",
    parcelId: "P003",
    crop: "Irish potatoes",
    season: "Season A",
    type: "Open recommendation",
    result: "Pending assessment",
    date: "12 Nov 2026",
  },
];

function readAdminStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function AdminDashboard() {
  const { farmers: registeredAccounts = [] } = useAuth();
  const [activePage, setActivePage] = useState("Dashboard");

  const [menuOpen, setMenuOpen] = useState(false);

  const [language, setLanguage] = useState(
    () => localStorage.getItem("agrinova-language") || "en",
  );

  const [parcel, setParcel] = useState("");

  const [season, setSeason] = useState("Current season");

  const [receivedCrop, setReceivedCrop] = useState("");

  const [provider, setProvider] = useState("");

  const [variety, setVariety] = useState("");

  const [plantingRequirement, setPlantingRequirement] = useState(
    "Yes, expected to plant it",
  );

  const [submitted, setSubmitted] = useState(false);
  const [farmers, setFarmers] = useState(() =>
    readAdminStorage("agrinova_admin_farmers", initialFarmers),
  );
  const [farmerSearch, setFarmerSearch] = useState("");
  const [farmerStatus, setFarmerStatus] = useState("All");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerPhone, setNewFarmerPhone] = useState("");
  const [newFarmerDistrict, setNewFarmerDistrict] = useState("");
  const [newFarmerLanguage, setNewFarmerLanguage] = useState("Kinyarwanda");
  const [farmerFormError, setFarmerFormError] = useState("");

  const [parcels, setParcels] = useState(() =>
    readAdminStorage("agrinova_admin_parcels", initialParcels),
  );
  const [parcelSearch, setParcelSearch] = useState("");
  const [parcelStatus, setParcelStatus] = useState("All");
  const [showAddParcel, setShowAddParcel] = useState(false);
  const [newParcelUpi, setNewParcelUpi] = useState("");
  const [newParcelFarmer, setNewParcelFarmer] = useState("F001");
  const [newParcelDistrict, setNewParcelDistrict] = useState("");
  const [newParcelSector, setNewParcelSector] = useState("");
  const [newParcelArea, setNewParcelArea] = useState("");
  const [newParcelUse, setNewParcelUse] = useState("");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [soilSearch, setSoilSearch] = useState("");
  const [soilRecords] = useState(initialSoilRecords);
  const [weatherDistrict, setWeatherDistrict] = useState("Kigali");
  const [assessments, setAssessments] = useState(() =>
    readAdminStorage("agrinova_admin_assessments", initialAssessments),
  );
  const [assessmentFilter, setAssessmentFilter] = useState("All");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am the AgriNova admin assistant. I can help explain platform sections and demonstrate how agricultural questions may be reviewed. This prototype is not connected to live AI or farmer records.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [settings, setSettings] = useState(() =>
    readAdminStorage("agrinova_admin_settings", {
      platformName: "AgriNova",
      contactEmail: "admin@agrinova.rw",
      defaultLanguage: "Kinyarwanda",
      notifications: true,
      reviewRequired: true,
    }),
  );
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Combine real prototype registrations with farmers added by the admin.
  // Passwords are deliberately excluded from the dashboard view model.
  const registeredFarmers = registeredAccounts.map((account) => ({
    id: account.id,
    name: account.name || "Unnamed farmer",
    phone: account.phone || "Not provided",
    email: account.email || "Not provided",
    district: account.district || "Not provided",
    language: account.language || "Kinyarwanda",
    parcels: 0,
    status: "Active",
    joined: account.createdAt
      ? new Date(account.createdAt).toLocaleDateString("en-GB")
      : "Registered account",
    source: "Registration",
  }));

  const allFarmers = [...registeredFarmers, ...farmers].map((farmer) => ({
    ...farmer,
    parcels:
      parcels.filter((farmParcel) => farmParcel.farmerId === farmer.id)
        .length ||
      farmer.parcels ||
      0,
  }));

  // Keep admin-created demo records available after a page refresh.
  useEffect(() => {
    localStorage.setItem("agrinova_admin_farmers", JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem("agrinova_admin_parcels", JSON.stringify(parcels));
  }, [parcels]);

  useEffect(() => {
    localStorage.setItem(
      "agrinova_admin_assessments",
      JSON.stringify(assessments),
    );
  }, [assessments]);

  const [formError, setFormError] = useState("");

  const t = translations[language];

  const pageNames = {
    Dashboard: t.dashboard,

    Farmers: t.farmers,

    "Farm Parcels": t.parcels,

    "Soil Intelligence": t.soil,

    "Weather & Climate": t.weather,

    "Open Crop Recommendation": t.open,

    "Received Crop Advisory": t.received,

    "Crop Suitability":
      language === "rw" ? "Isuzuma ry'ibihingwa" : "Crop Suitability",

    "AI Assistant": t.assistant,

    Settings: t.settings,
  };

  const navigation = [
    { name: "Dashboard", label: t.dashboard, icon: LayoutDashboard },

    { name: "Farmers", label: t.farmers, icon: Users },

    { name: "Farm Parcels", label: t.parcels, icon: Map },

    { name: "Soil Intelligence", label: t.soil, icon: Sprout },

    { name: "Weather & Climate", label: t.weather, icon: CloudSun },

    { name: "Open Crop Recommendation", label: t.open, icon: Leaf },

    { name: "Received Crop Advisory", label: t.received, icon: Wheat },

    {
      name: "Crop Suitability",
      label: language === "rw" ? "Isuzuma ry'ibihingwa" : "Crop Suitability",
      icon: ClipboardList,
    },

    { name: "AI Assistant", label: t.assistant, icon: MessageSquare },
  ];

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);

    localStorage.setItem("agrinova-language", nextLanguage);
  };

  const handleOpenAssessment = () => {
    if (!parcel) {
      setFormError(t.submitRequired);

      return;
    }

    setFormError("");

    const selected = parcels.find((item) => item.id === parcel);
    setAssessments((current) => [
      {
        id: `CA${String(Date.now()).slice(-6)}`,
        farmer: selected?.farmer || "Not provided",
        parcelId: selected?.id || parcel,
        crop: "Awaiting AI assessment",
        season,
        type: "Open recommendation",
        result: "Pending assessment",
        date: new Date().toLocaleDateString("en-GB"),
      },
      ...current,
    ]);
    setSubmitted(true);
  };

  const handleReceivedAssessment = () => {
    if (!parcel || !receivedCrop || !provider) {
      setFormError(t.submitRequired);

      return;
    }

    setFormError("");

    const selected = parcels.find((item) => item.id === parcel);
    setAssessments((current) => [
      {
        id: `CA${String(Date.now()).slice(-6)}`,
        farmer: selected?.farmer || "Not provided",
        parcelId: selected?.id || parcel,
        crop: receivedCrop,
        season,
        type: "Received crop advisory",
        result: "Information captured",
        date: new Date().toLocaleDateString("en-GB"),
        provider,
        variety,
        plantingRequirement,
      },
      ...current,
    ]);
    setSubmitted(true);
  };

  const goToPage = (page) => {
    setActivePage(page);

    setMenuOpen(false);

    setSubmitted(false);

    setFormError("");
  };

  const renderDashboard = () => (
    <>
      <section className="welcome-section">
        <div>
          <p className="date-label">{t.platform}</p>

          <h1>
            {t.greeting} <span>🌱</span>
          </h1>

          <p>{t.welcome}</p>
        </div>

        <button className="primary-button" onClick={() => goToPage("Farmers")}>
          <Plus size={18} />
          {t.addFarmer}
        </button>
      </section>

      <section className="hero-banner">
        <div className="hero-overlay">
          <span className="hero-tag">{t.heroTag}</span>

          <h2>{t.heroTitle}</h2>

          <p>{t.heroText}</p>

          <button
            className="hero-button"
            onClick={() => goToPage("Farm Parcels")}
          >
            {t.exploreParcels} <ArrowUpRight size={17} />
          </button>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <h2>{t.overview}</h2>
          <p>{t.demoInfo}</p>
        </div>

        <span className="demo-label">{t.demo}</span>
      </section>

      <section className="stats-grid">
        {[
          {
            icon: Users,
            title: t.farmersRegistered,
            value: allFarmers.length,
            color: "green",
          },

          {
            icon: Map,
            title: t.farmParcels,
            value: parcels.length,
            color: "blue",
          },

          {
            icon: Sprout,
            title: t.assessments,
            value: assessments.length,
            color: "orange",
          },

          {
            icon: CloudSun,
            title: t.weatherChecks,
            value: "—",
            color: "purple",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.title}>
              <div className="stat-top">
                <div className={`stat-icon ${item.color}`}>
                  <Icon size={21} />
                </div>

                <span className="stat-note">{t.sample}</span>
              </div>

              <p className="stat-title">{item.title}</p>

              <h3>{item.value}</h3>

              <span className="stat-description">
                {item.title === t.weatherChecks
                  ? language === "rw"
                    ? "Serivisi y'ikirere ntirahuzwa"
                    : "Weather service not connected"
                  : language === "rw"
                    ? "Imibare iva mu makuru aboneka muri prototype"
                    : "Based on available prototype records"}
              </span>
            </div>
          );
        })}
      </section>

      <section className="middle-grid">
        <div className="content-card weather-card">
          <div className="card-heading">
            <div>
              <h3>{t.weatherOverview}</h3>
              <p>{t.illustrativeWeather}</p>
            </div>

            <CloudSun size={22} className="heading-icon" />
          </div>

          <div className="weather-location">
            <MapPin size={16} /> Kigali, Rwanda <span>{t.sampleLocation}</span>
          </div>

          <div className="weather-main">
            <div className="temperature">
              <Sun size={39} />
              <div>
                <h2>24°C</h2>
                <p>{t.partlyCloudy}</p>
              </div>
            </div>

            <span className="weather-demo">DEMO</span>
          </div>

          <div className="weather-details">
            <div>
              <Wind size={18} />
              <span>{t.wind}</span>
              <strong>12 km/h</strong>
            </div>

            <div>
              <CloudRain size={18} />
              <span>{t.rainChance}</span>
              <strong>30%</strong>
            </div>
          </div>
        </div>

        <div className="content-card insight-card">
          <div className="card-heading">
            <div>
              <h3>{t.insights}</h3>
              <p>{t.aims}</p>
            </div>

            <Leaf size={22} className="heading-icon" />
          </div>

          <div className="insight-item">
            <div className="insight-icon">
              <Sprout size={19} />
            </div>
            <div>
              <strong>{t.soilInsight}</strong>
              <p>{t.soilText}</p>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon blue">
              <CloudSun size={19} />
            </div>
            <div>
              <strong>{t.climate}</strong>
              <p>{t.climateText}</p>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon orange">
              <Leaf size={19} />
            </div>
            <div>
              <strong>{t.suitability}</strong>
              <p>{t.suitabilityText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-heading crop-heading">
        <div>
          <h2>{t.exploreAgriculture}</h2>
          <p>{t.glimpse}</p>
        </div>

        <button
          className="text-button"
          onClick={() => goToPage("Open Crop Recommendation")}
        >
          {t.exploreCrops} <ArrowUpRight size={16} />
        </button>
      </section>

      <section className="crop-grid">
        <article className="crop-card">
          <img
            src="https\://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700"
            alt="Green agricultural fields"
          />
          <div className="crop-card-text">
            <span>{t.land}</span>
            <h3>{t.landscapes}</h3>
          </div>
        </article>

        <article className="crop-card">
          <img
            src="https\://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700"
            alt="Fresh crops growing in a field"
          />
          <div className="crop-card-text">
            <span>{t.production}</span>
            <h3>{t.decisions}</h3>
          </div>
        </article>

        <article className="crop-card">
          <img
            src="https\://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=700"
            alt="Agricultural worker in a field"
          />
          <div className="crop-card-text">
            <span>{t.farmersLabel}</span>
            <h3>{t.centre}</h3>
          </div>
        </article>
      </section>
    </>
  );

  const filteredFarmers = allFarmers.filter((farmer) => {
    const query = farmerSearch.toLowerCase();
    const matchesSearch =
      farmer.name.toLowerCase().includes(query) ||
      farmer.phone.toLowerCase().includes(query) ||
      farmer.district.toLowerCase().includes(query);
    const matchesStatus =
      farmerStatus === "All" || farmer.status === farmerStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddFarmer = (event) => {
    event.preventDefault();
    if (
      !newFarmerName.trim() ||
      !newFarmerPhone.trim() ||
      !newFarmerDistrict.trim()
    ) {
      setFarmerFormError(
        language === "rw"
          ? "Uzuza imyanya yose isabwa."
          : "Please complete all required fields.",
      );
      return;
    }
    const nextFarmer = {
      id: `F${String(farmers.length + 1).padStart(3, "0")}`,
      name: newFarmerName.trim(),
      phone: newFarmerPhone.trim(),
      district: newFarmerDistrict.trim(),
      language: newFarmerLanguage,
      parcels: 0,
      status: "Pending",
      joined: new Date().toLocaleDateString(
        language === "rw" ? "rw-RW" : "en-GB",
        { day: "2-digit", month: "short", year: "numeric" },
      ),
    };
    setFarmers((current) => [nextFarmer, ...current]);
    setNewFarmerName("");
    setNewFarmerPhone("");
    setNewFarmerDistrict("");
    setNewFarmerLanguage("Kinyarwanda");
    setFarmerFormError("");
    setShowAddFarmer(false);
  };

  const renderFarmers = () => (
    <section style={{ display: "grid", gap: "20px" }}>
      <div className="stats-grid">
        {[
          {
            label: language === "rw" ? "Abahinzi bose" : "Total farmers",
            value: allFarmers.length,
            icon: Users,
          },
          {
            label: language === "rw" ? "Konti zikora" : "Active accounts",
            value: allFarmers.filter((f) => f.status === "Active").length,
            icon: CheckCircle,
          },
          {
            label:
              language === "rw" ? "Zitegereje kwemezwa" : "Pending accounts",
            value: allFarmers.filter((f) => f.status === "Pending").length,
            icon: Info,
          },
          {
            label: language === "rw" ? "Imirima yose" : "Total parcels",
            value: allFarmers.reduce(
              (sum, f) => sum + (Number(f.parcels) || 0),
              0,
            ),
            icon: Map,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.label}>
              <div className="stat-top">
                <div className="stat-icon green">
                  <Icon size={20} />
                </div>
                <span className="stat-note">DEMO</span>
              </div>
              <p className="stat-title">{stat.label}</p>
              <h3>{stat.value}</h3>
              <span className="stat-description">
                {language === "rw"
                  ? "Harimo amakuru y'icyitegererezo n'abiyandikishije"
                  : "Includes sample records and registered accounts"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="content-card" style={{ padding: "22px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>
              {language === "rw"
                ? "Abahinzi biyandikishije"
                : "Registered farmers"}
            </h3>
            <p
              style={{ margin: "6px 0 0", color: "#718078", fontSize: "13px" }}
            >
              {language === "rw"
                ? "Shakisha kandi urebe amakuru y'abahinzi."
                : "Search, review and manage farmer records."}
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setShowAddFarmer(!showAddFarmer);
              setFarmerFormError("");
            }}
          >
            <UserPlus size={17} />{" "}
            {language === "rw" ? "Ongeramo umuhinzi" : "Add farmer"}
          </button>
        </div>

        {showAddFarmer && (
          <form
            onSubmit={handleAddFarmer}
            style={{
              background: "#f5f8f5",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "12px",
            }}
          >
            <label
              style={{ color: "#294333", fontSize: "13px", fontWeight: 600 }}
            >
              {language === "rw" ? "Amazina" : "Full name"}
              <input
                required
                value={newFarmerName}
                onChange={(e) => setNewFarmerName(e.target.value)}
                placeholder="Farmer name"
                style={fieldStyle}
              />
            </label>
            <label
              style={{ color: "#294333", fontSize: "13px", fontWeight: 600 }}
            >
              {" "}
              {language === "rw" ? "Telefoni" : "Phone number"}
              <input
                required
                value={newFarmerPhone}
                onChange={(e) => setNewFarmerPhone(e.target.value)}
                placeholder="+250..."
                style={fieldStyle}
              />
            </label>
            <label
              style={{ color: "#294333", fontSize: "13px", fontWeight: 600 }}
            >
              {language === "rw" ? "Akarere" : "District"}
              <input
                required
                value={newFarmerDistrict}
                onChange={(e) => setNewFarmerDistrict(e.target.value)}
                placeholder="e.g. Kicukiro"
                style={fieldStyle}
              />
            </label>
            <label
              style={{ color: "#294333", fontSize: "13px", fontWeight: 600 }}
            >
              {language === "rw" ? "Ururimi" : "Preferred language"}
              <select
                value={newFarmerLanguage}
                onChange={(e) => setNewFarmerLanguage(e.target.value)}
                style={fieldStyle}
              >
                <option>Kinyarwanda</option>
                <option>English</option>
              </select>
            </label>
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button className="primary-button" type="submit">
                <Plus size={17} />{" "}
                {language === "rw" ? "Bika umuhinzi" : "Save farmer"}
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowAddFarmer(false)}
              >
                {language === "rw" ? "Hagarika" : "Cancel"}
              </button>
              {farmerFormError && (
                <span style={{ color: "#b42318", fontSize: "13px" }}>
                  {farmerFormError}
                </span>
              )}
            </div>
          </form>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <div
            className="search-box"
            style={{ flex: "1 1 240px", minWidth: 0 }}
          >
            <Search size={18} />
            <input
              value={farmerSearch}
              onChange={(e) => setFarmerSearch(e.target.value)}
              placeholder={
                language === "rw"
                  ? "Shakisha izina, telefoni cyangwa akarere..."
                  : "Search name, phone or district..."
              }
            />
          </div>
          <select
            aria-label="Filter by account status"
            value={farmerStatus}
            onChange={(e) => setFarmerStatus(e.target.value)}
            style={{
              ...fieldStyle,
              width: "auto",
              minWidth: "160px",
              marginTop: 0,
            }}
          >
            <option value="All">
              {language === "rw" ? "Konti zose" : "All statuses"}
            </option>
            <option value="Active">
              {language === "rw" ? "Irakora" : "Active"}
            </option>
            <option value="Pending">
              {language === "rw" ? "Itegereje" : "Pending"}
            </option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "700px",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f8f5", color: "#617267" }}>
                {(language === "rw"
                  ? [
                      "Umuhinzi",
                      "Telefoni",
                      "Akarere",
                      "Imirima",
                      "Imiterere",
                      "",
                    ]
                  : ["Farmer", "Phone", "District", "Parcels", "Status", ""]
                ).map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "13px 12px",
                      fontSize: "12px",
                      fontWeight: 650,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  style={{ borderBottom: "1px solid #edf1ed" }}
                >
                  <td style={{ padding: "14px 12px" }}>
                    <strong
                      style={{
                        display: "block",
                        color: "#294333",
                        fontSize: "13px",
                      }}
                    >
                      {farmer.name}
                    </strong>
                    <span style={{ color: "#89958d", fontSize: "11px" }}>
                      {farmer.id} · {farmer.joined}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      color: "#52675a",
                      fontSize: "13px",
                    }}
                  >
                    <Phone
                      size={13}
                      style={{ verticalAlign: "middle", marginRight: "5px" }}
                    />
                    {farmer.phone}
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      color: "#52675a",
                      fontSize: "13px",
                    }}
                  >
                    {farmer.district}
                  </td>
                  <td
                    style={{
                      padding: "14px 12px",
                      color: "#52675a",
                      fontSize: "13px",
                    }}
                  >
                    {farmer.parcels}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        borderRadius: "20px",
                        padding: "5px 10px",
                        fontSize: "11px",
                        fontWeight: 650,
                        color:
                          farmer.status === "Active" ? "#247343" : "#946200",
                        background:
                          farmer.status === "Active" ? "#e8f5ec" : "#fff4d6",
                      }}
                    >
                      {farmer.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <button
                      className="text-button"
                      onClick={() => setSelectedFarmer(farmer)}
                    >
                      <Eye size={15} /> {language === "rw" ? "Reba" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFarmers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "28px",
                      textAlign: "center",
                      color: "#718078",
                    }}
                  >
                    {language === "rw"
                      ? "Nta muhinzi ubonetse."
                      : "No farmers match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedFarmer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(17, 35, 23, .38)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setSelectedFarmer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Farmer details"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              width: "min(430px, 92vw)",
              height: "100%",
              padding: "26px",
              boxSizing: "border-box",
              overflowY: "auto",
              boxShadow: "-8px 0 30px rgba(0,0,0,.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0, color: "#294333" }}>
                {language === "rw" ? "Amakuru y'umuhinzi" : "Farmer profile"}
              </h3>
              <button
                onClick={() => setSelectedFarmer(null)}
                aria-label="Close details"
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={21} />
              </button>
            </div>
            <div
              style={{
                marginTop: "25px",
                padding: "18px",
                background: "#f3f8f3",
                borderRadius: "12px",
              }}
            >
              <div className="avatar" style={{ marginBottom: "12px" }}>
                {selectedFarmer.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <h2 style={{ margin: "0 0 5px", color: "#294333" }}>
                {selectedFarmer.name}
              </h2>
              <span style={{ color: "#718078", fontSize: "13px" }}>
                {selectedFarmer.id}
              </span>
            </div>
            {[
              ["Phone number", selectedFarmer.phone],
              ["Email", selectedFarmer.email || "Not provided"],
              [
                "Record source",
                selectedFarmer.source || "Admin demonstration record",
              ],
              ["District", selectedFarmer.district],
              ["Preferred language", selectedFarmer.language],
              ["Registered parcels", selectedFarmer.parcels],
              ["Account status", selectedFarmer.status],
              ["Registration date", selectedFarmer.joined],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "15px 2px",
                  borderBottom: "1px solid #edf1ed",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: "#87948b",
                    fontSize: "12px",
                  }}
                >
                  {label}
                </span>
                <strong style={{ color: "#294333", fontSize: "14px" }}>
                  {value}
                </strong>
              </div>
            ))}
            <p
              style={{ marginTop: "20px", color: "#718078", fontSize: "12px" }}
            >
              {selectedFarmer.source === "Registration"
                ? language === "rw"
                  ? "Iyi konti yavuye mu kwiyandikisha muri prototype. Igenzura ry'umutekano n'ububiko nyabwo bizakorwa na backend."
                  : "This account came from prototype registration. Secure account management and database storage will be handled by the backend."
                : language === "rw"
                  ? "Iyi ni konti y'icyitegererezo yashyizweho mu rwego rwo kugerageza admin dashboard."
                  : "This is a sample account created for testing the admin dashboard."}
            </p>
          </div>
        </div>
      )}
    </section>
  );

  const fieldStyle = {
    width: "100%",

    padding: "12px 14px",

    border: "1px solid #d8e2da",

    borderRadius: "9px",

    background: "#fff",

    color: "#243b2b",

    marginTop: "7px",

    fontSize: "14px",
  };

  const fieldLabelStyle = {
    display: "block",
    marginTop: "17px",
    fontWeight: 600,
    color: "#294333",
  };

  const renderOpenRecommendation = () => (
    <section
      className="content-card"
      style={{ padding: "26px", maxWidth: "900px" }}
    >
      <div className="card-heading">
        <div>
          <h3>{t.openTitle}</h3>
          <p>{t.openIntro}</p>
        </div>

        <Sprout size={25} className="heading-icon" />
      </div>

      <label style={fieldLabelStyle}>
        {t.parcel}

        <select
          style={fieldStyle}
          value={parcel}
          onChange={(e) => {
            setParcel(e.target.value);
            setSubmitted(false);
          }}
        >
          <option value="">{t.parcelPlaceholder}</option>

          {parcels.map((farmParcel) => (
            <option key={farmParcel.id} value={farmParcel.id}>
              {farmParcel.id} — {farmParcel.upi} ({farmParcel.farmer})
            </option>
          ))}
        </select>
      </label>

      <label style={fieldLabelStyle}>
        {t.season}

        <select
          style={fieldStyle}
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        >
          <option value="Current season">{t.currentSeason}</option>

          <option value="Next season">{t.nextSeason}</option>
        </select>
      </label>

      <button
        className="primary-button"
        style={{ marginTop: "20px" }}
        onClick={handleOpenAssessment}
      >
        <Sprout size={18} />
        {t.assess}
      </button>

      {formError && (
        <p style={{ color: "#b42318", marginTop: "12px" }}>{formError}</p>
      )}

      {submitted && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "10px",
            background: "#edf7ef",
          }}
        >
          <strong>{t.demoNotice}</strong>
          <p style={{ marginBottom: 0, marginTop: "8px" }}>
            Selected: {parcel} · {season}
          </p>
        </div>
      )}

      {!submitted && (
        <p style={{ marginTop: "20px", color: "#65756a", fontSize: "13px" }}>
          <Info
            size={15}
            style={{ verticalAlign: "middle", marginRight: "6px" }}
          />
          {t.demoNotice}
        </p>
      )}
    </section>
  );

  const renderReceivedAdvisory = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      <section className="content-card" style={{ padding: "26px" }}>
        <div className="card-heading">
          <div>
            <h3>{t.receivedTitle}</h3>
            <p>{t.receivedIntro}</p>
          </div>

          <Wheat size={25} className="heading-icon" />
        </div>

        <label style={fieldLabelStyle}>
          {t.parcel}

          <select
            style={fieldStyle}
            value={parcel}
            onChange={(e) => {
              setParcel(e.target.value);
              setSubmitted(false);
            }}
          >
            <option value="">{t.parcelPlaceholder}</option>

            {parcels.map((farmParcel) => (
              <option key={farmParcel.id} value={farmParcel.id}>
                {farmParcel.id} — {farmParcel.upi} ({farmParcel.farmer})
              </option>
            ))}
          </select>
        </label>

        <label style={fieldLabelStyle}>
          {t.cropReceived}

          <select
            style={fieldStyle}
            value={receivedCrop}
            onChange={(e) => {
              setReceivedCrop(e.target.value);
              setSubmitted(false);
            }}
          >
            <option value="">{t.selectCrop}</option>

            {cropOptions.map((crop) => (
              <option key={crop.value} value={crop.value}>
                {language === "rw" ? crop.rw : crop.en}
              </option>
            ))}
          </select>
        </label>

        <label style={fieldLabelStyle}>
          {t.provider}

          <select
            style={fieldStyle}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="">{t.providerPlaceholder}</option>

            <option value="Agricultural organisation">{t.organisation}</option>

            <option value="Cooperative">{t.cooperative}</option>

            <option value="Government programme">{t.government}</option>

            <option value="Other">{t.other}</option>
          </select>
        </label>

        <label style={fieldLabelStyle}>
          {t.variety}

          <input
            style={fieldStyle}
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            placeholder={t.varietyPlaceholder}
          />
        </label>

        <label style={fieldLabelStyle}>
          {t.required}

          <select
            style={fieldStyle}
            value={plantingRequirement}
            onChange={(e) => setPlantingRequirement(e.target.value)}
          >
            <option value="Yes, expected to plant it">{t.yes}</option>

            <option value="No, the farmer can choose">{t.optional}</option>

            <option value="Not sure">{t.unsure}</option>
          </select>
        </label>

        <button
          className="primary-button"
          style={{ marginTop: "20px" }}
          onClick={handleReceivedAssessment}
        >
          <ClipboardList size={18} />
          {t.assessReceived}
        </button>

        {formError && (
          <p style={{ color: "#b42318", marginTop: "12px" }}>{formError}</p>
        )}
      </section>

      <section
        className="content-card"
        style={{ padding: "26px", alignSelf: "start" }}
      >
        <div className="card-heading">
          <div>
            <h3>{t.advisoryResult}</h3>
            <p>{t.resultText}</p>
          </div>
          <Leaf size={24} className="heading-icon" />
        </div>

        {submitted ? (
          <div
            style={{
              background: "#edf7ef",
              borderRadius: "10px",
              padding: "16px",
              marginTop: "18px",
            }}
          >
            <strong>
              {language === "rw"
                ? "Amakuru y'umuhinzi yakiriwe (icyitegererezo)"
                : "Farmer information captured (prototype)"}
            </strong>

            <p style={{ margin: "10px 0 4px" }}>
              <strong>{t.parcel}:</strong> {parcel}
            </p>

            <p style={{ margin: "4px 0" }}>
              <strong>{t.cropReceived}:</strong>{" "}
              {cropOptions.find((c) => c.value === receivedCrop)?.[language] ||
                receivedCrop}
            </p>

            <p style={{ margin: "4px 0" }}>
              <strong>{t.provider}:</strong> {provider}
            </p>

            {variety && (
              <p style={{ margin: "4px 0" }}>
                <strong>{t.variety}:</strong> {variety}
              </p>
            )}

            <p style={{ margin: "4px 0" }}>
              <strong>{t.required}:</strong> {plantingRequirement}
            </p>

            <p style={{ marginBottom: 0, marginTop: "12px" }}>
              {t.advisoryNotice}
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#f5f8f5",
              borderRadius: "10px",
              padding: "16px",
              marginTop: "18px",
              color: "#52675a",
            }}
          >
            {t.advisoryNotice}
          </div>
        )}
      </section>
    </div>
  );

  const translateUiTree = (node) => {
    if (
      language !== "rw" ||
      node === null ||
      node === undefined ||
      typeof node === "boolean"
    )
      return node;
    if (typeof node === "string") return interfaceTranslationsRw[node] || node;
    if (Array.isArray(node)) return node.map((child) => translateUiTree(child));
    if (isValidElement(node)) {
      const translatedProps = {};
      ["placeholder", "title", "aria-label", "alt"].forEach((key) => {
        if (typeof node.props[key] === "string") {
          translatedProps[key] =
            interfaceTranslationsRw[node.props[key]] || node.props[key];
        }
      });
      translatedProps.children = Children.map(node.props.children, (child) =>
        translateUiTree(child),
      );
      return cloneElement(node, translatedProps);
    }
    return node;
  };

  const panelStyle = {
    background: "#fff",
    border: "1px solid #e8eee9",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 3px 14px rgba(31,60,40,.035)",
  };
  const mutedText = { color: "#718078", fontSize: "13px" };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "720px",
    textAlign: "left",
  };
  const thStyle = {
    padding: "13px 12px",
    fontSize: "12px",
    color: "#617267",
    background: "#f5f8f5",
    fontWeight: 650,
  };
  const tdStyle = {
    padding: "14px 12px",
    color: "#52675a",
    fontSize: "13px",
    borderBottom: "1px solid #edf1ed",
  };

  const handleAddParcel = (e) => {
    e.preventDefault();
    const farmer = allFarmers.find((item) => item.id === newParcelFarmer);
    if (
      !farmer ||
      !newParcelUpi.trim() ||
      !newParcelDistrict.trim() ||
      !newParcelArea.trim()
    )
      return;
    const record = {
      id: `P${String(parcels.length + 1).padStart(3, "0")}`,
      upi: newParcelUpi.trim(),
      farmerId: farmer.id,
      farmer: farmer.name,
      district: newParcelDistrict.trim(),
      sector: newParcelSector.trim() || "Not provided",
      area: newParcelArea.trim(),
      landUse: newParcelUse.trim() || "Not provided",
      status: "Pending",
    };
    setParcels((current) => [record, ...current]);
    setNewParcelUpi("");
    setNewParcelDistrict("");
    setNewParcelSector("");
    setNewParcelArea("");
    setNewParcelUse("");
    setShowAddParcel(false);
  };

  const renderFarmParcels = () => {
    const filtered = parcels.filter((p) => {
      const q = parcelSearch.toLowerCase();
      return (
        (!q ||
          [p.id, p.upi, p.farmer, p.district, p.sector].some((v) =>
            String(v).toLowerCase().includes(q),
          )) &&
        (parcelStatus === "All" || p.status === parcelStatus)
      );
    });
    return (
      <section style={{ display: "grid", gap: 20 }}>
        <div className="stats-grid">
          {[
            { label: "Registered parcels", value: parcels.length, icon: Map },
            {
              label: "Verified parcels",
              value: parcels.filter((p) => p.status === "Verified").length,
              icon: CheckCircle,
            },
            {
              label: "Pending verification",
              value: parcels.filter((p) => p.status !== "Verified").length,
              icon: AlertTriangle,
            },
            {
              label: "Total registered area",
              value: `${parcels.reduce((sum, p) => sum + (parseFloat(p.area) || 0), 0).toFixed(1)} ha`,
              icon: BarChart3,
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div className="stat-card" key={s.label}>
                <div className="stat-top">
                  <div className="stat-icon green">
                    <Icon size={20} />
                  </div>
                  <span className="stat-note">DEMO</span>
                </div>
                <p className="stat-title">{s.label}</p>
                <h3>{s.value}</h3>
                <span className="stat-description">
                  Demonstration records only
                </span>
              </div>
            );
          })}
        </div>
        <div className="content-card" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>Farm parcel registry</h3>
              <p style={{ ...mutedText, margin: "6px 0 0" }}>
                Manage parcel identifiers, farmer ownership and basic land
                information.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowAddParcel((v) => !v)}
            >
              <Plus size={17} /> Add parcel
            </button>
          </div>
          {showAddParcel && (
            <form
              onSubmit={handleAddParcel}
              style={{
                background: "#f5f8f5",
                padding: 18,
                borderRadius: 12,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <label>
                UPI
                <input
                  required
                  value={newParcelUpi}
                  onChange={(e) => setNewParcelUpi(e.target.value)}
                  placeholder="Enter parcel UPI"
                  style={fieldStyle}
                />
              </label>
              <label>
                Farmer
                <select
                  value={newParcelFarmer}
                  onChange={(e) => setNewParcelFarmer(e.target.value)}
                  style={fieldStyle}
                >
                  {allFarmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.id})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                District
                <input
                  required
                  value={newParcelDistrict}
                  onChange={(e) => setNewParcelDistrict(e.target.value)}
                  placeholder="e.g. Gasabo"
                  style={fieldStyle}
                />
              </label>
              <label>
                Sector
                <input
                  value={newParcelSector}
                  onChange={(e) => setNewParcelSector(e.target.value)}
                  placeholder="Sector"
                  style={fieldStyle}
                />
              </label>
              <label>
                Area
                <input
                  required
                  value={newParcelArea}
                  onChange={(e) => setNewParcelArea(e.target.value)}
                  placeholder="e.g. 0.8 ha"
                  style={fieldStyle}
                />
              </label>
              <label>
                Current land use
                <input
                  value={newParcelUse}
                  onChange={(e) => setNewParcelUse(e.target.value)}
                  placeholder="e.g. Beans"
                  style={fieldStyle}
                />
              </label>
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <button className="primary-button" type="submit">
                  <Save size={16} /> Save parcel
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setShowAddParcel(false)}
                >
                  Cancel
                </button>
                <span style={mutedText}>
                  New records are saved in this page's temporary state only.
                </span>
              </div>
            </form>
          )}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div
              className="search-box"
              style={{ flex: "1 1 240px", minWidth: 0 }}
            >
              <Search size={18} />
              <input
                value={parcelSearch}
                onChange={(e) => setParcelSearch(e.target.value)}
                placeholder="Search UPI, farmer, district..."
              />
            </div>
            <select
              value={parcelStatus}
              onChange={(e) => setParcelStatus(e.target.value)}
              style={{
                ...fieldStyle,
                width: "auto",
                minWidth: 170,
                marginTop: 0,
              }}
            >
              <option>All</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Needs review</option>
            </select>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {[
                    "Parcel ID / UPI",
                    "Farmer",
                    "District / Sector",
                    "Area",
                    "Land use",
                    "Status",
                    "",
                  ].map((x) => (
                    <th style={thStyle} key={x}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={tdStyle}>
                      <strong style={{ display: "block", color: "#294333" }}>
                        {p.id}
                      </strong>
                      <span style={{ fontSize: 11, color: "#89958d" }}>
                        {p.upi}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {p.farmer}
                      <div style={{ fontSize: 11, color: "#89958d" }}>
                        {p.farmerId}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {p.district}
                      <div style={{ fontSize: 11, color: "#89958d" }}>
                        {p.sector}
                      </div>
                    </td>
                    <td style={tdStyle}>{p.area}</td>
                    <td style={tdStyle}>{p.landUse}</td>
                    <td style={tdStyle}>
                      <span className="demo-label">{p.status}</span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        className="text-button"
                        onClick={() => setSelectedParcel(p)}
                      >
                        <Eye size={15} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ ...tdStyle, textAlign: "center", padding: 28 }}
                    >
                      No parcels match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {selectedParcel && (
          <div style={{ ...panelStyle, position: "relative" }}>
            <button
              onClick={() => setSelectedParcel(null)}
              style={{
                float: "right",
                border: 0,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X size={19} />
            </button>
            <h3>Parcel details — {selectedParcel.id}</h3>
            <p style={mutedText}>UPI: {selectedParcel.upi}</p>
            <div className="stats-grid">
              {[
                ["Registered farmer", selectedParcel.farmer],
                ["District", selectedParcel.district],
                ["Sector", selectedParcel.sector],
                ["Area", selectedParcel.area],
                ["Land use", selectedParcel.landUse],
                ["Verification", selectedParcel.status],
              ].map(([a, b]) => (
                <div
                  key={a}
                  style={{
                    padding: 12,
                    background: "#f7faf7",
                    borderRadius: 9,
                  }}
                >
                  <small style={mutedText}>{a}</small>
                  <strong
                    style={{ display: "block", marginTop: 5, color: "#294333" }}
                  >
                    {b}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderSoil = () => {
    const filtered = soilRecords.filter((r) =>
      [r.parcelId, r.farmer, r.district, r.texture].some((v) =>
        String(v).toLowerCase().includes(soilSearch.toLowerCase()),
      ),
    );
    return (
      <section style={{ display: "grid", gap: 20 }}>
        <div className="stats-grid">
          {[
            ["Soil records", soilRecords.length, Sprout],
            [
              "Estimated records",
              soilRecords.filter((r) => r.quality === "Estimated").length,
              Info,
            ],
            [
              "Average pH",
              (
                soilRecords.reduce((s, r) => s + Number(r.ph), 0) /
                soilRecords.length
              ).toFixed(1),
              Activity,
            ],
            ["Data requiring validation", "All demo records", AlertTriangle],
          ].map(([label, value, Icon]) => (
            <div className="stat-card" key={label}>
              <div className="stat-top">
                <div className="stat-icon green">
                  <Icon size={20} />
                </div>
                <span className="stat-note">DEMO</span>
              </div>
              <p className="stat-title">{label}</p>
              <h3
                style={{
                  fontSize: label === "Data requiring validation" ? 19 : 26,
                }}
              >
                {value}
              </h3>
              <span className="stat-description">
                Illustrative information, not lab results
              </span>
            </div>
          ))}
        </div>
        <div className="content-card" style={{ padding: 22 }}>
          <div className="card-heading">
            <div>
              <h3>Soil intelligence records</h3>
              <p>
                Review parcel-level soil information and its source or
                measurement status.
              </p>
            </div>
            <Sprout size={24} className="heading-icon" />
          </div>
          <div
            style={{
              padding: 13,
              background: "#fff7e6",
              borderRadius: 9,
              color: "#805b12",
              fontSize: 13,
              display: "flex",
              gap: 9,
              margin: "16px 0",
            }}
          >
            <AlertTriangle size={18} /> All values below are demonstration data.
            Estimated soil information must not be treated as laboratory
            measurements or definitive parcel facts.
          </div>
          <div
            className="search-box"
            style={{ maxWidth: 420, marginBottom: 16 }}
          >
            <Search size={18} />
            <input
              value={soilSearch}
              onChange={(e) => setSoilSearch(e.target.value)}
              placeholder="Search parcel, farmer, district or texture..."
            />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {[
                    "Parcel",
                    "Farmer / District",
                    "pH",
                    "Texture",
                    "Drainage",
                    "Organic matter",
                    "Source / status",
                    "Updated",
                  ].map((x) => (
                    <th style={thStyle} key={x}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.parcelId}>
                    <td style={tdStyle}>
                      <strong>{r.parcelId}</strong>
                    </td>
                    <td style={tdStyle}>
                      {r.farmer}
                      <div style={{ fontSize: 11, color: "#89958d" }}>
                        {r.district}
                      </div>
                    </td>
                    <td style={tdStyle}>{r.ph}</td>
                    <td style={tdStyle}>{r.texture}</td>
                    <td style={tdStyle}>{r.drainage}</td>
                    <td style={tdStyle}>{r.organicMatter}</td>
                    <td style={tdStyle}>
                      {r.source}
                      <div style={{ fontSize: 11, color: "#a16b12" }}>
                        {r.quality}
                      </div>
                    </td>
                    <td style={tdStyle}>{r.updated}</td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan="8" style={{ ...tdStyle, textAlign: "center" }}>
                      No matching soil records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Data quality checklist</h3>
          <div className="stats-grid">
            {[
              "Record the data source for every soil value",
              "Distinguish measured results from model estimates",
              "Store the date and geographic resolution",
              "Request field or laboratory validation when needed",
            ].map((x) => (
              <div
                key={x}
                style={{
                  padding: 13,
                  background: "#f5f8f5",
                  borderRadius: 9,
                  color: "#405849",
                  fontSize: 13,
                }}
              >
                <CheckCircle
                  size={17}
                  style={{
                    verticalAlign: "middle",
                    marginRight: 7,
                    color: "#27804b",
                  }}
                />
                {x}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderWeather = () => (
    <section style={{ display: "grid", gap: 20 }}>
      <div className="content-card" style={{ padding: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div className="card-heading">
            <div>
              <h3>Weather & climate monitoring</h3>
              <p>
                Prototype overview of weather information used to support
                parcel-level advice.
              </p>
            </div>
            <CloudSun size={25} className="heading-icon" />
          </div>
          <select
            value={weatherDistrict}
            onChange={(e) => setWeatherDistrict(e.target.value)}
            style={{
              ...fieldStyle,
              width: "auto",
              minWidth: 180,
              marginTop: 0,
            }}
          >
            {[
              "Kigali",
              "Huye",
              "Musanze",
              "Muhanga",
              "Rubavu",
              "Nyagatare",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div
          style={{
            padding: 15,
            background: "#fff7e6",
            borderRadius: 9,
            color: "#805b12",
            fontSize: 13,
            marginTop: 16,
            display: "flex",
            gap: 9,
          }}
        >
          <Info size={18} /> These weather figures are illustrative
          placeholders. No live weather API is connected yet. Do not use them
          for planting decisions.
        </div>
        <div className="stats-grid" style={{ marginTop: 18 }}>
          {[
            { label: "Current temperature", value: "24°C", icon: Thermometer },
            { label: "Rain probability", value: "30%", icon: CloudRain },
            { label: "Wind speed", value: "12 km/h", icon: Wind },
            { label: "Humidity", value: "68%", icon: Droplets },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div className="stat-card" key={s.label}>
                <div className="stat-top">
                  <div className="stat-icon blue">
                    <Icon size={20} />
                  </div>
                  <span className="stat-note">DEMO</span>
                </div>
                <p className="stat-title">{s.label}</p>
                <h3>{s.value}</h3>
                <span className="stat-description">
                  {weatherDistrict}, Rwanda
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="content-card" style={{ padding: 22 }}>
        <div className="card-heading">
          <div>
            <h3>Forecast monitoring checklist</h3>
            <p>
              Information the platform should capture when a trusted weather
              source is connected.
            </p>
          </div>
          <CalendarDays size={24} className="heading-icon" />
        </div>
        <div className="stats-grid">
          {[
            "Rainfall forecast and accumulation",
            "Minimum and maximum temperature",
            "Wind and humidity",
            "Forecast issue time and valid period",
            "Weather provider and data resolution",
            "Risk alerts reviewed by an agricultural specialist",
          ].map((x) => (
            <div
              key={x}
              style={{
                padding: 14,
                borderRadius: 9,
                background: "#f5f8f5",
                fontSize: 13,
                color: "#405849",
              }}
            >
              <Cloud
                size={17}
                style={{
                  verticalAlign: "middle",
                  marginRight: 7,
                  color: "#27804b",
                }}
              />
              {x}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCropSuitability = () => {
    const filtered = assessments.filter(
      (a) => assessmentFilter === "All" || a.type === assessmentFilter,
    );
    return (
      <section style={{ display: "grid", gap: 20 }}>
        <div className="stats-grid">
          {[
            ["Total assessments", assessments.length, ClipboardList],
            [
              "Open recommendations",
              assessments.filter((a) => a.type === "Open recommendation")
                .length,
              Leaf,
            ],
            [
              "Received crop advisories",
              assessments.filter((a) => a.type === "Received crop advisory")
                .length,
              Wheat,
            ],
            [
              "Require review",
              assessments.filter(
                (a) =>
                  a.result === "Review required" ||
                  a.result === "Pending assessment",
              ).length,
              AlertTriangle,
            ],
          ].map(([label, value, Icon]) => (
            <div className="stat-card" key={label}>
              <div className="stat-top">
                <div className="stat-icon green">
                  <Icon size={20} />
                </div>
                <span className="stat-note">DEMO</span>
              </div>
              <p className="stat-title">{label}</p>
              <h3>{value}</h3>
              <span className="stat-description">
                Sample assessment records
              </span>
            </div>
          ))}
        </div>
        <div className="content-card" style={{ padding: 22 }}>
          <div className="card-heading">
            <div>
              <h3>Crop assessment registry</h3>
              <p>
                Review open crop recommendations separately from crops already
                received by farmers.
              </p>
            </div>
            <Wheat size={25} className="heading-icon" />
          </div>
          <div
            style={{
              padding: 13,
              background: "#fff7e6",
              borderRadius: 9,
              color: "#805b12",
              fontSize: 13,
              margin: "16px 0",
            }}
          >
            <AlertTriangle
              size={17}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />{" "}
            These are example records, not validated agronomic recommendations.
            Suitability decisions require reliable parcel data, crop
            requirements and local expert validation.
          </div>
          <select
            value={assessmentFilter}
            onChange={(e) => setAssessmentFilter(e.target.value)}
            style={{
              ...fieldStyle,
              width: "auto",
              minWidth: 230,
              marginBottom: 16,
            }}
          >
            <option>All</option>
            <option>Open recommendation</option>
            <option>Received crop advisory</option>
          </select>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {[
                    "Assessment ID",
                    "Farmer",
                    "Parcel",
                    "Crop",
                    "Season",
                    "Assessment type",
                    "Status",
                    "Date",
                  ].map((x) => (
                    <th style={thStyle} key={x}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={tdStyle}>
                      <strong>{a.id}</strong>
                    </td>
                    <td style={tdStyle}>{a.farmer}</td>
                    <td style={tdStyle}>{a.parcelId}</td>
                    <td style={tdStyle}>{a.crop}</td>
                    <td style={tdStyle}>{a.season}</td>
                    <td style={tdStyle}>{a.type}</td>
                    <td style={tdStyle}>
                      <span className="demo-label">{a.result}</span>
                    </td>
                    <td style={tdStyle}>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>
            How AgriNova should assess suitability
          </h3>
          <div className="stats-grid">
            {[
              [
                "1",
                "Parcel context",
                "Soil, slope, location, drainage and land conditions.",
              ],
              [
                "2",
                "Weather context",
                "Seasonal rainfall, temperature and forecast uncertainty.",
              ],
              [
                "3",
                "Crop requirements",
                "Verified crop and variety requirements from trusted sources.",
              ],
              [
                "4",
                "Review and explain",
                "Show reasons, limitations, confidence and expert referral where needed.",
              ],
            ].map(([n, title, desc]) => (
              <div
                key={n}
                style={{ padding: 15, background: "#f5f8f5", borderRadius: 10 }}
              >
                <span style={{ fontWeight: 800, color: "#27804b" }}>{n}</span>
                <strong
                  style={{
                    display: "block",
                    margin: "6px 0",
                    color: "#294333",
                  }}
                >
                  {title}
                </strong>
                <p style={{ ...mutedText, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const sendAdminMessage = (e) => {
    e.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    const answer =
      "This is a demonstration response. In the connected system, AgriNova will retrieve relevant verified agricultural documents and platform records before generating an answer. For crop-specific decisions, the system must show its sources and refer uncertain cases to an agricultural extension officer.";
    setChatMessages((current) => [
      ...current,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);
    setChatInput("");
  };

  const renderAssistant = () => (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.6fr) minmax(240px,.8fr)",
        gap: 18,
      }}
    >
      <div
        className="content-card"
        style={{
          padding: 22,
          display: "flex",
          flexDirection: "column",
          minHeight: 520,
        }}
      >
        <div className="card-heading">
          <div>
            <h3>AgriNova AI Assistant</h3>
            <p>
              Admin demonstration workspace for AI and knowledge-support
              interactions.
            </p>
          </div>
          <Bot size={25} className="heading-icon" />
        </div>
        <div
          style={{
            background: "#fff7e6",
            padding: 12,
            borderRadius: 9,
            color: "#805b12",
            fontSize: 12,
            margin: "14px 0",
          }}
        >
          Prototype only: this chat is not connected to an LLM, RAG pipeline,
          live database or external services. Do not enter private farmer
          information.
        </div>
        <div
          style={{
            flex: 1,
            display: "grid",
            gap: 12,
            alignContent: "start",
            padding: "10px 0",
          }}
        >
          {chatMessages.map((m, i) => (
            <div
              key={i}
              style={{
                justifySelf: m.role === "user" ? "end" : "start",
                maxWidth: "88%",
                background: m.role === "user" ? "#e8f5ec" : "#f3f6f3",
                padding: 13,
                borderRadius: 12,
                color: "#294333",
                fontSize: 13,
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: 11,
                  marginBottom: 5,
                  color: "#27804b",
                }}
              >
                {m.role === "user" ? "You" : "AgriNova Assistant"}
              </strong>
              {m.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={sendAdminMessage}
          style={{
            display: "flex",
            gap: 9,
            borderTop: "1px solid #edf1ed",
            paddingTop: 15,
          }}
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about the AgriNova platform..."
            style={{ ...fieldStyle, marginTop: 0, flex: 1 }}
          />
          <button
            className="primary-button"
            type="submit"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>AI system components</h3>
          {[
            [Database, "Farmer and parcel context"],
            [FileText, "Trusted agricultural documents"],
            [Search, "Retrieval and source citations"],
            [Bot, "LLM explanation layer"],
            [ShieldCheck, "Safety and expert referral"],
          ].map(([Icon, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "11px 0",
                borderBottom: "1px solid #edf1ed",
                fontSize: 13,
                color: "#405849",
              }}
            >
              <Icon size={18} color="#27804b" />
              {label}
            </div>
          ))}
        </div>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Cases needing review</h3>
          <p style={mutedText}>
            A future monitoring queue for questions where retrieved evidence is
            insufficient, conflicting or requires a human specialist.
          </p>
          <span className="demo-label">Demo queue: not connected</span>
        </div>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1.3fr) minmax(240px,.7fr)",
        gap: 18,
      }}
    >
      <div className="content-card" style={{ padding: 24 }}>
        <div className="card-heading">
          <div>
            <h3>Platform settings</h3>
            <p>Configure basic preferences for this admin prototype.</p>
          </div>
          <Settings size={24} className="heading-icon" />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem(
              "agrinova_admin_settings",
              JSON.stringify(settings),
            );
            setSettingsSaved(true);
          }}
          style={{ display: "grid", gap: 17, marginTop: 18 }}
        >
          <label style={fieldLabelStyle}>
            Platform name
            <input
              value={settings.platformName}
              onChange={(e) => {
                setSettings({ ...settings, platformName: e.target.value });
                setSettingsSaved(false);
              }}
              style={fieldStyle}
            />
          </label>
          <label style={fieldLabelStyle}>
            Administrator contact email
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => {
                setSettings({ ...settings, contactEmail: e.target.value });
                setSettingsSaved(false);
              }}
              style={fieldStyle}
            />
          </label>
          <label style={fieldLabelStyle}>
            Default language
            <select
              value={settings.defaultLanguage}
              onChange={(e) => {
                setSettings({ ...settings, defaultLanguage: e.target.value });
                setSettingsSaved(false);
              }}
              style={fieldStyle}
            >
              <option>Kinyarwanda</option>
              <option>English</option>
            </select>
          </label>
          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              color: "#405849",
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => {
                setSettings({ ...settings, notifications: e.target.checked });
                setSettingsSaved(false);
              }}
            />{" "}
            Enable admin notifications
          </label>
          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              color: "#405849",
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={settings.reviewRequired}
              onChange={(e) => {
                setSettings({ ...settings, reviewRequired: e.target.checked });
                setSettingsSaved(false);
              }}
            />{" "}
            Require expert review for uncertain agricultural advice
          </label>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button className="primary-button" type="submit">
              <Save size={17} /> Save preferences
            </button>
            {settingsSaved && (
              <span style={{ color: "#27804b", fontSize: 13 }}>
                <CheckCircle
                  size={15}
                  style={{ verticalAlign: "middle", marginRight: 5 }}
                />
                Preferences saved in this session.
              </span>
            )}
          </div>
        </form>
      </div>
      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Security reminders</h3>
          {[
            "Use role-based access for admins, farmers and officers",
            "Never store passwords in frontend code or local storage",
            "Restrict farmers to their own records",
            "Keep audit logs for important administrative actions",
          ].map((x) => (
            <p
              key={x}
              style={{
                fontSize: 13,
                color: "#52675a",
                paddingBottom: 10,
                borderBottom: "1px solid #edf1ed",
              }}
            >
              <ShieldCheck
                size={16}
                color="#27804b"
                style={{ verticalAlign: "middle", marginRight: 7 }}
              />
              {x}
            </p>
          ))}
        </div>
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Platform connection status</h3>
          <p style={mutedText}>Frontend prototype</p>
          <span className="demo-label">Backend not connected</span>
          <p style={{ ...mutedText, marginTop: 12 }}>
            Farmer records, settings, soil data, weather and AI conversations
            will become persistent after API and database integration.
          </p>
        </div>
      </div>
    </section>
  );

  const currentTitle = pageNames[activePage] || activePage;

  return (
    <div className="app-container">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Sprout size={25} />
          </div>

         <Link to="/" className="brand-home-link">
           <div>
             <h2>AgriNova</h2>
             <span>SMART FARMER RWANDA</span>
           </div>
         </Link>
        </div>

        <div className="nav-section">
          <p className="nav-label">{t.mainMenu}</p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? "active" : ""}`}
                onClick={() => goToPage(item.name)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
            onClick={() => goToPage("Settings")}
          >
            <Settings size={19} />
            <span>{t.settings}</span>
          </button>

          <div className="sidebar-message">
            <div className="message-icon">
              <Leaf size={20} />
            </div>

            <h4>{t.growing}</h4>
            <p>{t.support}</p>
          </div>

          <div className="sidebar-footer">
            <div className="avatar">AN</div>

            <div>
              <strong>AgriNova Team</strong>
              <span>{t.admin}</span>
            </div>

            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="breadcrumb">Pages / {currentTitle}</p>
              <h2>{currentTitle}</h2>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input placeholder={t.search} />
              <span>⌘ K</span>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#34523d",
              }}
              title="Choose language"
            >
              <Languages size={18} />

              <select
                aria-label="Choose language"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                style={{
                  border: "1px solid #d8e2da",
                  borderRadius: "8px",
                  padding: "8px 6px",
                  background: "#fff",
                  color: "#294333",
                }}
              >
                <option value="en">🇬🇧 English</option>

                <option value="rw">🇷🇼 Kinyarwanda</option>
              </select>
            </label>

            <button className="notification-button">
              <Bell size={20} />
              <i />
            </button>

            <div className="profile-avatar">A</div>
          </div>
        </header>

        <div className="dashboard-content">
          {activePage === "Dashboard" && translateUiTree(renderDashboard())}
          {activePage === "Farmers" && translateUiTree(renderFarmers())}
          {activePage === "Farm Parcels" &&
            translateUiTree(renderFarmParcels())}
          {activePage === "Soil Intelligence" && translateUiTree(renderSoil())}
          {activePage === "Weather & Climate" &&
            translateUiTree(renderWeather())}
          {activePage === "Open Crop Recommendation" &&
            translateUiTree(renderOpenRecommendation())}
          {activePage === "Received Crop Advisory" &&
            translateUiTree(renderReceivedAdvisory())}
          {activePage === "Crop Suitability" &&
            translateUiTree(renderCropSuitability())}
          {activePage === "AI Assistant" && translateUiTree(renderAssistant())}
          {activePage === "Settings" && translateUiTree(renderSettings())}

          <footer className="footer">
            <p>© 2026 AgriNova — {t.footer}</p>
            <span>{t.built}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
