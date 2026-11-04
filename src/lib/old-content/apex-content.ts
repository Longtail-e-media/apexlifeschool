/**
 * Content extracted from the existing Apex Life School site (apexlifeschool.edu.np).
 * Images live in /public/apex/** — see /public/apex/manifest.json for each file's source URL.
 * Replace with CMS data once the API is wired up.
 */
import albums from "../apex-gallery.json";

export const brand = {
  logo: "/apex/brand/logo.png", // 190x85 PNG — maroon "APEX" + green "Life School", "Since 1983"
  hero: "/apex/brand/heroImage.jpeg", // 2000px photo: students running in front of the school bus
  director: "/apex/brand/director.png", // chairperson portrait (543x336)
};

export const about = {
  summary:
    "Apex Life School began in 2040 BS as Sishu Nitekan School, and has grown with Kathmandu for more than four decades. Through all that time one belief has stayed the same: children learn best when they feel known, encouraged and free to try. Today our classrooms, labs, library and playgrounds work together to build knowledge, character and confidence.",
  mission:
    "To help every child grow into a confident learner and a kind, responsible citizen — through good teaching, hands-on experience and a school community that genuinely cares.",
  vision:
    "A school families trust for its warmth as much as its standards, where students become curious, capable and compassionate people, ready for whatever comes next.",
  videos: ["/apex/video/ilVOIoi.mp4", "/apex/video/xTqwM8R.mp4"], // hero loop + about video
  recognitions: [
    "/apex/gallery/iuKycRXvAWcqXBTN-1765264138.jpg",
    "/apex/gallery/IK6oY2LQNCUh5Hww-1741581341.png",
    "/apex/gallery/6rff4reHlxv37wsc-1741581341.jpeg",
  ],
};

/** Milestones. Only facts taken from the school's own materials; add dated entries as the school confirms them. */
export const history = [
  { year: "2040 BS", title: "Our first bell", text: "The school opens as Sishu Nitekan School in Chabahil, Kathmandu." },
  { year: "", title: "Growing with Kathmandu", text: "Over the following decades the school adds classes, laboratories and a library, and stays closely connected to the families it serves." },
  { year: "", title: "Joining the Apex College family", text: "Sishu Nitekan School becomes Apex Life School, part of Apex College's schooling system." },
  { year: "2019–22", title: "International School Award", text: "The school receives the British Council's International School Award for its global learning work." },
  { year: "2025", title: "Nepal Education Awards UK", text: "Apex Life School is recognised at the Nepal Education Awards UK 2025." },
];

export const messages = {
  chairperson: {
    name: "Subas Neupane",
    role: "Chairperson, Apex Life School",
    photo: "/apex/brand/director.png",
    paragraphs: [
      "For more than four decades, Apex Life School has stood as a pillar of educational excellence, dedicated to shaping young minds and preparing them for the challenges and opportunities of a dynamic world. Our journey has been marked by a steadfast commitment to innovation, resilience, and the belief that education is the most powerful tool for personal and societal transformation.",
      "At the heart of our mission is the goal to create a learning environment where students are encouraged to explore their passions, develop critical thinking skills, and grow into compassionate, ethical leaders. We achieve this by combining academic excellence with holistic development, ensuring that every child receives the guidance and support they need to reach their full potential.",
      "Our efforts extend beyond the walls of our school. Through initiatives like our Community Engagement Program, we work to uplift local schools and communities by sharing resources, expertise, and best practices. Our Scholarship Fund provides opportunities for talented students from diverse backgrounds to access quality education, while our Professional Development Workshops empower educators across the region with innovative teaching strategies and tools.",
      "Apex Life School is more than an institution—it is a community of learners, educators, and families united by a shared vision of a brighter future. We believe that by nurturing curiosity, creativity, and character in our students, we are not only transforming individual lives but also contributing to the progress of our nation and the world.",
    ],
  },
  principal: {
    name: "Pradyumna Paudel",
    role: "Principal, Apex Life School",
    photo: "/apex/brand/principal.png",
    paragraphs: [
      "Welcome to Apex Life School! We are delighted to have you here, exploring what makes Apex Life School a special place for learning, growth, and discovery. Whether you’re visiting us online or stepping onto our campus, we hope you’ll feel the warmth, energy, and passion that define our community.",
      "Since our founding in 2040 BS, Apex Life School has been dedicated to providing an education that goes beyond the ordinary. We believe in nurturing not just academic excellence but also the creativity, character, and curiosity that help students thrive in an ever-changing world. Our approach is hands-on, interdisciplinary, and deeply personalized, ensuring that every child feels valued, supported, and inspired to reach their full potential.",
      "What sets us apart is our dedicated team of educators, who are not just teachers but mentors and lifelong learners. Through continuous professional development, they bring the latest teaching methodologies and a passion for nurturing young minds. Together, we create a warm, inclusive, and inspiring school culture where every student feels empowered to grow and succeed.",
      "We are more than a school—we are a community. A community where students, parents, and educators come together to celebrate learning, foster creativity, and build lasting connections. Our well-rounded curriculum and state-of-the-art facilities provide the perfect foundation for students to develop into confident, ethical, and globally aware individuals.",
      "If you’re looking for a school that values academic excellence, holistic development, and a joyful learning experience, you’ve come to the right place. At Apex Life School, we don’t just prepare students for exams—we prepare them for life.",
      "We invite you to join us on this incredible journey. Come, be part of a community where every child’s potential is limitless, and every dream is within reach.",
    ],
  },
};

