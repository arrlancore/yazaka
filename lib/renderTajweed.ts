interface TajweedMeta {
  identifier: string;
  type: string;
  description: string;
  default_css_class: string;
  html_color: string;
}

interface TajweedMetaMap {
  [key: number]: TajweedMeta;
}

const TajweedTypes = {
  WASL: 1,
  SILENT: 2,
  LAAM_SHAMSIYAH: 3,
  MADDA_NORMAL: 4,
  MADDA_PERMISSIBLE: 5,
  MADDA_NECESSARY: 17,
  QALAQAH: 6,
  MADDA_OBLIGATORY: 7,
  IKHAFA_SHAFAWI: 8,
  IDGHAM_SHAFAWI: 9,
  IQLAB: 10,
  IDGHAM_GHUNNAH: 11,
  IDGHAM_NO_GHUNNAH: 12,
  IDGHAM_MUTAJANISAYN: 13,
  IDGHAM_MUTAQARIBAYN: 14,
  GHUNNAH: 15,
  IKHAFA: 16,
} as const;

const meta: TajweedMetaMap = {
  [TajweedTypes.WASL]: {
    identifier: "[h",
    type: "hamza-wasl",
    description: "Hamzat ul Wasl",
    default_css_class: "ham_wasl",
    html_color: "#AAAAAA",
  },
  [TajweedTypes.SILENT]: {
    identifier: "[s",
    type: "silent",
    description: "Silent",
    default_css_class: "slnt",
    html_color: "#AAAAAA",
  },
  [TajweedTypes.LAAM_SHAMSIYAH]: {
    identifier: "[l",
    type: "laam-shamsiyah",
    description: "Lam Shamsiyyah",
    default_css_class: "slnt",
    html_color: "#AAAAAA",
  },
  [TajweedTypes.MADDA_NORMAL]: {
    identifier: "[n",
    type: "madda-normal",
    description: "Normal Prolongation: 2 Vowels",
    default_css_class: "madda_normal",
    html_color: "#537FFF",
  },
  [TajweedTypes.MADDA_PERMISSIBLE]: {
    identifier: "[p",
    type: "madda-permissible",
    description: "Permissible Prolongation: 2, 4, 6 Vowels",
    default_css_class: "madda_permissible",
    html_color: "#4050FF",
  },
  [TajweedTypes.MADDA_NECESSARY]: {
    identifier: "[m",
    type: "madda-necesssary",
    description: "Necessary Prolongation: 6 Vowels",
    default_css_class: "madda_necessary",
    html_color: "#000EBC",
  },
  [TajweedTypes.QALAQAH]: {
    identifier: "[q",
    type: "qalaqah",
    description: "Qalaqah",
    default_css_class: "qlq",
    html_color: "#DD0008",
  },
  [TajweedTypes.MADDA_OBLIGATORY]: {
    identifier: "[o",
    type: "madda-obligatory",
    description: "Obligatory Prolongation: 4-5 Vowels",
    default_css_class: "madda_pbligatory",
    html_color: "#2144C1",
  },
  [TajweedTypes.IKHAFA_SHAFAWI]: {
    identifier: "[c",
    type: "ikhafa-shafawi",
    description: "Ikhafa' Shafawi - With Meem",
    default_css_class: "ikhf_shfw",
    html_color: "#D500B7",
  },
  [TajweedTypes.IKHAFA]: {
    identifier: "[f",
    type: "ikhafa",
    description: "Ikhafa'",
    default_css_class: "ikhf",
    html_color: "#9400A8",
  },
  [TajweedTypes.IDGHAM_SHAFAWI]: {
    identifier: "[w",
    type: "idgham-shafawi",
    description: "Idgham Shafawi - With Meem",
    default_css_class: "idghm_shfw",
    html_color: "#58B800",
  },
  [TajweedTypes.IQLAB]: {
    identifier: "[i",
    type: "iqlab",
    description: "Iqlab",
    default_css_class: "iqlb",
    html_color: "#26BFFD",
  },
  [TajweedTypes.IDGHAM_GHUNNAH]: {
    identifier: "[a",
    type: "idgham-with-ghunnah",
    description: "Idgham - With Ghunnah",
    default_css_class: "idgh_ghn",
    html_color: "#169777",
  },
  [TajweedTypes.IDGHAM_NO_GHUNNAH]: {
    identifier: "[u",
    type: "idgham-without-ghunnah",
    description: "Idgham - Without Ghunnah",
    default_css_class: "idgh_w_ghn",
    html_color: "#169200",
  },
  [TajweedTypes.IDGHAM_MUTAJANISAYN]: {
    identifier: "[d",
    type: "idgham-mutajanisayn",
    description: "Idgham - Mutajanisayn",
    default_css_class: "idgh_mus",
    html_color: "#A1A1A1",
  },
  [TajweedTypes.IDGHAM_MUTAQARIBAYN]: {
    identifier: "[b",
    type: "idgham-mutaqaribayn",
    description: "Idgham - Mutaqaribayn",
    default_css_class: "idgh_mus",
    html_color: "#A1A1A1",
  },
  [TajweedTypes.GHUNNAH]: {
    identifier: "[g",
    type: "ghunnah",
    description: "Ghunnah: 2 Vowels",
    default_css_class: "ghn",
    html_color: "#FF7E1E",
  },
};

const createTajweedParser = () => {
  const parseTajweed = (text: string): string => {
    // First handle markers with IDs
    text = text.replace(/\[([a-z]):(\d+)\[/gi, (match, type, id) => {
      const metaItem = Object.values(meta).find(
        (m) => m.identifier === `[${type}`
      );
      if (!metaItem) return match;
      return `<tajweed class="${metaItem.default_css_class}" data-type="${metaItem.type}" data-description="${metaItem.description}" data-tajweed=":${id}">`;
    });

    // Then handle regular markers
    Object.values(meta).forEach((meta) => {
      const pattern = new RegExp(`\\[${meta.identifier.slice(1)}\\[`, "g");
      text = text.replace(
        pattern,
        `<tajweed class="${meta.default_css_class}" data-type="${meta.type}" data-description="${meta.description}" data-tajweed="">`
      );
    });
    return text;
  };

  const closeParsing = (text: string): string => {
    return text.replace(/\[/g, '">').replace(/\]/g, "</tajweed>");
  };

  const webkitFix = (text: string): string => {
    // After
    text = text.replace(/(<\/tajweed>)(\S)/g, "&zwj;$1$2");

    // Before
    text = text.replace(
      /(\S)<tajweed class="(.*?)" data-type="(.*?)" data-description="(.*?)" data-tajweed="(.*?)">(\S)/g,
      '$1<tajweed class="$2" data-type="$3" data-description="$4" data-tajweed="$5">&zwj;&zwj;$6'
    );

    // Let's remove all joiners where not needed for an Alif and a Waw
    text = text.replace(/ٱ&zwj;/g, "ٱ");
    text = text.replace(/و&zwj;/g, "و");

    return text;
  };

  return (text: string, fixWebkit: boolean = false): string => {
    if (fixWebkit) {
      return webkitFix(closeParsing(parseTajweed(text)));
    }
    return closeParsing(parseTajweed(text));
  };
};

export const renderTajweed = createTajweedParser();
