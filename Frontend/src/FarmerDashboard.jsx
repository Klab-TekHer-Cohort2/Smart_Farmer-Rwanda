import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  MapPinned,
  CloudSun,
  PackageCheck,
  MessageCircle,
  UserRound,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Droplets,
  ThermometerSun,
  Wind,
  CalendarDays,
  ArrowUpRight,
  Send,
  CircleHelp,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Plus,
  ClipboardList,
  Wheat,
} from "lucide-react";
import "./FarmerDashboard.css";

const translations = {
  rw: {
    Overview: "Incamake",
    "My Parcels": "Imirima yanjye",
    Weather: "Iteganyagihe",
    "Crop Recommendations": "Ibyifuzo by'ibihingwa",
    "Received Advisory": "Inama nahawe",
    "AI Assistant": "Umufasha wa AI",
    Profile: "Umwirondoro",
    "Farmer Portal": "Urubuga rw'Umuhinzi",
    "Farmer Space": "Ahagenewe umuhinzi",
    "Welcome back": "Murakaza neza",
    "Manage your parcels, record your crops and follow agricultural information for your farm.":
      "Genzura imirima yawe, wandike ibihingwa uhinga kandi ukurikirane amakuru y'ubuhinzi.",
    "My parcels": "Imirima yanjye",
    "Crop records": "Amakuru y'ibihingwa",
    "Crop assessments": "Isuzuma ry'ibihingwa",
    "Received advisories": "Inama nahawe",
    "In this demo": "Muri iyi ngero",
    "Recorded crops": "Ibihingwa byanditswe",
    "Records and requests": "Amakuru n'ubusabe",
    "Demo records": "Amakuru y'igerageza",
    "Register a parcel": "Andikisha umurima",
    "Request recommendation": "Saba isuzuma ry'ibihingwa",
    "Record a crop": "Andika igihingwa",
    "My farm parcels": "Imirima yanjye",
    "Your registered parcel overview": "Incamake y'imirima wandikishije",
    "View all": "Reba byose",
    "Recent farm activity": "Ibikorwa biheruka ku murima",
    "Crop records and assessment requests":
      "Amakuru y'ibihingwa n'ubusabe bw'isuzuma",
    "Recommendation request": "Ubusabe bw'isuzuma",
    "Development preview": "Igerageza ry'ikorwa rya sisitemu",
    "My Parcels": "Imirima yanjye",
    "Register and manage parcels associated with your account.":
      "Andikisha kandi ucunge imirima iri kuri konti yawe.",
    "Register new parcel": "Andikisha umurima mushya",
    "Register a farm parcel": "Andikisha umurima",
    "New demo parcels are marked pending review. UPI verification is not performed here.":
      "Imirima mishya y'igerageza ishyirwa mu itegereje kugenzurwa. UPI ntigenzurwa hano.",
    "Parcel name *": "Izina ry'umurima *",
    "UPI *": "UPI *",
    "District *": "Akarere *",
    "Sector *": "Umurenge *",
    Cell: "Akagari",
    "Area (hectares) *": "Ubuso (hegitari) *",
    "Soil type (if known)": "Ubwoko bw'ubutaka (niba buzwi)",
    "Save parcel": "Bika umurima",
    Cancel: "Hagarika",
    "Search by parcel name, UPI or location":
      "Shakisha ukoresheje izina ry'umurima, UPI cyangwa aho uherereye",
    Parcel: "Umurima",
    Location: "Aho uherereye",
    Area: "Ubuso",
    "Soil information": "Amakuru y'ubutaka",
    Status: "Imiterere",
    "No parcels match your search.": "Nta murima uhuye n'ibyo washakishije.",
    "Parcel weather": "Iteganyagihe ry'umurima",
    "Select a registered parcel to view its weather area.":
      "Hitamo umurima wandikishije kugira ngo urebe amakuru y'iteganyagihe.",
    "Select parcel": "Hitamo umurima",
    "Register a parcel first.": "Banza wandikishe umurima.",
    "SELECTED FARM LOCATION": "AHO UMURIMA UHEREREYE",
    "No parcel selected": "Nta murima wahisemo",
    "Add a parcel to continue.": "Ongeraho umurima kugira ngo ukomeze.",
    "Location unavailable": "Aho uherereye ntihamenyekanye",
    Temperature: "Ubushyuhe",
    Rainfall: "Imvura",
    Wind: "Umuyaga",
    "Live data not connected": "Amakuru nyayo ntarahuza na sisitemu",
    "Forecast and weather alerts": "Iteganyagihe n'imbuzi z'ikirere",
    "Forecast timeline for the selected parcel":
      "Iteganyagihe ry'umurima wahisemo",
    "Waiting for weather connection": "Hategerejwe guhuza amakuru y'ikirere",
    "Crop Recommendations": "Ibyifuzo by'ibihingwa",
    "Request a new parcel- and season-specific crop assessment.":
      "Saba isuzuma ry'ibihingwa rishingiye ku murima no ku gihembwe.",
    "Get new recommendation": "Saba ibyifuzo bishya",
    "Request a crop assessment": "Saba isuzuma ry'ibihingwa",
    "Farm parcel *": "Umurima *",
    "Agricultural season *": "Igihembwe cy'ubuhinzi *",
    "Expected planting period": "Igihe uteganya gutera",
    "Additional information": "Andi makuru",
    "Submit assessment request": "Ohereza ubusabe bw'isuzuma",
    "My assessment requests": "Ubusabe bwanjye bw'isuzuma",
    "No new assessment requests": "Nta busabe bushya bw'isuzuma",
    "Previous recommendation records": "Amakuru y'ibyifuzo byatanzwe mbere",
    "Sample record": "Urugero rw'amakuru",
    "Received Advisory & Crop Records": "Inama nahawe n'amakuru y'ibihingwa",
    "View guidance and record the crops you are growing.":
      "Reba inama wahawe kandi wandike ibihingwa uhinga.",
    "Register a crop": "Andikisha igihingwa",
    "Record advice received": "Andika inama wahawe",
    "Register a crop on your parcel": "Andikisha igihingwa mu murima wawe",
    "Record a crop you plan to grow or have already planted.":
      "Andika igihingwa uteganya guhinga cyangwa wamaze gutera.",
    "Crop name *": "Izina ry'igihingwa *",
    "Crop variety": "Ubwoko bw'igihingwa",
    "Season *": "Igihembwe *",
    "Planting date": "Itariki yo gutera",
    "Area planted (hectares)": "Ubuso bwatewemo (hegitari)",
    "Seed source": "Aho imbuto zavuye",
    "Crop status": "Imiterere y'igihingwa",
    "Additional notes": "Andi bisobanuro",
    "Save crop record": "Bika amakuru y'igihingwa",
    "Record advice you received": "Andika inama wahawe",
    "Related parcel *": "Umurima bireba *",
    "Related crop": "Igihingwa bireba",
    "Advice title *": "Umutwe w'inama *",
    "Advice category": "Icyiciro cy'inama",
    "Provided by": "Yatanzwe na",
    "Date received": "Itariki wayakiriyeho",
    "Advice details *": "Ibisobanuro by'inama *",
    "Save advisory record": "Bika inama",
    "My crop records": "Amakuru y'ibihingwa byanjye",
    Crop: "Igihingwa",
    Variety: "Ubwoko",
    "Planting date": "Itariki yo gutera",
    "No crop records yet": "Nta makuru y'ibihingwa arahari",
    "Agricultural advisories": "Inama z'ubuhinzi",
    "Provided by:": "Yatanzwe na:",
    "Not specified": "Ntabwo byasobanuwe",
    "AgriNova AI Assistant": "Umufasha wa AgriNova ukoresha AI",
    "Ask questions about farming and agricultural practices.":
      "Baza ibibazo ku buhinzi n'uburyo bwo gukora ibikorwa by'ubuhinzi.",
    "AI prototype": "Igerageza rya AI",
    "Type your agricultural question...": "Andika ikibazo cyawe ku buhinzi...",
    "My Profile": "Umwirondoro wanjye",
    "View and update your basic account details.":
      "Reba kandi uhindure amakuru y'ibanze ya konti yawe.",
    "Full name": "Amazina yuzuye",
    "Phone number": "Nimero ya telefone",
    "Preferred language": "Ururimi ukunda gukoresha",
    District: "Akarere",
    "Save changes": "Bika impinduka",
    "Changes saved in this demo session only.":
      "Impinduka zabitswe muri iri gerageza gusa.",
    "Farmer account": "Konti y'umuhinzi",
    "Need help?": "Ukeneye ubufasha?",
    "Contact your local agricultural officer.":
      "Vugana n'umukozi ushinzwe ubuhinzi mu gace utuyemo.",
    "Log out": "Sohoka",
    Notifications: "Ubutumwa",
    Verified: "Byagenzuwe",
    "Pending review": "Bitegereje kugenzurwa",
    "Assessment requested": "Isuzuma ryasabwe",
    Growing: "Kirimo gukura",
    Planned: "Kirateganyijwe",
    Planted: "Cyatewe",
    Harvested: "Cyasaruwe",
    "Season A": "Igihembwe A",
    "Season B": "Igihembwe B",
    "Season C": "Igihembwe C",
    English: "Icyongereza",
    Kinyarwanda: "Ikinyarwanda",
    "Unknown parcel": "Umurima utazwi",
    "General guidance": "Inama rusange",
    "Land preparation": "Gutegura ubutaka",
    Planting: "Gutera",
    "Soil fertility": "Uburumbuke bw'ubutaka",
    "Water management": "Imicungire y'amazi",
    "Pest and disease": "Udukoko n'indwara",
    "Harvest and storage": "Gusarura no kubika umusaruro",
  },
};