export const facilities = [
  { title: "Sports grounds", image: "/apex/facilities/hPtnYW14h2yUFUsK-1741319809.jpg", text: "Open grounds and courts for football, basketball and cricket give children room to run, compete and learn teamwork. Regular sport keeps them fit, and teaches them to win and lose graciously." },
  { title: "Science lab", image: "/apex/facilities/edOGMWf6TD1venFO-1741318671.jpg", text: "In our science lab children handle real instruments and run real experiments. Watching an idea work in front of them turns “why?” into “now I get it.”" },
  { title: "Digital library", image: "/apex/facilities/MyOifdSGEiFzHs4r-1741318638.jpg", text: "Students can read e-books, journals and research material whenever they need them. It builds the habit of looking things up, asking questions and thinking for themselves." },
  { title: "Safe school transport", image: "/apex/facilities/Y1WSCBKBol1tPUzb-1741318263.jpg", text: "Every school bus is tracked by GPRS, so the school can follow each vehicle in real time. It means safer, more reliable journeys and real peace of mind for families." },
  { title: "Dining hall", image: "/apex/facilities/ifMQTlOval9Nn3IR-1741318304.jpg", text: "A clean, bright hall where children share balanced meals and a proper break in the day. Meals are planned with different dietary needs in mind, so everyone stays energised." },
  { title: "Infirmary", image: "/apex/facilities/Jgdj50umpGK6UBtF-1741318577.jpg", text: "Our infirmary is equipped for everyday health needs and staffed by qualified medical professionals, so a scraped knee or a sudden fever gets attention straight away." },
];

export const activities = [
  { title: "Sports & fitness (ECA)", image: "/apex/facilities/UUa1Dl56Wt02d8Hk-1740040100.jpg", text: "Extra-curricular classes are part of the school week, not an afterthought. They are a chance to move, compete, make friends and have fun.", items: ["Basketball", "Football", "Table Tennis", "Taekwondo", "Cricket", "Modern Dance", "Classical Dance"] },
  { title: "Music, art & drama (CRE)", image: "/apex/facilities/BLDM8cRT1x6t2ovT-1740040047.jpg", text: "Creative expression classes give every child a way to be heard, through sound, colour, craft and the stage.", items: ["Vocal Music", "Violin", "Guitar", "Keyboard", "Leather instruments", "Theatre", "Art", "Craft"] },
  // The source site's image for this item is a plain gold texture (/apex/facilities/mtn6D6s5QRX4p9iB-1740039907.jpg), so the UI uses an icon tile instead.
  { title: "Yoga, meditation & scouts", image: null as string | null, text: "Yoga and meditation help children stay calm through long study days, while scouts builds character, discipline and teamwork.", items: [] as string[] },
];

/** "School at a glance" (`icon` = Font Awesome class). The old site animates numbers up from 0; three counts aren't in the static HTML. */
export const glance = [
  { value: "40+", label: "Years of schooling", icon: "fa-calendar-check" },
  { value: "1:9", label: "Teacher–student ratio", icon: "fa-chalkboard-user" },
  { value: null as string | null, label: "ICA & CRE clubs to join", icon: "fa-people-group" },
  { value: null as string | null, label: "Languages of instruction", icon: "fa-language" },
  { value: null as string | null, label: "International recognitions", icon: "fa-award" },
];

