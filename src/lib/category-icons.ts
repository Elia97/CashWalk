type IconGroup = {
  label: string;
  icons: string[];
};

export const categoryIconGroups: Record<string, IconGroup> = {
  food: {
    label: "Cibo",
    icons: ["🍕", "🍔", "🍜", "☕", "🍺", "🍷", "🥘", "🍱", "🧃", "🍰"],
  },
  shopping: {
    label: "Shopping",
    icons: ["🛒", "🛍️", "👕", "👗", "👠", "👟", "🧥", "👔", "💄", "💍"],
  },
  home: {
    label: "Casa",
    icons: ["🏠", "🔑", "💡", "⚡", "💧", "🔥", "📺", "🛋️", "🛏️", "🚿"],
  },
  transport: {
    label: "Trasporti",
    icons: ["🚗", "🚕", "🚌", "🚇", "✈️", "🚲", "🛵", "⛽", "🅿️", "🚦"],
  },
  health: {
    label: "Salute",
    icons: ["💊", "🏥", "💉", "🩺", "😷", "🧘", "💆", "💇", "🧖", "🏋️"],
  },
  entertainment: {
    label: "Svago",
    icons: ["🎮", "🎬", "🎵", "🎸", "🎯", "🎲", "🎪", "🎨", "📚", "🎭"],
  },
  sports: {
    label: "Sport",
    icons: ["⚽", "🏀", "🎾", "🏐", "🏊", "🚴", "⛷️", "🏃", "🤸", "🧗"],
  },
  tech: {
    label: "Tech",
    icons: ["💻", "📱", "⌚", "🖥️", "⌨️", "🖱️", "🎧", "📷", "🎥", "🔌"],
  },
  work: {
    label: "Lavoro",
    icons: ["💼", "🎓", "📖", "✏️", "📝", "🖊️", "📊", "📈", "🗂️", "📅"],
  },
  finance: {
    label: "Finanze",
    icons: ["💰", "💳", "💵", "💸", "🏦", "📉", "💹", "🪙", "💴", "💶"],
  },
  travel: {
    label: "Viaggi",
    icons: ["🏖️", "🗺️", "🧳", "🎒", "⛺", "🏕️", "🏔️", "🗼", "🏰", "🎡"],
  },
  pets: {
    label: "Animali",
    icons: ["🐕", "🐈", "🐠", "🐦", "🐹", "🐰", "🦎", "🐢", "🦜", "🐩"],
  },
  gifts: {
    label: "Regali",
    icons: ["🎁", "🎂", "🎈", "🎉", "💐", "🌹", "🎀", "🏆", "🥇", "⭐"],
  },
  services: {
    label: "Servizi",
    icons: ["🔧", "🔨", "🪛", "🧹", "🧺", "🧼", "🪥", "🧴", "✂️", "🪒"],
  },
  other: {
    label: "Altro",
    icons: ["📦", "📮", "📞", "📧", "🎫", "🎟️", "🔔", "⏰", "🌟", "❓"],
  },
};

// Crea il gruppo "Tutte" con tutte le icone
const allIcons = Object.values(categoryIconGroups).flatMap(
  (group) => group.icons,
);

categoryIconGroups.all = {
  label: "Tutte",
  icons: allIcons,
};

export const categoryIcons = allIcons;
export type IconGroupKey = keyof typeof categoryIconGroups;
