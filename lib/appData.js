export const people = [
  { id: "denzel", name: "Denzel", role: "admin", initials: "DN", color: "from-sky-400 to-blue-600" },
  { id: "talicia", name: "Talicia", role: "admin", initials: "TA", color: "from-violet-400 to-fuchsia-600" },
  { id: "jess", name: "Jess", role: "member", initials: "JE", color: "from-emerald-400 to-teal-600" },
  { id: "gabby", name: "Gabby", role: "member", initials: "GA", color: "from-orange-400 to-rose-600" },
  { id: "sophie", name: "Sophie", role: "member", initials: "SO", color: "from-pink-400 to-red-600" },
];

export const videoStatuses = ["Needs recording", "Needs upload", "Uploaded", "Needs edit", "Ready to post", "Posted", "Optional"];
export const serviceStatuses = ["Planned", "In progress", "Ready for upload", "Editing", "Posted", "Archived"];

export const serviceTemplates = [
  {
    id: "sunday-am",
    name: "Sunday Morning",
    shortName: "Sunday AM",
    day: "Sunday",
    time: "10:00 AM",
    description: "Main morning service: ministry photos, sermon recap capture, and church-life interactive content.",
    folders: ["01 Service Info", "02 Raw Video", "03 Photos", "04 Sermon Recap", "05 Social Clips", "06 Graphics", "07 Captions", "08 Final Exports", "09 Posted"],
    suggestedVideos: [
      { title: "Sermon recap", category: "Sermon Highlight", status: "Needs recording", assignedTo: "Denzel" },
      { title: "Church-life interactive content", category: "Public Interaction", status: "Needs recording", assignedTo: "Jess" },
      { title: "Other ministries photos", category: "Ministry Promotion", status: "Needs upload", assignedTo: "Gabby" },
    ],
    checklist: ["Create the service before service starts", "Check batteries, SD cards, and lenses", "Capture lobby and church-family moments", "Capture worship wide and close shots", "Mark at least three sermon quote moments", "Capture other ministry photos when available", "Upload raw video and photos", "Move best clips into the video tracker"],
  },
  {
    id: "sunday-pm",
    name: "Sunday Evening",
    shortName: "Sunday PM",
    day: "Sunday",
    time: "6:00 PM",
    description: "Evening service focused on worship recaps, specials, and unique moments.",
    folders: ["01 Service Info", "02 Raw Worship Video", "03 Specials", "04 Worship Recap", "05 Social Clips", "06 Final Exports", "07 Posted"],
    suggestedVideos: [
      { title: "Worship recap", category: "Worship Highlight", status: "Needs recording", assignedTo: "Talicia" },
      { title: "Special song / unique moment", category: "Special Highlight", status: "Needs review", assignedTo: "Sophie" },
    ],
    checklist: ["Create the service folder before service", "Record worship and specials", "Capture clean close-ups without distracting movement", "Identify the strongest worship moment", "Upload raw files", "Prepare the 8 PM worship recap when possible"],
  },
  {
    id: "wednesday",
    name: "Wednesday Night",
    shortName: "Wednesday",
    day: "Wednesday",
    time: "7:00 PM",
    description: "Midweek service, invite post, photos, and altar/response moments when appropriate.",
    folders: ["01 Service Info", "02 Photos", "03 Short Clips", "04 Altar Response", "05 Invite Post", "06 Final Exports", "07 Posted"],
    suggestedVideos: [
      { title: "Come to church tonight", category: "Service Promotion", status: "Ready to post", assignedTo: "Denzel" },
      { title: "Wednesday service pictures", category: "Highlights", status: "Needs upload", assignedTo: "Gabby" },
      { title: "Altar / response moment", category: "Altar Call Highlight", status: "Optional", assignedTo: "Jess" },
    ],
    checklist: ["Post Wednesday invite at 11:30 AM", "Create the service folder", "Take service pictures unless told otherwise", "Capture short video moments if appropriate", "Upload photos after service", "Mark best photos and clips"],
  },
  {
    id: "custom",
    name: "Custom Service / Event",
    shortName: "Custom",
    day: "Custom",
    time: "Custom",
    description: "Special service, ministry night, outreach, guest speaker, or custom media project.",
    folders: ["01 Planning", "02 Raw Video", "03 Photos", "04 Interviews", "05 Graphics", "06 Edits", "07 Final Exports", "08 Posted"],
    suggestedVideos: [
      { title: "Event recap", category: "Event Promotion", status: "Needs recording", assignedTo: "Denzel" },
      { title: "Highlight clip", category: "Special Highlight", status: "Needs review", assignedTo: "Talicia" },
    ],
    checklist: ["Define the purpose", "Create folder structure", "Assign capture responsibilities", "Capture photos and video", "Upload files", "Mark what needs editing", "Prepare exports and post"],
  },
];