/** "Life at Apex" — video-style testimonials (poster + animated gif). Quotes are not published as text. */
export const lifeAtApex = [
  { name: "Grishma Uprety", role: "Student", poster: "/apex/life/bPbBYBCLeBBoTAZn-1741941190.png", gif: "/apex/life/yNetaWKgbt9TSJ9g-1741941190.gif", url: "https://www.youtube.com/watch?v=-ng1juz86Hg&t=2s" },
  { name: "Rickzen Sherpa", role: "Student", poster: "/apex/life/UQalqqSX1Z0QvpPr-1741941136.png", gif: "/apex/life/wOEwONRu1VSOPMkx-1741941136.gif", url: "https://www.youtube.com/watch?v=hLweiIruk2o" },
  { name: "Aamir Shrestha", role: "Parent", poster: "/apex/life/GkEM1DsIPb12VX06-1741691837.png", gif: "/apex/life/pS7UpJ8r9oaj6zBL-1741691837.gif", url: "https://www.youtube.com/watch?v=UYkIebbSS6U" },
];

export const news = [
  {
    id: 3479,
    slug: "admission-open-2083",
    date: "2026-02-17",
    title: "Admissions are open for 2083",
    excerpt: "Send your child’s details through the admission form to begin.",
    image: "/apex/news/EsObJZx2Gkq6Myk1-1771325135.jpg",
    link: "https://www.ingrails.com/school/admission/form/apex-life-school",
  },
  {
    id: 3296,
    slug: "see-pre-qualifying",
    date: "2025-12-09",
    title: "SEE Pre-Qualifying",
    excerpt: "SEE Boost-Up exam 2082: the schedule, admit cards and exam-day guidelines for parents.",
    pdf: "/apex/news/pB7Wf4pKLCNADwRk-1765275024.pdf",
    body: [
      "Dear Parents/Guardians,",
      "This is to notify that the SEE Boost Up exam 2082 will be held from 2082-08-25 (Thursday) to 2082-09-03 (Thursday).",
      "Please clear all the due fees and collect Exam Admit Card from the Account Section by 4:00 PM tomorrow.",
      "Routine (all at 7:00 AM): 2082-08-25 Com. English · 08-26 Com. Nepali · 08-28 Com. Mathematics · 08-29 Com. Science · 09-01 Com. Social Studies · 09-02 Optional I · 09-03 Optional II.",
      "Exam center: will be notified to the children by tomorrow.",
      "Students should be dropped by parents at school premises by 6:45 AM every day as the exam will start at 7:00 AM.",
      "Special remedial classes for next day's exam will be conducted at school throughout the day after lunch.",
      "Students will depart from school at usual time i.e. 4:05 PM.",
      "It is mandatory to wear school formal dress i.e. shirt, pant/frock, sweater, and blazer throughout the exam period.",
    ],
  },
  {
    id: 3294,
    slug: "annual-education-tour-2082",
    date: "2025-12-09",
    title: "Annual Education Tour 2082",
    excerpt: "Students from Grade IV to X took lessons outdoors on this year’s learning trip.",
    image: "/apex/news/zV4oGglkAEHv31OX-1765263472.jpg",
    body: [
      "Annual Outdoor Learning Trip 2082",
      "This year, students from Grade IV to X took their lessons outdoors, connecting what they learn in class with the world around them.",
      "Here are a few moments from the trip.",
    ],
  },
];

export const notice = [
  {
    date: "2025-12-09",
    title: "Outdoor Learning Trip – IT and Science Exhibition at Texas College",
    text: "Dear Students, This is to inform you that from tomorrow, all students will be participating in an outdoor learning trip to Texas College for an IT and Science Exhibition exploration. Students are requested to attend and make the most of this valuable learning opportunity.",
  },
];

/** Gallery albums that still have working images on the source site (two ingrails.com albums are dead there). */
export const galleryAlbums: { id: string; title: string; cover: string | null; images: string[] }[] = albums;

/** Photos from the home "Beyond the classroom" strip. */
export const beyondClassroom = [
  "/apex/gallery/PPMhHLL1MK1NxDUs-1741321393.jpg",
  "/apex/gallery/rrRgBbi8PpX2qcls-1741321378.jpg",
  "/apex/gallery/WGJA5Htt6rURUhiK-1741321368.jpg",
  "/apex/gallery/NyPSpPjAgcgK69QP-1741321368.jpg",
  "/apex/gallery/LW7XCyqbFZJqGjaM-1740042349.jpg",
  "/apex/gallery/DnL0ykGz7DoMHhcD-1740042349.jpg",
  "/apex/gallery/228EmAVgVobtrB3e-1740042349.jpg",
  "/apex/gallery/CvbZjooUICU2YLoE-1740042349.jpg",
  "/apex/gallery/RpVmr9rfLlaS88nF-1740042349.jpg",
  "/apex/gallery/JmwL5TxGTtw6KU7N-1740042349.jpg",
];