function translate(value, language) {
  if (typeof value !== "string" || language === "en") return value;
  return translations.rw[value] || value;
}

const initialFarmer = {
  name: "Jean Baptiste",
  phone: "+250 788 000 000",
  language: "Kinyarwanda",
  district: "Huye",
  memberSince: "September 2026",
};
const initialParcels = [
  {
    id: "PCL-001",
    upi: "DEMO-UPI-001",
    name: "Main farm",
    district: "Huye",
    sector: "Ngoma",
    cell: "Rukira",
    area: "0.8",
    soil: "Clay loam",
    status: "Verified",
  },
  {
    id: "PCL-002",
    upi: "DEMO-UPI-002",
    name: "Lower field",
    district: "Huye",
    sector: "Ngoma",
    cell: "Rukira",
    area: "0.4",
    soil: "Not available",
    status: "Pending review",
  },
];
const initialRecommendations = [
  {
    id: "REC-001",
    parcelId: "PCL-001",
    crop: "Beans",
    season: "Season A",
    date: "12 Nov 2026",
    reason: "Illustrative result based on sample parcel information.",
  },
  {
    id: "REC-002",
    parcelId: "PCL-002",
    crop: "Maize",
    season: "Season A",
    date: "15 Nov 2026",
    reason:
      "Illustrative record only; a real assessment requires verified parcel and seasonal data.",
  },
];
const initialCrops = [
  {
    id: "CRP-001",
    parcelId: "PCL-001",
    crop: "Beans",
    variety: "Local variety",
    season: "Season A",
    plantingDate: "2026-10-20",
    area: "0.3",
    seedSource: "Local agro-dealer",
    status: "Growing",
    notes: "Sample crop record",
  },
];
const initialAdvisories = [
  {
    id: "ADV-001",
    parcelId: "PCL-001",
    crop: "Beans",
    title: "Example crop management advice",
    category: "Crop management",
    provider: "Example cooperative",
    date: "2026-11-10",
    message:
      "Sample advisory only. Confirm that advice is appropriate for your crop variety and parcel with a qualified agricultural officer.",
  },
];
const nav = [
  ["overview", "Overview", LayoutDashboard],
  ["parcels", "My Parcels", MapPinned],
  ["weather", "Weather", CloudSun],
  ["recommendations", "Crop Recommendations", Sprout],
  ["advisories", "Received Advisory", PackageCheck],
  ["assistant", "AI Assistant", MessageCircle],
  ["profile", "Profile", UserRound],
];
const today = () => new Date().toISOString().slice(0, 10);
function Pill({ children }) {
  const pending = /pending|requested/i.test(String(children));
  return (
    <span className={`fd-status ${pending ? "pending" : "good"}`}>
      {children}
    </span>
  );
}
function Field({ label, children }) {
  return (
    <label className="fd-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function FarmerDashboard() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("agrinova-language") || "rw",
  );

  const t = (text) => translate(text, language);

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    localStorage.setItem("agrinova-language", nextLanguage);

    setProfile((old) => ({
      ...old,
      language: nextLanguage === "rw" ? "Kinyarwanda" : "English",
    }));
  }
  const [page, setPage] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(initialFarmer);
  const [profileSaved, setProfileSaved] = useState(false);
  const [parcels, setParcels] = useState(initialParcels);
  const [parcelSearch, setParcelSearch] = useState("");
  const [parcelFormOpen, setParcelFormOpen] = useState(false);
  const [parcelForm, setParcelForm] = useState({
    name: "",
    upi: "",
    district: "",
    sector: "",
    cell: "",
    area: "",
    soil: "",
  });
  const [weatherParcel, setWeatherParcel] = useState("PCL-001");
  const [recommendations] = useState(initialRecommendations);
  const [requests, setRequests] = useState([]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    parcelId: "PCL-001",
    season: "Season A",
    plantingWindow: "",
    notes: "",
  });
  const [crops, setCrops] = useState(initialCrops);
  const [cropFormOpen, setCropFormOpen] = useState(false);
  const [cropForm, setCropForm] = useState({
    parcelId: "PCL-001",
    crop: "",
    variety: "",
    season: "Season A",
    plantingDate: today(),
    area: "",
    seedSource: "",
    status: "Planned",
    notes: "",
  });
  const [advisories, setAdvisories] = useState(initialAdvisories);
  const [advisoryFormOpen, setAdvisoryFormOpen] = useState(false);
  const [advisoryForm, setAdvisoryForm] = useState({
    parcelId: "PCL-001",
    crop: "",
    title: "",
    category: "General guidance",
    provider: "",
    date: today(),
    message: "",
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am the AgriNova assistant prototype. This demonstration is not connected to an AI model or live farm data yet.",
    },
  ]);

  const filteredParcels = useMemo(
    () =>
      parcels.filter((p) =>
        `${p.name} ${p.upi} ${p.district} ${p.sector}`
          .toLowerCase()
          .includes(parcelSearch.toLowerCase()),
      ),
    [parcels, parcelSearch],
  );
  const selectedParcel =
    parcels.find((p) => p.id === weatherParcel) || parcels[0];
  const pageTitle = nav.find((n) => n[0] === page)?.[1] || "Overview";
  const parcelName = (id) =>
    parcels.find((p) => p.id === id)?.name || "Unknown parcel";
  const go = (id) => {
    setPage(id);
    setMenuOpen(false);
  };

  function saveParcel(e) {
    e.preventDefault();
    const p = {
      ...parcelForm,
      id: `PCL-${String(parcels.length + 1).padStart(3, "0")}`,
      status: "Pending review",
      soil: parcelForm.soil || "Not provided",
    };
    setParcels((old) => [...old, p]);
    setWeatherParcel(p.id);
    setRequestForm((old) => ({ ...old, parcelId: p.id }));
    setCropForm((old) => ({ ...old, parcelId: p.id }));
    setAdvisoryForm((old) => ({ ...old, parcelId: p.id }));
    setParcelForm({
      name: "",
      upi: "",
      district: "",
      sector: "",
      cell: "",
      area: "",
      soil: "",
    });
    setParcelFormOpen(false);
  }
  function submitRequest(e) {
    e.preventDefault();
    setRequests((old) => [
      {
        ...requestForm,
        id: `REQ-${String(old.length + 1).padStart(3, "0")}`,
        parcel: parcelName(requestForm.parcelId),
        date: today(),
        status: "Assessment requested",
      },
      ...old,
    ]);
    setRequestOpen(false);
  }
  function saveCrop(e) {
    e.preventDefault();
    setCrops((old) => [
      { ...cropForm, id: `CRP-${String(old.length + 1).padStart(3, "0")}` },
      ...old,
    ]);
    setCropForm({
      parcelId: parcels[0]?.id || "",
      crop: "",
      variety: "",
      season: "Season A",
      plantingDate: today(),
      area: "",
      seedSource: "",
      status: "Planned",
      notes: "",
    });
    setCropFormOpen(false);
  }
  function saveAdvisory(e) {
    e.preventDefault();
    setAdvisories((old) => [
      {
        ...advisoryForm,
        id: `ADV-${String(old.length + 1).padStart(3, "0")}`,
        parcel: parcelName(advisoryForm.parcelId),
      },
      ...old,
    ]);
    setAdvisoryFormOpen(false);
  }
  function sendQuestion(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    setMessages((old) => [
      ...old,
      { role: "user", text: q },
      {
        role: "assistant",
        text: "This is a demonstration response. The AI service is not connected yet, so I cannot assess your parcel or give verified crop-specific advice. Please consult a qualified agricultural officer for farming decisions.",
      },
    ]);
    setQuestion("");
  }

  function overview() {
    return (
      <>
        <section className="fd-welcome">
          <div>
            <span className="fd-eyebrow">FARMER SPACE</span>
            <h2>Welcome back, {profile.name.split(" ")[0]}!</h2>
            <p>
              Manage your parcels, record your crops and follow agricultural
              information for your farm.
            </p>
          </div>
          <div className="fd-welcome-icon">
            <Sprout size={54} />
          </div>
        </section>
        <div className="fd-stat-grid">
          <article className="fd-stat-card">
            <span className="fd-stat-icon green">
              <MapPinned />
            </span>
            <div>
              <small>My parcels</small>
              <strong>{parcels.length}</strong>
              <span>In this demo</span>
            </div>
          </article>
          <article className="fd-stat-card">
            <span className="fd-stat-icon blue">
              <Wheat />
            </span>
            <div>
              <small>Crop records</small>
              <strong>{crops.length}</strong>
              <span>Recorded crops</span>
            </div>
          </article>
          <article className="fd-stat-card">
            <span className="fd-stat-icon purple">
              <Sprout />
            </span>
            <div>
              <small>Crop assessments</small>
              <strong>{recommendations.length + requests.length}</strong>
              <span>Records and requests</span>
            </div>
          </article>
          <article className="fd-stat-card">
            <span className="fd-stat-icon amber">
              <PackageCheck />
            </span>
            <div>
              <small>Received advisories</small>
              <strong>{advisories.length}</strong>
              <span>Demo records</span>
            </div>
          </article>
        </div>
        <div className="fd-quick-actions">
          <button
            className="fd-primary-button"
            onClick={() => {
              go("parcels");
              setParcelFormOpen(true);
            }}
          >
            <Plus size={15} /> Register a parcel
          </button>
          <button
            className="fd-primary-button"
            onClick={() => {
              go("recommendations");
              setRequestOpen(true);
            }}
          >
            <Sprout size={15} /> Request recommendation
          </button>
          <button
            className="fd-secondary-button"
            onClick={() => {
              go("advisories");
              setCropFormOpen(true);
            }}
          >
            <Wheat size={15} /> Record a crop
          </button>
        </div>
        <div className="fd-content-grid">
          <section className="fd-panel">
            <div className="fd-panel-heading">
              <div>
                <h3>My farm parcels</h3>
                <p>Your registered parcel overview</p>
              </div>
              <button className="fd-text-button" onClick={() => go("parcels")}>
                View all <ArrowUpRight size={15} />
              </button>
            </div>
            {parcels.slice(0, 4).map((p) => (
              <div className="fd-parcel-row" key={p.id}>
                <span className="fd-round-icon">
                  <MapPin size={18} />
                </span>
                <div className="fd-grow">
                  <strong>{p.name}</strong>
                  <small>
                    {p.district} · {p.area} ha
                  </small>
                </div>
                <Pill>{p.status}</Pill>
              </div>
            ))}
          </section>
          <section className="fd-panel">
            <div className="fd-panel-heading">
              <div>
                <h3>Recent farm activity</h3>
                <p>Crop records and assessment requests</p>
              </div>
              <button
                className="fd-text-button"
                onClick={() => go("advisories")}
              >
                View all <ArrowUpRight size={15} />
              </button>
            </div>
            {requests.slice(0, 2).map((r) => (
              <div className="fd-activity-row" key={r.id}>
                <span className="fd-round-icon leaf">
                  <ClipboardList size={18} />
                </span>
                <div className="fd-grow">
                  <strong>
                    {r.parcel} · {r.season}
                  </strong>
                  <small>Recommendation request · {r.date}</small>
                </div>
                <Pill>{r.status}</Pill>
              </div>
            ))}
            {crops.slice(0, 2).map((c) => (
              <div className="fd-activity-row" key={c.id}>
                <span className="fd-round-icon leaf">
                  <Wheat size={18} />
                </span>
                <div className="fd-grow">
                  <strong>
                    {c.crop} · {parcelName(c.parcelId)}
                  </strong>
                  <small>
                    {c.season} · {c.status}
                  </small>
                </div>
                <Pill>{c.status}</Pill>
              </div>
            ))}
          </section>
        </div>
        <div className="fd-notice">
          <AlertCircle size={18} />
          <p>
            <strong>Development preview:</strong> Forms save data in this React
            session only. Backend, live weather, crop assessment, AI and shared
            admin records are not connected yet.
          </p>
        </div>
      </>
    );
  }

  function parcelsPage() {
    return (
      <section className="fd-panel">
        <div className="fd-panel-heading">
          <div>
            <h3>My Parcels</h3>
            <p>Register and manage parcels associated with your account.</p>
          </div>
          <button
            className="fd-primary-button"
            onClick={() => setParcelFormOpen((v) => !v)}
          >
            <Plus size={15} /> Register new parcel
          </button>
        </div>
        {parcelFormOpen && (
          <form className="fd-entry-form" onSubmit={saveParcel}>
            <h4>Register a farm parcel</h4>
            <p>
              New demo parcels are marked pending review. UPI verification is
              not performed here.
            </p>
            <div className="fd-form-grid">
              <Field label="Parcel name *">
                <input
                  required
                  value={parcelForm.name}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, name: e.target.value })
                  }
                  placeholder="e.g. My Main Farm"
                />
              </Field>
              <Field label="UPI *">
                <input
                  required
                  value={parcelForm.upi}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, upi: e.target.value })
                  }
                  placeholder="Enter official parcel UPI"
                />
              </Field>
              <Field label="District *">
                <input
                  required
                  value={parcelForm.district}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, district: e.target.value })
                  }
                />
              </Field>
              <Field label="Sector *">
                <input
                  required
                  value={parcelForm.sector}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, sector: e.target.value })
                  }
                />
              </Field>
              <Field label="Cell">
                <input
                  value={parcelForm.cell}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, cell: e.target.value })
                  }
                />
              </Field>
              <Field label="Area (hectares) *">
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={parcelForm.area}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, area: e.target.value })
                  }
                />
              </Field>
              <Field label="Soil type (if known)">
                <input
                  value={parcelForm.soil}
                  onChange={(e) =>
                    setParcelForm({ ...parcelForm, soil: e.target.value })
                  }
                  placeholder="e.g. Clay loam"
                />
              </Field>
            </div>
            <div className="fd-form-actions">
              <button className="fd-primary-button">Save parcel</button>
              <button
                type="button"
                className="fd-secondary-button"
                onClick={() => setParcelFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <label className="fd-search">
          <Search size={17} />
          <input
            value={parcelSearch}
            onChange={(e) => setParcelSearch(e.target.value)}
            placeholder="Search by parcel name, UPI or location"
          />
        </label>
        <div className="fd-table-wrap">
          <table className="fd-table">
            <thead>
              <tr>
                <th>Parcel</th>
                <th>UPI</th>
                <th>Location</th>
                <th>Area</th>
                <th>Soil information</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <small>{p.id}</small>
                  </td>
                  <td>{p.upi}</td>
                  <td>
                    {p.sector}, {p.district}
                  </td>
                  <td>{p.area} ha</td>
                  <td>{p.soil}</td>
                  <td>
                    <Pill>{p.status}</Pill>
                  </td>
                </tr>
              ))}
              {!filteredParcels.length && (
                <tr>
                  <td colSpan="6" className="fd-empty">
                    No parcels match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="fd-notice">
          <AlertCircle size={18} />
          <p>
            UPI ownership and parcel details must be verified by the authorized
            backend service in the real platform.
          </p>
        </div>
      </section>
    );
  }

  function weatherPage() {
    return (
      <>
        <section className="fd-panel">
          <div className="fd-panel-heading">
            <div>
              <h3>Parcel weather</h3>
              <p>Select a registered parcel to view its weather area.</p>
            </div>
            <CloudSun size={22} />
          </div>
          {parcels.length ? (
            <Field label="Select parcel">
              <select
                value={weatherParcel}
                onChange={(e) => setWeatherParcel(e.target.value)}
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.district}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <p>Register a parcel first.</p>
          )}
          <div className="fd-weather-card fd-weather-card-spaced">
            <div>
              <span className="fd-eyebrow">SELECTED FARM LOCATION</span>
              <h3>{selectedParcel?.name || "No parcel selected"}</h3>
              <p>
                {selectedParcel
                  ? `${selectedParcel.cell || ""}, ${selectedParcel.sector}, ${selectedParcel.district}, Rwanda`
                  : "Add a parcel to continue."}{" "}
                Weather will be requested using this parcel's location after the
                weather API is connected.
              </p>
              <div className="fd-weather-location">
                <MapPin size={16} />
                {selectedParcel?.district || "Location unavailable"}, Rwanda
              </div>
            </div>
            <CloudSun size={76} strokeWidth={1.2} />
          </div>
        </section>
        <div className="fd-stat-grid fd-weather-stats">
          <article className="fd-stat-card">
            <span className="fd-stat-icon amber">
              <ThermometerSun />
            </span>
            <div>
              <small>Temperature</small>
              <strong>-- °C</strong>
              <span>Live data not connected</span>
            </div>
          </article>
          <article className="fd-stat-card">
            <span className="fd-stat-icon blue">
              <Droplets />
            </span>
            <div>
              <small>Rainfall</small>
              <strong>-- mm</strong>
              <span>Live data not connected</span>
            </div>
          </article>
          <article className="fd-stat-card">
            <span className="fd-stat-icon green">
              <Wind />
            </span>
            <div>
              <small>Wind</small>
              <strong>-- km/h</strong>
              <span>Live data not connected</span>
            </div>
          </article>
        </div>
        <section className="fd-panel">
          <div className="fd-panel-heading">
            <div>
              <h3>Forecast and weather alerts</h3>
              <p>Forecast timeline for the selected parcel</p>
            </div>
          </div>
          <div className="fd-empty-state">
            <CloudSun size={28} />
            <strong>Waiting for weather connection</strong>
            <span>
              After API integration, this area will show forecast dates,
              rainfall, temperature and relevant alerts for this parcel.
            </span>
          </div>
        </section>
        <div className="fd-notice">
          <AlertCircle size={18} />
          <p>
            No live forecast values are being presented as real weather. The
            selected parcel location is ready for backend integration.
          </p>
        </div>
      </>
    );
  }

  function recommendationsPage() {
    return (
      <section className="fd-panel">
        <div className="fd-panel-heading">
          <div>
            <h3>Crop Recommendations</h3>
            <p>Request a new parcel- and season-specific crop assessment.</p>
          </div>
          <button
            className="fd-primary-button"
            disabled={!parcels.length}
            onClick={() => setRequestOpen((v) => !v)}
          >
            <Plus size={15} /> Get new recommendation
          </button>
        </div>
        {requestOpen && (
          <form className="fd-entry-form" onSubmit={submitRequest}>
            <h4>Request a crop assessment</h4>
            <p>
              This creates a request record only; it does not calculate crop
              suitability yet.
            </p>
            <div className="fd-form-grid">
              <Field label="Farm parcel *">
                <select
                  value={requestForm.parcelId}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, parcelId: e.target.value })
                  }
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.district})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Agricultural season *">
                <select
                  value={requestForm.season}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, season: e.target.value })
                  }
                >
                  <option>Season A</option>
                  <option>Season B</option>
                  <option>Season C</option>
                </select>
              </Field>
              <Field label="Expected planting period">
                <input
                  value={requestForm.plantingWindow}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      plantingWindow: e.target.value,
                    })
                  }
                  placeholder="e.g. October–December"
                />
              </Field>
              <Field label="Additional information">
                <input
                  value={requestForm.notes}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, notes: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="fd-form-actions">
              <button className="fd-primary-button">
                Submit assessment request
              </button>
              <button
                type="button"
                className="fd-secondary-button"
                onClick={() => setRequestOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <h4 className="fd-subheading">My assessment requests</h4>
        {requests.length ? (
          requests.map((r) => (
            <article className="fd-record-card" key={r.id}>
              <div className="fd-record-icon">
                <ClipboardList />
              </div>
              <div className="fd-grow">
                <strong>
                  {r.parcel} · {r.season}
                </strong>
                <small>
                  Requested {r.date}
                  {r.plantingWindow
                    ? ` · Planting period: ${r.plantingWindow}`
                    : ""}
                </small>
                {r.notes && <p>{r.notes}</p>}
              </div>
              <Pill>{r.status}</Pill>
            </article>
          ))
        ) : (
          <div className="fd-empty-state">
            <ClipboardList size={27} />
            <strong>No new assessment requests</strong>
            <span>
              Select a parcel and season, then click “Get new recommendation”.
            </span>
          </div>
        )}
        <h4 className="fd-subheading">Previous recommendation records</h4>
        <div className="fd-card-list">
          {recommendations.map((r) => (
            <article className="fd-recommendation" key={r.id}>
              <div className="fd-recommendation-top">
                <span className="fd-round-icon leaf">
                  <Sprout />
                </span>
                <Pill>Sample record</Pill>
              </div>
              <h4>{r.crop}</h4>
              <p>
                {parcelName(r.parcelId)} · {r.season}
              </p>
              <small>
                <CalendarDays size={14} /> {r.date}
              </small>
              <div className="fd-muted-note">{r.reason}</div>
            </article>
          ))}
        </div>
        <div className="fd-notice">
          <AlertCircle size={18} />
          <p>
            A real recommendation will be produced only after the backend
            assessment engine checks parcel soil, location, season, forecast and
            trusted crop requirements. These sample records are not validated
            agronomic advice.
          </p>
        </div>
      </section>
    );
  }

  function advisoriesPage() {
    return (
      <section className="fd-panel">
        <div className="fd-panel-heading">
          <div>
            <h3>Received Advisory & Crop Records</h3>
            <p>View guidance and record the crops you are growing.</p>
          </div>
          <span className="fd-count">
            {advisories.length} advisories · {crops.length} crops
          </span>
        </div>
        <div className="fd-quick-actions">
          <button
            className="fd-primary-button"
            onClick={() => setCropFormOpen((v) => !v)}
          >
            <Plus size={15} /> Register a crop
          </button>
          <button
            className="fd-secondary-button"
            onClick={() => setAdvisoryFormOpen((v) => !v)}
          >
            <Plus size={15} /> Record advice received
          </button>
        </div>
        {cropFormOpen && (
          <form className="fd-entry-form" onSubmit={saveCrop}>
            <h4>Register a crop on your parcel</h4>
            <p>Record a crop you plan to grow or have already planted.</p>
            <div className="fd-form-grid">
              <Field label="Parcel *">
                <select
                  value={cropForm.parcelId}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, parcelId: e.target.value })
                  }
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Crop name *">
                <input
                  required
                  value={cropForm.crop}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, crop: e.target.value })
                  }
                  placeholder="e.g. Beans, maize, potato"
                />
              </Field>
              <Field label="Crop variety">
                <input
                  value={cropForm.variety}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, variety: e.target.value })
                  }
                />
              </Field>
              <Field label="Season *">
                <select
                  value={cropForm.season}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, season: e.target.value })
                  }
                >
                  <option>Season A</option>
                  <option>Season B</option>
                  <option>Season C</option>
                </select>
              </Field>
              <Field label="Planting date">
                <input
                  type="date"
                  value={cropForm.plantingDate}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, plantingDate: e.target.value })
                  }
                />
              </Field>
              <Field label="Area planted (hectares)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cropForm.area}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, area: e.target.value })
                  }
                />
              </Field>
              <Field label="Seed source">
                <input
                  value={cropForm.seedSource}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, seedSource: e.target.value })
                  }
                />
              </Field>
              <Field label="Crop status">
                <select
                  value={cropForm.status}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, status: e.target.value })
                  }
                >
                  <option>Planned</option>
                  <option>Planted</option>
                  <option>Growing</option>
                  <option>Harvested</option>
                </select>
              </Field>
              <Field label="Additional notes">
                <input
                  value={cropForm.notes}
                  onChange={(e) =>
                    setCropForm({ ...cropForm, notes: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="fd-form-actions">
              <button className="fd-primary-button" disabled={!parcels.length}>
                Save crop record
              </button>
              <button
                type="button"
                className="fd-secondary-button"
                onClick={() => setCropFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {advisoryFormOpen && (
          <form className="fd-entry-form" onSubmit={saveAdvisory}>
            <h4>Record advice you received</h4>
            <p>
              Record advice given by an officer, cooperative or another source.
              Official platform advisories will later arrive from the shared
              backend.
            </p>
            <div className="fd-form-grid">
              <Field label="Related parcel *">
                <select
                  value={advisoryForm.parcelId}
                  onChange={(e) =>
                    setAdvisoryForm({
                      ...advisoryForm,
                      parcelId: e.target.value,
                    })
                  }
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Related crop">
                <input
                  value={advisoryForm.crop}
                  onChange={(e) =>
                    setAdvisoryForm({ ...advisoryForm, crop: e.target.value })
                  }
                />
              </Field>
              <Field label="Advice title *">
                <input
                  required
                  value={advisoryForm.title}
                  onChange={(e) =>
                    setAdvisoryForm({ ...advisoryForm, title: e.target.value })
                  }
                />
              </Field>
              <Field label="Advice category">
                <select
                  value={advisoryForm.category}
                  onChange={(e) =>
                    setAdvisoryForm({
                      ...advisoryForm,
                      category: e.target.value,
                    })
                  }
                >
                  <option>General guidance</option>
                  <option>Land preparation</option>
                  <option>Planting</option>
                  <option>Soil fertility</option>
                  <option>Water management</option>
                  <option>Pest and disease</option>
                  <option>Harvest and storage</option>
                </select>
              </Field>
              <Field label="Provided by">
                <input
                  value={advisoryForm.provider}
                  onChange={(e) =>
                    setAdvisoryForm({
                      ...advisoryForm,
                      provider: e.target.value,
                    })
                  }
                  placeholder="Officer, cooperative or institution"
                />
              </Field>
              <Field label="Date received">
                <input
                  type="date"
                  value={advisoryForm.date}
                  onChange={(e) =>
                    setAdvisoryForm({ ...advisoryForm, date: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Advice details *">
              <textarea
                required
                rows="3"
                value={advisoryForm.message}
                onChange={(e) =>
                  setAdvisoryForm({ ...advisoryForm, message: e.target.value })
                }
              />
            </Field>
            <div className="fd-form-actions">
              <button className="fd-primary-button" disabled={!parcels.length}>
                Save advisory record
              </button>
              <button
                type="button"
                className="fd-secondary-button"
                onClick={() => setAdvisoryFormOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <h4 className="fd-subheading">My crop records</h4>
        {crops.length ? (
          <div className="fd-table-wrap">
            <table className="fd-table fd-crop-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Parcel</th>
                  <th>Variety</th>
                  <th>Season</th>
                  <th>Planting date</th>
                  <th>Area</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.crop}</strong>
                      <small>{c.id}</small>
                    </td>
                    <td>{parcelName(c.parcelId)}</td>
                    <td>{c.variety || "Not specified"}</td>
                    <td>{c.season}</td>
                    <td>{c.plantingDate || "Not specified"}</td>
                    <td>{c.area ? `${c.area} ha` : "Not specified"}</td>
                    <td>
                      <Pill>{c.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="fd-empty-state">
            <Wheat />
            <strong>No crop records yet</strong>
            <span>Use “Register a crop” to add crops you are growing.</span>
          </div>
        )}
        <h4 className="fd-subheading">Agricultural advisories</h4>
        {advisories.map((a) => (
          <article className="fd-advisory" key={a.id}>
            <div className="fd-round-icon">
              <PackageCheck />
            </div>
            <div className="fd-grow">
              <div className="fd-advisory-title-row">
                <h4>{a.title}</h4>
                <span className="fd-count">{a.category}</span>
              </div>
              <p>
                {a.crop || "General"} · {parcelName(a.parcelId)} · {a.date}
              </p>
              <small>Provided by: {a.provider || "Not specified"}</small>
              <div className="fd-muted-note">{a.message}</div>
            </div>
          </article>
        ))}
        <div className="fd-notice">
          <AlertCircle size={18} />
          <p>
            Records entered here are local demo records. In the final system,
            the admin or authorized agricultural officer publishes an advisory
            linked to the farmer, parcel, crop and season, and it appears here
            automatically.
          </p>
        </div>
      </section>
    );
  }

  function assistantPage() {
    return (
      <section className="fd-panel fd-chat-panel">
        <div className="fd-panel-heading">
          <div>
            <h3>AgriNova AI Assistant</h3>
            <p>Ask questions about farming and agricultural practices.</p>
          </div>
          <span className="fd-ai-label">
            <Sprout size={15} /> AI prototype
          </span>
        </div>
        <div className="fd-chat-messages">
          {messages.map((m, i) => (
            <div className={`fd-message ${m.role}`} key={i}>
              <span>{m.role === "user" ? "You" : "AgriNova Assistant"}</span>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
        <form className="fd-chat-form" onSubmit={sendQuestion}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your agricultural question..."
          />
          <button type="submit" aria-label="Send question">
            <Send size={18} />
          </button>
        </form>
        <div className="fd-notice">
          <AlertCircle size={18} />
          <p>
            This assistant is not connected to an LLM or RAG system yet. Do not
            rely on its demonstration response for farming decisions.
          </p>
        </div>
      </section>
    );
  }
  function profilePage() {
    return (
      <section className="fd-panel fd-profile-panel">
        <div className="fd-panel-heading">
          <div>
            <h3>My Profile</h3>
            <p>View and update your basic account details.</p>
          </div>
          <UserRound size={28} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setProfileSaved(true);
          }}
        >
          <div className="fd-form-grid">
            <Field label="Full name">
              <input
                value={profile.name}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                  setProfileSaved(false);
                }}
              />
            </Field>
            <Field label="Phone number">
              <input
                value={profile.phone}
                onChange={(e) => {
                  setProfile({ ...profile, phone: e.target.value });
                  setProfileSaved(false);
                }}
              />
            </Field>
            <Field label="Preferred language">
              <select
                value={profile.language}
                onChange={(e) => {
                  setProfile({ ...profile, language: e.target.value });
                  setProfileSaved(false);
                }}
              >
                <option>English</option>
                <option>Kinyarwanda</option>
              </select>
            </Field>
            <Field label="District">
              <input
                value={profile.district}
                onChange={(e) => {
                  setProfile({ ...profile, district: e.target.value });
                  setProfileSaved(false);
                }}
              />
            </Field>
          </div>
          <p className="fd-profile-meta">Member since {profile.memberSince}</p>
          <button className="fd-primary-button">Save changes</button>
          {profileSaved && (
            <span className="fd-saved">
              <CheckCircle2 size={16} /> Changes saved in this demo session
              only.
            </span>
          )}
        </form>
      </section>
    );
  }

  const content = {
    overview,
    parcels: parcelsPage,
    weather: weatherPage,
    recommendations: recommendationsPage,
    advisories: advisoriesPage,
    assistant: assistantPage,
    profile: profilePage,
  }[page]();
  return (
    <div className="farmer-app">
      <aside className={`fd-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="fd-brand">
          <span className="fd-brand-mark">
            <Sprout size={23} />
          </span>
          <Link to="/" className="brand-home-link">
            <div>
              <h2>AgriNova</h2>
              <span>Farmer Portal</span>
            </div>
          </Link>
          <button className="fd-close-menu" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <div className="fd-user-mini">
          <div className="fd-avatar">
            {profile.name
              .split(" ")
              .map((x) => x[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <strong>{profile.name}</strong>
            <small>Farmer account</small>
          </div>
        </div>
        <nav className="fd-navigation" aria-label="Farmer navigation">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="fd-sidebar-bottom">
          <div className="fd-help">
            <CircleHelp size={19} />
            <div>
              <strong>Need help?</strong>
              <small>Contact your local agricultural officer.</small>
            </div>
          </div>
          <button
            className="fd-logout"
            onClick={() =>
              window.alert(
                "Connect this action to the backend logout flow later.",
              )
            }
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="fd-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <main className="fd-main">
        <header className="fd-topbar">
          <button
            className="fd-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div>
            <span className="fd-breadcrumb">Farmer Portal</span>
            <strong>{pageTitle}</strong>
          </div>
          <div className="fd-top-actions">
            <button className="fd-icon-button" title="Notifications">
              <Bell size={19} />
            </button>
            <div className="fd-top-user">
              <div className="fd-avatar small">
                {profile.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span>{profile.name}</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>
        <div className="fd-page-content">{content}</div>
        <footer className="fd-footer">
          © 2026 AgriNova · Innovating Agriculture, Empowering Farmers.
        </footer>
      </main>
    </div>
  );
}