export const contentCategories = [
  { id: "highlights", title: "Highlights", description: "Clips or visuals from services and special moments.", types: ["Worship Highlight", "Special Highlight", "Sermon Highlight", "Altar Call Highlight"] },
  { id: "promotional", title: "Promotional", description: "Posts that invite people, promote ministries, and bring awareness to upcoming events.", types: ["Service Promotion", "Ministry Promotion", "Event Promotion"] },
  { id: "engagement", title: "Engagement", description: "Posts designed to connect with people and highlight the church community.", types: ["Public Interaction", "Testimonial", "Appreciation"] },
];

export const weeklyPosts = [
  { id: "sun-1230", day: "Sunday", time: "12:30 PM", title: "Regular post", type: "Regular", status: "Recurring" },
  { id: "sun-8pm", day: "Sunday", time: "8:00 PM", title: "Worship recap", type: "Worship Highlight", status: "Needs footage" },
  { id: "mon-8pm", day: "Monday", time: "8:00 PM", title: "Sermon recap", type: "Sermon Highlight", status: "Needs edit" },
  { id: "tue-1130", day: "Every other Tuesday", time: "11:30 AM", title: "Engaging post", type: "Engagement", status: "Idea needed" },
  { id: "tue-8pm", day: "Every other Tuesday", time: "8:00 PM", title: "Sermon recap", type: "Sermon Highlight", status: "Optional" },
  { id: "wed-1130", day: "Wednesday", time: "11:30 AM", title: "Come to church tonight", type: "Service Promotion", status: "Recurring" },
  { id: "sat-1130", day: "Saturday", time: "11:30 AM", title: "Come to church tonight", type: "Service Promotion", status: "Recurring" },
];

export const initialData = {
  services: [],
  videos: [],
  activity: [],
  templates: serviceTemplates,
  people,
  weeklyPosts,
  contentCategories,
  gear: [
    { id: "main-camera", name: "Main Camera", category: "Camera", status: "Ready", location: "Media booth", settings: [{ label: "Resolution", value: "4K" }, { label: "Frame Rate", value: "24fps" }, { label: "Shutter", value: "1/50" }, { label: "White Balance", value: "Set on location" }], notes: "Use for sermon, worship, and clean general capture." },
    { id: "recap-camera", name: "Motion / Recap Camera", category: "Camera", status: "Check battery", location: "Media cabinet", settings: [{ label: "Resolution", value: "4K" }, { label: "Frame Rate", value: "60fps" }, { label: "Shutter", value: "1/125" }, { label: "Use", value: "Worship movement and short-form b-roll" }], notes: "Use when the edit needs smoother motion." },
    { id: "livestream-system", name: "Livestream System", category: "Broadcast", status: "Ready", location: "Media booth", settings: [{ label: "Resolution", value: "1080p" }, { label: "Audio", value: "Board feed" }, { label: "Check", value: "10 minutes before service" }, { label: "Platforms", value: "YouTube / Facebook" }], notes: "Confirm audio and stream health before service starts." },
  ],
  access: [
    { id: "instagram", name: "Instagram", category: "Social", username: "Add username", password: "Add password", notes: "Reels, stories, reminders, recaps." },
    { id: "facebook", name: "Facebook", category: "Social", username: "Add username", password: "Add password", notes: "Posts and livestream/archive support." },
    { id: "youtube", name: "YouTube", category: "Video", username: "Add username", password: "Add password", notes: "Livestream, archives, shorts, teaching content." },
  ],
};