export const links = {
  /**
   * Where every "Apply" button goes. Currently the vendor-hosted form.
   * To switch to the on-site form (built at /admission-form), set this to "/admission-form" and remove
   * `robots: { index: false }` there.
   */
  admissionForm: "https://www.ingrails.com/school/admission/form/apex-life-school",
  eDigitalApply: "https://edigitalnepal.com/g/apply/apex",
  prospectus: "/apex/docs/RHQSn1dsToQ7Br78-1742204737.pdf",
  playStore: "https://play.google.com/store/apps/details?id=com.edigitalnepal.apex&hl=en",
  appStore: "https://apps.apple.com/us/app/apex-life-school/id1614213522",
  facebook: "https://www.facebook.com/als1983/",
  youtube: "https://www.youtube.com/@ApexLifeSchool",
  x: "https://x.com/Apexlife2018",
  playStoreBadge: "/apex/icons/DrsFWXwDQco5x3oK-1741064037.png",
  appStoreBadge: "/apex/icons/TbM1IW2BQxGdpWys-1741064037.png",
  appPromo: "/apex/gallery/SBWs5uKVfbPvpr6l-1742188770.png",
  // QR codes (1000x1000) for desktop visitors to scan with their phone — please scan-test after deploying.
  playStoreQr: "/apex/icons/googleplay.png",
  appStoreQr: "/apex/icons/applestore.png",
};

/**
 * Where the school is, decoded from its own Plus Code (P9G4+M7 Kathmandu), accurate to about 15 m.
 * `nearby` distances are straight-line from this point, measured from OpenStreetMap positions
 * (rounded; road distance is longer).
 */
export const coordinates = { lat: 27.72663, lng: 85.3556348 };

export const nearby: {
  name: string;
  distance: string;
  icon: string;
  lat: number;
  lng: number;
  /** Route mode on the map: walking for the short hops, driving for the rest. */
  mode: "walking" | "driving";
}[] = [
  { name: "Saraswati Mandir", distance: "≈ 100 m", icon: "fa-gopuram", lat: 27.72701, lng: 85.3549, mode: "walking" },
  { name: "Bhrikuti Chowk, Kapan (bus stop)", distance: "≈ 150 m", icon: "fa-bus", lat: 27.72737, lng: 85.35694, mode: "walking" },
  { name: "Mahankal Temple", distance: "≈ 300 m", icon: "fa-gopuram", lat: 27.72544, lng: 85.3583, mode: "walking" },
  { name: "Kapan Hospital", distance: "≈ 0.8 km", icon: "fa-hospital", lat: 27.73364, lng: 85.35226, mode: "walking" },
  { name: "Boudhanath Stupa", distance: "≈ 0.9 km", icon: "fa-vihara", lat: 27.72144, lng: 85.36204, mode: "walking" },
  { name: "Chabahil Stupa", distance: "≈ 1.5 km", icon: "fa-vihara", lat: 27.71587, lng: 85.34588, mode: "driving" },
  { name: "Pashupatinath Temple", distance: "≈ 1.9 km", icon: "fa-gopuram", lat: 27.71046, lng: 85.34867, mode: "driving" },
  { name: "Tribhuvan International Airport", distance: "≈ 3.7 km", icon: "fa-plane-departure", lat: 27.69389, lng: 85.35823, mode: "driving" },
];

export const contact = {
  address: "KMC-06, Saraswotinagar, Chabahil, Kathmandu",
  plusCode: "P9G4+M7 Kathmandu",
  phones: ["+977-01-4812920", "+977-01-4821723"],
  email: "info@apexlifeschool.edu.np",
  hours: "Sun – Fri: 8:15 AM – 4:30 PM, Saturday: Closed",
};

/**
 * Fallback hero slides, same item shape as the `slideshow` API
 * (`[{ items: [{ mediaType, src, video, tag, title, description, buttonLink }] }]`).
 * Images only: if an item with a video is ever supplied, the hero shows that video alone.
 */
export const heroSlides = [
  {
    id: "students",
    mediaType: "image",
    src: brand.hero,
    tag: "Admissions open 2083",
    title: "Happy to be at Apex",
    description: "Students in the school yard in front of the school bus.",
    buttonLink: links.admissionForm,
  },
  {
    id: "school",
    mediaType: "image",
    src: beyondClassroom[2],
    tag: "Our school",
    title: "Our school in Chabahil",
    description: "Classrooms, labs and grounds, all in one place.",
    buttonLink: "/facilities",
  },
  {
    id: "play",
    mediaType: "image",
    src: beyondClassroom[0],
    tag: "School life",
    title: "Time to play",
    description: "Young learners enjoying the school grounds.",
  },
];

/** Events — add items here (or from the `events` API). */
export const events: { title: string; date: string; text: string }[] = [];
